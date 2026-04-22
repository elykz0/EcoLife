import { useState, useEffect, useRef } from 'react';

const BASE_ROOMS = [
  { id: 'living',  label: 'Living Room',    x: 30,  y: 30,  w: 260, h: 200, co2: 812,  pm25: 8.2, temp: 71.4, hum: 44, voc: 118 },
  { id: 'kitchen', label: 'Kitchen',         x: 290, y: 30,  w: 200, h: 120, co2: 948,  pm25: 14.6,temp: 73.8, hum: 52, voc: 274 },
  { id: 'dining',  label: 'Dining Room',     x: 490, y: 30,  w: 200, h: 120, co2: 874,  pm25: 9.8, temp: 72.6, hum: 46, voc: 142 },
  { id: 'master',  label: 'Master Bedroom',  x: 30,  y: 230, w: 260, h: 220, co2: 648,  pm25: 5.1, temp: 69.8, hum: 48, voc: 78  },
  { id: 'bed2',    label: 'Bedroom 2',       x: 290, y: 150, w: 200, h: 200, co2: 692,  pm25: 5.8, temp: 70.2, hum: 47, voc: 84  },
  { id: 'bath',    label: 'Bathroom',        x: 490, y: 150, w: 100, h: 120, co2: 722,  pm25: 6.4, temp: 73.2, hum: 66, voc: 92  },
  { id: 'office',  label: 'Office',          x: 590, y: 150, w: 100, h: 120, co2: 886,  pm25: 7.2, temp: 71.6, hum: 43, voc: 165 },
  { id: 'garage',  label: 'Garage',          x: 490, y: 270, w: 200, h: 180, co2: 576,  pm25: 21.4,temp: 64.2, hum: 39, voc: 448 },
];

function aqiScore(room) {
  const co2Score  = Math.min(100, Math.max(0, ((room.co2 - 400) / 800) * 100));
  const pm25Score = Math.min(100, Math.max(0, (room.pm25 / 35) * 100));
  const vocScore  = Math.min(100, Math.max(0, (room.voc / 500) * 100));
  return Math.round((co2Score * 0.4 + pm25Score * 0.35 + vocScore * 0.25));
}

function aqiColor(score) {
  if (score < 25)  return { fill: 'rgba(52,201,116,0.35)',  stroke: '#34c974', label: 'Good',     textColor: '#1e6641' };
  if (score < 50)  return { fill: 'rgba(255,193,7,0.35)',   stroke: '#ffc107', label: 'Moderate', textColor: '#b86000' };
  if (score < 75)  return { fill: 'rgba(255,112,67,0.35)',  stroke: '#ff7043', label: 'Poor',     textColor: '#bf360c' };
  return             { fill: 'rgba(229,57,53,0.45)',   stroke: '#e53935', label: 'Unhealthy',textColor: '#b71c1c' };
}

function useLiveRooms() {
  const [rooms, setRooms] = useState(BASE_ROOMS);
  const dirs = useRef(BASE_ROOMS.map(() => ({ co2: 1, pm25: 1, voc: 1 })));

  useEffect(() => {
    const id = setInterval(() => {
      setRooms(prev => prev.map((r, i) => {
        const d = dirs.current[i];
        const nudge = (base, range, dir) => {
          const n = base + (Math.random() * range * 0.3) * dir;
          return Math.round(n * 10) / 10;
        };
        const co2 = nudge(r.co2, 30, d.co2);
        const pm25 = nudge(r.pm25, 2, d.pm25);
        const voc = nudge(r.voc, 20, d.voc);
        if (co2 > BASE_ROOMS[i].co2 + 40 || co2 < BASE_ROOMS[i].co2 - 40) d.co2 *= -1;
        if (pm25 > BASE_ROOMS[i].pm25 + 3 || pm25 < BASE_ROOMS[i].pm25 - 3) d.pm25 *= -1;
        if (voc > BASE_ROOMS[i].voc + 30 || voc < BASE_ROOMS[i].voc - 30) d.voc *= -1;
        return { ...r, co2, pm25, voc };
      }));
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return rooms;
}

function MetricRow({ label, value, unit, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontWeight: 700, color, fontSize: 14 }}>{value}<span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 2 }}>{unit}</span></div>
    </div>
  );
}

