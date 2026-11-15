document.addEventListener("DOMContentLoaded", function() {
    // 1. Sync Nama User
    let namaUser = localStorage.getItem("namaPengguna") || localStorage.getItem("username") || "@User123";
    let displayElemen = document.getElementById("namaUserDisplay");
    
    if (displayElemen) {
        displayElemen.textContent = namaUser.startsWith("@") ? namaUser : "@" + namaUser;
    }
});

// 2. Fitur Pencarian Dinamis Unit yang Disewa
const inputPencarian = document.getElementById('inputPencarian');
if (inputPencarian) {
    inputPencarian.addEventListener('keyup', function() {
        let keyword = this.value.toLowerCase();
        let daftarItem = document.querySelectorAll('.item-motor');

        daftarItem.forEach(function(item) {
            let namaMotor = item.querySelector('.nama-motor').textContent.toLowerCase();
            
            if (namaMotor.includes(keyword)) {
                item.style.display = ""; 
            } else {
                item.style.display = "none"; 
            }
        });
    });
}