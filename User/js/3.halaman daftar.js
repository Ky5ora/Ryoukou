// Fungsi untuk toggle lihat/sembunyikan sandi dengan ikon mata (mendukung dua input password di halaman daftar)
function toggleSandi(idInput, idImg) {
    const input = document.getElementById(idInput);
    const img = document.getElementById(idImg);
    
    if (input.type === "password") {
        input.type = "text";
        img.src = "../assets/icon-mata-tertutup.svg";
    } else {
        input.type = "password";
        img.src = "../assets/icon-mata-terbuka.svg";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const formDaftar = document.getElementById("formDaftar");

    if (formDaftar) {
        formDaftar.addEventListener("submit", function(event) {
            event.preventDefault();

            let inputUsername = document.getElementById("inputUsernameDaftar").value.trim();
            let inputEmail = document.getElementById("inputEmailDaftar").value.trim();
            let inputSandi = document.getElementById("inputSandiDaftar").value;
            let inputKonfirmasi = document.getElementById("inputKonfirmasiDaftar").value;

            // Validasi kecocokan password
            if (inputSandi !== inputKonfirmasi) {
                alert("Konfirmasi password tidak cocok!");
                return;
            }

            // Ambil database akun dari localStorage
            let daftarAkun = JSON.parse(localStorage.getItem("databaseAkun")) || [];

            // Cek apakah email sudah pernah didaftarkan
            let akunSudahAda = daftarAkun.find(akun => akun.email === inputEmail);
            if (akunSudahAda) {
                alert("Email ini sudah terdaftar! Silakan langsung login.");
                window.location.href = "0.halaman login.html";
                return;
            }

            // Simpan akun baru ke database lokal
            daftarAkun.push({
                username: inputUsername,
                email: inputEmail,
                password: inputSandi
            });

            localStorage.setItem("databaseAkun", JSON.stringify(daftarAkun));
            localStorage.setItem("namaPengguna", inputUsername);

            alert("Pendaftaran Berhasil! Silakan login.");
            window.location.href = "0.halaman login.html";
        });
    }
});