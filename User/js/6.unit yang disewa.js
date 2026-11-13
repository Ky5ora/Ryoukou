document.addEventListener("DOMContentLoaded", function() {
    // 1. Sync Nama User
    let namaUser = localStorage.getItem("namaPengguna") || "@User123";
    let displayElemen = document.getElementById("namaUserDisplay");
    
    if (displayElemen) {
        displayElemen.textContent = namaUser.startsWith("@") ? namaUser : "@" + namaUser;
    }
});