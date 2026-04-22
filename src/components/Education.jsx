import { useState } from 'react';

const CONTENT = {
  water: [
    {
      title: 'The True Cost of a Dripping Faucet',
      body: 'A faucet dripping once per second wastes over 3,000 gallons per year — enough to fill 50 bathtubs. The fix is usually a $3 rubber washer. Check under every sink and replace worn washers to stop silent waste.',
      impact: 'high',
    },
    {
      title: 'Shorten Showers, Not Your Life',
      body: 'The average American shower uses 2 gallons per minute. Cutting 4 minutes per day saves nearly 3,000 gallons a year per person. A shower timer, waterproof radio, or a playlist can make it automatic.',
      impact: 'high',
    },
    {
      title: 'Harvest Rainwater for Free Irrigation',
      body: 'A rain barrel under your downspout captures runoff that would otherwise flow to storm drains. A 55-gallon barrel can fill in a single rainstorm and water a garden for weeks. Check your local ordinances — many areas even offer rebates.',
      impact: 'med',
    },
    {
      title: 'Greywater Systems',
      body: 'Greywater — water from sinks, showers, and washing machines — can be safely reused to irrigate trees, shrubs, and lawns. A simple laundry-to-landscape system costs under $50 in materials and diverts 10,000–40,000 gallons per year.',
      impact: 'high',
    },
    {
      title: 'Dishwashers vs. Hand Washing',
      body: 'A full, efficient dishwasher uses 3–5 gallons. Washing the same dishes by hand uses 15–27 gallons. Always run full loads, skip the heated dry cycle, and let dishes air dry.',
      impact: 'med',
    },
    {
      title: 'Native Plants Cut Outdoor Water Use by 60%',
      body: 'Lawns consume 30–60% of household water in summer. Replacing even a portion of your turf with drought-tolerant native plants eliminates most irrigation need while supporting local pollinators.',
      impact: 'high',
    },
  ],
  electricity: [
    {
      title: 'Vampire Power: What\'s Always On',
      body: 'Devices in standby mode — TVs, microwaves, gaming consoles, phone chargers — collectively waste 10% of US household electricity. Smart power strips cut standby draw to zero and can save $100–$200 per year.',
      impact: 'med',
    },
    {
      title: 'LED Bulbs: The Fastest ROI in Your Home',
      body: 'LED bulbs use 75–90% less energy than incandescent and last 15–25 years. A single 60W incandescent replaced by a 9W LED saves about $55 over its lifetime. Replacing 15 bulbs saves over $800.',
      impact: 'high',
    },
    {
      title: 'Smart Thermostats Save 10–15% on HVAC',
      body: 'Heating and cooling account for ~50% of home energy. A programmable or smart thermostat automatically adjusts temperature when you sleep or leave, saving an average of $130/year with no lifestyle change.',
      impact: 'high',
    },
    {
      title: 'Air Seal and Insulate First',
      body: 'Before buying solar panels or upgrading appliances, seal air leaks around windows, doors, and outlets. Proper insulation is 2–4x more cost-effective than solar panels at reducing your energy bill.',
      impact: 'high',
    },
    {
      title: 'Time-of-Use Pricing',
      body: 'Many utilities charge less during off-peak hours (nights and weekends). Running dishwashers, washing machines, and EV chargers during these windows can cut electricity costs 20–50%. Check if your utility offers a TOU rate.',
      impact: 'med',
    },
    {
      title: 'Solar + Battery Basics',
      body: 'Rooftop solar produces roughly 1kWh per 1–2 square feet of panel per day in sunny climates. Paired with a home battery, you can cover most usage and earn credits selling excess back to the grid.',
      impact: 'high',
    },
  ],
  food: [
    {
      title: 'Hot Composting: 3 Weeks to Finished Compost',
      body: 'Hot composting — balancing 3 parts brown material (cardboard, dry leaves) to 1 part green (food scraps, grass) and turning the pile every 3 days — generates heat that kills weed seeds and produces finished compost in as little as 18–21 days.',
      impact: 'high',
    },
    {
      title: 'Worm Bins for Apartment Composting',
      body: 'Vermicomposting uses red wiggler worms to process kitchen scraps in a small, odor-free bin. A 2-tray system handles scraps from 1–2 people and produces castings — the most potent natural fertilizer — in 2–3 months.',
      impact: 'high',
    },
    {
      title: 'Food Waste by the Numbers',
      body: 'The US wastes about 40% of its food supply — 80 billion pounds per year. Household food waste generates methane in landfills equivalent to 37 million cars. Meal planning, FIFO storage, and composting all cut this significantly.',
      impact: 'high',
    },
    {
      title: 'Bokashi: Ferment Everything',
      body: 'Unlike traditional composting, Bokashi ferments all food scraps including meat, dairy, and cooked food. You add an inoculant (bran coated with beneficial microbes), seal the bucket, and in 2 weeks the fermented material can go directly into soil or a compost pile.',
      impact: 'med',
    },
    {
      title: 'Freezing Scraps Before Composting',
      body: 'If you can\'t compost immediately, freeze kitchen scraps in a bag. Freezing breaks down cell walls and speeds decomposition when you eventually add them to your compost pile. It also eliminates odors and fruit flies indoors.',
      impact: 'low',
    },
    {
      title: 'Compost Tea: Supercharge Your Garden',
      body: 'Compost tea is made by steeping finished compost in water for 24–36 hours with an aquarium bubbler. The liquid feeds soil microbiota, suppresses foliar diseases, and is 5–10x more effective than spreading dry compost alone.',
      impact: 'low',
    },
  ],
};

