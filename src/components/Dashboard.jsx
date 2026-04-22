import { useMemo } from 'react';

const DAILY_TIPS = [
  {
    title: 'Fix leaky faucets today',
    body: 'A single dripping faucet can waste up to 3,000 gallons per year. Check all faucets and replace worn washers — it takes under 20 minutes and costs less than $5.',
  },
  {
    title: 'Unplug vampire electronics',
    body: 'Devices on standby can account for 10% of your electricity bill. Unplug phone chargers, TVs, and gaming consoles when not in use, or use a smart power strip.',
  },
  {
    title: 'Start a countertop compost bin',
    body: 'Keep a small bin on your counter for fruit peels, coffee grounds, and veggie scraps. You\'ll divert waste from landfills and create rich fertilizer in weeks.',
  },
  {
    title: 'Run full loads only',
    body: 'Dishwashers and washing machines use the same water whether half-full or full. Waiting for a full load can save 3,400 gallons of water per year.',
  },
  {
    title: 'Switch to LED bulbs',
    body: 'LED bulbs use 75% less energy than incandescent bulbs and last 25 times longer. Replacing 5 bulbs can save over $75/year on your electricity bill.',
  },
];

function ScoreRing({ score }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;

  return (
    <div className="score-ring-wrap">
      <div className="score-ring">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8e2" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke="#4caf7d"
            strokeWidth="10"
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="score-center">
          {score}<span>/ 100</span>
        </div>
      </div>
      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--green-mid)' }}>Eco Score</div>
    </div>
  );
}

function ProgressBar({ value, max, className }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>This month</span>
        <span>{pct}% of limit</span>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill ${className}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard({ logs, onNavigate }) {
  const today = new Date().toDateString();
  const todayTip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];

  const stats = useMemo(() => {
    const now = new Date();
    const monthLogs = logs.filter(l => {
      const d = new Date(l.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const water = monthLogs.filter(l => l.type === 'water').reduce((s, l) => s + l.amount, 0);
    const elec = monthLogs.filter(l => l.type === 'electricity').reduce((s, l) => s + l.amount, 0);
    const food = monthLogs.filter(l => l.type === 'food').reduce((s, l) => s + l.amount, 0);

    const waterLimit = 3000;
    const elecLimit = 500;
    const foodLimit = 20;

    let score = 100;
    if (water > 0) score -= Math.min(30, Math.round((water / waterLimit) * 30));
    if (elec > 0) score -= Math.min(30, Math.round((elec / elecLimit) * 30));
    if (food > 0) score -= Math.min(30, Math.round((food / foodLimit) * 30));
    if (logs.length === 0) score = 72;

    return { water, elec, food, score, waterLimit, elecLimit, foodLimit };
  }, [logs]);

  const recentLogs = logs.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h2>Your Eco Dashboard</h2>
        <p>Track your environmental impact at a glance</p>
      </div>

      <div className="tip-of-day">
        <div className="tod-label">Tip of the Day</div>
        <h3>{todayTip.title}</h3>
        <p>{todayTip.body}</p>
      </div>

      <div className="card-grid card-grid-3" style={{ marginBottom: 24 }}>
        <div className="card stat-card stat-water">
          <div className="stat-label">Water Used</div>
          <div className="stat-value">{stats.water.toLocaleString()}</div>
          <div className="stat-sub">gallons this month</div>
          <ProgressBar value={stats.water} max={stats.waterLimit} className="fill-blue" />
        </div>
        <div className="card stat-card stat-electricity">
          <div className="stat-label">Electricity Used</div>
          <div className="stat-value">{stats.elec.toLocaleString()}</div>
          <div className="stat-sub">kWh this month</div>
          <ProgressBar value={stats.elec} max={stats.elecLimit} className="fill-yellow" />
        </div>
        <div className="card stat-card stat-food">
          <div className="stat-label">Food Scraps</div>
          <div className="stat-value">{stats.food.toLocaleString()}</div>
          <div className="stat-sub">lbs this month</div>
          <ProgressBar value={stats.food} max={stats.foodLimit} className="fill-brown" />
        </div>
      </div>

      <div className="card-grid card-grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <ScoreRing score={stats.score} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--green-dark)', marginBottom: 6 }}>
              {stats.score >= 80 ? 'Great work!' : stats.score >= 60 ? 'Room to improve' : 'Take action today'}
            </div>
            <div style={{ fontSize: '0.83rem', color: 'var(--gray-700)', lineHeight: 1.5 }}>
              Your eco score is based on monthly water, electricity, and food waste relative to average household limits.
            </div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => onNavigate('solutions')}>
              View Solutions
            </button>
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--green-dark)', marginBottom: 14 }}>
            Recent Activity
          </div>
          {recentLogs.length === 0 ? (
            <div style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
              No logs yet — start tracking your usage.
              <br />
              <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={() => onNavigate('tracker')}>
                Log Usage
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentLogs.map(log => (
                <div key={log.id} className="log-entry">
                  <div className="log-entry-left">
                    <span className={`log-badge badge-${log.type}`}>{log.type}</span>
                    <span>{log.note || `${log.amount} ${log.unit}`}</span>
                  </div>
                  <span className="log-value">{log.amount} {log.unit}</span>
                </div>
              ))}
              <button className="btn btn-primary btn-sm" style={{ marginTop: 4, alignSelf: 'flex-start' }} onClick={() => onNavigate('tracker')}>
                + Log More
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--green-dark)', marginBottom: 16 }}>
          Quick Actions
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { icon: '💧', label: 'Log Water', page: 'tracker' },
            { icon: '⚡', label: 'Log Energy', page: 'tracker' },
            { icon: '🍃', label: 'Log Scraps', page: 'tracker' },
            { icon: '📚', label: 'Learn Tips', page: 'education' },
            { icon: '🔗', label: 'Find Solutions', page: 'solutions' },
          ].map(a => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.page)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '14px 18px', borderRadius: 10, border: '1.5px solid var(--gray-200)',
                background: 'var(--white)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                color: 'var(--gray-700)', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-light)'; e.currentTarget.style.background = 'var(--green-pale)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.background = 'var(--white)'; }}
            >
              <span style={{ fontSize: '1.5rem' }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
