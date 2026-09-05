// Automatic distance, duration, and price estimation utility for routes

// 1. Explicit popular and direct route pairs (Bidirectional)
const KNOWN_ROUTE_PAIRS = [
  // Samarinda connections
  { a: 'samarinda', b: 'balikpapan', distance: '115 km', duration: '2 Jam via Tol', basePrice: 150000 },
  { a: 'samarinda', b: 'bontang', distance: '120 km', duration: '2.5 Jam', basePrice: 175000 },
  { a: 'samarinda', b: 'tenggarong', distance: '32 km', duration: '45 Menit', basePrice: 65000 },
  { a: 'samarinda', b: 'sangatta', distance: '175 km', duration: '4 Jam', basePrice: 220000 },
  { a: 'samarinda', b: 'ikn', distance: '95 km', duration: '2 Jam', basePrice: 180000 },
  { a: 'samarinda', b: 'ikn nusantara', distance: '95 km', duration: '2 Jam', basePrice: 180000 },
  { a: 'samarinda', b: 'penajam', distance: '140 km', duration: '2.5 Jam via Tol', basePrice: 190000 },
  { a: 'samarinda', b: 'berau', distance: '540 km', duration: '12 Jam', basePrice: 450000 },
  { a: 'samarinda', b: 'tanjung redeb', distance: '540 km', duration: '12 Jam', basePrice: 450000 },
  { a: 'samarinda', b: 'sendawar', distance: '310 km', duration: '7.5 Jam', basePrice: 300000 },
  { a: 'samarinda', b: 'kutai barat', distance: '310 km', duration: '7.5 Jam', basePrice: 300000 },
  { a: 'samarinda', b: 'tarakan', distance: '680 km', duration: '15 Jam', basePrice: 550000 },

  // Balikpapan connections
  { a: 'balikpapan', b: 'ikn', distance: '85 km', duration: '1.5 Jam via Tol IKN', basePrice: 200000 },
  { a: 'balikpapan', b: 'ikn nusantara', distance: '85 km', duration: '1.5 Jam via Tol IKN', basePrice: 200000 },
  { a: 'balikpapan', b: 'bontang', distance: '235 km', duration: '4 Jam via Tol', basePrice: 250000 },
  { a: 'balikpapan', b: 'tenggarong', distance: '135 km', duration: '2.5 Jam via Tol', basePrice: 180000 },
  { a: 'balikpapan', b: 'penajam', distance: '35 km', duration: '1 Jam via Feri / Tol', basePrice: 90000 },
  { a: 'balikpapan', b: 'sangatta', distance: '290 km', duration: '5.5 Jam via Tol', basePrice: 300000 },
  { a: 'balikpapan', b: 'tanah grogot', distance: '145 km', duration: '3.5 Jam', basePrice: 180000 },
  { a: 'balikpapan', b: 'paser', distance: '145 km', duration: '3.5 Jam', basePrice: 180000 },
  { a: 'balikpapan', b: 'banjarmasin', distance: '490 km', duration: '11 Jam', basePrice: 380000 },
  { a: 'balikpapan', b: 'berau', distance: '650 km', duration: '14 Jam', basePrice: 500000 },

  // Bontang connections (Including requested: Bontang - Tenggarong!)
  { a: 'bontang', b: 'tenggarong', distance: '145 km', duration: '3 Jam via Poros', basePrice: 185000 },
  { a: 'bontang', b: 'sangatta', distance: '60 km', duration: '1.5 Jam', basePrice: 95000 },
  { a: 'bontang', b: 'ikn', distance: '215 km', duration: '4 Jam via Tol', basePrice: 260000 },
  { a: 'bontang', b: 'ikn nusantara', distance: '215 km', duration: '4 Jam via Tol', basePrice: 260000 },
  { a: 'bontang', b: 'penajam', distance: '270 km', duration: '4.5 Jam via Tol', basePrice: 280000 },
  { a: 'bontang', b: 'berau', distance: '430 km', duration: '9.5 Jam', basePrice: 380000 },

  // Tenggarong connections
  { a: 'tenggarong', b: 'ikn', distance: '100 km', duration: '2 Jam', basePrice: 175000 },
  { a: 'tenggarong', b: 'ikn nusantara', distance: '100 km', duration: '2 Jam', basePrice: 175000 },
  { a: 'tenggarong', b: 'sangatta', distance: '190 km', duration: '4.5 Jam', basePrice: 230000 },
  { a: 'tenggarong', b: 'penajam', distance: '150 km', duration: '3 Jam', basePrice: 200000 },
  { a: 'tenggarong', b: 'kota bangun', distance: '85 km', duration: '2 Jam', basePrice: 110000 },

  // Penajam & Paser & IKN
  { a: 'penajam', b: 'ikn', distance: '45 km', duration: '1 Jam', basePrice: 100000 },
  { a: 'penajam', b: 'ikn nusantara', distance: '45 km', duration: '1 Jam', basePrice: 100000 },
  { a: 'penajam', b: 'tanah grogot', distance: '110 km', duration: '2.5 Jam', basePrice: 140000 },
  { a: 'ikn', b: 'tanah grogot', distance: '130 km', duration: '3 Jam', basePrice: 170000 },

  // Java & Other Major Intercity Routes
  { a: 'surabaya', b: 'malang', distance: '95 km', duration: '2 Jam via Tol', basePrice: 120000 },
  { a: 'surabaya', b: 'banyuwangi', distance: '290 km', duration: '6 Jam', basePrice: 240000 },
  { a: 'jakarta', b: 'bandung', distance: '150 km', duration: '2.5 Jam via Tol', basePrice: 150000 },
  { a: 'semarang', b: 'solo', distance: '105 km', duration: '1.5 Jam via Tol', basePrice: 110000 },
  { a: 'yogyakarta', b: 'solo', distance: '65 km', duration: '1.5 Jam', basePrice: 75000 },
  { a: 'medan', b: 'siantar', distance: '130 km', duration: '2.5 Jam via Tol', basePrice: 120000 },
  { a: 'makassar', b: 'parepare', distance: '155 km', duration: '3 Jam', basePrice: 140000 }
];

