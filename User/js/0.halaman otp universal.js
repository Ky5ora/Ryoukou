document.addEventListener("DOMContentLoaded", function() {
    const displayOtpCode = document.getElementById("displayOtpCode");
    const otpToast = document.getElementById("otpToast");
    const formOtp = document.getElementById("formOtp");
    const otpBoxes = document.querySelectorAll(".otp-box");
    const resendOtp = document.getElementById("resendOtp");

    // Fungsi untuk menghasilkan 6 digit kode OTP acak
    function generateRandomOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Set kode OTP demo saat halaman dimuat
    let currentOtp = generateRandomOtp();
    if (displayOtpCode) {
        displayOtpCode.textContent = currentOtp;
    }

    // Fungsi untuk mengatur ulang status aktif/disabled kotak berurutan dari kiri
    function updateBoxStates() {
        let filledCount = 0;
        otpBoxes.forEach((box, idx) => {
            if (box.value.length === 1) {
                filledCount++;
            }
        });

        otpBoxes.forEach((box, idx) => {
            if (idx <= filledCount) {
                box.removeAttribute("disabled");
            } else {
                box.setAttribute("disabled", "true");
            }
        });

        // Fokus ke kotak kosong pertama dari kiri
        for (let i = 0; i < otpBoxes.length; i++) {
            if (otpBoxes[i].value === "" && (i === 0 || otpBoxes[i - 1].value !== "")) {
                otpBoxes[i].focus();
                break;
            }
        }
    }

    // Inisialisasi awal: hanya kotak pertama yang aktif
    otpBoxes.forEach((box, idx) => {
        if (idx > 0) box.setAttribute("disabled", "true");
    });
    otpBoxes[0].focus();

    // Tombol Kirim Ulang OTP (Bisa di-spam terus & ada animasi turun berulang)
    if (resendOtp) {
        resendOtp.addEventListener("click", function(e) {
            e.preventDefault();
            
            currentOtp = generateRandomOtp();
            if (displayOtpCode) {
                displayOtpCode.textContent = currentOtp;
            }

            otpBoxes.forEach(box => {
                box.value = "";
                box.setAttribute("disabled", "true");
            });
            otpBoxes[0].removeAttribute("disabled");
            otpBoxes[0].focus();

            if (otpToast) {
                otpToast.classList.remove("toast-animate-down");
                void otpToast.offsetWidth;
                otpToast.classList.add("toast-animate-down");
            }
        });
    }

    // Logika ketik ketat berurutan dari kiri
    otpBoxes.forEach((box, index) => {
        box.addEventListener("input", function(e) {
            let value = e.target.value;
            e.target.value = value.replace(/[^0-9]/g, "").slice(-1);

            updateBoxStates();
        });

        box.addEventListener("keydown", function(e) {
            if (e.key === "Backspace") {
                e.preventDefault();
                if (box.value !== "") {
                    box.value = "";
                } else if (index > 0) {
                    otpBoxes[index - 1].value = "";
                    otpBoxes[index - 1].removeAttribute("disabled");
                    otpBoxes[index - 1].focus();
                }
                updateBoxStates();
            }
        });

        box.addEventListener("click", function() {
            for (let i = 0; i <= index; i++) {
                if (otpBoxes[i].value === "" && i < index) {
                    otpBoxes[i].focus();
                    break;
                }
            }
        });

        box.addEventListener("paste", function(e) {
            e.preventDefault();
            let pasteData = e.clipboardData.getData("text").trim();
            if (/^\d{6}$/.test(pasteData)) {
                otpBoxes.forEach((b, idx) => {
                    b.removeAttribute("disabled");
                    b.value = pasteData[idx];
                });
                otpBoxes[otpBoxes.length - 1].focus();
            }
        });
    });

    // Validasi saat form OTP disubmit (Sukses langsung pindah tanpa alert, salah tetap muncul alert)
    if (formOtp) {
        formOtp.addEventListener("submit", function(event) {
            event.preventDefault();

            let enteredOtp = "";
            otpBoxes.forEach(box => {
                enteredOtp += box.value;
            });

            if (enteredOtp === currentOtp) {
                let tujuan = localStorage.getItem("tujuanSetelahOtp") || "4.dashboard utama.html";
                localStorage.removeItem("tujuanSetelahOtp");

                // Langsung pindah halaman tanpa alert sukses
                window.location.href = tujuan;
            } else {
                alert("Kode OTP salah! Silakan cek kembali kode di pojok kanan atas.");
                otpBoxes.forEach((box, idx) => {
                    box.value = "";
                    if (idx > 0) box.setAttribute("disabled", "true");
                });
                otpBoxes[0].removeAttribute("disabled");
                otpBoxes[0].focus();
            }
        });
    }
});