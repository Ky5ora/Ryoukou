const sidebar=document.getElementById('sidebar');
const overlay=document.getElementById('overlay');
const toggle=document.getElementById('menuToggle');
function closeMenu(){sidebar?.classList.remove('open');overlay?.classList.remove('show');}
toggle?.addEventListener('click',()=>{sidebar.classList.toggle('open');overlay.classList.toggle('show');});
overlay?.addEventListener('click',closeMenu);
window.addEventListener('resize',()=>{if(window.innerWidth>800)closeMenu();});
