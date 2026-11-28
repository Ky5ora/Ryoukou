/* RYOKOU Admin -interaksi halaman Pengembalian, Riwayat Penyewaan, dan Laporan Data Motor.
   Catatan: ini masih front-end demo. Data contoh disimpan sementara di localStorage. */
(() => {
  'use strict';

  const DEMO_NOW = new Date('2026-11-25T19:00:00');
  const LS_RETURN = 'ryokouAdminReturns_v1';
  const LS_RENTAL = 'ryokouAdminRentals_v1';
  const LS_MOTOR = 'ryokouAdminMotors_v1';

  const money = n => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const fmtDateTime = v => {
    if (!v) return '—';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}.${pad(d.getMinutes())}`;
  };
  const fmtDate = v => { const d = new Date(v); return Number.isNaN(d.getTime()) ? '—' : `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; };
  const readLS = (key, fallback) => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } };
  const writeLS = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage penuh / private mode */ } };
  const toast = message => {
    const el = document.getElementById('rpToast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(el._rpTimer);
    el._rpTimer = setTimeout(() => el.classList.remove('show'), 3200);
  };
  const pill = (text, tone) => `<span class="rp-pill ${tone}">${esc(text)}</span>`;
  const toneForStatus = status => ({
    'Terjadwal': 'blue', 'Menunggu Pemeriksaan': 'gold', 'Dalam Pemeriksaan': 'blue',
    'Selesai': 'green', 'Terlambat': 'red', 'Dibatalkan': 'red', 'Dalam Penyewaan': 'gold',
    'Menunggu Verifikasi': 'gold', 'Tersedia': 'green', 'Disewa': 'gold', 'Perbaikan': 'red',
    'Lunas': 'green', 'Belum Lunas': 'gold'
  }[status] || 'gray');
  const csv = (filename, header, rows) => {
    const sep = '\u0001';
    const lines = [header.join(sep), ...rows.map(r => r.map(v => String(v ?? '').replace(/\t|\n/g, ' ')).join(sep))];
    const blob = new Blob(['\ufeff' + lines.join('\n').replaceAll(sep, ';')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast('Laporan berhasil diunduh (' + filename + ')');
  };

  /* ---------- DATA CONTOH ---------- */
  const returnsSeed = [
    { id: 'TRX-011', customer: 'Rizky Pratama', phone: '0812-3344-5566', motor: 'Honda Scoopy', plate: 'N 2234 AB', branch: 'Batu · Sarimun', start: '2026-11-23T16:00', deadline: '2026-11-25T16:00', returnAt: '2026-11-25T18:30', location: 'Jl. Sarimun No. 8, Batu', guarantee: 'KTP asli ditahan', rentTotal: 180000, lateRate: 10000, status: 'Menunggu Pemeriksaan', payment: 'Lunas' },
    { id: 'TRX-012', customer: 'Valentina Alexsandra', phone: '0811-2345-6789', motor: 'Honda Beat Deluxe', plate: 'N 1234 KZ', branch: 'Malang · Lowokwaru', start: '2026-11-24T09:00', deadline: '2026-11-25T09:00', returnAt: '', location: 'Rental RYOKOU Malang', guarantee: 'SIM C ditahan', rentTotal: 83000, lateRate: 10000, status: 'Terjadwal', payment: 'Lunas' },
    { id: 'TRX-013', customer: 'Nadia Putri', phone: '0857-9911-2233', motor: 'Honda Vario 125', plate: 'N 3234 CD', branch: 'Batu · Diponegoro', start: '2026-11-24T11:00', deadline: '2026-11-26T11:00', returnAt: '', location: 'Jl. Diponegoro No. 21, Batu', guarantee: 'KTP asli ditahan', rentTotal: 95000, lateRate: 12000, status: 'Terjadwal', payment: 'Lunas' },
    { id: 'TRX-014', customer: 'Fajar Ramadhan', phone: '0821-4455-6677', motor: 'Yamaha NMAX', plate: 'N 4421 MN', branch: 'Malang · Klojen', start: '2026-11-22T08:00', deadline: '2026-11-25T08:00', returnAt: '2026-11-25T11:00', location: 'Rental RYOKOU Klojen', guarantee: 'KTP + SIM ditahan', rentTotal: 250000, lateRate: 20000, status: 'Dalam Pemeriksaan', payment: 'Lunas' },
    { id: 'TRX-015', customer: 'Dewi Kartika', phone: '0813-2211-8899', motor: 'Honda Beat Street', plate: 'N 5512 KP', branch: 'Malang · Lowokwaru', start: '2026-11-21T10:00', deadline: '2026-11-24T10:00', returnAt: '2026-11-24T10:20', location: 'Rental RYOKOU Malang', guarantee: 'KTP asli ditahan', rentTotal: 166000, lateRate: 10000, status: 'Selesai', payment: 'Lunas' }
  ];

  const rentalsSeed = [
    { id: 'TRX-004', customer: 'Valentina Alexsandra', phone: '0811-2345-6789', motor: 'Honda Beat Deluxe', plate: 'N 1234 KZ', branch: 'Malang · Lowokwaru', start: '2026-11-18T09:00', end: '2026-11-20T09:00', days: 2, total: 166000, fine: 0, status: 'Selesai', payment: 'Lunas' },
    { id: 'TRX-009', customer: 'Rizky Pratama', phone: '0812-3344-5566', motor: 'Honda Scoopy', plate: 'N 2234 AB', branch: 'Batu · Sarimun', start: '2026-11-16T10:00', end: '2026-11-17T10:00', days: 1, total: 90000, fine: 0, status: 'Selesai', payment: 'Lunas' },
    { id: 'TRX-005', customer: 'Nadia Putri', phone: '0857-9911-2233', motor: 'Honda Vario 125', plate: 'N 3234 CD', branch: 'Batu · Diponegoro', start: '2026-11-15T08:00', end: '2026-11-16T08:00', days: 1, total: 95000, fine: 0, status: 'Dibatalkan', payment: 'Belum Lunas' },
    { id: 'TRX-010', customer: 'Fajar Ramadhan', phone: '0821-4455-6677', motor: 'Yamaha NMAX', plate: 'N 4421 MN', branch: 'Malang · Klojen', start: '2026-11-12T08:00', end: '2026-11-14T08:00', days: 2, total: 250000, fine: 40000, status: 'Selesai', payment: 'Lunas' },
    { id: 'TRX-011', customer: 'Rizky Pratama', phone: '0812-3344-5566', motor: 'Honda Scoopy', plate: 'N 2234 AB', branch: 'Batu · Sarimun', start: '2026-11-23T16:00', end: '2026-11-25T16:00', days: 2, total: 180000, fine: 0, status: 'Dalam Penyewaan', payment: 'Lunas' },
    { id: 'TRX-012', customer: 'Valentina Alexsandra', phone: '0811-2345-6789', motor: 'Honda Beat Deluxe', plate: 'N 1234 KZ', branch: 'Malang · Lowokwaru', start: '2026-11-24T09:00', end: '2026-11-25T09:00', days: 1, total: 83000, fine: 0, status: 'Menunggu Verifikasi', payment: 'Belum Lunas' },
    { id: 'TRX-013', customer: 'Nadia Putri', phone: '0857-9911-2233', motor: 'Honda Vario 125', plate: 'N 3234 CD', branch: 'Batu · Diponegoro', start: '2026-11-24T11:00', end: '2026-11-26T11:00', days: 2, total: 190000, fine: 0, status: 'Dalam Penyewaan', payment: 'Lunas' },
    { id: 'TRX-014', customer: 'Fajar Ramadhan', phone: '0821-4455-6677', motor: 'Yamaha NMAX', plate: 'N 4421 MN', branch: 'Malang · Klojen', start: '2026-11-22T08:00', end: '2026-11-25T08:00', days: 3, total: 375000, fine: 60000, status: 'Dalam Penyewaan', payment: 'Lunas' },
    { id: 'TRX-015', customer: 'Dewi Kartika', phone: '0813-2211-8899', motor: 'Honda Beat Street', plate: 'N 5512 KP', branch: 'Malang · Lowokwaru', start: '2026-11-21T10:00', end: '2026-11-24T10:00', days: 3, total: 249000, fine: 20000, status: 'Selesai', payment: 'Lunas' },
    { id: 'TRX-016', customer: 'Budi Santoso', phone: '0812-8888-7777', motor: 'Honda Beat', plate: 'N 6610 BS', branch: 'Batu · Sarimun', start: '2026-11-10T07:00', end: '2026-11-12T07:00', days: 2, total: 140000, fine: 300000, status: 'Selesai', payment: 'Lunas' }
  ];

  const motorsSeed = [
    { id: 'MTR-001', name: 'Honda Beat Deluxe', brand: 'Honda', type: 'Beat Deluxe', plate: 'N 1234 KZ', year: 2024, branch: 'Malang · Lowokwaru', status: 'Tersedia', price: 83000, days: 12, revenue: 996000, condition: 'Baik', lastService: '2026-10-12', nextService: '2026-12-12', photo: 'beat-biru.png' },
    { id: 'MTR-002', name: 'Honda Scoopy', brand: 'Honda', type: 'Scoopy', plate: 'N 2234 AB', year: 2023, branch: 'Batu · Sarimun', status: 'Disewa', price: 90000, days: 15, revenue: 1350000, condition: 'Baik', lastService: '2026-09-28', nextService: '2026-11-28', photo: 'scoopy-krem.png' },
    { id: 'MTR-003', name: 'Honda Vario 125', brand: 'Honda', type: 'Vario 125', plate: 'N 3234 CD', year: 2024, branch: 'Batu · Diponegoro', status: 'Perbaikan', price: 95000, days: 8, revenue: 760000, condition: 'Rusak ringan', lastService: '2026-11-20', nextService: '2026-12-20', photo: 'vario-hitam.png' },
    { id: 'MTR-004', name: 'Yamaha NMAX', brand: 'Yamaha', type: 'NMAX 155', plate: 'N 4421 MN', year: 2025, branch: 'Malang · Klojen', status: 'Disewa', price: 125000, days: 18, revenue: 2250000, condition: 'Baik', lastService: '2026-10-05', nextService: '2026-12-05', photo: 'motor-trail.png' },
    { id: 'MTR-005', name: 'Honda Beat Street', brand: 'Honda', type: 'Beat Street', plate: 'N 5512 KP', year: 2023, branch: 'Malang · Lowokwaru', status: 'Tersedia', price: 83000, days: 10, revenue: 830000, condition: 'Baik', lastService: '2026-08-15', nextService: '2026-10-15', photo: 'beat-merah.png' },
    { id: 'MTR-006', name: 'Honda Beat', brand: 'Honda', type: 'Beat', plate: 'N 6610 BS', year: 2022, branch: 'Batu · Sarimun', status: 'Tersedia', price: 70000, days: 21, revenue: 1470000, condition: 'Perlu pemeriksaan', lastService: '2026-11-02', nextService: '2027-01-02', photo: 'beat-putih.png' },
    { id: 'MTR-007', name: 'Honda Vario 160', brand: 'Honda', type: 'Vario 160', plate: 'N 7718 VQ', year: 2025, branch: 'Batu · Diponegoro', status: 'Tersedia', price: 110000, days: 6, revenue: 660000, condition: 'Baik', lastService: '2026-11-11', nextService: '2027-01-11', photo: 'vario-merah.png' },
    { id: 'MTR-008', name: 'Honda Beat Krem', brand: 'Honda', type: 'Beat', plate: 'N 8890 KR', year: 2023, branch: 'Malang · Klojen', status: 'Perbaikan', price: 75000, days: 9, revenue: 675000, condition: 'Rusak', lastService: '2026-11-22', nextService: '2026-12-22', photo: 'beat-krem.png' }
  ];

  const returns = readLS(LS_RETURN, returnsSeed);
  const rentals = readLS(LS_RENTAL, rentalsSeed);
  const motors = readLS(LS_MOTOR, motorsSeed);

  /* ================= PENGEMBALIAN ================= */
  function lateInfo(deadline, actual, rate) {
    if (!deadline || !actual) return { hours: 0, amount: 0 };
    const diff = new Date(actual).getTime() - new Date(deadline).getTime();
    if (!Number.isFinite(diff) || diff <= 0) return { hours: 0, amount: 0 };
    const hours = Math.ceil(diff / 3600000);
    return { hours, amount: hours * Number(rate || 0) };
  }

  function initPengembalian() {
    const tbody = document.getElementById('rpReturnRows');
    const search = document.getElementById('rpReturnSearch');
    const statusFilter = document.getElementById('rpReturnStatus');
    const branchFilter = document.getElementById('rpReturnBranch');
    const chips = document.querySelectorAll('[data-return-chip]');
    let filterStatus = '';
    let selectedId = null;
    let draft = {};

    const filtered = () => {
      const q = (search?.value || '').trim().toLowerCase();
      const branch = branchFilter?.value || '';
      const status = filterStatus || statusFilter?.value || '';
      return returns.filter(r => {
        const matchQ = !q || [r.id, r.customer, r.motor, r.plate, r.phone].some(v => String(v).toLowerCase().includes(q));
        const matchBranch = !branch || r.branch === branch;
        const overdue = new Date(r.deadline) < DEMO_NOW && r.status !== 'Selesai';
        const matchStatus = !status || (status === 'Terlambat' ? overdue : r.status === status);
        return matchQ && matchBranch && matchStatus;
      });
    };

    function renderTable() {
      const rows = filtered();
      if (!tbody) return;
      tbody.innerHTML = rows.length ? rows.map(r => {
        const overdue = new Date(r.deadline) < DEMO_NOW && r.status !== 'Selesai';
        return `<tr data-id="${esc(r.id)}" class="${selectedId === r.id ? 'rp-selected' : ''} ${overdue ? 'rp-overdue' : ''}">
          <td class="rp-cell-main">${esc(r.id)}</td>
          <td>${esc(r.customer)}<span class="rp-cell-sub">${esc(r.phone)}</span></td>
          <td>${esc(r.motor)}<span class="rp-cell-sub">${esc(r.plate)}</span></td>
          <td>${esc(r.branch)}</td>
          <td>${fmtDateTime(r.deadline)}</td>
          <td>${overdue ? '<span class="rp-late"><i class="bi bi-exclamation-triangle"></i> Terlambat</span>' : pill(r.status, toneForStatus(r.status))}</td>
          <td><button type="button" class="workflow-btn" data-open-return="${esc(r.id)}"><i class="bi bi-arrow-right"></i> Proses</button></td>
        </tr>`;
      }).join('') : `<tr><td colspan="7"><div class="rp-empty"><i class="bi bi-inbox"></i>Tidak ada pengembalian yang cocok dengan filter.</div></td></tr>`;
      const info = document.getElementById('rpReturnInfo');
      if (info) info.textContent = `Menampilkan ${rows.length} dari ${returns.length} data pengembalian`;
    }

    function renderStats() {
      const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
      set('rpReturnToday', returns.filter(r => fmtDate(r.deadline) === fmtDate(DEMO_NOW)).length);
      set('rpReturnWaiting', returns.filter(r => r.status === 'Menunggu Pemeriksaan').length);
      set('rpReturnLate', returns.filter(r => new Date(r.deadline) < DEMO_NOW && r.status !== 'Selesai').length);
      set('rpReturnDone', returns.filter(r => r.status === 'Selesai').length);
    }

    function renderDetail(r) {
      selectedId = r.id;
      draft = Object.assign({}, r, draft.id === r.id ? draft : {});
      const set = (sel, value) => { const el = document.querySelector(sel); if (el) el.value = value ?? ''; };
      const text = (key, value) => { document.querySelectorAll(`[data-return-field="${key}"]`).forEach(el => el.textContent = value ?? '—'); };

      text('id', r.id); text('customer', r.customer); text('phone', r.phone);
      text('motor', r.motor); text('plate', r.plate); text('branch', r.branch);
      text('location', r.location); text('guarantee', r.guarantee);
      text('rentTotal', money(r.rentTotal)); text('lateRate', money(r.lateRate) + ' / jam');
      text('period', `${fmtDateTime(r.start)} s.d. ${fmtDateTime(r.deadline)}`);
      text('pillStatus', r.status);
      const statusEl = document.getElementById('rpReturnStatusPill');
      if (statusEl) statusEl.className = 'rp-pill ' + toneForStatus(r.status);

      set('#returnDeadline', r.deadline);
      set('#returnActual', draft.returnAt || '');
      set('#returnCondition', draft.condition || 'Baik');
      set('#returnNote', draft.note || '');
      set('#fineDamage', draft.damageFine || 0);
      set('#fineRegion', '');
      document.getElementById('fineRegion') && (document.getElementById('fineRegion').checked = !!draft.regionFine);
      const selfRadio = document.getElementById('returnBySelf');
      const repRadio = document.getElementById('returnByProxy');
      if (selfRadio && repRadio) {
        const isProxy = !!draft.proxy;
        selfRadio.checked = !isProxy; repRadio.checked = isProxy;
        toggleProxy(isProxy);
      }
      set('#proxyName', draft.proxyName || ''); set('#proxyRelation', draft.proxyRelation || '');
      document.querySelectorAll('.rp-photo-tile').forEach(t => t.classList.remove('has-image'));
      updateFine();
    }

    function toggleProxy(isProxy) {
      const box = document.getElementById('rpProxyForm');
      if (box) box.classList.toggle('is-hidden', !isProxy);
    }

    function updateFine() {
      const r = returns.find(x => x.id === selectedId);
      if (!r) return;
      const deadline = document.getElementById('returnDeadline')?.value || r.deadline;
      const actual = document.getElementById('returnActual')?.value || '';
      const late = lateInfo(deadline, actual, r.lateRate);
      const region = document.getElementById('fineRegion')?.checked ? 300000 : 0;
      const damage = Math.max(0, Number(document.getElementById('fineDamage')?.value || 0));
      const totalFine = late.amount + region + damage;
      const setText = (key, value) => document.querySelectorAll(`[data-fine-field="${key}"]`).forEach(el => el.textContent = value);
      setText('hours', late.hours + ' jam');
      setText('late', money(late.amount));
      setText('region', money(region));
      setText('damage', money(damage));
      setText('fineTotal', money(totalFine));
      setText('grandTotal', money(r.rentTotal + totalFine));
      const info = document.getElementById('rpLateInfo');
      if (info) info.innerHTML = late.hours
        ? `<i class="bi bi-exclamation-triangle"></i><span>Keterlambatan <b>${late.hours} jam</b> × ${money(r.lateRate)} = <b>${money(late.amount)}</b>. Denda otomatis mengikuti tarif per jam unit.</span>`
        : `<i class="bi bi-info-circle"></i><span>Belum ada keterlambatan. Isi waktu pengembalian aktual untuk menghitung denda otomatis.</span>`;
    }

    function collectDraft() {
      if (!selectedId) return;
      Object.assign(draft, {
        returnAt: document.getElementById('returnActual')?.value || '',
        condition: document.getElementById('returnCondition')?.value || 'Baik',
        note: document.getElementById('returnNote')?.value || '',
        damageFine: Math.max(0, Number(document.getElementById('fineDamage')?.value || 0)),
        regionFine: !!document.getElementById('fineRegion')?.checked,
        proxy: !!document.getElementById('returnByProxy')?.checked,
        proxyName: document.getElementById('proxyName')?.value || '',
        proxyRelation: document.getElementById('proxyRelation')?.value || ''
      });
      const index = returns.findIndex(x => x.id === selectedId);
      if (index >= 0) {
        const safeDraft = Object.assign({}, draft);
        delete safeDraft.status; // status dikelola oleh alur selesai, bukan draft
        returns[index] = Object.assign({}, returns[index], safeDraft);
      }
      writeLS(LS_RETURN, returns);
    }

    function validateFinal() {
      const missing = [];
      if (!draft.returnAt) missing.push('waktu pengembalian aktual');
      if (!document.getElementById('returnActual')?.value) missing.push('waktu pengembalian aktual');
      const photos = document.querySelectorAll('.rp-photo-tile input[type=file]');
      photos.forEach((input, i) => { if (!input.files.length) missing.push(['foto depan', 'foto belakang', 'foto samping kiri', 'foto samping kanan'][i]); });
      if (draft.proxy) {
        if (!draft.proxyName.trim()) missing.push('nama penerima kuasa');
        if (!draft.proxyRelation.trim()) missing.push('hubungan penerima kuasa');
        const surat = document.getElementById('proxyLetter');
        const bukti = document.getElementById('proxyProof');
        if (surat && !surat.files.length) missing.push('surat pertanggungjawaban');
        if (bukti && !bukti.files.length) missing.push('bukti penyewa tidak hadir');
      }
      return missing;
    }

    [search, statusFilter, branchFilter].forEach(el => el?.addEventListener('input', renderTable));
    [statusFilter, branchFilter].forEach(el => el?.addEventListener('change', renderTable));
    chips.forEach(chip => chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active')); chip.classList.add('active');
      filterStatus = chip.dataset.returnChip || '';
      renderTable();
    }));
    tbody?.addEventListener('click', e => {
      const btn = e.target.closest('[data-open-return], tr[data-id]');
      const id = btn?.dataset.openReturn || btn?.dataset.id;
      const r = returns.find(x => x.id === id);
      if (r) { renderDetail(r); renderTable(); document.getElementById('rpReturnForm')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
    ['returnActual', 'returnDeadline', 'fineDamage'].forEach(id => document.getElementById(id)?.addEventListener('input', () => { updateFine(); collectDraft(); }));
    document.getElementById('fineRegion')?.addEventListener('change', () => { updateFine(); collectDraft(); });
    document.getElementById('returnBySelf')?.addEventListener('change', () => toggleProxy(false));
    document.getElementById('returnByProxy')?.addEventListener('change', () => toggleProxy(true));
    ['proxyName', 'proxyRelation', 'returnCondition', 'returnNote'].forEach(id => document.getElementById(id)?.addEventListener('input', collectDraft));
    document.querySelectorAll('.rp-photo-tile input[type=file]').forEach(input => input.addEventListener('change', () => {
      const tile = input.closest('.rp-photo-tile');
      const img = tile?.querySelector('img');
      if (input.files[0] && img) { img.src = URL.createObjectURL(input.files[0]); tile.classList.add('has-image'); }
    }));
    document.getElementById('saveReturnBtn')?.addEventListener('click', () => {
      if (!selectedId) return toast('Pilih transaksi pengembalian terlebih dahulu.');
      collectDraft();
      toast('Draft pemeriksaan ' + selectedId + ' tersimpan di browser.');
    });
    document.getElementById('finishReturnBtn')?.addEventListener('click', () => {
      if (!selectedId) return toast('Pilih transaksi pengembalian terlebih dahulu.');
      collectDraft();
      const missing = validateFinal();
      if (missing.length) return toast('Lengkapi: ' + missing.join(', ') + '.');
      const r = returns.find(x => x.id === selectedId);
      r.status = 'Selesai';
      writeLS(LS_RETURN, returns);
      renderTable(); renderStats();
      toast('Pengembalian ' + selectedId + ' selesai. Status motor diperbarui menjadi Tersedia.');
    });
    document.getElementById('resetReturnBtn')?.addEventListener('click', () => {
      draft = {}; if (selectedId) { const r = returns.find(x => x.id === selectedId); if (r) renderDetail(Object.assign({}, r, { returnAt: '' })); }
      toast('Form pemeriksaan diatur ulang.');
    });
    document.getElementById('rpReturnExport')?.addEventListener('click', () => csv('pengembalian-ryokou.csv', ['ID', 'Pelanggan', 'Motor', 'Cabang', 'Jadwal', 'Status'], filtered().map(r => [r.id, r.customer, r.motor, r.branch, fmtDateTime(r.deadline), r.status])));

    renderStats();
    if (returns[0]) renderDetail(returns[0]);
    renderTable();
  }

  /* ================= RIWAYAT PENYEWAAAN ================= */
  function initRiwayat() {
    const tbody = document.getElementById('rpHistoryRows');
    const search = document.getElementById('rpHistorySearch');
    const status = document.getElementById('rpHistoryStatus');
    const branch = document.getElementById('rpHistoryBranch');
    const from = document.getElementById('rpHistoryFrom');
    const to = document.getElementById('rpHistoryTo');
    const perPage = 5;
    let page = 1;
    let detailId = null;

    const filtered = () => {
      const q = (search?.value || '').trim().toLowerCase();
      const s = status?.value || '', b = branch?.value || '';
      const start = from?.value ? new Date(from.value + 'T00:00') : null;
      const end = to?.value ? new Date(to.value + 'T23:59') : null;
      return rentals.filter(r => {
        const d = new Date(r.start);
        return (!q || [r.id, r.customer, r.motor, r.plate, r.phone].some(v => String(v).toLowerCase().includes(q)))
          && (!s || r.status === s) && (!b || r.branch === b)
          && (!start || d >= start) && (!end || d <= end);
      });
    };

    function renderStats() {
      const done = rentals.filter(r => r.status === 'Selesai');
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set('rpHistoryTotal', rentals.length);
      set('rpHistoryDone', done.length);
      set('rpHistoryCancel', rentals.filter(r => r.status === 'Dibatalkan').length);
      set('rpHistoryRevenue', money(done.reduce((a, r) => a + Number(r.total || 0) + Number(r.fine || 0), 0)));
      set('rpHistoryFine', money(rentals.reduce((a, r) => a + Number(r.fine || 0), 0)));
    }

    function renderTable() {
      const rows = filtered();
      const pages = Math.max(1, Math.ceil(rows.length / perPage));
      page = Math.min(page, pages);
      const slice = rows.slice((page - 1) * perPage, page * perPage);
      if (tbody) tbody.innerHTML = slice.length ? slice.map(r => `<tr data-id="${esc(r.id)}">
        <td class="rp-cell-main">${esc(r.id)}</td>
        <td>${esc(r.customer)}<span class="rp-cell-sub">${esc(r.phone)}</span></td>
        <td>${esc(r.motor)}<span class="rp-cell-sub">${esc(r.plate)} · ${esc(r.branch)}</span></td>
        <td>${fmtDate(r.start)} – ${fmtDate(r.end)}<span class="rp-cell-sub">${r.days} hari</span></td>
        <td class="rp-money">${money(r.total)}</td>
        <td>${r.fine ? '<span class="rp-late">' + money(r.fine) + '</span>' : '—'}</td>
        <td>${pill(r.status, toneForStatus(r.status))}<span class="rp-cell-sub">${pill(r.payment, toneForStatus(r.payment))}</span></td>
        <td><button type="button" class="workflow-btn" data-detail="${esc(r.id)}"><i class="bi bi-eye"></i> Detail</button> ${r.status === 'Selesai' ? `<a class="workflow-btn" href="invoice.html"><i class="bi bi-receipt"></i> Invoice</a>` : ''}</td>
      </tr>`).join('') : `<tr><td colspan="8"><div class="rp-empty"><i class="bi bi-inbox"></i>Belum ada transaksi yang cocok dengan filter.</div></td></tr>`;
      const info = document.getElementById('rpHistoryInfo');
      if (info) info.textContent = rows.length ? `Menampilkan ${((page - 1) * perPage) + 1}–${Math.min(page * perPage, rows.length)} dari ${rows.length} transaksi` : 'Menampilkan 0 transaksi';
      const prev = document.getElementById('rpHistoryPrev'); const next = document.getElementById('rpHistoryNext');
      if (prev) prev.disabled = page <= 1;
      if (next) next.disabled = page >= pages;
      document.querySelectorAll('[data-page-number]').forEach(btn => {
        const n = Number(btn.dataset.pageNumber);
        btn.classList.toggle('active', n === page);
        btn.style.display = n <= pages ? '' : 'none';
      });
    }

    function renderModal(r) {
      detailId = r.id;
      const setText = (key, value) => document.querySelectorAll(`[data-history-field="${key}"]`).forEach(el => el.textContent = value ?? '—');
      setText('id', r.id); setText('customer', r.customer); setText('phone', r.phone);
      setText('motor', r.motor + ' (' + r.plate + ')'); setText('branch', r.branch);
      setText('period', fmtDateTime(r.start) + ' – ' + fmtDateTime(r.end));
      setText('status', r.status); setText('payment', r.payment);
      setText('total', money(r.total)); setText('fine', money(r.fine));
      setText('grand', money(Number(r.total) + Number(r.fine)));
      const badge = document.querySelector('[data-history-field="statusBadge"]');
      if (badge) { badge.textContent = r.status; badge.className = 'rp-pill ' + toneForStatus(r.status); }
      const timeline = document.getElementById('rpHistoryTimeline');
      if (timeline) {
        const steps = [
          { label: 'Pesanan dibuat', time: fmtDateTime(r.start), done: true },
          { label: 'Dokumen diverifikasi admin', time: fmtDateTime(new Date(new Date(r.start).getTime() + 30 * 60000)), done: true },
          { label: 'Pembayaran ' + (r.payment === 'Lunas' ? 'diterima' : 'menunggu'), time: fmtDateTime(new Date(new Date(r.start).getTime() + 60 * 60000)), done: r.payment === 'Lunas' },
          { label: 'Unit diserahkan', time: fmtDateTime(r.start), done: r.status !== 'Menunggu Verifikasi' && r.status !== 'Dibatalkan' },
          { label: 'Unit dikembalikan & diperiksa', time: fmtDateTime(r.end), done: r.status === 'Selesai' },
          { label: 'Transaksi selesai / invoice', time: r.status === 'Selesai' ? fmtDateTime(r.end) : '—', done: r.status === 'Selesai' }
        ];
        const current = steps.findIndex(s => !s.done);
        timeline.innerHTML = steps.map((s, i) => `<li class="${s.done ? 'done' : (i === current ? 'current' : '')}"><strong>${esc(s.label)}</strong><span>${esc(s.time)}</span></li>`).join('');
      }
      const invoiceBtn = document.getElementById('rpHistoryInvoiceBtn');
      if (invoiceBtn) invoiceBtn.style.display = r.status === 'Selesai' ? '' : 'none';
    }

    [search, from, to].forEach(el => el?.addEventListener('input', () => { page = 1; renderTable(); }));
    [status, branch].forEach(el => el?.addEventListener('change', () => { page = 1; renderTable(); }));
    document.getElementById('rpHistoryPrev')?.addEventListener('click', () => { page--; renderTable(); });
    document.getElementById('rpHistoryNext')?.addEventListener('click', () => { page++; renderTable(); });
    document.querySelectorAll('[data-page-number]').forEach(btn => btn.addEventListener('click', () => { page = Number(btn.dataset.pageNumber); renderTable(); }));
    tbody?.addEventListener('click', e => {
      const btn = e.target.closest('[data-detail], tr[data-id]');
      const r = rentals.find(x => x.id === (btn?.dataset.detail || btn?.dataset.id));
      if (!r) return;
      renderModal(r);
      const modalEl = document.getElementById('riwayatDetailModal');
      if (modalEl && window.bootstrap) new bootstrap.Modal(modalEl).show();
    });
    document.getElementById('rpHistoryExport')?.addEventListener('click', () => csv('riwayat-penyewaan-ryokou.csv', ['ID', 'Pelanggan', 'Motor', 'Cabang', 'Mulai', 'Selesai', 'Total', 'Denda', 'Status', 'Pembayaran'], filtered().map(r => [r.id, r.customer, r.motor, r.branch, fmtDateTime(r.start), fmtDateTime(r.end), r.total, r.fine, r.status, r.payment])));
    document.getElementById('rpHistoryReset')?.addEventListener('click', () => {
      ['rpHistorySearch', 'rpHistoryFrom', 'rpHistoryTo'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      ['rpHistoryStatus', 'rpHistoryBranch'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      page = 1; renderTable(); toast('Filter riwayat direset.');
    });

    renderStats(); renderTable();
  }

  /* ================= LAPORAN DATA MOTOR ================= */
  function initLaporan() {
    const tbody = document.getElementById('rpMotorRows');
    const search = document.getElementById('rpMotorSearch');
    const status = document.getElementById('rpMotorStatus');
    const branch = document.getElementById('rpMotorBranch');
    const brand = document.getElementById('rpMotorBrand');
    let sortKey = 'id', sortDir = 1;

    const filtered = () => {
      const q = (search?.value || '').trim().toLowerCase();
      const s = status?.value || '', b = branch?.value || '', br = brand?.value || '';
      return motors.filter(m => (!q || [m.id, m.name, m.plate].some(v => String(v).toLowerCase().includes(q)))
        && (!s || m.status === s) && (!b || m.branch === b) && (!br || m.brand === br))
        .sort((a, b2) => String(a[sortKey]).localeCompare(String(b2[sortKey]), 'id', { numeric: true }) * sortDir);
    };

    function renderStats(rows) {
      const count = s => rows.filter(m => m.status === s).length;
      const available = count('Tersedia'), rented = count('Disewa'), repair = count('Perbaikan');
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set('rpMotorTotal', rows.length); set('rpMotorAvailable', available);
      set('rpMotorRented', rented); set('rpMotorRepair', repair);
      const totalRate = rows.reduce((a, m) => a + Number(m.price), 0);
      const totalRevenue = rows.reduce((a, m) => a + Number(m.revenue), 0);
      set('rpMotorRate', money(totalRate));
      set('rpMotorRevenue', money(totalRevenue));
      set('rpMotorRevenueAlt', money(totalRevenue));
      set('rpMotorDays', rows.reduce((a, m) => a + Number(m.days), 0) + ' hari');
      set('rpMotorAvailMini', available + ' unit');
      set('rpMotorRepairMini', repair + ' unit');
      set('rpMotorFooterInfo', rows.length + ' unit ditampilkan · 4 cabang · RYOKOU');
      const util = rows.length ? Math.round(rented / rows.length * 100) : 0;
      set('rpMotorUtil', util + '%');
      [['Tersedia', available, ''], ['Disewa', rented, 'gold'], ['Perbaikan', repair, 'red']].forEach(([label, value, cls]) => {
        const bar = document.querySelector(`[data-bar="${label}"]`);
        const num = document.querySelector(`[data-bar-count="${label}"]`);
        if (bar) bar.style.width = (rows.length ? (value / rows.length * 100) : 0) + '%';
        if (bar) bar.className = 'rp-chart-fill ' + cls;
        if (num) num.textContent = `${value} unit · ${rows.length ? Math.round(value / rows.length * 100) : 0}%`;
      });
    }

    function renderTable() {
      const rows = filtered();
      renderStats(rows);
      if (tbody) tbody.innerHTML = rows.length ? rows.map(m => `<tr data-id="${esc(m.id)}">
        <td class="rp-cell-main">${esc(m.id)}</td>
        <td><div class="rp-motor-cell"><img class="rp-motor-thumb" src="../assets/${esc(m.photo)}" alt="${esc(m.name)}"><span>${esc(m.name)}<span class="rp-cell-sub">${esc(m.type)} · ${m.year}</span></span></div></td>
        <td>${esc(m.plate)}</td>
        <td>${esc(m.branch)}</td>
        <td>${pill(m.status, toneForStatus(m.status))}</td>
        <td class="rp-money">${money(m.price)}</td>
        <td>${m.days} hari</td>
        <td class="rp-money">${money(m.revenue)}</td>
        <td><div class="rp-util"><div class="rp-chart-track"><div class="rp-chart-fill" style="width:${Math.min(100, m.days * 4)}%"></div></div><span>${Math.min(100, m.days * 4)}%</span></div></td>
        <td><button type="button" class="workflow-btn" data-detail="${esc(m.id)}"><i class="bi bi-eye"></i> Detail</button></td>
      </tr>`).join('') : `<tr><td colspan="10"><div class="rp-empty"><i class="bi bi-inbox"></i>Tidak ada unit motor yang cocok dengan filter.</div></td></tr>`;
      const info = document.getElementById('rpMotorInfo');
      if (info) info.textContent = `Menampilkan ${rows.length} dari ${motors.length} unit motor`;
    }

    function renderModal(m) {
      const setText = (key, value) => document.querySelectorAll(`[data-motor-field="${key}"]`).forEach(el => el.textContent = value ?? '—');
      setText('id', m.id); setText('name', m.name); setText('plate', m.plate);
      setText('branch', m.branch); setText('year', m.year); setText('price', money(m.price));
      setText('revenue', money(m.revenue)); setText('days', m.days + ' hari');
      setText('condition', m.condition); setText('lastService', fmtDate(m.lastService)); setText('nextService', fmtDate(m.nextService));
      const badge = document.querySelector('[data-motor-field="statusBadge"]');
      if (badge) { badge.textContent = m.status; badge.className = 'rp-pill ' + toneForStatus(m.status); }
      const img = document.querySelector('[data-motor-field="photo"]');
      if (img) img.src = '../assets/' + m.photo;
      const serviceWarn = document.getElementById('rpMotorServiceWarn');
      if (serviceWarn) serviceWarn.classList.toggle('is-hidden', new Date(m.nextService) >= DEMO_NOW);
      const history = document.getElementById('rpMotorHistory');
      if (history) {
        const linked = rentals.filter(r => r.plate === m.plate).slice(0, 4);
        history.innerHTML = linked.length ? linked.map(r => `<div class="d-flex justify-content-between border-bottom py-1" style="font-size:9px"><span>${esc(r.id)} · ${fmtDate(r.start)}</span><span>${money(r.total)} · ${esc(r.status)}</span></div>`).join('') : '<p class="rp-locked-note">Belum ada riwayat penyewaan pada periode ini.</p>';
      }
    }

    [search].forEach(el => el?.addEventListener('input', renderTable));
    [status, branch, brand].forEach(el => el?.addEventListener('change', renderTable));
    document.querySelectorAll('[data-sort]').forEach(th => th.addEventListener('click', () => {
      const key = th.dataset.sort;
      sortDir = sortKey === key ? -sortDir : 1;
      sortKey = key;
      document.querySelectorAll('[data-sort] i').forEach(i => i.className = 'bi bi-arrow-down-up');
      const icon = th.querySelector('i'); if (icon) icon.className = sortDir > 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
      renderTable();
    }));
    tbody?.addEventListener('click', e => {
      const btn = e.target.closest('[data-detail], tr[data-id]');
      const m = motors.find(x => x.id === (btn?.dataset.detail || btn?.dataset.id));
      if (!m) return;
      renderModal(m);
      const modalEl = document.getElementById('laporanDetailModal');
      if (modalEl && window.bootstrap) new bootstrap.Modal(modalEl).show();
    });
    document.getElementById('rpMotorExport')?.addEventListener('click', () => csv('laporan-data-motor-ryokou.csv', ['ID', 'Motor', 'No Polisi', 'Cabang', 'Status', 'Tarif/Hari', 'Hari Disewa', 'Pendapatan', 'Servis Berikutnya'], filtered().map(m => [m.id, m.name, m.plate, m.branch, m.status, m.price, m.days, m.revenue, m.nextService])));
    document.getElementById('rpMotorPrint')?.addEventListener('click', () => window.print());
    document.getElementById('rpMotorReset')?.addEventListener('click', () => {
      ['rpMotorSearch'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      ['rpMotorStatus', 'rpMotorBranch', 'rpMotorBrand'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      renderTable(); toast('Filter laporan direset.');
    });

    renderTable();
  }

  const page = document.body.dataset.page;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => {
    if (page === 'pengembalian') initPengembalian();
    if (page === 'riwayat') initRiwayat();
    if (page === 'laporan-motor') initLaporan();
  });
  else {
    if (page === 'pengembalian') initPengembalian();
    if (page === 'riwayat') initRiwayat();
    if (page === 'laporan-motor') initLaporan();
  }
})();