// 2. City Coordinate Registry for Geographic Fallback Calculation
const CITY_COORDINATES = {
  samarinda: { lat: -0.5022, lon: 117.1537, name: 'Samarinda' },
  balikpapan: { lat: -1.2654, lon: 116.8312, name: 'Balikpapan' },
  bontang: { lat: 0.1333, lon: 117.5000, name: 'Bontang' },
  tenggarong: { lat: -0.4289, lon: 116.9856, name: 'Tenggarong' },
  sangatta: { lat: 0.5000, lon: 117.5833, name: 'Sangatta' },
  ikn: { lat: -0.9667, lon: 116.7000, name: 'IKN Nusantara' },
  nusantara: { lat: -0.9667, lon: 116.7000, name: 'IKN Nusantara' },
  penajam: { lat: -1.3000, lon: 116.7333, name: 'Penajam' },
  grogot: { lat: -1.9000, lon: 116.2000, name: 'Tanah Grogot' },
  paser: { lat: -1.9000, lon: 116.2000, name: 'Paser' },
  berau: { lat: 2.1500, lon: 117.5000, name: 'Berau' },
  tarakan: { lat: 3.3000, lon: 117.6333, name: 'Tarakan' },
  sendawar: { lat: -0.2333, lon: 115.7000, name: 'Sendawar' },
  banjarmasin: { lat: -3.3167, lon: 114.5833, name: 'Banjarmasin' },
  banjarbaru: { lat: -3.4500, lon: 114.8333, name: 'Banjarbaru' },
  palangkaraya: { lat: -2.2167, lon: 113.9167, name: 'Palangka Raya' },
  pontianak: { lat: -0.0333, lon: 109.3333, name: 'Pontianak' },
  surabaya: { lat: -7.2575, lon: 112.7521, name: 'Surabaya' },
  malang: { lat: -7.9797, lon: 112.6304, name: 'Malang' },
  jakarta: { lat: -6.2088, lon: 106.8456, name: 'Jakarta' },
  bandung: { lat: -6.9175, lon: 107.6191, name: 'Bandung' },
  semarang: { lat: -7.0051, lon: 110.4381, name: 'Semarang' },
  yogyakarta: { lat: -7.7956, lon: 110.3695, name: 'Yogyakarta' },
  solo: { lat: -7.5755, lon: 110.8243, name: 'Solo' },
  denpasar: { lat: -8.6705, lon: 115.2126, name: 'Denpasar' },
  makassar: { lat: -5.1477, lon: 119.4327, name: 'Makassar' },
  medan: { lat: 3.5952, lon: 98.6722, name: 'Medan' }
};

