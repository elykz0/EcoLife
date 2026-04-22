import { useState } from 'react';

const CONTENT = {
  water: [
    { title: 'Fix leaky faucets — 3,000 gallons a year at stake', body: 'A faucet dripping once per second wastes over 3,000 gallons per year. The fix is usually a $3 rubber washer. Check under every sink and replace worn washers — it takes under 20 minutes.', impact: 'high' },
    { title: 'Shorten showers by 4 minutes, save 3,000 gallons', body: 'The average American shower uses 2 gallons per minute. Cutting 4 minutes per day saves nearly 3,000 gallons a year per person. A shower timer or fixed-length playlist can make it automatic.', impact: 'high' },
    { title: 'Harvest rainwater with a $15 barrel diverter', body: 'A rain barrel under your downspout captures runoff that would otherwise flow to storm drains. A 55-gallon barrel can fill in a single rainstorm and water a garden for weeks. Many municipalities offer rebates.', impact: 'med' },
    { title: 'Greywater systems: reuse sink and laundry water', body: 'Greywater from sinks, showers, and washing machines can be safely reused to irrigate trees, shrubs, and lawns. A laundry-to-landscape system costs under $50 in materials and diverts 10,000–40,000 gallons per year.', impact: 'high' },
    { title: 'Dishwashers beat hand-washing by 5× on water', body: 'A full efficient dishwasher uses 3–5 gallons. Washing the same dishes by hand uses 15–27 gallons. Always run full loads and skip the heated dry cycle.', impact: 'med' },
    { title: 'Native plants cut outdoor irrigation by 60%', body: 'Lawns consume 30–60% of household water in summer. Replacing even a portion of turf with drought-tolerant native plants eliminates most irrigation need while supporting local pollinators.', impact: 'high' },
  ],
  electricity: [
    { title: 'Vampire power drains 10% of your bill while you sleep', body: 'Devices in standby mode — TVs, microwaves, gaming consoles, phone chargers — collectively waste 10% of US household electricity. Smart power strips cut standby draw to zero and can save $100–$200 per year.', impact: 'med' },
    { title: 'LED bulbs: 75% less energy, 25× longer lifespan', body: 'LED bulbs use 75–90% less energy than incandescent and last 15–25 years. A single 60W incandescent replaced by a 9W LED saves about $55 over its lifetime. Replacing 15 bulbs saves over $800.', impact: 'high' },
    { title: 'Smart thermostats save $130/year on average', body: 'Heating and cooling account for ~50% of home energy. A programmable or smart thermostat automatically adjusts temperature when you sleep or leave, saving an average of $130/year with no lifestyle change.', impact: 'high' },
    { title: 'Air sealing outperforms solar panels on cost per kWh saved', body: 'Before buying solar panels or upgrading appliances, seal air leaks around windows, doors, and outlets. Proper insulation is 2–4x more cost-effective than solar panels at reducing your energy bill.', impact: 'high' },
    { title: 'Time-of-use pricing can cut electricity costs 20–50%', body: 'Many utilities charge less during off-peak hours (nights and weekends). Running dishwashers, washing machines, and EV chargers during these windows can cut electricity costs significantly. Check if your utility offers a TOU rate.', impact: 'med' },
    { title: 'Solar + battery: the economics in 2025', body: 'Rooftop solar produces roughly 1kWh per 1–2 square feet of panel per day in sunny climates. Paired with a home battery, you can cover most usage and earn credits selling excess back to the grid. The 30% federal tax credit runs through 2032.', impact: 'high' },
  ],
  food: [
    { title: 'Hot composting: finished in 21 days', body: 'Balance 3 parts brown material (cardboard, dry leaves) to 1 part green (food scraps, grass) and turn the pile every 3 days. Heat kills weed seeds and pathogens. Finished compost in 18–21 days.', impact: 'high' },
    { title: 'Worm bins: apartment-scale composting with no odor', body: 'Vermicomposting uses red wiggler worms to process kitchen scraps in a small bin. A 2-tray system handles scraps from 1–2 people and produces worm castings — the most potent natural fertilizer — in 2–3 months.', impact: 'high' },
    { title: '40% of US food is wasted — the equivalent of 37 million cars', body: 'Household food waste generates methane in landfills equivalent to 37 million cars annually. Meal planning, FIFO storage, and composting all cut this significantly.', impact: 'high' },
    { title: 'Bokashi ferments meat and dairy — traditional composting cannot', body: 'Unlike traditional composting, Bokashi ferments all food scraps including meat, dairy, and cooked food. You add an inoculant, seal the bucket, and in 2 weeks the fermented material can go directly into soil.', impact: 'med' },
    { title: 'Freeze scraps until your bin is ready', body: 'If you cannot compost immediately, freeze kitchen scraps in a sealed bag. Freezing breaks down cell walls and speeds decomposition when you add them to the pile. It also eliminates odors and fruit flies.', impact: 'low' },
    { title: 'Compost tea amplifies garden impact 5–10×', body: 'Steep finished compost in water for 24–36 hours with an aquarium bubbler. The liquid feeds soil microbiota, suppresses foliar diseases, and is 5–10x more effective than spreading dry compost alone.', impact: 'low' },
  ],
};

