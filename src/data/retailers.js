// Retailer data parsed from OLCC Cannabis Business Licenses
// Includes relationship health, journey stages, and performance data

// Oregon city coordinates for geocoding
const oregonCities = {
  'PORTLAND': { lat: 45.5152, lng: -122.6784 },
  'EUGENE': { lat: 44.0521, lng: -123.0868 },
  'SALEM': { lat: 44.9429, lng: -123.0351 },
  'BEND': { lat: 44.0582, lng: -121.3153 },
  'MEDFORD': { lat: 42.3265, lng: -122.8756 },
  'CORVALLIS': { lat: 44.5646, lng: -123.2620 },
  'ALBANY': { lat: 44.6366, lng: -123.1059 },
  'SPRINGFIELD': { lat: 44.0462, lng: -123.0220 },
  'GRANTS PASS': { lat: 42.4390, lng: -123.3284 },
  'ASHLAND': { lat: 42.1946, lng: -122.7095 },
  'ROSEBURG': { lat: 43.2165, lng: -123.3417 },
  'BEAVERTON': { lat: 45.4871, lng: -122.8037 },
  'HILLSBORO': { lat: 45.5229, lng: -122.9898 },
  'TIGARD': { lat: 45.4312, lng: -122.7715 },
  'LAKE OSWEGO': { lat: 45.4207, lng: -122.6706 },
  'KEIZER': { lat: 44.9901, lng: -123.0262 },
  'REDMOND': { lat: 44.2726, lng: -121.1739 },
  'HOOD RIVER': { lat: 45.7054, lng: -121.5215 },
  'THE DALLES': { lat: 45.5946, lng: -121.1787 },
  'BROOKINGS': { lat: 42.0526, lng: -124.2840 },
  'COOS BAY': { lat: 43.3665, lng: -124.2179 },
  'NEWPORT': { lat: 44.6368, lng: -124.0534 },
  'LINCOLN CITY': { lat: 44.9582, lng: -124.0177 },
  'FLORENCE': { lat: 43.9826, lng: -124.0999 },
  'ASTORIA': { lat: 46.1879, lng: -123.8313 },
  'SEASIDE': { lat: 45.9932, lng: -123.9226 },
  'CANNON BEACH': { lat: 45.8918, lng: -123.9615 },
  'TILLAMOOK': { lat: 45.4562, lng: -123.8426 },
  'NEWBERG': { lat: 45.3007, lng: -122.9733 },
  'MCMINNVILLE': { lat: 45.2101, lng: -123.1986 },
  'SILVERTON': { lat: 45.0054, lng: -122.7831 },
  'DALLAS': { lat: 44.9193, lng: -123.3170 },
  'MONMOUTH': { lat: 44.8487, lng: -123.2340 },
  'INDEPENDENCE': { lat: 44.8512, lng: -123.1868 },
  'COTTAGE GROVE': { lat: 43.7979, lng: -123.0595 },
  'CRESWELL': { lat: 43.9179, lng: -123.0245 },
  'JUNCTION CITY': { lat: 44.2193, lng: -123.2054 },
  'KLAMATH FALLS': { lat: 42.2249, lng: -121.7817 },
  'ONTARIO': { lat: 44.0266, lng: -116.9629 },
  'LA GRANDE': { lat: 45.3245, lng: -118.0877 },
  'PENDLETON': { lat: 45.6721, lng: -118.7886 },
  'HERMISTON': { lat: 45.8404, lng: -119.2895 },
  'HINES': { lat: 43.5632, lng: -119.0812 },
  'BURNS': { lat: 43.5863, lng: -119.0541 },
};

