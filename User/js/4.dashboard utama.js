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

// 2. Menampilkan Nama User dari LocalStorage
document.addEventListener("DOMContentLoaded", function() {
    const namaUser = localStorage.getItem("namaPengguna") || localStorage.getItem("username") || "@User123";
    const displayElemen = document.getElementById("namaUserDisplay");
    if (displayElemen) {
        displayElemen.textContent = namaUser.startsWith("@") ? namaUser : "@" + namaUser;
    }
});

// 3. Logika Scroll Banner & Munculnya Garis Abu-abu Dinamis
let lastScrollTop = 0;
const bannerPromo = document.querySelector('.banner-promo');
const headerUnitPopuler = document.getElementById('headerUnitPopuler');

if (bannerPromo) {
    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > 150) {
            bannerPromo.classList.add('banner-closed');
            if (headerUnitPopuler) {
                headerUnitPopuler.classList.add('garis-aktif');
            }
        } 
        else if (currentScroll < 50) {
            bannerPromo.classList.remove('banner-closed');
            if (headerUnitPopuler) {
                headerUnitPopuler.classList.remove('garis-aktif');
            }
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
}

// 4. Fitur Klik pada Garis Abu-abu "Unit Populer" untuk Kembali ke Atas
if (headerUnitPopuler) {
    headerUnitPopuler.addEventListener('click', function() {
        if (headerUnitPopuler.classList.contains('garis-aktif')) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const namaUser = localStorage.getItem("namaPengguna");
    const guestButtons = document.getElementById("guestButtons");
    const loggedInProfile = document.getElementById("loggedInProfile");
    const displayElemen = document.getElementById("namaUserDisplay");
    const btnKeluarDesktop = document.getElementById("btnKeluarDesktop");
    const btnKeluarMobile = document.getElementById("btnKeluarMobile");

    if (namaUser) {
        // JIKA SUDAH LOGIN: Tampilkan profil, sembunyikan tombol Masuk/Daftar
        if (guestButtons) guestButtons.classList.add("d-none");
        if (loggedInProfile) {
            loggedInProfile.classList.remove("d-none");
            loggedInProfile.classList.add("d-flex");
        }
        if (displayElemen) {
            displayElemen.textContent = namaUser.startsWith("@") ? namaUser : "@" + namaUser;
        }

        // Fungsi Tombol Keluar (Logout)
        const handleLogout = function(e) {
            e.preventDefault();
            localStorage.removeItem("namaPengguna");
            window.location.href = "4.dashboard utama.html";
        };

        if (btnKeluarDesktop) btnKeluarDesktop.addEventListener("click", handleLogout);
        if (btnKeluarMobile) btnKeluarMobile.addEventListener("click", handleLogout);

    } else {
        // JIKA BELUM LOGIN (GUEST MODE): Tampilkan tombol Masuk/Daftar
        if (guestButtons) guestButtons.classList.remove("d-none");
        if (loggedInProfile) loggedInProfile.classList.add("d-none");

        // Sembunyikan tombol keluar jika belum login
        if (btnKeluarDesktop) btnKeluarDesktop.style.display = "none";
        if (btnKeluarMobile) btnKeluarMobile.style.display = "none";

        // Inisialisasi Modal Wajib Login
        const modalEl = document.getElementById('modalWajibLogin');
        const modalWajibLogin = modalEl ? new bootstrap.Modal(modalEl) : null;

        // Cegah akses menu lain (selain dashboard) & tombol sewa, lalu munculkan modal
        const linkTerproteksi = document.querySelectorAll(
            '.sidebar .nav-link:not(.active), .offcanvas .nav-link:not(.active), .btn-aksi-sewa'
        );

        linkTerproteksi.forEach(elemen => {
            elemen.addEventListener("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (modalWajibLogin) {
                    modalWajibLogin.show(); // Munculkan pop-up mengambang di tengah
                }
            });
        });
    }
});