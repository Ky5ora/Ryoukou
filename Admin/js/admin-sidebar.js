/* RYOKOU - satu controller sidebar untuk semua halaman admin */
(() => {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar || sidebar.dataset.ryokouSidebarReady === '1') return;
  sidebar.dataset.ryokouSidebarReady = '1';

  const mobile = () => window.matchMedia('(max-width: 991.98px)').matches;
  const brand = sidebar.querySelector('#brandHeader, .brand, .side-brand') || sidebar;
  const main = document.querySelector('.main-area, .workflow-main, .main-content, .main-content-wrapper, main');

  // Satu tombol collapse desktop dengan bentuk dan ikon yang sama di semua halaman.
  let collapse = document.getElementById('ryokouSidebarCollapse');
  if (!collapse) {
    collapse = document.createElement('button');
    collapse.type = 'button';
    collapse.id = 'ryokouSidebarCollapse';
    collapse.className = 'ryokou-sidebar-collapse';
    collapse.setAttribute('aria-label', 'Tutup sidebar');
    collapse.title = 'Buka / Tutup Sidebar';
    collapse.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M14 9l-2 3 2 3"/></svg>';
    brand.appendChild(collapse);
  }

  // Pastikan ada pemicu drawer mobile di header halaman.
  let mobileTrigger = document.querySelector('#menuToggle, #mobileMenu, #mobileMenuBtn, #openMobileSidebarBtn, .mobile-menu, .menu-toggle, .sidebar-toggle, .add-mobile-menu');
  if (!mobileTrigger && main) {
    const header = main.querySelector('header, .topbar, .workflow-topbar');
    if (header) {
      mobileTrigger = document.createElement('button');
      mobileTrigger.type = 'button';
      mobileTrigger.className = 'ryokou-mobile-menu';
      mobileTrigger.innerHTML = '<i class="bi bi-list"></i>';
      mobileTrigger.setAttribute('aria-label', 'Buka menu');
      header.prepend(mobileTrigger);
    }
  }

  const overlay = document.getElementById('overlay') || (() => {
    const el = document.createElement('div');
    el.id = 'ryokouSidebarOverlay';
    el.className = 'ryokou-sidebar-overlay';
    document.body.appendChild(el);
    return el;
  })();

  const setCollapsed = (collapsed) => {
    sidebar.classList.toggle('sidebar-collapsed', collapsed);
    sidebar.classList.toggle('sidebar-expanded', !collapsed);
    collapse.setAttribute('aria-label', collapsed ? 'Buka sidebar' : 'Tutup sidebar');
    collapse.title = collapsed ? 'Buka Sidebar' : 'Tutup Sidebar';
    collapse.classList.toggle('is-collapsed', collapsed);
  };
  const openMobile = () => {
    sidebar.classList.add('open', 'mobile-open');
    overlay.classList.add('show');
    document.body.classList.add('ryokou-sidebar-open');
  };
  const closeMobile = () => {
    sidebar.classList.remove('open', 'mobile-open');
    overlay.classList.remove('show');
    document.body.classList.remove('ryokou-sidebar-open');
  };

  collapse.addEventListener('click', () => {
    if (!mobile()) setCollapsed(!sidebar.classList.contains('sidebar-collapsed'));
    else closeMobile();
  });

  // Event delegation menangani tombol lama dari semua variasi halaman.
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('#menuToggle, #mobileMenu, #mobileMenuBtn, #openMobileSidebarBtn, #closeMobileSidebarBtn, #toggleSidebarBtn, .mobile-menu, .menu-toggle, .sidebar-toggle, .add-mobile-menu');
    if (trigger) {
      event.preventDefault();
      if (mobile()) {
        if (sidebar.classList.contains('mobile-open') || sidebar.classList.contains('open')) closeMobile();
        else openMobile();
      } else if (trigger.id === 'toggleSidebarBtn') {
        setCollapsed(!sidebar.classList.contains('sidebar-collapsed'));
      }
    }
    if (event.target === overlay) closeMobile();
    if (event.target.closest('#sidebar a[href]') && mobile()) closeMobile();
  });

  window.addEventListener('resize', () => {
    if (!mobile()) closeMobile();
  });

  // Highlight menu berdasarkan file yang sedang dibuka.
  const current = (document.body.dataset.activePage || location.pathname.split('/').pop() || '').toLowerCase();
  sidebar.querySelectorAll('a[href]').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop().split('?')[0].toLowerCase();
    if (href && href === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
})();
