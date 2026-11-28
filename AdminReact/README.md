# RYOKOU Admin — Versi React

Frontend Admin Website RYOKOU untuk 3 halaman:
- **Pengembalian** (`/pengembalian`)
- **Riwayat Penyewaan** (`/riwayat`)
- **Laporan Data Motor** (`/laporan-motor`)

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Untuk build produksi: `npm run build`.

## Tech stack

- Frontend: React 18, Vite, React Router, CSS3, Bootstrap Icons.
- Backend: **Node.js + Express (menyusul)**.
- Database demo: **SQLite** disimulasikan lewat mock API berbasis `localStorage`.
- Database produksi: Supabase/PostgreSQL (lihat `../Admin/docs/skema_database.sql`).

## Mode API

Secara default aplikasi memakai mock API:

```js
VITE_USE_MOCK=true
```

Setelah backend Node.js dibuat, buat file `.env`:

```env
VITE_USE_MOCK=false
VITE_API_BASE=http://localhost:3000/api
```

Komponen React tidak berubah—semua pemanggilan melewati `src/api/client.js`.

## Dokumen

- `docs/ARSITEKTUR_REACT_NODEJS.md` — struktur folder, daftar endpoint rencana, DDL SQLite, dan langkah migrasi ke backend.
- `../Admin/docs/PRD_Admin_Website_Pengembalian_Riwayat_Laporan.md` — PRD lengkap, user flow, dan aturan bisnis.
- `../Admin/docs/skema_database.sql` — skema Supabase untuk produksi.

## Catatan

Halaman lain di sidebar masih berupa placeholder. Data contoh dapat direset dengan menghapus kunci `ryokou_react_sqlite_demo_v1` di `localStorage` browser.
