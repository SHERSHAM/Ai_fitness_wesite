/**
 * FITNEXA AI — Auth & Onboarding Animations
 * Split-screen entrance, error shake physics, and onboarding step cross-fades.
 */

document.addEventListener('DOMContentLoaded', () => {
  runAuthPageEntrance();
});

function runAuthPageEntrance() {
  if (typeof gsap === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    gsap.to(['.auth-form-column', '.auth-visual-column', '.auth-stat-card', '.onboarding-card'], {
      opacity: 1,
      duration: 0.25
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Left form panel entrance
  tl.fromTo('.auth-form-column',
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.8 }
  );

  // Form fields stagger
  tl.fromTo('.form-group-custom, .auth-heading, .auth-subheading',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
    '-=0.5'
  );

  // Right visual panel entrance
  if (document.querySelector('.auth-visual-column')) {
    tl.fromTo('.auth-visual-column',
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.9 },
      '-=0.7'
    );

    tl.fromTo('.auth-stat-card',
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6 },
      '-=0.4'
    );
  }

  // Onboarding wizard card entrance
  if (document.querySelector('.onboarding-card')) {
    tl.fromTo('.onboarding-card',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.7 }
    );
  }
}

// Shake animation for validation errors
window.triggerErrorShake = function(element) {
  if (!element || typeof gsap === 'undefined') return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.classList.add('is-invalid');
    return;
  }

  element.classList.add('is-invalid');
  gsap.fromTo(element,
    { x: -10 },
    {
      x: 10,
      duration: 0.08,
      repeat: 4,
      yoyo: true,
      ease: 'sine.inOut',
      onComplete: () => {
        gsap.to(element, { x: 0, duration: 0.05 });
      }
    }
  );
};

// Button loading state
window.setButtonLoading = function(btn, loadingText = 'Processing...') {
  if (!btn) return;
  btn.dataset.originalText = btn.innerHTML;
  btn.setAttribute('disabled', 'true');
  btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> ${loadingText}`;
};

window.resetButtonLoading = function(btn) {
  if (!btn || !btn.dataset.originalText) return;
  btn.removeAttribute('disabled');
  btn.innerHTML = btn.dataset.originalText;
};
