# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio site for Martin Majidi (majidi.no): a single static page (`index.html`) plus one Vercel serverless function (`api/chat.js`) that powers a CV-grounded chatbot. Vanilla HTML/CSS/JS with no framework, no bundler, no build step, and no tests or linter.

## Commands

```bash
npx serve .          # static site only (chatbot calls to /api/chat will fail)
npm install          # first time, for the openai SDK used by api/chat.js
npx vercel dev       # full site including /api/chat; needs OPENAI_API_KEY in .env
```

Deployment runs on Vercel via `.github/workflows/deploy.yml`. PRs to `main` get a preview, pushes to `main` go to production, and each deploy is followed by a smoke test of `/` and `/api/chat`. Vercel's Git auto-deploy is turned off (`"git": {"deploymentEnabled": false}` in `vercel.json`), so don't re-enable it or every commit deploys twice. The workflow's `check` job is the closest thing to CI. It syntax-checks `js/*.js`, imports `api/chat.js`, and fails if a `css/components/*.css` file isn't `@import`ed in `css/main.css`. `OPENAI_API_KEY` lives in Vercel env vars, not in GitHub.

## Architecture

### Content lives in two places, so keep them in sync
- **`index.html`** holds the visible content. Every translatable element carries `data-en` and `data-no` attributes **and** English default text content. When editing copy, update all three.
- **`api/chat.js`** has a large `CV_CONTEXT` string (the CV, transcript, and detailed paper summaries) and a `SYSTEM_PROMPT`. This is the chatbot's entire knowledge base ("RAG" is simply this context stuffed into the system prompt; there is no vector store). Any change to experience, projects, or skills on the page should also be reflected here, and vice versa.

### i18n (`js/main.js`)
`setLang(lang)` is exposed on `window` for the inline `onclick` handlers on the EN/NO buttons. It swaps every `[data-<lang>]` element's content, using `innerHTML` if the value contains `<` and `textContent` otherwise, so attribute values may contain HTML markup. It sets `<html lang>` and dispatches a `langChange` window event. Other scripts (the chatbot) listen for `langChange` rather than calling into `main.js`.

### Chatbot (`js/chatbot.js` → `api/chat.js`)
- There are two widget instances built from the same helpers: `bot` (the inline demo inside `#chatEmbed`, opened by `#chatDemoBtn`) and `floating` (the `#floatingChat` panel, opened by `#floatingChatBtn` and the hero `#heroChatRing`). Each one keeps its own `history`.
- The client POSTs `{ messages, preferredLanguage }` to `/api/chat` and reads an SSE stream (`data: {"content": ...}` chunks, terminated by `data: [DONE]`).
- The server uses `gpt-4o-mini`, sends only the last 10 messages, and adds a Norwegian hint when `preferredLanguage === 'no'`. Function limits (256 MB, 30 s) are in `vercel.json`.
- Welcome text, suggestions, and placeholders are per-language constants (`WELCOME`, `SUGGESTIONS`, `PLACEHOLDER`) at the top of `chatbot.js`.

### JS conventions
Each script is a single `'use strict'` IIFE loaded with `defer`. DOM lookups go through a lazy `DOM` map of getter functions. Analytics go through a local `trackEvent()` wrapper around `gtag` (GA4, configured inline in `index.html`), which is a no-op if `gtag` is missing.

### CSS
`css/main.css` is the only stylesheet linked. It `@import`s `variables.css` (design tokens as custom properties), then base and layout, one file per section under `components/`, and `utilities.css` (keyframes and responsive breakpoints) last. A new section gets a new `components/*.css` file plus an import line. Class names in the HTML are short and terse (e.g. `.lb`, `.nc`, `.hst`, `.pc`), so grep for them before renaming.

### Scroll-reveal and stats
Add `.reveal` to an element to fade it in on scroll. Hero stat counters animate from `data-count` on `.hst .n` elements.

## Content constraints

- **Jotun / Hull Skating Solutions role:** by Jotun policy, do not add Martin's job title, responsibilities, tools, or any other role details anywhere, on the page or in `CV_CONTEXT`. Only mention that he works at Jotun with HSS and link the official page (`https://www.jotun.com/ww-en/products-and-services/solutions-and-brands/hull-skating-solutions/overview`).
- Supporting PDFs linked from the page and from `CV_CONTEXT` live in `assets/documents/`. Keep the paths in both places matching.
