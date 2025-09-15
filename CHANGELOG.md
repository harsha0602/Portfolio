## 2025-09-15 — Refactor to React/Vite, data-driven content

- Parsed `assets/CV.pdf` and created `data/profile.json` with Experience, Projects, Achievements, Skills, Education.
- Migrated site to a minimal React + Vite app with components: Hero, Experience, Projects, Achievements, Education, Skills.
- Implemented modern, responsive, accessible UI (WCAG AA), semantic sections, focus styles, and keyboard-friendly navigation.
- Added tech badges and impact chips; concise copy for entries (1–2 sentences + up to 3 highlights).
- SEO: title, meta description, OpenGraph/Twitter tags, canonical link, and JSON-LD Person.
- Performance: system fonts, no blocking scripts, lazy images by default, minimal CSS.
- Tooling: ESLint + Prettier, content validation script, and GitHub Actions CI (build + lint + validate content).

