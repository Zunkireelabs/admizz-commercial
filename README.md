# Admizz Commercial

## Stack

- [Eleventy (11ty) 3.x](https://www.11ty.dev/) — static site generator, Nunjucks templates
- [Vite 7](https://vite.dev/) — build/dev server, via `@11ty/eleventy-plugin-vite`
- [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS
- [Alpine.js 3](https://alpinejs.dev/) — lightweight interactivity
- [GSAP](https://gsap.com/) + [Lenis](https://lenis.darkroom.engineering/) — animation / smooth scroll
- [Sharp](https://sharp.pixelplumbing.com/) — build-time image processing

## Commands

```bash
npm install
npm run dev     # dev server at localhost:8080
npm run build   # production build to dist/
npm run clean   # remove dist/
```

## Structure

```
src/
  pages/                    # top-level pages (.njk)
  _includes/layouts/        # base layout(s)
  _includes/partials/       # header, footer
  _data/                    # site.json, navigation.json, env.js
  assets/{css,js,images,fonts}/
public/                     # static passthrough (robots.txt, etc.)
```

## Status

Bare scaffold only — no branding, no content, no CI/CD, no Docker/deploy config yet.
Those come later once the project is briefed.
