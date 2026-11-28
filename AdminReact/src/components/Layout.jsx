import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { API_MODE } from '../api/client';

const menu = [
  { to: '/dashboard', icon: 'bi-grid', label: 'Dashboard' },
  { to: '/motor', icon: 'bi-bicycle', label: 'Kelola Data Motor' },
  { to: '/transaksi', icon: 'bi-clipboard-check', label: 'Kelola Transaksi' },
  { to: '/info', icon: 'bi-calendar2-week', label: 'Info Penyewaan' },
  { to: '/pembayaran', icon: 'bi-cash-stack', label: 'Pembayaran' },
  { to: '/pengembalian', icon: 'bi-arrow-return-left', label: 'Pengembalian' },
  { to: '/riwayat', icon: 'bi-clock-history', label: 'Riwayat Penyewaan' },
  { to: '/laporan-motor', icon: 'bi-file-earmark-text', label: 'Laporan Data Motor' },
  { to: '/invoice', icon: 'bi-receipt', label: 'Invoice' }
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <a className="brand" href="/pengembalian" onClick={e => { e.preventDefault(); navigate('/pengembalian'); setOpen(false); }}>
          <img src="/assets/ryokou-logo.png" alt="Logo RYOKOU" />
          <span>RYOKOU</span>
        </a>
        <p className="side-caption">MENU UTAMA</p>
        <nav>
          {menu.map(m => (
            <NavLink key={m.to} to={m.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
              <i className={`bi ${m.icon}`} /> <span>{m.label}</span>
            </NavLink>
          ))}
        </nav>
        <a className="logout" href="/login" onClick={e => { e.preventDefault(); alert('Anda telah keluar dari akun Admin_001.'); }}>
          <i className="bi bi-box-arrow-right" /> Keluar
        </a>
        <div className="mode-badge">{API_MODE}</div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button className="mobile-menu" type="button" aria-label="Buka menu" onClick={() => setOpen(!open)}><i className="bi bi-list" /></button>
          <div className="topbar-search"><i className="bi bi-search" /><input type="search" placeholder="Pencarian cepat" aria-label="Pencarian cepat" /></div>
          <div className="profile">
            <button type="button" className="btn" style={{ border: 0, background: 'transparent', padding: 4 }} onClick={() => setProfile(!profile)}>
              <span className="avatar">A1</span>
              <span style={{ textAlign: 'left', marginLeft: 8 }}><strong>Admin_001</strong><small>Admin/Owner</small></span>
              <i className="bi bi-chevron-down small" />
            </button>
            {profile && (
              <div className="profile-menu">
                <a href="/pengaturan" onClick={e => { e.preventDefault(); setProfile(false); alert('Halaman Pengaturan akan tersedia setelah backend Node.js dipasang.'); }}><i className="bi bi-gear" /> Pengaturan</a>
                <button type="button" className="danger" onClick={() => { setProfile(false); alert('Anda telah keluar dari akun Admin_001.'); }}><i className="bi bi-box-arrow-right" /> Keluar dari Admin</button>
              </div>
            )}
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
