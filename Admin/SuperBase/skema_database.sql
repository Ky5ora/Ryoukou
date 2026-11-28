-- ============================================================
-- RYOKOU - SKEMA DATABASE (Supabase / PostgreSQL)
-- Fokus: Pengembalian, Riwayat Penyewaan, Laporan Data Motor
-- Jalankan melalui Supabase SQL Editor.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- ENUM ----------
do $$ begin
  create type user_role as enum ('admin', 'owner', 'staff', 'customer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type motor_status as enum ('tersedia', 'disewa', 'perbaikan');
exception when duplicate_object then null; end $$;

do $$ begin
  create type rental_status as enum ('menunggu_verifikasi', 'dalam_penyewaan', 'selesai', 'dibatalkan');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('belum_lunas', 'lunas', 'ditolak');
exception when duplicate_object then null; end $$;

do $$ begin
  create type returned_by as enum ('penyewa', 'penerima_kuasa');
exception when duplicate_object then null; end $$;

do $$ begin
  create type fine_type as enum ('keterlambatan', 'luar_wilayah', 'kerusakan');
exception when duplicate_object then null; end $$;

do $$ begin
  create type document_type as enum ('ktp', 'sim', 'tiket', 'penginapan', 'foto_pengguna', 'surat_pertanggungjawaban', 'bukti_ketidakhadiran');
exception when duplicate_object then null; end $$;

do $$ begin
  create type photo_side as enum ('depan', 'belakang', 'kiri', 'kanan');
exception when duplicate_object then null; end $$;

-- ---------- PENGGUNA & CABANG ----------
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  auth_uid      uuid unique,
  role          user_role not null default 'customer',
  nama_lengkap  text not null,
  email         text not null unique,
  phone         text,
  created_at    timestamptz not null default now()
);

create table if not exists public.branches (
  id        uuid primary key default gen_random_uuid(),
  kode      text not null unique,
  nama      text not null,
  kota      text not null,
  alamat    text,
  created_at timestamptz not null default now()
);

