document.addEventListener("DOMContentLoaded", function() {
    
    // Set status default ada notifikasi baru jika belum ada di localStorage
    if (localStorage.getItem("adaNotifikasiBaru") === null) {
        localStorage.setItem("adaNotifikasiBaru", "true");
    }

    // Sinkronisasi Ikon Notifikasi di Topbar
    const iconNotifImg = document.getElementById("iconNotifImg");
    function updateIkonNotif() {
        let statusBaru = localStorage.getItem("adaNotifikasiBaru");
        if (iconNotifImg) {
            if (statusBaru === "true") {
                iconNotifImg.src = "../assets/icon-notif-merah.svg";
            } else {
                iconNotifImg.src = "../assets/icon-notif.svg";
            }
        }
    }
    updateIkonNotif();

    // Fungsi Logout
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

    // Pencarian Notifikasi Dinamis
    const inputPencarian = document.getElementById('inputPencarian');
    if (inputPencarian) {
        inputPencarian.addEventListener('keyup', function() {
            let keyword = this.value.toLowerCase();
            let daftarNotif = document.querySelectorAll('.item-notif');

            daftarNotif.forEach(function(item) {
                let judul = item.querySelector('.title-notif').textContent.toLowerCase();
                let isi = item.querySelector('p').textContent.toLowerCase();
                if (judul.includes(keyword) || isi.includes(keyword)) {
                    item.style.display = ""; 
                } else {
                    item.style.display = "none"; 
                }
            });
        });
    }

    // Tombol "Tandai Semua Dibaca" (Tanpa Alert/Pop-up)
    const btnTandaiSemua = document.getElementById('btnTandaiSemua');
    if (btnTandaiSemua) {
        btnTandaiSemua.addEventListener('click', function() {
            // Hapus kelas unread dari semua kartu notifikasi secara senyap
            document.querySelectorAll('.card-notif').forEach(card => {
                card.classList.remove('unread');
                card.style.backgroundColor = '#ffffff';
            });

            // Ubah status notifikasi di localStorage menjadi false secara otomatis
            localStorage.setItem("adaNotifikasiBaru", "false");
            updateIkonNotif();
        });
    }

    // Klik pada masing-masing kartu notifikasi untuk mengubah status unread menjadi read
    document.querySelectorAll('.card-notif').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.remove('unread');
            this.style.backgroundColor = '#ffffff';
            
            // Cek apakah masih ada yang unread, jika tidak ubah status global
            let sisaUnread = document.querySelectorAll('.card-notif.unread').length;
            if (sisaUnread === 0) {
                localStorage.setItem("adaNotifikasiBaru", "false");
                updateIkonNotif();
            }
        });
    });
});