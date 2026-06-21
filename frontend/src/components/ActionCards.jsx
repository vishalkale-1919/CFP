import React from 'react';

export default function ActionCards({ cards = [] }) {
  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card, i) => {
        const isHighImpact = card.impact === 'HIGH';
        return (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-eco-300 transition-all">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-black tracking-wider px-2.5 py-1 rounded-full ${
                  isHighImpact ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {card.impact} IMPACT
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.category}</span>
              </div>
              <h4 className="text-lg font-black text-slate-800 mb-2">{card.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{card.advice}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <span className="text-xs font-bold text-slate-500">Est. Savings Opportunity</span>
              <span className="font-mono text-sm font-black text-eco-600">-{card.estimated_reduction_kg} kg CO₂ / day</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}