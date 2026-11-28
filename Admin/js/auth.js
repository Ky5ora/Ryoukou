document.querySelectorAll('[data-toggle]').forEach((box) => {
  box.addEventListener('change', () => {
    const input = document.querySelector(box.dataset.toggle);
    if (input) input.type = box.checked ? 'text' : 'password';
  });
});

document.querySelectorAll('form[data-demo]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const kind = form.dataset.demo;

    if (kind === 'login') {
      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;
      if (!email || !password) return;
      try {
        localStorage.setItem('ryokouOtpEmail', email);
        localStorage.setItem('ryokouOtpFlow', 'login');
      } catch (error) { console.warn(error); }
      window.location.href = 'otp.html?flow=login';
      return;
    }

    if (kind === 'otp') {
      const codeInput = document.getElementById('otpCode');
      const errorEl = document.getElementById('otpError');
      const code = (codeInput?.value || '').replace(/\D/g, '');
      if (code !== '246801') {
        errorEl?.classList.remove('d-none');
        codeInput?.focus();
        return;
      }
      errorEl?.classList.add('d-none');
      const flow = new URLSearchParams(window.location.search).get('flow') || localStorage.getItem('ryokouOtpFlow') || 'login';
      window.location.href = flow === 'reset' ? 'reset-password.html' : 'dashboard.html';
      return;
    }

    if (kind === 'reset') {
      const a = document.getElementById('newPassword').value;
      const b = document.getElementById('confirmPassword').value;
      if (a !== b) {
        alert('Konfirmasi password belum sama.');
        return;
      }
      alert('Demo: password cocok. Hubungkan backend untuk menyimpan perubahan.');
      location.href = 'login.html';
      return;
    }

    if (kind === 'verify') {
      const email = document.getElementById('email')?.value.trim();
      const username = document.getElementById('username')?.value.trim();
      if (!email || !username) return;
      try {
        localStorage.setItem('ryokouOtpEmail', email);
        localStorage.setItem('ryokouOtpFlow', 'reset');
      } catch (error) { console.warn(error); }
      location.href = 'otp.html?flow=reset';
      return;
    }

    if (kind === 'register') {
      const a = document.getElementById('password').value;
      const b = document.getElementById('confirm').value;
      if (a !== b) {
        alert('Password dan konfirmasi password harus sama.');
        return;
      }
      alert('Demo: formulir pendaftaran valid. Hubungkan backend untuk membuat akun.');
      location.href = 'login.html';
    }
  });
});

(() => {
  const emailDisplay = document.getElementById('otpEmailDisplay');
  if (emailDisplay) {
    try { emailDisplay.textContent = localStorage.getItem('ryokouOtpEmail') || 'admin001@gmail.com'; }
    catch (error) { console.warn(error); }
  }
  const otpInput = document.getElementById('otpCode');
  otpInput?.addEventListener('input', () => {
    otpInput.value = otpInput.value.replace(/\D/g, '').slice(0, 6);
    document.getElementById('otpError')?.classList.add('d-none');
  });
})();
