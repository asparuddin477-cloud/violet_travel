// Initial mock data & layout configurations for Violet Travel

export const INITIAL_ROUTES = [
  {
    id: 'route-1',
    origin: 'Samarinda',
    destination: 'Balikpapan (Bandara / Kota)',
    distance: '115 km',
    duration: '2 Jam via Tol',
    basePrice: 150000,
    active: true,
    pickupType: 'Door to Door & Pool'
  },
  {
    id: 'route-2',
    origin: 'Balikpapan (Bandara / Kota)',
    destination: 'Samarinda',
    distance: '115 km',
    duration: '2 Jam via Tol',
    basePrice: 150000,
    active: true,
    pickupType: 'Door to Door & Pool'
  },
  {
    id: 'route-3',
    origin: 'Balikpapan (Bandara SAMS)',
    destination: 'IKN Nusantara (KIPP)',
    distance: '85 km',
    duration: '1.5 Jam via Tol IKN',
    basePrice: 200000,
    active: true,
    pickupType: 'Door to Door & Executive'
  },
  {
    id: 'route-4',
    origin: 'IKN Nusantara (KIPP)',
    destination: 'Balikpapan (Bandara SAMS)',
    distance: '85 km',
    duration: '1.5 Jam via Tol IKN',
    basePrice: 200000,
    active: true,
    pickupType: 'Door to Door & Executive'
  },
  {
    id: 'route-5',
    origin: 'Samarinda',
    destination: 'Bontang',
    distance: '120 km',
    duration: '2.5 Jam',
    basePrice: 175000,
    active: true,
    pickupType: 'Door to Door'
  },
  {
    id: 'route-6',
    origin: 'Bontang',
    destination: 'Samarinda',
    distance: '120 km',
    duration: '2.5 Jam',
    basePrice: 175000,
    active: true,
    pickupType: 'Door to Door'
  },
  {
    id: 'route-7',
    origin: 'Samarinda',
    destination: 'IKN Nusantara (KIPP)',
    distance: '110 km',
    duration: '2 Jam',
    basePrice: 220000,
    active: true,
    pickupType: 'Door to Door & Executive'
  }
];

export const INITIAL_VEHICLES = [
  {
    id: 'veh-1',
    name: 'Toyota HiAce Premio Executive',
    plateNumber: 'KT 1088 VT',
    type: 'hiace_premio',
    category: 'Executive Luxury',
    capacity: 10,
    seatLayoutType: 'hiace-10',
    extraFee: 30000,
    facilities: ['AC Dingin Double Blower', 'Reclining Captain Seat', 'USB Fast Charging', 'Full Audio & Netflix Screen', 'Bagasi Luas', 'Mineral Water & Snack'],
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    assignedDriverId: 'drv-1',
    status: 'Aktif'
  },
  {
    id: 'veh-2',
    name: 'Toyota Innova Reborn Luxury',
    plateNumber: 'KT 2490 VT',
    type: 'innova_reborn',
    category: 'VIP Private / Shuttle',
    capacity: 6,
    seatLayoutType: 'innova-6',
    extraFee: 25000,
    facilities: ['AC Digital', 'Captain Seat Tengah', 'Audio Bass Mantap', 'USB Port', 'Driver Berpengalaman'],
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    assignedDriverId: 'drv-2',
    status: 'Aktif'
  },
  {
    id: 'veh-3',
    name: 'Toyota HiAce Commuter Standard',
    plateNumber: 'KT 7711 VT',
    type: 'hiace_commuter',
    category: 'Reguler Eksekutif',
    capacity: 14,
    seatLayoutType: 'hiace-14',
    extraFee: 0,
    facilities: ['AC Terpusat', 'Kursi Reclining', 'Audio', 'Bagasi Standard', 'Air Mineral'],
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    assignedDriverId: 'drv-3',
    status: 'Aktif'
  },
  {
    id: 'veh-4',
    name: 'Toyota All New Veloz Luxury',
    plateNumber: 'KT 1555 VT',
    type: 'avanza_veloz',
    category: 'Reguler Hemat',
    capacity: 5,
    seatLayoutType: 'veloz-5',
    extraFee: 0,
    facilities: ['AC Dingin', 'Kabin Bersih & Wangi', 'Charger HP', 'Door to Door'],
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    assignedDriverId: 'drv-4',
    status: 'Aktif'
  }
];

