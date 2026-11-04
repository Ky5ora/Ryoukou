document.addEventListener("DOMContentLoaded", function() {
    
    const inputTanggal = document.querySelector('input[type="date"]');
    if (inputTanggal) {
        const besok = new Date();
        besok.setDate(besok.getDate() + 1);
        const besokStr = besok.toISOString().split('T')[0];
        inputTanggal.setAttribute('min', besokStr);
    }

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

        if (inputTanggal) {
            inputTanggal.addEventListener('change', function() {
                const selectedDate = this.value;
                const besok = new Date();
                besok.setDate(besok.getDate() + 1);
                const besokStr = besok.toISOString().split('T')[0];

                if (selectedDate === besokStr) {
                    inputJamMulai.min = "";
                } else {
                    inputJamMulai.min = "";
                }
            });
        }
    }

    const tombolMinus = document.querySelectorAll('.card form button')[0];
    const tombolPlus = document.querySelectorAll('.card form button')[1];
    const inputJumlahHari = document.querySelector('.card form input[type="text"]');

    if (tombolMinus && tombolPlus && inputJumlahHari) {
        inputJumlahHari.value = "1";

        tombolMinus.addEventListener('click', function(e) {
            e.preventDefault();
            let nilaiAktual = parseInt(inputJumlahHari.value) || 1;
            if (nilaiAktual > 1) {
                inputJumlahHari.value = nilaiAktual - 1;
            }
        });

        tombolPlus.addEventListener('click', function(e) {
            e.preventDefault();
            let nilaiAktual = parseInt(inputJumlahHari.value) || 1;
            if (nilaiAktual < 30) {
                inputJumlahHari.value = nilaiAktual + 1;
            }
        });

        inputJumlahHari.addEventListener('input', function() {
            let nilai = parseInt(this.value);
            if (isNaN(nilai) || nilai < 1) {
                this.value = 1;
            } else if (nilai > 30) {
                this.value = 30;
            }
        });
    }

    const namaUser = localStorage.getItem("namaPengguna") || localStorage.getItem("username") || "@User123";
    const displayElemen = document.getElementById("namaUserDisplay");
    if (displayElemen) {
        displayElemen.textContent = namaUser.startsWith("@") ? namaUser : "@" + namaUser;
    }
});

function switchTab(target) {
    const tabDeskripsi = document.getElementById('tabDeskripsi');
    const tabSpesifikasi = document.getElementById('tabSpesifikasi');
    const kontenDeskripsi = document.getElementById('kontenDeskripsi');
    const kontenSpesifikasi = document.getElementById('kontenSpesifikasi');

    if (target === 'deskripsi') {
        tabDeskripsi.classList.add('active', 'pb-2');
        tabDeskripsi.style.borderBottom = '2px solid #0d6efd';
        tabDeskripsi.classList.remove('text-muted');
        
        tabSpesifikasi.classList.remove('active', 'pb-2');
        tabSpesifikasi.style.borderBottom = 'none';
        tabSpesifikasi.classList.add('text-muted');

        kontenDeskripsi.classList.replace('d-none', 'd-block');
        kontenSpesifikasi.classList.replace('d-block', 'd-none');
    } else {
        tabSpesifikasi.classList.add('active', 'pb-2');
        tabSpesifikasi.style.borderBottom = '2px solid #0d6efd';
        tabSpesifikasi.classList.remove('text-muted');
        
        tabDeskripsi.classList.remove('active', 'pb-2');
        tabDeskripsi.style.borderBottom = 'none';
        tabDeskripsi.classList.add('text-muted');

        kontenSpesifikasi.classList.replace('d-none', 'd-block');
        kontenDeskripsi.classList.replace('d-block', 'd-none');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const namaUser = localStorage.getItem("namaPengguna") || localStorage.getItem("username") || "@User123";
    const displayElemen = document.getElementById("namaUserDisplay");
    if (displayElemen) {
        displayElemen.textContent = namaUser.startsWith("@") ? namaUser : "@" + namaUser;
    }
});