import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Challenges() {
  const [hub, setHub] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHubData = () => {
    API.get('/gamification')
      .then(res => setHub(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHubData();
  }, []);

  const claimReward = async (id) => {
    try {
      await API.post(`/gamification/challenges/${id}/complete`);
      fetchHubData(); // Re-sync state values instantly
    } catch (err) {
      alert('Error finalizing event progression calculations.');
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-slate-400 font-bold">Syncing Leaderboard Matrix...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Challenges Stream */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Climate Mitigation Challenges</h1>
          <p className="text-slate-500 font-medium">Complete tasks to claim experience points and unlock profile badges.</p>
        </div>

        <div className="space-y-4">
          {hub?.activeChallenges?.map(ch => {
            const isDone = ch.status === 'COMPLETED';
            return (
              <div key={ch.challengeId} className={`border p-6 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${isDone ? 'opacity-60 bg-slate-50/50' : 'hover:border-eco-300'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-eco-600 uppercase bg-eco-50 px-2 py-0.5 rounded">{ch.category}</span>
                    <span className="text-xs font-mono font-bold text-amber-600">+{ch.pointsReward} XP Points</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{ch.title}</h3>
                  <p className="text-slate-500 text-sm mt-0.5">{ch.description}</p>
                </div>

                <button
                  disabled={isDone}
                  onClick={() => claimReward(ch.challengeId)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    isDone ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-eco-600 text-white hover:bg-eco-700'
                  }`}
                >
                  {isDone ? 'Completed ✓' : 'Claim Verification'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Profile Stats, Badges, and Leaderboard Layout */}
      <div className="space-y-6">
        {/* Total Points Balance */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Reward Points Balance</span>
          <div className="text-4xl font-black font-mono mt-2 text-amber-400">{hub?.currentPoints || 0} <span className="text-sm text-white font-sans font-medium">XP</span></div>
        </div>

        {/* Unlocked Badges Panel */}
        <div className="bg-white border p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-800 text-base mb-3">Earned Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {hub?.unlockedBadges?.length === 0 ? (
              <span className="text-slate-400 text-xs">Complete challenges to unlock your first platform badge profile.</span>
            ) : hub?.unlockedBadges?.map((badge, idx) => (
              <span key={idx} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-sm">
                🏅 {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Global Leaderboard Panel */}
        <div className="bg-white border p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-800 text-base mb-4">Global Rank Leaderboard</h3>
          <div className="space-y-3">
            {hub?.leaderboard?.map((rank, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black w-4 text-slate-400">#{i + 1}</span>
                  <span className="text-sm font-semibold text-slate-700">{rank.username}</span>
                </div>
                <span className="text-sm font-mono font-bold text-eco-700">{rank.total_points} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}