export const INITIAL_DRIVERS = [
  {
    id: 'drv-1',
    name: 'Budi Santoso',
    phone: '0812-3456-7801',
    licenseNumber: 'SIM B1 Umum 920182910',
    experience: '8 Tahun',
    rating: 4.9,
    tripsCount: 342,
    status: 'Siap Jalan',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    assignedVehicleId: 'veh-1'
  },
  {
    id: 'drv-2',
    name: 'Agus Prabowo',
    phone: '0813-4567-8902',
    licenseNumber: 'SIM A Umum 88129034',
    experience: '6 Tahun',
    rating: 4.8,
    tripsCount: 280,
    status: 'Siap Jalan',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    assignedVehicleId: 'veh-2'
  },
  {
    id: 'drv-3',
    name: 'Rahmat Hidayat',
    phone: '0821-9876-5403',
    licenseNumber: 'SIM B1 Umum 77319024',
    experience: '10 Tahun',
    rating: 5.0,
    tripsCount: 512,
    status: 'Siap Jalan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    assignedVehicleId: 'veh-3'
  },
  {
    id: 'drv-4',
    name: 'Hendra Kusuma',
    phone: '0852-6789-0104',
    licenseNumber: 'SIM A Umum 66491023',
    experience: '5 Tahun',
    rating: 4.7,
    tripsCount: 195,
    status: 'Siap Jalan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    assignedVehicleId: 'veh-4'
  }
];

export const INITIAL_SCHEDULES = [
  { id: 'sch-1', time: '06:00 WITA', label: 'Pagi Hari' },
  { id: 'sch-2', time: '08:30 WITA', label: 'Pagi - Siang' },
  { id: 'sch-3', time: '11:00 WITA', label: 'Siang Hari' },
  { id: 'sch-4', time: '14:00 WITA', label: 'Siang - Sore' },
  { id: 'sch-5', time: '16:30 WITA', label: 'Sore Hari' },
  { id: 'sch-6', time: '19:00 WITA', label: 'Malam Hari' },
  { id: 'sch-7', time: '21:00 WITA', label: 'Malam Eksekutif' }
];

