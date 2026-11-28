/* RYOKOU universal admin profile dropdown */
(() => {
  function initProfile() {
    // Workflow pages use a decorative .workflow-profile; convert it to an actual trigger.
    document.querySelectorAll('.workflow-profile').forEach((profile, index) => {
      if (profile.dataset.profileReady === '1' || profile.id === 'profileTrigger') return;
      profile.dataset.profileReady = '1';
      profile.classList.add('workflow-profile-trigger');
      profile.setAttribute('role', 'button');
      profile.setAttribute('tabindex', '0');
      profile.setAttribute('aria-haspopup', 'menu');
      profile.setAttribute('aria-expanded', 'false');

      const dropdown = document.createElement('div');
      dropdown.className = 'workflow-profile-dropdown';
      dropdown.setAttribute('role', 'menu');
      dropdown.innerHTML = `
        <div class="workflow-profile-dropdown-head">
          <span class="workflow-profile-dropdown-avatar">A1</span>
          <div class="workflow-profile-dropdown-copy">
            <strong>Admin_001</strong>
            <span>admin001@gmail.com</span>
            <em>Admin/Owner</em>
          </div>
        </div>
        <a role="menuitem" href="Pengaturan.html"><i class="bi bi-gear"></i><span>Pengaturan</span></a>
        <button type="button" role="menuitem" class="workflow-profile-logout"><i class="bi bi-box-arrow-right"></i><span>Keluar dari Admin</span></button>`;
      profile.insertAdjacentElement('afterend', dropdown);

      const toggle = () => {
        const open = dropdown.classList.contains('is-open');
        document.querySelectorAll('.workflow-profile-dropdown.is-open').forEach(el => {
          el.classList.remove('is-open');
          el.previousElementSibling?.setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          dropdown.classList.add('is-open');
          profile.setAttribute('aria-expanded', 'true');
        }
      };
      profile.addEventListener('click', event => { event.stopPropagation(); toggle(); });
      profile.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
      });
      dropdown.addEventListener('click', event => event.stopPropagation());
      dropdown.querySelector('.workflow-profile-logout').addEventListener('click', () => {
        alert('Anda telah keluar dari akun Admin_001.');
        dropdown.classList.remove('is-open');
        profile.setAttribute('aria-expanded', 'false');
      });
    });


  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initProfile);
  else initProfile();
})();
