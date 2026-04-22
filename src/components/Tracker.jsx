import { useState } from 'react';

const UNITS = {
  water: ['gallons', 'liters'],
  electricity: ['kWh', 'Wh'],
  food: ['lbs', 'oz', 'kg'],
};

const NOTES = {
  water: ['Shower', 'Laundry', 'Dishwasher', 'Lawn/Garden', 'Other'],
  electricity: ['HVAC', 'Lighting', 'Appliances', 'EV Charging', 'Other'],
  food: ['Vegetable scraps', 'Fruit peels', 'Coffee grounds', 'Bread/grains', 'Dairy', 'Other'],
};

function LogForm({ type, icon, color, onAdd }) {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState(UNITS[type][0]);
  const [note, setNote] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    onAdd({ type, amount: Number(amount), unit, note });
    setAmount('');
    setNote('');
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ borderTop: `4px solid ${color}` }}>
      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--green-dark)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span> {type.charAt(0).toUpperCase() + type.slice(1)} Usage
      </div>
      <div className="input-row">
        <div className="input-group" style={{ flex: 1.5 }}>
          <label>Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value)}>
            {UNITS[type].map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div className="input-group" style={{ flex: 2 }}>
          <label>Category</label>
          <select value={note} onChange={e => setNote(e.target.value)}>
            <option value="">Select category</option>
            {NOTES[type].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add</button>
      </div>
    </form>
  );
}

function MonthlySummary({ logs, type, color, icon, unit, limit }) {
  const now = new Date();
  const monthLogs = logs.filter(l => {
    const d = new Date(l.date);
    return l.type === type && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const total = monthLogs.reduce((s, l) => s + l.amount, 0);
  const pct = Math.min(100, Math.round((total / limit) * 100));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: 'var(--gray-100)', borderRadius: 10 }}>
      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 4 }}>{type}</div>
        <div style={{ fontWeight: 700, color, fontSize: '1.1rem' }}>{total.toLocaleString()} {unit}</div>
        <div style={{ height: 6, background: 'var(--gray-200)', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.5s' }} />
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 3 }}>{pct}% of {limit.toLocaleString()} {unit} monthly guideline</div>
      </div>
    </div>
  );
}

export default function Tracker({ logs, onAdd, onDelete }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all' ? logs : logs.filter(l => l.type === activeFilter);

  return (
    <div>
      <div className="page-header">
        <h2>Resource Tracker</h2>
        <p>Log your daily water, electricity, and food scrap usage</p>
      </div>

      <div className="card-grid card-grid-3" style={{ marginBottom: 24 }}>
        <MonthlySummary logs={logs} type="water" color="var(--blue)" icon="💧" unit="gal" limit={3000} />
        <MonthlySummary logs={logs} type="electricity" color="var(--yellow)" icon="⚡" unit="kWh" limit={500} />
        <MonthlySummary logs={logs} type="food" color="var(--brown)" icon="🍃" unit="lbs" limit={20} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        <LogForm type="water" icon="💧" color="var(--blue)" onAdd={onAdd} />
        <LogForm type="electricity" icon="⚡" color="var(--yellow)" onAdd={onAdd} />
        <LogForm type="food" icon="🍃" color="var(--brown)" onAdd={onAdd} />
      </div>

      <div className="card">
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--green-dark)', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Usage Log</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'water', 'electricity', 'food'].map(f => (
              <button
                key={f}
                className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                onClick={() => setActiveFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ color: 'var(--gray-400)', fontSize: '0.85rem', padding: '20px 0' }}>
            No entries yet — add your first log above.
          </div>
        ) : (
          <div className="log-list">
            {filtered.map(log => (
              <div key={log.id} className="log-entry">
                <div className="log-entry-left">
                  <span className={`log-badge badge-${log.type}`}>{log.type}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{log.note || log.type}</div>
                    <div className="log-date">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="log-value">{log.amount} {log.unit}</span>
                  <button className="delete-btn" onClick={() => onDelete(log.id)} title="Delete entry">×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
