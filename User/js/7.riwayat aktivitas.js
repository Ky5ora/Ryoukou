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

    // 2. Fungsi Logout
    const handleLogout = function(e) {
        e.preventDefault();
        localStorage.removeItem("namaPengguna");
        localStorage.removeItem("username");
        localStorage.removeItem("adaNotifikasiBaru");
        window.location.href = "0.halaman login.html";
    };

    const btnKeluarDesktop = document.getElementById("btnKeluarDesktop");
    const btnKeluarMobile = document.getElementById("btnKeluarMobile");
    if (btnKeluarDesktop) btnKeluarDesktop.addEventListener("click", handleLogout);
    if (btnKeluarMobile) btnKeluarMobile.addEventListener("click", handleLogout);

    // 3. Area untuk Inisialisasi Sistem Dinamis Kamu Selanjutnya
    console.log("Halaman Riwayat Aktivitas siap dikembangkan dengan sistem kustommu!");
});