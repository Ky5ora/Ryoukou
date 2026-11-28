# ARSITEKTUR FRONTEND REACT + BACKEND NODE.JS (Rencana)
## RYOKOU Admin Website

| Item | Keputusan |
|---|---|
| Frontend | **React 18 + Vite + React Router** |
| Backend | **Node.js + Express** (menyusul) |
| Database demo | **SQLite** (direpresentasikan mock API berbasis `localStorage`) |
| Database produksi | Supabase/PostgreSQL (skema ada di `Admin/docs/skema_database.sql`) |
| Status saat ini | Frontend React selesai untuk 3 halaman; API masih mock |

---

## 1. STRUKTUR FOLDER

```
AdminReact/
├── index.html
├── package.json
├── vite.config.js
├── public/assets/            # logo + foto motor (disalin dari Admin/assets)
└── src/
    ├── main.jsx              # entry + BrowserRouter
    ├── App.jsx               # routing halaman
    ├── api/
    │   ├── client.js         # satu pintu API: mock ↔ HTTP
    │   └── mockApi.js        # simulasi endpoint Node.js + SQLite demo
    ├── components/
    │   ├── Layout.jsx        # sidebar + topbar + outlet
    │   └── Ui.jsx            # Stat, Pill, Modal, Toast, Empty
    ├── data/seed.js          # data contoh tabel SQLite
    ├── pages/
    │   ├── Pengembalian.jsx
    │   ├── RiwayatPenyewaan.jsx
    │   └── LaporanDataMotor.jsx
    ├── styles/admin.css
    └── utils/format.js       # money, tanggal, hitungDenda, CSV
```

## 2. CARA MENJALANKAN FRONTEND

```bash
cd AdminReact
npm install
npm run dev
```

Buka `http://localhost:5173/pengembalian`. Mode demo ditampilkan di sidebar: **“Demo SQLite (mock API)”**.

## 3. LAPISAN API (Siap Diganti Backend)

Semua komponen hanya memanggil `api` dari `src/api/client.js`, bukan `localStorage` langsung.

```js
// Sekarang (default)
VITE_USE_MOCK=true

// Nanti, setelah backend Node.js berjalan
VITE_USE_MOCK=false
VITE_API_BASE=http://localhost:3000/api
```

Buat file `.env` di folder `AdminReact` dengan dua baris di atas. **Tidak ada komponen yang perlu diubah.**

### Endpoint yang akan dibuat di backend Node.js

| Method | Endpoint | Dipakai oleh | Fungsi |
|---|---|---|---|
| GET | `/api/health` | Sidebar | Cek status API |
| GET | `/api/returns` | Pengembalian | Antrean pengembalian |
| POST | `/api/returns/:id/draft` | Pengembalian | Simpan draft pemeriksaan |
| POST | `/api/returns/:id/complete` | Pengembalian | Tutup pengembalian + update motor + denda |
| GET | `/api/rentals` | Riwayat | Daftar transaksi |
| GET | `/api/motors` | Laporan | Inventaris motor + agregat sewa |
| POST | `/api/demo/reset` | Demo | Reset data contoh |

## 4. SKEMA SQLITE UNTUK DEMO/BACKEND

Versi SQLite dari skema Supabase (disederhanakan; kolom foto/disertifikat disimpan sebagai path file):

```sql
CREATE TABLE IF NOT EXISTS returns (
  id TEXT PRIMARY KEY,
  rental_id TEXT NOT NULL,
  customer TEXT NOT NULL,
  motor TEXT NOT NULL,
  plate TEXT NOT NULL,
  branch TEXT NOT NULL,
  deadline TEXT NOT NULL,
  return_at TEXT,
  returned_by TEXT DEFAULT 'penyewa',
  proxy_name TEXT,
  proxy_relation TEXT,
  condition_unit TEXT DEFAULT 'Baik',
  damage_fine NUMERIC DEFAULT 0,
  region_fine INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Menunggu Pemeriksaan'
);

CREATE TABLE IF NOT EXISTS rentals (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  motor TEXT NOT NULL,
  plate TEXT NOT NULL,
  branch TEXT NOT NULL,
  start_at TEXT NOT NULL,
  end_at TEXT NOT NULL,
  days INTEGER NOT NULL,
  total NUMERIC NOT NULL,
  fine NUMERIC DEFAULT 0,
  status TEXT NOT NULL,
  payment_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS motors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  plate TEXT NOT NULL UNIQUE,
  branch TEXT NOT NULL,
  status TEXT NOT NULL,
  price NUMERIC NOT NULL,
  days INTEGER DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  photo TEXT,
  condition_unit TEXT,
  last_service TEXT,
  next_service TEXT
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  created_at TEXT NOT NULL
);
```

Mock API di `mockApi.js` menyimpan tabel-tabel ini sebagai satu objek JSON di `localStorage` dengan kunci `ryokou_react_sqlite_demo_v1`.

## 5. ATURAN BISNIS YANG SUDAH DITARUH DI FRONTEND

Fungsi `hitungDenda()` di `src/utils/format.js`:

```
jam_terlambat   = CEIL((return_at - deadline) / 1 jam)
denda_latel     = jam_terlambat × tarif_denda_per_jam unit
denda_wilayah   = 300000 jika luar wilayah Malang–Batu
denda_kerusakan = input manual admin
total_denda     = ketiganya dijumlahkan
grand_total     = total_sewa + total_denda
```

Saat backend Node.js siap, kalkulasi ini **sebaiknya dipindahkan ke server** (endpoint `/api/returns/:id/complete`) agar tidak bisa dimanipulasi dari browser. Fungsi frontend tetap dipakai sebagai pratinjau real-time.

## 6. MIGRASI KE BACKEND NODES.JS (Langkah Berikutnya)

1. Buat folder `AdminReact/server/` dengan Express + `better-sqlite3`.
2. Jalankan DDL SQLite di atas saat server start.
3. Implementasikan endpoint pada tabel di bagian 3.
4. Pindahkan `hitungDenda()` ke server dan kembalikan hasilnya ke React.
5. Simpan file upload ke folder `server/uploads/` (atau Supabase Storage untuk produksi).
6. Tambahkan autentikasi JWT + role (`admin`, `owner`, `staff`) sesuai PRD.
7. Set `.env`: `VITE_USE_MOCK=false`, `VITE_API_BASE=http://localhost:3000/api`.
8. Uji ulang 3 halaman: tidak ada perubahan pada file `src/pages/*`.

## 7. PERBEDAAN DENGAN VERSI HTML LAMA

| Aspek | HTML lama (`Admin/html/`) | React (`AdminReact/`) |
|---|---|---|
| State & filter | IIFE + manipulasi DOM | React hooks + render deklaratif |
| API | `localStorage` langsung | `api` abstraction (mock → HTTP) |
| Routing | `window.location` | React Router |
| Modal | Bootstrap JS | Komponen React mandiri |
| Backend | Belum ada | Disiapkan (Node.js + SQLite) |
| Database produksi | Supabase direncanakan | Supabase tetap direncanakan |
