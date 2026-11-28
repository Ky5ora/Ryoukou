(() => {
  const form = document.getElementById('paymentValidationForm');
  if (!form) return;

  const reasonBox = document.getElementById('rejectionReasons');
  const reasonError = document.getElementById('rejectionError');
  const note = document.getElementById('paymentNote');
  const resultBox = document.getElementById('invoiceResult');
  const reasonButtons = [...document.querySelectorAll('[data-reason]')];
  const previewButton = document.querySelector('[data-preview-payment]');
  const validationRadios = [...form.querySelectorAll('input[name="validation"]')];

  previewButton?.addEventListener('click', () => {
    const modalEl = document.getElementById('paymentPreviewModal');
    if (window.bootstrap && modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).show();
  });

  function isRejected() {
    return form.querySelector('input[name="validation"]:checked')?.value === 'Ditolak';
  }
  function selectedReasons() {
    return reasonButtons.filter(button => button.classList.contains('selected')).map(button => button.dataset.reason);
  }
  function updateMode() {
    const rejected = isRejected();
    reasonBox.classList.toggle('d-none', !rejected);
    document.getElementById('noteOptional').textContent = rejected ? '(Tambahan)' : '(Opsional)';
    if (!rejected) {
      reasonButtons.forEach(button => button.classList.remove('selected'));
      reasonError.classList.add('d-none');
    }
  }
  validationRadios.forEach(radio => radio.addEventListener('change', updateMode));
  reasonButtons.forEach(button => button.addEventListener('click', () => {
    button.classList.toggle('selected');
    reasonError.classList.add('d-none');
  }));
  updateMode();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const rejected = isRejected();
    const reasons = selectedReasons();
    const typedNote = note.value.trim();
    if (rejected && reasons.length === 0 && !typedNote) {
      reasonError.classList.remove('d-none');
      note.focus();
      return;
    }

    const status = rejected ? 'Ditolak' : 'Lunas';
    const reasonSummary = [...reasons, ...(typedNote ? [typedNote] : [])].join('; ');
    const invoice = {
      id: 'TRX-001', customer: 'Hash Aurelia', phone: '081288887777',
      motor: 'Honda Beat Deluxe 2023/2024 (B 1234 KZ)', date: '26 Apr 2025', duration: '2 Hari',
      pickup: 'Rental Motor RYOKOU - Malang', subtotal: 'Rp 70.000', service: 'Rp 10.000', total: 'Rp 80.000',
      paymentMethod: 'QRIS', paymentStatus: status, note: reasonSummary, rejectionReason: rejected ? reasonSummary : ''
    };
    try {
      localStorage.setItem('ryokouInvoiceData', JSON.stringify(invoice));
      localStorage.setItem('ryokouPaymentStatus', status);
    } catch (error) { console.warn('Data pembayaran demo tidak dapat disimpan.', error); }

    const statusEl = document.getElementById('paymentStatus');
    statusEl.innerHTML = rejected ? '<i class="bi bi-x-circle"></i> Ditolak' : '<i class="bi bi-check-circle"></i> Lunas';
    statusEl.classList.toggle('rejected', rejected);
    statusEl.classList.toggle('paid', !rejected);
    resultBox.classList.remove('d-none');
    document.getElementById('validationMessage').textContent = rejected
      ? `Pembayaran ditolak. Alasan: ${reasonSummary}. Pelanggan perlu memperbaiki dan mengunggah bukti pembayaran kembali.`
      : 'Pembayaran berhasil divalidasi. Invoice siap dibagikan kepada pelanggan.';
    document.querySelectorAll('.payment-retry-note').forEach(item => item.remove());
    const invoiceLink = document.getElementById('invoiceActionLink');
    invoiceLink.classList.toggle('d-none', rejected);
    if (rejected) {
      invoiceLink.insertAdjacentHTML('afterend', '<div class="payment-retry-note"><i class="bi bi-info-circle"></i> Invoice belum diterbitkan karena pembayaran belum diterima.</div>');
    } else {
      document.querySelector('.payment-retry-note')?.remove();
    }
  });
})();
