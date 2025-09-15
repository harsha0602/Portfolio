# Harshavardhan Kuthadi — Portfolio

Refactored to a minimal React + Vite app with content sourced from `assets/CV.pdf` and centralized in `data/profile.json`.

## Install & Run
- Prerequisites: Node.js 18+ (recommend 20)
- Install: `npm i`
- Dev server: `npm run dev` then open the printed URL
- Build: `npm run build` (outputs to `dist/`)
- Preview: `npm run preview`

## Update Content (`data/profile.json`)
- This file is the single source of truth for the site content.
- Fields:
  - `name`, `headline`, `location`, `links`
  - `skills` grouped as `Languages`, `Frameworks/Tools`, `Cloud/Databases`
  - `experience[]` with `company`, `role`, `location`, `start`, `end`, `highlights[]`, `tech[]`
  - `projects[]` with `name`, `summary`, `tech[]`, `highlights[]`, `links{repo,demo}`
  - `achievements[]` with `title`, `issuer`, `date(YYYY-MM)`, `summary`
  - `education[]` with `school`, `degree`, `start`, `end`, `details`

Validate: `npm run test:content` ensures required fields and ISO date formats, and verifies experience is sorted newest-first.

## Add a New Project / Experience
- Project: add an object to `projects[]` with tech and 1–2 impacts (quantified when possible). External links should use `target="_blank"` and `rel="noopener noreferrer"`.
- Experience: add to `experience[]` and keep `start`/`end` as `YYYY-MM`. Up to 3 highlights recommended.
- Keep entries concise and scannable; the UI shows 1–2 sentences and up to 3 bullet highlights.

## Run Lighthouse Locally
- After `npm run build`, run `npm run preview`.
- Open the preview URL in Chrome.
- Open DevTools > Lighthouse, choose Mobile, and run the audit.
  - Targets: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.



## Deployment (GitHub Pages)
- The site is set up to deploy to GitHub Pages at `https://harsha0602.github.io/Portfolio/`.
- Vite `base` is configured in `vite.config.ts` as `/Portfolio/` so built assets resolve correctly on a project pages path.
- GitHub Actions workflow: `.github/workflows/deploy.yml` builds the site and publishes `dist/` to Pages.
- To deploy:
  - Push to `main` (or `master`). The workflow will run automatically.
  - In the repository settings, under Pages, set the source to "GitHub Actions" if not already.
  - First deploy may take a minute; check the Actions tab for status.
