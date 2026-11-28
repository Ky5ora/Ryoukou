const side = document.getElementById("sidebar");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenu?.addEventListener("click", () => {
  side?.classList.toggle("open");
});

document.getElementById("notificationBtn")?.addEventListener("click", () => {
  alert("Kamu memiliki 3 notifikasi demo.");
});

function filterMotors() {
  const searchInput = document.getElementById("motorSearch");
  const statusInput = document.getElementById("statusFilter");
  if (!searchInput || !statusInput) return;

  const query = searchInput.value.toLowerCase().trim();
  const status = statusInput.value;

  document.querySelectorAll("#motorRows tr").forEach((row) => {
    const text = row.textContent.toLowerCase();
    const matchesQuery = text.includes(query);
    const matchesStatus = !status || row.dataset.status === status;
    row.style.display = matchesQuery && matchesStatus ? "" : "none";
  });
}

document.getElementById("motorSearch")?.addEventListener("input", filterMotors);
document.getElementById("statusFilter")?.addEventListener("change", filterMotors);
document.getElementById("methodFilter")?.addEventListener("change", () => {
  alert("Filter metode pembayaran pada halaman ini masih berupa contoh tampilan.");
});

document.getElementById("topSearch")?.addEventListener("input", (event) => {
  const motorSearch = document.getElementById("motorSearch");
  if (motorSearch) {
    motorSearch.value = event.target.value;
    filterMotors();
  }
});

document.querySelectorAll("[data-detail]").forEach((button) => {
  button.addEventListener("click", () => {
    alert(
      `Detail motor: ${button.dataset.detail}\nData detail akan terhubung ke backend/database pada tahap integrasi.`,
    );
  });
});

document.querySelectorAll(".row-more").forEach((button) => {
  button.addEventListener("click", () => alert("Menu aksi motor (demo)."));
});

document.querySelectorAll("#sidebar .side-nav a[href]").forEach((link) => {
  link.addEventListener("click", () => side?.classList.remove("open"));
});
