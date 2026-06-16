# CSS Colors: Hex, RGB, HSL, and Named Colors

```json
{
  "id": "css-colors",
  "title": "CSS Colors: Hex, RGB, HSL, and Named Colors",
  "category": "Web Development",
  "tags": ["css", "html", "fundamentals", "color", "hex", "design"],
  "summary": "How to name colors in CSS, with hex as the default mental model, family dropdowns of real swatches, and the other formats you will see in the wild.",
  "sources": ["MDN Web Docs, CSS color values", "MDN Web Docs, named colors"],
  "added": "2026-06-16 09:45 PT",
  "updated": "2026-06-16 10:28 PT",
  "verdict": "Hex is the address book. RGB is the recipe. HSL is the dial. Pick one format and stay consistent until you have a reason to switch."
}
```

Color in CSS is almost always a **value on a property**: `color`, `background`, `border-color`, `fill`, `box-shadow`, and dozens more. You are not painting by hand. You are handing the browser a precise instruction: "this text is this shade," "this button border is that shade."

The format you choose is mostly about how **you** like to think. The browser accepts several. Hex is the one you will see most often in design handoffs, themes, and component libraries.

**Need inspiration, not theory?** Open the [Color Library](#/e/color-library): 300+ clickable colors in a character-select layout. Pick a shade, copy the hex, come back here when you need to understand the format.

## Hex colors (the main format)

A **hex color** starts with `#` followed by digits `0-9` and letters `A-F` (case does not matter to the browser).

| Form | Digits | Example | What it means |
|------|--------|---------|---------------|
| 3-digit shorthand | 3 | `#F00` | Same as `#FF0000`. Each digit is doubled: `F` becomes `FF`. |
| 6-digit | 6 | `#FF0000` | Two digits red, two green, two blue. `FF` red, `00` green, `00` blue. |
| 8-digit with alpha | 8 | `#FF000080` | Same RGB plus opacity. Last two digits are alpha (`00` invisible, `FF` solid). |

Each pair is **hexadecimal** (base 16). `00` is none of that channel. `FF` is full strength. Mix the three channels and you get the rainbow and everything between.

```preview Hex in CSS
<style>
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
    background: #0e1118;
    color: #e9eef6;
    padding: 24px;
  }
  .swatch-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
  .swatch {
    width: 72px; height: 72px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: flex-end; justify-content: center;
    padding-bottom: 6px; font-size: 10px; font-weight: 600;
    color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.6);
  }
  .swatch.light { color: #04121b; text-shadow: none; }
  code { background: #141a26; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
</style>
<p>Same hue, three ways to write it in CSS:</p>
<p><code>color: #45d2ff;</code></p>
<p><code>background: #0e1118;</code></p>
<p><code>border: 2px solid #e0a800;</code></p>
<div class="swatch-row">
  <div class="swatch" style="background:#45d2ff">#45d2ff</div>
  <div class="swatch" style="background:#0e1118">#0e1118</div>
  <div class="swatch light" style="background:#e0a800">#e0a800</div>
</div>
```

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>When a designer sends <code>#45d2ff</code>, paste it exactly. Do not "clean it up" to 3-digit form unless you are sure the shorthand is equivalent. <code>#45d2ff</code> has no valid 3-digit shortcut.</p>
</div>

## Color families and hex dropdowns

Web palettes are easier to browse **by family**: reds together, blues together, greens together. The demo below has one dropdown per family. Pick a name, and the swatch updates with its hex and the equivalent `rgb()` and `hsl()` strings.

This is the practical reference layer: not every color on earth, but the shades you will actually reach for when theming a page, a chart, or a button set.

```demo Color family hex picker
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
    background: #0e1118;
    color: #e9eef6;
    padding: 20px;
    font-size: 14px;
  }
  h2 { margin: 0 0 4px; font-size: 15px; color: #45d2ff; }
  .intro { color: #9aa6b8; margin: 0 0 18px; font-size: 13px; }
  .families {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 14px;
  }
  .family {
    background: #141a26;
    border: 1px solid rgba(96,170,224,0.25);
    border-radius: 10px;
    padding: 12px;
  }
  .family label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7686;
    margin-bottom: 6px;
  }
  .family select {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #2a3548;
    background: #0e1118;
    color: #e9eef6;
    font-size: 13px;
    cursor: pointer;
  }
  .swatch {
    margin-top: 10px;
    height: 56px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 13px;
    transition: background 0.15s ease;
  }
  .readout {
    margin-top: 20px;
    padding: 14px;
    background: #141a26;
    border-radius: 10px;
    border: 1px solid rgba(96,170,224,0.25);
  }
  .readout h3 { margin: 0 0 10px; font-size: 13px; color: #45d2ff; }
  .readout p { margin: 4px 0; font-family: ui-monospace, monospace; font-size: 12px; color: #c5d0de; }
</style>
<h2>Pick by family</h2>
<p class="intro">Each dropdown lists hex options in that family. Last selection drives the readout below.</p>
<div class="families" id="families"></div>
<div class="readout" id="readout">
  <h3>Selected color</h3>
  <p id="out-hex">hex: ...</p>
  <p id="out-rgb">rgb: ...</p>
  <p id="out-hsl">hsl: ...</p>
</div>
<script>
const FAMILIES = {
  "Red": [
    ["Pure red", "#FF0000"], ["Crimson", "#DC143C"], ["Firebrick", "#B22222"],
    ["Dark red", "#8B0000"], ["Indian red", "#CD5C5C"], ["Light coral", "#F08080"],
    ["Salmon", "#FA8072"], ["Tomato", "#FF6347"], ["Orange red", "#FF4500"],
    ["Maroon", "#800000"]
  ],
  "Orange": [
    ["Orange", "#FFA500"], ["Dark orange", "#FF8C00"], ["Coral", "#FF7F50"],
    ["Sandy brown", "#F4A460"], ["Chocolate", "#D2691E"], ["Peru", "#CD853F"],
    ["Burnt orange", "#CC5500"], ["Peach", "#FFCBA4"], ["Tangerine", "#F28500"],
    ["Pumpkin", "#FF7518"]
  ],
  "Yellow": [
    ["Yellow", "#FFFF00"], ["Gold", "#FFD700"], ["Khaki", "#F0E68C"],
    ["Pale goldenrod", "#EEE8AA"], ["Light yellow", "#FFFFE0"], ["Lemon", "#FFF44F"],
    ["Amber", "#FFBF00"], ["Mustard", "#FFDB58"], ["Canary", "#FFEF00"],
    ["Cream", "#FFFDD0"]
  ],
  "Green": [
    ["Green", "#008000"], ["Lime", "#00FF00"], ["Forest green", "#228B22"],
    ["Sea green", "#2E8B57"], ["Medium sea green", "#3CB371"], ["Light green", "#90EE90"],
    ["Pale green", "#98FB98"], ["Dark green", "#006400"], ["Spring green", "#00FA9A"],
    ["Olive", "#808000"], ["Teal", "#008080"]
  ],
  "Blue": [
    ["Blue", "#0000FF"], ["Navy", "#000080"], ["Royal blue", "#4169E1"],
    ["Dodger blue", "#1E90FF"], ["Sky blue", "#87CEEB"], ["Steel blue", "#4682B4"],
    ["Cornflower", "#6495ED"], ["Light blue", "#ADD8E6"], ["Midnight blue", "#191970"],
    ["Cadet blue", "#5F9EA0"], ["Azure", "#007FFF"]
  ],
  "Purple": [
    ["Purple", "#800080"], ["Indigo", "#4B0082"], ["Blue violet", "#8A2BE2"],
    ["Dark orchid", "#9932CC"], ["Medium orchid", "#BA55D3"], ["Plum", "#DDA0DD"],
    ["Violet", "#EE82EE"], ["Medium purple", "#9370DB"], ["Rebecca purple", "#663399"],
    ["Lavender", "#E6E6FA"]
  ],
  "Pink": [
    ["Magenta", "#FF00FF"], ["Deep pink", "#FF1493"], ["Hot pink", "#FF69B4"],
    ["Pink", "#FFC0CB"], ["Light pink", "#FFB6C1"], ["Pale violet red", "#DB7093"],
    ["Rose", "#FF007F"], ["Blush", "#DE5D83"], ["Fuchsia", "#FF00FF"],
    ["Watermelon", "#FD4659"]
  ],
  "Brown": [
    ["Brown", "#A52A2A"], ["Saddle brown", "#8B4513"], ["Sienna", "#A0522D"],
    ["Tan", "#D2B48C"], ["Rosy brown", "#BC8F8F"], ["Burlywood", "#DEB887"],
    ["Wheat", "#F5DEB3"], ["Coffee", "#6F4E37"], ["Caramel", "#FFD59A"],
    ["Mocha", "#967969"]
  ],
  "Gray": [
    ["Gray", "#808080"], ["Dim gray", "#696969"], ["Dark gray", "#A9A9A9"],
    ["Light gray", "#D3D3D3"], ["Silver", "#C0C0C0"], ["Gainsboro", "#DCDCDC"],
    ["Slate gray", "#708090"], ["Charcoal", "#36454F"], ["Ash", "#B2BEB5"],
    ["Cool gray", "#8C92AC"]
  ],
  "Neutrals": [
    ["Black", "#000000"], ["Near black", "#1A1A1A"], ["Dark slate", "#2F4F4F"],
    ["White", "#FFFFFF"], ["Snow", "#FFFAFA"], ["White smoke", "#F5F5F5"],
    ["Ivory", "#FFFFF0"], ["Off white", "#FAF9F6"], ["Ghost white", "#F8F8FF"],
    ["Transparent black", "#00000080"]
  ]
};

function hexToRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  if (h.length === 8) h = h.slice(0, 6);
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function updateReadout(name, hex) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const alpha = hex.length === 9 ? " (alpha in 8-digit hex)" : "";
  document.getElementById("out-hex").textContent = "hex: " + hex + alpha;
  document.getElementById("out-rgb").textContent = "rgb: rgb(" + r + ", " + g + ", " + b + ")";
  document.getElementById("out-hsl").textContent = "hsl: hsl(" + h + ", " + s + "%, " + l + "%)";
}

let lastHex = "#45d2ff";
const root = document.getElementById("families");

Object.entries(FAMILIES).forEach(([family, colors]) => {
  const wrap = document.createElement("div");
  wrap.className = "family";
  const label = document.createElement("label");
  label.textContent = family;
  const sel = document.createElement("select");
  colors.forEach(([n, hex]) => {
    const opt = document.createElement("option");
    opt.value = hex;
    opt.textContent = n + "  " + hex;
    sel.appendChild(opt);
  });
  const sw = document.createElement("div");
  sw.className = "swatch";
  function paint() {
    const hex = sel.value;
    sw.style.background = hex;
    sw.textContent = hex;
    sw.style.color = luminance(hex) > 0.4 ? "#04121b" : "#fff";
    lastHex = hex;
    updateReadout(sel.options[sel.selectedIndex].text, hex);
  }
  sel.addEventListener("change", paint);
  paint();
  wrap.append(label, sel, sw);
  root.appendChild(wrap);
});
updateReadout("Lambda accent", lastHex);
</script>
```

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Ten families cover most UI work. When you are building a theme, pick one neutral, one accent (often blue or teal in this archive), and one warning color (amber or orange). Everything else is variation.</p>
</div>

## RGB and RGBA

**`rgb(red, green, blue)`** lists the three channels as numbers from `0` to `255`. Same idea as hex, different notation.

- `rgb(255, 0, 0)` is pure red, same as `#FF0000`.
- **`rgba(...)`** adds a fourth number for **alpha** (opacity): `0` is fully transparent, `1` is solid. Example: `rgba(69, 210, 255, 0.5)` is half-transparent archive blue.

RGBA is common for overlays, glass panels, and soft shadows where you need transparency without an 8-digit hex.

```preview RGB and RGBA
<style>
  body { margin: 0; font-family: system-ui, sans-serif; background: #0e1118; color: #e9eef6; padding: 24px; }
  .panel {
    padding: 20px; border-radius: 12px; margin-top: 12px;
    background: rgb(20, 26, 38);
    border: 2px solid rgb(69, 210, 255);
  }
  .glass {
    margin-top: 12px; padding: 16px; border-radius: 10px;
    background: rgba(69, 210, 255, 0.15);
    border: 1px solid rgba(69, 210, 255, 0.45);
  }
  code { font-size: 13px; color: #45d2ff; }
</style>
<p><code>border: 2px solid rgb(69, 210, 255);</code></p>
<div class="panel">Solid border from <code>rgb()</code>.</div>
<p style="margin-top:16px"><code>background: rgba(69, 210, 255, 0.15);</code></p>
<div class="glass">Semi-transparent fill from <code>rgba()</code>.</div>
```

## HSL and HSLA

**`hsl(hue, saturation%, lightness%)`** describes color the way humans often adjust it in a design tool: spin the hue wheel, pump saturation, slide lightness.

- **Hue** `0-360`: degrees on the color wheel (`0` red, `120` green, `240` blue).
- **Saturation** `0-100%`: gray at `0%`, vivid at `100%`.
- **Lightness** `0-100%`: black at `0%`, white at `100%`, pure color around `50%`.

**`hsla(...)`** adds alpha like RGBA. HSL is handy when you want five shades of the same brand hue: keep hue fixed, nudge lightness.

```preview HSL shades from one hue
<style>
  body { margin: 0; font-family: system-ui, sans-serif; background: #0e1118; color: #e9eef6; padding: 24px; }
  .row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .chip {
    padding: 14px 18px; border-radius: 8px; font-size: 12px; font-weight: 600;
    min-width: 100px; text-align: center;
  }
</style>
<p>Same hue <code>199</code>, different lightness:</p>
<div class="row">
  <div class="chip" style="background:hsl(199,100%,20%);color:#fff">20%</div>
  <div class="chip" style="background:hsl(199,100%,35%);color:#fff">35%</div>
  <div class="chip" style="background:hsl(199,100%,50%);color:#04121b">50%</div>
  <div class="chip" style="background:hsl(199,100%,65%);color:#04121b">65%</div>
  <div class="chip" style="background:hsl(199,100%,80%);color:#04121b">80%</div>
</div>
```

## Named colors (CSS keywords)

CSS ships with **named colors**: `red`, `navy`, `cornflowerblue`, `rebeccapurple`, and well over a hundred more. They are valid anywhere a color is expected.

```css
color: crimson;
background: aliceblue;
border-color: rebeccapurple;
```

Named colors are fine for learning and quick sketches. In production themes, teams usually standardize on hex or HSL variables so every shade is documented in one place. MDN maintains the full keyword list.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p><code>currentColor</code> is a special keyword: it means "use whatever <code>color</code> is already set on this element." Icons and borders often use it so one text color drives the whole component.</p>
</div>

## Other ways you will see colors called out

| Format | Example | When it shows up |
|--------|---------|------------------|
| Hex | `#45d2ff` | Design specs, Tailwind-style tokens, chart configs |
| RGB / RGBA | `rgb(69, 210, 255)` | Overlays, shadows, alpha without 8-digit hex |
| HSL / HSLA | `hsl(199, 100%, 64%)` | Generating palettes, tweaking lightness |
| Named keyword | `steelblue` | Quick prototypes, legacy CSS |
| `transparent` | `transparent` | Invisible borders and backgrounds |
| `currentColor` | `currentColor` | Inherit the element's text color |
| Modern functions | `oklch()`, `color()`, `lab()` | Newer CSS color spaces, wide-gamut displays |

The **modern functions** (`oklch`, `lab`, and friends) solve a problem hex does not: perceptually even steps when you build scales. Browser support is good in current evergreen browsers; MDN documents which are safe for your target audience.

## CSS variables: one hex, many uses

Teams store hex once and reuse it:

```css
:root {
  --accent: #45d2ff;
  --surface: #141a26;
}
button {
  background: var(--accent);
  color: #04121b;
}
.card {
  background: var(--surface);
  border: 1px solid var(--accent);
}
```

Change `--accent` in one place and every button, link, and border that references it updates. That is how design systems stay sane.

## Quick reference: which format when

- **You got a hex from Figma or a brand guide.** Use hex. Done.
- **You need transparency on a overlay.** `rgba()` or 8-digit hex.
- **You are generating five tints of one brand color.** `hsl()` with fixed hue.
- **You are matching MDN examples or old tutorials.** Named keywords are valid.
- **You care about perceptual uniformity across a scale.** Look at `oklch()` on MDN.

## The one thing to remember

Every format is the same instruction to the browser: how much red, green, and blue (and optionally how opaque). Hex is compact and universal. RGB is explicit. HSL matches how you tweak. Named colors are memorization optional. Pick the format that matches your source material, then convert when you need to compare or document.
