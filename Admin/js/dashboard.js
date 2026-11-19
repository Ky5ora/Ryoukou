// ==================== DATA TRANSAKSI (13 DATA SESUAI DESAIN) ====================
const transactionsData = [
  { no: 1,  user: "Hash Aurelia",     motor: "Honda Vario 125", date: "18 Oktober 2026", status: "Aktif",   total: "Rp 83.000" },
  { no: 2,  user: "Reyna Putri",      motor: "Honda Vario 125", date: "19 Oktober 2026", status: "Aktif",   total: "Rp 130.000" },
  { no: 3,  user: "Jett Oktavia",     motor: "Honda Vario 125", date: "20 Oktober 2026", status: "Aktif",   total: "Rp 150.000" },
  { no: 4,  user: "Phoenix Saputra",  motor: "Honda Vario 125", date: "21 Oktober 2026", status: "Selesai", total: "Rp 180.000" },
  { no: 5,  user: "Sova Mahendra",    motor: "Honda Vario 125", date: "22 Oktober 2026", status: "Selesai", total: "Rp 200.000" },
  { no: 6,  user: "Omen Blackwood",   motor: "Honda Vario 125", date: "18 Oktober 2026", status: "Aktif",   total: "Rp 83.000" },
  { no: 7,  user: "Raze Oktaviani",   motor: "Honda Vario 125", date: "19 Oktober 2026", status: "Aktif",   total: "Rp 130.000" },
  { no: 8,  user: "Chamber Alfarizi", motor: "Honda Vario 125", date: "20 Oktober 2026", status: "Aktif",   total: "Rp 150.000" },
  { no: 9,  user: "Yoru Maulana",     motor: "Honda Vario 125", date: "21 Oktober 2026", status: "Selesai", total: "Rp 180.000" },
  { no: 10, user: "Sage Anggrain",    motor: "Honda Vario 125", date: "22 Oktober 2026", status: "Selesai", total: "Rp 200.000" },
  { no: 11, user: "Skye Maharani",    motor: "Honda Vario 125", date: "18 Oktober 2026", status: "Aktif",   total: "Rp 83.000" },
  { no: 12, user: "Neon Safira",      motor: "Honda Vario 125", date: "19 Oktober 2026", status: "Aktif",   total: "Rp 130.000" },
  { no: 13, user: "Astra Valencia",   motor: "Honda Vario 125", date: "20 Oktober 2026", status: "Aktif",   total: "Rp 150.000" },
];

// ==================== DATA STATISTIK PENDAPATAN 9 HARI ====================
const revenueData = [
  { label: "1 Sep", value: 4950000, pct: 73, highlight: false },
  { label: "2 Sep", value: 3900000, pct: 57, highlight: false },
  { label: "3 Sep", value: 4600000, pct: 68, highlight: false },
  { label: "4 Sep", value: 5500000, pct: 81, highlight: false },
  { label: "5 Sep", value: 4100000, pct: 60, highlight: false },
  { label: "6 Sep", value: 2700000, pct: 40, highlight: false },
  { label: "7 Sep", value: 4350000, pct: 64, highlight: false },
  { label: "8 Sep", value: 5200000, pct: 76, highlight: false },
  { label: "9 Sep", value: 6250000, pct: 92, highlight: true  },
];

// ==================== RENDER GRAFIK BATANG PENDAPATAN ====================
function renderRevenueBars() {
  const container = document.getElementById("revenueBarsContainer");
  container.innerHTML = revenueData.map(item => {
    const barColor = item.highlight
      ? "bg-[#083B44] ring-2 ring-[#10B981]/60"
      : item.label === "6 Sep"
        ? "bg-[#6C8286] hover:bg-[#0C4651]"
        : "bg-[#436368] hover:bg-[#0C4651]";

    const dotMarkup = item.highlight
      ? `<span class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-white"></span>`
      : "";

    const formattedRp = "Rp " + item.value.toLocaleString("id-ID");

    return `
      <div class="flex flex-col items-center h-full justify-end group relative">
        <div class="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none absolute -top-8 bg-[#0C4651] text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-md z-10">
          ${formattedRp}
        </div>
        <div class="w-full max-w-[26px] flex-1 flex items-end mb-6">
          <div style="height: ${item.pct}%" class="w-full rounded-t-lg ${barColor} transition-all duration-300 relative cursor-pointer">
            ${dotMarkup}
          </div>
        </div>
        <span class="absolute bottom-0 text-[10.5px] font-semibold ${item.highlight ? "text-[#0C4651] font-bold" : "text-gray-400"} whitespace-nowrap">
          ${item.label}
        </span>
      </div>
    `;
  }).join("");
}

