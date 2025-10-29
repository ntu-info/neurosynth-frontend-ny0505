<<<<<<< HEAD
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/yOwut1-r)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21353391&assignment_repo_type=AssignmentRepo)
# 07
Neurosynth Frontend
=======
# Neurosynth Frontend — AJAX demo

This repository contains a small static frontend that queries a Tren backend and displays results using Tailwind CSS. It includes a Netlify serverless proxy so client requests to `/api/*` are forwarded to the backend (avoids CORS changes on the remote server).

Quick overview
- `frontend/` — static site source and Tailwind config. The final `dist/styles.css` is built into `frontend/dist/`.
- `netlify/functions/proxy.js` — serverless proxy function that forwards `/api/*` to `https://mil.psy.ntu.edu.tw:5000` and adds permissive CORS headers.
- `netlify.toml` — Netlify config (publish directory `frontend` and build command).
- `scripts/smoke.ps1` — PowerShell smoke test to fetch the three example endpoints and save JSON to `frontend/tmp/`.

Local development
1. Build Tailwind CSS (from repo root):
```powershell
pwsh -c "npm ci --prefix frontend"
pwsh -c "npm run build:css --prefix frontend"
```
2. Start Netlify Dev (from repo root):
```powershell
npx netlify dev
```
Open the URL shown by Netlify Dev (default http://localhost:8888) and try the sample links in the UI.

Deploy to Netlify (recommended)
1. Push this repo to GitHub.
2. Create a new site on Netlify -> New site from Git -> choose this repo.
3. Confirm build settings (Netlify reads `netlify.toml` but confirm):
   - Build command: `npm ci --prefix frontend && npm run build:css --prefix frontend`
   - Publish directory: `frontend`
4. Deploy and test the public URL. The `/api/*` client calls are redirected to the serverless proxy which forwards to `https://mil.psy.ntu.edu.tw:5000`.

CI smoke tests
- A lightweight GitHub Actions workflow is included at `.github/workflows/smoke.yml` to run smoke tests on push and upload the JSON outputs as workflow artifacts. This verifies that the backend endpoints respond.

If you need help pushing to GitHub, connecting Netlify, or adjusting the proxy, tell me and I will provide step-by-step commands.

---
Generated: local assistant helper
>>>>>>> c50b270 (Finish frontend polish + add README and CI smoke tests)
