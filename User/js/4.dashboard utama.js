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