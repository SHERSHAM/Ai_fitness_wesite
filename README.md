# FITNEXA AI — Cinematic 3D AI Fitness Technology Platform

> **TRAIN SMARTER. BECOME STRONGER.**  
> A complete, production-grade AI Fitness Trainer SaaS and cinematic 3D web experience.

---

## ⚡ Overview

**FITNEXA AI** is a state-of-the-art fitness platform combining high-end sports aesthetics with real-time WebGL 3D graphics, computer vision form analysis, intelligent coaching, and biometric readiness tracking.

- **3D Interactive Experience**: WebGL Three.js AI Core, concentric biometric performance rings, dynamic mouse parallax, and 3D card tilt with specular glare tracking.
- **Computer Vision Form HUD**: Real-time simulated joint angle analysis, skeletal telemetry, and biomechanics alignment scoring (72% → 94%).
- **Complete SaaS Application Layer**: Dedicated dashboard, full workout catalog, interactive exercise player with rest timers, context-aware AI Coach, nutrition targets, recovery analytics, and account switcher.
- **Persistent Multi-User Engine**: Local persistence with isolated account profiles, onboarding questionnaires, and preloaded athlete profiles (Alex Mercer & Sarah Connor).

---

## 🏛 Platform Architecture

```
FITNEXA AI PLATFORM
├── 1. Public Marketing Portal
│   ├── index.html               # 180vh pinned cinematic hero, WebGL AI Core, athlete telemetry
│   ├── about.html               # Science & 5-phase Adaptive Loop timeline
│   ├── programs.html            # Dynamic discipline selector with dimensional morphing
│   ├── ai-coach-overview.html   # Physiology engine feature tour & 3D dialogue cards
│   ├── pricing.html             # Starter / Pro / Elite tiers with annual discount toggle
│   ├── contact.html             # Athlete inquiry form with reactive 3D Core pulse
│   └── 404.html                 # Branded route fallback
│
├── 2. Authentication & Onboarding
│   ├── login.html               # Split-screen auth with 1-click demo access & 3D core
│   ├── signup.html              # Athlete registration with live form focus feedback
│   ├── forgot-password.html     # Password recovery workflow
│   └── onboarding.html          # 8-step visual questionnaire + AI plan synthesis
│
└── 3. Protected Application Shell
    ├── dashboard.html           # 3D Concentric Bio-Performance Matrix, readiness score, stats
    ├── workouts.html            # 8-routine catalog with category & difficulty filter pills
    ├── workout-detail.html      # Exercise breakdowns + Computer Vision AI Form Analysis HUD
    ├── workout-session.html     # Live session player, set tracking, and rest interval HUD
    ├── ai-coach.html            # 2-column chat engine with reactive 3D core & prompt chips
    ├── nutrition.html           # Interactive macro rings & AI meal plan generator
    ├── recovery.html            # Sleep efficiency, HRV, and daily readiness index
    ├── progress.html            # SVG progression curve, 12-week timeline, workout archive
    ├── profile.html             # Athlete bio, preferences & demo account switcher
    └── settings.html            # Security, notifications & account management
```

---

## 🛠 Tech Stack

- **Core**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS
- **3D Graphics & Animations**: [Three.js r128](https://threejs.org/) (WebGL), GSAP 3.12.5 + ScrollTrigger
- **UI Framework**: Bootstrap 5.3.3 (grid and utilities), Bootstrap Icons
- **Typography**: Outfit & Inter (Google Fonts)
- **Data Engine**: LocalStorage with multi-user isolation & session persistence

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/SHERSHAM/Ai_fitness_wesite.git
cd Ai_fitness_wesite
```

### 2. Run Locally
You can run the project using any static HTTP server.

**Using Python:**
```bash
python -m http.server 3000
```

**Using Node.js (npx):**
```bash
npx serve .
```

### 3. Open in Browser
Visit **`http://localhost:3000`** in your browser.

- **Demo Credentials**: On the [login page](http://localhost:3000/login.html), use the 1-click demo buttons to instantly sign in as:
  - **Alex Mercer** (Goal: Build Strength)
  - **Sarah Connor** (Goal: Lose Fat)

---

## 📄 License
MIT License © 2026 FITNEXA AI. All rights reserved.
