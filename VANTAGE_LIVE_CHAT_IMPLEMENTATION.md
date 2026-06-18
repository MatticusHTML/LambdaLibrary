# VANTAGE Live Chat — Implementation Record

**Project:** VANTAGE 2.0 (Rainbow Six Siege squad tracker)  
**Site:** Static GitHub Pages — HTML, CSS, JS + markdown JSON dossiers  
**Season at launch:** Y11S2 · Operation System Override  
**Status:** Live on OVERSIGHT + all seven player dossiers (not the home roster page)

This document records how we added a **live AI chat** to VANTAGE — the tactical coaching analyst who reads real squad data and talks back in character. Written as a personal reference; safe to store outside the repo.

---

## Table of contents

1. [What we built](#1-what-we-built)
2. [Architecture (the big picture)](#2-architecture-the-big-picture)
3. [Why a Cloudflare Worker](#3-why-a-cloudflare-worker)
4. [How VANTAGE “knows” the stats](#4-how-vantage-knows-the-stats)
5. [Chat UI — states, theming, UX](#5-chat-ui--states-theming-ux)
6. [Rollout phases](#6-rollout-phases)
7. [Key files in the repo](#7-key-files-in-the-repo)
8. [Bugs we hit and fixed](#8-bugs-we-hit-and-fixed)
9. [Security rules (non-negotiable)](#9-security-rules-non-negotiable)
10. [Costs and limits](#10-costs-and-limits)
11. [Related site work from the same era](#11-related-site-work-from-the-same-era)
12. [Quick reference](#12-quick-reference)

---

## 1. What we built

Before this update, VANTAGE was **static**: stats and coaching comments lived in `data/<player>/<season>/current.md` JSON blocks, written by hand in Cursor. The website rendered them; it did not *talk back*.

After this update:

- A **chat bubble** sits bottom-left on dossier and OVERSIGHT pages (mirroring the music mini-player bottom-right).
- Clicking it opens **// VANTAGE CHANNEL** — a compact panel with portrait, message log, and input.
- The user asks questions; **VANTAGE replies in voice**, grounded in the **same JSON the site already uses**.
- **DeepSeek** (via OpenRouter) generates the text. The browser never sees an API key.

Example questions that work well:

- *“Who’s performing best lately?”* (OVERSIGHT)
- *“Should I keep maining Tachanka?”* (CunderThock dossier)
- *“How does my win rate compare to Sandman?”* (any dossier — includes lightweight squad meta)

The home **roster / character-select page** intentionally has **no chat** — keeps the menu clean. Chat is for people already inside a dossier or the command deck.

---

## 2. Architecture (the big picture)

```
┌─────────────────┐     POST { messages }      ┌──────────────────────┐
│  GitHub Pages   │ ─────────────────────────► │  Cloudflare Worker   │
│  (vantage.js)   │     no API key in JS       │  (vantage-chat.js)   │
│                 │ ◄───────────────────────── │                      │
│  Loads squad    │     JSON reply             │  OPENROUTER_API_KEY  │
│  JSON from      │                            │  (secret only here)  │
│  current.md     │                            └──────────┬───────────┘
└─────────────────┘                                       │
                                                          ▼
                                               ┌──────────────────────┐
                                               │  OpenRouter API      │
                                               │  deepseek-v4-flash   │
                                               └──────────────────────┘
```

**Data never lives in the model.** Each chat request builds a fresh **system message** containing compact squad/dossier JSON scraped from the live markdown files on GitHub Pages — the same source of truth as the rest of the site.

---

## 3. Why a Cloudflare Worker

GitHub Pages serves **static files only**. Anyone can read `vantage.js` in DevTools.

| If you put the key in… | Result |
|------------------------|--------|
| `vantage.js` | Key stolen; OpenRouter bill abused |
| Cloudflare Worker secret | Key stays server-side; browser only knows the Worker URL |

The Worker (`workers/vantage-chat.js`) is a thin proxy:

- **OPTIONS / POST** with CORS locked to your GitHub Pages origin (`ALLOWED_ORIGINS`)
- Sanitizes message arrays (roles, length caps)
- Allowlists models (`deepseek/deepseek-v4-flash`, etc.)
- Forwards to `https://openrouter.ai/api/v1/chat/completions`
- Returns the upstream JSON to the browser

**Worker URL (public — safe to expose):**  
`https://vantagesecurity.matticus-ai.workers.dev`

**Secrets (Cloudflare dashboard only — never commit, never paste in docs):**

| Variable | Purpose |
|----------|---------|
| `OPENROUTER_API_KEY` | Encrypted secret — your OpenRouter key |
| `ALLOWED_ORIGINS` | e.g. `https://matticushtml.github.io` |
| `SQUAD_TOKEN` | *(optional)* shared gate via `X-Squad-Token` header |

Local testing: add `http://127.0.0.1:5500` (or your Live Preview port) to `ALLOWED_ORIGINS` comma-separated.

---

## 4. How VANTAGE “knows” the stats

DeepSeek is **not** trained on your squad. Every send follows this pipeline:

### Step 1 — Load records (same as the site)

```javascript
loadRecord(slug, season)  // fetches data/<slug>/<season>/current.md, parses ```json block
```

### Step 2 — Build context object

**OVERSIGHT** (`buildOversightChatContext`):

- All seven players: meta, operators, badges, **12 most recent matches**
- Latest OVERSIGHT comment wave (1 map + 5 operators)
- Season label (e.g. Operation System Override)

**Player dossier** (`buildPlayerChatContext`):

- **focusPlayer** — full compact dossier for that page’s player
- **squadMeta** — lightweight roster summary (rank, RP, W/L, K/D) for “how do I compare?” questions
- Latest comment wave for that player

### Step 3 — System prompt

A text block tells the model:

- You are VANTAGE — tactical analyst, Discord names only
- Use **ONLY** the JSON below; never invent stats
- Tone: direct, roast the play not the person
- Chat UI prefers **short** answers; cite **match dates** not vague “last 48 hours”
- If `active: false`, player hasn’t played this season

### Step 4 — Message history

```javascript
messages = [
  { role: "system", content: systemPrompt },
  ...conversationHistory  // user + assistant turns this session
]
```

### Step 5 — POST to Worker

```javascript
fetch(VANTAGE_CHAT_ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages, max_tokens: 800 })
})
```

Response path: `data.choices[0].message.content`

**Important implementation detail:** Match arrays in dossiers are **newest-first**. Recent matches must use `.slice(0, 12)` — not `.slice(-12)` (which grabbed the *oldest* games and caused “no recent data” mistakes).

---

## 5. Chat UI — states, theming, UX

### Portrait states

| State | When | Asset |
|-------|------|--------|
| **Default** | Panel open, idle | `assets/images/vantage-chat/default.png` |
| **Thinking** | After user sends, waiting on Worker | `thinking.png` + animated **3-dot bubble** (top-right of portrait) |
| **Talking** | Reply received | `talking.png` for **14 seconds**, then Default |
| **Offline** | Error / no response | `offline.png` until reopen or retry |

The thinking dots exist because the thinking portrait alone looked “broken” — the bubble signals *working, one sec*.

### Theming

- **OVERSIGHT:** gold command-deck accent (`#ffc800`)
- **Player dossiers:** `--chat-accent` set from each player’s roster color (purple Matticus, blue Rogue, green Sandman, etc.)
- Border, header, user bubble, send button, and **bold** text in replies follow the accent
- Chat log uses **JetBrains Mono**

### Where chat appears

| Page | Chat |
|------|------|
| `index.html` (roster) | No |
| `oversight.html` | Yes — full squad context |
| `players/*.html` | Yes — dossier-focused context |
| `soundtracks.html` | No |

Pattern mirrors the **mini music player**: fixed bottom-left bubble, panel opens upward, click-outside to close.

### Markdown in replies

`**bold**` in model output renders as gold (or accent-colored) `<b>` in the chat bubble. Plain text is escaped for XSS safety.

---

## 6. Rollout phases

What we actually shipped:

| Phase | Scope | Notes |
|-------|--------|-------|
| **1** | OVERSIGHT only | Prove Worker, CORS, squad JSON injection |
| **2** | All seven dossiers | Per-player context + accent theming |
| **—** | Home roster | Explicitly excluded |

Future ideas (not required for the historic record):

- Streaming / typewriter replies
- “Clear conversation” button
- Tighter default length cap in the Worker

---

## 7. Key files in the repo

| File | Role |
|------|------|
| `assets/js/vantage.js` | `initVantageChat()`, context builders, system prompts, fetch to Worker |
| `assets/css/vantage.css` | `.chat-ctl`, portrait, typing dots, accent variables |
| `assets/images/vantage-chat/` | `bubble.png`, `default.png`, `thinking.png`, `talking.png`, `offline.png` |
| `workers/vantage-chat.js` | Production Worker source (deploy via Cloudflare) |
| `workers/wrangler.toml` | Wrangler config (optional CLI deploy) |
| `workers/README.md` | Deploy + env var checklist |
| `VANTAGE_CHAT_SETUP_WALKTHROUGH.md` | Pre-build planning guide |
| `index.html` | New roster banner (`roster-header.png` — chatbot launch day art) |

**Not in the browser:** OpenRouter API key, `.dev.vars` (gitignored).

---

## 8. Bugs we hit and fixed

### “Blang has no recent data” (false)

- **Cause:** `recentMatches: matches.slice(-12)` on a **newest-first** array sent the oldest games.
- **Fix:** `matches.slice(0, 12)`.

### “Last 48 hours” framing (sloppy)

- **Cause:** Model invented relative time.
- **Fix:** Prompt rules — cite `updated` and match dates (e.g. Jun 15).

### Mini music player showed all 12 albums

- **Cause:** `display: flex` on `.bgm-album-btn` overrode HTML `hidden`.
- **Fix:** `.bgm-album-btn[hidden] { display: none !important }`; mini paginates 4 per page; full `soundtracks.html` shows all albums; removed redundant “Full soundtrack library” link from mini player.

### GitHub Pages size warning (~1 GB)

- **Cause:** `assets/audio/` soundtrack library (~1 GB), not chat images (~0.5 MB).
- **Note:** Site can still deploy; trimming albums or hosting audio elsewhere is a future ops task.

---

## 9. Security rules (non-negotiable)

**DO**

- Keep `OPENROUTER_API_KEY` only in Cloudflare Worker secrets
- Restrict CORS to your real GitHub Pages origin
- Allowlist cheap models in the Worker
- Set spending caps on OpenRouter
- Rotate the key if it was ever pasted in chat, Discord, or screenshots

**DO NOT**

- Commit API keys to GitHub (even private repos)
- Put keys in `vantage.js`, HTML, or screenshots
- Use `Access-Control-Allow-Origin: *` in production unless you accept public abuse

---

## 10. Costs and limits

- **OpenRouter / DeepSeek Flash:** fractions of a cent per typical squad question (varies by length)
- **Cloudflare Workers:** free tier is generous for a friends-and-family squad site
- **Worker caps in code:** max 24 messages, 32k chars per message, 800 default tokens (1200 cap)

---

## 11. Related site work from the same era

Same deployment window, for context:

- **Live chat** (this document)
- **Roster banner** replaced with “CHATBOT LAUNCH DAY” art — VANTAGE drowning in phones
- **Mini MP3 player** restored to 4-album pagination + track list (shared playlist with full soundtracks page)
- **Y11S2 squad data refresh** — six players updated, OVERSIGHT wave 8, Doka pool refresh

---

## 12. Quick reference

### Test the Worker (PowerShell — no key in command)

Use a JSON body file; set `Origin` to your allowed GitHub Pages URL:

```powershell
$body = @{ messages = @(
  @{ role = "user"; content = "Say hello in one sentence." }
) } | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "https://vantagesecurity.matticus-ai.workers.dev" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json"; "Origin" = "https://matticushtml.github.io" } `
  -Body $body
```

### Publish flow

1. Commit in **GitHub Desktop** (Matticus pushes — not CLI `git push` from the agent)
2. GitHub Pages redeploys from `main` (~1 minute)
3. Hard refresh or cache-bust query strings on `vantage.js` / `vantage.css` after JS/CSS changes

### Squad (Discord names)

Matticus HQ · CunderThock · Rogue_Amputee · Grandmaster Sandman · slackandlack · MJester1337 · Mynameisblang

---

*The high ground is reserved for those who earn it — and on launch day, VANTAGE earned a lot of phone calls.*

**Document version:** June 2026 · VANTAGE Live Chat launch record
