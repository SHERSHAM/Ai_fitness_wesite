/**
 * FITNEXA AI — Auth UI Controller (Pure Presentation & Micro-Interactions)
 * Password show/hide toggle, live password strength meter,
 * and demo 1-click convenience listeners.
 * NOTE: DOES NOT TOUCH OR OVERWRITE CORE AUTH LOGIC (auth.js / data-store.js).
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initPasswordStrengthMeter();
  initTermsToggle();
  initDemoAccountQuickLogin();
});

// 1. Password Visibility Toggle
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.password-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill';
      }
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });
}

// 2. Live Password Strength Meter (4 Segments)
function initPasswordStrengthMeter() {
  const pwdInput = document.getElementById('signupPassword');
  const strengthLbl = document.getElementById('strengthLabel');
  const seg1 = document.getElementById('sSeg1');
  const seg2 = document.getElementById('sSeg2');
  const seg3 = document.getElementById('sSeg3');
  const seg4 = document.getElementById('sSeg4');

  if (!pwdInput || !seg1) return;

  const segs = [seg1, seg2, seg3, seg4];

  pwdInput.addEventListener('input', () => {
    const val = pwdInput.value;
    let score = 0;

    if (val.length >= 6) score++;
    if (val.length >= 8 && /[0-9]/.test(val)) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val) || val.length >= 12) score++;

    // Reset segments
    segs.forEach(s => { s.className = 'strength-segment'; });

    if (val.length === 0) {
      if (strengthLbl) { strengthLbl.innerText = 'None'; strengthLbl.className = 'text-muted'; }
    } else if (score === 1) {
      segs[0].classList.add('active-weak');
      if (strengthLbl) { strengthLbl.innerText = 'Weak'; strengthLbl.className = 'text-danger'; }
    } else if (score === 2) {
      segs[0].classList.add('active-medium');
      segs[1].classList.add('active-medium');
      if (strengthLbl) { strengthLbl.innerText = 'Medium'; strengthLbl.className = 'text-warning'; }
    } else if (score === 3) {
      segs[0].classList.add('active-strong');
      segs[1].classList.add('active-strong');
      segs[2].classList.add('active-strong');
      if (strengthLbl) { strengthLbl.innerText = 'Good'; strengthLbl.className = 'text-lime'; }
    } else {
      segs.forEach(s => s.classList.add('active-strong'));
      if (strengthLbl) { strengthLbl.innerText = 'Strong'; strengthLbl.className = 'text-lime'; }
    }
  });
}

// 3. Terms Checkbox Enabler for Signup Button
function initTermsToggle() {
  const termsCheckbox = document.getElementById('termsCheckbox');
  const signupBtn = document.getElementById('signupBtn');

  if (!termsCheckbox || !signupBtn) return;

  termsCheckbox.addEventListener('change', () => {
    if (termsCheckbox.checked) {
      signupBtn.removeAttribute('disabled');
      signupBtn.style.opacity = '1';
      signupBtn.style.pointerEvents = 'auto';
    } else {
      signupBtn.setAttribute('disabled', 'true');
      signupBtn.style.opacity = '0.5';
      signupBtn.style.pointerEvents = 'none';
    }
  });
}

// 4. Quick Demo 1-Click Access Listeners
function initDemoAccountQuickLogin() {
  const demoAlex = document.getElementById('demoAlex');
  const demoSarah = document.getElementById('demoSarah');

  if (demoAlex) {
    demoAlex.addEventListener('click', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPassword');
      if (emailInput && passInput) {
        emailInput.value = 'alex.mercer@fitnexa.ai';
        passInput.value = 'strength2026';
      }
      const form = document.getElementById('loginForm');
      if (form) form.dispatchEvent(new Event('submit'));
    });
  }

  if (demoSarah) {
    demoSarah.addEventListener('click', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPassword');
      if (emailInput && passInput) {
        emailInput.value = 'sarah.connor@fitnexa.ai';
        passInput.value = 'endurance2026';
      }
      const form = document.getElementById('loginForm');
      if (form) form.dispatchEvent(new Event('submit'));
    });
  }
}
