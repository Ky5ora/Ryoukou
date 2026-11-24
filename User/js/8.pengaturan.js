document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Sinkronisasi Ikon Notifikasi di Topbar
    const iconNotifImg = document.getElementById("iconNotifImg");
    const statusNotifBaru = localStorage.getItem("adaNotifikasiBaru");
    if (iconNotifImg) {
        if (statusNotifBaru === "true") {
            iconNotifImg.src = "../assets/icon-notif-merah.svg";
        } else {
            iconNotifImg.src = "../assets/icon-notif.svg";
        }
    }

    // 2. Load Nama dan Email Akun dari LocalStorage
    let savedNama = localStorage.getItem("namaPengguna") || localStorage.getItem("username") || "Pengguna Ryokou";
    let savedEmail = localStorage.getItem("emailPengguna") || "pembeli@ryokou.com";

    const displayNamaAkun = document.getElementById("displayNamaAkun");
    const displayEmailAkun = document.getElementById("displayEmailAkun");

    if (displayNamaAkun) displayNamaAkun.textContent = savedNama;
    if (displayEmailAkun) displayEmailAkun.textContent = savedEmail;

    // 3. Logika Log Out Akun via Floating Modal yang Rapi
    const btnLogOutAkurat = document.getElementById("btnLogOutAkurat");
    const btnEksekusiLogout = document.getElementById("btnEksekusiLogout");

    if (btnLogOutAkurat) {
        btnLogOutAkurat.addEventListener("click", function(e) {
            e.preventDefault();
            let modalLogoutEl = new bootstrap.Modal(document.getElementById('modalKonfirmasiLogout'));
            modalLogoutEl.show();
        });
    }

    if (btnEksekusiLogout) {
        btnEksekusiLogout.addEventListener("click", function() {
            // Hapus sesi pengguna di LocalStorage
            localStorage.removeItem("namaPengguna");
            localStorage.removeItem("username");
            localStorage.removeItem("emailPengguna");
            localStorage.removeItem("telpPengguna");
            localStorage.removeItem("adaNotifikasiBaru");
            
            // Redirect ke halaman login
            window.location.href = "0.halaman login.html";
        });
    }
});