// ============================================================
// MOCK DATA — Simulasi data dari Stellar Soroban smart contract
// Contract ID: CCCVEAEEOILMBIPSWEG6UTKBADRT6TTB2J2726V7WKRJ44OJHSGPLTLF
// ============================================================

export const CATEGORIES = [
  'Semua',
  'Elektronik',
  'Kendaraan',
  'Peralatan Rumah',
  'Olahraga',
  'Fotografi',
  'Musik',
  'Camping & Outdoor',
  'Pertukangan',
];

export const CITIES = [
  'Semua Kota',
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Bali',
  'Medan',
  'Semarang',
];

export const ITEM_CONDITIONS = ['Baru', 'Seperti Baru', 'Bekas (Terawat)'];

export const mockItems = [
  {
    id: 1,
    owner: 'GBVVMZAA123STELLAR456OWNER001',
    ownerName: 'Budi Santoso',
    title: 'Kamera Mirrorless Sony A7III',
    category: 'Fotografi',
    description:
      'Kamera full-frame 24.2MP dengan dual native ISO, eye autofocus, dan video 4K. Cocok untuk pemotretan profesional, prewedding, atau konten kreator. Tersedia beserta lensa kit 28-70mm.',
    condition: 'Seperti Baru',
    rentPerDay: 250000,
    collateral: 3000000,
    isAvailable: true,
    lat: '-6.9175',
    lng: '107.6191',
    city: 'Bandung',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
    ],
    rating: 4.8,
    reviewCount: 23,
    minDuration: 1,
    maxDuration: 30,
  },
  {
    id: 2,
    owner: 'GCXYZ789STELLAR456OWNER002',
    ownerName: 'Rani Wijaya',
    title: 'Tenda Dome Camping 4 Orang',
    category: 'Camping & Outdoor',
    description:
      'Tenda waterproof dengan rating 3000mm, ventilasi ganda, dan pemasangan mudah. Ideal untuk pendakian gunung atau glamping. Sudah termasuk ground sheet dan tali pasak.',
    condition: 'Bekas (Terawat)',
    rentPerDay: 85000,
    collateral: 500000,
    isAvailable: true,
    lat: '-7.7956',
    lng: '110.3695',
    city: 'Yogyakarta',
    images: [
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
    ],
    rating: 4.6,
    reviewCount: 41,
    minDuration: 1,
    maxDuration: 14,
  },
  {
    id: 3,
    owner: 'GABCDEF123STELLAR456OWNER003',
    ownerName: 'Dimas Pratama',
    title: 'DJI Mini 3 Pro Drone',
    category: 'Fotografi',
    description:
      'Drone ringan 249g dengan kamera 4K/60fps, obstacle avoidance 3 arah, dan waktu terbang 34 menit. Sudah termasuk remote controller dengan layar built-in.',
    condition: 'Baru',
    rentPerDay: 350000,
    collateral: 5000000,
    isAvailable: true,
    lat: '-6.2088',
    lng: '106.8456',
    city: 'Jakarta',
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&q=80',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80',
    ],
    rating: 4.9,
    reviewCount: 15,
    minDuration: 1,
    maxDuration: 7,
  },
  {
    id: 4,
    owner: 'GSTLR456STELLAR456OWNER004',
    ownerName: 'Sari Kusuma',
    title: 'Sepeda Gunung MTB Full Suspension',
    category: 'Olahraga',
    description:
      'Sepeda gunung dengan suspensi depan-belakang, rem hidrolik, dan 21 kecepatan. Frame aluminum alloy ringan tapi kuat. Cocok untuk trail ringan hingga medium.',
    condition: 'Bekas (Terawat)',
    rentPerDay: 120000,
    collateral: 1500000,
    isAvailable: false,
    lat: '-8.6500',
    lng: '115.2167',
    city: 'Bali',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80',
    ],
    rating: 4.3,
    reviewCount: 67,
    minDuration: 1,
    maxDuration: 21,
  },
  {
    id: 5,
    owner: 'GSTLR789STELLAR456OWNER005',
    ownerName: 'Hendra Kurniawan',
    title: 'Proyektor Portable Epson EB-S41',
    category: 'Elektronik',
    description:
      'Proyektor dengan kecerahan 3300 lumen, resolusi SVGA, koneksi HDMI/VGA/USB. Cocok untuk presentasi bisnis, nonton film outdoor, atau acara keluarga.',
    condition: 'Seperti Baru',
    rentPerDay: 180000,
    collateral: 2000000,
    isAvailable: true,
    lat: '-7.2575',
    lng: '112.7521',
    city: 'Surabaya',
    images: [
      'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=600&q=80',
    ],
    rating: 4.7,
    reviewCount: 29,
    minDuration: 1,
    maxDuration: 14,
  },
  {
    id: 6,
    owner: 'GSTLR111STELLAR456OWNER006',
    ownerName: 'Maya Indira',
    title: 'Gitar Akustik Yamaha F310',
    category: 'Musik',
    description:
      'Gitar akustik untuk pemula hingga intermediate. Suara hangat dan nyaman dimainkan. Sudah termasuk tas gitar, capo, dan pick. Senar baru diganti setiap 5x sewa.',
    condition: 'Bekas (Terawat)',
    rentPerDay: 50000,
    collateral: 300000,
    isAvailable: true,
    lat: '-6.9147',
    lng: '107.6098',
    city: 'Bandung',
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80',
    ],
    rating: 4.5,
    reviewCount: 88,
    minDuration: 1,
    maxDuration: 30,
  },
  {
    id: 7,
    owner: 'GSTLR222STELLAR456OWNER007',
    ownerName: 'Fajar Nugroho',
    title: 'Power Drill Bosch GSB 550',
    category: 'Pertukangan',
    description:
      'Bor listrik dengan motor 550W, chuck 13mm, dan torsi regulasi. Tersedia mata bor set 20 pcs untuk kayu, besi, dan tembok. Cocok untuk renovasi rumah.',
    condition: 'Bekas (Terawat)',
    rentPerDay: 75000,
    collateral: 600000,
    isAvailable: true,
    lat: '-6.1751',
    lng: '106.8650',
    city: 'Jakarta',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80',
    ],
    rating: 4.4,
    reviewCount: 52,
    minDuration: 1,
    maxDuration: 7,
  },
  {
    id: 8,
    owner: 'GSTLR333STELLAR456OWNER008',
    ownerName: 'Putri Amalia',
    title: 'Kayak Inflatable 2 Orang',
    category: 'Olahraga',
    description:
      'Kayak tiup 2 orang dengan bahan PVC tebal anti-tusuk. Set lengkap: kayak, dayung 2 buah, pompa, dan tas bawaan. Ideal untuk danau, sungai tenang, atau pantai.',
    condition: 'Seperti Baru',
    rentPerDay: 200000,
    collateral: 2500000,
    isAvailable: true,
    lat: '-8.4095',
    lng: '115.1889',
    city: 'Bali',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
    ],
    rating: 4.9,
    reviewCount: 18,
    minDuration: 1,
    maxDuration: 14,
  },
];