// Clean location string (remove airport, terminal, or bracket text for fuzzy matching)
export const normalizeCityName = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parenthesized text e.g. (Bandara SAMS)
    .replace(/kota|kabupaten|kab\.|bandara|terminal|pelabuhan|pusat|stasiun/gi, '')
    .trim();
};

// Haversine formula to compute great-circle distance in kilometers
const calculateHaversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Estimates distance, travel duration, and recommended base fare between two locations.
 * @param {string} originInput 
 * @param {string} destinationInput 
 * @returns {object|null} { distance: '145 km', duration: '3 Jam', basePrice: 185000, source: 'exact'|'estimated' }
 */
export const estimateRouteDetails = (originInput, destinationInput) => {
  if (!originInput || !destinationInput) return null;

  const rawA = originInput.toLowerCase().trim();
  const rawB = destinationInput.toLowerCase().trim();
  const normA = normalizeCityName(originInput);
  const normB = normalizeCityName(destinationInput);

  if (!normA || !normB || normA === normB) return null;

  // 1. Direct Match against KNOWN_ROUTE_PAIRS
  for (const pair of KNOWN_ROUTE_PAIRS) {
    const matchForward =
      (rawA.includes(pair.a) || normA.includes(pair.a)) &&
      (rawB.includes(pair.b) || normB.includes(pair.b));
    const matchBackward =
      (rawA.includes(pair.b) || normA.includes(pair.b)) &&
      (rawB.includes(pair.a) || normB.includes(pair.a));

    if (matchForward || matchBackward) {
      return {
        distance: pair.distance,
        duration: pair.duration,
        basePrice: pair.basePrice,
        source: 'exact',
        foundKey: `${pair.a} ➜ ${pair.b}`
      };
    }
  }

  // 2. Geographic Coordinate Matching & Calculation
  let coordA = null;
  let coordB = null;

  for (const [key, val] of Object.entries(CITY_COORDINATES)) {
    if (normA.includes(key) || key.includes(normA)) {
      coordA = val;
    }
    if (normB.includes(key) || key.includes(normB)) {
      coordB = val;
    }
  }

  if (coordA && coordB) {
    const directKm = calculateHaversineKm(coordA.lat, coordA.lon, coordB.lat, coordB.lon);
    // Typical road winding factor for Indonesian topography (~1.35x direct line)
    const roadKm = Math.max(15, Math.round(directKm * 1.35));

    // Realistic shuttle driving speed average: ~45-55 km/h depending on distance
    const avgSpeed = roadKm > 200 ? 52 : roadKm > 60 ? 46 : 38;
    const totalHours = roadKm / avgSpeed;

    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);

    let durationStr = '';
    if (hours === 0) {
      durationStr = `${Math.max(25, minutes)} Menit`;
    } else if (minutes < 15) {
      durationStr = `${hours} Jam`;
    } else if (minutes >= 15 && minutes <= 45) {
      durationStr = `${hours}.5 Jam`;
    } else {
      durationStr = `${hours + 1} Jam`;
    }

    // Recommended base price: ~Rp 1.100 - Rp 1.400 / km, rounded to nearest Rp 5.000
    const rawPrice = roadKm * 1250;
    const roundedPrice = Math.max(60000, Math.round(rawPrice / 5000) * 5000);

    return {
      distance: `${roadKm} km`,
      duration: durationStr,
      basePrice: roundedPrice,
      source: 'calculated',
      foundKey: `${coordA.name} ➜ ${coordB.name}`
    };
  }

  return null;
};

// List of popular cities in Kalimantan & surrounding for input suggestions
export const SUGGESTED_CITIES = [
  'Samarinda',
  'Balikpapan (Bandara SAMS)',
  'Balikpapan (Kota)',
  'Bontang',
  'Tenggarong',
  'IKN Nusantara (KIPP)',
  'Sangatta (Kutai Timur)',
  'Penajam (PPU)',
  'Tanah Grogot (Paser)',
  'Berau (Tanjung Redeb)',
  'Sendawar (Kutai Barat)',
  'Tarakan',
  'Banjarmasin',
  'Banjarbaru'
];
