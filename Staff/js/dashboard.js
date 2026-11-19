// ==================== DATA TRANSAKSI (13 DATA SESUAI DESAIN) ====================
const transactionsData = [
  { no: 1,  user: "Hash Aurelia",    motor: "Honda Vario 125", date: "18 Oktober 2026", status: "Aktif",   total: "Rp 83.000" },
  { no: 2,  user: "Reyna Putri",     motor: "Honda Vario 125", date: "19 Oktober 2026", status: "Aktif",   total: "Rp 130.000" },
  { no: 3,  user: "Jett Oktavia",    motor: "Honda Vario 125", date: "20 Oktober 2026", status: "Aktif",   total: "Rp 150.000" },
  { no: 4,  user: "Phoenix Saputra", motor: "Honda Vario 125", date: "21 Oktober 2026", status: "Selesai", total: "Rp 180.000" },
  { no: 5,  user: "Sova Mahendra",   motor: "Honda Vario 125", date: "22 Oktober 2026", status: "Selesai", total: "Rp 200.000" },
  { no: 6,  user: "Omen Blackwood",  motor: "Honda Vario 125", date: "18 Oktober 2026", status: "Aktif",   total: "Rp 83.000" },
  { no: 7,  user: "Raze Oktaviani",  motor: "Honda Vario 125", date: "19 Oktober 2026", status: "Aktif",   total: "Rp 130.000" },
  { no: 8,  user: "Chamber Alfarizi", motor: "Honda Vario 125", date: "20 Oktober 2026", status: "Aktif",  total: "Rp 150.000" },
  { no: 9,  user: "Yoru Maulana",    motor: "Honda Vario 125", date: "21 Oktober 2026", status: "Selesai", total: "Rp 180.000" },
  { no: 10, user: "Sage Anggrain",   motor: "Honda Vario 125", date: "22 Oktober 2026", status: "Selesai", total: "Rp 200.000" },
  { no: 11, user: "Skye Maharani",   motor: "Honda Vario 125", date: "18 Oktober 2026", status: "Aktif",   total: "Rp 83.000" },
  { no: 12, user: "Neon Safira",     motor: "Honda Vario 125", date: "19 Oktober 2026", status: "Aktif",   total: "Rp 130.000" },
  { no: 13, user: "Astra Valencia",  motor: "Honda Vario 125", date: "20 Oktober 2026", status: "Aktif",   total: "Rp 150.000" },
];

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
  if (!tbody) return;

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
  if (infoEl) {
    if (totalItems === 0) {
      infoEl.textContent = "Menampilkan 0 dari 0 data";
    } else {
      const endDisplay = Math.min(startIdx + rowsPerPage, totalItems);
      infoEl.textContent = `Menampilkan ${startIdx + 1} - ${endDisplay} dari ${totalItems} data`;
    }
  }

  const controlsEl = document.getElementById("paginationControls");
  if (controlsEl) {
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
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    currentPage = 1;
    if (searchBadge) {
      if (searchQuery.trim()) {
        searchBadge.textContent = `Filter: "${searchQuery}"`;
        searchBadge.classList.remove("hidden");
      } else {
        searchBadge.classList.add("hidden");
      }
    }
    renderTable();
  });
}

// ==================== DROPDOWN PROFIL PEGAWAI ====================
const profileTrigger = document.getElementById("profileTrigger");
const profilePopover = document.getElementById("profilePopover");
const profileChevron = document.getElementById("profileChevron");

if (profileTrigger && profilePopover) {
  profileTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = profilePopover.classList.contains("hidden");
    profilePopover.classList.toggle("hidden", !isHidden);
    if (profileChevron) profileChevron.classList.toggle("rotate-180", isHidden);
  });

  document.addEventListener("click", (e) => {
    if (!profilePopover.contains(e.target) && !profileTrigger.contains(e.target)) {
      profilePopover.classList.add("hidden");
      if (profileChevron) profileChevron.classList.remove("rotate-180");
    }
  });
}