// Data transaksi dummy untuk "My Rentals" di halaman Renter
export const mockRentals = [
  {
    id: 1,
    itemId: 3,
    item: mockItems[2], // DJI Drone
    renter: 'GSTLR_YOU_RENTER_001',
    courier: 'GCOURIER_001',
    courierName: 'Andi Jaya Kurir',
    collateralLocked: 5000000,
    totalRent: 350000 * 3,
    duration: 3,
    status: 'Delivering', // Matching | Delivering | Active | Completed
    startDate: '2026-05-21',
    endDate: '2026-05-24',
  },
  {
    id: 2,
    itemId: 6,
    item: mockItems[5], // Gitar
    renter: 'GSTLR_YOU_RENTER_001',
    courier: 'GCOURIER_002',
    courierName: 'Bejo Express',
    collateralLocked: 300000,
    totalRent: 50000 * 7,
    duration: 7,
    status: 'Completed',
    startDate: '2026-05-10',
    endDate: '2026-05-17',
  },
  {
    id: 3,
    itemId: 5,
    item: mockItems[4], // Proyektor
    renter: 'GSTLR_YOU_RENTER_001',
    courier: 'GCOURIER_003',
    courierName: 'Cepat Delivery',
    collateralLocked: 2000000,
    totalRent: 180000 * 2,
    duration: 2,
    status: 'Matching',
    startDate: '2026-05-23',
    endDate: '2026-05-25',
  },
];

// Data listing dummy untuk "My Listings" di halaman Owner
export const mockOwnerItems = [
  {
    ...mockItems[0],
    id: 10,
    owner: 'GSTLR_YOU_OWNER_001',
    ownerName: 'Kamu',
  },
  {
    ...mockItems[1],
    id: 11,
    isAvailable: false,
    owner: 'GSTLR_YOU_OWNER_001',
    ownerName: 'Kamu',
  },
];

export const mockOwnerRentals = [
  {
    id: 5,
    itemId: 11,
    item: mockOwnerItems[1],
    renter: 'GSTLR_RENTER_XYZ',
    renterName: 'Ahmad Fauzi',
    courier: 'GCOURIER_001',
    courierName: 'Andi Jaya Kurir',
    collateralLocked: 500000,
    totalRent: 85000 * 3,
    courierFee: 50000,
    duration: 3,
    status: 'Active',
    startDate: '2026-05-21',
    endDate: '2026-05-24',
  },
];

export const formatIDR = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getStatusLabel = (status) => {
  const map = {
    Matching:   { label: 'Menunggu Kurir',   class: 'badge-matching' },
    Delivering: { label: 'Dalam Perjalanan', class: 'badge-delivering' },
    Active:     { label: 'Sedang Disewa',    class: 'badge-rented' },
    Completed:  { label: 'Selesai',          class: 'badge-completed' },
    Available:  { label: 'Tersedia',         class: 'badge-available' },
  };
  return map[status] || { label: status, class: 'badge-available' };
};
