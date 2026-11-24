# Interactive 3D Black Hole

Interactive 3D Black Hole is a real-time web visualization and educational companion built to explore how extreme gravity bends light, shapes an event horizon shadow, and drives matter through an accretion disk. Designed as an immersive full-viewport 3D experience paired with a structured astrophysics reference page, the application lets visitors orbit freely around a simulated black hole and connect what they see on screen directly to general relativity and observational astronomy.

## Project Description and Technology Stack

The project is organized around two primary routes in **Next.js 15** (App Router) with **React 19** and **TypeScript**:

- **Interactive 3D Visualization (`/`, `app/page.tsx`)**: Renders a full-screen **WebGL** scene managed through `components/BlackHoleCanvas.tsx` and `lib/blackhole/createBlackHoleScene.ts`. Custom **GLSL** fragment and vertex shaders (`lib/blackhole/shaders.ts`) trace light rays through a Schwarzschild gravitational potential to produce gravitational lensing, the central shadow capture silhouette, a thin photon-ring outline, warped background stars, and layered volumetric accretion plasma. A particle layer of 1,050 dust motes orbits the disk with Keplerian angular velocity scaling, while adaptive pixel-ratio tuning, software-WebGL detection, reduced-motion awareness, and context-loss recovery keep interaction smooth across desktop and mobile devices.
- **Viewport Controls and Overlay (`components/BlackHoleOverlay.tsx`)**: Provides 360-degree camera orbiting and zoom via **Three.js** `OrbitControls`, alongside compact view controls (zoom in, zoom out, and reset view) with accessible custom tooltips, **Motion** transitions, and **Lucide React** icons.
- **Black Hole Reference Guide (`/black-holes`, `app/black-holes/page.tsx`)**: Presents a 14-section reference document sourced from `lib/blackholes/guideContent.ts`, covering black hole anatomy, stellar collapse and supermassive growth, mass classifications, spacetime curvature, accretion physics, photon rings, frame-dragging spin, observational methods (EHT and gravitational-wave interferometry), notable black holes, common misconceptions, and a breakdown of what the 3D shader models versus what it simplifies. Navigation is supported by `components/BlackHoleGuideNav.tsx` with a sticky desktop table of contents and a responsive mobile drawer.
- **Styling, Typography, and Discoverability**: Styled with **Tailwind CSS v4** (`app/globals.css`), using **Plus Jakarta Sans** and **IBM Plex Mono** via `next/font/google`. Shared metadata, JSON-LD structured data, dynamic `app/sitemap.ts` and `app/robots.ts` routes, an SVG favicon (`app/icon.svg`), and a landscape Open Graph preview (`public/og-preview.jpg`) are configured through `lib/seo.ts`.

## Copyright Notice

**Interactive 3D Black Hole**

Copyright © 2025 Manish Sonawane. All rights reserved.

This project, **Interactive 3D Black Hole**, is an interactive real-time 3D web visualization and companion educational guide that demonstrates gravitational lensing, accretion disk dynamics, and core principles of black hole astrophysics in the browser.

Unauthorized use, modification, or distribution of the software or its components is prohibited unless explicitly stated under the terms of the license.

By using or contributing to this project, you agree to comply with the terms and conditions defined in the license. You may use the software for personal or educational purposes, provided that proper credit is given to the original author.

## License Information

This project is licensed under the MIT License. Please refer to the `LICENSE` file in this repository for detailed license information. The terms of the license govern the use, distribution, and modification of the software.

## Disclaimer

The software is provided "as-is" without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.

## Trademarks

Any trademarks, service marks, or other marks associated with this project or its components are the property of their respective owners.
