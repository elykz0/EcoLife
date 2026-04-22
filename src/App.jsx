import { useState } from 'react';
import Dashboard from './components/Dashboard';
import HouseMonitor from './components/HouseMonitor';
import Education from './components/Education';
import Solutions from './components/Solutions';
import './App.css';

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function IconSensor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/>
      <path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
    </svg>
  );
}

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 19.26a.76.76 0 001.09 1C7 19 9 18 11 18c4 0 8-2 10-8-1 0-2.5.5-4 2z"/>
      <path d="M3.82 19.26L12 12"/>
    </svg>
  );
}

const NAV = [
  { id: 'dashboard', label: 'Overview',      Icon: IconGrid   },
  { id: 'monitor',   label: 'House Monitor', Icon: IconSensor },
  { id: 'education', label: 'Learn',         Icon: IconBook   },
  { id: 'solutions', label: 'Solutions',     Icon: IconLink   },
];

export default function App() {
  const [page, setPage] = useState('dashboard');

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} />,
    monitor:   <HouseMonitor />,
    education: <Education />,
    solutions: <Solutions />,
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">
            <div className="brand-dot"><IconLeaf /></div>
            <div>
              <div className="brand-name">EcoHome</div>
              <div className="brand-sub">Home intelligence</div>
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-btn ${page === id ? 'active' : ''}`}
              onClick={() => setPage(id)}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="live-indicator">
            <div className="live-dot" />
            Sensors active
          </div>
        </div>
      </nav>

      <main className="main">
        {pages[page]}
      </main>
    </div>
  );
}
