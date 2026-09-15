/**
 * FITNEXA AI — Three.js Hero Kinetic Energy & Particle Vortex Scene
 * Renders glowing electric lime (#C6FF3D) and cyber violet swirling particle trails
 * with interactive cursor parallax tilt and subtle idle wave physics.
 */

class HeroVortexScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    // Mobile check: disable heavy 3D WebGL on mobile screens <= 768px
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (this.isMobile) {
      this.canvas.style.display = 'none';
      return;
    }

    // Accessibility check: reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.scene = new THREE.Scene();
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.particleCount = 2000;

    this.init();
  }

  init() {
    // Camera
    const width = this.canvas.parentElement.clientWidth;
    const height = this.canvas.parentElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.z = 22;

    // Renderer with capped pixel ratio for performance
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    this.createVortexRibbons();
    this.createAmbientDust();

    if (!this.prefersReducedMotion) {
      this.bindEvents();
      this.animate();
    } else {
      // Single static render for reduced motion
      this.renderer.render(this.scene, this.camera);
    }
  }

  createVortexRibbons() {
    this.vortexGroup = new THREE.Group();

    // Generate spiral vortex curves
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);

    const limeColor = new THREE.Color(0xC6FF3D);
    const cyanColor = new THREE.Color(0x00F0FF);
    const violetColor = new THREE.Color(0x7C5CFF);

    for (let i = 0; i < this.particleCount; i++) {
      const theta = (i / this.particleCount) * Math.PI * 18;
      const radius = 2.5 + Math.sin(i * 0.05) * 5 + (i / this.particleCount) * 8;
      const x = Math.cos(theta) * radius + (Math.random() - 0.5) * 1.5;
      const y = (i / this.particleCount) * 18 - 9 + Math.sin(theta * 2) * 1.2;
      const z = Math.sin(theta) * radius + (Math.random() - 0.5) * 2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color gradient along vortex
      const mixedColor = limeColor.clone();
      if (Math.random() > 0.85) {
        mixedColor.lerp(cyanColor, 0.6);
      } else if (Math.random() > 0.92) {
        mixedColor.lerp(violetColor, 0.8);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 3.5 + 1.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle Shader Material
    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(geometry, material);
    this.vortexGroup.add(this.points);

    // Glowing rings around runner waist/arms
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.TorusGeometry(3.5 + r * 1.8, 0.03, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xC6FF3D,
        transparent: true,
        opacity: 0.45 - r * 0.12,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3 + r * 0.2;
      ringMesh.rotation.y = r * 0.4;
      this.vortexGroup.add(ringMesh);
    }

    this.scene.add(this.vortexGroup);
  }

  createAmbientDust() {
    const dustCount = this.isMobile ? 150 : 400;
    const dustGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 35;
      positions[i + 1] = (Math.random() - 0.5) * 25;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.09,
      color: 0xC6FF3D,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    this.ambientDust = new THREE.Points(dustGeo, dustMat);
    this.scene.add(this.ambientDust);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    // Cursor parallax with passive listener
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Performance Optimization: Pause RAF loop when canvas is out of viewport
    this.isVisible = true;
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const wasVisible = this.isVisible;
          this.isVisible = entry.isIntersecting;
          if (!wasVisible && this.isVisible) {
            this.animate();
          }
        });
      }, { rootMargin: '100px' });
      this.observer.observe(this.canvas);
    }
  }

  onResize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const width = this.canvas.parentElement.clientWidth;
    const height = this.canvas.parentElement.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    // Only continue RAF loop if canvas is visible in viewport
    if (!this.isVisible) return;

    requestAnimationFrame(() => this.animate());

    // Lerp mouse parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    if (this.vortexGroup) {
      this.vortexGroup.rotation.y += 0.006;
      this.vortexGroup.rotation.x = this.mouse.y * 0.25;
      this.vortexGroup.rotation.z = -this.mouse.x * 0.2;
    }

    if (this.ambientDust) {
      this.ambientDust.rotation.y -= 0.001;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Export initialization function
window.initHeroVortex = function(canvasId) {
  if (typeof THREE !== 'undefined') {
    return new HeroVortexScene(canvasId);
  }
};
