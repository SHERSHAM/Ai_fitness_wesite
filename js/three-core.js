/**
 * FITNEXA AI — 3D WebGL Engine & Visual Core
 * Powered by Three.js
 * 
 * Delivers:
 * 1. FitnexaAICore: Dark glass sphere, luminous inner core, multi-axis orbital rings, orbiting particle field.
 * 2. FitnexaPerformanceRing: Concentric 3D/Canvas biometric performance rings reacting to mouse movement.
 * 3. Auto-lifecycle: IntersectionObserver to pause rendering when offscreen.
 * 4. Responsive & Mobile-friendly: Automatic fallback and pixelRatio capping.
 */

(function(window) {
    'use strict';

    const Fitnexa3D = {
        instances: [],

        /**
         * Initialize a 3D AI Core inside a container element
         * @param {HTMLElement|string} container - Element or selector
         * @param {Object} options - Configuration overrides
         */
        createAICore: function(container, options) {
            const el = typeof container === 'string' ? document.querySelector(container) : container;
            if (!el) return null;

            if (typeof THREE === 'undefined') {
                console.warn('[Fitnexa3D] Three.js not loaded. Falling back to CSS glow animation.');
                el.classList.add('ai-core-fallback');
                return null;
            }

            const opts = Object.assign({
                size: 400,
                sphereRadius: 1.4,
                innerGlowRadius: 1.0,
                ringCount: 3,
                particlesCount: 90,
                colorCore: 0x00d4ff,
                colorInner: 0x0066ff,
                colorRing: 0x00d4ff,
                colorParticle: 0x38bdf8,
                interactive: true,
                autoRotate: true,
                rotationSpeed: 0.003,
                cameraDistance: 5.5,
                enableParallax: true
            }, options);

            // Container sizing
            const width = el.clientWidth || opts.size;
            const height = el.clientHeight || opts.size;

            // Scene, Camera, Renderer
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
            camera.position.z = opts.cameraDistance;

            let renderer;
            try {
                renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
            } catch (err) {
                console.warn('[Fitnexa3D] WebGL not supported, applying fallback.', err);
                el.classList.add('ai-core-fallback');
                return null;
            }

            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.setClearColor(0x000000, 0);
            el.appendChild(renderer.domElement);
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
            renderer.domElement.style.display = 'block';

            // Groups for hierarchical rotation
            const coreGroup = new THREE.Group();
            scene.add(coreGroup);

            // 1. Inner Luminous Core (Layer 1)
            const innerGeo = new THREE.SphereGeometry(opts.innerGlowRadius, 32, 32);
            const innerMat = new THREE.MeshBasicMaterial({
                color: opts.colorInner,
                transparent: true,
                opacity: 0.65,
                wireframe: false
            });
            const innerSphere = new THREE.Mesh(innerGeo, innerMat);
            coreGroup.add(innerSphere);

            // 2. Outer Dark Glass Sphere (Layer 2)
            const glassGeo = new THREE.SphereGeometry(opts.sphereRadius, 48, 48);
            const glassMat = new THREE.MeshStandardMaterial({
                color: 0x030816,
                metalness: 0.9,
                roughness: 0.1,
                transparent: true,
                opacity: 0.85,
                emissive: opts.colorCore,
                emissiveIntensity: 0.15,
                wireframe: false
            });
            const glassSphere = new THREE.Mesh(glassGeo, glassMat);
            coreGroup.add(glassSphere);

            // 3. Orbital Rings (Layer 3)
            const rings = [];
            const ringGroup = new THREE.Group();
            coreGroup.add(ringGroup);

            const ringConfigs = [
                { rad: opts.sphereRadius * 1.55, tube: 0.016, rotX: 1.2, rotY: 0.3, speedX: 0.005, speedY: 0.008 },
                { rad: opts.sphereRadius * 1.95, tube: 0.012, rotX: 0.6, rotY: 1.1, speedX: -0.004, speedY: 0.006 },
                { rad: opts.sphereRadius * 2.35, tube: 0.009, rotX: 0.2, rotY: 0.8, speedX: 0.003, speedY: -0.005 }
            ];

            for (let i = 0; i < Math.min(opts.ringCount, ringConfigs.length); i++) {
                const conf = ringConfigs[i];
                const ringGeo = new THREE.TorusGeometry(conf.rad, conf.tube, 16, 100);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: opts.colorRing,
                    transparent: true,
                    opacity: 0.55 - (i * 0.12)
                });
                const ringMesh = new THREE.Mesh(ringGeo, ringMat);
                ringMesh.rotation.x = conf.rotX;
                ringMesh.rotation.y = conf.rotY;
                ringGroup.add(ringMesh);
                rings.push({ mesh: ringMesh, config: conf });
            }

            // 4. Orbiting Particles Field (Layer 4)
            const particleCount = opts.particlesCount;
            const particleGeo = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const particleSpeeds = [];

            for (let i = 0; i < particleCount; i++) {
                const r = opts.sphereRadius * 1.2 + Math.random() * (opts.sphereRadius * 1.6);
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);

                positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = r * Math.cos(phi);

                particleSpeeds.push({
                    thetaSpeed: (Math.random() - 0.5) * 0.01,
                    phiSpeed: (Math.random() - 0.5) * 0.01,
                    r: r,
                    theta: theta,
                    phi: phi
                });
            }

            particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particleMat = new THREE.PointsMaterial({
                color: opts.colorParticle,
                size: 0.065,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending
            });
            const particleSystem = new THREE.Points(particleGeo, particleMat);
            coreGroup.add(particleSystem);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);

            const pointLight = new THREE.PointLight(opts.colorCore, 2.5, 20);
            pointLight.position.set(2, 3, 4);
            scene.add(pointLight);

            const coreLight = new THREE.PointLight(opts.colorInner, 1.8, 10);
            coreLight.position.set(0, 0, 0);
            scene.add(coreLight);

            // Mouse parallax tracking
            let mouseX = 0;
            let mouseY = 0;
            let targetRotX = 0;
            let targetRotY = 0;

            if (opts.interactive && opts.enableParallax) {
                window.addEventListener('mousemove', function(e) {
                    const rect = el.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    mouseX = (e.clientX - centerX) / (window.innerWidth / 2);
                    mouseY = (e.clientY - centerY) / (window.innerHeight / 2);
                }, { passive: true });
            }

            // Animation Loop State
            let isVisible = true;
            let animationFrameId = null;
            let clock = new THREE.Clock();
            let energyPulse = 0;

            // Render loop
            function animate() {
                if (!isVisible) return;
                animationFrameId = requestAnimationFrame(animate);

                const delta = clock.getDelta();
                const time = clock.getElapsedTime();

                // Core rotation
                if (opts.autoRotate) {
                    coreGroup.rotation.y += opts.rotationSpeed;
                    coreGroup.rotation.x = Math.sin(time * 0.4) * 0.08;
                }

                // Smooth mouse follow
                targetRotY += (mouseX * 0.4 - targetRotY) * 0.05;
                targetRotX += (mouseY * 0.3 - targetRotX) * 0.05;
                scene.rotation.y = targetRotY;
                scene.rotation.x = targetRotX;

                // Orbit individual rings
                rings.forEach(function(r) {
                    r.mesh.rotation.z += r.config.speedX;
                    r.mesh.rotation.y += r.config.speedY;
                });

                // Subtle breathing / pulse effect
                const pulseScale = 1.0 + Math.sin(time * 1.8) * 0.04 + energyPulse;
                innerSphere.scale.set(pulseScale, pulseScale, pulseScale);
                glassMat.emissiveIntensity = 0.15 + Math.sin(time * 2.0) * 0.08 + energyPulse * 0.5;

                // Decay manual pulse
                if (energyPulse > 0) {
                    energyPulse *= 0.94;
                    if (energyPulse < 0.005) energyPulse = 0;
                }

                // Orbit particles
                const pos = particleGeo.attributes.position.array;
                for (let i = 0; i < particleCount; i++) {
                    const p = particleSpeeds[i];
                    p.theta += p.thetaSpeed;
                    p.phi += p.phiSpeed;
                    pos[i * 3] = p.r * Math.sin(p.phi) * Math.cos(p.theta);
                    pos[i * 3 + 1] = p.r * Math.sin(p.phi) * Math.sin(p.theta);
                    pos[i * 3 + 2] = p.r * Math.cos(p.phi);
                }
                particleGeo.attributes.position.needsUpdate = true;

                renderer.render(scene, camera);
            }

            // Pause when offscreen for high performance & 60 FPS
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    isVisible = entry.isIntersecting;
                    if (isVisible && !animationFrameId) {
                        clock.start();
                        animate();
                    } else if (!isVisible && animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                });
            }, { threshold: 0.05 });
            observer.observe(el);

            // Resize handler
            function onResize() {
                const w = el.clientWidth;
                const h = el.clientHeight;
                if (w === 0 || h === 0) return;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
            window.addEventListener('resize', onResize, { passive: true });

            // Start loop
            animate();

            // Instance Controller API
            const instance = {
                el: el,
                scene: scene,
                camera: camera,
                renderer: renderer,
                coreGroup: coreGroup,
                glassSphere: glassSphere,
                innerSphere: innerSphere,
                rings: rings,

                pulse: function(amount) {
                    energyPulse = amount || 0.4;
                },

                setIntensity: function(mult) {
                    glassMat.emissiveIntensity = 0.2 * mult;
                    pointLight.intensity = 2.5 * mult;
                },

                setScale: function(s) {
                    coreGroup.scale.set(s, s, s);
                },

                setRotationY: function(r) {
                    coreGroup.rotation.y = r;
                },

                destroy: function() {
                    observer.disconnect();
                    window.removeEventListener('resize', onResize);
                    if (animationFrameId) cancelAnimationFrame(animationFrameId);
                    renderer.dispose();
                    if (renderer.domElement && renderer.domElement.parentNode) {
                        renderer.domElement.parentNode.removeChild(renderer.domElement);
                    }
                }
            };

            Fitnexa3D.instances.push(instance);
            return instance;
        },

        /**
         * Initialize Interactive Concentric Performance Rings on a canvas or container
         */
        createPerformanceRing: function(container, metrics) {
            const el = typeof container === 'string' ? document.querySelector(container) : container;
            if (!el) return null;

            const m = Object.assign({
                score: 78,
                strength: 84,
                endurance: 72,
                consistency: 90,
                recovery: 86
            }, metrics);

            // Sanitize values
            const scoreVal = (typeof m.score === 'number' && !isNaN(m.score)) ? m.score : 78;
            const strengthVal = (typeof m.strength === 'number' && !isNaN(m.strength)) ? m.strength : 84;
            const enduranceVal = (typeof m.endurance === 'number' && !isNaN(m.endurance)) ? m.endurance : 72;
            const recoveryVal = (typeof m.recovery === 'number' && !isNaN(m.recovery)) ? m.recovery : 86;
            const consistencyVal = (typeof m.consistency === 'number' && !isNaN(m.consistency)) ? m.consistency : 90;

            const canvas = document.createElement('canvas');
            canvas.width = 360;
            canvas.height = 360;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.maxWidth = '360px';
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            el.innerHTML = '';
            el.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            let mouseTiltX = 0;
            let mouseTiltY = 0;
            let progress = 0;

            el.addEventListener('mousemove', function(e) {
                const rect = el.getBoundingClientRect();
                mouseTiltX = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
                mouseTiltY = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
            }, { passive: true });

            el.addEventListener('mouseleave', function() {
                mouseTiltX = 0;
                mouseTiltY = 0;
            });

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const cx = canvas.width / 2 + mouseTiltX;
                const cy = canvas.height / 2 + mouseTiltY;

                // Outer Ring: Strength (Cyan)
                drawArc(cx, cy, 140, 10, '#00d4ff', strengthVal * progress);
                // Middle Ring: Endurance (Blue)
                drawArc(cx, cy, 118, 9, '#0066ff', enduranceVal * progress);
                // Inner Ring: Recovery (Emerald)
                drawArc(cx, cy, 98, 8, '#00e5a3', recoveryVal * progress);
                // Core Ring: Consistency (Violet)
                drawArc(cx, cy, 80, 7, '#8b5cf6', consistencyVal * progress);

                // Center Score text
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '800 48px Outfit, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = 'rgba(0, 212, 255, 0.6)';
                ctx.shadowBlur = 15;
                ctx.fillText(Math.round(scoreVal * progress) + '%', cx, cy - 8);

                ctx.font = '600 11px Outfit, sans-serif';
                ctx.fillStyle = '#94a3b8';
                ctx.letterSpacing = '2px';
                ctx.shadowBlur = 0;
                ctx.fillText('READINESS INDEX', cx, cy + 26);
                ctx.restore();

                if (progress < 1) {
                    progress = Math.min(1, progress + 0.025);
                    requestAnimationFrame(draw);
                }
            }

            function drawArc(cx, cy, radius, width, color, percent) {
                // Background track
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
                ctx.lineWidth = width;
                ctx.stroke();

                // Luminous active segment
                const startAngle = -Math.PI / 2;
                const endAngle = startAngle + (Math.PI * 2 * (percent / 100));
                ctx.beginPath();
                ctx.arc(cx, cy, radius, startAngle, endAngle);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.lineCap = 'round';
                ctx.shadowColor = color;
                ctx.shadowBlur = 12;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // Trigger animation on visibility
            const observer = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting) {
                    progress = 0;
                    draw();
                }
            }, { threshold: 0.2 });
            observer.observe(el);

            return {
                update: function(newMetrics) {
                    Object.assign(m, newMetrics);
                    progress = 0;
                    draw();
                }
            };
        }
    };

    window.Fitnexa3D = Fitnexa3D;
})(window);