// County to region mapping
const countyToRegion = {
  'Multnomah': 'Portland Metro',
  'Washington': 'Portland Metro',
  'Clackamas': 'Portland Metro',
  'Marion': 'Willamette Valley',
  'Lane': 'Willamette Valley',
  'Linn': 'Willamette Valley',
  'Benton': 'Willamette Valley',
  'Polk': 'Willamette Valley',
  'Yamhill': 'Willamette Valley',
  'Jackson': 'Southern Oregon',
  'Josephine': 'Southern Oregon',
  'Douglas': 'Southern Oregon',
  'Deschutes': 'Central Oregon',
  'Jefferson': 'Central Oregon',
  'Crook': 'Central Oregon',
  'Lincoln': 'Coast',
  'Tillamook': 'Coast',
  'Coos': 'Coast',
  'Curry': 'Coast',
  'Clatsop': 'Coast',
  'Harney': 'Eastern Oregon',
  'Malheur': 'Eastern Oregon',
  'Umatilla': 'Eastern Oregon',
  'Union': 'Eastern Oregon',
  'Baker': 'Eastern Oregon',
  'Wallowa': 'Eastern Oregon',
  'Grant': 'Eastern Oregon',
  'Wheeler': 'Eastern Oregon',
  'Gilliam': 'Eastern Oregon',
  'Sherman': 'Eastern Oregon',
  'Wasco': 'Eastern Oregon',
  'Hood River': 'Central Oregon',
  'Klamath': 'Southern Oregon',
  'Lake': 'Eastern Oregon',
};

// Journey stages
const journeyStages = ['prospect', 'first_order', 'trial', 'growing', 'established', 'champion'];

// Health categories
const healthCategories = {
  thriving: { min: 80, max: 100 },
  healthy: { min: 60, max: 79 },
  needs_attention: { min: 40, max: 59 },
  at_risk: { min: 20, max: 39 },
  churned: { min: 0, max: 19 },
};

// Generate deterministic pseudo-random number from string
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Extract city from address
function extractCity(address) {
  if (!address) return 'PORTLAND';
  const upper = address.toUpperCase();
  for (const city of Object.keys(oregonCities)) {
    if (upper.includes(city)) return city;
  }
  return 'PORTLAND';
}

// Generate coordinates with slight offset for uniqueness
function getCoordinates(address, id) {
  const city = extractCity(address);
  const base = oregonCities[city] || oregonCities['PORTLAND'];
  const hash = hashCode(id);
  const offsetLat = (seededRandom(hash) - 0.5) * 0.05;
  const offsetLng = (seededRandom(hash + 1) - 0.5) * 0.05;
  return {
    lat: base.lat + offsetLat,
    lng: base.lng + offsetLng,
  };
}

// Sample products for performance data
const productCategories = ['Flower', 'Pre-Rolls', 'Cartridges', 'Edibles', 'Concentrates'];
const productTypes = ['Indica', 'Hybrid', 'Sativa'];

// Generate performance data for a retailer
function generatePerformance(id, healthScore) {
  const hash = hashCode(id);
  const categories = {};
  const types = {};

  productCategories.forEach((cat, i) => {
    const carried = seededRandom(hash + i * 10) > 0.2; // 80% chance of carrying
    if (carried) {
      const baseUnits = Math.floor(seededRandom(hash + i * 20) * 100) + 20;
      const trend = (seededRandom(hash + i * 30) - 0.5) * 50; // -25% to +25%
      categories[cat] = {
        units: baseUnits,
        wholesale: baseUnits * (15 + Math.floor(seededRandom(hash + i * 40) * 20)),
        trend: Math.round(trend),
        velocity: Math.round(baseUnits / 4), // per week
      };
    }
  });

  productTypes.forEach((type, i) => {
    const baseUnits = Math.floor(seededRandom(hash + i * 100) * 80) + 10;
    const trend = (seededRandom(hash + i * 110) - 0.5) * 40;
    types[type] = {
      units: baseUnits,
      wholesale: baseUnits * 25,
      trend: Math.round(trend),
      share: 0, // calculated later
    };
  });

  // Calculate type shares
  const totalTypeUnits = Object.values(types).reduce((sum, t) => sum + t.units, 0);
  Object.keys(types).forEach(type => {
    types[type].share = Math.round((types[type].units / totalTypeUnits) * 100);
  });

  return { categories, types };
}

