document.addEventListener("DOMContentLoaded", function() {
    // 1. Sync Nama User
    let namaUser = localStorage.getItem("namaPengguna") || "@User123";
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

    // Tampilkan motor yang sesuai dengan merek yang dipilih
    let daftarMotor = document.querySelectorAll('.item-motor');
    daftarMotor.forEach(motor => {
        let kategoriMotor = motor.getAttribute('data-merek');
        
        if (kategoriMotor === merek) {
            motor.style.display = 'block'; // Tampilkan jika cocok
        } else {
            motor.style.display = 'none';  // Sembunyikan jika beda merek
        }
    });
}