# HALO — 3D Well-being Explorer (Modular English Edition)

Standalone source code for the 3D astronaut well-being visualizer. All interface labels remain in English.

## Launch

Open `index.html` in Chrome or Edge. No external JavaScript packages or internet connection are required. English voice playback uses the browser's speech synthesis and depends on voices available in the system.

Optional local server: from this directory, run `python -m http.server 8000` and visit `http://localhost:8000`.

## Files

- `index.html` — semantic page layout and references to CSS/JavaScript.
- `css/01-layout-and-theme.css` — layout, typography, indicators and dark aerospace theme.
- `css/02-accessibility.css` — reduced-motion accessibility.
- `js/01-indicators-and-demo-data.js` — Domains, mission-specific sample datasets and status colors.
- `js/02-application-state.js` — App state, selected scenario and scores.
- `js/03-metrics-and-trend-chart.js` — Indicator selector, SVG five-session trend and explanation panel.
- `js/04-profile-and-view-controls.js` — Crew profile, scenario and reset events.
- `js/05-voice-explanations.js` — English speech synthesis and audio controls.
- `js/06-astronaut-geometry.js` — Astronaut 3D ellipsoidal mesh and material palette.
- `js/07-projection-and-resize.js` — 3D transform, perspective projection and responsive canvas sizing.
- `js/08-3d-renderer.js` — Mesh lighting, depth sorting, markers and requestAnimationFrame loop.
- `js/09-pointer-keyboard-navigation.js` — Rotation, marker hit-testing and keyboard interaction.

## Notes

- Scripts are split by responsibility and loaded using ordered `defer` classic scripts, preserving the original global state/functions and execution order.
- This prototype uses sample profiles, trends, and illustrative color thresholds; it does not perform clinical assessment.
- The model is rendered on HTML Canvas without Three.js or external libraries.
- The project is independent of the main HALO app; integrating it later will require connecting it to actual authorized session data and removing demo fixtures.
