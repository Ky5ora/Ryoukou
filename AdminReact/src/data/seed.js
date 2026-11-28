// Data contoh yang meniru isi tabel SQLite untuk demo React.
// Saat backend Node.js siap, file ini digantikan oleh response API.

export const returnsSeed = [
  { id: 'TRX-011', customer: 'Rizky Pratama', phone: '0812-3344-5566', motor: 'Honda Scoopy', plate: 'N 2234 AB', branch: 'Batu · Sarimun', start: '2026-11-23T16:00', deadline: '2026-11-25T16:00', returnAt: '', location: 'Jl. Sarimun No. 8, Batu', guarantee: 'KTP asli ditahan', rentTotal: 180000, lateRate: 10000, status: 'Menunggu Pemeriksaan', payment: 'Lunas' },
  { id: 'TRX-012', customer: 'Valentina Alexsandra', phone: '0811-2345-6789', motor: 'Honda Beat Deluxe', plate: 'N 1234 KZ', branch: 'Malang · Lowokwaru', start: '2026-11-24T09:00', deadline: '2026-11-25T09:00', returnAt: '', location: 'Rental RYOKOU Malang', guarantee: 'SIM C ditahan', rentTotal: 83000, lateRate: 10000, status: 'Terjadwal', payment: 'Lunas' },
  { id: 'TRX-013', customer: 'Nadia Putri', phone: '0857-9911-2233', motor: 'Honda Vario 125', plate: 'N 3234 CD', branch: 'Batu · Diponegoro', start: '2026-11-24T11:00', deadline: '2026-11-26T11:00', returnAt: '', location: 'Jl. Diponegoro No. 21, Batu', guarantee: 'KTP asli ditahan', rentTotal: 95000, lateRate: 12000, status: 'Terjadwal', payment: 'Lunas' },
  { id: 'TRX-014', customer: 'Fajar Ramadhan', phone: '0821-4455-6677', motor: 'Yamaha NMAX', plate: 'N 4421 MN', branch: 'Malang · Klojen', start: '2026-11-22T08:00', deadline: '2026-11-25T08:00', returnAt: '2026-11-25T11:00', location: 'Rental RYOKOU Klojen', guarantee: 'KTP + SIM ditahan', rentTotal: 250000, lateRate: 20000, status: 'Dalam Pemeriksaan', payment: 'Lunas' },
  { id: 'TRX-015', customer: 'Dewi Kartika', phone: '0813-2211-8899', motor: 'Honda Beat Street', plate: 'N 5512 KP', branch: 'Malang · Lowokwaru', start: '2026-11-21T10:00', deadline: '2026-11-24T10:00', returnAt: '2026-11-24T10:20', location: 'Rental RYOKOU Malang', guarantee: 'KTP asli ditahan', rentTotal: 166000, lateRate: 10000, status: 'Selesai', payment: 'Lunas' }
];

export const rentalsSeed = [
  { id: 'TRX-004', customer: 'Valentina Alexsandra', phone: '0811-2345-6789', motor: 'Honda Beat Deluxe', plate: 'N 1234 KZ', branch: 'Malang · Lowokwaru', start: '2026-11-18T09:00', end: '2026-11-20T09:00', days: 2, total: 166000, fine: 0, status: 'Selesai', payment: 'Lunas' },
  { id: 'TRX-009', customer: 'Rizky Pratama', phone: '0812-3344-5566', motor: 'Honda Scoopy', plate: 'N 2234 AB', branch: 'Batu · Sarimun', start: '2026-11-16T10:00', end: '2026-11-17T10:00', days: 1, total: 90000, fine: 0, status: 'Selesai', payment: 'Lunas' },
  { id: 'TRX-005', customer: 'Nadia Putri', phone: '0857-9911-2233', motor: 'Honda Vario 125', plate: 'N 3234 CD', branch: 'Batu · Diponegoro', start: '2026-11-15T08:00', end: '2026-11-16T08:00', days: 1, total: 95000, fine: 0, status: 'Dibatalkan', payment: 'Belum Lunas' },
  { id: 'TRX-010', customer: 'Fajar Ramadhan', phone: '0821-4455-6677', motor: 'Yamaha NMAX', plate: 'N 4421 MN', branch: 'Malang · Klojen', start: '2026-11-12T08:00', end: '2026-11-14T08:00', days: 2, total: 250000, fine: 40000, status: 'Selesai', payment: 'Lunas' },
  { id: 'TRX-011', customer: 'Rizky Pratama', phone: '0812-3344-5566', motor: 'Honda Scoopy', plate: 'N 2234 AB', branch: 'Batu · Sarimun', start: '2026-11-23T16:00', end: '2026-11-25T16:00', days: 2, total: 180000, fine: 0, status: 'Dalam Penyewaan', payment: 'Lunas' },
  { id: 'TRX-012', customer: 'Valentina Alexsandra', phone: '0811-2345-6789', motor: 'Honda Beat Deluxe', plate: 'N 1234 KZ', branch: 'Malang · Lowokwaru', start: '2026-11-24T09:00', end: '2026-11-25T09:00', days: 1, total: 83000, fine: 0, status: 'Menunggu Verifikasi', payment: 'Belum Lunas' },
  { id: 'TRX-013', customer: 'Nadia Putri', phone: '0857-9911-2233', motor: 'Honda Vario 125', plate: 'N 3234 CD', branch: 'Batu · Diponegoro', start: '2026-11-24T11:00', end: '2026-11-26T11:00', days: 2, total: 190000, fine: 0, status: 'Dalam Penyewaan', payment: 'Lunas' },
  { id: 'TRX-014', customer: 'Fajar Ramadhan', phone: '0821-4455-6677', motor: 'Yamaha NMAX', plate: 'N 4421 MN', branch: 'Malang · Klojen', start: '2026-11-22T08:00', end: '2026-11-25T08:00', days: 3, total: 375000, fine: 60000, status: 'Dalam Penyewaan', payment: 'Lunas' },
  { id: 'TRX-015', customer: 'Dewi Kartika', phone: '0813-2211-8899', motor: 'Honda Beat Street', plate: 'N 5512 KP', branch: 'Malang · Lowokwaru', start: '2026-11-21T10:00', end: '2026-11-24T10:00', days: 3, total: 249000, fine: 20000, status: 'Selesai', payment: 'Lunas' },
  { id: 'TRX-016', customer: 'Budi Santoso', phone: '0812-8888-7777', motor: 'Honda Beat', plate: 'N 6610 BS', branch: 'Batu · Sarimun', start: '2026-11-10T07:00', end: '2026-11-12T07:00', days: 2, total: 140000, fine: 300000, status: 'Selesai', payment: 'Lunas' }
];