// Cabin layout specifications for realistic interactive seat maps
export const CABIN_LAYOUTS = {
  'hiace-10': {
    title: 'Toyota HiAce Premio (10 Kursi Penumpang + 1 Driver)',
    driverPosition: { row: 0, col: 0, label: 'Sopir' },
    frontPassenger: { id: '1A', label: '1A', row: 0, col: 2, type: 'seat', note: 'Depan Samping Sopir', isVip: true },
    rows: [
      // Row 1 (Cabin Front)
      [
        { id: '2A', label: '2A', col: 0, type: 'seat', note: 'Single Captain Seat', isVip: true },
        { id: 'aisle-1', type: 'aisle', col: 1 },
        { id: '2B', label: '2B', col: 2, type: 'seat', note: 'Jendela Kanan', isVip: true }
      ],
      // Row 2
      [
        { id: '3A', label: '3A', col: 0, type: 'seat', note: 'Single Captain Seat' },
        { id: 'aisle-2', type: 'aisle', col: 1 },
        { id: '3B', label: '3B', col: 2, type: 'seat', note: 'Jendela Kanan' }
      ],
      // Row 3
      [
        { id: '4A', label: '4A', col: 0, type: 'seat', note: 'Single Seat' },
        { id: 'aisle-3', type: 'aisle', col: 1 },
        { id: '4B', label: '4B', col: 2, type: 'seat', note: 'Jendela Kanan' }
      ],
      // Row 4 (Belakang 3 kursi)
      [
        { id: '5A', label: '5A', col: 0, type: 'seat', note: 'Belakang Kiri' },
        { id: '5B', label: '5B', col: 1, type: 'seat', note: 'Belakang Tengah' },
        { id: '5C', label: '5C', col: 2, type: 'seat', note: 'Belakang Kanan' }
      ]
    ]
  },
  'innova-6': {
    title: 'Toyota Innova Reborn (6 Kursi Penumpang + 1 Driver)',
    driverPosition: { row: 0, col: 0, label: 'Sopir' },
    frontPassenger: { id: '1A', label: '1A', row: 0, col: 2, type: 'seat', note: 'Depan Samping Sopir', isVip: true },
    rows: [
      // Row 1 (Captain Seat Baris 2)
      [
        { id: '2A', label: '2A', col: 0, type: 'seat', note: 'Captain Seat Kiri', isVip: true },
        { id: 'aisle-1', type: 'aisle', col: 1 },
        { id: '2B', label: '2B', col: 2, type: 'seat', note: 'Captain Seat Kanan', isVip: true }
      ],
      // Row 2 (Baris Belakang)
      [
        { id: '3A', label: '3A', col: 0, type: 'seat', note: 'Belakang Kiri' },
        { id: '3B', label: '3B', col: 1, type: 'seat', note: 'Belakang Tengah' },
        { id: '3C', label: '3C', col: 2, type: 'seat', note: 'Belakang Kanan' }
      ]
    ]
  },
  'hiace-14': {
    title: 'Toyota HiAce Commuter (14 Kursi Penumpang + 1 Driver)',
    driverPosition: { row: 0, col: 0, label: 'Sopir' },
    frontPassenger: { id: '1A', label: '1A', row: 0, col: 2, type: 'seat', note: 'Depan Samping Sopir' },
    rows: [
      [
        { id: '2A', label: '2A', col: 0, type: 'seat' },
        { id: '2B', label: '2B', col: 1, type: 'seat' },
        { id: '2C', label: '2C', col: 2, type: 'seat' }
      ],
      [
        { id: '3A', label: '3A', col: 0, type: 'seat' },
        { id: '3B', label: '3B', col: 1, type: 'seat' },
        { id: '3C', label: '3C', col: 2, type: 'seat' }
      ],
      [
        { id: '4A', label: '4A', col: 0, type: 'seat' },
        { id: '4B', label: '4B', col: 1, type: 'seat' },
        { id: '4C', label: '4C', col: 2, type: 'seat' }
      ],
      [
        { id: '5A', label: '5A', col: 0, type: 'seat' },
        { id: '5B', label: '5B', col: 1, type: 'seat' },
        { id: '5C', label: '5C', col: 2, type: 'seat' },
        { id: '5D', label: '5D', col: 3, type: 'seat' }
      ]
    ]
  },
  'veloz-5': {
    title: 'Toyota Veloz (5 Kursi Penumpang + 1 Driver)',
    driverPosition: { row: 0, col: 0, label: 'Sopir' },
    frontPassenger: { id: '1A', label: '1A', row: 0, col: 2, type: 'seat', note: 'Depan Samping Sopir', isVip: true },
    rows: [
      [
        { id: '2A', label: '2A', col: 0, type: 'seat', note: 'Tengah Kiri' },
        { id: '2B', label: '2B', col: 2, type: 'seat', note: 'Tengah Kanan' }
      ],
      [
        { id: '3A', label: '3A', col: 0, type: 'seat', note: 'Belakang Kiri' },
        { id: '3B', label: '3B', col: 2, type: 'seat', note: 'Belakang Kanan' }
      ]
    ]
  },
  'innova-7': {
    title: 'Toyota Innova Reborn Standard (7 Kursi Penumpang + 1 Driver)',
    driverPosition: { row: 0, col: 0, label: 'Sopir' },
    frontPassenger: { id: '1A', label: '1A', row: 0, col: 2, type: 'seat', note: 'Depan Samping Sopir', isVip: true },
    rows: [
      [
        { id: '2A', label: '2A', col: 0, type: 'seat', note: 'Tengah Kiri' },
        { id: '2B', label: '2B', col: 1, type: 'seat', note: 'Tengah Center' },
        { id: '2C', label: '2C', col: 2, type: 'seat', note: 'Tengah Kanan' }
      ],
      [
        { id: '3A', label: '3A', col: 0, type: 'seat', note: 'Belakang Kiri' },
        { id: '3B', label: '3B', col: 1, type: 'seat', note: 'Belakang Center' },
        { id: '3C', label: '3C', col: 2, type: 'seat', note: 'Belakang Kanan' }
      ]
    ]
  },
  'elf-16': {
    title: 'Isuzu Elf Microbus (16 Kursi Penumpang + 1 Driver)',
    driverPosition: { row: 0, col: 0, label: 'Sopir' },
    frontPassenger: { id: '1A', label: '1A', row: 0, col: 2, type: 'seat', note: 'Depan Samping Sopir' },
    rows: [
      [
        { id: '2A', label: '2A', col: 0, type: 'seat' },
        { id: 'aisle-1', type: 'aisle', col: 1 },
        { id: '2B', label: '2B', col: 2, type: 'seat' },
        { id: '2C', label: '2C', col: 3, type: 'seat' }
      ],
      [
        { id: '3A', label: '3A', col: 0, type: 'seat' },
        { id: 'aisle-2', type: 'aisle', col: 1 },
        { id: '3B', label: '3B', col: 2, type: 'seat' },
        { id: '3C', label: '3C', col: 3, type: 'seat' }
      ],
      [
        { id: '4A', label: '4A', col: 0, type: 'seat' },
        { id: 'aisle-3', type: 'aisle', col: 1 },
        { id: '4B', label: '4B', col: 2, type: 'seat' },
        { id: '4C', label: '4C', col: 3, type: 'seat' }
      ],
      [
        { id: '5A', label: '5A', col: 0, type: 'seat' },
        { id: 'aisle-4', type: 'aisle', col: 1 },
        { id: '5B', label: '5B', col: 2, type: 'seat' },
        { id: '5C', label: '5C', col: 3, type: 'seat' }
      ],
      [
        { id: '6A', label: '6A', col: 0, type: 'seat' },
        { id: '6B', label: '6B', col: 1, type: 'seat' },
        { id: '6C', label: '6C', col: 2, type: 'seat' },
        { id: '6D', label: '6D', col: 3, type: 'seat' }
      ]
    ]
  },
  'staria-7': {
    title: 'Hyundai Staria VIP (7 Kursi Penumpang + 1 Driver)',
    driverPosition: { row: 0, col: 0, label: 'Sopir' },
    frontPassenger: { id: '1A', label: '1A', row: 0, col: 2, type: 'seat', note: 'Depan Samping Sopir', isVip: true },
    rows: [
      [
        { id: '2A', label: '2A', col: 0, type: 'seat', note: 'Premium Relaxation Seat Kiri', isVip: true },
        { id: 'aisle-1', type: 'aisle', col: 1 },
        { id: '2B', label: '2B', col: 2, type: 'seat', note: 'Premium Relaxation Seat Kanan', isVip: true }
      ],
      [
        { id: '3A', label: '3A', col: 0, type: 'seat', note: 'Belakang Kiri' },
        { id: '3B', label: '3B', col: 1, type: 'seat', note: 'Belakang Tengah' },
        { id: '3C', label: '3C', col: 2, type: 'seat', note: 'Belakang Kanan' }
      ]
    ]
  }
};

