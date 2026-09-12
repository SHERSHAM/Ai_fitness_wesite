/* ============================================================
   FITNEXA AI — CUSTOM CURSOR (PERFORMANCE OPTIMIZED)
   - GPU-accelerated transforms via GSAP quickSetter (no layout reflows)
   - Synchronized with GSAP ticker (no independent RAF loop)
   - Automatically idles when stationary (zero CPU waste)
   - Clean event delegation for hover states
   - Fully disabled on touch / mobile devices
   ============================================================ */

(function () {
    'use strict';

    // Disable completely on touch devices and small screens
    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    if (isTouch || window.innerWidth < 992) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const label = document.getElementById('cursorLabel');

    if (!dot || !ring || !label) return;

    // Use GSAP quickSetter for high-frequency sub-millisecond transform updates
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');
    const setRingX = gsap.quickSetter(ring, 'x', 'px');
    const setRingY = gsap.quickSetter(ring, 'y', 'px');
    const setLabelX = gsap.quickSetter(label, 'x', 'px');
    const setLabelY = gsap.quickSetter(label, 'y', 'px');

    // Centered origin via GSAP transforms
    gsap.set([dot, ring, label], { xPercent: -50, yPercent: -50 });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let isMoving = true;

    // Track mouse coordinates (passive listener for maximum scroll responsiveness)
    window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
    }, { passive: true });

    // Smooth cursor follower executed inside the unified GSAP ticker
    function updateCursor() {
        if (!isMoving) return;

        const dX = mouseX - dotX;
        const dY = mouseY - dotY;
        const rX = mouseX - ringX;
        const rY = mouseY - ringY;

        // Interpolate positions
        dotX += dX * 0.35;
        dotY += dY * 0.35;
        ringX += rX * 0.15;
        ringY += rY * 0.15;

        // Apply hardware-accelerated transforms
        setDotX(dotX);
        setDotY(dotY);
        setRingX(ringX);
        setRingY(ringY);
        setLabelX(ringX);
        setLabelY(ringY);

        // Sleep when cursor has caught up to save CPU cycles
        if (Math.abs(dX) < 0.1 && Math.abs(dY) < 0.1 && Math.abs(rX) < 0.1 && Math.abs(rY) < 0.1) {
            isMoving = false;
        }
    }

    // Attach to GSAP's central ticker instead of maintaining a separate requestAnimationFrame loop
    gsap.ticker.add(updateCursor);

    // Efficient event delegation for hover states (zero listener overhead)
    document.addEventListener('mouseover', function (e) {
        const target = e.target;
        if (!target) return;

        const viewEl = target.closest('[data-cursor="view"]');
        if (viewEl) {
            document.body.classList.add('cursor-view');
            label.textContent = 'VIEW';
            return;
        }

        const hoverEl = target.closest('[data-cursor="hover"], a, button, .btn, .workout-card');
        if (hoverEl) {
            document.body.classList.add('cursor-hover');
        }
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
        const target = e.target;
        if (!target) return;

        const viewEl = target.closest('[data-cursor="view"]');
        if (viewEl) {
            document.body.classList.remove('cursor-view');
        }

        const hoverEl = target.closest('[data-cursor="hover"], a, button, .btn, .workout-card');
        if (hoverEl) {
            document.body.classList.remove('cursor-hover');
        }
    }, { passive: true });

    // Visibility toggles when entering / leaving browser viewport
    document.addEventListener('mouseleave', function () {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    }, { passive: true });

    document.addEventListener('mouseenter', function () {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        isMoving = true;
    }, { passive: true });

})();
