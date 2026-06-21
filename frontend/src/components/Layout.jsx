import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Calculator', path: '/calculator' },
    { name: 'Challenges', path: '/challenges' },
    { name: 'Profile', path: '/profile' }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-eco-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-eco-700">
          <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
            🌱 <span>EcoTrack</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive 
                    ? 'bg-eco-600 text-white' 
                    : 'text-eco-100 hover:bg-eco-800 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-eco-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-red-300 font-medium hover:bg-eco-800 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main App Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}