export const INITIAL_BOOKINGS = [
  {
    id: 'BK-VT260901',
    bookingCode: 'VT-78912',
    passengerName: 'Dimas Wicaksono',
    passengerPhone: '0812-9988-7711',
    passengerEmail: 'dimas.w@example.com',
    passengerCount: 2,
    routeId: 'route-1',
    routeName: 'Samarinda ➜ Balikpapan (Bandara / Kota)',
    vehicleId: 'veh-1',
    vehicleName: 'Toyota HiAce Premio Executive',
    plateNumber: 'KT 1088 VT',
    driverName: 'Budi Santoso',
    driverPhone: '0812-3456-7801',
    travelDate: '2026-09-05',
    departureTime: '08:30 WITA',
    selectedSeats: ['2A', '2B'],
    pickupAddress: 'Jl. Juanda No. 12, Samarinda Ulu',
    dropoffAddress: 'Terminal Keberangkatan Bandara Sepinggan BPN',
    totalPrice: 360000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    bookingStatus: 'Dikonfirmasi',
    createdAt: '2026-09-04 09:30'
  },
  {
    id: 'BK-VT260902',
    bookingCode: 'VT-45231',
    passengerName: 'Siti Nurhaliza',
    passengerPhone: '0857-1122-3344',
    passengerEmail: 'siti.nur@example.com',
    passengerCount: 1,
    routeId: 'route-3',
    routeName: 'Balikpapan (Bandara SAMS) ➜ IKN Nusantara (KIPP)',
    vehicleId: 'veh-2',
    vehicleName: 'Toyota Innova Reborn Luxury',
    plateNumber: 'KT 2490 VT',
    driverName: 'Agus Prabowo',
    driverPhone: '0813-4567-8902',
    travelDate: '2026-09-05',
    departureTime: '11:00 WITA',
    selectedSeats: ['1A'],
    pickupAddress: 'Arrival Gate Bandara SAMS Sepinggan',
    dropoffAddress: 'Kawasan Hunian ASN 1, KIPP IKN',
    totalPrice: 225000,
    paymentMethod: 'Transfer Bank BCA',
    paymentStatus: 'Lunas',
    bookingStatus: 'Dikonfirmasi',
    createdAt: '2026-09-04 10:15'
  },
  {
    id: 'BK-VT260903',
    bookingCode: 'VT-99120',
    passengerName: 'Bambang Sudarmono',
    passengerPhone: '0821-4455-6677',
    passengerEmail: 'bambang.s@example.com',
    passengerCount: 1,
    routeId: 'route-5',
    routeName: 'Samarinda ➜ Bontang',
    vehicleId: 'veh-3',
    vehicleName: 'Toyota HiAce Commuter Standard',
    plateNumber: 'KT 7711 VT',
    driverName: 'Rahmat Hidayat',
    driverPhone: '0821-9876-5403',
    travelDate: '2026-09-05',
    departureTime: '14:00 WITA',
    selectedSeats: ['3A'],
    pickupAddress: 'Hotel Bumi Senyiur Samarinda',
    dropoffAddress: 'Jl. Ahmad Yani No. 50, Bontang',
    totalPrice: 175000,
    paymentMethod: 'Bayar di Sopir (Cash)',
    paymentStatus: 'Belum Lunas',
    bookingStatus: 'Dikonfirmasi',
    createdAt: '2026-09-04 11:00'
  }
];

