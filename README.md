# LifeWise React + Three.js homepage

This is a focused Vite + React app. The 3D canvas and model live in the hero and stay on screen into the following section, where scrolling moves and turns the same model. The supplied OBJ is in `public/models/immaculate-heart.obj`.

## Run locally

Install Node.js, open a terminal in this folder, then run `npm install` once and `npm run dev`. Vite opens a local development server so React modules and the model asset are served with browser-safe URLs. You do not need the old Python `serve.py` scraper server.

## Build for hosting

Run `npm run build`. The generated `dist` folder is a static site; upload its contents to any static host. A web host serves the files to visitors. Double-clicking `index.html` directly (`file://`) is not a reliable way to run a React/WebGL app because browsers restrict JavaScript modules and local model requests.

Three.js, React, and Vite are declared in `package.json` and installed locally by `npm install`. Google Fonts are optional and fall back to system serif/sans fonts.
