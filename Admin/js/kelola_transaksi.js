
// DATA TRANSAKSI
const transactions = [
  {
    id: "TRX-001",
    name: "Valentina Alexsandra",
    motor: "Honda Beat Deluxe 2023/2024",
    date: "18 Nov 2026",
    status: "Menunggu",
    price: "Rp 166.000"
  },
  {
    id: "TRX-002",
    name: "Valentina Alexsandra",
    motor: "Honda Beat Deluxe 2023/2024",
    date: "18 Nov 2026",
    status: "Diproses",
    price: "Rp 166.000"
  },
  {
    id: "TRX-003",
    name: "Valentina Alexsandra",
    motor: "Honda Beat Deluxe 2023/2024",
    date: "18 Nov 2026",
    status: "Terkonfirmasi",
    price: "Rp 166.000"
  },
  {
    id: "TRX-004",
    name: "Valentina Alexsandra",
    motor: "Honda Beat Deluxe 2023/2024",
    date: "18 Nov 2026",
    status: "Selesai",
    price: "Rp 166.000"
  },
  {
    id: "TRX-005",
    name: "Valentina Alexsandra",
    motor: "Honda Beat Deluxe 2023/2024",
    date: "18 Nov 2026",
    status: "Dibatalkan",
    price: "Rp 166.000"
  },
  {
    id: "TRX-006",
    name: "Valentina Alexsandra",
    motor: "Honda Beat Deluxe 2023/2024",
    date: "18 Nov 2026",
    status: "Diproses",
    price: "Rp 166.000"
  },
  {
    id: "TRX-007",
    name: "Valentina Alexsandra",
    motor: "Honda Beat Deluxe 2023/2024",
    date: "18 Nov 2026",
    status: "Diproses",
    price: "Rp 166.000"
  },
  {
    id: "TRX-008",
    name: "Valentina Alexsandra",
    motor: "Honda Beat Deluxe 2023/2024",
    date: "18 Nov 2026",
    status: "Menunggu",
    price: "Rp 166.000"
  },
  {
    id: "TRX-009",
    name: "Valentina Alexsandra",
    motor: "Honda Beat Deluxe 2023/2024",
    date: "18 Nov 2026",
    status: "Selesai",
    price: "Rp 166.000"
  },
  {
    id: "TRX-010",
    name: "Valentina Alexsandra",
    motor: "Honda Beat Deluxe 2023/2024",
    date: "18 Nov 2026",
    status: "Terkonfirmasi",
    price: "Rp 166.000"
  }
];


// ELEMENT HTML
let selectedId = "TRX-001";

const $ = id => document.getElementById(id);

const rows = $("transactionRows");


// CLASS STATUS
function statusClass(status) {
  return "status-" + status.toLowerCase().replaceAll(" ", "-");
}


// MENAMPILKAN TABEL
function renderRows() {

  const q = (
    $("tableSearch").value ||
    $("globalSearch").value
  ).toLowerCase();

  const status =
    $("tableStatus").value ||
    $("statusFilter").value;

  const filtered = transactions.filter(t =>
    (!status || t.status === status) &&
    (!q || Object.values(t).join(" ").toLowerCase().includes(q))
  );

  rows.innerHTML = filtered.map((t, i) => `
    <tr data-id="${t.id}"
        class="${t.id === selectedId ? "selected" : ""}">

      <td>${i + 1}</td>
      <td>${t.id}</td>
      <td>${t.name}</td>
      <td>${t.motor}</td>
      <td>${t.date}</td>

      <td>
        <span class="status-pill ${statusClass(t.status)}">
          ${t.status}
        </span>
      </td>

      <td>
        <button class="action-eye" title="Lihat detail">
          <i class="bi bi-eye"></i>
        </button>
      </td>

    </tr>
  `).join("");

  $("rowInfo").textContent =
    `Menampilkan ${filtered.length ? 1 : 0}–${filtered.length} dari ${filtered.length} data`;

  $("totalCount").textContent = transactions.length;

  $("waitingCount").textContent =
    transactions.filter(t => t.status === "Menunggu").length;

  rows.querySelectorAll("tr").forEach(row => {
    row.addEventListener("click", () => {
      selectTransaction(row.dataset.id);
    });
  });

}


// MEMILIH DETAIL TRANSAKSI
function selectTransaction(id) {

  selectedId = id;

  const t = transactions.find(x => x.id === id);

  if (!t) return;

  $("detailId").textContent = t.id;

  $("detailCustomer").textContent = t.name;

  $("detailMotor").textContent = t.motor;

  $("detailDate").textContent =
    t.date + " (2 Hari)";

  $("detailPrice").textContent = t.price;

  renderRows();

}


// NOTIFIKASI
function toast(message) {

  const el = $("toastMessage");

  el.textContent = message;

  el.classList.add("show");

  setTimeout(() => {
    el.classList.remove("show");
  }, 2600);

}


// TAMPILKAN DATA AWAL
renderRows();


// PENCARIAN
$("tableSearch").addEventListener("input", renderRows);

$("globalSearch").addEventListener("input", renderRows);


// FILTER STATUS
$("tableStatus").addEventListener("change", renderRows);

