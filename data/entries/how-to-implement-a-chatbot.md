# How to Implement a Chatbot on a Static Site

```json
{
  "id": "how-to-implement-a-chatbot",
  "title": "How to Implement a Chatbot on a Static Site",
  "category": "Web Development",
  "tags": ["javascript", "web-apps", "frontend", "api", "cloudflare", "openrouter", "chatbot", "static-site"],
  "summary": "Add live AI chat to GitHub Pages without exposing API keys: Cloudflare Worker proxy, JSON context from your own data files, and a themed chat panel with portrait states.",
  "header": "assets/entries/chatbot-header.png",
  "sources": [
    "https://matticushtml.github.io/Vantage-2.0/index.html",
    "https://openrouter.ai/docs",
    "https://developers.cloudflare.com/workers/",
    "VANTAGE Live Chat implementation record (operator)"
  ],
  "added": "2026-06-18 14:00 PT",
  "updated": "2026-06-18 14:00 PT",
  "verdict": "Static sites can talk back. You just need a proxy, your own JSON, and a portrait that knows when it is thinking."
}
```

This entry records how [VANTAGE // OVERSIGHT](https://matticushtml.github.io/Vantage-2.0/index.html) gained a live AI chat: a tactical analyst that reads the same squad data the site already renders and replies in character. The pattern works on any static host (GitHub Pages, Netlify, etc.) when you need a chatbot grounded in **your** data, not the model's memory.

## The problem

A static site serves HTML, CSS, JS, and markdown JSON dossiers. Anyone can open DevTools and read every line of `vantage.js`. If you paste an OpenRouter or OpenAI API key in client-side JavaScript, someone will scrape it and run up your bill.

So the browser never holds the key. A small **serverless proxy** holds it instead.

## Architecture

```
┌─────────────────┐     POST { messages }      ┌──────────────────────┐
│  Static site    │ ─────────────────────────► │  Cloudflare Worker   │
│  (your .js)     │     no API key in JS       │  (chat proxy)        │
│                 │ ◄───────────────────────── │                      │
│  Loads JSON     │     JSON reply             │  API key (secret)    │
│  from .md files │                            └──────────┬───────────┘
└─────────────────┘                                       │
                                                          ▼
                                               ┌──────────────────────┐
                                               │  OpenRouter API      │
                                               │  (e.g. DeepSeek)     │
                                               └──────────────────────┘
```

**Data never lives in the model.** Each chat request builds a fresh **system message** with compact JSON scraped from the same markdown files the site already uses. The model is instructed to answer only from that JSON.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Think of the Worker as a bouncer with a keyring. The browser knocks with messages. The bouncer adds the secret, talks to OpenRouter, and hands back the reply. The browser never sees the key.</p>
</div>

## Why a Cloudflare Worker

| If you put the key in… | Result |
|------------------------|--------|
| Client-side JavaScript | Key stolen; API bill abused |
| Worker secret (env var) | Key stays server-side; browser only knows the Worker URL |

The Worker is a thin proxy:

- **OPTIONS / POST** with CORS locked to your real site origin (`ALLOWED_ORIGINS`)
- Sanitizes message arrays (roles, length caps)
- Allowlists models (e.g. `deepseek/deepseek-v4-flash`)
- Forwards to `https://openrouter.ai/api/v1/chat/completions`
- Returns upstream JSON to the browser

**Worker URL:** safe to expose in your JS (e.g. `https://your-chat-worker.<account>.workers.dev`).

**Secrets (Cloudflare dashboard only, never commit):**

| Variable | Purpose |
|----------|---------|
| `OPENROUTER_API_KEY` | Your OpenRouter key |
| `ALLOWED_ORIGINS` | e.g. `https://yourname.github.io` |
| `SQUAD_TOKEN` | *(optional)* shared gate via `X-Squad-Token` header |

For local Live Preview, add `http://127.0.0.1:5500` (or your port) to `ALLOWED_ORIGINS`, comma-separated.

## How the bot "knows" your data

The LLM is not trained on your squad, catalog, or roster. Every send follows this pipeline:

### Step 1: Load records (same as the site)

```javascript
async function loadRecord(slug, season) {
  const res = await fetch(`data/${slug}/${season}/current.md`);
  const text = await res.text();
  const match = text.match(/```json\s*([\s\S]*?)```/);
  return match ? JSON.parse(match[1]) : null;
}
```

### Step 2: Build a context object

**Overview page** (squad command deck): all players with meta, stats, recent matches, latest commentary wave, season label.

**Detail page** (one player or item): full record for the focus subject plus a lightweight roster summary so "how do I compare?" questions work.

### Step 3: System prompt

A text block tells the model:

- Who it is (persona, tone)
- Use **ONLY** the JSON below; never invent stats
- Prefer short answers; cite **dates** from the data, not vague "recently"
- If a player is marked inactive, say so

### Step 4: Message history

```javascript
const messages = [
  { role: "system", content: systemPrompt },
  ...conversationHistory   // user + assistant turns this session
];
```

### Step 5: POST to the Worker

```javascript
const res = await fetch(CHAT_ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages, max_tokens: 800 })
});
const data = await res.json();
const reply = data.choices[0].message.content;
```

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Match arrays stored newest-first must use <code>.slice(0, 12)</code> for recent games, not <code>.slice(-12)</code>. The latter grabs the oldest entries and the bot will insist there is no recent data when the opposite is true.</p>
</div>

## Chat UI: states, theming, placement

### Portrait states

VANTAGE uses five images under `assets/images/vantage-chat/`:

| State | When | Asset |
|-------|------|--------|
| **Bubble** | Panel closed | `bubble.png` (launcher) |
| **Default** | Panel open, idle | `default.png` |
| **Thinking** | After send, waiting on Worker | `thinking.png` + animated 3-dot bubble |
| **Talking** | Reply received | `talking.png` for ~14 seconds, then Default |
| **Offline** | Error / no response | `offline.png` until reopen or retry |

The thinking dots exist because the thinking portrait alone looked broken. The bubble signals *working, one sec*.

![Default state](assets/entries/chatbot-state-default.png)
![Thinking state](assets/entries/chatbot-state-thinking.png)
![Talking state](assets/entries/chatbot-state-talking.png)
![Offline state](assets/entries/chatbot-state-offline.png)

### Theming

- **Overview page:** one accent (VANTAGE uses gold `#ffc800`)
- **Detail pages:** `--chat-accent` from each subject's roster color
- Border, header, user bubble, send button, and **bold** in replies follow the accent
- Chat log in a monospace face (JetBrains Mono on VANTAGE)

### Where chat appears

| Page type | Chat |
|-----------|------|
| Home / roster menu | No (keeps the landing clean) |
| Squad overview | Yes, full squad context |
| Individual dossiers | Yes, focus + lightweight meta |

Pattern mirrors a mini music player: fixed bottom corner bubble, panel opens upward, click-outside to close.

### Markdown in replies

`**bold**` in model output can render as accent-colored `<b>`. Escape plain text for XSS safety.

## Rollout order

| Phase | Scope | Why |
|-------|--------|-----|
| 1 | One overview page | Prove Worker, CORS, JSON injection |
| 2 | All detail pages | Per-subject context + accent theming |
| — | Home roster | Explicitly excluded |

## Security rules

**Do**

- Keep API keys only in Worker secrets
- Restrict CORS to your real origin
- Allowlist cheap models in the Worker
- Set spending caps on OpenRouter
- Rotate the key if it was ever pasted in chat or screenshots

**Do not**

- Commit API keys to GitHub
- Put keys in client JS, HTML, or screenshots
- Use `Access-Control-Allow-Origin: *` in production unless you accept public abuse

## Costs and limits

- **OpenRouter / DeepSeek Flash:** fractions of a cent per typical question (varies by length)
- **Cloudflare Workers:** free tier is generous for a friends-and-family site
- **Typical Worker caps:** max 24 messages, 32k chars per message, 800 default tokens (1200 cap)

## Bugs worth remembering

**"No recent data" (false):** `recentMatches: matches.slice(-12)` on a newest-first array sent the oldest games. Fix: `matches.slice(0, 12)`.

**"Last 48 hours" framing:** model invented relative time. Fix: prompt rules to cite `updated` and match dates.

**`hidden` ignored on flex items:** `display: flex` on a button overrode HTML `hidden`. Fix: `.btn[hidden] { display: none !important }`.

<details class="entry-fold">
<summary>Prompt an AI (chatbot on static site)</summary>
<div class="fold-body">
<p>Give the model this context:</p>
<ul>
<li>Static host (GitHub Pages URL)</li>
<li>Where JSON lives (markdown fenced blocks, paths)</li>
<li>Proxy choice (Cloudflare Worker)</li>
<li>Model via OpenRouter (name + allowlist)</li>
<li>Pages that get chat vs pages that do not</li>
<li>Portrait states and accent theming rules</li>
</ul>
<p>Sample prompt: <em>"I have a static squad tracker on GitHub Pages. JSON is in data/&lt;slug&gt;/&lt;season&gt;/current.md. Write a Cloudflare Worker that proxies OpenRouter chat/completions with CORS for my origin only, sanitizes messages, and allowlists deepseek/deepseek-v4-flash. Then sketch initChat() in vanilla JS: load JSON, build system prompt, POST to Worker, swap portrait to thinking/talking/offline."</em></p>
</div>
</details>

<details class="entry-fold">
<summary>Build it yourself (VANTAGE pattern)</summary>
<div class="fold-body">
<p><strong>Repo layout (VANTAGE 2.0):</strong></p>
<ul>
<li><code>assets/js/vantage.js</code> — <code>initVantageChat()</code>, context builders, system prompts, fetch to Worker</li>
<li><code>assets/css/vantage.css</code> — <code>.chat-ctl</code>, portrait, typing dots, accent variables</li>
<li><code>assets/images/vantage-chat/</code> — bubble, default, thinking, talking, offline</li>
<li><code>workers/vantage-chat.js</code> — Worker source (deploy via Cloudflare)</li>
<li><code>workers/wrangler.toml</code> — optional CLI deploy</li>
</ul>
<p><strong>Publish flow:</strong> commit in GitHub Desktop, Pages redeploys from <code>main</code>, hard refresh or cache-bust query strings on JS/CSS after changes.</p>
<p><strong>Test the Worker</strong> (PowerShell, no key in the command; set <code>Origin</code> to your allowed URL):</p>
<pre><code>$body = @{ messages = @(
  @{ role = "user"; content = "Say hello in one sentence." }
) } | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "https://your-chat-worker.&lt;account&gt;.workers.dev" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json"; "Origin" = "https://yourname.github.io" } `
  -Body $body</code></pre>
<p>Live reference: <a href="https://matticushtml.github.io/Vantage-2.0/index.html">VANTAGE // OVERSIGHT</a>. Open a player dossier or the command deck to see the chat bubble.</p>
</div>
</details>

## Live preview: chat panel shell

Markup and styling only. Scripts are sandboxed off in `preview` blocks, so this shows layout and accent theming, not a live API call.

```preview Chat panel shell (HTML + CSS)
<style>
  :root { --chat-accent: #ffc800; }
  .chat-demo {
    font-family: "JetBrains Mono", monospace;
    background: #0a0c10;
    color: #e8ecf4;
    padding: 16px;
    max-width: 320px;
    border: 1px solid var(--chat-accent);
    border-radius: 12px;
  }
  .chat-demo header {
    color: var(--chat-accent);
    font-size: 11px;
    letter-spacing: 0.12em;
    margin-bottom: 12px;
  }
  .chat-demo .log {
    min-height: 80px;
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 12px;
  }
  .chat-demo .user {
    text-align: right;
    color: var(--chat-accent);
    margin-bottom: 8px;
  }
  .chat-demo .bot b { color: var(--chat-accent); }
  .chat-demo form { display: flex; gap: 8px; }
  .chat-demo input {
    flex: 1;
    background: #141820;
    border: 1px solid #2a3040;
    color: #e8ecf4;
    padding: 8px;
    border-radius: 6px;
    font: inherit;
    font-size: 12px;
  }
  .chat-demo button {
    background: var(--chat-accent);
    color: #0a0c10;
    border: 0;
    padding: 8px 12px;
    border-radius: 6px;
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  }
</style>
<div class="chat-demo">
  <header>// VANTAGE CHANNEL</header>
  <div class="log">
    <div class="user">Who is performing best lately?</div>
    <div class="bot">One operator leads on <b>win rate</b> this season. Match dated Jun 15 backs it.</div>
  </div>
  <form onsubmit="return false">
    <input type="text" placeholder="Ask VANTAGE…" aria-label="Chat input" />
    <button type="submit">SEND</button>
  </form>
</div>
```

## Live demo: portrait state switcher

Click the buttons to swap portrait state. Same UX idea as the real site, without calling OpenRouter.

```demo Portrait states (no API)
<div id="stateDemo">
  <img id="portrait" src="assets/entries/chatbot-state-default.png" alt="Chat portrait" width="120" height="120" style="display:block;margin:0 auto 12px;border-radius:8px;" />
  <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;font-family:system-ui,sans-serif;font-size:12px;">
    <button type="button" data-src="assets/entries/chatbot-state-default.png">Default</button>
    <button type="button" data-src="assets/entries/chatbot-state-thinking.png">Thinking</button>
    <button type="button" data-src="assets/entries/chatbot-state-talking.png">Talking</button>
    <button type="button" data-src="assets/entries/chatbot-state-offline.png">Offline</button>
  </div>
</div>
<style>
  #stateDemo button {
    padding: 6px 10px; cursor: pointer;
    background: #141820; color: #ffc800; border: 1px solid #ffc800;
    border-radius: 6px;
  }
  #stateDemo button:hover { background: #1e2430; }
</style>
<script>
document.querySelectorAll("#stateDemo button").forEach(function(btn) {
  btn.addEventListener("click", function() {
    document.getElementById("portrait").src = btn.dataset.src;
  });
});
</script>
```

*Preview block: static chat shell for layout and accent color. Demo block: portrait state switcher because the full chat requires a Worker and API key outside the archive sandbox.*
