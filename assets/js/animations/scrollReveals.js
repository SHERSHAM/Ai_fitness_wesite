/**
 * FITNEXA AI — Scroll Reveals & Interactive Section Controllers
 * GSAP ScrollTrigger batches, pinned panel telemetry animations,
 * interactive AI demo chat simulator, and 3D card tilt physics.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initScrollAnimations();
  initAiDemoSimulator();
  initCard3DTilt();
});

// 1. Sticky Navbar Shrink Controller
function initNavbarScroll() {
  const nav = document.getElementById('fitnexaNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

// 2. GSAP ScrollTrigger Animations
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Performance configuration: limit unnecessary callback calls during rapid scrolling
  ScrollTrigger.config({
    limitCallbacks: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
  });

  // Initialize Globe Canvas immediately so it is ready
  if (window.initCommunityGlobe) {
    window.initCommunityGlobe('communityGlobeCanvas');
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animDuration = prefersReducedMotion ? 0.25 : 0.65;
  const yShift = prefersReducedMotion ? 0 : 25;

  // Spec Strip Batch Reveal
  gsap.fromTo('.spec-card',
    { opacity: 0, y: yShift },
    {
      scrollTrigger: {
        trigger: '.spec-strip-section',
        start: 'top 92%',
        toggleActions: 'play none none none'
      },
      y: 0,
      opacity: 1,
      duration: animDuration,
      stagger: prefersReducedMotion ? 0 : 0.08,
      ease: 'power2.out'
    }
  );

  // Programs Grid Stagger Reveal
  gsap.fromTo('.program-card',
    { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    {
      scrollTrigger: {
        trigger: '.programs-section',
        start: 'top 92%',
        toggleActions: 'play none none none'
      },
      y: 0,
      opacity: 1,
      duration: animDuration,
      stagger: prefersReducedMotion ? 0 : 0.08,
      ease: 'power3.out'
    }
  );

  // AI Split Section Reveal
  if (document.querySelector('.ai-coach-split')) {
    gsap.fromTo('.ai-coach-split',
      { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
      {
        scrollTrigger: {
          trigger: '.ai-coach-split',
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: animDuration,
        ease: 'power3.out'
      }
    );
  }

  // 3-Panel Deep Dive Cards
  gsap.fromTo('.deep-dive-card',
    { opacity: 0, y: prefersReducedMotion ? 0 : 35 },
    {
      scrollTrigger: {
        trigger: '.features-deep-dive-section',
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      y: 0,
      opacity: 1,
      duration: animDuration,
      stagger: prefersReducedMotion ? 0 : 0.1,
      ease: 'power3.out',
      onComplete: () => {
        const formGauge = document.getElementById('formAccuracyGauge');
        if (formGauge) {
          formGauge.style.strokeDashoffset = '11.3';
        }
      }
    }
  );

  // Globe Section Counter Trigger
  ScrollTrigger.create({
    trigger: '.community-globe-section',
    start: 'top 85%',
    onEnter: () => {
      const athleteCounter = document.getElementById('globalAthleteCounter');
      if (athleteCounter && !athleteCounter.dataset.counted) {
        athleteCounter.dataset.counted = 'true';
        let countObj = { val: prefersReducedMotion ? 148520 : 120000 };
        if (prefersReducedMotion) {
          athleteCounter.innerText = '148,520+';
        } else {
          gsap.to(countObj, {
            val: 148520,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => {
              athleteCounter.innerText = Math.floor(countObj.val).toLocaleString() + '+';
            }
          });
        }
      }
    }
  });

  // Pricing Cards Reveal (if present)
  if (document.querySelector('.pricing-card')) {
    gsap.fromTo('.pricing-card',
      { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
      {
        scrollTrigger: {
          trigger: '.pricing-section',
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: animDuration,
        stagger: prefersReducedMotion ? 0 : 0.1,
        ease: 'power3.out'
      }
    );
  }

  // Window load and resize refresh
  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.addEventListener('resize', () => ScrollTrigger.refresh());
}

// 3. Interactive AI Demo Simulator
function initAiDemoSimulator() {
  const chips = document.querySelectorAll('.prompt-chip');
  const chatMessages = document.getElementById('demoChatMessages');
  const chatInput = document.getElementById('demoChatInput');
  const sendBtn = document.getElementById('demoSendBtn');

  if (!chatMessages) return;

  const responses = {
    "Build me a 4-day split": {
      title: "Optimized 4-Day Hypertrophy & Power Split",
      text: "Day 1: Upper Power (Bench & Barbell Rows)\nDay 2: Lower Hypertrophy (Squats & RDLs)\nDay 3: Rest / Active Mobility\nDay 4: Upper Hypertrophy (Incline DB & Lat Pulldown)\nDay 5: Lower Power (Deadlifts & Front Squats)\nDay 6-7: Recovery.",
      meta: "Targeting 14-16 weekly sets per muscle group with progressive overload."
    },
    "Check my squat form": {
      title: "AI Computer Vision Pose Analysis",
      text: "Torso angle: 48° (Optimal).\nHip crease depth: Parallel achieved (-2cm).\nKnee travel: Tracked along second toe.\nFeedback: Maintain consistent brace pressure through bottom turnaround.",
      meta: "Biomechanics score: 96% Match with Elite Standard."
    },
    "Plan my macros": {
      title: "Target Daily Nutritional Fueling",
      text: "Calories: 2,650 kcal\nProtein: 195g (30%)\nCarbohydrates: 280g (42%)\nHealthy Fats: 82g (28%)\nHydration: 3.8L with electrolytes.",
      meta: "Calculated for Lean Muscle Hypertrophy at 82kg bodyweight."
    },
    "Why am I plateauing?": {
      title: "Readiness & Recovery Diagnosis",
      text: "Your average sleep HRV dipped 14% over the last 10 days while training volume increased by 22%. Your nervous system is under-recovered. Recommending a 5-day deload with 60% load intensity.",
      meta: "Recovery Intelligence: Central Nervous System fatigue identified."
    }
  };

  function appendUserMessage(msg) {
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-bubble';
    userBubble.innerHTML = `<p>${msg}</p>`;
    chatMessages.appendChild(userBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-bubble ai-bubble typing-bubble';
    typingIndicator.innerHTML = `
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typingIndicator.remove();
      const answer = responses[msg] || {
        title: "FITNEXA Neural Analysis",
        text: `Analyzing "${msg}" across 500,000+ athletic datasets. Adjusting resistance parameters and recovery curve.`,
        meta: "AI Confidence: 98.4%"
      };

      const aiBubble = document.createElement('div');
      aiBubble.className = 'chat-bubble ai-bubble';
      aiBubble.innerHTML = `
        <div class="ai-bubble-header">
          <span class="ai-badge-dot"></span>
          <strong>${answer.title}</strong>
        </div>
        <p style="white-space: pre-line;">${answer.text}</p>
        <span class="ai-bubble-meta">${answer.meta}</span>
      `;
      chatMessages.appendChild(aiBubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.innerText.trim();
      appendUserMessage(text);
    });
  });

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', () => {
      const val = chatInput.value.trim();
      if (val) {
        appendUserMessage(val);
        chatInput.value = '';
      }
    });

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const val = chatInput.value.trim();
        if (val) {
          appendUserMessage(val);
          chatInput.value = '';
        }
      }
    });
  }
}

// 4. Smooth, Hardware-Accelerated 3D Card Hover Tilt
function initCard3DTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return; // Disable 3D tilt for reduced motion
  }

  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(card => {
    let rect = null;
    let ticking = false;
    let targetX = 0;
    let targetY = 0;

    card.style.willChange = 'transform';

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    }, { passive: true });

    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      targetX = ((y - centerY) / centerY) * -7;
      targetY = ((x - centerX) / centerX) * 7;

      if (!ticking) {
        requestAnimationFrame(() => {
          card.style.transform = `perspective(800px) rotateX(${targetX.toFixed(2)}deg) rotateY(${targetY.toFixed(2)}deg) translateY(-4px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      rect = null;
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }, { passive: true });
  });
}
