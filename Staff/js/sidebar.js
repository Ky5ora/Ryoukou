/**
 * sidebar.js – sidebar RYOKOU yang dipakai bersama di semua halaman.
 *
 * Cara pakai (di dalam <div class="flex min-h-screen ..."> menggantikan seluruh <aside>):
 *   <script src="../js/sidebar.js" data-role="staff" data-active="pembayaran"></script>
 *
 * Wajib ditaruh SEBELUM dashboard.js / script halaman lain, karena script lain
 * mencari #sidebar, #closeMobileSidebarBtn, #mobileBackdrop, dll. saat dimuat.
 * Tidak memakai fetch(), jadi tetap jalan saat dibuka lewat file:///.
 */
(() => {
  'use strict';

  /* ================= 1. EDIT DI SINI: daftar halaman ================= */
  const PAGES = {
    dashboard:    '0.Dahboard.html',
    penyewaan:    '1.info_penyewaan.html',
    pembayaran:   '2.pembayaran.html',
    pengembalian: '3.pengembalian.html',
    riwayat:      '4.riwayat_penyewaan.html',
    laporan:      'Laporan_data_motor.html',
    pengaturan:   '5.pengaturan.html',
  };

  /* ================= 2. Ikon ================= */
  const ICONS = {
    dashboard:    '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    motor:        '<circle cx="5.5" cy="17.5" r="3"/><circle cx="18.5" cy="17.5" r="3"/><path stroke-linecap="round" stroke-linejoin="round" d="M8.5 17.5h5l2.5-6h-5l-2 3.5H5.5M14 11.5l-1.5-3.5H10m6 3.5l2.5 6"/>',
    transaksi:    '<path stroke-linecap="round" stroke-linejoin="round" d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/>',
    penyewaan:    '<rect x="3" y="4" width="18" height="18" rx="2.5"/><path stroke-linecap="round" d="M16 2v4M8 2v4M3 10h18M9 15h.01M12 15h.01M15 15h.01"/>',
    pembayaran:   '<rect x="2" y="6" width="20" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.5"/><path stroke-linecap="round" d="M6 12h.01M18 12h.01"/>',
    pengembalian: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>',
    riwayat:      '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/><path stroke-linecap="round" stroke-linejoin="round" d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>',
    laporan:      '<path stroke-linecap="round" stroke-linejoin="round" d="M6 3h9l4 4v14H6zM9 12h7M9 16h7"/>',
    pengaturan:   '<circle cx="12" cy="12" r="3"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  };

  /* ================= 3. Menu per role ================= */
  const MENUS = {
    staff: {
      utama: [
        ['dashboard',    'Dashboard'],
        ['penyewaan',    'Info Penyewaan'],
        ['pembayaran',   'Pembayaran'],
        ['pengembalian', 'Pengembalian'],
        ['riwayat',      'Riwayat Penyewaan'],
      ],
      lainnya: [['pengaturan', 'Pengaturan']],
    },
    admin: {
      utama: [
        ['dashboard',    'Dashboard'],
        ['motor',        'Kelola Data Motor'],
        ['transaksi',    'Kelola Transaksi'],
        ['penyewaan',    'Info Penyewaan'],
        ['pembayaran',   'Pembayaran'],
        ['pengembalian', 'Pengembalian'],
        ['riwayat',      'Riwayat Penyewaan'],
        ['laporan',      'Laporan Data Motor'],
      ],
      lainnya: [],
    },
  };

  /* ================= 4. Logo ================= */
  const LOGO = `
<svg viewBox="0 0 220 220" class="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
  <defs><path id="topArc" d="M 46,96 A 64,64 0 0,1 174,96"/></defs>
  <path d="M110,8 C122,8 128,18 140,21 C152,24 164,20 173,29 C182,38 179,50 185,61 C191,72 203,77 205,89 C207,101 199,111 199,123 C199,135 207,145 204,157 C201,169 189,173 182,183 C175,193 177,205 166,211 C155,217 144,210 132,213 C120,216 116,224 110,224 C104,224 100,216 88,213 C76,210 65,217 54,211 C43,205 45,193 38,183 C31,173 19,169 16,157 C13,145 21,135 21,123 C21,111 13,101 15,89 C17,77 29,72 35,61 C41,50 38,38 47,29 C56,20 68,24 80,21 C92,18 98,8 110,8 Z" transform="scale(0.92) translate(9.5, 5)" fill="#0C4651" stroke="#F5F2DC" stroke-width="4.5"/>
  <text fill="#F4CE5C" font-size="16" font-weight="800" letter-spacing="3.5" font-family="Plus Jakarta Sans, sans-serif"><textPath href="#topArc" startOffset="50%" text-anchor="middle">OTO RENT</textPath></text>
  <g stroke="#F5F2DC" stroke-width="4.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="83" cy="70" r="8.5"/><circle cx="137" cy="70" r="8.5"/>
    <path d="M91.5,70 Q98,70 101,75"/><path d="M128.5,70 Q122,70 119,75"/>
    <rect x="85" y="82" width="12" height="6" rx="2.5"/><rect x="123" y="82" width="12" height="6" rx="2.5"/>
    <path d="M101,75 C101,64 119,64 119,75"/>
    <circle cx="110" cy="86" r="11" fill="#0C4651"/><circle cx="110" cy="86" r="4.5"/>
    <path d="M96,90 C91,99 90,115 94,126 L126,126 C130,115 129,99 124,90"/><path d="M97,94 L110,114 L123,94"/>
    <rect x="86" y="106" width="6" height="17" rx="3"/><rect x="128" y="106" width="6" height="17" rx="3"/>
    <path d="M99,122 C99,112 121,112 121,122 Z" fill="#0C4651"/>
    <rect x="102" y="122" width="16" height="23" rx="7" fill="#0C4651"/>
    <line x1="110" y1="123" x2="110" y2="144" stroke-width="3"/>
    <line x1="103" y1="130" x2="107" y2="130" stroke-width="2.5"/><line x1="113" y1="130" x2="117" y2="130" stroke-width="2.5"/>
    <line x1="103" y1="137" x2="107" y2="137" stroke-width="2.5"/><line x1="113" y1="137" x2="117" y2="137" stroke-width="2.5"/>
  </g>
  <rect x="36" y="114" width="44" height="24" rx="5" fill="#0C4651" stroke="#F5F2DC" stroke-width="3.2"/>
  <text x="58" y="131" fill="#F4CE5C" font-size="13.5" font-weight="800" text-anchor="middle" letter-spacing="0.8">ESTD</text>
  <rect x="140" y="114" width="44" height="24" rx="5" fill="#0C4651" stroke="#F5F2DC" stroke-width="3.2"/>
  <text x="162" y="131" fill="#F4CE5C" font-size="13.5" font-weight="800" text-anchor="middle" letter-spacing="0.5">2023</text>
  <circle cx="57" cy="161" r="3.5" fill="#F5F2DC"/>
  <text x="110" y="167" fill="#F4CE5C" font-size="22" font-weight="800" text-anchor="middle" letter-spacing="1.5">RYOKOU</text>
  <circle cx="163" cy="161" r="3.5" fill="#F5F2DC"/>
  <text x="110" y="185" fill="#F4CE5C" font-size="11.5" font-weight="800" text-anchor="middle" letter-spacing="1">BY : M<tspan dy="-3" font-size="8">2</tspan></text>
</svg>`;

  /* ================= 5. Builder ================= */
  const script = document.currentScript;
  const role   = script.dataset.role   || 'staff';
  const active = script.dataset.active || '';
  const menu   = MENUS[role] || MENUS.staff;

  const BASE   = 'nav-item w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13.5px] text-left transition-all';
  const ON     = 'active font-semibold bg-white text-[#0C4651] shadow-sm';
  const OFF    = 'font-medium text-white/85 hover:bg-white/10 hover:text-white';

  const item = ([key, label]) => `
    <a href="${PAGES[key] || '#'}" data-nav="${key}" data-tooltip="${label}"
       class="${BASE} ${key === active ? ON : OFF}" ${key === active ? 'aria-current="page"' : ''}>
      <svg class="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${ICONS[key]}</svg>
      <span class="sidebar-label truncate">${label}</span>
    </a>`;

  const sectionTitle = (text) =>
    `<p class="sidebar-section-title px-3 mb-2.5 text-[10px] font-bold tracking-[0.12em] text-white/60 uppercase">${text}</p>`;

  const html = `
<div id="mobileBackdrop" class="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px] z-30 hidden lg:hidden transition-opacity"></div>

<aside id="sidebar" class="sidebar-expanded fixed lg:sticky top-0 left-0 z-40 h-screen bg-[#0C4651] text-white flex flex-col justify-between shrink-0 select-none shadow-xl lg:shadow-none -translate-x-full lg:translate-x-0">
  <div>
    <div id="brandHeader" class="flex items-center justify-between px-5 pt-6 pb-5">
      <div class="flex items-center gap-3.5 min-w-0">
        <div class="w-12 h-12 shrink-0 flex items-center justify-center" title="RYOKOU Oto Rent">${LOGO}</div>
        <span class="sidebar-label text-[#F4CE5C] font-extrabold text-[20px] tracking-wider uppercase truncate">RYOKOU</span>
      </div>
      <button id="closeMobileSidebarBtn" class="lg:hidden p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition" aria-label="Tutup Menu">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <div class="px-3.5 mt-2">
      ${sectionTitle('MENU UTAMA')}
      <nav class="space-y-1.5" id="mainNav">${menu.utama.map(item).join('')}</nav>
    </div>

    ${menu.lainnya.length ? `
    <div class="px-3.5 mt-7">
      ${sectionTitle('LAINNYA')}
      <nav class="space-y-1.5">${menu.lainnya.map(item).join('')}</nav>
    </div>` : ''}
  </div>

  <div class="p-3.5">
    <button id="sidebarLogoutBtn" data-tooltip="Keluar" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 text-[13.5px] font-medium transition-all">
      <svg class="w-[18px] h-[18px] shrink-0 text-[#F87171]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
      <span class="sidebar-label truncate">Keluar</span>
    </button>
  </div>
</aside>`;

  script.insertAdjacentHTML('beforebegin', html);
})();