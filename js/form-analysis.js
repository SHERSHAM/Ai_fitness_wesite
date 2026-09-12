/**
 * FITNEXA AI — Computer Vision AI Form Analysis Overlay Visualizer
 * 
 * Simulates advanced camera-based joint tracking, skeletal telemetry,
 * real-time joint angle analysis, and animated form scoring (72% -> 94%).
 */

(function(window) {
    'use strict';

    const FormAnalysis = {
        /**
         * Initialize the AI Form Analysis HUD over an image or target container
         */
        init: function(container) {
            const el = typeof container === 'string' ? document.querySelector(container) : container;
            if (!el) return;

            // Target joints relative to athlete positioning (%)
            const joints = [
                { id: 'shoulder', x: 44, y: 32, label: 'SHOULDER 178°' },
                { id: 'elbow', x: 38, y: 44, label: 'ELBOW 92°' },
                { id: 'wrist', x: 32, y: 52, label: 'WRIST' },
                { id: 'hip', x: 50, y: 56, label: 'HIP FLEXION 114°' },
                { id: 'knee', x: 54, y: 72, label: 'KNEE 92° [OPTIMAL]' },
                { id: 'ankle', x: 52, y: 88, label: 'ANKLE ANGLE 84°' }
            ];

            const connections = [
                ['shoulder', 'elbow'],
                ['elbow', 'wrist'],
                ['shoulder', 'hip'],
                ['hip', 'knee'],
                ['knee', 'ankle']
            ];

            // Build HUD overlay container
            const overlay = document.createElement('div');
            overlay.className = 'cv-form-overlay';
            overlay.style.position = 'absolute';
            overlay.style.inset = '0';
            overlay.style.pointerEvents = 'none';
            overlay.style.overflow = 'hidden';
            overlay.style.zIndex = '5';

            // SVG Skeleton Lines
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 100 100');
            svg.setAttribute('preserveAspectRatio', 'none');
            svg.style.position = 'absolute';
            svg.style.inset = '0';
            svg.style.width = '100%';
            svg.style.height = '100%';

            connections.forEach(function(pair, idx) {
                const j1 = joints.find(j => j.id === pair[0]);
                const j2 = joints.find(j => j.id === pair[1]);
                if (j1 && j2) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', j1.x);
                    line.setAttribute('y1', j1.y);
                    line.setAttribute('x2', j2.x);
                    line.setAttribute('y2', j2.y);
                    line.setAttribute('stroke', 'rgba(0, 212, 255, 0.7)');
                    line.setAttribute('stroke-width', '0.6');
                    line.setAttribute('stroke-dasharray', '2 1');
                    line.style.animation = `cvPulse 2s ease-in-out infinite alternate ${idx * 0.2}s`;
                    svg.appendChild(line);
                }
            });
            overlay.appendChild(svg);

            // Joint Node Badges
            joints.forEach(function(j) {
                const node = document.createElement('div');
                node.className = 'cv-joint-node';
                node.style.position = 'absolute';
                node.style.left = j.x + '%';
                node.style.top = j.y + '%';
                node.style.transform = 'translate(-50%, -50%)';
                node.style.display = 'flex';
                node.style.alignItems = 'center';
                node.style.gap = '6px';

                node.innerHTML = `
                    <span style="position:relative;width:12px;height:12px;display:flex;align-items:center;justify-content:center;">
                        <span style="position:absolute;width:100%;height:100%;border-radius:50%;background:#00d4ff;opacity:0.4;animation:cvRadar 1.8s ease-out infinite;"></span>
                        <span style="width:6px;height:6px;border-radius:50%;background:#00d4ff;box-shadow:0 0 8px #00d4ff;"></span>
                    </span>
                    <span style="font-family:var(--font-heading);font-size:0.65rem;font-weight:700;letter-spacing:0.06em;color:#fff;background:rgba(2,5,10,0.85);border:1px solid rgba(0,212,255,0.4);padding:2px 6px;border-radius:4px;white-space:nowrap;backdrop-filter:blur(4px);">
                        ${j.label}
                    </span>
                `;
                overlay.appendChild(node);
            });

            // Form Score Badge Card
            const scoreCard = document.createElement('div');
            scoreCard.className = 'cv-score-card';
            scoreCard.style.position = 'absolute';
            scoreCard.style.bottom = '20px';
            scoreCard.style.right = '20px';
            scoreCard.style.background = 'rgba(2, 5, 10, 0.88)';
            scoreCard.style.border = '1px solid rgba(0, 212, 255, 0.4)';
            scoreCard.style.borderRadius = '14px';
            scoreCard.style.padding = '12px 18px';
            scoreCard.style.backdropFilter = 'blur(12px)';
            scoreCard.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(0,212,255,0.15)';
            scoreCard.style.pointerEvents = 'auto';

            scoreCard.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:4px;">
                    <span style="font-family:var(--font-heading);font-size:0.7rem;font-weight:700;letter-spacing:0.1em;color:var(--blue-accent);">AI BIOMECHANICS SCORE</span>
                    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#00e5a3;box-shadow:0 0 8px #00e5a3;"></span>
                </div>
                <div style="display:flex;align-items:baseline;gap:8px;">
                    <span id="cvScoreValue" style="font-family:var(--font-heading);font-size:2.2rem;font-weight:900;color:#ffffff;line-height:1;">72%</span>
                    <span style="font-size:0.75rem;color:#00e5a3;font-weight:600;"><i class="bi bi-arrow-up-right"></i> +22% ALIGNED</span>
                </div>
                <div style="font-size:0.75rem;color:#94a3b8;margin-top:4px;line-height:1.3;">
                    <i class="bi bi-check-circle-fill text-success me-1"></i> Excellent knee tracking & spine neutrality.
                </div>
            `;
            overlay.appendChild(scoreCard);

            // Append to container
            el.style.position = 'relative';
            el.appendChild(overlay);

            // Animate score from 72 to 94 when visible
            const observer = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting) {
                    const scoreVal = scoreCard.querySelector('#cvScoreValue');
                    if (scoreVal && window.MotionFX) {
                        MotionFX.animateValue(scoreVal, 72, 94, 1800);
                        scoreVal.textContent = '94%';
                    }
                }
            }, { threshold: 0.3 });
            observer.observe(el);
        }
    };

    window.FormAnalysis = FormAnalysis;

    // CSS Keyframe rules for overlay
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cvRadar {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes cvPulse {
            0% { stroke-opacity: 0.3; }
            100% { stroke-opacity: 0.95; stroke-width: 0.9; }
        }
    `;
    document.head.appendChild(style);
})(window);