// ==================== PAGINASI & PENCARIAN TABEL TRANSAKSI ====================
let currentPage = 1;
const rowsPerPage = 5;
let searchQuery = "";

function getFilteredData() {
  if (!searchQuery.trim()) return transactionsData;
  const q = searchQuery.toLowerCase();
  return transactionsData.filter(row =>
    row.user.toLowerCase().includes(q) ||
    row.motor.toLowerCase().includes(q) ||
    row.date.toLowerCase().includes(q) ||
    row.status.toLowerCase().includes(q) ||
    row.total.toLowerCase().includes(q)
  );
}

function renderTable() {
  const filtered = getFilteredData();
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * rowsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + rowsPerPage);

  const tbody = document.getElementById("transactionTableBody");
  if (pageItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-gray-400 text-[13px] font-medium">
          Data transaksi tidak ditemukan untuk pencarian "${searchQuery}"
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = pageItems.map(item => {
      const badgeClass = item.status === "Aktif"
        ? "bg-[#DCFCE7] text-[#15803D]"
        : "bg-[#DBEAFE] text-[#2563EB]";

      return `
        <tr class="hover:bg-gray-50/80 transition-colors">
          <td class="py-3.5 px-4 text-center font-bold text-gray-800">${item.no}</td>
          <td class="py-3.5 px-4 font-bold text-gray-900">${item.user}</td>
          <td class="py-3.5 px-4 font-bold text-gray-800">${item.motor}</td>
          <td class="py-3.5 px-4 font-bold text-gray-800">${item.date}</td>
          <td class="py-3.5 px-4 text-center">
            <span class="inline-block min-w-[68px] px-3 py-1 rounded-full text-[11px] font-bold ${badgeClass}">
              ${item.status}
            </span>
          </td>
          <td class="py-3.5 px-4 text-right pr-6 font-bold text-gray-900">${item.total}</td>
        </tr>
      `;
    }).join("");
  }

  const infoEl = document.getElementById("paginationInfo");
  if (totalItems === 0) {
    infoEl.textContent = "Menampilkan 0 dari 0 data";
  } else {
    const endDisplay = Math.min(startIdx + rowsPerPage, totalItems);
    infoEl.textContent = `Menampilkan ${startIdx + 1} - ${endDisplay} dari ${totalItems} data`;
  }

  const controlsEl = document.getElementById("paginationControls");
  let buttonsHtml = `
    <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}
      class="w-7 h-7 rounded-full border border-[#0C4651]/40 text-[#0C4651] flex items-center justify-center text-xs hover:bg-[#0C4651] hover:text-white disabled:opacity-35 disabled:pointer-events-none transition-colors">
      ‹
    </button>
  `;

  for (let p = 1; p <= totalPages; p++) {
    const activeCls = p === currentPage
      ? "bg-[#0C4651] text-white border-[#0C4651]"
      : "bg-white text-[#0C4651] border-[#0C4651]/40 hover:bg-gray-100";
    buttonsHtml += `
      <button onclick="goToPage(${p})"
        class="w-7 h-7 rounded-full border text-[11.5px] font-bold flex items-center justify-center transition-colors ${activeCls}">
        ${p}
      </button>
    `;
  }

  buttonsHtml += `
    <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}
      class="w-7 h-7 rounded-full border border-[#0C4651]/40 text-[#0C4651] flex items-center justify-center text-xs hover:bg-[#0C4651] hover:text-white disabled:opacity-35 disabled:pointer-events-none transition-colors">
      ›
    </button>
  `;
  controlsEl.innerHTML = buttonsHtml;
}

window.goToPage = function (page) {
  const totalPages = Math.max(1, Math.ceil(getFilteredData().length / rowsPerPage));
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable();
};

// ==================== PENCARIAN REAL-TIME ====================
const searchInput = document.getElementById("searchInput");
const searchBadge = document.getElementById("searchBadge");
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  currentPage = 1;
  if (searchQuery.trim()) {
    searchBadge.textContent = `Filter: "${searchQuery}"`;
    searchBadge.classList.remove("hidden");
  } else {
    searchBadge.classList.add("hidden");
  }
  renderTable();
});

// ==================== DROPDOWN PROFIL ADMIN ====================
const profileTrigger = document.getElementById("profileTrigger");
const profilePopover = document.getElementById("profilePopover");
const profileChevron = document.getElementById("profileChevron");

profileTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  const isHidden = profilePopover.classList.contains("hidden");
  profilePopover.classList.toggle("hidden", !isHidden);
  profileChevron.classList.toggle("rotate-180", isHidden);
});

