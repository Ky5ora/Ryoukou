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
    const formPasswordBaru = document.getElementById("formPasswordBaru");

    if (formPasswordBaru) {
        formPasswordBaru.addEventListener("submit", function(event) {
            event.preventDefault();

            const passwordBaru = document.getElementById("inputSandiBaru").value;
            const konfirmasiPassword = document.getElementById("inputKonfirmasiSandi").value;

            // Validasi apakah password dan konfirmasi cocok
            if (passwordBaru !== konfirmasiPassword) {
                alert("Konfirmasi password tidak cocok! Silakan periksa kembali.");
                return;
            }

            // Ambil email yang sedang di-reset dari localStorage
            const emailReset = localStorage.getItem("emailReset");
            let databaseAkun = JSON.parse(localStorage.getItem("databaseAkun")) || [];

            // Cari akun berdasarkan email dan update password-nya
            let akunDitemukan = false;
            databaseAkun = databaseAkun.map(akun => {
                if (akun.email === emailReset) {
                    akunDitemukan = true;
                    akun.password = passwordBaru; // Update password baru
                }
                return akun;
            });

            if (akunDitemukan) {
                localStorage.setItem("databaseAkun", JSON.stringify(databaseAkun));
                alert("Password berhasil diubah! Silakan login kembali.");
            } else {
                // Fallback jika simulasi akun statis
                alert("Password berhasil diubah!");
            }

            // Bersihkan session reset
            localStorage.removeItem("emailReset");
            localStorage.removeItem("tujuanSetelahOtp");

            // Arahkan kembali ke halaman login
            window.location.href = "0.halaman login.html";
        });
    }
});