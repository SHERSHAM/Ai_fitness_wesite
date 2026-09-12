/**
 * FITNEXA AI — Motion & Micro-interaction FX Engine
 * 
 * 1. 3D Card Tilt with Specular Lighting
 * 2. Multi-layer Mouse Parallax
 * 3. Kinetic Typography & Clip-path reveals
 * 4. Seamless Page Transitions
 */

(function(window) {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

    const MotionFX = {
        /**
         * Initialize 3D Perspective Card Tilt on elements
         */
        initTilt: function(selector) {
            if (isTouch || prefersReducedMotion) return;

            const targets = document.querySelectorAll(selector || '.tilt-card, .workout-card, .value-card, .pricing-card');
            
            targets.forEach(function(card) {
                // Ensure parent has perspective
                if (!card.parentElement.style.perspective) {
                    card.parentElement.style.perspective = '1200px';
                }

                card.style.transformStyle = 'preserve-3d';
                card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease-out';
                card.style.willChange = 'transform';

                // Inject glare overlay
                let glare = card.querySelector('.tilt-glare');
                if (!glare) {
                    glare = document.createElement('div');
                    glare.className = 'tilt-glare';
                    glare.style.position = 'absolute';
                    glare.style.inset = '0';
                    glare.style.borderRadius = window.getComputedStyle(card).borderRadius;
                    glare.style.pointerEvents = 'none';
                    glare.style.opacity = '0';
                    glare.style.transition = 'opacity 0.25s ease';
                    glare.style.zIndex = '3';
                    card.style.position = 'relative';
                    card.appendChild(glare);
                }

                card.addEventListener('mouseenter', function() {
                    card.style.transition = 'transform 0.08s ease-out, box-shadow 0.2s ease-out';
                    glare.style.opacity = '1';
                });

                card.addEventListener('mousemove', function(e) {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const percentX = (x - centerX) / centerX;
                    const percentY = (y - centerY) / centerY;

                    const maxTilt = 4.5;
                    const tiltX = -percentY * maxTilt;
                    const tiltY = percentX * maxTilt;

                    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(8px)`;
                    glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 212, 255, 0.15) 0%, transparent 65%)`;
                });

                card.addEventListener('mouseleave', function() {
                    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                    glare.style.opacity = '0';
                });
            });
        },

        /**
         * Initialize Mouse Parallax on layered elements
         */
        initParallax: function(selector) {
            if (isTouch || prefersReducedMotion) return;

            const layers = document.querySelectorAll(selector || '[data-depth]');
            if (!layers.length) return;

            window.addEventListener('mousemove', function(e) {
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 2;
                const dx = (e.clientX - cx) / cx;
                const dy = (e.clientY - cy) / cy;

                layers.forEach(function(layer) {
                    const depth = parseFloat(layer.getAttribute('data-depth') || '0.05');
                    const moveX = dx * depth * 35;
                    const moveY = dy * depth * 35;
                    layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
                });
            }, { passive: true });
        },

        /**
         * Initialize smooth page transitions without jarring reloads
         */
        initPageTransitions: function() {
            if (prefersReducedMotion) return;

            // Page Entrance
            document.body.classList.add('page-transitioning');
            requestAnimationFrame(function() {
                document.body.style.transition = 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
                document.body.style.opacity = '1';
                document.body.style.transform = 'scale(1)';
            });

            // Page Exit
            document.querySelectorAll('a[href]').forEach(function(link) {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.getAttribute('target') === '_blank') {
                    return;
                }

                link.addEventListener('click', function(e) {
                    // Only internal pages
                    if (href.endsWith('.html') || href === '/' || href.startsWith('./') || !href.includes('://')) {
                        e.preventDefault();
                        document.body.style.opacity = '0';
                        document.body.style.transform = 'scale(0.985)';
                        setTimeout(function() {
                            window.location.href = href;
                        }, 220);
                    }
                });
            });
        },

        /**
         * Animate counter elements smoothly
         */
        animateValue: function(el, start, end, duration) {
            let startTimestamp = null;
            const step = function(timestamp) {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentVal = Math.floor(progress * (end - start) + start);
                el.textContent = currentVal.toLocaleString();
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    };

    window.MotionFX = MotionFX;

    document.addEventListener('DOMContentLoaded', function() {
        MotionFX.initTilt();
        MotionFX.initParallax();
        MotionFX.initPageTransitions();
    });
})(window);
