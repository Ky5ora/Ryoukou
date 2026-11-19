document.addEventListener("DOMContentLoaded", function() {

    // 1. Fitur Pencarian Motor
    const inputPencarian = document.getElementById('inputPencarian');
    if (inputPencarian) {
        inputPencarian.addEventListener('keyup', function() {
            let keyword = this.value.toLowerCase();
            let daftarMotor = document.querySelectorAll('.item-motor');

            daftarMotor.forEach(function(item) {
                let namaMotor = item.querySelector('.nama-motor').textContent.toLowerCase();
                
                if (namaMotor.includes(keyword)) {
                    item.style.display = ""; 
                } else {
                    item.style.display = "none"; 
                }
            });
        });
    }

    // 2. Menampilkan Nama User dari LocalStorage & Status Login/Guest
    const namaUser = localStorage.getItem("namaPengguna") || localStorage.getItem("username");
    const guestButtons = document.getElementById("guestButtons");
    const loggedInProfile = document.getElementById("loggedInProfile");
    const displayElemen = document.getElementById("namaUserDisplay");
    const btnKeluarDesktop = document.getElementById("btnKeluarDesktop");
    const btnKeluarMobile = document.getElementById("btnKeluarMobile");

    if (namaUser) {
        if (guestButtons) guestButtons.classList.add("d-none");
        if (loggedInProfile) {
            loggedInProfile.classList.remove("d-none");
            loggedInProfile.classList.add("d-flex");
        }
        if (displayElemen) {
            displayElemen.textContent = namaUser.startsWith("@") ? namaUser : "@" + namaUser;
        }

        const handleLogout = function(e) {
            e.preventDefault();
            localStorage.removeItem("namaPengguna");
            localStorage.removeItem("username");
            window.location.href = "4.dashboard utama.html";
        };

        if (btnKeluarDesktop) btnKeluarDesktop.addEventListener("click", handleLogout);
        if (btnKeluarMobile) btnKeluarMobile.addEventListener("click", handleLogout);

    } else {
        if (guestButtons) guestButtons.classList.remove("d-none");
        if (loggedInProfile) loggedInProfile.classList.add("d-none");

        if (btnKeluarDesktop) btnKeluarDesktop.style.display = "none";
        if (btnKeluarMobile) btnKeluarMobile.style.display = "none";

        const modalEl = document.getElementById('modalWajibLogin');
        const modalWajibLogin = modalEl ? new bootstrap.Modal(modalEl) : null;

        const linkTerproteksi = document.querySelectorAll(
            '.sidebar .nav-link:not(.active), .offcanvas .nav-link:not(.active), .btn-aksi-sewa'
        );

        linkTerproteksi.forEach(elemen => {
            elemen.addEventListener("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (modalWajibLogin) {
                    modalWajibLogin.show();
                }
            });
        });
    }

    // 3. Tombol "Jelajahi Unit Populer" (Scroll Halus ke Bawah)
    const btnJelajahi = document.querySelector('.btn-hero-cta');
    const headerUnitPopuler = document.getElementById('headerUnitPopuler');
    if (btnJelajahi && headerUnitPopuler) {
        btnJelajahi.addEventListener('click', function(e) {
            e.preventDefault();
            headerUnitPopuler.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 4. Fitur Filter Kategori Unit (Semua / Tersedia / 110cc / 125cc)
    const filterButtons = document.querySelectorAll('.filter-pill-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                const daftarMotor = document.querySelectorAll('.item-motor');

                daftarMotor.forEach(card => {
                    const status = card.getAttribute('data-status');
                    const cc = card.getAttribute('data-cc');
                    
                    if (filter === 'all' || status === filter || cc === filter) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

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

});