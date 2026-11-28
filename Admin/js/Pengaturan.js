(() => {
  const form = document.getElementById('settingsForm');
  if (!form) return;

  const defaults = {
    adminName: 'Admin_001 / Budi Pratama',
    adminEmail: 'admin001@gmail.com'
  };
  const fields = ['adminName', 'adminEmail'];
  const photoInput = document.getElementById('profilePhotoInput');
  const photoPreview = document.getElementById('profileAvatarPreview');
  const summaryName = document.getElementById('profileSummaryName');
  const summaryEmail = document.getElementById('profileSummaryEmail');
  const message = document.getElementById('settingsMessage');

  const readSaved = () => {
    try { return JSON.parse(localStorage.getItem('ryokouAdminSettings') || 'null') || {}; }
    catch (error) { console.warn('Pengaturan profil belum dapat dibaca.', error); return {}; }
  };
  const saved = readSaved();
  fields.forEach((id) => { document.getElementById(id).value = saved[id] || defaults[id]; });
  const savedPhoto = saved.profilePhoto || (() => { try { return localStorage.getItem('ryokouAdminProfilePhoto'); } catch (error) { return ''; } })();
  if (savedPhoto) showPhoto(savedPhoto);
  updateSummary();

  function showPhoto(dataUrl) {
    photoPreview.innerHTML = '';
    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = 'Foto profil admin';
    photoPreview.appendChild(img);
    try { localStorage.setItem('ryokouAdminProfilePhoto', dataUrl); } catch (error) { console.warn(error); }
  }

  function updateSummary() {
    summaryName.textContent = document.getElementById('adminName').value.trim() || 'Admin_001';
    summaryEmail.textContent = document.getElementById('adminEmail').value.trim();
  }

  document.getElementById('changePhotoBtn')?.addEventListener('click', () => photoInput.click());
  photoInput?.addEventListener('change', () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      alert('Pilih file foto PNG, JPG, atau WebP.');
      photoInput.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto maksimal 2 MB.');
      photoInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => showPhoto(String(reader.result));
    reader.onerror = () => alert('Foto tidak dapat dibaca. Coba pilih file lain.');
    reader.readAsDataURL(file);
  });

  fields.forEach((id) => document.getElementById(id).addEventListener('input', updateSummary));
  document.getElementById('cancelSettingsBtn')?.addEventListener('click', () => {
    const latest = readSaved();
    fields.forEach((id) => { document.getElementById(id).value = latest[id] || defaults[id]; });
    updateSummary();
    message.classList.add('d-none');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = { ...readSaved() };
    fields.forEach((id) => data[id] = document.getElementById(id).value.trim());
    const photo = localStorage.getItem('ryokouAdminProfilePhoto');
    if (photo) data.profilePhoto = photo;
    try {
      localStorage.setItem('ryokouAdminSettings', JSON.stringify(data));
      localStorage.setItem('ryokouAdminName', data.adminName);
      localStorage.setItem('ryokouAdminEmail', data.adminEmail);
      message.classList.remove('d-none');
      updateSummary();
    } catch (error) {
      alert('Penyimpanan browser penuh atau tidak tersedia. Kurangi ukuran foto lalu coba lagi.');
      console.warn(error);
    }
  });
})();
