# majidi.no

Personal portfolio and resume site for Martin Majidi — Software Engineer & AI Engineer.
Features an AI chatbot powered by RAG (Retrieval-Augmented Generation) that answers questions about Martin's background.

## Project structure

```
majidi.no/
├── index.html          # Single-page app entry; semantic HTML only
├── CNAME               # Custom domain (majidi.no) for GitHub Pages
├── package.json        # Dependencies (openai SDK for chatbot API)
├── vercel.json         # Vercel serverless function config
├── api/
│   └── chat.js         # Serverless function: RAG chatbot (OpenAI GPT-4o-mini)
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
│       ├── chatbot.css # Floating chat widget styles
│       └── footer.css
├── js/
│   ├── main.js         # i18n (EN/NO), scroll UX, video defaults, stat counters
│   └── chatbot.js      # Chat widget: UI, streaming SSE, conversation management
└── assets/
    ├── images/         # Hero photo, etc.
    ├── videos/         # SmartCrop demos and output samples
    └── documents/      # CV PDFs (EN, NO)
```

## Tech stack

- **HTML5** — Semantic structure, `data-en` / `data-no` for i18n
- **CSS** — Custom properties, Flexbox/Grid, no preprocessor
- **JavaScript** — Vanilla JS, no framework; IIFE for scope
- **OpenAI GPT-4o-mini** — Powers the RAG chatbot via Vercel serverless function

## AI Chatbot

A floating chat widget that lets visitors ask questions about Martin. It uses:
- **RAG architecture** — Martin's full CV is used as retrieval context
- **GPT-4o-mini** — Fast, cost-effective responses via OpenAI API
- **Streaming SSE** — Tokens stream in real-time for responsive UX
- **Bilingual** — Responds in English or Norwegian based on user input

### Setup

1. Install dependencies: `npm install`
2. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. For local development with the chatbot: `npx vercel dev`
4. For production: set `OPENAI_API_KEY` in the Vercel dashboard under Environment Variables

## Run locally

For the static site only (no chatbot):

```bash
npx serve .
```

For the full site with chatbot:

```bash
npm install
npx vercel dev
```

## Deploy

- **Vercel** (recommended) — Connect the repo, set root directory to `majidi.no`, and add `OPENAI_API_KEY` in Environment Variables.
- **GitHub Pages** — Static site works, but the chatbot API requires Vercel or another serverless provider.

## License

© Martin Majidi. All rights reserved.
