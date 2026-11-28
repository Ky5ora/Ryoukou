/* Sidebar interaction is handled centrally by admin-sidebar.js. */
(() => {
  const overlay = document.getElementById('overlay');
  if (!overlay) return;
  overlay.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('open','mobile-open');
    overlay.classList.remove('show');
  });
})();
