// Fungsi untuk toggle lihat/sembunyikan sandi dengan ikon mata
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
    const formLogin = document.getElementById("formLogin");
    
    if (formLogin) {
        formLogin.addEventListener("submit", function(event) {
            event.preventDefault();
            
            // Mengambil nilai email yang diinput untuk disimpan sebagai nama/pengenal user di dashboard
            let inputEmail = document.getElementById("inputEmailLogin").value;
            
            // Menyimpan data ke localStorage agar terbaca di dashboard utama
            localStorage.setItem("namaPengguna", inputEmail);
            
            // Pindah ke halaman dashboard utama
            window.location.href = "4.dashboard utama.html";
        });
    }
});