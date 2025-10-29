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



