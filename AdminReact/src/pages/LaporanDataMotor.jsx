import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { BRANCHES, DEMO_NOW } from '../data/seed';
import { downloadCsv, fmtDate, money, toneForStatus } from '../utils/format';
import { Empty, Modal, Pill, Stat, Toast } from '../components/Ui';

export default function LaporanDataMotor() {
  const [rows, setRows] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [branch, setBranch] = useState('');
  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState({ key: 'id', dir: 1 });
  const [detail, setDetail] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([api.getMotors(), api.getRentals()]).then(([m, r]) => { setRows(m); setRentals(r); });
  }, []);
  const notify = text => { setMessage(text); window.setTimeout(() => setMessage(''), 3200); };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(m => (!q || [m.id, m.name, m.plate].some(v => String(v).toLowerCase().includes(q)))
      && (!status || m.status === status) && (!branch || m.branch === branch) && (!brand || m.brand === brand))
      .sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key]), 'id', { numeric: true }) * sort.dir);
  }, [rows, search, status, branch, brand, sort]);

  const count = s => filtered.filter(m => m.status === s).length;
  const available = count('Tersedia'), rented = count('Disewa'), repair = count('Perbaikan');
  const utilization = filtered.length ? Math.round(rented / filtered.length * 100) : 0;
  const totalRate = filtered.reduce((a, m) => a + m.price, 0);
  const totalRevenue = filtered.reduce((a, m) => a + m.revenue, 0);
  const totalDays = filtered.reduce((a, m) => a + m.days, 0);

  function toggleSort(key) {
    setSort(prev => ({ key, dir: prev.key === key ? -prev.dir : 1 }));
  }

  function reset() { setSearch(''); setStatus(''); setBranch(''); setBrand(''); notify('Filter laporan direset.'); }

  return (
    <main className="content">
      <p className="breadcrumb-line"><a href="/dashboard">Dashboard</a> › Laporan › Data Motor</p>
      <div className="heading">
        <div><h1><i className="bi bi-file-earmark-text" style={{ color: 'var(--teal)' }} /> Laporan Data Motor</h1><p>Ringkasan inventaris, status unit, utilisasi, pendapatan, dan jadwal perawatan.</p></div>
        <div className="heading-actions">
          <a className="btn" href="/motor"><i className="bi bi-sliders" /> Kelola Data Motor</a>
          <button className="btn" type="button" onClick={() => window.print()}><i className="bi bi-printer" /> Cetak</button>
          <button className="btn primary" type="button" onClick={() => { downloadCsv('laporan-data-motor-ryokou.csv', ['ID', 'Motor', 'No Polisi', 'Cabang', 'Status', 'Tarif/Hari', 'Hari Disewa', 'Pendapatan', 'Servis Berikutnya'], filtered.map(m => [m.id, m.name, m.plate, m.branch, m.status, m.price, m.days, m.revenue, m.nextService])); notify('Laporan diekspor ke CSV.'); }}><i className="bi bi-download" /> Ekspor CSV</button>
        </div>
      </div>

      <div className="grid-6">
        <Stat icon="bi-scooter" value={filtered.length} label="Total Unit Motor" />
        <Stat icon="bi-check-circle" tone="green" value={available} label="Tersedia" />
        <Stat icon="bi-hourglass-split" tone="gold" value={rented} label="Disewa" />
        <Stat icon="bi-tools" tone="red" value={repair} label="Perbaikan" />
        <Stat icon="bi-bar-chart-line" tone="blue" value={`${utilization}%`} label="Tingkat Utilisasi" />
        <Stat icon="bi-cash-stack" tone="gold" value={money(totalRevenue)} label="Pendapatan Unit" />
      </div>

      <div className="row-2" style={{ gridTemplateColumns: 'minmax(300px, 4fr) minmax(300px, 8fr)', marginBottom: 16 }}>
        <section className="card">
          <div className="card-title"><div><h2>Ringkasan Status Motor</h2><p>Komposisi mengikuti filter aktif.</p></div></div>
          {[
            ['Tersedia', available, ''], ['Disewa', rented, 'gold'], ['Perbaikan', repair, 'red']
          ].map(([label, value, tone]) => (
            <div className="chart-row" key={label}>
              <strong>{label}</strong>
              <div className="chart-track"><div className={`chart-fill ${tone}`} style={{ width: `${filtered.length ? value / filtered.length * 100 : 0}%` }} /></div>
              <span>{value} unit · {filtered.length ? Math.round(value / filtered.length * 100) : 0}%</span>
            </div>
          ))}
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '13px 0' }} />
          <h3 className="section-title"><i className="bi bi-info-circle" /> Interpretasi Laporan</h3>
          <ul className="note-list">
            <li><b>Utilisasi</b> = unit disewa ÷ total unit. Target ideal &gt; 60%.</li>
            <li><b>Pendapatan</b> = tarif harian × hari sewa pada periode laporan.</li>
            <li>Unit <b>Perbaikan</b> belum dapat dijadwalkan sewa.</li>
            <li>Servis terlewat ditandai pada detail unit.</li>
          </ul>
        </section>

        <section className="card">
          <div className="card-title"><div><h2>Ringkasan Tarif &amp; Kinerja</h2><p>Estimasi potensi pendapatan harian.</p></div><Pill tone="green">Live Filter</Pill></div>
          <div className="modal-stats">
            <div><small>Total Tarif Harian</small><strong>{money(totalRate)}</strong></div>
            <div><small>Total Hari Disewa</small><strong>{totalDays} hari</strong></div>
            <div><small>Pendapatan Terakumulasi</small><strong>{money(totalRevenue)}</strong></div>
          </div>
          <div className="alert info"><i className="bi bi-lightbulb" /><span>Gunakan filter cabang untuk membandingkan 4 lokasi RYOKOU: Batu Sarimun, Batu Diponegoro, Malang Lowokwaru, dan Malang Klojen.</span></div>
          <div className="row-2" style={{ marginTop: 12 }}>
            <div className="fine-row"><label>Unit tersedia</label><span className="money">{available} unit</span></div>
            <div className="fine-row"><label>Unit dalam perbaikan</label><span className="money">{repair} unit</span></div>
          </div>
        </section>
      </div>

      <section className="card">
        <div className="card-title"><div><h2>Daftar Kondisi Unit</h2><p>Klik judul kolom untuk mengurutkan; klik baris untuk detail.</p></div><button className="btn" type="button" onClick={reset}><i className="bi bi-arrow-counterclockwise" /> Reset Filter</button></div>
        <div className="toolbar">
          <div className="search"><i className="bi bi-search" /><input className="input" type="search" placeholder="Cari ID, merek, atau no. polisi..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <select className="select" value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter status"><option value="">Semua Status</option><option>Tersedia</option><option>Disewa</option><option>Perbaikan</option></select>
          <select className="select" value={branch} onChange={e => setBranch(e.target.value)} aria-label="Filter cabang"><option value="">Semua Cabang</option>{BRANCHES.map(b => <option key={b}>{b}</option>)}</select>
          <select className="select" value={brand} onChange={e => setBrand(e.target.value)} aria-label="Filter merek"><option value="">Semua Merek</option><option>Honda</option><option>Yamaha</option></select>
          <span className="count">Menampilkan {filtered.length} dari {rows.length} unit</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th className="sortable" onClick={() => toggleSort('id')}>ID <i className="bi bi-arrow-down-up" /></th>
              <th className="sortable" onClick={() => toggleSort('name')}>Motor <i className="bi bi-arrow-down-up" /></th>
              <th>No. Polisi</th><th>Cabang</th><th>Status</th>
              <th className="sortable" onClick={() => toggleSort('price')}>Tarif / Hari <i className="bi bi-arrow-down-up" /></th>
              <th className="sortable" onClick={() => toggleSort('days')}>Hari Disewa <i className="bi bi-arrow-down-up" /></th>
              <th className="sortable" onClick={() => toggleSort('revenue')}>Pendapatan <i className="bi bi-arrow-down-up" /></th>
              <th>Utilisasi</th><th>Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.length ? filtered.map(m => {
                const util = Math.min(100, m.days * 4);
                return (
                  <tr key={m.id} onClick={() => setDetail(m)}>
                    <td className="cell-main">{m.id}</td>
                    <td><div className="motor-cell"><img src={`/assets/${m.photo}`} alt={m.name} /><span>{m.name}<span className="cell-sub">{m.type} · {m.year}</span></span></div></td>
                    <td>{m.plate}</td>
                    <td>{m.branch}</td>
                    <td><Pill tone={toneForStatus(m.status)}>{m.status}</Pill></td>
                    <td className="money">{money(m.price)}</td>
                    <td>{m.days} hari</td>
                    <td className="money">{money(m.revenue)}</td>
                    <td><div className="util"><div className="chart-track"><div className="chart-fill" style={{ width: `${util}%` }} /></div><span>{util}%</span></div></td>
                    <td><button className="btn" type="button" onClick={e => { e.stopPropagation(); setDetail(m); }}><i className="bi bi-eye" /> Detail</button></td>
                  </tr>
                );
              }) : <tr><td colSpan="10"><Empty text="Tidak ada unit motor yang cocok dengan filter." /></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="table-footer"><span>Data contoh untuk desain admin; nilai akan berasal dari API Node.js + SQLite.</span><span>{filtered.length} unit ditampilkan · 4 cabang</span></div>
      </section>

      {detail && (
        <Modal
          title={<>Detail Unit <span style={{ color: 'var(--muted)' }}>{detail.id}</span></>}
          subtitle="Inventaris &amp; kinerja motor RYOKOU"
          onClose={() => setDetail(null)}
          footer={<><button className="btn" type="button" onClick={() => setDetail(null)}>Tutup</button><a className="btn primary" href="/motor"><i className="bi bi-pencil-square" /> Ubah Data Motor</a></>}
        >
          <div className="row-2">
            <img className="w-100" style={{ width: '100%', maxHeight: 210, objectFit: 'cover', borderRadius: 10 }} src={`/assets/${detail.photo}`} alt={detail.name} />
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}><h4 style={{ margin: 0 }}>{detail.name}</h4><Pill tone={toneForStatus(detail.status)}>{detail.status}</Pill></div>
              <dl className="kv">
                <dt>No. Polisi</dt><dd>{detail.plate}</dd>
                <dt>Cabang</dt><dd>{detail.branch}</dd>
                <dt>Tahun</dt><dd>{detail.year}</dd>
                <dt>Tarif / Hari</dt><dd>{money(detail.price)}</dd>
                <dt>Kondisi</dt><dd>{detail.condition}</dd>
              </dl>
            </div>
          </div>
          <div className="modal-stats" style={{ marginTop: 14 }}>
            <div><small>Hari Disewa</small><strong>{detail.days} hari</strong></div>
            <div><small>Pendapatan</small><strong>{money(detail.revenue)}</strong></div>
            <div><small>Servis Berikutnya</small><strong>{fmtDate(detail.nextService)}</strong></div>
          </div>
          {new Date(detail.nextService) < new Date(DEMO_NOW) && <div className="alert"><i className="bi bi-exclamation-triangle" /><span>Servis telah melewati jadwal. Segera jadwalkan perawatan dan ubah status unit menjadi Perbaikan.</span></div>}
          <h3 className="section-title"><i className="bi bi-calendar2-check" /> Riwayat Perawatan</h3>
          <dl className="kv"><dt>Servis Terakhir</dt><dd>{fmtDate(detail.lastService)}</dd><dt>Servis Berikutnya</dt><dd>{fmtDate(detail.nextService)}</dd></dl>
          <h3 className="section-title"><i className="bi bi-clock-history" /> Penyewaan Terkait</h3>
          {rentals.filter(r => r.plate === detail.plate).slice(0, 4).map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', padding: '6px 0', fontSize: 9 }}>
              <span>{r.id} · {fmtDate(r.start)}</span><span>{money(r.total)} · {r.status}</span>
            </div>
          ))}
          {!rentals.some(r => r.plate === detail.plate) && <p className="cell-sub">Belum ada riwayat penyewaan pada periode ini.</p>}
        </Modal>
      )}
      <Toast message={message} />
    </main>
  );
}
