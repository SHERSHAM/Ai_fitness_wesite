# FITNEXA AI — Autonomous Personal Fitness Platform

A cinematic, AI-driven personal training platform built with HTML5, CSS3, Bootstrap 5, Vanilla JavaScript, Three.js, and GSAP.

## Key Features

- **Cinematic Dark-Glass UI**: Dark aesthetic with high-contrast electric lime accents (`#C6FF3D`) and interactive glassmorphism.
- **3D Interactive WebGL Scenes**:
  - **Hero Kinetic Energy Vortex**: Dynamic particle field with real-time mouse parallax.
  - **Global Community Globe**: 3D dotted wireframe globe featuring live athlete beacon clusters.
- **Interactive Auth & Onboarding Flow**:
  - Split-screen Login & Signup with real-time password strength meter.
  - 4-Step Goal Calibration Wizard (Goal, Experience Level, Equipment, Biometrics) with neural plan generation.
  - Password recovery with instant verification feedback.
- **Athlete Command Center & Dashboard**:
  - Live biometric telemetry cards and progress gauges.
  - Interactive Workout Player with session timer and set checkboxes.
  - Filterable Workout Protocol Catalog (Strength, Fat Loss, Muscle Gain, Mobility, Endurance).
  - Daily Nutrition Planner with macro allocation rings (Protein, Carbs, Fats).
  - Multi-user isolated local storage (`DataStore`) ensuring fresh accounts initialize from scratch.
  - Interactive AI Coach chat terminal with canned sport-science query logic.
- **Performance Optimized**:
  - WebGL `IntersectionObserver` viewport culling to pause 3D loops when off-screen.
  - Reflow-free 3D card tilt physics batched via `requestAnimationFrame`.
  - Native image lazy-loading and GPU hardware composited layers.
  - Full `prefers-reduced-motion` compliance.

## Project Structure

```
├── index.html               # Main landing page
├── login.html               # Athlete authentication
├── signup.html              # Account registration
├── forgot-password.html     # Password reset flow
├── onboarding.html          # 4-step AI plan calibration wizard
├── dashboard/               # Athlete command center
│   ├── index.html           # Multi-view dashboard
│   ├── workouts.html        # Protocol catalog redirect
│   ├── nutrition.html       # Macro nutrition redirect
│   ├── progress.html        # Performance analytics redirect
│   └── ai-coach.html        # Biometric AI coach redirect
└── assets/
    ├── css/                 # Master design tokens & stylesheets
    ├── images/              # High-resolution athletic assets
    └── js/                  # Application logic, Three.js & GSAP controllers
```

## Running Locally

Serve the repository with any local static server:

```bash
# Using npx serve
npx serve . -l 3000

# Using Python
python -m http.server 3000
```
