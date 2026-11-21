document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Sinkronisasi Nama User & Pengondisian Guest Mode
    let namaUser = localStorage.getItem("namaPengguna") || localStorage.getItem("username");
    let guestButtons = document.getElementById("guestButtons");
    let loggedInProfile = document.getElementById("loggedInProfile");
    let displayElemen = document.getElementById("namaUserDisplay");
    
    // Pembungkus Tombol Keluar di Bawah
    let wrapperKeluarDesktop = document.getElementById("wrapperKeluarDesktop");
    let wrapperKeluarMobile = document.getElementById("wrapperKeluarMobile");
    let btnKeluarDesktop = document.getElementById("btnKeluarDesktop");
    let btnKeluarMobile = document.getElementById("btnKeluarMobile");

    // Elemen Menu yang disembunyikan saat Guest Mode
    let menuInfoDesktop = document.getElementById("menuInfoPenyewaanDesktop");
    let menuRiwayatDesktop = document.getElementById("menuRiwayatDesktop");
    let menuInfoMobile = document.getElementById("menuInfoPenyewaanMobile");
    let menuRiwayatMobile = document.getElementById("menuRiwayatMobile");

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

        // Tampilkan kembali menu terproteksi & tombol Keluar saat sudah login
        if (menuInfoDesktop) menuInfoDesktop.classList.remove("d-none");
        if (menuRiwayatDesktop) menuRiwayatDesktop.classList.remove("d-none");
        if (menuInfoMobile) menuInfoMobile.classList.remove("d-none");
        if (menuRiwayatMobile) menuRiwayatMobile.classList.remove("d-none");
        
        if (wrapperKeluarDesktop) wrapperKeluarDesktop.classList.remove("d-none");
        if (wrapperKeluarMobile) wrapperKeluarMobile.classList.remove("d-none");

        // --- DINAMIS IKON NOTIFIKASI (Merah / Bersih) ---
        const iconNotifImg = document.getElementById("iconNotifImg");
        const statusNotifBaru = localStorage.getItem("adaNotifikasiBaru");
        if (iconNotifImg) {
            if (statusNotifBaru === "true") {
                iconNotifImg.src = "../assets/icon-notif-merah.svg";
            } else {
                iconNotifImg.src = "../assets/icon-notif.svg";
            }
        }

        // Fungsi Logout (Tetap di halaman saat ini / refresh)
        const handleLogout = function(e) {
            e.preventDefault();
            localStorage.removeItem("namaPengguna");
            localStorage.removeItem("username");
            localStorage.removeItem("adaNotifikasiBaru");
            window.location.reload(); // Memperbarui halaman tanpa pindah ke halaman login
        };

        if (btnKeluarDesktop) btnKeluarDesktop.addEventListener("click", handleLogout);
        if (btnKeluarMobile) btnKeluarMobile.addEventListener("click", handleLogout);

    } else {
        // --- JIKA BELUM LOGIN (GUEST MODE) ---
        if (guestButtons) guestButtons.classList.remove("d-none");
        if (loggedInProfile) loggedInProfile.classList.add("d-none");

        // Sembunyikan pembungkus tombol Keluar di bawah saat Guest
        if (wrapperKeluarDesktop) wrapperKeluarDesktop.classList.add("d-none");
        if (wrapperKeluarMobile) wrapperKeluarMobile.classList.add("d-none");

        // Sembunyikan menu Info Penyewaan & Riwayat saat Guest
        if (menuInfoDesktop) menuInfoDesktop.classList.add("d-none");
        if (menuRiwayatDesktop) menuRiwayatDesktop.classList.add("d-none");
        if (menuInfoMobile) menuInfoMobile.classList.add("d-none");
        if (menuRiwayatMobile) menuRiwayatMobile.classList.add("d-none");

        const modalEl = document.getElementById('modalWajibLogin');
        const modalWajibLogin = modalEl ? new bootstrap.Modal(modalEl) : null;

        // Proteksi klik jika mencoba membuka menu terlarang saat guest
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

    // 2. Fitur Pencarian Dinamis di Halaman Katalog
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
});

// 3. Fungsi Filter Merek Motor
function filterMerek(merek, element) {
    document.querySelectorAll('.brand-card').forEach(card => {
        card.classList.remove('active');
    });

    element.classList.add('active');

    const inputPencarian = document.getElementById('inputPencarian');
    if (inputPencarian) inputPencarian.value = '';

    let daftarMotor = document.querySelectorAll('.item-motor');
    daftarMotor.forEach(motor => {
        let kategoriMotor = motor.getAttribute('data-merek');
        
        if (kategoriMotor === merek) {
            motor.style.display = 'block'; 
        } else {
            motor.style.display = 'none';  
        }
    });
}