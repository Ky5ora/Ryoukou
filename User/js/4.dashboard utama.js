document.getElementById('inputPencarian').addEventListener('keyup', function() {
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

document.addEventListener("DOMContentLoaded", function() {
    const namaUser = localStorage.getItem("namaPengguna") || localStorage.getItem("username") || "@User123";
    const displayElemen = document.getElementById("namaUserDisplay");
    if (displayElemen) {
        displayElemen.textContent = namaUser.startsWith("@") ? namaUser : "@" + namaUser;
    }
});

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

        // Kalau di-scroll ke bawah melewati 150px (banner tertutup & garis aktif)
        if (currentScroll > 150) {
            bannerPromo.classList.add('banner-closed');
            if (headerUnitPopuler) {
                headerUnitPopuler.classList.add('garis-aktif');
            }
        } 
        // Kalau ditarik balik ke atas mendekati 0 (banner terbuka & garis non-aktif)
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
        // Hanya berfungsi kalau garisnya sedang aktif/muncul
        if (headerUnitPopuler.classList.contains('garis-aktif')) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}