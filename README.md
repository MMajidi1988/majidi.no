# majidi.no

Personal portfolio and resume site for Martin Majidi — Software Engineer & AI Engineer.

## Project structure

```
majidi.no/
├── index.html          # Single-page app entry; semantic HTML only
├── CNAME               # Custom domain (majidi.no) for GitHub Pages
├── css/
│   ├── main.css        # Entry point; imports all partials
│   ├── variables.css   # Design tokens (colors, typography, spacing)
│   ├── base.css        # Reset and global body styles
│   ├── layout.css      # Section layout, reveal animation
│   ├── utilities.css   # Keyframes, responsive breakpoints
│   └── components/
│       ├── nav.css
│       ├── hero.css
│       ├── about.css
│       ├── experience.css
│       ├── projects.css
│       ├── publications.css
│       ├── skills.css
│       ├── contact.css
│       └── footer.css
├── js/
│   └── main.js         # i18n (EN/NO), scroll UX, video defaults, stat counters
└── assets/
    ├── images/         # Hero photo, etc.
    ├── videos/         # SmartCrop demos and output samples
    └── documents/      # CV PDFs (EN, NO)
```

## Tech stack

- **HTML5** — Semantic structure, `data-en` / `data-no` for i18n
- **CSS** — Custom properties, Flexbox/Grid, no preprocessor
- **JavaScript** — Vanilla JS, no framework; IIFE for scope

## Run locally

Open `index.html` in a browser, or use a static server:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploy

- **GitHub Pages** — Push to the repo; set custom domain in Settings → Pages if using `CNAME`.
- Ensure **Enforce HTTPS** is enabled after DNS propagates.

## License

© Martin Majidi. All rights reserved.