// ==================== BUKA / TUTUP SIDEBAR ====================
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
  if (!toggleIconOpen || !toggleIconClosed) return;
  if (isDesktop()) {
    toggleIconOpen.classList.toggle("hidden", isDesktopCollapsed);
    toggleIconClosed.classList.toggle("hidden", !isDesktopCollapsed);
  } else {
    const isMobileOpen = sidebar && !sidebar.classList.contains("-translate-x-full");
    toggleIconOpen.classList.toggle("hidden", !isMobileOpen);
    toggleIconClosed.classList.toggle("hidden", isMobileOpen);
  }
}

function openMobileSidebar() {
  if (sidebar) sidebar.classList.remove("-translate-x-full");
  if (mobileBackdrop) mobileBackdrop.classList.remove("hidden");
  updateToggleIcons();
}

function closeMobileSidebar() {
  if (sidebar) sidebar.classList.add("-translate-x-full");
  if (mobileBackdrop) mobileBackdrop.classList.add("hidden");
  updateToggleIcons();
}

if (toggleSidebarBtn) {
  toggleSidebarBtn.addEventListener("click", () => {
    if (isDesktop()) {
      isDesktopCollapsed = !isDesktopCollapsed;
      if (sidebar) {
        sidebar.classList.toggle("sidebar-collapsed", isDesktopCollapsed);
        sidebar.classList.toggle("sidebar-expanded", !isDesktopCollapsed);
      }
      updateToggleIcons();
    } else {
      const isClosed = sidebar && sidebar.classList.contains("-translate-x-full");
      if (isClosed) {
        openMobileSidebar();
      } else {
        closeMobileSidebar();
      }
    }
  });
}

if (closeMobileSidebarBtn) closeMobileSidebarBtn.addEventListener("click", closeMobileSidebar);
if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMobileSidebar);

window.addEventListener("resize", () => {
  if (isDesktop()) {
    if (mobileBackdrop) mobileBackdrop.classList.add("hidden");
    if (sidebar) {
      sidebar.classList.remove("-translate-x-full");
      sidebar.classList.toggle("sidebar-collapsed", isDesktopCollapsed);
      sidebar.classList.toggle("sidebar-expanded", !isDesktopCollapsed);
    }
  } else {
    if (sidebar) {
      sidebar.classList.remove("sidebar-collapsed");
      sidebar.classList.add("sidebar-expanded", "-translate-x-full");
    }
  }
  updateToggleIcons();
});

// ==================== NAVIGASI MENU SIDEBAR ====================
const viewDashboard = document.getElementById("view-dashboard");
// Buat atau siapkan elemen penampung view info penyewaan di HTML Anda (misal: id="view-penyewaan")
const viewPenyewaan = document.getElementById("view-penyewaan"); 
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

  // Logika Atur Tampilan (Show/Hide View berdasarkan targetKey)
  if (targetKey === "dashboard") {
    if (viewDashboard) viewDashboard.classList.remove("hidden");
    if (viewPenyewaan) viewPenyewaan.classList.add("hidden");
  } else if (targetKey === "penyewaan") {
    if (viewDashboard) viewDashboard.classList.add("hidden");
    if (viewPenyewaan) {
      viewPenyewaan.classList.remove("hidden");
      // Opsional: Jika kontennya ingin diload dinamis via fetch/innerHTML, bisa ditaruh di sini
    }
  }
  // Tambahkan kondisi else if untuk menu lain (pembayaran, riwayat, dll) jika ada

  if (typeof isDesktop === "function" && !isDesktop()) {
    if (typeof closeMobileSidebar === "function") closeMobileSidebar();
  }
}

navItems.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.nav;
    
    // Jika ingin tetap menggunakan sistem multi-file (pindah halaman HTML terpisah):
    if (target === "penyewaan") {
      window.location.href = "info_penyewaan.html"; // Sesuaikan path file HTML-nya
      return;
    }
    
    // Jika menggunakan sistem 1 halaman (SPA), jalankan fungsi switch:
    switchNavigation(target);
  });
});

// ==================== AKSI KELUAR SISTEM ====================
function handleLogout() {
  alert("Anda telah keluar dari sistem RYOKOU Oto Rent (Pegawai_001).");
}
const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");
const popoverLogoutBtn = document.getElementById("popoverLogoutBtn");
if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener("click", handleLogout);
if (popoverLogoutBtn) popoverLogoutBtn.addEventListener("click", handleLogout);

// ==================== INISIALISASI AWAL ====================
renderTable();
updateToggleIcons();