export const motorsSeed = [
  { id: 'MTR-001', name: 'Honda Beat Deluxe', brand: 'Honda', type: 'Beat Deluxe', plate: 'N 1234 KZ', year: 2024, branch: 'Malang · Lowokwaru', status: 'Tersedia', price: 83000, days: 12, revenue: 996000, condition: 'Baik', lastService: '2026-10-12', nextService: '2026-12-12', photo: 'beat-biru.png' },
  { id: 'MTR-002', name: 'Honda Scoopy', brand: 'Honda', type: 'Scoopy', plate: 'N 2234 AB', year: 2023, branch: 'Batu · Sarimun', status: 'Disewa', price: 90000, days: 15, revenue: 1350000, condition: 'Baik', lastService: '2026-09-28', nextService: '2026-11-28', photo: 'scoopy-krem.png' },
  { id: 'MTR-003', name: 'Honda Vario 125', brand: 'Honda', type: 'Vario 125', plate: 'N 3234 CD', year: 2024, branch: 'Batu · Diponegoro', status: 'Perbaikan', price: 95000, days: 8, revenue: 760000, condition: 'Rusak ringan', lastService: '2026-11-20', nextService: '2026-12-20', photo: 'vario-hitam.png' },
  { id: 'MTR-004', name: 'Yamaha NMAX', brand: 'Yamaha', type: 'NMAX 155', plate: 'N 4421 MN', year: 2025, branch: 'Malang · Klojen', status: 'Disewa', price: 125000, days: 18, revenue: 2250000, condition: 'Baik', lastService: '2026-10-05', nextService: '2026-12-05', photo: 'motor-trail.png' },
  { id: 'MTR-005', name: 'Honda Beat Street', brand: 'Honda', type: 'Beat Street', plate: 'N 5512 KP', year: 2023, branch: 'Malang · Lowokwaru', status: 'Tersedia', price: 83000, days: 10, revenue: 830000, condition: 'Baik', lastService: '2026-08-15', nextService: '2026-10-15', photo: 'beat-merah.png' },
  { id: 'MTR-006', name: 'Honda Beat', brand: 'Honda', type: 'Beat', plate: 'N 6610 BS', year: 2022, branch: 'Batu · Sarimun', status: 'Tersedia', price: 70000, days: 21, revenue: 1470000, condition: 'Perlu pemeriksaan', lastService: '2026-11-02', nextService: '2027-01-02', photo: 'beat-putih.png' },
  { id: 'MTR-007', name: 'Honda Vario 160', brand: 'Honda', type: 'Vario 160', plate: 'N 7718 VQ', year: 2025, branch: 'Batu · Diponegoro', status: 'Tersedia', price: 110000, days: 6, revenue: 660000, condition: 'Baik', lastService: '2026-11-11', nextService: '2027-01-11', photo: 'vario-merah.png' },
  { id: 'MTR-008', name: 'Honda Beat Krem', brand: 'Honda', type: 'Beat', plate: 'N 8890 KR', year: 2023, branch: 'Malang · Klojen', status: 'Perbaikan', price: 75000, days: 9, revenue: 675000, condition: 'Rusak', lastService: '2026-11-22', nextService: '2026-12-22', photo: 'beat-krem.png' }
];

export const BRANCHES = ['Batu · Sarimun', 'Batu · Diponegoro', 'Malang · Lowokwaru', 'Malang · Klojen'];
export const DEMO_NOW = '2026-11-25T19:00';