$("statusFilter").addEventListener("change", () => {

  $("tableStatus").value =
    $("statusFilter").value;

  renderRows();

});


// PINDAH TAB DETAIL
document.querySelectorAll(".detail-tab").forEach(btn => {

  btn.addEventListener("click", () => {

    document.querySelectorAll(".detail-tab")
      .forEach(x => x.classList.remove("active"));

    document.querySelectorAll(".tab-content")
      .forEach(x => x.classList.remove("active"));

    btn.classList.add("active");

    $("tab-" + btn.dataset.tab)
      .classList.add("active");

  });

});


// VERIFIKASI TRANSAKSI
$("verifyBtn").addEventListener("click", () => {

  const t = transactions.find(x => x.id === selectedId);

  if (t) {

    t.status = "Diproses";

    selectTransaction(t.id);

    toast("Transaksi masuk ke tahap verifikasi.");

  }

});


// TOLAK TRANSAKSI
$("rejectBtn").addEventListener("click", () => {

  if (confirm("Yakin ingin menolak transaksi ini?")) {

    const t = transactions.find(x => x.id === selectedId);

    t.status = "Dibatalkan";

    selectTransaction(t.id);

    toast("Transaksi berhasil ditolak.");

  }

});


// MENAMPILKAN FORM
function showForm(mode) {

  $("listPage").classList.add("d-none");

  $("formPage").classList.remove("d-none");

  setMode(mode);

}


// KEMBALI KE DAFTAR
function showList() {

  $("formPage").classList.add("d-none");

  $("listPage").classList.remove("d-none");

}


// TOMBOL TRANSAKSI BARU
$("newTransactionBtn").addEventListener("click", () => {
  showForm("online");
});


// TOMBOL WALK-IN
$("walkinBtn").addEventListener("click", () => {
  showForm("walkin");
});


// TOMBOL KEMBALI DAN BATAL
$("backToList").addEventListener("click", showList);

$("cancelForm").addEventListener("click", showList);


// MENGATUR MODE TRANSAKSI
function setMode(mode) {

  document.querySelectorAll(".mode-button").forEach(b => {

    b.classList.toggle(
      "active",
      b.dataset.mode === mode
    );

  });

  $("bookingSection").style.display =
    mode === "online" ? "block" : "none";

  $("formIntro").textContent =
    mode === "online"
      ? "Proses pemesanan untuk pelanggan melalui website."
      : "Transaksi untuk pelanggan yang datang langsung ke rental.";

  $("backToList").querySelector("span").textContent =
    mode === "online"
      ? "Transaksi Baru"
      : "Transaksi Walk-in";

}


// PILIH MODE TRANSAKSI
document.querySelectorAll(".mode-button").forEach(b => {

  b.addEventListener("click", () => {
    setMode(b.dataset.mode);
  });

});


// PILIH MOTOR
document.querySelectorAll(".motor-option").forEach(option => {

  option.addEventListener("click", () => {

    document.querySelectorAll(".motor-option")
      .forEach(x => x.classList.remove("selected"));

    option.classList.add("selected");

    option.querySelector("input").checked = true;

  });

});


// SIMPAN TRANSAKSI BARU
$("transactionForm").addEventListener("submit", e => {

  e.preventDefault();

  const name = $("customerName").value.trim();

  if (!name) {
    toast("Nama pelanggan wajib diisi.");
    return;
  }

  const id = "TRX-" +
    String(transactions.length + 1).padStart(3, "0");

  transactions.unshift({

    id: id,

    name: name,

    motor: $("motorSelect").value.split(" - ")[0],

    date: "17 Nov 2026",

    status: "Menunggu",

    price: "Rp 93.000"

  });

  selectedId = id;

  renderRows();

  selectTransaction(id);

  showList();

  toast("Transaksi baru berhasil ditambahkan.");

  $("transactionForm").reset();

});


// MENU PROFIL ADMIN
$("profileButton").addEventListener("click", () => {

  $("profileMenu").classList.toggle("show");

});


// MENUTUP MENU PROFIL
document.addEventListener("click", e => {

  if (
    !$("profileButton").contains(e.target) &&
    !$("profileMenu").contains(e.target)
  ) {

    $("profileMenu").classList.remove("show");

  }

});


// LOGOUT
function logout() {

  if (confirm("Yakin ingin keluar dari halaman admin?")) {

    window.location.href = "login.html";

  }

}

$("logoutBtn").addEventListener("click", logout);

$("profileLogout").addEventListener("click", logout);


// TOGGLE SIDEBAR
$("sidebarToggle").addEventListener("click", () => {

  if (window.innerWidth <= 760) {

    $("sidebar").classList.toggle("mobile-open");

  } else {

    $("sidebar").classList.toggle("collapsed");

  }

});


// MENU SIDEBAR AKTIF
document.querySelectorAll(".side-nav .nav-item").forEach(a => {

  a.addEventListener("click", e => {

    e.preventDefault();

    document.querySelectorAll(".side-nav .nav-item")
      .forEach(x => x.classList.remove("active"));

    a.classList.add("active");

    if (a.textContent.trim() !== "Kelola Transaksi") {

      toast(
        "Menu " + a.textContent.trim() +
        " dipilih. Hubungkan ke halaman terkait."
      );

    }

  });

});
