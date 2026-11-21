document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Sinkronisasi Sesi & Navbar
    let namaUser = localStorage.getItem("namaPengguna") || localStorage.getItem("username");
    let guestButtons = document.getElementById("guestButtons");
    let loggedInProfile = document.getElementById("loggedInProfile");

    if (namaUser) {
        if (guestButtons) guestButtons.classList.add("d-none");
        if (loggedInProfile) {
            loggedInProfile.classList.remove("d-none");
            loggedInProfile.classList.add("d-flex");
        }
    } else {
        if (guestButtons) guestButtons.classList.remove("d-none");
        if (loggedInProfile) loggedInProfile.classList.add("d-none");
    }

    // --- DINAMIS IKON NOTIFIKASI ---
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

    // 3. Pencarian Dinamis
    const inputPencarian = document.getElementById('inputPencarian');
    if (inputPencarian) {
        inputPencarian.addEventListener('keyup', function() {
            let keyword = this.value.toLowerCase();
            let daftarItem = document.querySelectorAll('.item-motor');

            daftarItem.forEach(function(item) {
                let namaMotor = item.querySelector('.nama-motor').textContent.toLowerCase();
                if (namaMotor.includes(keyword)) {
                    item.style.display = ""; 
                } else {
                    item.style.display = "none"; 
                }
            });
        });
    }

    // ==========================================
    // 4. LOGIKA MODAL RINCIAN & PERPANJANG
    // ==========================================
    let activeCardData = {
        nama: "",
        img: "",
        plat: "",
        hargaHarian: 83000,
        tanggalSelesai: "21 Nov 2026"
    };

    // Tangkap data saat tombol Rincian / Perpanjang diklik
    document.querySelectorAll('.item-motor').forEach(card => {
        let btnRincian = card.querySelector('[data-bs-target="#modalRincian"]');
        let btnPerpanjang = card.querySelector('[data-bs-target="#modalPerpanjang"]');

        let dataNama = card.querySelector('.nama-motor').textContent;
        let dataImg = card.querySelector('img.img-fluid').src;
        let dataPlat = card.getAttribute('data-plat') || "AB 1234 XY";
        let dataHarga = parseInt(card.getAttribute('data-harga')) || 83000;
        let dataSelesai = card.getAttribute('data-selesai') || "21 Nov 2026";

        if(btnRincian) {
            btnRincian.addEventListener('click', () => {
                document.getElementById('namaMotorRincian').textContent = dataNama;
                document.getElementById('imgModalRincian').src = dataImg;
                document.getElementById('platMotorRincian').textContent = dataPlat;
            });
        }

        if(btnPerpanjang) {
            btnPerpanjang.addEventListener('click', () => {
                activeCardData.nama = dataNama;
                activeCardData.hargaHarian = dataHarga;
                activeCardData.tanggalSelesai = dataSelesai;

                document.getElementById('namaMotorPerpanjang').textContent = dataNama;
                document.getElementById('teksBatasLama').textContent = dataSelesai;
                document.getElementById('inputJumlahHari').value = 3;
                eksekusiKalkulasiFinal(3);
            });
        }
    });

    // Kalkulasi Biaya & Perhitungan Final
    const inputHari = document.getElementById('inputJumlahHari');
    const btnMinus = document.getElementById('btnMinus');
    const btnPlus = document.getElementById('btnPlus');
    const loadingEl = document.getElementById('loadingKalkulasi');

    function tampilkanLoading(status) {
        if (!loadingEl) return;
        if (status) {
            loadingEl.classList.remove('d-none');
            loadingEl.classList.add('d-flex');
        } else {
            loadingEl.classList.remove('d-flex');
            loadingEl.classList.add('d-none');
        }
    }

    function eksekusiKalkulasiFinal(jumlahHari) {
        tampilkanLoading(true);

        // Simulasi jeda loading sebentar saat tombol dilepas
        setTimeout(() => {
            let totalBiaya = jumlahHari * activeCardData.hargaHarian;
            
            // Format Rupiah
            let formatRupiah = "Rp " + totalBiaya.toLocaleString('id-ID');
            document.getElementById('teksTotalBiaya').textContent = formatRupiah;

            // Kalkulasi tanggal baru
            let tanggalDasar = new Date("2026-11-21");
            tanggalDasar.setDate(tanggalDasar.getDate() + parseInt(jumlahHari));
            let options = { day: 'numeric', month: 'short', year: 'numeric' };
            let tanggalBaruStr = tanggalDasar.toLocaleDateString('id-ID', options);
            
            document.getElementById('teksBatasBaru').textContent = tanggalBaruStr;

            tampilkanLoading(false);
        }, 350);
    }

    // Validasi input manual: Hanya angka, maksimal 30, minimal 1
    if(inputHari) {
        inputHari.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            let val = parseInt(this.value);
            if (val > 30) {
                this.value = 30;
                val = 30;
            }
            if (val < 1 || this.value === "") {
                val = 1;
            }
            eksekusiKalkulasiFinal(val);
        });

        inputHari.addEventListener('blur', function() {
            if (this.value === "" || parseInt(this.value) < 1) {
                this.value = 1;
                eksekusiKalkulasiFinal(1);
            }
        });
    }

    // Fitur Tahan Tombol (Hold-to-Increment / Decrement dengan Loading Terus Menerus)
    let holdInterval = null;
    let holdTimeout = null;

    function startHolding(action) {
        // Saat tombol mulai ditahan, aktifkan animasi loading secara kontinyu
        tampilkanLoading(true);

        let val = parseInt(inputHari.value) || 1;
        if (action === 'plus' && val < 30) {
            val++;
        } else if (action === 'minus' && val > 1) {
            val--;
        }
        inputHari.value = val;

        // Penambahan/pengurangan angka secara berkala selama tombol ditekan terus
        holdTimeout = setTimeout(() => {
            holdInterval = setInterval(() => {
                let currentVal = parseInt(inputHari.value) || 1;
                if (action === 'plus' && currentVal < 30) {
                    currentVal++;
                    inputHari.value = currentVal;
                } else if (action === 'minus' && currentVal > 1) {
                    currentVal--;
                    inputHari.value = currentVal;
                } else {
                    stopHolding();
                }
            }, 120); // Kecepatan pergerakan angka saat ditahan
        }, 300);
    }

    function stopHolding() {
        if (holdTimeout || holdInterval) {
            clearTimeout(holdTimeout);
            clearInterval(holdInterval);
            holdTimeout = null;
            holdInterval = null;

            // Setelah tombol dilepas, jalankan kalkulasi final & hilangkan loading
            let finalVal = parseInt(inputHari.value) || 1;
            eksekusiKalkulasiFinal(finalVal);
        }
    }

    if(btnPlus && btnMinus) {
        // Event Tombol Plus
        btnPlus.addEventListener('mousedown', () => startHolding('plus'));
        btnPlus.addEventListener('touchstart', (e) => { e.preventDefault(); startHolding('plus'); });
        
        // Event Tombol Minus
        btnMinus.addEventListener('mousedown', () => startHolding('minus'));
        btnMinus.addEventListener('touchstart', (e) => { e.preventDefault(); startHolding('minus'); });

        // Lepas klik / sentuh (Mouse Up / Touch End di seluruh jendela agar aman)
        window.addEventListener('mouseup', stopHolding);
        window.addEventListener('touchend', stopHolding);
    }

    // Tombol Lanjut ke Konfirmasi Final (Pop Up Kedua)
    const btnBukaKonfirmasi = document.getElementById('btnBukaKonfirmasi');
    if(btnBukaKonfirmasi) {
        btnBukaKonfirmasi.addEventListener('click', () => {
            let jumlahHari = inputHari.value;
            let totalBiayaStr = document.getElementById('teksTotalBiaya').textContent;

            document.getElementById('konfirmasiNamaMotor').textContent = activeCardData.nama;
            document.getElementById('konfirmasiJumlahHari').textContent = jumlahHari + " Hari";
            document.getElementById('konfirmasiTotalBiaya').textContent = totalBiayaStr;

            // Tutup modal perpanjang, buka modal konfirmasi final
            let modalPerpanjangInstance = bootstrap.Modal.getInstance(document.getElementById('modalPerpanjang'));
            modalPerpanjangInstance.hide();

            let modalKonfirmasiEl = new bootstrap.Modal(document.getElementById('modalKonfirmasiFinal'));
            modalKonfirmasiEl.show();
        });
    }

    // Tombol Eksekusi Akhir
    const btnEksekusiPerpanjang = document.getElementById('btnEksekusiPerpanjang');
    if(btnEksekusiPerpanjang) {
        btnEksekusiPerpanjang.addEventListener('click', () => {
            alert("Berhasil! Permintaan perpanjangan sewa telah dikonfirmasi. Silakan lakukan pembayaran.");
            let modalFinalInstance = bootstrap.Modal.getInstance(document.getElementById('modalKonfirmasiFinal'));
            modalFinalInstance.hide();
        });
    }
});