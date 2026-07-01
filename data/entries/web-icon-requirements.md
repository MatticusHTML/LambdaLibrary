# Web Icons and App Icons: Sizes, Formats, and What Each Device Actually Wants

```json
{
  "id": "web-icon-requirements",
  "title": "Web Icons and App Icons: Sizes, Formats, and What Each Device Actually Wants",
  "category": "Research",
  "tags": ["icons", "favicon", "pwa", "web-development", "ios", "android", "manifest", "formatting", "research"],
  "summary": "Favicon, Apple touch icon, Android PWA manifest, maskable icons, ICO vs SVG vs PNG: every size, file type, and platform requirement for browser tabs, home screens, and install prompts.",
  "sources": [
    "https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs",
    "https://developer.mozilla.org/en-US/docs/Web/Manifest/icons",
    "https://developer.apple.com/design/human-interface-guidelines/app-icons",
    "https://web.dev/add-manifest/",
    "https://maskable.app/",
    "https://firt.dev/notes/pwa-ios/"
  ],
  "added": "2026-07-01 17:30 PT",
  "updated": "2026-07-01 17:30 PT",
  "verdict": "One logo. Six jobs. Skip the Apple tag and iOS serves a screenshot of your header. Nobody wants that."
}
```

This entry documents **what icon files a static site or PWA needs** for browser tabs, bookmarks, iPhone home screens, Android install prompts, and social link previews. The Lambda prism mark is now deployed site-wide per this spec.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p><strong>Icons are not one file.</strong> Browsers, iOS, and Android read different tags and manifests. A single <code>favicon.svg</code> covers modern desktop tabs but does nothing for "Add to Home Screen" on iPhone until you ship a <strong>180×180 PNG</strong> via <code>apple-touch-icon</code>. Regenerate all Lambda sizes from <code>scripts/generate-icons.py</code> (source art: <code>assets/favicon.svg</code>).</p>
</div>

## Part I: Why this is confusing

The word **favicon** stuck from the 1990s, but today "the site icon" means at least four different delivery paths:

| Consumer | What it reads | Format preference |
|----------|---------------|-------------------|
| Desktop browser tab | `<link rel="icon">` | SVG or ICO or PNG |
| iOS / iPadOS home screen | `<link rel="apple-touch-icon">` | **PNG only** (no SVG) |
| Android Chrome install | `site.webmanifest` → `icons[]` | PNG 192 + 512 |
| Social / chat unfurl | Open Graph `og:image` | PNG or JPG, large |

Each path ignores the others. Ship all of them or accept ugly fallbacks.

## Part II: The Lambda prism set (what this site ships)

After filing this entry, Lambda // Index includes:

| File | Size | Role |
|------|------|------|
| `assets/favicon.svg` | Scalable | Modern browser tabs, sharp at any DPI |
| `favicon.ico` | 16, 32, 48 embedded | Legacy tabs, bookmarks, Windows shortcuts |
| `assets/icons/icon-16x16.png` | 16×16 | Small tab fallback |
| `assets/icons/icon-32x32.png` | 32×32 | Standard tab |
| `assets/icons/apple-touch-icon.png` | 180×180 | **iPhone / iPad home screen** |
| `assets/icons/icon-192x192.png` | 192×192 | Android manifest minimum |
| `assets/icons/icon-512x512.png` | 512×512 | Install prompt, splash |
| `assets/icons/icon-512-maskable.png` | 512×512 padded | Android adaptive launcher mask |
| `site.webmanifest` | JSON | PWA name, theme, icon list |
| `assets/icons/og-image.png` | 512×512 | Link preview thumbnail |

Regenerate after editing the SVG: `python scripts/generate-icons.py`

