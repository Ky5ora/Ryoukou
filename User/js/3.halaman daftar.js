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

            let inputNama = document.getElementById("inputNamaUser").value;

            localStorage.setItem("namaPengguna", inputNama);

            window.location.href = "4.dashboard utama.html";
        });
    }
});