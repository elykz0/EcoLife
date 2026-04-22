import { useState } from 'react';

const SOLUTIONS = [
  { id: 1, cat: 'water',  type: 'diy',  title: 'DIY Rain Barrel',           desc: 'Capture roof runoff in a 55-gallon barrel. A $15 downspout diverter kit is all you need. Saves 1,300+ gallons per month in rainy seasons.',           tags: ['diy','free'], color: '#1a6fa8', bg: '#e8f3fa', url: 'https://www.epa.gov/soakuptherain/soak-rain-rain-barrels', urlLabel: 'EPA Guide' },
  { id: 2, cat: 'water',  type: 'diy',  title: 'Laundry-to-Landscape',      desc: 'Re-route your washing machine\'s drain hose to irrigate trees and shrubs. No pump required. Diverts 10,000–40,000 gallons per year.',                  tags: ['diy'],       color: '#1a6fa8', bg: '#e8f3fa', url: 'https://oehha.ca.gov/calenviroscreen/report/greywater', urlLabel: 'Greywater Guide' },
  { id: 3, cat: 'water',  type: 'buy',  title: 'WaterSense Showerhead',      desc: 'EPA-certified showerheads use 1.8 GPM vs. 2.5 GPM standard. Saves 2,900 gallons/year per person. Typically $20–$50, payback in weeks.',               tags: ['buy'],       color: '#1a6fa8', bg: '#e8f3fa', url: 'https://www.epa.gov/watersense/showerheads', urlLabel: 'Find Products' },
  { id: 4, cat: 'water',  type: 'buy',  title: 'Smart Irrigation Controller', desc: 'Wi-Fi controllers adjust watering schedules based on real-time local weather data. Cut outdoor water use 30–50%. State rebates often available.',     tags: ['buy'],       color: '#1a6fa8', bg: '#e8f3fa', url: 'https://www.epa.gov/watersense/controllers', urlLabel: 'WaterSense Controllers' },
  { id: 5, cat: 'electricity', type: 'diy', title: 'Smart Power Strip Audit', desc: 'Plug all entertainment and home-office electronics into smart strips. Set to cut standby power automatically. Saves $100–$200/year at no extra cost.', tags: ['diy','free'], color: '#b86000', bg: '#fef3e2', url: 'https://www.energy.gov/energysaver/articles/3-types-power-strips', urlLabel: 'Energy.gov' },
  { id: 6, cat: 'electricity', type: 'diy', title: 'Air Sealing with Caulk', desc: 'Seal leaks around windows, doors, and outlets with a $20 caulk gun and foam stripping. Can cut HVAC costs 10–15%. Takes one afternoon.',             tags: ['diy'],       color: '#b86000', bg: '#fef3e2', url: 'https://www.energy.gov/energysaver/air-sealing-your-home', urlLabel: 'Air Sealing Guide' },
  { id: 7, cat: 'electricity', type: 'buy', title: 'ENERGY STAR LED Bulbs',   desc: 'Replace incandescent bulbs with LED. Uses 75–90% less energy, lasts 15,000+ hours. Replacing 10 bulbs saves $150–$200/year.',                         tags: ['buy'],       color: '#b86000', bg: '#fef3e2', url: 'https://www.energystar.gov/products/lighting_fans/light_bulbs', urlLabel: 'ENERGY STAR' },
  { id: 8, cat: 'electricity', type: 'buy', title: 'Smart Thermostat',        desc: 'Nest, Ecobee, and Honeywell units learn your schedule and save an average $130/year on HVAC. Many utilities offer $50–$100 instant rebates.',            tags: ['buy'],       color: '#b86000', bg: '#fef3e2', url: 'https://www.energystar.gov/products/heating_cooling/smart_thermostats', urlLabel: 'ENERGY STAR' },
  { id: 9, cat: 'electricity', type: 'buy', title: 'Rooftop Solar',           desc: 'Average 6kW system costs $15,000–$20,000 before the 30% federal tax credit. Payback 7–10 years; panels last 25–30 years. Use EnergySage to compare quotes.', tags: ['buy'],  color: '#b86000', bg: '#fef3e2', url: 'https://www.energysage.com', urlLabel: 'Get Quotes' },
  { id: 10, cat: 'food', type: 'diy',  title: 'Hot Compost Pile',             desc: '3 parts brown : 1 part green materials, keep moist, turn every 3 days. Finished in 3 weeks. Accepts most kitchen scraps and yard waste.',                tags: ['diy','free'], color: '#7a4a2a', bg: '#f5ede5', url: 'https://www.epa.gov/recycle/composting-home', urlLabel: 'EPA Guide' },
  { id: 11, cat: 'food', type: 'diy',  title: 'Worm Bin',                     desc: 'Build a 2-bin vermicomposting system for $10. Red wigglers eat half their weight in scraps per day and produce the richest natural fertilizer available.',  tags: ['diy','free'], color: '#7a4a2a', bg: '#f5ede5', url: 'https://composting.ces.ncsu.edu/vermicomposting/', urlLabel: 'Setup Guide' },
  { id: 12, cat: 'food', type: 'diy',  title: 'Bokashi Fermentation',         desc: 'Ferments ALL food scraps including meat and dairy in an airtight bucket. Ready in 2 weeks, then bury or add to compost. Works in apartments.',           tags: ['diy'],       color: '#7a4a2a', bg: '#f5ede5', url: 'https://extension.usu.edu/yardandgarden/research/bokashi-composting', urlLabel: 'How-To Guide' },
  { id: 13, cat: 'food', type: 'buy',  title: 'Electric Composter (Lomi)',    desc: 'Turns scraps into compost in 4–6 hours. Fully indoors, no odor. $500 upfront. Best for people without outdoor space.',                                  tags: ['buy'],       color: '#7a4a2a', bg: '#f5ede5', url: 'https://lomi.com', urlLabel: 'Lomi Composter' },
  { id: 14, cat: 'food', type: 'free', title: 'Curbside Compost Pickup',      desc: 'Many cities and private services collect food scraps weekly. Average $10–$30/month; some cities offer it free. Search your city + "food scrap pickup."',   tags: ['free'],      color: '#7a4a2a', bg: '#f5ede5', url: 'https://www.findacomposter.com', urlLabel: 'Find Composters' },
  { id: 15, cat: 'food', type: 'free', title: 'ShareWaste Neighbor Network',  desc: 'ShareWaste connects households with nearby compost hosts who accept scraps for free. Also check farmers markets — many run free scrap collection.',        tags: ['free'],      color: '#7a4a2a', bg: '#f5ede5', url: 'https://sharewaste.com', urlLabel: 'ShareWaste Map' },
];