```preview Icon sizes cheat sheet
<style>
  .ico-tbl { font-family: system-ui, sans-serif; background: #0e1118; color: #e9eef6; padding: 16px; border-radius: 12px; overflow-x: auto; }
  .ico-tbl table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 520px; }
  .ico-tbl th { color: #45d2ff; text-align: left; padding: 8px 10px; border-bottom: 2px solid #2a3040; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
  .ico-tbl td { padding: 8px 10px; border-bottom: 1px solid #1e2430; }
  .ico-tbl .req { color: #7dffa3; font-weight: 600; }
  .ico-tbl .opt { color: #888; }
  .ico-tbl .note { font-size: 11px; color: #666; margin-top: 10px; }
</style>
<div class="ico-tbl">
  <table>
    <tr><th>Size</th><th>Format</th><th>Platform</th><th>Priority</th></tr>
    <tr><td>SVG</td><td>vector</td><td>Chrome, Firefox, Safari tabs</td><td class="req">High</td></tr>
    <tr><td>ICO (16/32/48)</td><td>multi</td><td>Legacy browsers, Windows</td><td class="req">High</td></tr>
    <tr><td>180×180</td><td>PNG</td><td>iOS home screen</td><td class="req">Required</td></tr>
    <tr><td>192×192</td><td>PNG</td><td>Android manifest</td><td class="req">Required for PWA</td></tr>
    <tr><td>512×512</td><td>PNG</td><td>Android install / splash</td><td class="req">Required for PWA</td></tr>
    <tr><td>512 maskable</td><td>PNG padded</td><td>Android adaptive icons</td><td class="opt">Recommended</td></tr>
    <tr><td>152, 167</td><td>PNG</td><td>Older iPad / iPhone</td><td class="opt">Optional (180 covers most)</td></tr>
  </table>
  <p class="note">256×256 is a common design export size, not a separate platform requirement. Scale from 512 or SVG.</p>
</div>
```

## Part III: File formats compared

### SVG (`favicon.svg`)

**Pros:** One file scales to any tab size. Tiny on disk. Crisp on retina.

**Cons:** iOS home screen **does not** use SVG for web clips. Some older Edge modes ignore it.

**Use for:** Primary `<link rel="icon" type="image/svg+xml">` on modern sites.

### ICO (`favicon.ico`)

**Pros:** Windows and old browsers expect it at `/favicon.ico` automatically. Can embed **multiple raster sizes** (16, 32, 48) in one file.

**Cons:** No vector. Must regenerate when logo changes.

**Use for:** Root `favicon.ico` plus optional explicit `<link rel="icon" href="favicon.ico">`.

### PNG (raster sizes)

**Pros:** Universal. Required for Apple touch icons and manifest icons.

**Cons:** One file per size (or rely on browser downscaling one large PNG, which is lazy and sometimes blurry).

**Use for:** 180, 192, 512, maskable 512, og:image.

### JPEG

**Pros:** Fine for `og:image` photos.

**Cons:** No transparency. Wrong for logos on non-rectangular backgrounds.

**Use for:** Social preview **photos**, not UI icons.

## Part IV: HTML `<head>` requirements (browser tabs and iOS)

### Minimum viable modern head

```html
<link rel="icon" href="favicon.ico" sizes="48x48" />
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg" />
<link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png" />
<link rel="manifest" href="site.webmanifest" />
<meta name="theme-color" content="#090b10" />
```

### What each tag does

| Tag | Device / context |
|-----|------------------|
| `rel="icon"` SVG | Desktop/mobile browser tab (WebKit, Chromium, Firefox) |
| `rel="icon"` ICO | Fallback; Windows taskbar pin |
| `rel="apple-touch-icon"` | iOS Safari "Add to Home Screen" icon |
| `rel="manifest"` | Points to JSON for installable PWA metadata |
| `meta theme-color` | Android Chrome toolbar tint; some splash behavior |
| `apple-mobile-web-app-title` | Short name under iOS home screen icon |

### iOS specifics

- Apple has supported `apple-touch-icon` since **iOS 2.0** (2008).
- **180×180** is the current iPhone retina standard (3× on 60pt grid).
- **Without** `apple-touch-icon`, iOS captures a **screenshot** of the page. It looks terrible. Do not skip this.
- iOS **15.4+** can read manifest `icons`, but `apple-touch-icon` still overrides when present (per WebKit / firt.dev PWA notes). Keep the dedicated PNG.
- iOS does **not** support SVG for home screen icons. PNG only.
- `apple-touch-startup-image` is separate: splash screens for full-screen web apps. Optional for Lambda-style archive sites.

