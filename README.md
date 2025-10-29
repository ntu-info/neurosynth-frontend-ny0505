<<<<<<< HEAD

# 🧠 Neurosynth Frontend — AJAX Demo

A modern, static frontend for querying the [Tren backend](https://mil.psy.ntu.edu.tw:5000) and visualizing results.  
Built with **Tailwind CSS** and deployable to Netlify with a serverless proxy for seamless CORS-free API calls.

---

## 🚀 Quick Start

1. **Clone & Install**
   ```powershell
   git clone <your-repo-url>
   pwsh -c "npm ci --prefix frontend"
   ```

2. **Build Tailwind CSS**
   ```powershell
   pwsh -c "npm run build:css --prefix frontend"
   ```

3. **Run Locally with Netlify Dev**
   ```powershell
   npx netlify dev
   ```
   Open [http://localhost:8888](http://localhost:8888) and try the sample links in the UI.

---

## 🗂️ Project Structure

```
frontend/                # Static site source & Tailwind config
  ├─ index.html
  ├─ main.js
  ├─ styles.css
  └─ ...
netlify/functions/
  └─ proxy.js            # Serverless proxy for API requests
netlify.toml             # Netlify config (publish dir, build cmd)
scripts/
  └─ smoke.ps1           # PowerShell smoke test script
```

---

## 🌐 Deploy to Netlify

1. **Push to GitHub**
2. **Create a New Site on Netlify**
   - New site from Git → select this repo
   - Build command:  
     ```
     npm ci --prefix frontend && npm run build:css --prefix frontend
     ```
   - Publish directory: `frontend`
3. **Deploy & Test**
   - The `/api/*` client calls are redirected to the serverless proxy, which forwards to `https://mil.psy.ntu.edu.tw:5000`.

---

## 🧪 CI Smoke Tests

- GitHub Actions workflow at `.github/workflows/smoke.yml` runs smoke tests on push and uploads JSON outputs as workflow artifacts.
- Verifies backend endpoints respond as expected.

---

## 📝 Notes

- If you need help pushing to GitHub, connecting Netlify, or adjusting the proxy, just ask!
- This project was generated with the help of an AI assistant.

---

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/yOwut1-r)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21353391&assignment_repo_type=AssignmentRepo)
>>>>>>> c50b270 (Finish frontend polish + add README and CI smoke tests)
