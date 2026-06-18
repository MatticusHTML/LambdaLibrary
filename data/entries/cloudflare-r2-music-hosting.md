# How to Host Music on Cloudflare R2

```json
{
  "id": "cloudflare-r2-music-hosting",
  "title": "How to Host Music on Cloudflare R2",
  "category": "Web Development",
  "tags": ["cloudflare", "r2", "hosting", "static-site", "audio", "music", "github-pages", "media", "javascript"],
  "summary": "Store audio and other large media on Cloudflare R2 with free egress, serve it by URL on a static site, and keep your GitHub Pages repo small.",
  "library": "https://developers.cloudflare.com/r2/",
  "intro": "Cloudflare R2 is object storage for files like MP3s, videos, and big images. Unlike many cloud buckets, R2 does not charge egress bandwidth when files are streamed or downloaded. Your website repo holds code and links; R2 holds the heavy media.",
  "sources": [
    "https://developers.cloudflare.com/r2/",
    "https://developers.cloudflare.com/r2/buckets/public-buckets/",
    "https://developers.cloudflare.com/r2/pricing/",
    "https://developers.cloudflare.com/r2/examples/rclone/",
    "Operator guide (Cloudflare_R2_Music_Hosting_Guide.md)"
  ],
  "added": "2026-06-19 11:15 PT",
  "updated": "2026-06-19 11:15 PT",
  "verdict": "The repo stays light. The bucket holds the weight. Egress is free, which is the whole trick."
}
```

