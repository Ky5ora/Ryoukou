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

    // 2. Menampilkan Nama User dari LocalStorage & Pengondisian Guest Mode
    const namaUser = localStorage.getItem("namaPengguna") || localStorage.getItem("username");
    const guestButtons = document.getElementById("guestButtons");
    const loggedInProfile = document.getElementById("loggedInProfile");
    const displayElemen = document.getElementById("namaUserDisplay");
    
    // Pembungkus Tombol Keluar di Bawah
    const wrapperKeluarDesktop = document.getElementById("wrapperKeluarDesktop");
    const wrapperKeluarMobile = document.getElementById("wrapperKeluarMobile");
    const btnKeluarDesktop = document.getElementById("btnKeluarDesktop");
    const btnKeluarMobile = document.getElementById("btnKeluarMobile");

    // Elemen Menu yang ingin disembunyikan saat Guest Mode
    const menuInfoDesktop = document.getElementById("menuInfoPenyewaanDesktop");
    const menuRiwayatDesktop = document.getElementById("menuRiwayatDesktop");
    const menuInfoMobile = document.getElementById("menuInfoPenyewaanMobile");
    const menuRiwayatMobile = document.getElementById("menuRiwayatMobile");

    if (namaUser) {
        // --- JIKA SUDAH LOGIN ---
        if (guestButtons) guestButtons.classList.add("d-none");
        if (loggedInProfile) {
            loggedInProfile.classList.remove("d-none");
            loggedInProfile.classList.add("d-flex");
        }
        if (displayElemen) {
            displayElemen.textContent = namaUser.startsWith("@") ? namaUser : "@" + namaUser;
        }

        // Tampilkan menu khusus member & Tampilkan tombol Keluar di bawah
        if (menuInfoDesktop) menuInfoDesktop.classList.remove("d-none");
        if (menuRiwayatDesktop) menuRiwayatDesktop.classList.remove("d-none");
        if (menuInfoMobile) menuInfoMobile.classList.remove("d-none");
        if (menuRiwayatMobile) menuRiwayatMobile.classList.remove("d-none");
        
        if (wrapperKeluarDesktop) wrapperKeluarDesktop.classList.remove("d-none");
        if (wrapperKeluarMobile) wrapperKeluarMobile.classList.remove("d-none");

        // --- DINAMIS IKON NOTIFIKASI (Merah / Bersih) ---
        const iconNotifImg = document.getElementById("iconNotifImg");
        const statusNotifBaru = localStorage.getItem("adaNotifikasiBaru"); // "true" jika ada notif baru
        if (iconNotifImg) {
            if (statusNotifBaru === "true") {
                iconNotifImg.src = "../assets/icon-notif-merah.svg";
            } else {
                iconNotifImg.src = "../assets/icon-notif.svg";
            }
        }

        // Fungsi Logout (Langsung hapus sesi & refresh halaman saat ini tanpa pindah halaman)
        const handleLogout = function(e) {
            e.preventDefault();
            localStorage.removeItem("namaPengguna");
            localStorage.removeItem("username");
            localStorage.removeItem("adaNotifikasiBaru");
            window.location.reload(); // Memperbarui halaman saat ini, status berubah jadi guest
        };

        if (btnKeluarDesktop) btnKeluarDesktop.addEventListener("click", handleLogout);
        if (btnKeluarMobile) btnKeluarMobile.addEventListener("click", handleLogout);

    } else {
        // --- JIKA BELUM LOGIN (GUEST MODE) ---
        if (guestButtons) guestButtons.classList.remove("d-none");
        if (loggedInProfile) loggedInProfile.classList.add("d-none");

        // Sembunyikan pembungkus tombol Keluar di bawah saat masih guest
        if (wrapperKeluarDesktop) wrapperKeluarDesktop.classList.add("d-none");
        if (wrapperKeluarMobile) wrapperKeluarMobile.classList.add("d-none");

        // Sembunyikan menu Info Penyewaan & Riwayat Aktivitas saat Guest
        if (menuInfoDesktop) menuInfoDesktop.classList.add("d-none");
        if (menuRiwayatDesktop) menuRiwayatDesktop.classList.add("d-none");
        if (menuInfoMobile) menuInfoMobile.classList.add("d-none");
        if (menuRiwayatMobile) menuRiwayatMobile.classList.add("d-none");

        const modalEl = document.getElementById('modalWajibLogin');
        const modalWajibLogin = modalEl ? new bootstrap.Modal(modalEl) : null;

        // Proteksi menu lain jika diklik saat guest
        const linkTerproteksi = document.querySelectorAll(
            '.sidebar .nav-link:not(.active), .offcanvas .nav-link:not(.active)'
        );

        linkTerproteksi.forEach(elemen => {
            if (!elemen.getAttribute('href').includes('5.katalog motor.html') && !elemen.getAttribute('href').includes('4.dashboard utama.html')) {
                elemen.addEventListener("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (modalWajibLogin) {
                        modalWajibLogin.show();
                    }
                });
            }
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

    // 4. Fitur Filter Kategori Unit
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
});