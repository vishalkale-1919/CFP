import React, { useState, useEffect } from 'react';
import { carbonAPI } from '../services/api';

export default function Calculator() {
  const [formData, setFormData] = useState({
    transportMode: 'Car',
    transportDistance: '',
    electricityUnits: '',
    foodType: 'Vegetarian',
    shoppingLevel: 'Low'
  });

  const [projections, setProjections] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    score: 'Excellent'
  });

  const [uiStatus, setUiStatus] = useState({ type: '', msg: '' });

  // Pure Client Calculation Engine
  const runLiveCalculations = () => {
    let transport = 0;
    const dist = parseFloat(formData.transportDistance) || 0;
    switch (formData.transportMode.toLowerCase()) {
      case 'bike': transport = dist * 0.08; break;
      case 'car': transport = dist * 0.21; break;
      case 'bus': transport = dist * 0.10; break;
      default: transport = 0;
    }

    const electricity = (parseFloat(formData.electricityUnits) || 0) * 0.82;
    
    let food = 3.0;
    if (formData.foodType.toLowerCase() === 'vegetarian') food = 1.5;
    if (formData.foodType.toLowerCase() === 'nonveg') food = 5.0;

    let shopping = 15.0;
    if (formData.shoppingLevel.toLowerCase() === 'low') shopping = 5.0;
    if (formData.shoppingLevel.toLowerCase() === 'high') shopping = 30.0;

    const totalDaily = transport + electricity + food + shopping;
    const totalWeekly = totalDaily * 7;
    const totalMonthly = totalDaily * 30;

    // Environmental grading logic
    let scoreRating = 'Excellent';
    if (totalDaily > 15) scoreRating = 'Good';
    if (totalDaily > 35) scoreRating = 'High Impact';

    setProjections({
      daily: totalDaily.toFixed(2),
      weekly: totalWeekly.toFixed(2),
      monthly: totalMonthly.toFixed(2),
      score: scoreRating
    });
  };

  useEffect(() => {
    runLiveCalculations();
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(formData.transportDistance) < 0 || parseFloat(formData.electricityUnits) < 0) {
      setUiStatus({ type: 'error', msg: 'Inputs cannot be negative.' });
      return;
    }

    try {
      setUiStatus({ type: 'loading', msg: 'Storing parameters...' });
      await carbonAPI.logRecord({
        ...formData,
        transportDistance: parseFloat(formData.transportDistance) || 0,
        electricityUnits: parseFloat(formData.electricityUnits) || 0
      });
      setUiStatus({ type: 'success', msg: 'Carbon parameters successfully stored!' });
    } catch (err) {
      setUiStatus({ type: 'error', msg: 'Error logging records to backend service.' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Inputs Form */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Carbon Calculation Engine</h1>
          <p className="text-slate-500">Provide daily values below to track performance.</p>
        </div>

        {uiStatus.msg && (
          <div className={`p-4 rounded-xl text-sm font-bold ${
            uiStatus.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' :
            uiStatus.type === 'success' ? 'bg-eco-50 text-eco-700 border border-eco-200' : 'bg-slate-100 text-slate-600'
          }`}>
            {uiStatus.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Transport Mode</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-eco-500 transition-all"
                value={formData.transportMode}
                onChange={e => setFormData({...formData, transportMode: e.target.value})}
              >
                <option>Car</option><option>Bike</option><option>Bus</option><option>Cycle</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Distance (km)</label>
              <input 
                type="number" min="0" step="any" placeholder="0" required
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-eco-500 transition-all"
                value={formData.transportDistance}
                onChange={e => setFormData({...formData, transportDistance: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Electricity Grid (Units / kWh)</label>
              <input 
                type="number" min="0" step="any" placeholder="0" required
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-eco-500 transition-all"
                value={formData.electricityUnits}
                onChange={e => setFormData({...formData, electricityUnits: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Diet Profile</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-eco-500 transition-all"
                value={formData.foodType}
                onChange={e => setFormData({...formData, foodType: e.target.value})}
              >
                <option>Vegetarian</option><option>Mixed</option><option>NonVeg</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Daily Retail Consumption</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-eco-500 transition-all"
              value={formData.shoppingLevel}
              onChange={e => setFormData({...formData, shoppingLevel: e.target.value})}
            >
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-eco-600 hover:bg-eco-700 text-white font-bold py-4 rounded-xl transition-all shadow-sm">
            Commit Log Parameters
          </button>
        </form>
      </div>

      {/* Projection Scoreboard Panel */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-between shadow-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold">Live Forecast Output</h3>
            <p className="text-slate-400 text-xs mt-1">Calculated emission estimates</p>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-400">Daily Load</span>
              <span className="text-lg font-mono font-bold text-white">{projections.daily} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-400">Weekly Pace</span>
              <span className="text-lg font-mono font-bold text-white">{projections.weekly} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-400">Monthly Projection</span>
              <span className="text-lg font-mono font-bold text-white">{projections.monthly} kg</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Carbon Rating Category</span>
          <div className={`text-2xl font-black mt-1 ${
            projections.score === 'Excellent' ? 'text-emerald-400' :
            projections.score === 'Good' ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {projections.score}
          </div>
        </div>
      </div>
    </div>
  );
}