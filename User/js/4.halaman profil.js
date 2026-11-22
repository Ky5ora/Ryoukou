document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Sinkronisasi Status Notifikasi di Topbar
    const iconNotifImg = document.getElementById("iconNotifImg");
    const statusNotifBaru = localStorage.getItem("adaNotifikasiBaru");
    if (iconNotifImg) {
        if (statusNotifBaru === "true") {
            iconNotifImg.src = "../assets/icon-notif-merah.svg";
        } else {
            iconNotifImg.src = "../assets/icon-notif.svg";
        }
    }

    // 2. Load Data Profil dari LocalStorage jika ada
    let savedNama = localStorage.getItem("namaPengguna") || localStorage.getItem("username");
    let savedEmail = localStorage.getItem("emailPengguna") || "pembeli@ryokou.com";
    let savedTelp = localStorage.getItem("telpPengguna") || "081234567890";

    const inputNama = document.getElementById("inputNamaLengkap");
    const inputEmail = document.getElementById("inputEmail");
    const inputTelp = document.getElementById("inputTelepon");
    
    const displayNama = document.getElementById("displayNamaUser");
    const displayEmail = document.getElementById("displayEmailUser");
    const displayTelp = document.getElementById("displayTelp");

    if (savedNama) {
        if (inputNama) inputNama.value = savedNama;
        if (displayNama) displayNama.textContent = savedNama;
    }
    if (inputEmail) inputEmail.value = savedEmail;
    if (displayEmail) displayEmail.textContent = savedEmail;
    if (inputTelp) inputTelp.value = savedTelp;
    if (displayTelp) displayTelp.textContent = savedTelp;

    // 3. Fungsi Logout
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

    // 4. Simpan Perubahan Profil dengan Floating Modal
    const formProfil = document.getElementById("formProfil");
    if (formProfil) {
        formProfil.addEventListener("submit", function(e) {
            e.preventDefault();

            let namaBaru = inputNama.value;
            let emailBaru = inputEmail.value;
            let telpBaru = inputTelp.value;

            // Simpan ke LocalStorage agar tersinkron ke halaman lain
            localStorage.setItem("namaPengguna", namaBaru);
            localStorage.setItem("emailPengguna", emailBaru);
            localStorage.setItem("telpPengguna", telpBaru);

            // Update tampilan kartu profil secara langsung
            if (displayNama) displayNama.textContent = namaBaru;
            if (displayEmail) displayEmail.textContent = emailBaru;
            if (displayTelp) displayTelp.textContent = telpBaru;

            // Tampilkan Floating Modal Sukses (Menggantikan Alert)
            let modalSuksesEl = new bootstrap.Modal(document.getElementById('modalSuksesProfil'));
            modalSuksesEl.show();
        });
    }
});