export const INITIAL_SETTINGS = {
  companyName: 'Violet Transport',
  legalName: 'PT Violet Transport Nusantara',
  tagline: 'Your Trusted Travel Partner - Perjalanan Eksekutif Aman, Nyaman, & Tepat Waktu',
  logoUrl: '/logo.png',
  csPhone: '0812-3456-7890',
  csWhatsApp: '6281234567890',
  email: 'halo@violettransport.id',
  address: 'Jl. P. Antasari No. 88, Samarinda | Hub Bandara SAMS Balikpapan',
  bankAccounts: [
    { bank: 'BCA', accountNumber: '8920-1928-31', holder: 'PT Violet Transport Nusantara' },
    { bank: 'Bank Mandiri', accountNumber: '148-00-2910-291', holder: 'PT Violet Transport Nusantara' },
    { bank: 'BRI', accountNumber: '0341-01-002931-50-2', holder: 'PT Violet Transport Nusantara' },
    { bank: 'QRIS', accountNumber: 'NMID: ID102030405060', holder: 'Violet Transport Official' }
  ],
  promoCodes: [
    { code: 'VIOLETPROMO', discountPercent: 10, maxDiscount: 25000, description: 'Diskon 10% Spesial Pengguna Baru' },
    { code: 'IKNBESOK', discountPercent: 15, maxDiscount: 35000, description: 'Diskon 15% Rute IKN Nusantara' }
  ],
  pickupServiceTypes: [
    { 
      id: 'pst-1', 
      name: 'Door to Door (Alamat Rumah / Hotel)', 
      code: 'door-to-door',
      description: 'Dijemput langsung di depan pintu rumah, hotel, atau kantor Anda.',
      badge: 'Paling Populer',
      extraFee: 0,
      active: true
    },
    { 
      id: 'pst-2', 
      name: 'Pool to Pool (Kantor / Cabang Violet)', 
      code: 'pool-to-pool',
      description: 'Naik & berkumpul langsung di pool utama atau kantor cabang resmi Violet Travel.',
      badge: 'Hemat Waktu',
      extraFee: 0,
      active: true
    },
    { 
      id: 'pst-3', 
      name: 'Antar Jemput Bandara (Airport Shuttle)', 
      code: 'airport-drop',
      description: 'Penjemputan di Gate Kedatangan Bandara SAMS Sepinggan / APT Pranoto.',
      badge: 'Penerbangan',
      extraFee: 0,
      active: true
    },
    { 
      id: 'pst-4', 
      name: 'Point to Point (Rest Area / Titik Kumpul)', 
      code: 'point-to-point',
      description: 'Jemput di titik temu strategis seperti Rest Area Tol, Gerbang Tol, atau SPBU.',
      badge: 'Fleksibel',
      extraFee: 0,
      active: true
    },
    { 
      id: 'pst-5', 
      name: 'Carter Drop / Privat Eksklusif', 
      code: 'carter-privat',
      description: 'Layanan mobil privat antar jemput langsung khusus rombongan Anda tanpa gabung penumpang lain.',
      badge: 'VIP Privat',
      extraFee: 50000,
      active: true
    }
  ]
};
