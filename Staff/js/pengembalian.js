(() => {
  'use strict';

  /* ===== Konfigurasi tarif – sesuaikan dengan aturan rental ===== */
  const TARIF_TELAT_PER_JAM = 20000; // sesuai desain: Rp 20.000 / jam
  const DENDA_PER_SISI_RUSAK = 50000; // TODO: nilai contoh, bukan dari desain

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rp = (n) => 'Rp ' + n.toLocaleString('id-ID');

  const lateInput  = $('#lateHours');
  const sides      = $$('.rt-side');
  const fineBox    = $('.rt-fine');
  const toast      = $('#toast');

  /* ---------- Kalkulator denda ---------- */
  function recalc() {
    const hours = Math.min(99, Math.max(0, parseInt(lateInput.value, 10) || 0));
    const bad   = sides.filter((s) => s.classList.contains('is-bad')).length;
    const late  = hours * TARIF_TELAT_PER_JAM;
    const dmg   = bad * DENDA_PER_SISI_RUSAK;
    const total = late + dmg;

    $('#lateFee').textContent   = rp(late);
    $('#fineTotal').textContent = rp(total);
    fineBox.classList.toggle('is-bad', total > 0);

    const parts = [];
    if (hours) parts.push(`Keterlambatan ${hours} jam`);
    if (bad)   parts.push(`${bad} sisi bodi perlu dicatat`);
    $('#fineNote').textContent = parts.length ? parts.join(' + ') : 'Tidak ada denda bodi maupun keterlambatan jam';
    $('#fineSub').textContent  = total ? 'Dibebankan ke penyewa' : 'Bebas Biaya Tambahan';

    const badge = $('#checkBadge');
    badge.textContent = bad ? `${bad} Sisi Bermasalah` : 'Semua Lolos Checklist';
    badge.classList.toggle('is-bad', bad > 0);
  }

  lateInput.addEventListener('input', recalc);

  sides.forEach((btn) => {
    btn.addEventListener('click', () => {
      const bad = btn.classList.toggle('is-bad');
      btn.setAttribute('aria-pressed', String(bad));
      $('.rt-side__d', btn).innerHTML = bad ? 'Ada kerusakan / lecet' : btn.dataset.ok;
      recalc();
    });
  });

  /* ---------- Keputusan validasi ---------- */
  const radios  = $$('input[name="keputusan"]');
  const note    = $('#adminNote');
  const noteErr = $('#noteErr');
  const btn     = $('#confirmBtn');
  const label   = $('#confirmLabel');
  const isReject = () => $('input[name="keputusan"]:checked').value === 'reject';

  function syncDecision() {
    const reject = isReject();
    $$('.rt-opt').forEach((o) => o.classList.toggle('is-on', o.querySelector('input').checked));
    btn.classList.toggle('rt-btn--danger', reject);
    label.textContent = reject ? 'Tolak Delegasi & Tahan Jaminan' : 'Konfirmasi Validasi & Tutup Rental';
    if (!reject) clearErr();
  }
  const clearErr = () => { note.classList.remove('is-invalid'); noteErr.hidden = true; };

  radios.forEach((r) => r.addEventListener('change', syncDecision));
  note.addEventListener('input', () => note.value.trim() && clearErr());

  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => (toast.hidden = true), 3000);
  }

  btn.addEventListener('click', () => {
    if (isReject() && !note.value.trim()) {
      note.classList.add('is-invalid');
      noteErr.hidden = false;
      note.focus();
      return;
    }
    clearErr();
    // TODO: kirim { keputusan, catatan: note.value, denda } ke backend di sini
    showToast(isReject() ? 'Delegasi ditolak. Jaminan ditahan.' : 'Pengembalian divalidasi. Rental ditutup.');
  });

  /* ---------- Modal pratinjau ---------- */
  const modal = $('#docModal');
  let opener = null;
  const open = (title, from) => { opener = from; $('#docTitle').textContent = title; modal.hidden = false; $('#docClose').focus(); };
  const close = () => { modal.hidden = true; opener && opener.focus(); };

  $$('[data-preview]').forEach((b) => b.addEventListener('click', () => open(b.dataset.preview, b)));
  $('#docClose').addEventListener('click', close);
  modal.addEventListener('click', (e) => e.target === modal && close());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && !modal.hidden && close());

  syncDecision();
  recalc();
})();