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
            
            let inputEmail = document.getElementById("inputEmailLogin").value.trim();
            let inputSandi = document.getElementById("inputSandiLogin").value;
            
            // Ambil database akun dari localStorage
            let daftarAkun = JSON.parse(localStorage.getItem("databaseAkun")) || [];
            
            // Cari apakah email tersebut ada di database
            let akunDitemukan = daftarAkun.find(akun => akun.email === inputEmail);
            
            if (!akunDitemukan) {
                alert("Email belum terdaftar! Silakan buat akun terlebih dahulu.");
                window.location.href = "3.halaman daftar.html";
                return;
            }
            
            // Opsional: Cek apakah passwordnya cocok
            if (akunDitemukan.password !== inputSandi) {
                alert("Password salah! Silakan coba lagi.");
                return;
            }
            
            // Jika akun valid, simpan username/nama pengguna asli yang tersimpan
            localStorage.setItem("namaPengguna", akunDitemukan.username);
            
            // Set tujuan setelah OTP berhasil (menuju OTP universal lalu ke dashboard)
            localStorage.setItem("tujuanSetelahOtp", "4.dashboard utama.html");
            
            // Pindah ke halaman OTP universal
            window.location.href = "0.halaman otp universal.html";
        });
    }
});