export default function HouseMonitor() {
  const rooms = useLiveRooms();
  const [selectedId, setSelectedId] = useState('living');
  const selected = rooms.find(r => r.id === selectedId);
  const score = selected ? aqiScore(selected) : 0;
  const colors = aqiColor(score);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setLastUpdate(new Date()), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <h2>House Monitor</h2>
          <p>Real-time air quality across all rooms — click a room to inspect</p>
        </div>
        <div className="ph-badge">
          <div className="dot" />
          {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      <div className="monitor-wrap">
        <div className="blueprint-card">
          <div className="blueprint-header">
            <div className="blueprint-title">Floor Plan — Ground Level</div>
            <div className="blueprint-live"><div className="dot" /> Live</div>
          </div>
          <div className="floorplan">
            <svg viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {rooms.map(r => {
                  const s = aqiScore(r);
                  const c = aqiColor(s);
                  return (
                    <radialGradient key={r.id} id={`grad-${r.id}`} cx="50%" cy="50%" r="70%">
                      <stop offset="0%" stopColor={c.stroke} stopOpacity="0.5" />
                      <stop offset="100%" stopColor={c.stroke} stopOpacity="0.08" />
                    </radialGradient>
                  );
                })}
              </defs>

              {/* Outer shell */}
              <rect x="28" y="28" width="664" height="424" rx="3"
                fill="#0a1628" stroke="rgba(100,180,255,0.25)" strokeWidth="2" />

              {/* Rooms */}
              {rooms.map(r => {
                const s = aqiScore(r);
                const c = aqiColor(s);
                const isSelected = r.id === selectedId;
                return (
                  <g key={r.id} className="room-area" onClick={() => setSelectedId(r.id)}>
                    <rect x={r.x} y={r.y} width={r.w} height={r.h}
                      fill="#0d1e38" stroke={isSelected ? 'rgba(100,180,255,0.8)' : 'rgba(100,180,255,0.22)'}
                      strokeWidth={isSelected ? 1.5 : 1} rx="2" />
                    <rect x={r.x + 2} y={r.y + 2} width={r.w - 4} height={r.h - 4}
                      fill={`url(#grad-${r.id})`} rx="1" />
                    <text
                      x={r.x + r.w / 2} y={r.y + r.h / 2 - 6}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="10" fontWeight="600" fill="rgba(220,240,255,0.75)"
                      fontFamily="-apple-system, 'Segoe UI', sans-serif"
                    >
                      {r.label}
                    </text>
                    <text
                      x={r.x + r.w / 2} y={r.y + r.h / 2 + 10}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="9" fill={c.stroke}
                      fontFamily="-apple-system, 'Segoe UI', sans-serif"
                      fontWeight="700"
                    >
                      {r.co2} ppm
                    </text>
                    {isSelected && (
                      <rect x={r.x} y={r.y} width={r.w} height={r.h}
                        fill="none" stroke="rgba(100,200,255,0.4)" strokeWidth="1.5"
                        strokeDasharray="4 3" rx="2" />
                    )}
                  </g>
                );
              })}

              {/* Compass rose */}
              <g transform="translate(680,460)">
                <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(100,180,255,0.15)" strokeWidth="1" />
                <text x="0" y="-5" textAnchor="middle" fontSize="7" fill="rgba(100,180,255,0.4)" fontFamily="sans-serif">N</text>
                <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(100,180,255,0.2)" strokeWidth="0.8" />
                <line x1="-10" y1="0" x2="10" y2="0" stroke="rgba(100,180,255,0.2)" strokeWidth="0.8" />
              </g>
            </svg>
          </div>
        </div>

        <div className="room-panel">
          {selected && (
            <>
              <div className="room-panel-header">
                <div className="rph-label">Selected Room</div>
                <div className="rph-name">{selected.label}</div>
                <div className="aqi-badge" style={{ background: colors.fill.replace('0.35', '0.12'), color: colors.textColor, border: `1px solid ${colors.stroke}40` }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.stroke }} />
                  Air Quality: {colors.label}
                </div>
              </div>

              <div className="sensor-grid">
                {[
                  { label: 'CO2', val: Math.round(selected.co2), unit: 'ppm',  color: selected.co2 > 1000 ? '#c0392b' : selected.co2 > 800 ? '#b86000' : '#1e6641' },
                  { label: 'PM2.5', val: selected.pm25.toFixed(1), unit: 'µg/m³', color: selected.pm25 > 12 ? '#b86000' : '#1e6641' },
                  { label: 'Temp', val: selected.temp.toFixed(1), unit: '°F',  color: '#1a6fa8' },
                  { label: 'Humidity', val: selected.hum, unit: '%',   color: '#0d7377' },
                ].map(m => (
                  <div key={m.label} className="sensor-cell">
                    <div className="sensor-cell-label">{m.label}</div>
                    <div>
                      <span className="sensor-cell-val" style={{ color: m.color }}>{m.val}</span>
                      <span className="sensor-cell-unit"> {m.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-title">Volatile Organics</div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: selected.voc > 300 ? '#c0392b' : selected.voc > 150 ? '#b86000' : '#1e6641' }}>
                    {Math.round(selected.voc)}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>ppb VOC</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (selected.voc / 500) * 100)}%`, background: selected.voc > 300 ? '#e53935' : selected.voc > 150 ? '#ffc107' : '#34c974', borderRadius: 99, transition: 'width 1s ease' }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Safe limit: 500 ppb</div>
              </div>

              <div className="aqi-legend">
                <div className="legend-title">Air Quality Index</div>
                <div className="legend-bar" />
                <div className="legend-labels">
                  <span>Good</span><span>Moderate</span><span>Poor</span><span>Unhealthy</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-4" style={{ marginTop: 20 }}>
        {rooms.map(r => {
          const s = aqiScore(r);
          const c = aqiColor(s);
          return (
            <div
              key={r.id}
              className="card"
              style={{ cursor: 'pointer', borderColor: selectedId === r.id ? c.stroke : undefined, borderLeftWidth: 3, borderLeftColor: c.stroke }}
              onClick={() => setSelectedId(r.id)}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.textColor, marginBottom: 2 }}>{Math.round(r.co2)} <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>ppm</span></div>
              <div style={{ fontSize: 11, fontWeight: 600, color: c.textColor }}>{c.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
