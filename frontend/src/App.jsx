import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the root endpoint of your Spring Boot Backend API
const API_BASE = "http://localhost:8080/api/v1";

axios.interceptors.request.use(
  (config) => {
    // Retreive token saved in localStorage during authentication login step
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function App() {
  // Navigation & UI State Panel
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // LIVE System Data States (Initialized empty, waiting for MySQL payloads)
  const [dashboardMetrics, setDashboardMetrics] = useState({ totalEmissions: 0, reductionCurve: 0, rating: "Loading..." });
  const [historicalLogs, setHistoricalLogs] = useState([]);
  const [calcResult, setCalcResult] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userXp, setUserXp] = useState(0);
  const [badges, setBadges] = useState([]);

  // ==========================================
  // 🛰️ LIVE NETWORK INVOCATIONS (FETCH FROM MYSQL)
  // ==========================================
  useEffect(() => {
    // 1. Fetch live metrics and historical graph logs
    axios.get(`${API_BASE}/carbon/metrics`)
      .then(res => {
        setDashboardMetrics(res.data.summary);
        setHistoricalLogs(res.data.logs);
      })
      .catch(err => console.error("Error connecting to Spring Boot Database metrics:", err));

    // 2. Fetch live challenges seeded from gamification.sql
    axios.get(`${API_BASE}/gamification/challenges`)
      .then(res => setChallenges(res.data))
      .catch(err => console.error("Error pulling database challenges:", err));

    // 3. Fetch current user profiles rankings and milestones
    axios.get(`${API_BASE}/gamification/user/profile`)
      .then(res => {
        setUserXp(res.data.xpBalance);
        setBadges(res.data.unlockedBadges);
      })
      .catch(err => console.error("Error mapping profiles user states:", err));

    // 4. Fetch the real-time leaderboard index
    axios.get(`${API_BASE}/gamification/leaderboard`)
      .then(res => setLeaderboard(res.data))
      .catch(err => console.error("Error reading live rankings:", err));
  }, [currentPage]); // Re-fetch dependencies smoothly whenever user flips tabs

  // ==========================================
  // ⚡ LIVE CALCULATOR TRANSACTION COMMITMENT
  // ==========================================
  const runAudit = async (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setCalcResult(null);

    const formData = new FormData(e.target);
    const payload = {
      transportType: formData.get('transport'),
      distanceKm: parseFloat(formData.get('distance')),
      electricityKwh: parseFloat(formData.get('gridDraw')),
      dietProfile: formData.get('nutrition')
    };

    try {
      // Post metrics to Spring Boot -> routes to Python AI -> writes to MySQL Workbench
      const response = await axios.post(`${API_BASE}/carbon/calculate`, payload);
      setCalcResult(response.data);
    } catch (error) {
      console.error("Pipeline breakdown tracking calculation data:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  // ==========================================
  // 🏆 LIVE CHALLENGE ACTION COMMITMENT
  // ==========================================
  const completeChallenge = async (challengeId) => {
    try {
      const response = await axios.post(`${API_BASE}/gamification/challenges/complete/${challengeId}`);
      setUserXp(response.data.newXpBalance);
      alert("Challenge confirmed! Points written permanently to MySQL.");
    } catch (error) {
      console.error("Could not register completed milestone task:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-eco-200">
      
      {/* NAVIGATION LAYER */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-eco-500 to-emerald-700 flex items-center justify-center text-white text-xs">🍃</div>
            <span className="font-semibold text-lg tracking-tight text-apple-dark">EcoTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-600">
            {['home', 'dashboard', 'calculator', 'challenge'].map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`capitalize ${currentPage === page ? 'text-eco-600 font-semibold' : ''}`}>{page}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* CORE SYSTEM CONTAINER VIEWPORTS */}
      <main className="flex-grow pt-24 pb-16 px-6 max-w-6xl w-full mx-auto animate-fade-up">
        
        {/* HOME SCREEN HERO */}
        {currentPage === 'home' && (
          <div className="space-y-16 py-6 text-center max-w-2xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-black text-apple-dark tracking-tight">Track simply.<br/>Live consciously.</h1>
            <p className="text-slate-500">A connected clean architecture node mapping system metrics automatically between local service daemons.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setCurrentPage('calculator')} className="bg-apple-dark text-white px-8 py-3.5 rounded-full hover:bg-black font-medium text-sm">Open Audit Engine</button>
              <button onClick={() => setCurrentPage('dashboard')} className="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-medium text-sm">View Analytics</button>
            </div>
          </div>
        )}

        {/* LIVE ANALYTICS VIEW */}
        {currentPage === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-apple-dark tracking-tight">Environmental Dashboard</h2>
              <p className="text-slate-500">Dynamic system performance values drawn straight from local storage tables.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-400">Total Mass Emission</div>
                <div className="text-3xl font-black mt-2 font-mono text-apple-dark">{dashboardMetrics.totalEmissions} <span className="text-sm font-sans font-medium text-slate-500">kg CO₂</span></div>
              </div>
              <div className="glass-panel p-6 rounded-2xl shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-400">Reduction Curve</div>
                <div className="text-3xl font-black mt-2 font-mono text-emerald-600">{dashboardMetrics.reductionCurve}%</div>
              </div>
              <div className="glass-panel p-6 rounded-2xl shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-400">Eco Score Rating</div>
                <div className="text-3xl font-black mt-2 text-eco-600">{dashboardMetrics.rating}</div>
              </div>
            </div>

            {/* DYNAMIC HISTORICAL DATA GRAPH LOGS BLOCK */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider">Historical Log Registry</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase">
                      <th className="py-2">Log ID</th>
                      <th>Transit Mode</th>
                      <th>Output Mass</th>
                      <th>Timestamp Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalLogs.length === 0 ? (
                      <tr><td colSpan="4" className="py-4 text-center text-slate-400">No calculation records tracked inside MySQL Workbench yet.</td></tr>
                    ) : (
                      historicalLogs.map((log) => (
                        <tr key={log.id} className="border-b border-slate-50">
                          <td className="py-3 font-mono">#00{log.id}</td>
                          <td>{log.transportType}</td>
                          <td className="font-mono font-bold text-apple-dark">{log.emissionsKg} kg</td>
                          <td className="text-xs text-slate-400">{log.recordedAt}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* LIVE CALCULATOR HUB */}
        {currentPage === 'calculator' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-up">
            <div>
              <h2 className="text-3xl font-black text-apple-dark tracking-tight">Carbon Audit Engine</h2>
              <p className="text-slate-500">Data loops route automatically downstream to process intelligence recommendations.</p>
            </div>

            <form onSubmit={runAudit} className="glass-panel p-8 rounded-3xl space-y-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Transport Allocation</label>
                  <select name="transport" className="w-full bg-slate-100/50 p-3.5 rounded-xl text-sm font-medium outline-none">
                    <option value="Electric Vehicle">Electric Vehicle</option>
                    <option value="ICE Combustion Car">ICE Combustion Car</option>
                    <option value="Public Transport Network">Public Transport Network</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Distance Covered (km)</label>
                  <input name="distance" type="number" required placeholder="e.g. 24" className="w-full bg-slate-100/50 p-3.5 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Grid Draw (kWh)</label>
                  <input name="gridDraw" type="number" required placeholder="e.g. 15" className="w-full bg-slate-100/50 p-3.5 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Nutritional Matrix</label>
                  <select name="nutrition" className="w-full bg-slate-100/50 p-3.5 rounded-xl text-sm font-medium outline-none">
                    <option value="Plant-Based">Plant-Based / Vegan</option>
                    <option value="Vegetarian">Vegetarian Baseline</option>
                    <option value="Omnivore">Omnivore Mixed Profile</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={isCalculating} className="w-full bg-gradient-to-r from-eco-600 to-emerald-700 text-white font-semibold py-4 rounded-xl text-sm disabled:opacity-50">
                {isCalculating ? "Querying Distributed AI Infrastructure Node..." : "Compute Dynamic Footprint"}
              </button>
            </form>

            {/* DYNAMIC PYTHON AI SUGGESTION FEEDBACK OUTPUT */}
            {calcResult && (
              <div className="glass-panel p-8 rounded-3xl border-eco-200 animate-fade-up space-y-6 bg-white/60">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-400">Calculated Net Profile Impact</span>
                    <div className="text-4xl font-black font-mono text-apple-dark mt-1">{calcResult.totalEmissions} kg CO₂e</div>
                  </div>
                  <span className="text-xs font-bold bg-eco-50 text-eco-700 px-3 py-1 rounded-full">● Verified Real Data</span>
                </div>

                {/* AI Suggestion Loop mapping dynamic response arrays */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400">AI Engine Actions Matrix</h4>
                  {calcResult.recommendations?.map((card, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex justify-between font-bold text-sm text-apple-dark">
                        <span>💡 {card.title}</span>
                        <span className="text-eco-600 text-xs">Impact Vector: {card.impact}</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LIVE GAMIFICATION HUB */}
        {currentPage === 'challenge' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl font-black text-apple-dark tracking-tight">Active Challenges</h2>
                <p className="text-slate-500">Live operational targets fetched from database tables.</p>
              </div>

              <div className="space-y-4">
                {challenges.length === 0 ? (
                  <div className="glass-panel p-6 text-center text-slate-400 text-sm">No active tasks loaded from database. Ensure backend server is on.</div>
                ) : (
                  challenges.map((task) => (
                    <div key={task.id} className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] uppercase font-bold text-eco-600 bg-eco-50 px-2 py-0.5 rounded">{task.category}</span>
                          <span className="text-[11px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">+{task.xpReward} XP</span>
                        </div>
                        <h4 className="font-bold text-apple-dark text-base mt-1">{task.title}</h4>
                        <p className="text-slate-400 text-xs mt-0.5">{task.description}</p>
                      </div>
                      <button onClick={() => completeChallenge(task.id)} className="w-full sm:w-auto px-4 py-2 bg-apple-dark hover:bg-black text-white text-xs font-medium rounded-xl whitespace-nowrap">
                        Log Completion
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* LIVE DATA RIGHT PANEL COUNTERS */}
            <div className="space-y-6">
              <div className="bg-apple-dark text-white p-6 rounded-2xl shadow-md">
                <span className="text-xs font-bold uppercase text-white/50">Total User Score</span>
                <div className="text-4xl font-black font-mono mt-2 text-amber-400">{userXp} <span className="text-xs font-sans font-medium text-white/70">XP Balance</span></div>
              </div>

              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="font-bold text-sm text-apple-dark tracking-tight">Unlocked Milestones</h3>
                <div className="flex flex-wrap gap-2">
                  {badges.length === 0 ? <span className="text-xs text-slate-400">Complete tasks to unlock badges!</span> : badges.map((badge, index) => (
                    <span key={index} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-xs">🏅 {badge}</span>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-apple-dark tracking-tight">Global Ranking Board</h3>
                <div className="space-y-2">
                  {leaderboard.map((user, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl text-xs bg-slate-50/50">
                      <span className="font-medium text-slate-700">#{idx + 1} {user.username}</span>
                      <span className="font-mono font-bold text-eco-700">{user.totalXp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200/60 bg-white/40 py-6 text-center text-xs text-slate-400 font-medium">
        © 2026 EcoTrack Core Platform Layers. Curated with premium clean architecture.
      </footer>
    </div>
  );
}