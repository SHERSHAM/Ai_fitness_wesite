/**
 * FITNEXA AI — Centralized Post-Login & App Motion Engine (app-motion.js)
 * High-performance GSAP + ScrollTrigger animation layer for all protected and auth pages.
 * 
 * Features:
 * - Lazy ScrollTrigger reveals with 'once: true'
 * - Component guards (safe across all pages)
 * - Zero Layout Shift (CLS) — animates transform & opacity only
 * - Full prefers-reduced-motion accessibility support
 * - Clean ScrollTrigger lifecycle management on page transitions
 * - Kinetic numeric rollups & SVG strokeDashoffset drawing
 */

(function(window) {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const AppMotion = {
        scrollTriggers: [],

        init: function() {
            if (typeof gsap === 'undefined') {
                console.warn('GSAP not loaded. Skipping AppMotion initialization.');
                return;
            }

            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }

            // Clean up ScrollTrigger instances on page exit to avoid fighting page transitions
            window.addEventListener('beforeunload', () => this.destroy());

            // Run page-specific animations safely guarded by DOM selectors
            if (prefersReducedMotion) {
                this.initReducedMotion();
                return;
            }

            this.initGlobalTopbar();
            this.initDashboard();
            this.initWorkouts();
            this.initWorkoutDetail();
            this.initWorkoutSession();
            this.initAICoach();
            this.initNutrition();
            this.initRecovery();
            this.initProgress();
            this.initProfileAndSettings();
            this.initAuthAndOnboarding();
        },

        /**
         * Graceful reduced motion handling — skip to complete visual state
         */
        initReducedMotion: function() {
            document.querySelectorAll('.dash-card, .workout-lib-card, .exercise-item, .meal-plan-item, .timeline-milestone').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        },

        /**
         * Global Topbar & Navigation Entrance
         */
        initGlobalTopbar: function() {
            const topbar = document.querySelector('.app-topbar');
            if (topbar) {
                gsap.from(topbar, {
                    y: -20,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        },

        /**
         * 1. Dashboard Page Animations
         */
        initDashboard: function() {
            const dashboardMount = document.querySelector('.page-title');
            if (!dashboardMount || !document.getElementById('statProgress')) return;

            // Header & Welcome stagger
            const titles = document.querySelectorAll('.page-title, .page-subtitle');
            if (titles.length) {
                gsap.from(titles, {
                    y: 15,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            }

            // Stat Cards Stagger Entrance
            const statCards = document.querySelectorAll('.dash-stat-card');
            if (statCards.length) {
                gsap.from(statCards, {
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power3.out',
                    delay: 0.15
                });
            }

            // Kinetic Number Rollups
            this.animateCounter('#statProgress', '%', 1.2);
            this.animateCounter('#statCalories', '', 1.4);
            this.animateCounter('#statActiveDays', '', 1.0);
            this.animateCounter('#statHours', 'h', 1.0);
            this.animateCounter('#chartStrength', '%', 1.2);
            this.animateCounter('#chartEndurance', '%', 1.2);
            this.animateCounter('#recoveryScore', '%', 1.2);

            // Today's workout hero card and performance ring card
            const todayCard = document.querySelector('.dash-workout-card');
            const ringCard = document.getElementById('dashPerformanceRing');
            if (todayCard) {
                gsap.from(todayCard, {
                    y: 25,
                    opacity: 0,
                    duration: 0.6,
                    delay: 0.25,
                    ease: 'power2.out'
                });
            }
            if (ringCard && ringCard.closest('.dash-card')) {
                gsap.from(ringCard.closest('.dash-card'), {
                    scale: 0.96,
                    opacity: 0,
                    duration: 0.6,
                    delay: 0.35,
                    ease: 'power2.out'
                });
            }

            // Recent workout history items
            const historyItems = document.querySelectorAll('.dhi-item');
            if (historyItems.length) {
                gsap.from(historyItems, {
                    x: -15,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.08,
                    delay: 0.4,
                    ease: 'power2.out'
                });
            }
        },

        /**
         * 2. Workouts Library Page Animations
         */
        initWorkouts: function() {
            const grid = document.getElementById('workoutGrid');
            if (!grid) return;

            // Stagger initial cards on load
            const cards = grid.querySelectorAll('.workout-lib-card');
            if (cards.length) {
                this.staggerCards(cards);
            }

            // Filter pills interactive smooth morph
            const pills = document.querySelectorAll('.filter-pill');
            pills.forEach(pill => {
                pill.addEventListener('click', () => {
                    // Small spring scale on click
                    gsap.fromTo(pill, { scale: 0.92 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
                    
                    // Allow DOM update, then animate re-rendered cards
                    setTimeout(() => {
                        const newCards = grid.querySelectorAll('.workout-lib-card');
                        this.staggerCards(newCards);
                    }, 50);
                });
            });
        },

        /**
         * Helper: Stagger animate card collections
         */
        staggerCards: function(cards) {
            if (!cards || !cards.length || prefersReducedMotion) return;
            gsap.fromTo(cards, 
                { opacity: 0, y: 22, scale: 0.98 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.06,
                    ease: 'power2.out',
                    clearProps: 'transform'
                }
            );
        },

        /**
         * 3. Workout Detail Page Animations
         */
        initWorkoutDetail: function() {
            const detailMount = document.getElementById('detailTitle');
            if (!detailMount) return;

            // Header info stagger
            const headerItems = document.querySelectorAll('.workout-detail-header > *');
            if (headerItems.length) {
                gsap.from(headerItems, {
                    y: 18,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out'
                });
            }

            // Exercise items stagger reveal on scroll
            const exercises = document.querySelectorAll('.exercise-item');
            if (exercises.length) {
                gsap.from(exercises, {
                    y: 25,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '#exerciseList',
                        start: 'top 85%',
                        once: true
                    }
                });
            }

            // Exercise action buttons
            const actionBtns = document.querySelector('.detail-actions');
            if (actionBtns) {
                gsap.from(actionBtns, {
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.4,
                    delay: 0.3,
                    ease: 'back.out(1.5)'
                });
            }
        },

        /**
         * 4. Workout Session HUD Player Animations
         */
        initWorkoutSession: function() {
            const playerMount = document.getElementById('workoutPlayerMount');
            if (!playerMount) return;

            const stageCard = document.querySelector('.player-stage-card');
            if (stageCard) {
                gsap.from(stageCard, {
                    scale: 0.97,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            }

            const controlsBar = document.querySelector('.player-controls-bar, .player-controls-card');
            if (controlsBar) {
                gsap.from(controlsBar, {
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.2,
                    ease: 'power2.out'
                });
            }
        },

        /**
         * 5. AI Coach Chat Interface Animations
         */
        initAICoach: function() {
            const chatContainer = document.getElementById('chatMessages');
            if (!chatContainer) return;

            // Initial prompt chips stagger
            const chips = document.querySelectorAll('.acp-chip');
            if (chips.length) {
                gsap.from(chips, {
                    x: 15,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: 'power2.out'
                });
            }

            // Chat input bar entrance
            const inputBar = document.querySelector('.acp-input-bar');
            if (inputBar) {
                gsap.from(inputBar, {
                    y: 15,
                    opacity: 0,
                    duration: 0.4,
                    delay: 0.2,
                    ease: 'power2.out'
                });
            }

            // Watch for new messages added to DOM and animate them smoothly
            const observer = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList.contains('acp-msg') && !node.classList.contains('acp-typing')) {
                            gsap.fromTo(node,
                                { opacity: 0, y: 12, scale: 0.98 },
                                { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
                            );
                        }
                    });
                });
            });

            observer.observe(chatContainer, { childList: true });
        },

        /**
         * 6. Nutrition Tracker Animations
         */
        initNutrition: function() {
            const calTarget = document.getElementById('calorieValue') || document.getElementById('nutrCaloriesTarget');
            if (!calTarget) return;

            // Header and summary cards
            const nutrCards = document.querySelectorAll('.nutrition-ring-card, .dash-card');
            if (nutrCards.length) {
                gsap.from(nutrCards, {
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out'
                });
            }

            // Kinetic counters for daily targets
            this.animateCounter('#calorieValue', '', 1.2);
            this.animateCounter('#nutrCaloriesTarget', '', 1.2);
            this.animateCounter('#proteinValue', 'g', 1.2);
            this.animateCounter('#nutrProteinTarget', 'g', 1.2);
            this.animateCounter('#carbsValue', 'g', 1.2);
            this.animateCounter('#nutrCarbsTarget', 'g', 1.2);
            this.animateCounter('#fatValue', 'g', 1.2);
            this.animateCounter('#nutrFatTarget', 'g', 1.2);

            // Meal items stagger
            const meals = document.querySelectorAll('.meal-plan-item');
            if (meals.length) {
                gsap.from(meals, {
                    x: -20,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.08,
                    scrollTrigger: {
                        trigger: '#mealList',
                        start: 'top 85%',
                        once: true
                    }
                });
            }
        },

        /**
         * 7. Biometric Recovery Page Animations
         */
        initRecovery: function() {
            const recoveryMount = document.getElementById('recScore') || document.getElementById('recReadinessVal');
            if (!recoveryMount) return;

            // Score ring card entrance
            const ringWrap = document.querySelector('.recovery-ring-wrapper, .recovery-ring-wrap');
            if (ringWrap) {
                gsap.from(ringWrap, {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'back.out(1.4)'
                });
            }

            // Stat items stagger
            const recStats = document.querySelectorAll('.dash-stat-card, .recovery-stat-card, .rec-item');
            if (recStats.length) {
                gsap.from(recStats, {
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out',
                    delay: 0.2
                });
            }

            // Animate metric numbers
            this.animateCounter('#recScore', '%', 1.4);
            this.animateCounter('#recEfficiency', '%', 1.2);
            this.animateCounter('#recHR', ' BPM', 1.2);
            this.animateCounter('#recHRV', ' ms', 1.2);

            // AI Insight recommendation banner
            const aiInsight = document.getElementById('recAIMessage');
            if (aiInsight && aiInsight.closest('.dash-card')) {
                gsap.from(aiInsight.closest('.dash-card'), {
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.35,
                    ease: 'power2.out'
                });
            }
        },

        /**
         * 8. Progress Analytics & History Page Animations
         */
        initProgress: function() {
            const curve = document.querySelector('#progDrawLine, #progressCurvePath');
            if (curve) {
                const len = curve.getTotalLength ? curve.getTotalLength() : 900;
                gsap.set(curve, { strokeDasharray: len, strokeDashoffset: len });
                gsap.to(curve, {
                    strokeDashoffset: 0,
                    duration: 1.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: curve.closest('svg') || curve,
                        start: 'top 85%',
                        once: true
                    }
                });
            }

            // Stagger 12-week progression milestone timeline
            const milestones = document.querySelectorAll('.timeline-milestone, .history-log-item');
            if (milestones.length) {
                gsap.from(milestones, {
                    y: 20,
                    opacity: 0,
                    duration: 0.45,
                    stagger: 0.06,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: milestones[0].parentElement,
                        start: 'top 85%',
                        once: true
                    }
                });
            }

            // Summary metric cards
            const metricCards = document.querySelectorAll('.progress-metric-card, .dash-stat-card');
            if (metricCards.length) {
                gsap.from(metricCards, {
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out'
                });
            }
        },

        /**
         * 9. Profile & Settings Pages Animations
         */
        initProfileAndSettings: function() {
            const profileForm = document.getElementById('profileForm') || document.getElementById('passwordForm');
            if (!profileForm) return;

            const dashCards = document.querySelectorAll('.dash-card');
            if (dashCards.length) {
                gsap.from(dashCards, {
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            }

            // Smooth feedback on save buttons
            const saveBtns = document.querySelectorAll('button[type="submit"]');
            saveBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
                });
            });
        },

        /**
         * 10. Auth Pages & Onboarding Wizard Animations
         */
        initAuthAndOnboarding: function() {
            const authCard = document.querySelector('.auth-form-container, .auth-form-wrap');
            if (authCard) {
                gsap.from(authCard, {
                    y: 25,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                });
            }

            // Onboarding step smooth transition helper
            const obCard = document.querySelector('.onboarding-card');
            if (obCard) {
                gsap.from(obCard, {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                });

                // Listen for next/back clicks in onboarding to slide steps smoothly
                const btnNext = document.getElementById('obBtnNext');
                const btnBack = document.getElementById('obBtnBack');
                [btnNext, btnBack].forEach(btn => {
                    if (btn) {
                        btn.addEventListener('click', () => {
                            const body = document.getElementById('obBody');
                            if (body) {
                                gsap.fromTo(body, 
                                    { opacity: 0, x: 20 },
                                    { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
                                );
                            }
                        });
                    }
                });
            }
        },

        /**
         * Utility: Animate numeric element smoothly from 0 to its target value
         */
        animateCounter: function(selector, suffix = '', duration = 1.2) {
            const el = document.querySelector(selector);
            if (!el) return;

            const rawText = el.textContent.trim();
            const numericMatch = rawText.match(/[\d,\.]+/);
            if (!numericMatch) return;

            const targetVal = parseFloat(numericMatch[0].replace(/,/g, ''));
            if (isNaN(targetVal)) return;

            const obj = { val: 0 };
            const isFloat = numericMatch[0].includes('.');

            gsap.to(obj, {
                val: targetVal,
                duration: duration,
                ease: 'power2.out',
                onUpdate: function() {
                    const formatted = isFloat ? obj.val.toFixed(1) : Math.round(obj.val).toLocaleString();
                    el.textContent = formatted + suffix;
                }
            });
        },

        /**
         * Clean up active ScrollTrigger instances
         */
        destroy: function() {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.getAll().forEach(t => t.kill());
            }
        }
    };

    window.AppMotion = AppMotion;

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AppMotion.init());
    } else {
        AppMotion.init();
    }
})(window);