// Generate order history
function generateOrderHistory(id, healthScore) {
  const hash = hashCode(id);
  const orders = [];
  const baseValue = 800 + Math.floor(seededRandom(hash) * 1200);

  for (let i = 0; i < 6; i++) {
    const daysAgo = 14 * i + Math.floor(seededRandom(hash + i) * 7);
    const variance = (seededRandom(hash + i * 2) - 0.5) * 0.4;
    const value = Math.round(baseValue * (1 + variance));

    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    orders.push({
      date: date.toISOString().split('T')[0],
      value,
      items: Math.floor(value / 30),
    });
  }

  return orders.reverse();
}

// Generate contacts
const firstNames = ['Mike', 'Sarah', 'James', 'Lisa', 'David', 'Maria', 'Chris', 'Amy', 'Tom', 'Jessica'];
const roles = ['Buyer', 'Owner', 'Manager', 'Purchasing Director'];

function generateContacts(id) {
  const hash = hashCode(id);
  const numContacts = 1 + Math.floor(seededRandom(hash) * 2);
  const contacts = [];

  for (let i = 0; i < numContacts; i++) {
    contacts.push({
      name: firstNames[Math.floor(seededRandom(hash + i * 50) * firstNames.length)],
      role: roles[Math.floor(seededRandom(hash + i * 51) * roles.length)],
      preferredTime: seededRandom(hash + i * 52) > 0.5 ? 'morning' : 'afternoon',
    });
  }

  return contacts;
}

// Sample visit notes
const visitNotes = [
  "Interested in trying new Indica strains",
  "Asked about bulk pricing for flower",
  "Mentioned competitor visited last week",
  "Expanding to second location soon",
  "Wants to increase Pre-Roll selection",
  "Looking for higher THC options",
  "Concerned about delivery times",
  "Very happy with product quality",
  "Asked about edibles samples",
  "Budget constraints this quarter",
];

