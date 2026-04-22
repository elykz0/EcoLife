import { useState, useEffect, useRef } from 'react';

const TIPS = [
  { title: 'Your kitchen has elevated VOC levels', body: 'Sensor readings suggest lingering cooking fumes. Run the range hood for 15 minutes after cooking to drop VOC levels below 150 ppb.' },
  { title: 'Water pressure drop detected 2:14 AM', body: 'A brief pressure anomaly was logged. Check for slow drips under sinks — a 1-drip/sec leak wastes 3,000 gallons per year.' },
  { title: 'Solar generation peak window: 11am–2pm', body: 'Run the dishwasher and washing machine during this window to offset grid draw with your own generation.' },
  { title: 'Outdoor air quality is Good today', body: 'AQI 34. Open windows for 20 minutes to flush indoor CO2 accumulation — current readings in the bedroom are trending upward.' },
  { title: 'Heating runtime 18% above baseline', body: 'Compared to last Tuesday at the same outdoor temp. A $15 door sweep on the garage entry could recover most of this.' },
];

const EVENTS = [
  { type: 'water',       color: '#1a6fa8', title: 'Dishwasher cycle',        meta: 'Detected via flow sensor — Kitchen',  val: '4.2 gal',   ago: '38 min ago' },
  { type: 'electricity', color: '#b86000', title: 'HVAC compressor on',       meta: 'Runtime: 22 min — Zone 1',           val: '1.8 kWh',   ago: '1 hr ago' },
  { type: 'electricity', color: '#b86000', title: 'EV charge complete',        meta: 'Full charge — Garage outlet',        val: '14.3 kWh',  ago: '4 hr ago' },
  { type: 'water',       color: '#1a6fa8', title: 'Morning showers (×2)',      meta: 'Flow sensor — Master bath',          val: '38 gal',    ago: '6 hr ago' },
  { type: 'solar',       color: '#1e6641', title: 'Solar surplus exported',    meta: 'Net metered to grid',                val: '2.1 kWh',   ago: '8 hr ago' },
  { type: 'food',        color: '#7a4a2a', title: 'Compost bin weight up',     meta: 'Auto-weighed — Countertop sensor',   val: '+0.8 lbs',  ago: 'Yesterday' },
];

function useLiveSensor(base, variance, interval = 4000) {
  const [val, setVal] = useState(base);
  const direction = useRef(1);
  useEffect(() => {
    const id = setInterval(() => {
      setVal(prev => {
        const delta = (Math.random() * variance * 0.4) * direction.current;
        const next = prev + delta;
        if (next > base + variance) direction.current = -1;
        if (next < base - variance) direction.current = 1;
        return Math.round(next * 10) / 10;
      });
    }, interval + Math.random() * 1000);
    return () => clearInterval(id);
  }, [base, variance, interval]);
  return val;
}

function ScoreRing({ score }) {
  const r = 33;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <div className="ring-wrap">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#eef2ee" strokeWidth="8" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="#34c974" strokeWidth="8"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="ring-center">
        <div className="ring-num">{score}</div>
        <div className="ring-sub">score</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, sub, barPct, barColor, delta, deltaType }) {
  return (
    <div className="card">
      <div className="card-title">{label}</div>
      <div>
        <span className="stat-val" style={{ color: barColor }}>{value}</span>
        <span className="stat-unit">{unit}</span>
      </div>
      <div className="stat-label">{sub}</div>
      {delta && <div className={`stat-delta delta-${deltaType}`}>{delta}</div>}
      <div className="micro-bar">
        <div className="micro-bar-fill" style={{ width: `${barPct}%`, background: barColor }} />
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  const tipIdx = new Date().getDate() % TIPS.length;
  const tip = TIPS[tipIdx];

  const waterToday  = useLiveSensor(86, 3, 5000);
  const elecToday   = useLiveSensor(28.4, 1.2, 4500);
  const solarToday  = useLiveSensor(9.1, 0.8, 6000);
  const co2Living   = useLiveSensor(812, 25, 3500);

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <h2>Home Overview</h2>
          <p>Live sensor readings — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="ph-badge">
          <div className="dot" />
          Auto-detecting
        </div>
      </div>

      <div className="tod" style={{ marginBottom: 20 }}>
        <div className="tod-eyebrow">Insight</div>
        <h3>{tip.title}</h3>
        <p>{tip.body}</p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <StatCard
          label="Water Today"
          value={waterToday}
          unit="gal"
          sub="Household total · target 80 gal"
          barPct={(waterToday / 100) * 100}
          barColor="#1a6fa8"
          delta={waterToday < 85 ? '7% below avg' : '6% above avg'}
          deltaType={waterToday < 85 ? 'good' : 'warn'}
        />
        <StatCard
          label="Electricity Today"
          value={elecToday}
          unit="kWh"
          sub="Grid draw · 30 kWh baseline"
          barPct={(elecToday / 40) * 100}
          barColor="#b86000"
          delta={elecToday < 29 ? '5% below baseline' : '5% above baseline'}
          deltaType={elecToday < 29 ? 'good' : 'warn'}
        />
        <StatCard
          label="Solar Generated"
          value={solarToday}
          unit="kWh"
          sub="Rooftop · 94% of yesterday"
          barPct={(solarToday / 12) * 100}
          barColor="#1e6641"
          delta="Net positive day"
          deltaType="good"
        />
        <StatCard
          label="Indoor CO2"
          value={co2Living}
          unit="ppm"
          sub="Living room · 1,000 ppm limit"
          barPct={(co2Living / 1200) * 100}
          barColor={co2Living > 900 ? '#c0392b' : '#1a6fa8'}
          delta={co2Living > 900 ? 'Ventilate soon' : 'Acceptable'}
          deltaType={co2Living > 900 ? 'warn' : 'good'}
        />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <div className="card" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <ScoreRing score={74} />
          <div style={{ flex: 1 }}>
            <div className="card-title">Eco Score</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Good — room to improve
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
              Score based on water efficiency, grid reliance, solar utilization, and air quality across all sensors.
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => onNavigate('solutions')}>
              View improvement tips
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">This Month vs Last Month</div>
          {[
            { label: 'Water',       cur: 2340, prev: 2680, unit: 'gal',  color: '#1a6fa8' },
            { label: 'Electricity', cur: 612,  prev: 698,  unit: 'kWh',  color: '#b86000' },
            { label: 'Solar yield', cur: 218,  prev: 195,  unit: 'kWh',  color: '#1e6641' },
          ].map(r => {
            const pct = Math.round(((r.cur - r.prev) / r.prev) * 100);
            const better = (r.label === 'Solar yield') ? pct > 0 : pct < 0;
            return (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.cur.toLocaleString()} {r.unit}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: better ? 'var(--accent-mid)' : 'var(--red)' }}>
                    {pct > 0 ? '+' : ''}{pct}%
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>vs last month</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="card-title" style={{ margin: 0 }}>Recent Activity</div>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 12px' }} onClick={() => onNavigate('monitor')}>
            View house monitor
          </button>
        </div>
        <div className="timeline">
          {EVENTS.map((e, i) => (
            <div key={i} className="tl-item">
              <div className="tl-dot" style={{ background: e.color }} />
              <div className="tl-body">
                <div className="tl-title">{e.title}</div>
                <div className="tl-meta">{e.meta}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="tl-val">{e.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.ago}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
