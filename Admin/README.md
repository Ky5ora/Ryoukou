# RYOKOU Front-end — berdasarkan screenshot Figma

## Halaman
- `login.html`, `otp.html`, `register.html`, `verify-email.html`, `reset-password.html` — alur autentikasi tampilan demo dengan verifikasi OTP.
- `dashboard.html` — dashboard admin dengan statistik, grafik, status unit, transaksi terbaru, dan aksi cepat.
- `Kelola_data_motor.html`, `motor-list.html`, `add-motor.html` — pengelolaan dan penambahan unit motor.
- `Kelola_transaksi.html` — daftar transaksi, detail, verifikasi, pengecekan motor, denda, dan formulir **Transaksi Walk-in**.
- `Info_penyewaan.html` — ringkasan data pesanan dan dokumen pendukung.
- `Pembayaran.html` — validasi pembayaran pelanggan.
- `Pengembalian.html` — pencatatan pengembalian motor.
- `Riwayat_penyewaan.html` — daftar riwayat transaksi.
- `Laporan_data_motor.html` — ringkasan laporan unit motor.
- `invoice.html` — invoice pelanggan, cetak/simpan PDF, dan berbagi melalui WhatsApp.
- `Pengaturan.html` — pengaturan akun admin yang dibuka dari menu profil (bukan dari sidebar), termasuk ubah foto profil.

## File utama
- `auth.css` dan `auth.js` untuk halaman login, daftar, dan pemulihan sandi
- `dashboard.css` dan `dashboard.js` untuk dashboard admin
- `index.html`, `style.css`, `script.js`, dan `assets/` dari versi katalog rental motor sebelumnya

## Menjalankan
Buka folder ini di VS Code, lalu klik kanan file yang ingin dilihat dan pilih **Open with Live Server**. Bisa juga membuka HTML langsung melalui browser. Bootstrap Icons dan font Google membutuhkan koneksi internet.

## Catatan
Ini front-end demo. Data login, akun, email verifikasi, transaksi, dan password belum disimpan/diolah oleh backend atau database. Nilai dashboard dan harga merupakan data contoh. Screenshot yang diberikan menjadi acuan layout dan warna; tampilan dapat berbeda sedikit karena ukuran layar, font, dan browser.


## Halaman kelola motor (tambahan berdasarkan screenshot terbaru)
- `motor-list.html` — daftar 13 motor, foto, status, pencarian, filter status, dan tombol Detail.
- `add-motor.html` — form tambah motor, unggah foto dengan preview, merek, tipe, nomor polisi, tahun, harga per hari, dan status.
- `motor.css`, `motor-list.js`, `add-motor.css`, `add-motor.js` — styling dan interaksi halaman kelola motor.


## Pembaruan halaman admin (22 November 2026)
- Sidebar admin diseragamkan dengan logo RYOKOU dari aset `assets/ryokou-logo.png`, menu aktif mengikuti halaman, dan tautan menu diarahkan ke file HTML yang benar.
- `Kelola_transaksi.html` hanya menyediakan aksi pembuatan transaksi manual melalui **Transaksi Walk-in**; tombol/halaman transaksi baru biasa dihilangkan.
- `Info_penyewaan.html` dan `Pembayaran.html` diperbarui mengikuti screenshot referensi, termasuk pratinjau bukti dan validasi pembayaran.
- `invoice.html` menyediakan invoice, tombol cetak/simpan sebagai PDF, serta berbagi ke pelanggan lewat WhatsApp.
- Halaman admin baru memakai Bootstrap 5.3.3, Bootstrap Icons, dan CSS3. Proyek ini masih front-end demo: data transaksi disimpan sementara di browser (`localStorage`) dan belum tersambung ke backend/API/email/WhatsApp otomatis. Saat tombol WhatsApp digunakan, aplikasi WhatsApp akan terbuka dan admin tetap perlu menekan tombol Kirim.


## Revisi lanjutan (22 November 2026)
- Pengaturan akun dipindahkan dari sidebar ke dropdown profil admin. Halaman akun mengikuti tampilan profil, mendukung ubah foto, nama lengkap, dan email (disimpan lokal di browser).
- Halaman Pembayaran dirapikan mengikuti screenshot: validasi diterima/ditolak, pilihan alasan penolakan, catatan, modal untuk melihat bukti pembayaran, dan tombol unduh bukti. Invoice hanya ditampilkan setelah pembayaran diterima.
- Login diarahkan ke halaman OTP. Kode simulasi untuk demo adalah `123456`; alur ini belum mengirim OTP melalui email/SMS karena proyek belum terhubung ke backend.
- Empat kartu statistik Dashboard (Total Unit Motor, Tersedia, Disewa, Perbaikan) disamakan tinggi, jarak, ikon, dan tata letaknya.
- Navigasi profil di halaman admin menyediakan akses ke Pengaturan dan Keluar dari Admin.

## Detail desain 3 halaman admin (25 November 2026)
- `html/Pengembalian.html` — antrean pengembalian + formulir lengkap: waktu aktual, pihak pengembalian (penyewa/perwakilan + surat pertanggungjawaban & bukti), foto 4 sisi, kondisi unit, denda otomatis (keterlambatan, wilayah Rp 300.000, kerusakan manual), dan grand total. Draft/selesai disimpan sementara di `localStorage`.
- `html/Riwayat_penyewaan.html` — statistik, filter status/cabang/tanggal, paginasi, modal detail dengan timeline status, dan ekspor CSV.
- `html/Laporan_data_motor.html` — statistik & grafik status, filter, pengurutan, detail unit (pendapatan, servis, riwayat sewa), cetak, dan ekspor CSV.
- `css/admin-report-pages.css` dan `js/admin-report-pages.js` — gaya dan interaksi bersama ketiga halaman.
- `docs/PRD_Admin_Website_Pengembalian_Riwayat_Laporan.md` — PRD detail + user flow admin (mermaid) + aturan bisnis + pemetaan halaman ke database.
- `docs/skema_database.sql` — skema Supabase/PostgreSQL (tabel, enum, indeks, fungsi `hitung_denda`, dan RLS) untuk ketiga halaman tersebut.
