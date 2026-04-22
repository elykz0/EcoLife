import { useState } from 'react';

const SOLUTIONS = [
  // Water – DIY
  {
    id: 1, icon: '🪣', category: 'water', type: 'diy',
    title: 'DIY Rain Barrel',
    desc: 'Capture roof runoff in a 55-gallon barrel. Connect to a downspout with a $15 diverter kit. Saves 1,300+ gallons per month in rainy seasons.',
    tags: ['diy', 'water', 'free'],
    url: 'https://www.epa.gov/soakuptherain/soak-rain-rain-barrels',
    urlLabel: 'EPA Guide',
  },
  {
    id: 2, icon: '🚿', category: 'water', type: 'diy',
    title: 'Bucket Shower Method',
    desc: 'Place a 5-gallon bucket in the shower while it warms. Use that water to flush toilets or water plants. Saves 2–3 gallons per shower with zero cost.',
    tags: ['diy', 'water', 'free'],
    url: 'https://www.home-water-works.org/indoor-use/showers',
    urlLabel: 'Water Use Guide',
  },
  {
    id: 3, icon: '🌧️', category: 'water', type: 'diy',
    title: 'Laundry-to-Landscape Greywater',
    desc: 'Re-route your washing machine\'s drain hose to irrigate trees and shrubs directly. No pump needed. Diverts 10,000–40,000 gallons per year.',
    tags: ['diy', 'water'],
    url: 'https://oehha.ca.gov/calenviroscreen/report/greywater',
    urlLabel: 'Greywater Guide',
  },
  // Water – Buy
  {
    id: 4, icon: '🔧', category: 'water', type: 'buy',
    title: 'Low-Flow Showerhead',
    desc: 'EPA WaterSense showerheads use ≤1.8 GPM vs. 2.5 GPM standard. Saves 2,900 gallons/year per person. Typically $20–$50, payback in weeks.',
    tags: ['buy', 'water'],
    url: 'https://www.epa.gov/watersense/showerheads',
    urlLabel: 'Find WaterSense Products',
  },
  {
    id: 5, icon: '🌿', category: 'water', type: 'buy',
    title: 'Smart Irrigation Controller',
    desc: 'Wi-Fi controllers (Rachio, RainBird) adjust watering based on local weather. Cut outdoor water use 30–50%. Tax rebates available in many states.',
    tags: ['buy', 'water'],
    url: 'https://www.epa.gov/watersense/controllers',
    urlLabel: 'WaterSense Irrigation',
  },
  // Electricity – DIY
  {
    id: 6, icon: '🔌', category: 'electricity', type: 'diy',
    title: 'Power Strip Audit',
    desc: 'Walk every room and plug entertainment/home office electronics into a single smart power strip. Set it to cut standby power. Free if you already have strips.',
    tags: ['diy', 'electricity', 'free'],
    url: 'https://www.energy.gov/energysaver/articles/3-types-power-strips',
    urlLabel: 'Energy.gov Guide',
  },
  {
    id: 7, icon: '🌡️', category: 'electricity', type: 'diy',
    title: 'Weather Stripping + Caulk',
    desc: 'Air sealing doors and windows is the highest ROI home improvement. A $20 caulk gun and rolls of foam stripping can cut HVAC use 10–15%. Takes an afternoon.',
    tags: ['diy', 'electricity'],
    url: 'https://www.energy.gov/energysaver/air-sealing-your-home',
    urlLabel: 'Air Sealing Guide',
  },
  // Electricity – Buy
  {
    id: 8, icon: '💡', category: 'electricity', type: 'buy',
    title: 'LED Bulb Replacement',
    desc: 'Philips, GE, and Cree LEDs cost $2–$8 each and last 15,000+ hours. Replacing 10 bulbs saves $150–$200/year. Look for ENERGY STAR certification.',
    tags: ['buy', 'electricity'],
    url: 'https://www.energystar.gov/products/lighting_fans/light_bulbs',
    urlLabel: 'ENERGY STAR Bulbs',
  },
  {
    id: 9, icon: '🏠', category: 'electricity', type: 'buy',
    title: 'Smart Thermostat',
    desc: 'Nest, Ecobee, and Honeywell smart thermostats learn your schedule and save an average $130/year on HVAC. Many utilities offer $50–$100 instant rebates.',
    tags: ['buy', 'electricity'],
    url: 'https://www.energystar.gov/products/heating_cooling/smart_thermostats',
    urlLabel: 'ENERGY STAR Thermostats',
  },
  {
    id: 10, icon: '☀️', category: 'electricity', type: 'buy',
    title: 'Rooftop Solar',
    desc: 'Average system (6kW) costs $15,000–$20,000 before the 30% federal tax credit. Payback is 7–10 years; panels last 25–30 years. Use EnergySage to compare quotes.',
    tags: ['buy', 'electricity'],
    url: 'https://www.energysage.com',
    urlLabel: 'Get Solar Quotes',
  },
  // Food – DIY
  {
    id: 11, icon: '♻️', category: 'food', type: 'diy',
    title: 'Hot Compost Pile',
    desc: '3 parts brown : 1 part green, keep moist, turn every 3 days. Finished in 3 weeks. Accepts most kitchen scraps, yard waste. Needs outdoor space.',
    tags: ['diy', 'food', 'free'],
    url: 'https://www.epa.gov/recycle/composting-home',
    urlLabel: 'EPA Composting Guide',
  },
  {
    id: 12, icon: '🪱', category: 'food', type: 'diy',
    title: 'Worm Bin (Vermicompost)',
    desc: 'Build a 2-bin system from $10 in supplies. Red wigglers eat half their weight in scraps per day. Produces worm castings — the richest natural fertilizer — with no odor.',
    tags: ['diy', 'food', 'free'],
    url: 'https://composting.ces.ncsu.edu/vermicomposting/',
    urlLabel: 'Vermicompost Guide',
  },
  {
    id: 13, icon: '🧪', category: 'food', type: 'diy',
    title: 'Bokashi Fermentation',
    desc: 'Ferment ALL food scraps including meat and dairy in an airtight bucket with bokashi bran. Ready in 2 weeks, then bury or add to compost. Great for apartments.',
    tags: ['diy', 'food'],
    url: 'https://extension.usu.edu/yardandgarden/research/bokashi-composting',
    urlLabel: 'Bokashi How-To',
  },
  // Food – Buy
  {
    id: 14, icon: '🗑️', category: 'food', type: 'buy',
    title: 'Electric Composter (Lomi)',
    desc: 'Lomi turns scraps into compost in 4–6 hours — fully indoors, no odor. $500 upfront. Best for people without outdoor space or who want the fastest results.',
    tags: ['buy', 'food'],
    url: 'https://lomi.com',
    urlLabel: 'Lomi Electric Composter',
  },
  {
    id: 15, icon: '🌱', category: 'food', type: 'buy',
    title: 'Curbside Compost Service',
    desc: 'Many cities and private services collect food scraps weekly. Search your city + "food scrap pickup." Average $10–$30/month; some cities do it free.',
    tags: ['buy', 'food'],
    url: 'https://www.findacomposter.com',
    urlLabel: 'Find Local Composters',
  },
  {
    id: 16, icon: '🏙️', category: 'food', type: 'buy',
    title: 'Drop-Off Composting Network',
    desc: 'ShareWaste connects households with nearby compost hosts who accept scraps for free. Also check Farmers Markets — many run free scrap collection programs.',
    tags: ['free', 'food'],
    url: 'https://sharewaste.com',
    urlLabel: 'ShareWaste Map',
  },
];

