import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Tracker from './components/Tracker';
import Education from './components/Education';
import Solutions from './components/Solutions';
import './App.css';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏡' },
  { id: 'tracker', label: 'Resource Tracker', icon: '📊' },
  { id: 'education', label: 'Learn', icon: '📚' },
  { id: 'solutions', label: 'Solutions', icon: '🔗' },
];

function loadLogs() {
  try {
    return JSON.parse(localStorage.getItem('eco_logs') || '[]');
  } catch {
    return [];
  }
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [logs, setLogs] = useState(loadLogs);

  useEffect(() => {
    localStorage.setItem('eco_logs', JSON.stringify(logs));
  }, [logs]);

  function addLog(entry) {
    setLogs(prev => [
      { ...entry, id: Date.now(), date: new Date().toISOString() },
      ...prev,
    ]);
  }

  function deleteLog(id) {
    setLogs(prev => prev.filter(l => l.id !== id));
  }

  const pages = {
    dashboard: <Dashboard logs={logs} onNavigate={setPage} />,
    tracker: <Tracker logs={logs} onAdd={addLog} onDelete={deleteLog} />,
    education: <Education />,
    solutions: <Solutions />,
  };

  return (
    <div className="app-shell">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <h1>🌍 EcoHome</h1>
          <span>Sustainable living, simplified</span>
        </div>
        <div className="sidebar-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.72rem', opacity: 0.5 }}>
          Data stored locally on your device
        </div>
      </nav>

      <main className="main-content">
        {pages[page]}
      </main>
    </div>
  );
}