const CATEGORY_META = {
  water: { label: 'Water Conservation', icon: '💧', color: 'var(--blue)' },
  electricity: { label: 'Energy Efficiency', icon: '⚡', color: 'var(--yellow)' },
  food: { label: 'Food Waste & Composting', icon: '🍃', color: 'var(--brown)' },
};

const IMPACT_LABEL = { high: 'High Impact', med: 'Medium Impact', low: 'Low Impact' };

export default function Education() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const categories = activeCategory === 'all'
    ? Object.keys(CONTENT)
    : [activeCategory];

  return (
    <div>
      <div className="page-header">
        <h2>Learn & Improve</h2>
        <p>Science-backed strategies to reduce your environmental footprint at home</p>
      </div>

      <div className="solutions-filter">
        {[['all', 'All Topics', '🌍'], ['water', 'Water', '💧'], ['electricity', 'Energy', '⚡'], ['food', 'Food Waste', '🍃']].map(([k, label, icon]) => (
          <button
            key={k}
            className={`filter-btn ${activeCategory === k ? 'active' : ''}`}
            onClick={() => setActiveCategory(k)}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {categories.map(cat => (
        <div key={cat} className="edu-category">
          <h3>
            <span>{CATEGORY_META[cat].icon}</span>
            {CATEGORY_META[cat].label}
          </h3>
          {CONTENT[cat].map((tip, i) => {
            const id = `${cat}-${i}`;
            const expanded = expandedId === id;
            return (
              <div
                key={id}
                className={`tip-card ${cat}`}
                onClick={() => setExpandedId(expanded ? null : id)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ flex: 1 }}>{tip.title}</h4>
                  <span style={{ color: 'var(--gray-400)', marginLeft: 8, fontSize: '0.85rem' }}>{expanded ? '▲' : '▼'}</span>
                </div>
                {expanded && <p style={{ marginTop: 8 }}>{tip.body}</p>}
                <span className={`impact-pill impact-${tip.impact}`}>{IMPACT_LABEL[tip.impact]}</span>
              </div>
            );
          })}
        </div>
      ))}

      <div className="card" style={{ background: 'var(--green-pale)', border: '1.5px solid var(--green-light)' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--green-dark)', marginBottom: 8 }}>
          Did you know?
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)', lineHeight: 1.6 }}>
          If every US household composted their food scraps, diverted their greywater, and switched to LED lighting,
          we would eliminate the equivalent of 140 million tons of CO₂ annually — more than the entire airline industry.
          Small household actions, multiplied by millions of homes, reshape the climate trajectory.
        </p>
      </div>
    </div>
  );
}
