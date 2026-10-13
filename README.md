# Sakshi Menghani — Portfolio

Personal site for [Sakshi Menghani](https://www.linkedin.com/in/sakshi-menghani): AI/ML engineer work, selected projects, and a 3D AI twin that answers questions from the resume. Everything runs in the browser — no paid APIs, no backend — so it can live on GitHub Pages for free.

Inspired by the editorial tone of [Huiyu Chen](https://chenhuiyu.github.io/) and the interactive 3D energy of [Saksham Saxena](https://saksham-saxena-portfolio.vercel.app/).

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages (free)

1. Create a GitHub repository and push this project to the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds the site and publishes `dist`.
4. After the first successful run, the site is at:

- User site, if the repo is named `YourUsername.github.io`: `https://yourusername.github.io/`
- Project site otherwise: `https://yourusername.github.io/repo-name/`

The Vite `base` is `./`, so both URL shapes work.

## What’s free on purpose

- Hosting: GitHub Pages
- 3D avatar: Three.js / React Three Fiber, rendered on the visitor’s machine
- “AI twin”: a small on-page retrieval engine over the resume (no OpenAI key)
- Optional voice: the browser’s built-in speech synthesis