// Raw OLCC retailer data (parsed from CSV)
const olccRetailers = [
  { license: "050-3041", name: "Nectar", business: "NECTAR MARKETS, LLC", address: "510 NW 11TH AVE PORTLAND OR 97209-3204", county: "Multnomah" },
  { license: "050-3049", name: "Nectar", business: "NECTAR MARKETS, LLC", address: "8201 SE POWELL BLVD STE F, PORTLAND OR 97266-2059", county: "Multnomah" },
  { license: "050-3054", name: "Smooth Roots Multnomah", business: "SR OREGON MULTNOMAH LLC", address: "3005 SW MULTNOMAH BLVD PORTLAND OR 97219-3701", county: "Multnomah" },
  { license: "050-3059", name: "Tumbleweed Cannabis Co.", business: "NEW FRONTIER LLC", address: "310 HIGHWAY 20 N HINES OR 97738", county: "Harney" },
  { license: "050-3134", name: "High Lakes Cannabis Company", business: "HIGH LAKES CANNABIS COMPANY LLC", address: "593 JACKSON ST E MONMOUTH OR 97361-1513", county: "Polk" },
  { license: "050-3480", name: "The Farmers Daughters", business: "THE FARMERS DAUGHTERS DISPENSARY LLC", address: "1025 CHETCO AVE # 4, BROOKINGS OR 97415-7152", county: "Curry" },
  { license: "050-3658", name: "Stone Age Farmacy", business: "NEW FRONTIER LLC", address: "8621 SW CANYON DR PORTLAND OR 97225-3436", county: "Washington" },
  { license: "050-3716", name: "Emerald Triangle Dispensary", business: "ZACHARY KOHLER", address: "3388 MERLIN RD GRANTS PASS OR 97526-8421", county: "Josephine" },
  { license: "050-3727", name: "Mr. Nice Guy Portland", business: "MNG HOLDINGS, LLC", address: "6330 SW BEAVERTON HILLSDALE HWY PORTLAND OR 97221-4220", county: "Multnomah" },
  { license: "050-3748", name: "Angel Store", business: "MARKET STREET, LLC", address: "633 MARKET ST STE 100, MEDFORD OR 97504-6162", county: "Jackson" },
  { license: "050-3779", name: "GM Dispensary", business: "ARBON ENTERPRISES, INC", address: "12745 SW WALKER RD STE 100A BEAVERTON OR 97005-1318", county: "Washington" },
  { license: "050-3898", name: "Broadway Cannabis Market", business: "BROADWAY PROJECT, INC.", address: "5035 SE MCLOUGHLIN BLVD PORTLAND OR 97202-4817", county: "Multnomah" },
  { license: "050-3904", name: "Minions", business: "MINIONS LLC", address: "3700 RIVER RD N STE 9, KEIZER OR 97303-5657", county: "Marion" },
  { license: "050-3915", name: "Stinkin Budz", business: "SWEET ANGEL LLC", address: "1040 COMMERCIAL ST SE SALEM OR 97302-4112", county: "Marion" },
  { license: "050-4560", name: "ADNA", business: "NEW FRONTIER LLC", address: "1681 W 7TH AVE EUGENE OR 97402-4309", county: "Lane" },
  { license: "050-4747", name: "Twenty After Four Wellness", business: "420 BLAIR BLVD.CORP", address: "420 BLAIR BLVD UNIT A, EUGENE OR 97402-4393", county: "Lane" },
  { license: "050-4903", name: "Verdaze", business: "MGF HOLDINGS LLC", address: "7501 SW CAPITOL HWY STE A, PORTLAND OR 97219-2434", county: "Multnomah" },
  { license: "050-5503", name: "Sensible Cannabis Company", business: "PAC NW VENTURES LLC", address: "1917 SE 7TH AVE PORTLAND OR 97214-4601", county: "Multnomah" },
  { license: "050-5608", name: "Home Grown Apothecary", business: "CELESTIAL LION LLC.", address: "1937 NE PACIFIC ST PORTLAND OR 97232-2211", county: "Multnomah" },
  { license: "050-5727", name: "Treehouse Dispensary", business: "TREEHOUSE COLLECTIVE, LLC", address: "1637 PEARL ST EUGENE OR 97401-2722", county: "Lane" },
  { license: "050-5831", name: "Cannabis Nation", business: "CANNABIS NATION INC", address: "10935 SE CHERRY BLOSSOM DR PORTLAND OR 97216-3167", county: "Multnomah" },
  { license: "050-5954", name: "The Green Planet", business: "GREEN PLANET VENTURES, LLC", address: "5915 NE WIN SIVERS DR PORTLAND OR 97220", county: "Multnomah" },
  { license: "050-6012", name: "Oregon Bud Company", business: "OREGON BUD COMPANY LLC", address: "12190 SW SCHOLLS FERRY RD TIGARD OR 97223", county: "Washington" },
  { license: "050-6134", name: "Electric Lettuce", business: "SERRA DISPENSARY LLC", address: "220 SE SPOKANE ST PORTLAND OR 97202", county: "Multnomah" },
  { license: "050-6256", name: "Chalice Farms", business: "CHALICE FARMS LLC", address: "2636 E BURNSIDE ST PORTLAND OR 97214", county: "Multnomah" },
  { license: "050-6378", name: "Oregrown", business: "OREGROWN INDUSTRIES LLC", address: "1199 NW WALL ST BEND OR 97703", county: "Deschutes" },
  { license: "050-6500", name: "Miracle Greens", business: "MIRACLE GREENS LLC", address: "1234 NW GALVESTON AVE BEND OR 97701", county: "Deschutes" },
  { license: "050-6622", name: "Floyd's Fine Cannabis", business: "FLOYDS FINE CANNABIS LLC", address: "2035 NE MARTIN LUTHER KING JR BLVD PORTLAND OR 97212", county: "Multnomah" },
  { license: "050-6744", name: "La Mota", business: "LA MOTA LLC", address: "3054 NW YEON AVE PORTLAND OR 97210", county: "Multnomah" },
  { license: "050-6866", name: "Green Goddess Remedies", business: "GREEN GODDESS LLC", address: "7707 SE STARK ST PORTLAND OR 97215", county: "Multnomah" },
  { license: "050-6988", name: "Kaleafa Cannabis", business: "KALEAFA LLC", address: "5215 SE MCLOUGHLIN BLVD PORTLAND OR 97202", county: "Multnomah" },
  { license: "050-7110", name: "Farma", business: "FARMA LLC", address: "916 SE HAWTHORNE BLVD PORTLAND OR 97214", county: "Multnomah" },
  { license: "050-7232", name: "Serra", business: "SERRA DISPENSARY LLC", address: "2519 SE BELMONT ST PORTLAND OR 97214", county: "Multnomah" },
  { license: "050-7354", name: "Bloom", business: "BLOOM DISPENSARIES LLC", address: "10209 SE DIVISION ST PORTLAND OR 97266", county: "Multnomah" },
  { license: "050-7476", name: "Archive Portland", business: "ARCHIVE PORTLAND LLC", address: "18 NW 3RD AVE PORTLAND OR 97209", county: "Multnomah" },
  { license: "050-7598", name: "Green Mart", business: "GREEN MART LLC", address: "1134 SW ALDER ST PORTLAND OR 97205", county: "Multnomah" },
  { license: "050-7720", name: "Collective Awakenings", business: "COLLECTIVE AWAKENINGS LLC", address: "6515 SE FOSTER RD PORTLAND OR 97206", county: "Multnomah" },
  { license: "050-7842", name: "TJ's Gardens", business: "TJS GARDENS LLC", address: "7818 SE STARK ST PORTLAND OR 97215", county: "Multnomah" },
  { license: "050-7964", name: "Oregon Cannabis Company", business: "OREGON CANNABIS CO LLC", address: "205 NW GREENWOOD AVE BEND OR 97703", county: "Deschutes" },
  { license: "050-8086", name: "Green Oasis", business: "GREEN OASIS LLC", address: "7942 SE STARK ST PORTLAND OR 97215", county: "Multnomah" },
  { license: "050-8208", name: "Substance Market", business: "SUBSTANCE LLC", address: "722 E BURNSIDE ST PORTLAND OR 97214", county: "Multnomah" },
  { license: "050-8330", name: "Paradise Found", business: "PARADISE FOUND LLC", address: "1005 E MAIN ST MEDFORD OR 97504", county: "Jackson" },
  { license: "050-8452", name: "High Quality", business: "HIGH QUALITY LLC", address: "1280 BIDDLE RD MEDFORD OR 97504", county: "Jackson" },
  { license: "050-8574", name: "Talent Health Club", business: "TALENT HEALTH CLUB LLC", address: "120 E MAIN ST TALENT OR 97540", county: "Jackson" },
  { license: "050-8696", name: "Rogue Valley Cannabis", business: "ROGUE VALLEY CANNABIS LLC", address: "2340 SISKIYOU BLVD ASHLAND OR 97520", county: "Jackson" },
  { license: "050-8818", name: "Southern Oregon Cannabis", business: "SO CANNABIS LLC", address: "1555 ROGUE RIVER HWY GRANTS PASS OR 97527", county: "Josephine" },
  { license: "050-8940", name: "Madrone Cannabis", business: "MADRONE CANNABIS LLC", address: "890 REDWOOD HWY CAVE JUNCTION OR 97523", county: "Josephine" },
  { license: "050-9062", name: "Cascade Cannabis", business: "CASCADE CANNABIS LLC", address: "1890 CASCADE AVE HOOD RIVER OR 97031", county: "Hood River" },
  { license: "050-9184", name: "Columbia Gorge Cannabis", business: "GORGE CANNABIS LLC", address: "1234 W 6TH ST THE DALLES OR 97058", county: "Wasco" },
  { license: "050-9306", name: "High Desert Cannabis", business: "HIGH DESERT LLC", address: "2567 S HWY 97 REDMOND OR 97756", county: "Deschutes" },
  { license: "050-9428", name: "Mountain High", business: "MOUNTAIN HIGH LLC", address: "987 SW CASCADE AVE SISTERS OR 97759", county: "Deschutes" },
  { license: "050-9550", name: "Coastal Cannabis", business: "COASTAL CANNABIS LLC", address: "1234 NW HWY 101 LINCOLN CITY OR 97367", county: "Lincoln" },
  { license: "050-9672", name: "Beach Buds", business: "BEACH BUDS LLC", address: "567 BROADWAY ST SEASIDE OR 97138", county: "Clatsop" },
  { license: "050-9794", name: "North Coast Cannabis", business: "NORTH COAST LLC", address: "890 COMMERCIAL ST ASTORIA OR 97103", county: "Clatsop" },
  { license: "050-9916", name: "South Coast Dispensary", business: "SOUTH COAST LLC", address: "456 S BROADWAY COOS BAY OR 97420", county: "Coos" },
  { license: "051-0038", name: "Valley Greens", business: "VALLEY GREENS LLC", address: "789 W MAIN ST COTTAGE GROVE OR 97424", county: "Lane" },
  { license: "051-0160", name: "Eugene OG", business: "EUGENE OG LLC", address: "1345 WILLAMETTE ST EUGENE OR 97401", county: "Lane" },
  { license: "051-0282", name: "Salem Cannabis", business: "SALEM CANNABIS LLC", address: "2468 COMMERCIAL ST SE SALEM OR 97302", county: "Marion" },
  { license: "051-0404", name: "Corvallis Cannabis", business: "CORVALLIS CANNABIS LLC", address: "135 NW 4TH ST CORVALLIS OR 97330", county: "Benton" },
  { license: "051-0526", name: "Albany Green", business: "ALBANY GREEN LLC", address: "2890 PACIFIC BLVD SE ALBANY OR 97321", county: "Linn" },
];