document.addEventListener("click", (e) => {
  if (!profilePopover.contains(e.target) && !profileTrigger.contains(e.target)) {
    profilePopover.classList.add("hidden");
    profileChevron.classList.remove("rotate-180");
  }
});

// ==================== BUKA / TUTUP SIDEBAR (DESKTOP & MOBILE) ====================
const sidebar = document.getElementById("sidebar");
const mobileBackdrop = document.getElementById("mobileBackdrop");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const closeMobileSidebarBtn = document.getElementById("closeMobileSidebarBtn");
const toggleIconOpen = document.getElementById("toggleIconOpen");
const toggleIconClosed = document.getElementById("toggleIconClosed");

let isDesktopCollapsed = false;

function isDesktop() {
  return window.innerWidth >= 1024;
}

function updateToggleIcons() {
  if (isDesktop()) {
    toggleIconOpen.classList.toggle("hidden", isDesktopCollapsed);
    toggleIconClosed.classList.toggle("hidden", !isDesktopCollapsed);
  } else {
    const isMobileOpen = !sidebar.classList.contains("-translate-x-full");
    toggleIconOpen.classList.toggle("hidden", !isMobileOpen);
    toggleIconClosed.classList.toggle("hidden", isMobileOpen);
  }
}

function openMobileSidebar() {
  sidebar.classList.remove("-translate-x-full");
  mobileBackdrop.classList.remove("hidden");
  updateToggleIcons();
}

function closeMobileSidebar() {
  sidebar.classList.add("-translate-x-full");
  mobileBackdrop.classList.add("hidden");
  updateToggleIcons();
}

toggleSidebarBtn.addEventListener("click", () => {
  if (isDesktop()) {
    isDesktopCollapsed = !isDesktopCollapsed;
    sidebar.classList.toggle("sidebar-collapsed", isDesktopCollapsed);
    sidebar.classList.toggle("sidebar-expanded", !isDesktopCollapsed);
    updateToggleIcons();
  } else {
    const isClosed = sidebar.classList.contains("-translate-x-full");
    if (isClosed) {
      openMobileSidebar();
    } else {
      closeMobileSidebar();
    }
  }
});

closeMobileSidebarBtn.addEventListener("click", closeMobileSidebar);
mobileBackdrop.addEventListener("click", closeMobileSidebar);

window.addEventListener("resize", () => {
  if (isDesktop()) {
    mobileBackdrop.classList.add("hidden");
    sidebar.classList.remove("-translate-x-full");
    sidebar.classList.toggle("sidebar-collapsed", isDesktopCollapsed);
    sidebar.classList.toggle("sidebar-expanded", !isDesktopCollapsed);
  } else {
    sidebar.classList.remove("sidebar-collapsed");
    sidebar.classList.add("sidebar-expanded", "-translate-x-full");
  }
  updateToggleIcons();
});

