document.addEventListener("DOMContentLoaded", function() {
    // 1. Sync Nama User
    let namaUser = localStorage.getItem("namaPengguna") || localStorage.getItem("username") || "@User123";
    let displayElemen = document.getElementById("namaUserDisplay");
    
    if (displayElemen) {
        displayElemen.textContent = namaUser.startsWith("@") ? namaUser : "@" + namaUser;
    }
});

// 2. Fungsi Filter Merek Motor
function filterMerek(merek, element) {
    // Hapus class 'active' dari SEMUA tombol merek terlebih dahulu
    document.querySelectorAll('.brand-card').forEach(card => {
        card.classList.remove('active');
    });

    // Tambahkan class 'active' HANYA pada tombol yang sedang diklik
    element.classList.add('active');

    // Reset input pencarian saat filter merek diklik agar tidak bentrok
    const inputPencarian = document.getElementById('inputPencarian');
    if (inputPencarian) inputPencarian.value = '';

    // Tampilkan motor yang sesuai dengan merek yang dipilih
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

// 3. Fitur Pencarian Dinamis di Halaman Katalog
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