-- ---------- ARMADA ----------
create table if not exists public.motorcycles (
  id              uuid primary key default gen_random_uuid(),
  kode            text not null unique,
  merek           text not null,
  tipe            text not null,
  no_polisi       text not null unique,
  tahun           integer not null,
  tarif_harian    numeric(12,2) not null check (tarif_harian >= 0),
  denda_per_jam   numeric(12,2) not null default 10000 check (denda_per_jam >= 0),
  status          motor_status not null default 'tersedia',
  kondisi         text not null default 'Baik',
  km_terakhir     integer,
  branch_id       uuid not null references public.branches(id),
  foto_depan      text,
  foto_belakang   text,
  foto_kiri       text,
  foto_kanan      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------- TRANSAKSI / RIWAYAT ----------
create table if not exists public.rentals (
  id                uuid primary key default gen_random_uuid(),
  kode_trx          text not null unique,
  customer_id       uuid not null references public.users(id),
  motor_id          uuid not null references public.motorcycles(id),
  branch_id         uuid not null references public.branches(id),
  start_at          timestamptz not null,
  due_at            timestamptz not null,
  returned_at       timestamptz,
  durasi_hari       integer not null default 1 check (durasi_hari > 0),
  lokasi_ambil      text,
  lokasi_kembali    text,
  status            rental_status not null default 'menunggu_verifikasi',
  payment_status    payment_status not null default 'belum_lunas',
  metode_pembayaran text,
  total_sewa        numeric(12,2) not null default 0,
  total_denda       numeric(12,2) not null default 0,
  grand_total       numeric(12,2) not null default 0,
  admin_id          uuid references public.users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint cek_jadwal check (due_at > start_at)
);

create table if not exists public.rental_documents (
  id            uuid primary key default gen_random_uuid(),
  rental_id     uuid not null references public.rentals(id) on delete cascade,
  jenis         document_type not null,
  file_url      text not null,
  uploaded_at   timestamptz not null default now(),
  verified_by   uuid references public.users(id),
  verified_at   timestamptz
);

create table if not exists public.payments (
  id            uuid primary key default gen_random_uuid(),
  rental_id     uuid not null references public.rentals(id) on delete cascade,
  metode        text not null check (metode in ('tunai', 'qris', 'virtual_account', 'transfer_bank')),
  jumlah        numeric(12,2) not null default 0,
  status        payment_status not null default 'belum_lunas',
  bukti_url     text,
  validated_by  uuid references public.users(id),
  validated_at  timestamptz,
  catatan       text,
  created_at    timestamptz not null default now()
);

-- ---------- PENGEMBALIAN ----------
create table if not exists public.returns (
  id                           uuid primary key default gen_random_uuid(),
  rental_id                    uuid not null unique references public.rentals(id) on delete cascade,
  returned_at                  timestamptz not null,
  returned_by                  returned_by not null default 'penyewa',
  proxy_nama                   text,
  proxy_hubungan               text,
  surat_pertanggungjawaban_url text,
  bukti_ketidakhadiran_url     text,
  kondisi_unit                 text not null check (kondisi_unit in ('Baik', 'Perlu Pemeriksaan', 'Rusak')),
  km_akhir                     integer,
  bbm                          text,
  catatan                      text,
  admin_id                     uuid references public.users(id),
  created_at                   timestamptz not null default now(),
  constraint cek_wakil check (
    returned_by = 'penyewa'
    or (proxy_nama is not null and proxy_hubungan is not null
        and surat_pertanggungjawaban_url is not null
        and bukti_ketidakhadiran_url is not null)
  )
);

create table if not exists public.return_photos (
  id          uuid primary key default gen_random_uuid(),
  return_id   uuid not null references public.returns(id) on delete cascade,
  sisi        photo_side not null,
  file_url    text not null,
  uploaded_at timestamptz not null default now(),
  unique (return_id, sisi)
);

create table if not exists public.fines (
  id                            uuid primary key default gen_random_uuid(),
  rental_id                     uuid not null references public.rentals(id) on delete cascade,
  return_id                     uuid references public.returns(id) on delete cascade,
  jenis                         fine_type not null,
  jam_terlambat                 integer not null default 0,
  tarif_per_jam                 numeric(12,2) not null default 0,
  nominal                       numeric(12,2) not null default 0 check (nominal >= 0),
  deskripsi                     text,
  persetujuan_perbaikan_sendiri boolean not null default false,
  created_by                    uuid references public.users(id),
  created_at                    timestamptz not null default now()
);

create table if not exists public.invoices (
  id         uuid primary key default gen_random_uuid(),
  rental_id  uuid not null unique references public.rentals(id) on delete cascade,
  nomor      text not null unique,
  total      numeric(12,2) not null default 0,
  pdf_url    text,
  issued_at  timestamptz not null default now()
);

create table if not exists public.service_records (
  id                uuid primary key default gen_random_uuid(),
  motor_id          uuid not null references public.motorcycles(id) on delete cascade,
  servis_terakhir   date,
  servis_berikutnya date,
  catatan           text,
  biaya             numeric(12,2) not null default 0,
  created_at        timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id         bigint generated always as identity primary key,
  actor_id   uuid references public.users(id),
  aksi       text not null,
  entity     text not null,
  entity_id  uuid,
  detail     jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------- INDEKS ----------
create index if not exists idx_rentals_status_due   on public.rentals(status, due_at);
create index if not exists idx_rentals_branch_start on public.rentals(branch_id, start_at);
create index if not exists idx_rentals_customer     on public.rentals(customer_id);
create index if not exists idx_motor_status_branch  on public.motorcycles(status, branch_id);
create index if not exists idx_fines_rental         on public.fines(rental_id);
create index if not exists idx_returns_rental       on public.returns(rental_id);
create index if not exists idx_logs_created         on public.activity_logs(created_at desc);

-- ---------- FUNGSI HITUNG DENDA ----------
-- Dipakai oleh tombol "Selesaikan Pengembalian" di halaman Pengembalian.
create or replace function public.hitung_denda(
  p_due_at timestamptz,
  p_returned_at timestamptz,
  p_tarif_per_jam numeric,
  p_luar_wilayah boolean default false,
  p_biaya_kerusakan numeric default 0
)
returns table (
  jam_terlambat integer,
  denda_keterlambatan numeric,
  denda_luar_wilayah numeric,
  denda_kerusakan numeric,
  total_denda numeric
)
language plpgsql stable as $$
declare
  v_jam integer;
  v_late numeric;
  v_wilayah numeric;
  v_rusak numeric;
begin
  v_jam := case
    when p_returned_at > p_due_at
    then ceil(extract(epoch from (p_returned_at - p_due_at)) / 3600)::integer
    else 0
  end;
  v_late := v_jam * coalesce(p_tarif_per_jam, 0);
  v_wilayah := case when coalesce(p_luar_wilayah, false) then 300000 else 0 end;
  v_rusak := greatest(coalesce(p_biaya_kerusakan, 0), 0);

  return query
    select v_jam, v_late, v_wilayah, v_rusak, v_late + v_wilayah + v_rusak;
end;
$$;

-- ---------- HELPER HAK AKSES ----------
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.users u
    where u.auth_uid = auth.uid() and u.role in ('admin', 'owner')
  );
$$;

create or replace function public.is_staff()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.users u
    where u.auth_uid = auth.uid() and u.role in ('admin', 'owner', 'staff')
  );