// ==================== NAVIGASI ANTAR MENU SIDEBAR ====================
const secondaryPages = {
  motor: {
    title: "Kelola Data Motor",
    subtitle: "Total 13 armada terdaftar aktif (6 Tersedia, 4 Disewa, 3 Perbaikan).",
    cards: [
      { name: "Honda Vario 125 (Unit #01)", plate: "DK 4120 RY", status: "Tersedia", badge: "bg-[#DCFCE7] text-[#15803D]", rate: "Rp 83.000 / hari" },
      { name: "Honda Vario 125 (Unit #02)", plate: "DK 4121 RY", status: "Disewa", badge: "bg-[#FEF3C7] text-[#B45309]", rate: "Rp 83.000 / hari" },
      { name: "Honda Vario 125 (Unit #03)", plate: "DK 4122 RY", status: "Perbaikan", badge: "bg-[#FEE2E2] text-[#DC2626]", rate: "Servis Berkala" },
      { name: "Honda Vario 125 (Unit #04)", plate: "DK 4123 RY", status: "Tersedia", badge: "bg-[#DCFCE7] text-[#15803D]", rate: "Rp 83.000 / hari" },
    ]
  },
  transaksi: {
    title: "Kelola Transaksi",
    subtitle: "Pantau seluruh riwayat penyewaan aktif maupun yang telah selesai.",
    cards: [
      { name: "Transaksi Aktif", plate: "8 Penyewa Berjalan", status: "Aktif", badge: "bg-[#DCFCE7] text-[#15803D]", rate: "Rp 986.000" },
      { name: "Transaksi Selesai", plate: "5 Penyewa Selesai", status: "Selesai", badge: "bg-[#DBEAFE] text-[#2563EB]", rate: "Rp 760.000" },
      { name: "Total Akumulasi", plate: "13 Total Transaksi", status: "Terverifikasi", badge: "bg-[#E6F2F4] text-[#0C4651]", rate: "Rp 40.860.000" },
    ]
  },
  penyewaan: {
    title: "Info Penyewaan",
    subtitle: "Jadwal pengembalian unit dan status durasi sewa pelanggan.",
    cards: [
      { name: "Hash Aurelia", plate: "18 Oktober 2026", status: "Aktif", badge: "bg-[#DCFCE7] text-[#15803D]", rate: "Honda Vario 125" },
      { name: "Reyna Putri", plate: "19 Oktober 2026", status: "Aktif", badge: "bg-[#DCFCE7] text-[#15803D]", rate: "Honda Vario 125" },
      { name: "Jett Oktavia", plate: "20 Oktober 2026", status: "Aktif", badge: "bg-[#DCFCE7] text-[#15803D]", rate: "Honda Vario 125" },
    ]
  },
  pembayaran: {
    title: "Pembayaran",
    subtitle: "Rekapitulasi metode pembayaran dan akumulasi kas harian RYOKOU.",
    cards: [
      { name: "Akumulasi Harian (18 Okt)", plate: "Semua Metode Pembayaran", status: "Lunas", badge: "bg-[#DCFCE7] text-[#15803D]", rate: "Rp 40.860.000" },
      { name: "Rata-rata Omzet Harian", plate: "9 Hari Terakhir (+18.4%)", status: "Stabil", badge: "bg-[#E6F2F4] text-[#0C4651]", rate: "Rp 4.540.000" },
    ]
  },
  pengaturan: {
    title: "Pengaturan Sistem",
    subtitle: "Konfigurasi akun Admin/Owner dan preferensi aplikasi RYOKOU Oto Rent.",
    cards: [
      { name: "Admin_001", plate: "admin001@gmail.com", status: "Admin/Owner", badge: "bg-[#DCFCE7] text-[#15803D]", rate: "Akses Penuh" },
      { name: "Identitas Brand", plate: "RYOKOU OTO RENT (ESTD 2023)", status: "Aktif", badge: "bg-[#E6F2F4] text-[#0C4651]", rate: "BY : M²" },
    ]
  }
};

const viewDashboard = document.getElementById("view-dashboard");
const viewSecondary = document.getElementById("view-secondary");
const navItems = document.querySelectorAll(".nav-item");

function switchNavigation(targetKey) {
  navItems.forEach(btn => {
    const isTarget = btn.dataset.nav === targetKey;
    if (isTarget) {
      btn.classList.add("bg-white", "text-[#0C4651]", "font-semibold", "shadow-sm");
      btn.classList.remove("text-white/85", "font-medium", "hover:bg-white/10");
    } else {
      btn.classList.remove("bg-white", "text-[#0C4651]", "font-semibold", "shadow-sm");
      btn.classList.add("text-white/85", "font-medium", "hover:bg-white/10");
    }
  });

  if (targetKey === "dashboard") {
    viewDashboard.classList.remove("hidden");
    viewSecondary.classList.add("hidden");
  } else {
    const pageData = secondaryPages[targetKey];
    document.getElementById("secondaryTitle").textContent = pageData.title;
    document.getElementById("secondarySubtitle").textContent = pageData.subtitle;
    document.getElementById("secondaryContent").innerHTML = pageData.cards.map(c => `
      <div class="bg-white rounded-2xl p-5 card-shadow border border-gray-100 flex flex-col justify-between gap-3">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="text-[14.5px] font-bold text-gray-900">${c.name}</h3>
            <p class="text-[12px] text-gray-400 mt-0.5">${c.plate}</p>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${c.badge}">${c.status}</span>
        </div>
        <div class="pt-3 border-t border-gray-100 text-[13.5px] font-extrabold text-[#0C4651]">
          ${c.rate}
        </div>
      </div>
    `).join("");

    viewDashboard.classList.add("hidden");
    viewSecondary.classList.remove("hidden");
  }

  if (!isDesktop()) closeMobileSidebar();
}

navItems.forEach(btn => {
  btn.addEventListener("click", () => switchNavigation(btn.dataset.nav));
});

document.getElementById("backToDashboardBtn").addEventListener("click", () => {
  switchNavigation("dashboard");
});

// ==================== AKSI KELUAR SISTEM ====================
function handleLogout() {
  alert("Anda telah keluar dari sistem RYOKOU Oto Rent (Admin_001).");
}
document.getElementById("sidebarLogoutBtn").addEventListener("click", handleLogout);
document.getElementById("popoverLogoutBtn").addEventListener("click", handleLogout);

// ==================== INISIALISASI AWAL ====================
renderRevenueBars();
renderTable();
updateToggleIcons();