import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { BRANCHES } from '../data/seed';
import { downloadCsv, fmtDate, fmtDateTime, money, toneForStatus } from '../utils/format';
import { Empty, Modal, Pill, Stat, Toast } from '../components/Ui';

const PER_PAGE = 5;

export default function RiwayatPenyewaan() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [branch, setBranch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { api.getRentals().then(setRows); }, []);
  const notify = text => { setMessage(text); window.setTimeout(() => setMessage(''), 3200); };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const start = from ? new Date(from + 'T00:00') : null;
    const end = to ? new Date(to + 'T23:59') : null;
    return rows.filter(r => {
      const d = new Date(r.start);
      return (!q || [r.id, r.customer, r.motor, r.plate, r.phone].some(v => String(v).toLowerCase().includes(q)))
        && (!status || r.status === status) && (!branch || r.branch === branch)
        && (!start || d >= start) && (!end || d <= end);
    });
  }, [rows, search, status, branch, from, to]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const done = rows.filter(r => r.status === 'Selesai');
  const stats = {
    total: rows.length,
    done: done.length,
    canceled: rows.filter(r => r.status === 'Dibatalkan').length,
    revenue: money(done.reduce((a, r) => a + r.total + r.fine, 0)),
    fine: money(rows.reduce((a, r) => a + r.fine, 0))
  };

  function reset() { setSearch(''); setStatus(''); setBranch(''); setFrom(''); setTo(''); setPage(1); notify('Filter riwayat direset.'); }

  function timelineFor(r) {
    const plus = minutes => fmtDateTime(new Date(new Date(r.start).getTime() + minutes * 60000));
    const steps = [
      { label: 'Pesanan dibuat', time: fmtDateTime(r.start), done: true },
      { label: 'Dokumen diverifikasi admin', time: plus(30), done: true },
      { label: 'Pembayaran ' + (r.payment === 'Lunas' ? 'diterima' : 'menunggu'), time: plus(60), done: r.payment === 'Lunas' },
      { label: 'Unit diserahkan', time: fmtDateTime(r.start), done: !['Menunggu Verifikasi', 'Dibatalkan'].includes(r.status) },
      { label: 'Unit dikembalikan & diperiksa', time: fmtDateTime(r.end), done: r.status === 'Selesai' },
      { label: 'Transaksi selesai / invoice', time: r.status === 'Selesai' ? fmtDateTime(r.end) : '—', done: r.status === 'Selesai' }
    ];
    const currentStep = steps.findIndex(s => !s.done);
    return steps.map((s, i) => (
      <li key={s.label} className={s.done ? 'done' : (i === currentStep ? 'current' : '')}>
        <strong>{s.label}</strong><span>{s.time}</span>
      </li>
    ));
  }

  return (
    <main className="content">
      <p className="breadcrumb-line"><a href="/dashboard">Dashboard</a> › Operasional › Riwayat Penyewaan</p>
      <div className="heading">
        <div><h1><i className="bi bi-clock-history" style={{ color: 'var(--teal)' }} /> Riwayat Penyewaan</h1><p>Telusuri transaksi, status pemesanan, pembayaran, denda, dan bukti invoice.</p></div>
        <div className="heading-actions">
          <a className="btn" href="/transaksi"><i className="bi bi-arrow-left" /> Kelola Transaksi</a>
          <button className="btn primary" type="button" onClick={() => { downloadCsv('riwayat-penyewaan-ryokou.csv', ['ID', 'Pelanggan', 'Motor', 'Cabang', 'Mulai', 'Selesai', 'Total', 'Denda', 'Status', 'Pembayaran'], filtered.map(r => [r.id, r.customer, r.motor, r.branch, fmtDateTime(r.start), fmtDateTime(r.end), r.total, r.fine, r.status, r.payment])); notify('Riwayat diekspor ke CSV.'); }}><i className="bi bi-download" /> Ekspor CSV</button>
        </div>
      </div>

      <div className="grid-6">
        <Stat icon="bi-collection" value={stats.total} label="Total Transaksi" />
        <Stat icon="bi-check2-circle" tone="green" value={stats.done} label="Selesai" />
        <Stat icon="bi-x-circle" tone="red" value={stats.canceled} label="Dibatalkan" />
        <Stat icon="bi-wallet2" tone="blue" value={stats.revenue} label="Pendapatan (Selesai)" />
        <Stat icon="bi-exclamation-triangle" tone="gold" value={stats.fine} label="Total Denda" />
        <Stat icon="bi-info-circle" tone="gold" value="4 Cabang" label="Malang &amp; Batu" />
      </div>

      <section className="card">
        <div className="card-title"><div><h2>Daftar Riwayat Transaksi</h2><p>Selesai, berjalan, maupun dibatalkan.</p></div><Pill tone="gray">Filter aktif</Pill></div>
        <div className="toolbar">
          <div className="search"><i className="bi bi-search" /><input className="input" type="search" placeholder="Cari ID, pelanggan, atau motor..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
          <select className="select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} aria-label="Filter status"><option value="">Semua Status</option><option>Menunggu Verifikasi</option><option>Dalam Penyewaan</option><option>Selesai</option><option>Dibatalkan</option></select>
          <select className="select" value={branch} onChange={e => { setBranch(e.target.value); setPage(1); }} aria-label="Filter cabang"><option value="">Semua Cabang</option>{BRANCHES.map(b => <option key={b}>{b}</option>)}</select>
          <input className="input" type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} aria-label="Dari tanggal" style={{ width: 'auto' }} />
          <input className="input" type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }} aria-label="Sampai tanggal" style={{ width: 'auto' }} />
          <button className="btn" type="button" onClick={reset}><i className="bi bi-arrow-counterclockwise" /> Reset</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID Transaksi</th><th>Pelanggan</th><th>Unit Motor</th><th>Periode Sewa</th><th>Total</th><th>Denda</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {slice.length ? slice.map(r => (
                <tr key={r.id} onClick={() => setDetail(r)}>
                  <td className="cell-main">{r.id}</td>
                  <td>{r.customer}<span className="cell-sub">{r.phone}</span></td>
                  <td>{r.motor}<span className="cell-sub">{r.plate} · {r.branch}</span></td>
                  <td>{fmtDate(r.start)} – {fmtDate(r.end)}<span className="cell-sub">{r.days} hari</span></td>
                  <td className="money">{money(r.total)}</td>
                  <td>{r.fine ? <span className="late">{money(r.fine)}</span> : '—'}</td>
                  <td><Pill tone={toneForStatus(r.status)}>{r.status}</Pill><span className="cell-sub"><Pill tone={toneForStatus(r.payment)}>{r.payment}</Pill></span></td>
                  <td><button className="btn" type="button" onClick={e => { e.stopPropagation(); setDetail(r); }}><i className="bi bi-eye" /> Detail</button> {r.status === 'Selesai' && <a className="btn" href="/invoice" onClick={e => e.stopPropagation()}><i className="bi bi-receipt" /> Invoice</a>}</td>
                </tr>
              )) : <tr><td colSpan="8"><Empty text="Belum ada transaksi yang cocok dengan filter." /></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>{filtered.length ? `Menampilkan ${(current - 1) * PER_PAGE + 1}–${Math.min(current * PER_PAGE, filtered.length)} dari ${filtered.length} transaksi` : 'Menampilkan 0 transaksi'}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="page-btn" disabled={current <= 1} onClick={() => setPage(current - 1)}>‹</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => <button key={n} className={`page-btn ${n === current ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>)}
            <button className="page-btn" disabled={current >= pages} onClick={() => setPage(current + 1)}>›</button>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card-title"><div><h2>Catatan Pembacaan Riwayat</h2><p>Interpretasi status dan tindak lanjut admin.</p></div></div>
        <div className="row-3">
          <div><Pill tone="gold">Menunggu Verifikasi</Pill><p className="cell-sub" style={{ marginTop: 8 }}>Dokumen sedang diperiksa di Info Penyewaan sebelum pelunasan.</p></div>
          <div><Pill tone="blue">Dalam Penyewaan</Pill><p className="cell-sub" style={{ marginTop: 8 }}>Pantau jadwal pengembalian melalui halaman Pengembalian.</p></div>
          <div><Pill tone="green">Selesai</Pill><p className="cell-sub" style={{ marginTop: 8 }}>Invoice final dapat dicetak atau dikirim ke pelanggan.</p></div>
        </div>
      </section>

      {detail && (
        <Modal
          title={<>Detail Penyewaan <span style={{ color: 'var(--muted)' }}>{detail.id}</span></>}
          subtitle="Riwayat lengkap transaksi RYOKOU"
          onClose={() => setDetail(null)}
          footer={<><button className="btn" type="button" onClick={() => setDetail(null)}>Tutup</button>{detail.status === 'Selesai' && <a className="btn primary" href="/invoice"><i className="bi bi-receipt" /> Lihat Invoice</a>}</>}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <Pill tone={toneForStatus(detail.status)}>{detail.status}</Pill>
            <Pill tone={toneForStatus(detail.payment)}><i className="bi bi-wallet2" /> {detail.payment}</Pill>
          </div>
          <div className="row-2">
            <div>
              <h3 className="section-title"><i className="bi bi-person" /> Pelanggan &amp; Unit</h3>
              <dl className="kv">
                <dt>Nama</dt><dd>{detail.customer}</dd>
                <dt>No. HP</dt><dd>{detail.phone}</dd>
                <dt>Unit Motor</dt><dd>{detail.motor} ({detail.plate})</dd>
                <dt>Cabang</dt><dd>{detail.branch}</dd>
                <dt>Periode</dt><dd>{fmtDateTime(detail.start)} – {fmtDateTime(detail.end)}</dd>
              </dl>
            </div>
            <div>
              <h3 className="section-title"><i className="bi bi-list-check" /> Timeline Status</h3>
              <ul className="timeline">{timelineFor(detail)}</ul>
            </div>
          </div>
          <h3 className="section-title"><i className="bi bi-receipt" /> Rincian Pembayaran</h3>
          <div className="modal-stats">
            <div><small>Total Sewa</small><strong>{money(detail.total)}</strong></div>
            <div><small>Total Denda</small><strong>{money(detail.fine)}</strong></div>
            <div><small>Grand Total</small><strong>{money(detail.total + detail.fine)}</strong></div>
          </div>
          <div className="alert info"><i className="bi bi-shield-check" /><span>Bukti pembayaran dan dokumen pendukung tersimpan pada data transaksi.</span></div>
        </Modal>
      )}
      <Toast message={message} />
    </main>
  );
}
