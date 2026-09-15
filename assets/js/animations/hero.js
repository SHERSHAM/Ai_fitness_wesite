/**
 * FITNEXA AI — Hero & Preloader GSAP Animations
 * Handles logo loading sequence, headline reveal, stats count-up,
 * and biometric telemetry HUD card animation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
});

function initPreloader() {
  const preloader = document.getElementById('fitnexaPreloader');
  const barFill = document.getElementById('preloaderFill');

  if (!preloader) {
    runHeroEntrance();
    return;
  }

  // Preloader progress bar animation
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 25) + 10;
    if (progress > 100) progress = 100;
    if (barFill) barFill.style.width = progress + '%';

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('loaded');
        runHeroEntrance();
      }, 350);
    }
  }, 70);
}

function runHeroEntrance() {
  if (typeof gsap === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Simple fade for reduced motion preference
    gsap.to(['.hero-eyebrow', '.hero-title .title-line', '.hero-description', '.hero-cta-group .btn-fitnexa', '.stats-strip .stat-item', '.hero-visual-col'], {
      opacity: 1,
      duration: 0.25,
      stagger: 0.05,
      onComplete: animateCounters
    });

    if (window.initHeroVortex) {
      window.initHeroVortex('heroVortexCanvas');
    }
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // 1. Eyebrow Tag
  tl.fromTo('.hero-eyebrow',
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.7 }
  );

  // 2. Headline Split / Words reveal
  tl.fromTo('.hero-title .title-line',
    { opacity: 0, y: 35, skewY: 2 },
    { opacity: 1, y: 0, skewY: 0, duration: 0.85, stagger: 0.12 },
    '-=0.4'
  );

  // 3. Subtext
  tl.fromTo('.hero-description',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7 },
    '-=0.5'
  );

  // 4. CTA Buttons
  tl.fromTo('.hero-cta-group .btn-fitnexa',
    { opacity: 0, y: 25, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
    '-=0.4'
  );

  // 5. Stat Counter Strip
  tl.fromTo('.stats-strip .stat-item',
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      onComplete: animateCounters
    },
    '-=0.3'
  );

  // 6. Runner silhouette entrance
  tl.fromTo('.hero-visual-col',
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 1 },
    '-=0.8'
  );

  if (document.querySelector('.hud-telemetry-card')) {
    tl.fromTo('.hud-telemetry-card',
      { opacity: 0, x: 40, y: 20 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        onComplete: animateHudTelemetry
      },
      '-=0.7'
    );
  }

  // Initialize Three.js Hero Canvas if present
  if (window.initHeroVortex) {
    window.initHeroVortex('heroVortexCanvas');
  }
}

function animateCounters() {
  const statUsers = document.getElementById('statUsers');
  const statPrograms = document.getElementById('statPrograms');
  const statRating = document.getElementById('statRating');

  if (statUsers) {
    let countObj = { val: 0 };
    gsap.to(countObj, {
      val: 10,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        statUsers.innerText = Math.floor(countObj.val) + 'K+';
      }
    });
  }

  if (statPrograms) {
    let countObj = { val: 0 };
    gsap.to(countObj, {
      val: 500,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        statPrograms.innerText = Math.floor(countObj.val) + '+';
      }
    });
  }

  if (statRating) {
    let countObj = { val: 0 };
    gsap.to(countObj, {
      val: 4.8,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        statRating.innerText = countObj.val.toFixed(1) + '/5';
      }
    });
  }
}

function animateHudTelemetry() {
  // Fill progress bars
  const bars = document.querySelectorAll('.telemetry-bar-fill');
  bars.forEach(bar => {
    const target = bar.getAttribute('data-target') || '75';
    bar.style.width = target + '%';
  });

  // Animate circular gauge
  const gaugeCircle = document.getElementById('hudGaugeCircle');
  const gaugeVal = document.getElementById('hudGaugeVal');
  if (gaugeCircle) {
    // Circumference = 2 * PI * 45 = ~283
    const targetPercent = 78;
    const targetOffset = 283 * (1 - targetPercent / 100);
    gaugeCircle.style.strokeDashoffset = targetOffset;

    let gaugeObj = { val: 0 };
    gsap.to(gaugeObj, {
      val: targetPercent,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (gaugeVal) gaugeVal.innerText = Math.floor(gaugeObj.val) + '%';
      }
    });
  }

  // Animate mini visualizer bars
  const vBars = document.querySelectorAll('.v-bar');
  vBars.forEach((bar, idx) => {
    const minH = 4 + (idx * 1.5);
    const maxH = 16 - (idx % 3);
    gsap.to(bar, {
      height: maxH,
      duration: 0.5 + Math.random() * 0.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: idx * 0.08
    });
  });
}
