// Fungsi untuk toggle lihat/sembunyikan sandi
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

            let password = document.getElementById("inputSandiDaftar").value;
            let confirmPassword = document.getElementById("inputKonfirmasiDaftar").value;

            // Validasi apakah password dan konfirmasi password sama
            if (password !== confirmPassword) {
                alert("Password dan Konfirmasi Password tidak sama! Silakan cek kembali.");
                return;
            }

            let inputNama = document.getElementById("inputUsernameDaftar").value;
            localStorage.setItem("namaPengguna", inputNama);

            // Pindah paksa ke halaman dashboard utama setelah berhasil daftar
            window.location.href = "4.dashboard utama.html";
        });
    }
});