# Butterflies Note 🦋

A pixel-perfect implementation of the Figma card/screen *"To the butterflies we feel in our bellies"* (Node `1:2`), built with React, Vite, and Tailwind CSS adhering strictly to computed-style parity guidelines.

## Tech Stack
- **Framework:** React 18 + Vite 5
- **Styling:** Tailwind CSS 3
- **Typography:** Authentic Monotype Corsiva font asset with cursive/serif fallbacks
- **Verification:** Automated computed-style audit & screenshot diffing via Puppeteer

## Features
- **Pixel Parity:** Exact 390px × 651px viewport fidelity, matching Figma Auto Layout geometry.
- **Computed-Style Audited:** 1:1 color matching (`#E3D2B4` parchment canvas, `#5C5C5C` text color), exact line-height (`19px`), font-size (`12px`), and text justification.
- **Pure Artboard Mode:** Toggle artboard-only view with query parameter `?artboard=1`.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```
Open [http://localhost:5174/](http://localhost:5174/) in your browser.

### Run Verification Audit
```bash
node test/audit.cjs
```