// Territory assignments for reps
export const territories = {
  'Portland Metro': { rep: 'Sarah Chen', color: '#3b82f6' },
  'Willamette Valley': { rep: 'Jake Martinez', color: '#10b981' },
  'Southern Oregon': { rep: 'Emily Davis', color: '#f59e0b' },
  'Central Oregon': { rep: 'Marcus Thompson', color: '#8b5cf6' },
  'Coast': { rep: 'Rachel Kim', color: '#06b6d4' },
  'Eastern Oregon': { rep: 'David Wilson', color: '#ef4444' },
};

// Build full retailer objects
export const retailers = olccRetailers.map((r) => {
  const hash = hashCode(r.license);
  const region = countyToRegion[r.county] || 'Eastern Oregon';

  // Determine journey stage (weighted toward established)
  const stageRand = seededRandom(hash);
  let journeyStage;
  if (stageRand < 0.05) journeyStage = 'prospect';
  else if (stageRand < 0.10) journeyStage = 'first_order';
  else if (stageRand < 0.20) journeyStage = 'trial';
  else if (stageRand < 0.40) journeyStage = 'growing';
  else if (stageRand < 0.85) journeyStage = 'established';
  else journeyStage = 'champion';

  // Health score based on journey stage
  let healthMin, healthMax;
  switch (journeyStage) {
    case 'champion': healthMin = 85; healthMax = 100; break;
    case 'established': healthMin = 55; healthMax = 90; break;
    case 'growing': healthMin = 60; healthMax = 85; break;
    case 'trial': healthMin = 45; healthMax = 75; break;
    case 'first_order': healthMin = 50; healthMax = 70; break;
    default: healthMin = 0; healthMax = 30;
  }
  const healthScore = Math.floor(healthMin + seededRandom(hash + 1) * (healthMax - healthMin));

  // Health trend
  const trendRand = seededRandom(hash + 2);
  let healthTrend;
  if (healthScore > 75) healthTrend = trendRand > 0.3 ? 'stable' : 'growing';
  else if (healthScore > 50) healthTrend = trendRand > 0.5 ? 'stable' : (trendRand > 0.25 ? 'growing' : 'declining');
  else healthTrend = trendRand > 0.4 ? 'declining' : 'stable';

  // Days since last order
  let daysSinceOrder;
  if (journeyStage === 'prospect') daysSinceOrder = null;
  else if (healthScore > 75) daysSinceOrder = Math.floor(seededRandom(hash + 3) * 10) + 3;
  else if (healthScore > 50) daysSinceOrder = Math.floor(seededRandom(hash + 3) * 20) + 7;
  else daysSinceOrder = Math.floor(seededRandom(hash + 3) * 40) + 20;

  // Calculate average order value and frequency
  const avgOrderValue = Math.floor(800 + seededRandom(hash + 4) * 1500);
  const orderFrequencyDays = journeyStage === 'champion' ? 7 :
    journeyStage === 'established' ? 14 :
    journeyStage === 'growing' ? 18 :
    journeyStage === 'trial' ? 25 : 30;

  // YTD wholesale value
  const monthsActive = journeyStage === 'prospect' ? 0 :
    journeyStage === 'first_order' ? 1 :
    journeyStage === 'trial' ? 3 :
    journeyStage === 'growing' ? 6 : 12;
  const ytdWholesale = Math.floor(avgOrderValue * (30 / orderFrequencyDays) * monthsActive);

  // Last visit info
  const daysAgoLastVisit = Math.floor(seededRandom(hash + 5) * 30) + 5;
  const lastVisitDate = new Date();
  lastVisitDate.setDate(lastVisitDate.getDate() - daysAgoLastVisit);

  const noteIndex = Math.floor(seededRandom(hash + 6) * visitNotes.length);

  return {
    id: r.license,
    name: r.name,
    businessName: r.business,
    address: r.address,
    county: r.county,
    region,
    territory: territories[region],
    coordinates: getCoordinates(r.address, r.license),

    // Relationship
    journeyStage,
    healthScore,
    healthTrend,
    healthCategory: healthScore >= 80 ? 'thriving' :
      healthScore >= 60 ? 'healthy' :
      healthScore >= 40 ? 'needs_attention' :
      healthScore >= 20 ? 'at_risk' : 'churned',

    // Orders
    daysSinceOrder,
    avgOrderValue,
    orderFrequencyDays,
    ytdWholesale,
    orderHistory: journeyStage !== 'prospect' ? generateOrderHistory(r.license, healthScore) : [],

    // Performance
    performance: journeyStage !== 'prospect' ? generatePerformance(r.license, healthScore) : null,

    // Contacts
    contacts: generateContacts(r.license),

    // Visit history
    lastVisit: {
      date: lastVisitDate.toISOString().split('T')[0],
      rep: territories[region].rep,
      notes: visitNotes[noteIndex],
    },

    // Flags
    isUrgent: daysSinceOrder !== null && daysSinceOrder > orderFrequencyDays * 2,
    needsAttention: healthScore < 60 && healthTrend === 'declining',
  };
});

