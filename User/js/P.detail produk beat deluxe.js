document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Atur minimal tanggal sewa (mulai besok) serta format bahasa Indonesia
    const inputTanggal = document.querySelector('input[type="date"]');
    if (inputTanggal) {
        const besok = new Date();
        besok.setDate(besok.getDate() + 1);
        const besokStr = besok.toISOString().split('T')[0];
        inputTanggal.setAttribute('min', besokStr);

        // Paksa browser merender input tanggal menggunakan locale Indonesia (ID)
        inputTanggal.setAttribute('lang', 'id-ID');
    }

    // 2. Logika Jam Mulai dan Jam Selesai juga Tanggal Mulai dan Tanggal Selesai
    const inputJamMulai = document.querySelectorAll('input[type="time"]')[0];
    const inputJamSelesai = document.querySelectorAll('input[type="time"]')[1];

    if (inputJamMulai && inputJamSelesai) {
        inputJamSelesai.disabled = true;

        inputJamMulai.addEventListener('change', function() {
            if (this.value) {
                inputJamSelesai.disabled = false;
                inputJamSelesai.min = this.value;
            } else {
                inputJamSelesai.disabled = true;
                inputJamSelesai.value = '';
            }
        });
    }

    const inputTglMulai = document.querySelectorAll('input[type="date"]')[0];
    const inputTglSelesai = document.querySelectorAll('input[type="date"]')[1];

    if (inputTglMulai && inputTglSelesai) {
        inputTglSelesai.disabled = true;

        inputTglMulai.addEventListener('change', function() {
            if (this.value) {
                inputTglSelesai.disabled = false;
                inputTglSelesai.min = this.value; // Tanggal selesai minimal sama dengan tanggal mulai
                
                // Jika tanggal selesai sebelumnya lebih kecil dari tanggal mulai, reset
                if (inputTglSelesai.value && inputTglSelesai.value < this.value) {
                    inputTglSelesai.value = this.value;
                }
            } else {
                inputTglSelesai.disabled = true;
                inputTglSelesai.value = '';
            }
        });
    }

    // 3. Logika Tombol Plus-Minus (Bisa ditahan/hold) & Input Manual Maksimal 30 Hari
    const tombolMinus = document.getElementById('btnMinusHari');
    const tombolPlus = document.getElementById('btnPlusHari');
    const inputJumlahHari = document.getElementById('inputJumlahHari');

    let holdInterval = null;

    function ubahHari(delta) {
        if (!inputJumlahHari) return;
        let nilaiAktual = parseInt(inputJumlahHari.value) || 1;
        let hasilBaru = nilaiAktual + delta;

        if (hasilBaru >= 1 && hasilBaru <= 30) {
            inputJumlahHari.value = hasilBaru;
            if (typeof updateTanggalSelesaiOtomatis === 'function') {
                updateTanggalSelesaiOtomatis(hasilBaru);
            }
        }
    }

    if (tombolMinus && tombolPlus && inputJumlahHari) {
        tombolMinus.addEventListener('click', (e) => { e.preventDefault(); ubahHari(-1); });
        tombolPlus.addEventListener('click', (e) => { e.preventDefault(); ubahHari(1); });

        const startHold = (delta) => {
            ubahHari(delta);
            holdInterval = setInterval(() => ubahHari(delta), 150);
        };

        const stopHold = () => {
            clearInterval(holdInterval);
        };

        tombolMinus.addEventListener('mousedown', () => startHold(-1));
        tombolMinus.addEventListener('mouseup', stopHold);
        tombolMinus.addEventListener('mouseleave', stopHold);
        tombolMinus.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(-1); });
        tombolMinus.addEventListener('touchend', stopHold);

        tombolPlus.addEventListener('mousedown', () => startHold(1));
        tombolPlus.addEventListener('mouseup', stopHold);
        tombolPlus.addEventListener('mouseleave', stopHold);
        tombolPlus.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(1); });
        tombolPlus.addEventListener('touchend', stopHold);

        inputJumlahHari.removeAttribute('readonly');
        inputJumlahHari.addEventListener('input', function() {
            let nilai = parseInt(this.value);
            if (isNaN(nilai) || nilai < 1) {
                return;
            }
            if (nilai > 30) {
                this.value = 30;
            }
        });

        inputJumlahHari.addEventListener('blur', function() {
            let nilai = parseInt(this.value);
            if (isNaN(nilai) || nilai < 1) {
                this.value = 1;
            } else if (nilai > 30) {
                this.value = 30;
            }
            if (typeof updateTanggalSelesaiOtomatis === 'function') {
                updateTanggalSelesaiOtomatis(parseInt(this.value));
            }
        });
    }

    // 4. Sinkronisasi Nama User dari LocalStorage
    const namaUser = localStorage.getItem("namaPengguna") || localStorage.getItem("username") || "@User123";
    const displayElemen = document.getElementById("namaUserDisplay");
    if (displayElemen) {
        displayElemen.textContent = namaUser.startsWith("@") ? namaUser : "@" + namaUser;
    }
});

// 5. Fungsi Navigasi Tab Deskripsi & Spesifikasi
function switchTab(target) {
    const tabDeskripsi = document.getElementById('tabDeskripsi');
    const tabSpesifikasi = document.getElementById('tabSpesifikasi');
    const kontenDeskripsi = document.getElementById('kontenDeskripsi');
    const kontenSpesifikasi = document.getElementById('kontenSpesifikasi');

    if (target === 'deskripsi') {
        tabDeskripsi.classList.add('active', 'pb-2');
        tabDeskripsi.style.borderBottom = '2px solid #085a6b';
        tabDeskripsi.classList.remove('text-muted');
        
        tabSpesifikasi.classList.remove('active', 'pb-2');
        tabSpesifikasi.style.borderBottom = 'none';
        tabSpesifikasi.classList.add('text-muted');

        kontenDeskripsi.classList.replace('d-none', 'd-block');
        kontenSpesifikasi.classList.replace('d-block', 'd-none');
    } else {
        tabSpesifikasi.classList.add('active', 'pb-2');
        tabSpesifikasi.style.borderBottom = '2px solid #085a6b';
        tabSpesifikasi.classList.remove('text-muted');
        
        tabDeskripsi.classList.remove('active', 'pb-2');
        tabDeskripsi.style.borderBottom = 'none';
        tabDeskripsi.classList.add('text-muted');

        kontenSpesifikasi.classList.replace('d-none', 'd-block');
        kontenDeskripsi.classList.replace('d-block', 'd-none');
    }
}

// 6. Fungsi Global untuk Mengubah Teks Lokasi & Link Google Maps dari Floating Modal
function pilihLokasi(kota, detailTempat, mapsUrl) {
    const displayKota = document.getElementById('displayKotaLokasi');
    const displayDetail = document.getElementById('displayDetailLokasi');
    const linkMaps = document.getElementById('linkLihatPeta');
    
    if (displayKota) displayKota.textContent = kota;
    if (displayDetail) displayDetail.textContent = detailTempat;
    if (linkMaps) linkMaps.href = mapsUrl;

    // Otomatis menutup modal pop-up setelah diklik
    const modalEl = document.getElementById('modalPilihLokasi');
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
}