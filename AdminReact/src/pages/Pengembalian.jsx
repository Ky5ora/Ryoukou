import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { BRANCHES, DEMO_NOW } from '../data/seed';
import { downloadCsv, fmtDate, fmtDateTime, hitungDenda, money, toneForStatus } from '../utils/format';
import { Empty, Pill, SectionTitle, Stat, Toast } from '../components/Ui';

const PHOTO_LABELS = ['Tampak Depan', 'Tampak Belakang', 'Samping Kiri', 'Samping Kanan'];
const CHIPS = [
  ['', 'Semua'], ['Terjadwal', 'Terjadwal'], ['Menunggu Pemeriksaan', 'Menunggu Pemeriksaan'],
  ['Terlambat', 'Terlambat'], ['Selesai', 'Selesai']
];

export default function Pengembalian() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [branch, setBranch] = useState('');
  const [chip, setChip] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({});
  const [photos, setPhotos] = useState([null, null, null, null]);
  const [docs, setDocs] = useState({ surat: false, bukti: false });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getReturns().then(data => {
      setRows(data);
      if (data[0]) { setSelectedId(data[0].id); setForm(makeForm(data[0])); }
    });
  }, []);

  function makeForm(r) {
    return {
      ...r,
      returnAt: r.returnAt || '', proxy: false, proxyName: '', proxyRelation: '',
      condition: 'Baik', note: '', odometer: '', fuel: 'Sesuai saat penyerahan',
      damageFine: 0, regionFine: false, repairApproval: false
    };
  }

  const notify = text => { setMessage(text); window.setTimeout(() => setMessage(''), 3200); };
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const activeStatus = chip || status;
    return rows.filter(r => {
      const overdue = new Date(r.deadline) < new Date(DEMO_NOW) && r.status !== 'Selesai';
      return (!q || [r.id, r.customer, r.motor, r.plate, r.phone].some(v => String(v).toLowerCase().includes(q)))
        && (!branch || r.branch === branch)
        && (!activeStatus || (activeStatus === 'Terlambat' ? overdue : r.status === activeStatus));
    });
  }, [rows, search, status, branch, chip]);

  const stats = {
    today: rows.filter(r => fmtDate(r.deadline) === fmtDate(DEMO_NOW)).length,
    waiting: rows.filter(r => r.status === 'Menunggu Pemeriksaan').length,
    late: rows.filter(r => new Date(r.deadline) < new Date(DEMO_NOW) && r.status !== 'Selesai').length,
    done: rows.filter(r => r.status === 'Selesai').length
  };
  const denda = hitungDenda(form.deadline, form.returnAt, form.lateRate, form.regionFine, form.damageFine);

  function selectRow(r) {
    setSelectedId(r.id);
    setForm(makeForm(r));
    setPhotos([null, null, null, null]);
    setDocs({ surat: false, bukti: false });
  }

  function handlePhoto(index, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotos(prev => prev.map((p, i) => i === index ? URL.createObjectURL(file) : p));
  }

  async function saveDraft() {
    if (!selectedId) return notify('Pilih transaksi pengembalian terlebih dahulu.');
    const payload = { ...form, id: selectedId };
    await api.saveReturnDraft(payload);
    setRows(prev => prev.map(r => r.id === selectedId ? { ...r, ...payload, status: r.status } : r));
    notify(`Draft ${selectedId} tersimpan di demo SQLite.`);
  }

  async function complete() {
    if (!selectedId) return notify('Pilih transaksi pengembalian terlebih dahulu.');
    const missing = [];
    if (!form.returnAt) missing.push('waktu pengembalian aktual');
    photos.forEach((p, i) => { if (!p) missing.push(PHOTO_LABELS[i]); });
    if (form.proxy) {
      if (!form.proxyName?.trim()) missing.push('nama penerima kuasa');
      if (!form.proxyRelation?.trim()) missing.push('hubungan penerima kuasa');
      if (!docs.surat) missing.push('surat pertanggungjawaban');
      if (!docs.bukti) missing.push('bukti ketidakhadiran penyewa');
    }
    if (missing.length) return notify('Lengkapi: ' + missing.join(', ') + '.');

    const payload = { ...form, id: selectedId, totalDenda: denda.total, grandTotal: Number(form.rentTotal) + denda.total };
    await api.completeReturn(payload);
    setRows(prev => prev.map(r => r.id === selectedId ? { ...r, ...payload, status: 'Selesai' } : r));
    notify(`Pengembalian ${selectedId} selesai. Status motor diperbarui.`);
  }

  return (
    <main className="content">
      <p className="breadcrumb-line"><a href="/dashboard">Dashboard</a> › Operasional › Pengembalian</p>
      <div className="heading">
        <div><h1><i className="bi bi-arrow-return-left" style={{ color: 'var(--teal)' }} /> Pengembalian Motor</h1><p>Periksa kondisi unit, verifikasi pihak pengembalian, hitung denda, dan tutup transaksi.</p></div>
        <div className="heading-actions">
          <a className="btn" href="/transaksi"><i className="bi bi-arrow-left" /> Kelola Transaksi</a>
          <button className="btn" type="button" onClick={() => downloadCsv('pengembalian-ryokou.csv', ['ID', 'Pelanggan', 'Motor', 'Cabang', 'Jadwal', 'Status'], filtered.map(r => [r.id, r.customer, r.motor, r.branch, fmtDateTime(r.deadline), r.status]))}><i className="bi bi-download" /> Ekspor Daftar</button>
        </div>
      </div>

      <div className="grid-4">
        <Stat icon="bi-calendar-check" tone="gold" value={stats.today} label="Jadwal Hari Ini" hint="Berdasarkan jadwal sewa" />
        <Stat icon="bi-hourglass-split" tone="blue" value={stats.waiting} label="Menunggu Pemeriksaan" hint="Perlu tindak lanjut" />
        <Stat icon="bi-exclamation-triangle" tone="red" value={stats.late} label="Terlambat" hint="Denda otomatis berjalan" />
        <Stat icon="bi-check2-circle" tone="green" value={stats.done} label="Selesai Dikembalikan" hint="Siap disewakan lagi" />
      </div>

      <section className="card" style={{ marginBottom: 16 }}>
        <div className="card-title"><div><h2>Antrean Pengembalian</h2><p>Klik baris untuk membuka formulir pemeriksaan.</p></div><Pill tone="blue">4 Cabang RYOKOU</Pill></div>
        <div className="toolbar">
          <div className="search"><i className="bi bi-search" /><input className="input" type="search" placeholder="Cari ID, nama, atau no. polisi..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <select className="select" value={status} onChange={e => { setStatus(e.target.value); setChip(''); }} aria-label="Filter status"><option value="">Semua Status</option><option>Terjadwal</option><option>Menunggu Pemeriksaan</option><option>Dalam Pemeriksaan</option><option>Terlambat</option><option>Selesai</option></select>
          <select className="select" value={branch} onChange={e => setBranch(e.target.value)} aria-label="Filter cabang"><option value="">Semua Cabang</option>{BRANCHES.map(b => <option key={b}>{b}</option>)}</select>
          <span className="count">Menampilkan {filtered.length} dari {rows.length} data</span>
        </div>
        <div className="chips">{CHIPS.map(([value, label]) => <button key={label} type="button" className={`chip ${chip === value ? 'active' : ''}`} onClick={() => { setChip(value); setStatus(''); }}>{label}</button>)}</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID Transaksi</th><th>Pelanggan</th><th>Unit Motor</th><th>Cabang</th><th>Jadwal Kembali</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {filtered.length ? filtered.map(r => {
                const overdue = new Date(r.deadline) < new Date(DEMO_NOW) && r.status !== 'Selesai';
                return (
                  <tr key={r.id} className={`${selectedId === r.id ? 'selected' : ''} ${overdue ? 'overdue' : ''}`} onClick={() => selectRow(r)}>
                    <td className="cell-main">{r.id}</td>
                    <td>{r.customer}<span className="cell-sub">{r.phone}</span></td>
                    <td>{r.motor}<span className="cell-sub">{r.plate}</span></td>
                    <td>{r.branch}</td>
                    <td>{fmtDateTime(r.deadline)}</td>
                    <td>{overdue ? <span className="late"><i className="bi bi-exclamation-triangle" /> Terlambat</span> : <Pill tone={toneForStatus(r.status)}>{r.status}</Pill>}</td>
                    <td><button className="btn" type="button" onClick={e => { e.stopPropagation(); selectRow(r); }}><i className="bi bi-arrow-right" /> Proses</button></td>
                  </tr>
                );
              }) : <tr><td colSpan="7"><Empty text="Tidak ada pengembalian yang cocok dengan filter." /></td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <div className="split">
        <div className="stack">
          <section className="card">
            <div className="card-title"><div><h2>Detail Penyewaan</h2><p>Dasar perhitungan tagihan akhir.</p></div><Pill tone={toneForStatus(form.status)}>{form.status || '—'}</Pill></div>
            <SectionTitle icon="bi-person-circle" step="Langkah 1">Data Penyewa</SectionTitle>
            <dl className="kv">
              <dt>ID Penyewaan</dt><dd>{form.id || '—'}</dd>
              <dt>Nama Penyewa</dt><dd>{form.customer || '—'}</dd>
              <dt>No. HP</dt><dd>{form.phone || '—'}</dd>
              <dt>Jaminan Identitas</dt><dd>{form.guarantee || '—'}</dd>
            </dl>
            <div className="alert info"><i className="bi bi-shield-check" /><span>Verifikasi jaminan fisik (KTP/SIM) sebelum unit diserahkan kembali. Jaminan tidak disimpan digital.</span></div>
            <SectionTitle icon="bi-scooter" step="Langkah 2">Unit &amp; Waktu Sewa</SectionTitle>
            <dl className="kv">
              <dt>Unit Motor</dt><dd>{form.motor || '—'}</dd>
              <dt>No. Polisi</dt><dd>{form.plate || '—'}</dd>
              <dt>Cabang</dt><dd>{form.branch || '—'}</dd>
              <dt>Periode Sewa</dt><dd>{fmtDateTime(form.start)} – {fmtDateTime(form.deadline)}</dd>
              <dt>Lokasi Pengembalian</dt><dd>{form.location || '—'}</dd>
              <dt>Total Sewa</dt><dd>{money(form.rentTotal)}</dd>
              <dt>Tarif Denda / Jam</dt><dd>{money(form.lateRate)} / jam</dd>
            </dl>
          </section>

          <section className="card">
            <div className="card-title"><div><h2>Pemeriksaan Pengembalian</h2><p>Lengkapi seluruh langkah sebelum transaksi ditutup.</p></div></div>
            <SectionTitle icon="bi-clock-history">1. Waktu Pengembalian</SectionTitle>
            <div className="row-2">
              <div><label className="label">Jadwal Pengembalian</label><input className="input" type="datetime-local" value={form.deadline || ''} readOnly /></div>
              <div><label className="label">Waktu Pengembalian Aktual *</label><input className="input" type="datetime-local" value={form.returnAt || ''} onChange={e => update('returnAt', e.target.value)} /></div>
            </div>
            <div className="alert"><i className="bi bi-info-circle" /><span>{denda.hours ? <>Keterlambatan <b>{denda.hours} jam</b> × {money(form.lateRate)} = <b>{money(denda.keterlambatan)}</b>. Denda otomatis mengikuti tarif unit.</> : 'Belum ada keterlambatan. Isi waktu pengembalian aktual untuk menghitung denda.'}</span></div>

            <SectionTitle icon="bi-person-badge">2. Pihak yang Mengembalikan</SectionTitle>
            <label className="btn" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }}><input type="radio" checked={!form.proxy} onChange={() => update('proxy', false)} /> <span style={{ marginLeft: 8 }}><strong>Penyewa sendiri</strong><span className="cell-sub">Identitas sesuai data pesanan.</span></span></label>
            <label className="btn" style={{ display: 'flex', justifyContent: 'flex-start' }}><input type="radio" checked={!!form.proxy} onChange={() => update('proxy', true)} /> <span style={{ marginLeft: 8 }}><strong>Diwakilkan</strong><span className="cell-sub">Wajib surat pertanggungjawaban + bukti ketidakhadiran.</span></span></label>
            {form.proxy && (
              <div className="subform" style={{ marginTop: 10 }}>
                <div className="row-2">
                  <div><label className="label">Nama Penerima Kuasa *</label><input className="input" value={form.proxyName || ''} onChange={e => update('proxyName', e.target.value)} placeholder="Nama lengkap" /></div>
                  <div><label className="label">Hubungan dengan Penyewa *</label><input className="input" value={form.proxyRelation || ''} onChange={e => update('proxyRelation', e.target.value)} placeholder="Contoh: teman" /></div>
                </div>
                <div className="row-2" style={{ marginTop: 9 }}>
                  <div><label className="label">Surat Pertanggungjawaban *</label><input className="input" type="file" accept="image/*,.pdf" onChange={() => setDocs(d => ({ ...d, surat: true }))} /></div>
                  <div><label className="label">Bukti Penyewa Tidak Hadir *</label><input className="input" type="file" accept="image/*,.pdf" onChange={() => setDocs(d => ({ ...d, bukti: true }))} /></div>
                </div>
              </div>
            )}

            <SectionTitle icon="bi-images" step="4 sisi wajib">3. Foto Kondisi Motor</SectionTitle>
            <div className="photo-grid">
              {PHOTO_LABELS.map((label, i) => (
                <label key={label} className={`photo-tile ${photos[i] ? 'has-image' : ''}`}>
                  <input type="file" accept="image/*" onChange={e => handlePhoto(i, e)} />
                  <span className="ph"><i className="bi bi-camera" /></span>
                  {photos[i] && <img src={photos[i]} alt={`Pratinjau ${label}`} />}
                  <span className="ph-label">{label}</span>
                </label>
              ))}
            </div>

            <SectionTitle icon="bi-clipboard2-check">4. Kondisi &amp; Catatan</SectionTitle>
            <div className="row-3">
              <div><label className="label">Kondisi Unit</label><select className="select" value={form.condition || 'Baik'} onChange={e => update('condition', e.target.value)}><option>Baik</option><option>Perlu Pemeriksaan</option><option>Rusak</option></select></div>
              <div><label className="label">Kilometer Akhir</label><input className="input" type="number" value={form.odometer || ''} onChange={e => update('odometer', e.target.value)} placeholder="Contoh: 12480" /></div>
              <div><label className="label">Kadar BBM</label><select className="select" value={form.fuel || 'Sesuai saat penyerahan'} onChange={e => update('fuel', e.target.value)}><option>Sesuai saat penyerahan</option><option>Kurang</option><option>Hampir habis</option></select></div>
            </div>
            <label className="label" style={{ marginTop: 10 }}>Catatan Pemeriksaan</label>
            <textarea className="textarea" rows="2" value={form.note || ''} onChange={e => update('note', e.target.value)} placeholder="Contoh: bodi depan tergores..." />
            <div className="action-bar">
              <button className="btn" type="button" onClick={() => { setForm(makeForm(rows.find(r => r.id === selectedId) || {})); setPhotos([null, null, null, null]); }}><i className="bi bi-arrow-counterclockwise" /> Atur Ulang</button>
              <button className="btn" type="button" onClick={saveDraft}><i className="bi bi-save" /> Simpan Draft</button>
              <button className="btn primary" type="button" onClick={complete}><i className="bi bi-check2" /> Selesaikan Pengembalian</button>
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="card">
            <div className="card-title"><div><h2>Rincian Denda</h2><p>Dihitung otomatis kecuali kerusakan unit.</p></div><Pill tone="green">Tagihan Akhir</Pill></div>
            <div className="fine-row"><label>Keterlambatan<span className="fine-hint">{denda.hours} jam</span></label><span className="money">{money(denda.keterlambatan)}</span></div>
            <div className="fine-row"><label><input type="checkbox" checked={!!form.regionFine} onChange={e => update('regionFine', e.target.checked)} /> Pelanggaran wilayah<span className="fine-hint">Wilayah aman: Malang–Batu</span></label><span className="money">{money(denda.wilayah)}</span></div>
            <div className="fine-row"><label>Kerusakan unit<span className="fine-hint">Input manual admin</span></label><input className="input" type="number" min="0" value={form.damageFine || 0} onChange={e => update('damageFine', Number(e.target.value))} /></div>
            <label className="label">Perkiraan Biaya / Catatan Kerusakan</label>
            <textarea className="textarea" rows="2" placeholder="Contoh: penggantian spion Rp 85.000" />
            <label style={{ display: 'flex', gap: 7, alignItems: 'center', margin: '10px 0', fontSize: 10, fontWeight: 700 }}><input type="checkbox" checked={!!form.repairApproval} onChange={e => update('repairApproval', e.target.checked)} /> Penyewa diperkenankan memperbaiki sendiri (persetujuan admin)</label>
            <div className="total-box"><span>Total Denda</span><strong>{money(denda.total)}</strong></div>
            <div className="total-box muted"><span>Total Sewa + Denda</span><strong>{money(Number(form.rentTotal || 0) + denda.total)}</strong></div>
          </section>

          <section className="card">
            <div className="card-title"><div><h2>Alur Pengembalian</h2><p>Status berjalan sesuai tahapan.</p></div></div>
            <ul className="timeline">
              <li className="done"><strong>Penjemputan unit</strong><span>Admin menjemput di lokasi disepakati</span></li>
              <li className="done"><strong>Verifikasi pihak pengembalian</strong><span>Penyewa / penerima kuasa</span></li>
              <li className="current"><strong>Pemeriksaan 4 sisi &amp; denda</strong><span>Foto, kondisi, keterlambatan, wilayah, kerusakan</span></li>
              <li><strong>Penyelesaian tagihan</strong><span>Invoice final &amp; bukti bayar</span></li>
              <li><strong>Status motor diperbarui</strong><span>Tersedia atau Perbaikan</span></li>
            </ul>
          </section>

          <section className="card">
            <div className="card-title"><div><h2>Kebijakan Pengembalian</h2><p>Rujukan perhitungan denda RYOKOU.</p></div></div>
            <ul className="note-list">
              <li>Denda keterlambatan = tarif per jam × jam keterlambatan (dibulatkan ke atas).</li>
              <li>Pelanggaran wilayah aman Malang–Batu: <b>Rp 300.000,00</b>.</li>
              <li>Kerusakan unit diganti sesuai perkiraan biaya admin, atau diperbaiki sendiri dengan persetujuan.</li>
              <li>Pengembalian diwakilkan wajib surat pertanggungjawaban + bukti ketidakhadiran.</li>
              <li>Jaminan KTP/SIM fisik dikembalikan setelah tagihan lunas.</li>
            </ul>
            <div className="action-bar"><a className="btn primary" href="/invoice"><i className="bi bi-receipt" /> Lihat Invoice</a></div>
          </section>
        </div>
      </div>
      <Toast message={message} />
    </main>
  );
}
