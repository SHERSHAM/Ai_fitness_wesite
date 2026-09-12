/* ============================================================
   FITNEXA AI — HIGH PERFORMANCE MOTION & SCROLL ENGINE
   Native Browser Scroll + GSAP ScrollTrigger
   Engineered for 60 FPS, GPU-accelerated motion & instant response
   ============================================================ */

(function() {
    'use strict';

    // ── REGISTER GSAP PLUGINS ──────────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    // ── ACCESSIBILITY / REDUCED MOTION & DEVICE CHECKS ─────────
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

    // ── NATIVE SCROLL — No Lenis, No Hijacking ─────────────────
    // ScrollTrigger uses native scroll position directly.
    // No custom wheel listeners, no smooth scroll interpolation.
    // The browser handles scrolling; GSAP handles animation.

    // Smooth anchor navigation using native scrollIntoView
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── UTILITY: Consolidated Counter Animation (1 Trigger per Container) ──
    function animateCounters(container) {
        const counters = container.querySelectorAll('[data-count]');
        if (!counters.length) return;

        ScrollTrigger.create({
            trigger: container,
            start: 'top 80%',
            once: true,
            onEnter: function() {
                counters.forEach(function(el) {
                    const target = parseInt(el.getAttribute('data-count'), 10);
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 1.6,
                        ease: 'power2.out',
                        onUpdate: function() {
                            el.textContent = Math.round(obj.val).toLocaleString();
                        }
                    });
                });
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // LOADING SCREEN (GPU-Accelerated Transform, Zero Layout Reflow)
    // ═══════════════════════════════════════════════════════════
    function initLoadingScreen() {
        const screen = document.getElementById('loadingScreen');
        const bar = document.getElementById('loadingBarFill');
        const logo = screen ? screen.querySelector('.loading-logo') : null;

        if (!screen) return;

        gsap.to(logo, { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power2.out' });

        // GPU-accelerated scaleX instead of width reflow
        gsap.set(bar, { scaleX: 0, transformOrigin: 'left center', width: '100%' });
        gsap.to(bar, {
            scaleX: 1,
            duration: 1.3,
            ease: 'power2.inOut',
            onComplete: function() {
                gsap.to(screen, {
                    opacity: 0,
                    duration: 0.35,
                    delay: 0.1,
                    onComplete: function() {
                        screen.style.display = 'none';
                        document.body.style.overflow = '';
                        initHeroLoadAnimation();
                        ScrollTrigger.refresh();
                    }
                });
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // HERO — ENTRANCE ANIMATION (Pure GPU Transforms & Opacity)
    // ═══════════════════════════════════════════════════════════
    function initHeroLoadAnimation() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('#heroBg', { opacity: 0, duration: 0.5 })
          .from('#heroGlow', {
              scale: 0.8, opacity: 0, duration: 0.8
          }, '-=0.3')
          .from('#heroAthlete', {
              scale: 1.06, opacity: 0, duration: 0.9, ease: 'power2.out'
          }, '-=0.5')
          .from('#heroEyebrow', {
              opacity: 0, y: 15, duration: 0.4
          }, '-=0.4')
          .from('#heroHeadline .line span', {
              y: 70, opacity: 0,
              duration: 0.7, stagger: 0.1
          }, '-=0.3')
          .from('#heroDesc', {
              opacity: 0, y: 20, duration: 0.5
          }, '-=0.3')
          .from('#heroButtons', {
              opacity: 0, y: 20, duration: 0.5
          }, '-=0.2')
          .from('#heroStatsCard', {
              opacity: 0, y: 25, duration: 0.5
          }, '-=0.3');

        animateCounters(document.getElementById('hero'));
    }

    // ═══════════════════════════════════════════════════════════
    // HERO — PINNED 3D SCROLL TIMELINE (180vh Choreographed Scrub)
    // ═══════════════════════════════════════════════════════════
    let heroAICore = null;

    function initHeroScrollAnimation() {
        // Initialize 3D AI Core inside hero
        const container = document.getElementById('heroAICoreContainer');
        if (container && window.Fitnexa3D && !heroAICore) {
            heroAICore = window.Fitnexa3D.createAICore(container, {
                size: Math.min(window.innerWidth * 0.5, 600),
                sphereRadius: 1.5,
                ringCount: 3,
                particlesCount: 110,
                cameraDistance: 5.2
            });
        }

        if (prefersReducedMotion) return;

        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: '+=180%',
                pin: true,
                pinSpacing: true,
                scrub: 0.5,
                anticipatePin: 1
            }
        });

        // 0% -> 20%: Sphere rotates, athlete glides subtly, headline begins panning left
        heroTl
            .to('#heroAthlete', { xPercent: 6, ease: 'power1.inOut', duration: 0.2 }, 0)
            .to('#heroHeadline', { xPercent: -12, scale: 1.05, ease: 'power1.inOut', duration: 0.2 }, 0)
            .to('#heroGlow', { scale: 1.15, opacity: 0.35, duration: 0.2 }, 0);

        // 20% -> 40%: Headline expands, athlete moves right, AI sphere centers
        heroTl
            .to('#heroHeadline', { xPercent: -28, scale: 1.15, ease: 'power1.inOut', duration: 0.2 }, 0.2)
            .to('#heroAthlete', { xPercent: 18, ease: 'power1.inOut', duration: 0.2 }, 0.2)
            .to('#heroAICoreContainer', { xPercent: 4, scale: 1.15, duration: 0.2 }, 0.2);

        // 40% -> 60%: Headline exits left, hero description fades
        heroTl
            .to('#heroHeadline', { xPercent: -50, opacity: 0, ease: 'power2.in', duration: 0.2 }, 0.4)
            .to('#heroDesc', { opacity: 0, y: -20, duration: 0.15 }, 0.4)
            .to('#heroButtons', { opacity: 0, y: 15, duration: 0.15 }, 0.4);

        // 60% -> 80%: AI sphere expands, background glow blooms, data cards elevate
        heroTl
            .to('#heroAICoreContainer', { scale: 1.45, opacity: 1, duration: 0.2 }, 0.6)
            .to('#heroStatsCard', { opacity: 1, yPercent: -10, scale: 1.05, duration: 0.2 }, 0.6)
            .to('#heroAthlete img', { scale: 1.12, opacity: 0.85, ease: 'none', duration: 0.2 }, 0.6)
            .to('#heroGlow', { scale: 1.5, opacity: 0.45, duration: 0.2 }, 0.6);

        // 80% -> 100%: Smooth scene transition towards subsequent sections
        heroTl
            .to('#heroStatsCard', { opacity: 0, yPercent: -30, duration: 0.2 }, 0.8)
            .to('#heroAthlete', { opacity: 0, xPercent: 25, duration: 0.2 }, 0.8)
            .to('#heroAICoreContainer', { opacity: 0.4, scale: 1.6, duration: 0.2 }, 0.8);
    }

    // ═══════════════════════════════════════════════════════════
    // TEXT TRANSFORM — PINNED SECTION TIMELINE
    // ═══════════════════════════════════════════════════════════
    function initTextTransformSection() {
        if (prefersReducedMotion) return;

        const section = document.getElementById('textTransformSection');
        const pinned = document.getElementById('textTransformPinned');
        const phrase1 = document.getElementById('phrase1');
        const phrase2 = document.getElementById('phrase2');
        const phrase3 = document.getElementById('phrase3');

        if (!section || !pinned || !phrase1 || !phrase2 || !phrase3) return;

        gsap.set(phrase1, { opacity: 1, yPercent: 0 });
        gsap.set(phrase2, { opacity: 0, yPercent: 20 });
        gsap.set(phrase3, { opacity: 0, yPercent: 20 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=160%',
                pin: true,
                pinSpacing: true,
                scrub: 0.4,
                anticipatePin: 1
            }
        });

        tl
            .to({}, { duration: 0.3 })
            .to(phrase1, { opacity: 0, yPercent: -20, ease: 'power2.in', duration: 0.6 })
            .fromTo(phrase2, { opacity: 0, yPercent: 20 }, { opacity: 1, yPercent: 0, ease: 'power2.out', duration: 0.6 })
            .to({}, { duration: 0.4 })
            .to(phrase2, { opacity: 0, yPercent: -20, ease: 'power2.in', duration: 0.6 })
            .fromTo(phrase3, { opacity: 0, yPercent: 20 }, { opacity: 1, yPercent: 0, ease: 'power2.out', duration: 0.6 })
            .to({}, { duration: 0.4 });
    }

    // ═══════════════════════════════════════════════════════════
    // AI INTRO — Consolidated Section Timeline
    // ═══════════════════════════════════════════════════════════
    function initAIIntro() {
        const section = document.getElementById('ai-intro');
        if (!section) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                once: true
            }
        });

        tl.from('#aiIntroHeadline .line span', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        })
        .from('.ai-data-card', {
            y: 35,
            opacity: 0,
            scale: 0.94,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out'
        }, '-=0.4');

        if (!prefersReducedMotion && window.innerWidth >= 992) {
            gsap.to('#aiIntroHeadline', {
                xPercent: -4,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.3
                }
            });
        }

        animateCounters(section);
    }

    // ═══════════════════════════════════════════════════════════
    // AI VISUALIZATION — Nodes + Rings
    // ═══════════════════════════════════════════════════════════
    function initAIVisualization() {
        const section = document.getElementById('ai-visualization');
        if (!section) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                once: true
            }
        });

        tl.from('.ai-core-ring', {
            scale: 0.6,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out'
        })
        .from('.ai-node', {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: 'back.out(1.5)'
        }, '-=0.4');

        if (!prefersReducedMotion) {
            gsap.to('.ai-core-ring:nth-child(2)', {
                rotation: 360,
                duration: 60,
                repeat: -1,
                ease: 'none'
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // AI COACH — Chat Bubbles + Coach Portrait
    // ═══════════════════════════════════════════════════════════
    function initAICoach() {
        const section = document.getElementById('ai-coach');
        if (!section) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                once: true
            }
        });

        tl.from('#coachHeadline .line span', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        })
        .from('#coachImage', {
            scale: 0.94,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.chat-bubble', {
            x: function(i) { return i % 2 === 0 ? 40 : -40; },
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out'
        }, '-=0.4');

        if (!prefersReducedMotion && window.innerWidth >= 992) {
            gsap.to('#coachImage', {
                yPercent: -5,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.3
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // WORKOUTS — Dynamic Horizontal Pinned Track
    // ═══════════════════════════════════════════════════════════
    function initWorkouts() {
        const section = document.getElementById('workouts');
        const wrapper = document.getElementById('workoutWrapper');
        const track = document.getElementById('workoutTrack');

        if (!section || !wrapper || !track) return;

        gsap.from('#workoutHeadline', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true
            }
        });

        // Dynamic horizontal pinned track on desktop
        if (window.innerWidth >= 992 && !prefersReducedMotion) {
            const getScrollAmount = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);

            gsap.to(track, {
                x: () => -getScrollAmount(),
                ease: 'none',
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top top',
                    end: () => '+=' + getScrollAmount(),
                    pin: true,
                    scrub: 0.4,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });
        }

        gsap.from('.workout-card', {
            scale: 0.92,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: wrapper,
                start: 'top 85%',
                once: true
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // WORKOUT PLAYER
    // ═══════════════════════════════════════════════════════════
    function initWorkoutPlayer() {
        const section = document.getElementById('workout-player');
        if (!section) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                once: true
            }
        });

        tl.from('#playerContainer', {
            scale: 0.94,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
        .from('#playerAiTip', {
            x: -30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.3');

        animateCounters(section);
    }

    // ═══════════════════════════════════════════════════════════
    // FORM ANALYSIS — Tracking Points & SVG Lines
    // ═══════════════════════════════════════════════════════════
    function initFormAnalysis() {
        const container = document.getElementById('formAthleteContainer');
        if (!container) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: 'top 70%',
                once: true
            }
        });

        tl.to('.tracking-point', {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: 'back.out(2)'
        })
        .to('#trackingLines line', {
            strokeDashoffset: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out'
        }, '-=0.2');

        const scoreEl = document.getElementById('formScoreValue');
        if (scoreEl) {
            const scoreObj = { val: 72 };
            gsap.to(scoreObj, {
                val: 94,
                duration: 1.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 70%',
                    once: true
                },
                onUpdate: function() {
                    scoreEl.textContent = Math.round(scoreObj.val);
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // DASHBOARD — Performance & Stats
    // ═══════════════════════════════════════════════════════════
    function initDashboard() {
        const section = document.getElementById('dashboard');
        if (!section) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                once: true
            }
        });

        tl.from('#dashboardContainer', {
            scale: 0.94,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
        .from('.dash-stat', {
            y: 25,
            opacity: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out'
        }, '-=0.4');

        const graphLine = document.getElementById('graphLine');
        const graphArea = document.getElementById('graphArea');
        if (graphLine) {
            const length = graphLine.getTotalLength ? graphLine.getTotalLength() : 1200;
            gsap.set(graphLine, { strokeDasharray: length, strokeDashoffset: length });
            tl.to(graphLine, {
                strokeDashoffset: 0,
                duration: 1.6,
                ease: 'power2.out'
            }, '-=0.3');
        }

        if (graphArea) {
            tl.from(graphArea, {
                opacity: 0,
                duration: 1.2,
                ease: 'power1.out'
            }, '-=1.2');
        }

        tl.from('.graph-dot', {
            scale: 0,
            duration: 0.35,
            stagger: 0.08,
            ease: 'back.out(2)'
        }, '-=0.8');

        animateCounters(section);
    }

    // ═══════════════════════════════════════════════════════════
    // PROGRESS STORY — Weeks Stagger
    // ═══════════════════════════════════════════════════════════
    function initProgressStory() {
        const section = document.getElementById('progress-story');
        if (!section) return;

        gsap.from('.progress-week', {
            x: function(i) { return (i % 2 === 0 ? -35 : 35); },
            opacity: 0,
            scale: 0.94,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#progressTimeline',
                start: 'top 80%',
                once: true
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // NUTRITION — Macros & Meals
    // ═══════════════════════════════════════════════════════════
    function initNutrition() {
        const section = document.getElementById('nutrition');
        if (!section) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                once: true
            }
        });

        tl.from('#nutritionHeadline .line span', {
            y: 40,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
        })
        .from('.macro-item', {
            y: 25,
            opacity: 0,
            scale: 0.94,
            duration: 0.5,
            stagger: 0.07,
            ease: 'power3.out'
        }, '-=0.3')
        .from('.meal-card', {
            x: 35,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.3');

        animateCounters(section);
    }

    // ═══════════════════════════════════════════════════════════
    // RECOVERY — Ring Drawing & Score
    // ═══════════════════════════════════════════════════════════
    function initRecovery() {
        const section = document.getElementById('recovery');
        if (!section) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                once: true
            }
        });

        tl.from('#recoveryHeadline', {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        const outerRing = document.getElementById('recoveryRingOuter');
        if (outerRing) {
            const circumference = 2 * Math.PI * 120;
            const offset = circumference * (1 - 0.86);
            tl.to(outerRing, {
                strokeDashoffset: offset,
                duration: 1.8,
                ease: 'power2.out'
            }, '-=0.4');
        }

        const innerRing = document.getElementById('recoveryRingInner');
        if (innerRing) {
            const circumference = 2 * Math.PI * 90;
            const offset = circumference * (1 - 0.78);
            tl.to(innerRing, {
                strokeDashoffset: offset,
                duration: 1.8,
                ease: 'power2.out'
            }, '-=1.6');
        }

        tl.from('.recovery-stat', {
            y: 25,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out'
        }, '-=1.2');

        animateCounters(section);
    }

    // ═══════════════════════════════════════════════════════════
    // EDITORIAL TRANSITION — Clean Centered Pinning
    // ═══════════════════════════════════════════════════════════
    function initEditorialTransition() {
        const section = document.getElementById('editorial-transition');
        const pinned = document.getElementById('editorialPinned');
        const text1 = document.getElementById('editorialText1');
        const text2 = document.getElementById('editorialText2');
        const athlete = document.getElementById('editorialAthlete');
        const line1 = document.getElementById('editLine1');
        const line2 = document.getElementById('editLine2');
        const line3 = document.getElementById('editLine3');

        if (!section || !pinned || !text1 || !text2 || !athlete) return;

        if (prefersReducedMotion) {
            gsap.from(text1, { opacity: 0, duration: 0.8, scrollTrigger: { trigger: section, start: 'top 70%', once: true } });
            return;
        }

        gsap.set(athlete, { xPercent: 100, yPercent: -50 });
        gsap.set(text2, { opacity: 0, yPercent: 20 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=160%',
                pin: true,
                pinSpacing: true,
                scrub: 0.4,
                anticipatePin: 1
            }
        });

        tl
            .to({}, { duration: 0.3 })
            .to(line1, { xPercent: -60, opacity: 0, ease: 'power1.in', duration: 0.8 }, 0.3)
            .to(line2, { xPercent: 60, opacity: 0, ease: 'power1.in', duration: 0.8 }, 0.3)
            .to(line3, { yPercent: 40, opacity: 0, ease: 'power1.in', duration: 0.8 }, 0.3)
            .to(athlete, { xPercent: -50, ease: 'power2.out', duration: 1.0 }, 0.4)
            .to(text2, { opacity: 1, yPercent: 0, ease: 'power2.out', duration: 0.7 }, 1.3)
            .to({}, { duration: 0.5 })
            .to([text2, athlete], { opacity: 0, scale: 0.96, ease: 'power1.in', duration: 0.5 });
    }

    // ═══════════════════════════════════════════════════════════
    // FINAL CTA — Cinematic Zoom
    // ═══════════════════════════════════════════════════════════
    function initFinalCTA() {
        const section = document.getElementById('final-cta');
        if (!section) return;

        gsap.from('#ctaHeadline', {
            y: 50,
            opacity: 0,
            scale: 0.96,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                once: true
            }
        });

        if (!prefersReducedMotion) {
            gsap.to('#ctaBgImage img', {
                scale: 1.12,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.3
                }
            });
        }

        gsap.from('.cta-button-wrapper', {
            y: 25,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 65%',
                once: true
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // NAVBAR — Scroll State Class
    // ═══════════════════════════════════════════════════════════
    function initNavbar() {
        const nav = document.getElementById('mainNav');
        const toggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (!nav) return;

        ScrollTrigger.create({
            trigger: document.body,
            start: '60px top',
            onEnter: function() { nav.classList.add('scrolled'); },
            onLeaveBack: function() { nav.classList.remove('scrolled'); }
        });

        if (toggle && mobileMenu) {
            toggle.addEventListener('click', function() {
                toggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });

            document.querySelectorAll('[data-mobile-link]').forEach(function(link) {
                link.addEventListener('click', function() {
                    toggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // SCROLL PROGRESS INDICATOR
    // ═══════════════════════════════════════════════════════════
    function initScrollProgress() {
        const dots = document.querySelectorAll('.scroll-progress .progress-dot');
        const sections = [
            'hero', 'ai-intro', 'ai-coach', 'workouts',
            'dashboard', 'nutrition', 'recovery', 'final-cta'
        ];

        sections.forEach(function(sectionId, index) {
            const el = document.getElementById(sectionId);
            if (!el) return;

            ScrollTrigger.create({
                trigger: el,
                start: 'top center',
                end: 'bottom center',
                onEnter: function() { setActiveDot(index); },
                onEnterBack: function() { setActiveDot(index); }
            });
        });

        function setActiveDot(index) {
            dots.forEach(function(dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // BACKGROUND MOTION — Slow, Gentle GPU Drift (Single Element)
    // ═══════════════════════════════════════════════════════════
    function initBackgroundMotion() {
        if (prefersReducedMotion || isTouch) return;

        const heroGlow = document.getElementById('heroGlow');
        if (heroGlow) {
            gsap.to(heroGlow, {
                x: 15,
                y: -15,
                duration: 12,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // FOOTER ANIMATION
    // ═══════════════════════════════════════════════════════════
    function initFooter() {
        const footer = document.querySelector('.fitnexa-footer');
        if (!footer) return;
        
        gsap.from('.fitnexa-footer .row > div', {
            y: 25,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.fitnexa-footer',
                start: 'top 85%',
                once: true
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // INITIALIZATION (Scoped via gsap.context)
    // ═══════════════════════════════════════════════════════════
    let rootCtx = null;

    function init() {
        if (rootCtx) rootCtx.revert();

        rootCtx = gsap.context(function() {
            initLoadingScreen();
            initNavbar();
            initScrollProgress();
            initHeroScrollAnimation();
            initTextTransformSection();
            initAIIntro();
            initAIVisualization();
            initAICoach();
            initWorkouts();
            initWorkoutPlayer();
            initFormAnalysis();
            initDashboard();
            initProgressStory();
            initNutrition();
            initRecovery();
            initEditorialTransition();
            initFinalCTA();
            initBackgroundMotion();
            initFooter();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Debounced resize handler for ScrollTrigger refresh
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            ScrollTrigger.refresh();
        }, 150);
    }, { passive: true });

})();