### Android / Chrome tab

- Reads `favicon.ico`, PNG `rel="icon"`, and manifest icons.
- **Install prompt** needs manifest with **192×192** and **512×512** PNG entries.

## Part V: Web App Manifest (`site.webmanifest`)

JSON file linked once:

```html
<link rel="manifest" href="site.webmanifest" />
```

### Required fields for installability

| Field | Purpose |
|-------|---------|
| `name` | Full app name on install sheet |
| `short_name` | Home screen label (keep short) |
| `start_url` | Opens when launched from icon |
| `display` | `standalone` hides browser chrome |
| `icons` | At least 192 and 512 PNG |
| `theme_color` | UI chrome color |
| `background_color` | Splash while loading |

### Icon entries in manifest

```json
{
  "src": "assets/icons/icon-192x192.png",
  "sizes": "192x192",
  "type": "image/png",
  "purpose": "any"
}
```

**`purpose` values:**

| Value | Meaning |
|-------|---------|
| `any` | Normal icon, full bleed OK |
| `maskable` | Logo must survive circular / squircle crop |
| `monochrome` | Single-color variant (rare on web) |

Ship **`any` and `maskable` as separate 512×512 files**. Do not combine purposes on one image unless you enjoy half-clipped logos.

### Maskable safe zone

Android launchers apply **adaptive masks** (circle, squircle, teardrop). Artwork must fit inside the central **~80%** circle of a 512×512 canvas (often cited as **409×409** safe zone).

