import React from 'react';
export default function Profile() {
  const user = localStorage.getItem('username') || 'Eco Citizen';
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold text-slate-900">User Account Overview</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">{user}</h2>
        <p className="text-eco-600 font-semibold mt-1">Status Level: Eco-Warrior Elite Tier</p>
      </div>
    </div>
  );
}