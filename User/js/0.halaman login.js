document.getElementById('lihatSandi').addEventListener('change', function() {
    const inputSandi = document.getElementById('inputSandi');
    inputSandi.type = this.checked ? 'text' : 'password';
});

document.addEventListener("DOMContentLoaded", function() {
    const formLogin = document.getElementById("formLogin");
    
    if (formLogin) {
        formLogin.addEventListener("submit", function(event) {
            event.preventDefault();
            
            let inputNama = document.getElementById("inputNamaUser").value;
            
            localStorage.setItem("namaPengguna", inputNama);
            
            window.location.href = "4.dashboard utama.html";
        });
    }
});