Test at [maskable.app](https://maskable.app/). Lambda's `icon-512-maskable.png` shrinks the prism to ~66% canvas with full `#090b10` background.

## Part VI: Size-by-size reference

| Pixels | Who asks for it |
|--------|-----------------|
| **16×16** | Browser tabs (1× displays), favicon.ico |
| **32×32** | Browser tabs (standard), Windows taskbar |
| **48×48** | Windows site icons, ICO bundle |
| **72×72** | Legacy Android density |
| **96×96** | Android / some launchers |
| **128×128** | Chrome Web Store, some Android |
| **152×152** | iPad (older) |
| **167×167** | iPad Pro (older docs) |
| **180×180** | **iPhone home screen (current default)** |
| **192×192** | **Manifest minimum** (Android install) |
| **256×256** | Design export convention, not a hard platform spec |
| **384×384** | Some Android splash math |
| **512×512** | **Manifest maximum** (install prompt, splash) |
| **1024×1024** | Native **App Store** binary icons (not web PWA) |

**256×256** appears in tooling and Windows shortcuts but is not a separate web requirement if you already ship 512 and SVG.

## Part VII: Native app stores (not the same as web)

If you ever wrap the archive in a **native** shell (Capacitor, TWA, App Store binary):

| Platform | Master size | Format | Notes |
|----------|-------------|--------|-------|
| **iOS App Store** | 1024×1024 | PNG, no alpha | Xcode generates all smaller iOS sizes |
| **Android Play Store** | 512×512 | PNG 32-bit | Adaptive foreground + background layers |
| **Windows Store** | Multiple | PNG | 44 to 256 range in package manifest |

Web PWA icons get you **Add to Home Screen**. Store listings are a second pipeline.

## Part VIII: Social and Open Graph

When you paste a URL in Discord, Slack, or iMessage:

```html
<meta property="og:image" content="assets/icons/og-image.png" />
<meta property="og:title" content="Lambda // Index" />
```

| Guideline | Detail |
|-----------|--------|
| Recommended size | **1200×630** for rich cards (Facebook/LinkedIn ideal) |
| Minimum that works | 200×200; square 512 OK but crops oddly |
| Format | PNG or JPG |
| Absolute URL | Some crawlers want full `https://` URL on production |

Lambda uses a **512×512** prism PNG as a simple square preview. Upgrade to 1200×630 branded card later if share previews matter.

## Part IX: Common failures (lore)

1. **"I added a manifest but iPhone still looks wrong."** You forgot `apple-touch-icon`. Manifest alone is not enough on iOS.
2. **"Android clipped my logo."** You used `purpose: any` for a full-bleed square. Need maskable padding.
3. **"Only one PNG at 512."** Chrome wants **192 and 512** listed separately.
4. **"favicon.ico 404."** Browsers request `/favicon.ico` even if you never linked it. Put one at site root.
5. **"256×256 is required."** It is a habit from Windows ICO tooling, not a web manifest requirement. Nice to have, not mandatory.
6. **GitHub Pages path.** Use **relative** URLs (`assets/icons/...`) so project-page subpaths work.

## Part X: Decision guide

| Goal | Ship this |
|------|-----------|
| Browser tab only | `favicon.svg` + `favicon.ico` |
| + iPhone home screen | Add `apple-touch-icon` **180×180 PNG** |
| + Android install | Add `site.webmanifest` with 192 + 512 PNG |
| + Polished Android launcher | Add **512 maskable** PNG |
| + Pretty link shares | Add `og:image` (1200×630 ideal) |
| Native App Store | Separate 1024 pipeline in Xcode / Android Studio |

```preview What to ship (flowchart)
<style>
  .ico-flow { font-family: system-ui, sans-serif; background: #0e1118; color: #e9eef6; padding: 20px; border-radius: 12px; max-width: 400px; font-size: 13px; line-height: 1.55; }
  .ico-flow h4 { margin: 0 0 12px; color: #45d2ff; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; }
  .ico-flow .step { padding: 10px 12px; margin-bottom: 8px; background: #141820; border-left: 3px solid #2a3040; border-radius: 0 8px 8px 0; }
  .ico-flow .ans { border-left-color: #7dffa3; color: #7dffa3; font-weight: 600; }
</style>
<div class="ico-flow">
  <h4>Icon checklist</h4>
  <div class="step">Static site, desktop users only?</div>
  <div class="step ans">favicon.svg + favicon.ico</div>
  <div class="step">Anyone on iPhone might bookmark it?</div>
  <div class="step ans">+ apple-touch-icon 180 PNG</div>
  <div class="step">Install as app on Android?</div>
  <div class="step ans">+ webmanifest 192 &amp; 512 PNG</div>
  <div class="step">Logo survives circle crop?</div>
  <div class="step ans">+ 512 maskable PNG</div>
</div>
```

## Part XI: Lambda implementation notes

- **Source of truth:** `assets/favicon.svg` (prism outline + core, `#45d2ff` on `#090b10`).
- **Generator:** `scripts/generate-icons.py` (Pillow). Re-run after any logo edit.
- **Wired in:** `index.html`, `tools/color-library.html`, `site.webmanifest`, root `favicon.ico`.
- **Theme color:** `#090b10` matches `--bg` in `css/style.css`.

<details class="entry-fold">
<summary>Prompt an AI (icon set for my site)</summary>
<div class="fold-body">
<p>Tell the model:</p>
<ul>
<li>Static site or PWA? GitHub Pages root or subpath?</li>
<li>Logo format you have (SVG, PNG master size)</li>
<li>Need iOS home screen, Android install, or tabs only</li>
</ul>
<p>Sample prompt: <em>"I have a 512×512 PNG logo on a static GitHub Pages site. List every icon file and HTML meta tag I need for Chrome tabs, iPhone Add to Home Screen, and Android PWA install. Include maskable safe zone guidance."</em></p>
</div>
</details>

<details class="entry-fold">
<summary>Build it yourself (verify icons)</summary>
<div class="fold-body">
<p><strong>Chrome:</strong> DevTools → Application → Manifest. Check icons load, no 404.</p>
<p><strong>iOS:</strong> Safari → Share → Add to Home Screen. Icon should be prism on dark square, not a page screenshot.</p>
<p><strong>Android:</strong> Chrome menu → Install app (or Add to Home screen). Icon should match manifest 192/512.</p>
<p><strong>Maskable:</strong> Upload 512 maskable PNG to <a href="https://maskable.app/">maskable.app</a> and preview circle / squircle crops.</p>
<p><strong>Regenerate Lambda assets:</strong></p>
<pre><code>python scripts/generate-icons.py</code></pre>
</div>
</details>

*Preview blocks: static size table and checklist flowchart. Lambda site updated July 2026 with full icon set per this spec.*
