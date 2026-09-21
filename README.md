# 🐼 RAK SHU — Balance Fuels Greatness

> **A minimal, cinematic Chinese Kung Fu inspired interactive web experience centered around the spirit of balance, focus, and discipline.**

[![Deploy to GitHub Pages](https://github.com/rakshithrockstar1607/rak-shu-panda/actions/workflows/deploy.yml/badge.svg)](https://github.com/rakshithrockstar1607/rak-shu-panda/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-gold?style=flat-square&logo=github)](https://rakshithrockstar1607.github.io/rak-shu-panda/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌐 Live Experience

**Live Demo URL:**  
👉 **[https://rakshithrockstar1607.github.io/rak-shu-panda/](https://rakshithrockstar1607.github.io/rak-shu-panda/)**

---

## ✨ Key Features & Architecture

### 1. 60 FPS Sub-Frame Frame-Blending Hero Canvas
- **118-Frame Breathing Sequence:** The panda rests in a serene, continuous breathing meditation loop rendered in optimized WebP format at full 100vw / 100vh.
- **Dynamic Gaze Tracking:**
  - **Mouse Moves Left:** Panda smoothly turns and tracks gaze towards the left (frames 119–146).
  - **Mouse Moves Right:** Panda turns to the right with natural easing (frames 167–193).
  - **Center Deadzone (`|x| <= 0.22`):** When the cursor hovers within the panda's central zone, he seamlessly transitions back to meditation with subtle dynamic shutter motion blur.

### 2. "Release Chi Energy" Interactive Levitating Disc
- Levitating circular button positioned at the visual center of the viewport.
- 100% transparent minimal design with a gold neon outline.
- Interactive hover charging animation: a golden SVG circular loader fills over 2 seconds with pulsing typography (`氣 RELEASE CHI ENERGY`).
- High-velocity Chi particle burst upon click, triggering the panda's martial arts leap.

### 3. Kinetic Martial Arts Leap & Reverse Return
- Forward action stance video with seamless playback and high-speed leap.
- Smooth reverse-return transition that guides the warrior panda back into restful meditation, automatically resetting the Chi orb for another interaction.

### 4. Ambient Rising Chi Particles
- Subtle, ascending golden particle motes rising organically across the canvas, reflecting inner tranquility and spiritual power.

### 5. Interactive 3D Chinese Calligraphy Silk Cloth (Three.js)
- Draggable, dynamic cloth simulation powered by Three.js WebGL.
- Custom texture with traditional Chinese seal script, reacting in real time to drag and release forces with physics dampening and spring-back elasticity.

### 6. Spatial Web Audio & Cinematic Soundtrack
- Dual-layer audio design:
  - **Procedural Web Audio Engine:** Synthesizes Tibetan singing bowl harmonics, wind chimes, martial swooshes, and resonant gongs.
  - **Cinematic Soundtrack:** Integrated atmospheric music with smooth requestAnimationFrame volume fade-in and fade-out upon toggle.

### 7. Authentic Typography & Styling
- **Slackey** display typography for heroic headers and branding.
- **Fredoka** condensed clean body typography for high legibility.
- **Ma Shan Zheng & Noto Serif SC** for traditional Chinese calligraphy watermark stamps.

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite 6](https://vitejs.dev/)
- **3D Graphics:** [Three.js](https://threejs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Audio:** Web Audio API + HTML5 Audio
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** GitHub Actions + GitHub Pages

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# 1. Clone repository
git clone https://github.com/rakshithrockstar1607/rak-shu-panda.git
cd rak-shu-panda

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000/` in your browser.

---

## 📦 Production Build & Testing

```bash
# Type check and build optimized static assets
npm run build

# Preview production build locally
npm run preview
```

---

## 🚢 Automated GitHub Pages Deployment

This repository includes a GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Enabling GitHub Pages in Repository Settings:
1. Open the repository on GitHub: `https://github.com/rakshithrockstar1607/rak-shu-panda`
2. Go to **Settings** > **Pages** (under "Code and automation").
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Every push to the `main` branch automatically triggers the build and publishes the live site to:  
   **`https://rakshithrockstar1607.github.io/rak-shu-panda/`**

---

## 📁 Project Structure

```
rak-shu-panda/
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD GitHub Pages deployment workflow
├── public/
│   └── assets/                   # Web-optimized assets (WebP sequences, audio, video)
│       ├── sequence/             # 118-frame breathing sequence
│       ├── look/                 # Gaze tracking frames
│       ├── panda_theme.mp3       # Cinematic soundtrack
│       ├── action_and_return.mp4 # Action leap & return
│       └── poster_meditation.webp
├── src/
│   ├── components/
│   │   ├── hero/
│   │   │   ├── PandaCanvas.tsx   # 60 FPS Canvas frame interpolator & video layer
│   │   │   ├── ChiButton.tsx     # Levitating interactive Chi charging button
│   │   │   ├── SilkCloth3D.tsx   # Three.js 3D draggable calligraphy cloth
│   │   │   └── ParticleCanvas.tsx# Ambient rising Chi wisps
│   │   ├── layout/
│   │   │   └── Navbar.tsx        # Responsive navigation & audio toggle
│   │   └── sections/
│   │       ├── JourneySection.tsx# 3-Phase martial path interactive cards
│   │       └── PhilosophySection.tsx
│   ├── utils/
│   │   ├── assetPath.ts          # Centralized base path resolver for GitHub Pages
│   │   └── audioEngine.ts        # Procedural sound & soundtrack fade engine
│   ├── App.tsx                   # Main layout container
│   ├── index.css                 # Custom animations, fonts, and scroll styling
│   └── main.tsx                  # React entry point
├── vite.config.ts                # Vite config with dynamic GitHub Pages base URL
└── package.json
```

---

## 📜 License

MIT License © 2026 Rakshith. Built with precision and passion.
