/**
 * FITNEXA AI — Subpage Motion Engine (subpage-motion.js)
 * Scroll-reveal + entrance animations for public marketing pages
 * (about, programs, ai-coach-overview, pricing, contact)
 *
 * Uses GSAP + ScrollTrigger for premium cinematic reveals.
 * Safe: all selectors are guard-checked so one script works across all subpages.
 */

(function() {
    'use strict';

    if (typeof gsap === 'undefined') {
        console.warn('[SubpageMotion] GSAP not loaded — skipping.');
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ── REDUCED MOTION: Snap to final state immediately ──────── */
    if (prefersReducedMotion) {
        document.querySelectorAll(
            '.sparta-spec-panel, .luxora-card, .timeline-step, .pricing-card, ' +
            '.value-card, .feature-card, [data-sr], section'
        ).forEach(function(el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    /* ── HELPER: Generic Scroll-Reveal ────────────────────────── */
    function reveal(selector, opts) {
        var defaults = { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' };
        var cfg = Object.assign({}, defaults, opts || {});
        var els = document.querySelectorAll(selector);
        if (!els.length) return;

        els.forEach(function(el, i) {
            gsap.from(el, {
                y: cfg.y,
                opacity: cfg.opacity,
                duration: cfg.duration,
                delay: i * cfg.stagger,
                ease: cfg.ease,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    once: true
                }
            });
        });
    }

    /* ── HELPER: Fade-in counter animation ────────────────────── */
    function animateCounters(container) {
        if (!container) return;
        var counters = container.querySelectorAll('[data-count]');
        if (!counters.length) return;

        ScrollTrigger.create({
            trigger: container,
            start: 'top 80%',
            once: true,
            onEnter: function() {
                counters.forEach(function(el) {
                    var target = parseInt(el.getAttribute('data-count'), 10);
                    var obj = { val: 0 };
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

    /* ── HERO ENTRANCE ────────────────────────────────────────── */
    function animateHero() {
        // Generic subpage hero entrance
        var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // About hero
        var aboutHeroTitle = document.querySelector('.about-hero-wrap h1, .about-hero-wrap .hero-title');
        var aboutHeroSub = document.querySelector('.about-hero-wrap p, .about-hero-wrap .hero-sub');
        var aboutHeroBadge = document.querySelector('.about-hero-wrap .spec-badge-gold, .about-hero-wrap .spec-badge-cyan');

        if (aboutHeroBadge) heroTl.from(aboutHeroBadge, { opacity: 0, y: 20, duration: 0.5 });
        if (aboutHeroTitle) heroTl.from(aboutHeroTitle, { opacity: 0, y: 50, duration: 0.7 }, '-=0.2');
        if (aboutHeroSub) heroTl.from(aboutHeroSub, { opacity: 0, y: 30, duration: 0.6 }, '-=0.3');

        // Programs hero
        var programsHeroTitle = document.querySelector('.programs-hero h1, .programs-hero .display-4');
        if (programsHeroTitle) {
            gsap.from(programsHeroTitle, { opacity: 0, y: 50, duration: 0.8, ease: 'power3.out' });
        }

        // Pricing hero
        var pricingTitle = document.querySelector('.pricing-hero h1, section h1');
        if (pricingTitle && !aboutHeroTitle && !programsHeroTitle) {
            gsap.from(pricingTitle, { opacity: 0, y: 40, duration: 0.7, ease: 'power3.out', delay: 0.2 });
        }

        // AI Coach overview hero
        var coachHero = document.querySelector('.coach-hero-title, .coach-hero h1');
        if (coachHero) {
            gsap.from(coachHero, { opacity: 0, y: 40, duration: 0.7, ease: 'power3.out', delay: 0.1 });
        }

        // Generic: any subpage hero section entrance
        var heroSection = document.querySelector('[data-hero-entrance]');
        if (heroSection) {
            var children = heroSection.querySelectorAll('[data-hero-child]');
            if (children.length) {
                gsap.from(children, {
                    opacity: 0, y: 40, duration: 0.7,
                    stagger: 0.15, ease: 'power3.out', delay: 0.15
                });
            }
        }
    }

    /* ── SECTION REVEALS ──────────────────────────────────────── */
    function initSectionReveals() {
        // Sparta Titan panels
        reveal('.sparta-spec-panel', { y: 50, duration: 0.9 });
        
        // Luxora cards
        reveal('.luxora-card', { y: 45, duration: 0.85 });

        // Timeline steps (about page)
        reveal('.timeline-step', { y: 60, duration: 0.9, stagger: 0.18 });

        // Pricing cards
        reveal('.pricing-card', { y: 50, duration: 0.85, stagger: 0.15 });

        // Value cards
        reveal('.value-card', { y: 40 });

        // Feature cards
        reveal('.feature-card', { y: 35, stagger: 0.1 });

        // FAQ items
        reveal('.faq-item, .accordion-item', { y: 25, duration: 0.6, stagger: 0.08 });

        // Generic data-sr attribute for manual reveals
        reveal('[data-sr]', { y: 35, duration: 0.75 });

        // Section headings
        document.querySelectorAll('section .section-title, section .display-5, section .display-4').forEach(function(heading) {
            gsap.from(heading, {
                opacity: 0, y: 30, duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 90%',
                    once: true
                }
            });
        });

        // Section eyebrows / labels
        document.querySelectorAll('.text-label, .spec-badge-gold, .spec-badge-cyan').forEach(function(badge) {
            // Skip if already animated by hero entrance
            if (badge.closest('.about-hero-wrap')) return;
            gsap.from(badge, {
                opacity: 0, y: 15, duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: badge,
                    start: 'top 92%',
                    once: true
                }
            });
        });

        // Telemetry clusters
        var telemetryClusters = document.querySelectorAll('.sparta-telemetry-cluster');
        telemetryClusters.forEach(function(cluster) {
            var items = cluster.querySelectorAll('.sparta-telemetry-item');
            if (!items.length) return;
            gsap.from(items, {
                opacity: 0, y: 30, scale: 0.95,
                duration: 0.6, stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: cluster,
                    start: 'top 85%',
                    once: true
                }
            });
        });

        // HUD corner brackets — subtle scale entrance
        document.querySelectorAll('.hud-corner-bracket').forEach(function(el) {
            gsap.from(el, {
                opacity: 0, scale: 0.97,
                duration: 0.7, ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    once: true
                }
            });
        });

        // Footer entrance
        var footer = document.querySelector('footer, .site-footer');
        if (footer) {
            gsap.from(footer, {
                opacity: 0, y: 30, duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 95%',
                    once: true
                }
            });
        }

        // Counters
        document.querySelectorAll('[data-count]').forEach(function(el) {
            var container = el.closest('section, .row, .stats-row, .luxora-stats-ribbon');
            if (container) animateCounters(container);
        });
    }

    /* ── NAVBAR SCROLL REVEAL ─────────────────────────────────── */
    function initNavEntrance() {
        var nav = document.querySelector('.fitnexa-nav, #mainNav');
        if (nav) {
            gsap.from(nav, { y: -25, opacity: 0, duration: 0.6, ease: 'power2.out' });
        }
    }

    /* ── PROGRAM TABS ANIMATION (programs.html) ───────────────── */
    function initProgramTabs() {
        var tabs = document.querySelectorAll('.program-tab-btn');
        if (!tabs.length) return;

        gsap.from(tabs, {
            opacity: 0, y: 20, duration: 0.5,
            stagger: 0.06, ease: 'power2.out', delay: 0.4
        });

        var stage = document.querySelector('.program-stage, #stageCard');
        if (stage) {
            gsap.from(stage, {
                opacity: 0, scale: 0.98, duration: 0.8,
                ease: 'power3.out', delay: 0.6
            });
        }
    }

    /* ── CONTACT FORM REVEAL ──────────────────────────────────── */
    function initContactReveals() {
        var form = document.querySelector('.contact-form, #contactForm');
        if (form) {
            gsap.from(form, {
                opacity: 0, x: -30, duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: form,
                    start: 'top 85%',
                    once: true
                }
            });
        }

        var infoCards = document.querySelectorAll('.contact-info-card, .contact-detail-card');
        if (infoCards.length) {
            gsap.from(infoCards, {
                opacity: 0, x: 30, duration: 0.7,
                stagger: 0.12, ease: 'power3.out',
                scrollTrigger: {
                    trigger: infoCards[0],
                    start: 'top 85%',
                    once: true
                }
            });
        }
    }

    /* ── 3D CANVAS REVEAL ─────────────────────────────────────── */
    function initCanvasReveal() {
        var canvases = document.querySelectorAll('[id$="AICoreCanvas"]');
        canvases.forEach(function(canvas) {
            gsap.from(canvas, {
                opacity: 0, scale: 0.9, duration: 1.2,
                ease: 'power2.out', delay: 0.3
            });
        });
    }

    /* ── BOOTSTRAP INIT ───────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function() {
        initNavEntrance();
        animateHero();
        initSectionReveals();
        initProgramTabs();
        initContactReveals();
        initCanvasReveal();
    });

    // Cleanup on page exit
    window.addEventListener('beforeunload', function() {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(function(st) { st.kill(); });
        }
    });

})();
