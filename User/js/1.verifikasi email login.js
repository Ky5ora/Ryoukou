document.addEventListener("DOMContentLoaded", function() {
    const formVerifikasiEmail = document.getElementById("formVerifikasiEmail");

    if (formVerifikasiEmail) {
        formVerifikasiEmail.addEventListener("submit", function(event) {
            event.preventDefault();

            let emailInput = document.getElementById("inputEmailReset").value.trim();
            
            // Simpan email reset jika dibutuhkan
            localStorage.setItem("emailReset", emailInput);

            // Set tujuan akhir setelah verifikasi OTP sukses nanti adalah halaman membuat password baru
            localStorage.setItem("tujuanSetelahOtp", "2.membuat password baru.html");

            // Pindah ke halaman OTP universal
            window.location.href = "0.halaman otp universal.html";
        });
    }
});