[Cloudflare R2](https://developers.cloudflare.com/r2/) is object storage for unstructured data: audio, video, images, datasets, backups. For static sites on GitHub Pages or similar hosts, R2 solves a specific problem: **media does not belong in the repo**.

A soundtrack library can blow past the **1 GB** GitHub Pages publish limit and slow every deploy. The fix is to upload files to R2, serve them by URL, and delete the binaries from your site repo. Your deployed site shrinks to a few megabytes of HTML, CSS, and JS.

This pairs naturally with other Cloudflare patterns in the archive, like the [chatbot Worker proxy](#/e/how-to-implement-a-chatbot). Workers hide API keys; R2 holds large files. Different jobs, same ecosystem.

## Why R2 for media

The cost that hurts when serving media is **egress**: bandwidth out every time a file is played or downloaded. [R2's pricing model](https://developers.cloudflare.com/r2/pricing/) emphasizes **no egress fees** for data served from R2 (including via public buckets and custom domains on Cloudflare). You pay for storage and operations, not for repeat streams to a friend group.

| Approach | Repo size | Bandwidth on static host | Repeat streams |
|----------|-----------|--------------------------|----------------|
| MP3s in GitHub Pages repo | Bloated, may hit 1 GB cap | Burns Pages bandwidth | Same cost each play |
| MP3s on R2, linked by URL | Tiny repo | Almost none | Egress from R2 is free |

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>If GitHub Pages warns your site is huge and the culprit is <code>assets/audio/</code>, not your chat portraits, this is the exit ramp. Code in git. Songs in R2.</p>
</div>

## Architecture

```
┌──────────────────┐         HTTPS URL          ┌─────────────────────┐
│  Static site     │  ──── src="https://…" ──► │  Cloudflare R2      │
│  (GitHub Pages)  │       no MP3 in repo      │  bucket (my-music)  │
│  HTML / CSS / JS │                           │  + optional CDN     │
└──────────────────┘                           └─────────────────────┘
```

The site only stores **links**. The browser fetches audio directly from R2 (or your custom domain in front of it).

## Step 1: Create a bucket

A bucket is a container for your files.

1. In the [Cloudflare dashboard](https://dash.cloudflare.com/), go to **R2**.
2. Click **Create bucket**.
3. Name it something simple: `my-music`, `my-media`, etc.
4. Pick a location hint if asked (automatic is fine), then create.

The bucket exists but is **private by default**. Nothing is public until you enable access in Step 3.

## Step 2: Upload your files

**Few files:** drag and drop in the bucket view in the dashboard.

**Whole library:** use an S3-compatible tool. R2 speaks the S3 API. Common choices: [rclone](https://developers.cloudflare.com/r2/examples/rclone/) or the AWS CLI.

1. In R2, go to **Manage R2 API Tokens**. Create a token with read and write permissions.
2. Save the **Access Key ID** and **Secret Access Key** (never commit these).
3. Your S3 endpoint is `https://<your-account-id>.r2.cloudflarestorage.com`.
4. Configure the tool, then upload the folder in one command.

Example with rclone once configured:

```bash
rclone copy ./my-music-folder r2:my-music
```

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>API tokens belong in your rclone config or CI secrets, not in the website repo. Same rule as OpenRouter keys in a Worker.</p>
</div>

## Step 3: Make files reachable by URL

Buckets are private until you expose them. Pick one path:

### Option A: Public r2.dev URL (testing)

1. Open the bucket → **Settings**.
2. Under **Public access** (R2.dev subdomain), allow access.
3. You get a URL like `https://pub-xxxxxxxx.r2.dev/song.mp3`.

Good for testing. [Public bucket docs](https://developers.cloudflare.com/r2/buckets/public-buckets/) note that the `r2.dev` subdomain is rate-limited and not intended for heavy production traffic.

### Option B: Custom domain (recommended)

1. The domain must be on Cloudflare (added to your account).
2. In bucket **Settings** → **Custom Domains**, add a subdomain like `media.yourdomain.com`.
3. Cloudflare wires DNS and serves files through its CDN.
4. URLs become clean: `https://media.yourdomain.com/song.mp3`.

Use this for anything beyond a quick test.

### Option C: Worker (access control)

Bind the bucket to a [Cloudflare Worker](https://developers.cloudflare.com/workers/) and serve files through your own code. Use when you need auth, signed links, or logging. Overkill for simple public media.

## Step 4: Reference files on your site

Point your site at R2 URLs instead of local paths.

```html
<audio controls src="https://media.yourdomain.com/song.mp3"></audio>
```

Or set the source in JavaScript:

```javascript
const player = document.querySelector("#player");
player.src = "https://media.yourdomain.com/song.mp3";
```

Then **remove the media from your website repo**, redeploy, and confirm playback still works.

If audio fails to load from a different origin, check **CORS** on the bucket. [R2 CORS docs](https://developers.cloudflare.com/r2/buckets/cors/) explain how to allow your Pages origin to read objects when needed.

```preview Basic audio embed
<audio controls style="width:100%;max-width:360px;">
  <source src="https://media.yourdomain.com/song.mp3" type="audio/mpeg" />
  Your browser does not support audio.
</audio>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#888;margin-top:8px;">
  Replace the URL with your R2 or custom-domain path. No file ships with this preview.
</p>
```

## What it costs

For a personal music library, expect roughly **$0** on the free tier. Confirm current numbers on [R2 pricing](https://developers.cloudflare.com/r2/pricing/) before you scale.

| Item | Free tier (typical) | Beyond free |
|------|---------------------|-------------|
| Storage | 10 GB per month | $0.015 per GB-month |
| Reads (Class B, downloads/streams) | 10 million per month | $0.36 per million |
| Writes (Class A, uploads) | 1 million per month | $4.50 per million |
| Egress (bandwidth out) | Free | Free |

A few gigabytes of music fits inside free storage. A friend group is nowhere near millions of streams per month. The expensive part on other hosts (bandwidth) stays free on R2.

## Gotchas

- **Buckets are private by default.** Enable public access or attach a custom domain before files load on a site.
- **Use a custom domain for real traffic.** The `r2.dev` URL is for testing, not production load.
- **Keep media out of the repo.** That is the point. The repo holds code; R2 holds weight.
- **CORS** may matter if JavaScript on your Pages domain fetches or inspects R2 objects cross-origin.
- **Copyright.** Cheap hosting does not make unlicensed distribution legal. Host only what you have rights to serve.

## Quick checklist

1. R2 → Create bucket (`my-music`).
2. Upload files (dashboard drag-drop, or rclone/S3 for a big library).
3. Enable public access: custom domain for real use, `r2.dev` for testing.
4. Reference file URLs in `<audio>` tags or JS `player.src`.
5. Remove media from the website repo and redeploy.

<details class="entry-fold">
<summary>Prompt an AI (R2 media hosting)</summary>
<div class="fold-body">
<p>Give the model this context:</p>
<ul>
<li>Static host: GitHub Pages (or similar)</li>
<li>Media type: MP3 library, roughly how many GB</li>
<li>Whether you need a custom domain or testing-only <code>r2.dev</code></li>
<li>Upload tool preference: dashboard, rclone, or AWS CLI</li>
</ul>
<p>Sample prompt: <em>"I have a static site on GitHub Pages with a 1 GB audio folder. Walk me through Cloudflare R2: create bucket, upload with rclone, enable custom domain media.example.com, and update my mini music player JS to use HTTPS URLs instead of local paths. Include a checklist to remove audio from the repo."</em></p>
<p>Point it at <a href="https://developers.cloudflare.com/r2/buckets/public-buckets/">public buckets</a> and <a href="https://developers.cloudflare.com/r2/pricing/">pricing</a> for canon.</p>
</div>
</details>

<details class="entry-fold">
<summary>Build it yourself (mini player pattern)</summary>
<div class="fold-body">
<p>After R2 URLs exist, a minimal player is just an <code>&lt;audio&gt;</code> element and a track list:</p>
<pre><code>const TRACKS = [
  { title: "Track One", url: "https://media.yourdomain.com/01.mp3" },
  { title: "Track Two", url: "https://media.yourdomain.com/02.mp3" }
];

const audio = document.querySelector("#player");
function playTrack(index) {
  audio.src = TRACKS[index].url;
  audio.play();
}</code></pre>
<p>Store titles and URLs in JSON or markdown on the site. Store the MP3 bytes only in R2. See the live demo below for the swap-on-click pattern.</p>
</div>
</details>

## Live demo: playlist URL swap

Uses a public sample MP3 to show the pattern. In production, each URL would be your R2 custom domain.

```demo Playlist src swap (pattern)
<div id="r2-demo" style="font-family:system-ui,sans-serif;max-width:360px;">
  <audio id="r2-player" controls style="width:100%;margin-bottom:12px;"></audio>
  <div id="r2-tracks" style="display:flex;flex-direction:column;gap:6px;"></div>
</div>
<script>
var TRACKS = [
  { title: "Sample A", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Sample B", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
];
var audio = document.getElementById("r2-player");
var container = document.getElementById("r2-tracks");
TRACKS.forEach(function(t, i) {
  var btn = document.createElement("button");
  btn.textContent = t.title;
  btn.type = "button";
  btn.style.cssText = "padding:8px 12px;cursor:pointer;text-align:left;background:#141820;color:#45d2ff;border:1px solid #45d2ff;border-radius:6px;";
  btn.addEventListener("click", function() {
    audio.src = t.url;
    audio.play();
  });
  container.appendChild(btn);
});
audio.src = TRACKS[0].url;
</script>
```

*Preview block: static `<audio>` embed with a placeholder R2 URL. Demo block: JavaScript playlist that swaps `src` on click, the same pattern you use after files live on R2.*
