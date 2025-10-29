# Neurosynth AJAX Frontend (static)

This is a tiny static frontend demo that uses Tailwind CSS and fetch/AJAX to query Tren's backend at https://mil.psy.ntu.edu.tw:5000.

What it does
- Provide a small UI for three kinds of requests:
  - GET /terms — list all terms
  - GET /terms/<term> — term-specific lookup
  - GET /query/<q_string>/studies — logical search for studies
- Display JSON or text responses and let you click terms to drill down.

How to use locally
1. Start a simple HTTP server in this directory (recommended so browser fetch works with CORS):

PowerShell:
```powershell
# from this folder
python -m http.server 8000
# open http://localhost:8000/index.html
```

2. Open http://localhost:8000/index.html in your browser and use the UI.

Notes
- The frontend sends requests to https://mil.psy.ntu.edu.tw:5000. That backend must allow CORS for your origin (http://localhost:8000) or the browser will block requests.
- This is static/demo code — do not use debug/demo frontends in production without reviewing security and CORS settings.

Netlify deployment (recommended if backend doesn't allow CORS)
- This repo includes a Netlify configuration and a simple proxy function that forwards requests from your deployed origin to the Tren backend so you don't need to change the backend CORS settings.
- Files included at repo root:
  - `netlify.toml` — publish the `frontend` folder and redirect `/api/*` to the function
  - `netlify/functions/proxy.js` — simple proxy that forwards requests to `https://mil.psy.ntu.edu.tw:5000` and adds CORS headers

To deploy on Netlify (quick):
1. Commit and push this repository to GitHub.
2. In Netlify, choose "Add new site" → "Import from Git" and connect your GitHub repo, or drag-and-drop the `frontend` folder on the Netlify Sites page.
3. If you import from Git, Netlify will detect `netlify.toml` and set the publish folder to `frontend` and functions folder to `netlify/functions`.
4. After deploy, your site will be at `https://<your-site>.netlify.app` and the frontend will call `/api/...` which the function proxies to the Tren backend.

Notes about Netlify proxy security:
- The proxy forwards responses and sets `Access-Control-Allow-Origin: *` so the browser can receive them. This is fine for a demo, but for production consider restricting allowed origins and adding caching or rate-limiting.

Building Tailwind locally
------------------------
This project includes a small Tailwind build pipeline inside the `frontend` folder. To build the CSS locally:

PowerShell (from the `frontend` folder):
```powershell
# install dev dependencies (only once)
npm install

# build a minified styles.css into frontend/dist/
npm run build:css

# for development with automatic rebuilds:
npm run dev:css
```

After running `npm run build:css`, open `index.html` and it will load the generated `dist/styles.css`.

Notes:
- The build requires Node.js and npm. Use Node 16+ for Tailwind CLI compatibility.
- The `dist/styles.css` file is gitignored by default in many projects. If you want the built file checked into the repo for quick hosting without a build step, run the build and commit `dist/styles.css`.

Next improvements you may want:
- Add a small preflight CORS UI to verify allowed methods/headers.
- Add pagination, nicer result cards, and search history.
- Add unit tests (playwright/cypress) for the UI flows.