const FILTERS = [
  { key: 'all',         label: 'All' },
  { key: 'water',       label: 'Water' },
  { key: 'electricity', label: 'Energy' },
  { key: 'food',        label: 'Food Waste' },
  { key: 'diy',         label: 'DIY' },
  { key: 'buy',         label: 'Buy' },
  { key: 'free',        label: 'Free' },
];

function SolIcon({ cat, color, bg }) {
  return (
    <div className="sol-icon" style={{ background: bg }}>
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {cat === 'water' && <><path d="M12 2C6 2 2 10 2 14a10 10 0 0020 0c0-4-4-12-10-12z"/></>}
        {cat === 'electricity' && <><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>}
        {cat === 'food' && <><path d="M17 8C8 10 5.9 16.17 3.82 19.26a.76.76 0 001.09 1C7 19 9 18 11 18c4 0 8-2 10-8-1 0-2.5.5-4 2z"/><path d="M3.82 19.26L12 12"/></>}
      </svg>
    </div>
  );
}

export default function Solutions() {
  const [filter, setFilter] = useState('all');

  const filtered = SOLUTIONS.filter(s =>
    filter === 'all' ||
    s.cat === filter ||
    s.type === filter ||
    s.tags.includes(filter)
  );

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <h2>Solutions</h2>
          <p>DIY projects, products to buy, and free community programs</p>
        </div>
      </div>

      <div className="edu-filter">
        {FILTERS.map(f => (
          <button key={f.key} className={`filter-chip ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
      </div>

      <div className="grid grid-auto">
        {filtered.map(s => (
          <div key={s.id} className="sol-card">
            <div className="sol-card-head">
              <SolIcon cat={s.cat} color={s.color} bg={s.bg} />
              <div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
            <div className="sol-tags">
              {s.tags.map(t => (
                <span key={t} className={`stag stag-${t}`}>{t}</span>
              ))}
              <span className="stag" style={{ color: s.color, borderColor: s.color + '40', background: s.bg }}>{s.cat}</span>
            </div>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="sol-link">
              {s.urlLabel} &rarr;
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 48 }}>
          No solutions match that filter.
        </div>
      )}
    </div>
  );
}
