import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Pengembalian from './pages/Pengembalian';
import RiwayatPenyewaan from './pages/RiwayatPenyewaan';
import LaporanDataMotor from './pages/LaporanDataMotor';

function Placeholder({ title }) {
  return (
    <main className="content">
      <div className="card placeholder">
        <div>
          <i className="bi bi-cone-striped" style={{ fontSize: 42, color: 'var(--teal)' }} />
          <h2 style={{ margin: '12px 0 6px' }}>{title}</h2>
          <p>Halaman ini belum dipindahkan ke React. Fokus saat ini adalah Pengembalian, Riwayat Penyewaan, dan Laporan Data Motor.</p>
          <a className="btn primary" href="/pengembalian">Kembali ke Pengembalian</a>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/pengembalian" replace />} />
        <Route path="/pengembalian" element={<Pengembalian />} />
        <Route path="/riwayat" element={<RiwayatPenyewaan />} />
        <Route path="/laporan-motor" element={<LaporanDataMotor />} />
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
        <Route path="/motor" element={<Placeholder title="Kelola Data Motor" />} />
        <Route path="/transaksi" element={<Placeholder title="Kelola Transaksi" />} />
        <Route path="/info" element={<Placeholder title="Info Penyewaan" />} />
        <Route path="/pembayaran" element={<Placeholder title="Pembayaran" />} />
        <Route path="/invoice" element={<Placeholder title="Invoice" />} />
        <Route path="/pengaturan" element={<Placeholder title="Pengaturan" />} />
        <Route path="*" element={<Navigate to="/pengembalian" replace />} />
      </Route>
    </Routes>
  );
}