$$;

-- ---------- ROW LEVEL SECURITY ----------
alter table public.users             enable row level security;
alter table public.branches          enable row level security;
alter table public.motorcycles       enable row level security;
alter table public.rentals           enable row level security;
alter table public.rental_documents  enable row level security;
alter table public.payments          enable row level security;
alter table public.returns           enable row level security;
alter table public.return_photos     enable row level security;
alter table public.fines             enable row level security;
alter table public.invoices          enable row level security;
alter table public.service_records   enable row level security;
alter table public.activity_logs     enable row level security;

-- Admin/Owner & Pegawai dapat membaca data operasional.
create policy "staff read branches" on public.branches for select using (public.is_staff());
create policy "staff read motorcycles" on public.motorcycles for select using (public.is_staff());
create policy "staff read rentals" on public.rentals for select using (public.is_staff());
create policy "staff read documents" on public.rental_documents for select using (public.is_staff());
create policy "staff read payments" on public.payments for select using (public.is_staff());
create policy "staff read returns" on public.returns for select using (public.is_staff());
create policy "staff read return photos" on public.return_photos for select using (public.is_staff());
create policy "staff read fines" on public.fines for select using (public.is_staff());
create policy "staff read invoices" on public.invoices for select using (public.is_staff());
create policy "staff read service" on public.service_records for select using (public.is_staff());
create policy "staff read logs" on public.activity_logs for select using (public.is_staff());

-- Pelanggan hanya melihat transaksi dan invoice miliknya.
create policy "customer read own rentals" on public.rentals for select using (
  customer_id in (select id from public.users where auth_uid = auth.uid())
);
create policy "customer read own invoices" on public.invoices for select using (
  rental_id in (
    select id from public.rentals where customer_id in (select id from public.users where auth_uid = auth.uid())
  )
);

-- Penulisan data operasional hanya Admin/Owner (kecuali catatan tertentu oleh pegawai).
create policy "admin manage motorcycles" on public.motorcycles for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage branches" on public.branches for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage rentals" on public.rentals for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage documents" on public.rental_documents for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage payments" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage returns" on public.returns for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage return photos" on public.return_photos for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage fines" on public.fines for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage invoices" on public.invoices for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage service" on public.service_records for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage logs" on public.activity_logs for all using (public.is_admin()) with check (public.is_admin());

-- Akun: pengguna melihat akun sendiri; admin melihat semua.
create policy "users read self" on public.users for select using (
  auth_uid = auth.uid() or public.is_admin()
);
create policy "users update self" on public.users for update using (auth_uid = auth.uid()) with check (auth_uid = auth.uid());

-- ---------- DATA AWAL CABANG ----------
insert into public.branches (kode, nama, kota, alamat) values
  ('BT-SRM', 'RYOKOU Batu Sarimun', 'Batu', 'Jalan Sarimun, Kota Batu'),
  ('BT-DPN', 'RYOKOU Batu Diponegoro', 'Batu', 'Jalan Diponegoro, Kota Batu'),
  ('ML-LWK', 'RYOKOU Malang Lowokwaru', 'Malang', 'Kecamatan Lowokwaru, Kota Malang'),
  ('ML-KLJ', 'RYOKOU Malang Klojen', 'Malang', 'Kecamatan Klojen, Kota Malang')
on conflict (kode) do nothing;