// Get retailers by region
export function getRetailersByRegion(region) {
  return retailers.filter(r => r.region === region);
}

// Get retailers by health category
export function getRetailersByHealth(category) {
  return retailers.filter(r => r.healthCategory === category);
}

// Get at-risk retailers
export function getAtRiskRetailers() {
  return retailers.filter(r => r.healthCategory === 'at_risk' || r.healthCategory === 'churned');
}

// Get declining retailers
export function getDecliningRetailers() {
  return retailers.filter(r => r.healthTrend === 'declining');
}

// Get urgent retailers (overdue for order)
export function getUrgentRetailers() {
  return retailers.filter(r => r.isUrgent);
}

// Summary stats
export const retailerStats = {
  total: retailers.length,
  byRegion: Object.keys(territories).reduce((acc, region) => {
    acc[region] = getRetailersByRegion(region).length;
    return acc;
  }, {}),
  byHealth: {
    thriving: getRetailersByHealth('thriving').length,
    healthy: getRetailersByHealth('healthy').length,
    needs_attention: getRetailersByHealth('needs_attention').length,
    at_risk: getRetailersByHealth('at_risk').length,
    churned: getRetailersByHealth('churned').length,
  },
  byJourney: journeyStages.reduce((acc, stage) => {
    acc[stage] = retailers.filter(r => r.journeyStage === stage).length;
    return acc;
  }, {}),
  atRisk: getAtRiskRetailers().length,
  declining: getDecliningRetailers().length,
  urgent: getUrgentRetailers().length,
};

export default retailers;
