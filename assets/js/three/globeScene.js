/**
 * FITNEXA AI — Three.js Global Community Dotted Wireframe Globe
 * Features illuminated coordinate pins for active athletes worldwide,
 * scroll-triggered entrance, and continuous atmospheric rotation.
 */

class CommunityGlobeScene {
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
    this.init();
  }

  init() {
    const width = this.canvas.parentElement.clientWidth;
    const height = this.canvas.parentElement.clientHeight || 500;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 18;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    this.globeGroup = new THREE.Group();

    // 1. Dotted Globe Sphere
    const sphereRadius = 6.2;
    const dotCount = 1800;
    const dotGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(dotCount * 3);
    const colors = new Float32Array(dotCount * 3);

    const baseColor = new THREE.Color(0x303642);
    const limeColor = new THREE.Color(0xC6FF3D);

    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;

      const x = sphereRadius * Math.cos(theta) * Math.sin(phi);
      const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
      const z = sphereRadius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Random lime highlights on continental clusters
      const col = Math.random() > 0.82 ? limeColor : baseColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const dotMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.globePoints = new THREE.Points(dotGeo, dotMat);
    this.globeGroup.add(this.globePoints);

    // 2. Wireframe Lat/Long rings
    for (let lat = -60; lat <= 60; lat += 30) {
      const r = sphereRadius * Math.cos((lat * Math.PI) / 180);
      const y = sphereRadius * Math.sin((lat * Math.PI) / 180);
      const ringGeo = new THREE.BufferGeometry();
      const pts = [];
      for (let j = 0; j <= 64; j++) {
        const a = (j / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
      }
      ringGeo.setFromPoints(pts);
      const ringMat = new THREE.LineBasicMaterial({ color: 0x222834, transparent: true, opacity: 0.4 });
      const line = new THREE.Line(ringGeo, ringMat);
      this.globeGroup.add(line);
    }

    // 3. Glowing Location Beacons (Global Athlete Hubs)
    const hubs = [
      { lat: 40.7128, lon: -74.0060, name: "New York" },
      { lat: 51.5074, lon: -0.1278, name: "London" },
      { lat: 35.6762, lon: 139.6503, name: "Tokyo" },
      { lat: -33.8688, lon: 151.2093, name: "Sydney" },
      { lat: 25.2048, lon: 55.2708, name: "Dubai" },
      { lat: 37.7749, lon: -122.4194, name: "San Francisco" },
      { lat: 1.3521, lon: 103.8198, name: "Singapore" },
      { lat: 52.5200, lon: 13.4050, name: "Berlin" }
    ];

    this.beacons = [];
    hubs.forEach(hub => {
      const phi = (90 - hub.lat) * (Math.PI / 180);
      const theta = (hub.lon + 180) * (Math.PI / 180);

      const x = -(sphereRadius + 0.05) * Math.sin(phi) * Math.cos(theta);
      const y = (sphereRadius + 0.05) * Math.cos(phi);
      const z = (sphereRadius + 0.05) * Math.sin(phi) * Math.sin(theta);

      // Beacon Dot
      const beaconGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xC6FF3D });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(x, y, z);
      this.globeGroup.add(beacon);

      // Beacon Pulse Ring
      const pulseGeo = new THREE.RingGeometry(0.18, 0.45, 24);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xC6FF3D,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.position.set(x * 1.02, y * 1.02, z * 1.02);
      pulse.lookAt(0, 0, 0);
      this.globeGroup.add(pulse);
      this.beacons.push({ mesh: pulse, phase: Math.random() * Math.PI });
    });

    this.scene.add(this.globeGroup);

    window.addEventListener('resize', () => this.onResize(), { passive: true });

    // Performance Optimization: Pause RAF loop when globe is out of viewport
    this.isVisible = true;
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const wasVisible = this.isVisible;
          this.isVisible = entry.isIntersecting;
          if (!wasVisible && this.isVisible && !this.prefersReducedMotion) {
            this.animate();
          }
        });
      }, { rootMargin: '100px' });
      this.observer.observe(this.canvas);
    }

    if (!this.prefersReducedMotion) {
      this.animate();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onResize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const width = this.canvas.parentElement.clientWidth;
    const height = this.canvas.parentElement.clientHeight || 500;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    // Only tick when globe is visible in viewport
    if (!this.isVisible) return;

    requestAnimationFrame(() => this.animate());

    if (this.globeGroup) {
      this.globeGroup.rotation.y += 0.0035;
      this.globeGroup.rotation.x = 0.15;
    }

    // Pulse rings
    const time = Date.now() * 0.003;
    if (this.beacons) {
      this.beacons.forEach(b => {
        const s = 1 + Math.sin(time + b.phase) * 0.4;
        b.mesh.scale.set(s, s, s);
        b.mesh.material.opacity = 0.8 - (s - 1) * 1.5;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.initCommunityGlobe = function(canvasId) {
  if (typeof THREE !== 'undefined') {
    return new CommunityGlobeScene(canvasId);
  }
};
