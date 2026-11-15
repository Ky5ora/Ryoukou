document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const mobileMenuBtn = document.getElementById("mobileMenu");

    // 1. Toggle Sidebar untuk Mobile
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
        
        // Menutup sidebar jika mengklik di luar area sidebar pada layar kecil
        document.addEventListener("click", (event) => {
            if (window.innerWidth <= 760 && sidebar.classList.contains("open")) {
                if (!sidebar.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                    sidebar.classList.remove("open");
                }
            }
        });
    }

    // 2. Navigasi Sidebar & Active State
    document.querySelectorAll(".side-nav a").forEach((link) => {
        link.addEventListener("click", (e) => {
            document.querySelectorAll(".side-nav a").forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
            
            if (window.innerWidth <= 760 && sidebar) {
                sidebar.classList.remove("open");
            }

            const href = link.getAttribute("href");
            // Menampilkan alert demo untuk menu selain dashboard utama
            if (href && href !== "#dashboard" && href !== "#transaksi") {
                alert("Menu " + link.textContent.trim() + " masih berupa tampilan demo front-end.");
            }
        });
    });

    // 3. Notifikasi
    const notifBtn = document.getElementById("notificationBtn");
    if (notifBtn) {
        notifBtn.addEventListener("click", () => alert("Kamu memiliki 3 notifikasi demo."));
    }

    // 4. Global Search (Pencarian Tabel Pengembalian & Denda Pegawai)
    const globalSearch = document.getElementById("globalSearch");
    if (globalSearch) {
        globalSearch.addEventListener("input", (event) => {
            const q = event.target.value.toLowerCase().trim();
            // Mencari di semua baris tabel pada dashboard pegawai
            document.querySelectorAll(".transactions table tbody tr").forEach((row) => {
                row.classList.toggle(
                    "filtered-out",
                    !row.textContent.toLowerCase().includes(q)
                );
            });
        });
    }

    // 5. Footer Tabel & Navigasi Halaman (Pagination jika ada)
    document.querySelectorAll(".table-footer button").forEach((button) => {
        button.addEventListener("click", () => {
            if (button.textContent.trim() === "‹" || button.textContent.trim() === "›") {
                alert("Navigasi halaman tabel masih demo.");
                return;
            }
            document.querySelectorAll(".table-footer button").forEach((b) => b.classList.remove("current"));
            button.classList.add("current");
        });
    });
});