const FILTERS = [
  { key: 'all', label: 'All Solutions' },
  { key: 'water', label: '💧 Water' },
  { key: 'electricity', label: '⚡ Energy' },
  { key: 'food', label: '🍃 Food Waste' },
  { key: 'diy', label: '🔨 DIY' },
  { key: 'buy', label: '🛒 Buy' },
  { key: 'free', label: '✅ Free' },
];

export default function Solutions() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = SOLUTIONS.filter(s => {
    if (activeFilter === 'all') return true;
    if (s.category === activeFilter || s.type === activeFilter) return true;
    if (s.tags.includes(activeFilter)) return true;
    return false;
  });

  return (
    <div>
      <div className="page-header">
        <h2>Solutions & Resources</h2>
        <p>Practical actions — DIY projects, products to buy, and free community programs</p>
      </div>

      <div className="solutions-filter">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`filter-btn ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 8, fontSize: '0.82rem', color: 'var(--gray-400)' }}>
        {filtered.length} solution{filtered.length !== 1 ? 's' : ''}
      </div>

      <div className="card-grid card-grid-2">
        {filtered.map(s => (
          <div key={s.id} className="solution-card">
            <div className="solution-header">
              <span className="solution-icon">{s.icon}</span>
              <div className="solution-meta">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
            <div className="solution-tags">
              {s.tags.map(t => (
                <span key={t} className={`tag tag-${t}`}>{t}</span>
              ))}
            </div>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="solution-link">
              {s.urlLabel} →
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 40 }}>
          No solutions match that filter. Try a different category.
        </div>
      )}
    </div>
  );
}
