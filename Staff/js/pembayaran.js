(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const options     = $$('.option');
  const radios      = $$('input[name="validasi"]');
  const quick       = $('#quickReasons');
  const chips       = $$('.chip');
  const note        = $('#note');
  const noteLabel   = $('#noteLabel');
  const noteWrap    = note.closest('.textarea');
  const requiredTag = $('#requiredTag');
  const noteError   = $('#noteError');
  const saveBtn     = $('#saveBtn');
  const payStatus   = $('#payStatus');
  const toast       = $('#toast');
  const modal       = $('#proofModal');

  const isReject = () => $('input[name="validasi"]:checked').value === 'reject';

  /* ---------- Pilihan validasi ---------- */
  function syncValidation() {
    const reject = isReject();

    options.forEach(o => o.classList.toggle('is-selected', o.querySelector('input').checked));

    quick.hidden = !reject;
    requiredTag.hidden = !reject;
    noteWrap.classList.toggle('is-reject', reject);
    noteLabel.textContent = reject ? 'Alasan Penolakan' : 'Catatan (Opsional)';
    note.placeholder = reject ? 'Masukkan catatan validasi...' : 'Masukkan catatan validasi...';

    if (!reject) {
      clearError();
      chips.forEach(c => c.classList.remove('is-active'));
    }
  }

  radios.forEach(r => r.addEventListener('change', syncValidation));

  /* ---------- Alasan cepat ---------- */
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const wasActive = chip.classList.contains('is-active');
      chips.forEach(c => c.classList.remove('is-active'));

      if (wasActive) {
        note.value = '';
      } else {
        chip.classList.add('is-active');
        note.value = chip.dataset.reason;
        clearError();
      }
      note.focus();
    });
  });

  // Mengetik manual melepas penanda chip jika teks sudah berbeda
  note.addEventListener('input', () => {
    if (note.value.trim()) clearError();
    chips.forEach(c => {
      if (c.classList.contains('is-active') && c.dataset.reason !== note.value) {
        c.classList.remove('is-active');
      }
    });
  });

  /* ---------- Validasi & simpan ---------- */
  function showError() {
    noteWrap.classList.add('is-invalid');
    noteError.hidden = false;
    note.focus();
  }
  function clearError() {
    noteWrap.classList.remove('is-invalid');
    noteError.hidden = true;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => (toast.hidden = true), 2800);
  }

  saveBtn.addEventListener('click', () => {
    if (isReject() && !note.value.trim()) {
      showError();
      return;
    }
    clearError();

    if (isReject()) {
      payStatus.className = 'badge badge--bad';
      payStatus.textContent = 'Ditolak';
      showToast('Pembayaran ditolak. Alasan telah disimpan.');
    } else {
      payStatus.className = 'badge badge--ok';
      payStatus.textContent = 'Lunas';
      showToast('Pembayaran diterima. Validasi disimpan.');
    }
    // TODO: kirim { status, catatan: note.value } ke backend di sini
  });

  /* ---------- Modal bukti pembayaran ---------- */
  const openProof  = () => { modal.hidden = false; $('#closeProof').focus(); };
  const closeProof = () => { modal.hidden = true; $('#openProof').focus(); };

  $('#openProof').addEventListener('click', openProof);
  $('#closeProof').addEventListener('click', closeProof);
  modal.addEventListener('click', e => { if (e.target === modal) closeProof(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeProof(); });

  /* ---------- Drawer sidebar (mobile) ---------- */
  const sidebar  = $('#sidebar');
  const backdrop = $('#mobileBackdrop');
  const toggleSb = (open) => {
    if (!sidebar) return;
    sidebar.classList.toggle('-translate-x-full', !open);
    backdrop?.classList.toggle('hidden', !open);
  };
  $('#toggleSidebarBtn')?.addEventListener('click', () => toggleSb(true));
  $('#closeMobileSidebarBtn')?.addEventListener('click', () => toggleSb(false));
  backdrop?.addEventListener('click', () => toggleSb(false));

  syncValidation();
})();