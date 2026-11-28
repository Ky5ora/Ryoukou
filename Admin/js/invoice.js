(() => {
  const fallback = {
    id:'TRX-001', customer:'Hash Aurelia', phone:'081288887777',
    motor:'Honda Beat Deluxe 2023/2024 (B 1234 KZ)', date:'26 Apr 2025',
    duration:'2 Hari', pickup:'Rental Motor RYOKOU - Malang',
    subtotal:'Rp 70.000', service:'Rp 10.000', total:'Rp 80.000',
    paymentMethod:'QRIS', paymentStatus:'Belum Lunas'
  };
  let data = fallback;
  try {
    const saved = JSON.parse(localStorage.getItem('ryokouInvoiceData') || 'null');
    if (saved && typeof saved === 'object') data = { ...fallback, ...saved };
  } catch (error) { console.warn('Data invoice demo tidak dapat dibaca', error); }
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value || '-'; };
  set('invoiceCode', `INV-${data.id}`);
  set('invoiceTransaction', data.id);
  set('invoiceCustomer', data.customer);
  set('invoicePhone', data.phone);
  set('invoiceMotor', data.motor);
  set('invoicePickup', data.pickup);
  set('invoiceDuration', `${data.duration} · ${data.date}`);
  set('invoiceSubtotal', data.subtotal);
  set('invoiceSubtotalTotal', data.subtotal);
  set('invoiceService', data.service);
  set('invoiceServiceTotal', data.service);
  set('invoiceTotal', data.total);
  set('invoiceMethod', data.paymentMethod);
  set('invoicePaymentStatus', data.paymentStatus);
  const phoneInput = document.getElementById('recipientPhone');
  if (phoneInput && data.phone) phoneInput.value = data.phone;
  const message = () => [
    `Halo ${data.customer}, berikut invoice penyewaan motor RYOKOU.`,
    `No. Invoice: INV-${data.id}`,
    `Motor: ${data.motor}`,
    `Periode: ${data.date} (${data.duration})`,
    `Lokasi: ${data.pickup}`,
    `Total: ${data.total}`,
    `Status pembayaran: ${data.paymentStatus}`,
    'Terima kasih telah menggunakan RYOKOU Oto Rent.'
  ].join('\n');
  const openWhatsApp = () => {
    let phone = (phoneInput?.value || '').replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '62' + phone.slice(1);
    if (!phone || phone.length < 10) { alert('Masukkan nomor WhatsApp pelanggan yang benar.'); phoneInput?.focus(); return; }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message())}`;
    window.open(url, '_blank', 'noopener');
  };
  document.getElementById('printInvoice')?.addEventListener('click', () => window.print());
  document.getElementById('shareInvoice')?.addEventListener('click', openWhatsApp);
  document.getElementById('sendWhatsApp')?.addEventListener('click', openWhatsApp);
})();