const GROUPS = {
  water:       { label: 'Water Conservation', color: '#1a6fa8', bg: '#e8f3fa' },
  electricity: { label: 'Energy Efficiency',  color: '#b86000', bg: '#fef3e2' },
  food:        { label: 'Food Waste',          color: '#7a4a2a', bg: '#f5ede5' },
};

const IMPACT = {
  high: { label: 'High impact', bg: '#e6f4ec', color: '#1e6641' },
  med:  { label: 'Medium impact', bg: '#fef3e2', color: '#b86000' },
  low:  { label: 'Lower impact', bg: '#f4f6f4', color: '#4a5e4a' },
};

export default function Education() {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);

  const cats = filter === 'all' ? Object.keys(CONTENT) : [filter];

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <h2>Learn</h2>
          <p>Science-backed strategies to reduce your footprint at home</p>
        </div>
      </div>

      <div className="edu-filter">
        {[['all', 'All Topics'], ['water', 'Water'], ['electricity', 'Energy'], ['food', 'Food Waste']].map(([k, label]) => (
          <button key={k} className={`filter-chip ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>
            {label}
          </button>
        ))}
      </div>

      {cats.map(cat => (
        <div key={cat} className="edu-group">
          <div className="edu-group-header">
            <div className="edu-group-icon" style={{ background: GROUPS[cat].bg }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={GROUPS[cat].color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {cat === 'water' && <><path d="M12 2C6 2 2 10 2 14a10 10 0 0020 0c0-4-4-12-10-12z"/></>}
                {cat === 'electricity' && <><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>}
                {cat === 'food' && <><path d="M17 8C8 10 5.9 16.17 3.82 19.26a.76.76 0 001.09 1C7 19 9 18 11 18c4 0 8-2 10-8-1 0-2.5.5-4 2z"/><path d="M3.82 19.26L12 12"/></>}
              </svg>
            </div>
            <div className="edu-group-title">{GROUPS[cat].label}</div>
          </div>

          {CONTENT[cat].map((tip, i) => {
            const id = `${cat}-${i}`;
            const isOpen = open === id;
            const imp = IMPACT[tip.impact];
            return (
              <div
                key={id}
                className="edu-card"
                style={{ borderLeftColor: GROUPS[cat].color }}
                onClick={() => setOpen(isOpen ? null : id)}
              >
                <div className="edu-card-top">
                  <h4>{tip.title}</h4>
                  <span className="edu-card-arrow">{isOpen ? '▲' : '▼'}</span>
                </div>
                {isOpen && <div className="edu-card-body">{tip.body}</div>}
                <span className="impact-tag" style={{ background: imp.bg, color: imp.color }}>{imp.label}</span>
              </div>
            );
          })}
        </div>
      ))}

      <div className="card" style={{ background: 'var(--accent-light)', borderColor: 'rgba(52,201,116,0.3)' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)', marginBottom: 8 }}>By the numbers</div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          If every US household composted food scraps, diverted greywater, and switched to LED lighting,
          we would eliminate the equivalent of 140 million tons of CO2 annually — more than the entire airline industry.
          Small household actions, multiplied by millions of homes, reshape the climate trajectory.
        </p>
      </div>
    </div>
  );
}
