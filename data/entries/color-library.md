# Color Library: character-select palette roster

```json
{
  "id": "color-library",
  "title": "Color Library: character-select palette roster",
  "category": "Web Development",
  "tags": ["css", "color", "hex", "palette", "design", "ui", "frontend", "fundamentals"],
  "summary": "300+ clickable CSS colors in a fighting-game character select layout. Filter by family, preview hex rgb and hsl, copy with one click. Pair with css-colors for format theory.",
  "sources": [
    "MDN Web Docs, named colors",
    "MDN Web Docs, CSS color values",
    "https://www.w3.org/wiki/CSS/Properties/color/keywords"
  ],
  "added": "2026-06-16 10:28 PT",
  "updated": "2026-06-16 10:28 PT",
  "verdict": "Pick your fighter. Copy the hex. Close the roster. That is faster than scrolling a design tool when you only need a shade."
}
```

This is the **visual half** of [css-colors](#/e/css-colors). That entry teaches hex, RGB, HSL, and named keywords. This one is a **roster you click**: hundreds of real colors arranged like a character select screen so you can hunt for inspiration without leaving the archive.

## How to use it

1. Open the live demo below (scroll the roster grid if needed).
2. Click a **family tab** (Red, Blue, Neon, Archive, etc.) or stay on **All**.
3. Click a color portrait to select it. The large preview on the right updates.
4. Press **Copy hex** or click the selected swatch again to copy `#......` to the clipboard.
5. Paste into your CSS, Chart.js config, or theme file.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Start from <strong>Archive</strong> if you want colors that already match this site. Jump to <strong>Neon</strong> when you need something loud for a chart accent or button. Use <strong>Gray</strong> and <strong>White</strong> for surfaces before you pick a hero color.</p>
</div>

## What is in the roster

| Source | Count (approx.) | Notes |
|--------|-----------------|-------|
| CSS named colors | 148 | Official keywords from MDN |
| HSL generated grid | 150 | Hue steps every 12 degrees, five lightness levels |
| Archive theme | 8 | Colors pulled from this site's CSS variables |
| **Total** | **300+** | Deduped by hex value |

Each entry stores **name**, **hex**, and a **family** tag for filtering.

## Character-select layout

The demo mimics a fighting-game pick screen:

- **Left:** scrollable grid of color portraits with glow on hover
- **Right:** large showcase panel (name, swatch, hex, rgb, hsl)
- **Top:** family tabs like fighter categories
- **Footer:** selection count and copy action

```preview Select-screen chrome (static)
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
    background: radial-gradient(ellipse at 50% 0%, #1a2840 0%, #090b10 55%);
    color: #e9eef6;
    padding: 16px;
    min-height: 200px;
  }
  .title {
    text-align: center;
    font-size: 11px;
    letter-spacing: 0.35em;
    color: #45d2ff;
    text-shadow: 0 0 12px rgba(69,210,255,0.5);
    margin-bottom: 14px;
  }
  .row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .portrait {
    width: 52px; height: 64px;
    border: 2px solid #3a4a62;
    border-radius: 6px;
    background: linear-gradient(180deg, #ff6b6b 0%, #8b0000 100%);
    box-shadow: inset 0 -8px 16px rgba(0,0,0,0.35);
    transform: translateY(0);
  }
  .portrait.on {
    border-color: #ffd54a;
    box-shadow: 0 0 16px rgba(255,213,74,0.6), inset 0 -8px 16px rgba(0,0,0,0.35);
    transform: translateY(-4px);
  }
  .hint { text-align: center; font-size: 10px; color: #6b7686; margin-top: 12px; letter-spacing: 0.12em; }
</style>
<div class="title">COLOR SELECT</div>
<div class="row">
  <div class="portrait on"></div>
  <div class="portrait" style="background:linear-gradient(180deg,#45d2ff,#1f9ad6)"></div>
  <div class="portrait" style="background:linear-gradient(180deg,#90EE90,#228B22)"></div>
  <div class="portrait" style="background:linear-gradient(180deg,#FFD700,#CC5500)"></div>
  <div class="portrait" style="background:linear-gradient(180deg,#EE82EE,#4B0082)"></div>
</div>
<p class="hint">CLICK A PORTRAIT TO PREVIEW</p>
```

## Live roster: 300+ colors

Scripts on. Click portraits, filter tabs, copy hex. The roster is the lesson.

```demo Color Library character select
<div id="cl-app"></div>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; }
  #cl-app {
    font-family: "Segoe UI", system-ui, sans-serif;
    background: radial-gradient(ellipse 120% 80% at 50% -20%, #1e3a5f 0%, #090b10 45%, #050608 100%);
    color: #e9eef6;
    padding: 12px 14px 16px;
    min-height: 520px;
    user-select: none;
  }
  .cl-title {
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.42em;
    color: #45d2ff;
    text-shadow: 0 0 20px rgba(69,210,255,0.45);
    margin: 4px 0 10px;
  }
  .cl-sub {
    text-align: center;
    font-size: 10px;
    color: #6b7686;
    letter-spacing: 0.2em;
    margin-bottom: 12px;
  }
  .cl-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
    margin-bottom: 12px;
    max-height: 72px;
    overflow-y: auto;
  }
  .cl-tab {
    padding: 5px 10px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 1px solid #2a3d55;
    border-radius: 4px;
    background: rgba(20,26,38,0.85);
    color: #9aa6b8;
    cursor: pointer;
    transition: border-color 0.12s, color 0.12s, box-shadow 0.12s;
  }
  .cl-tab:hover { border-color: #45d2ff; color: #e9eef6; }
  .cl-tab.on {
    border-color: #ffd54a;
    color: #ffd54a;
    box-shadow: 0 0 10px rgba(255,213,74,0.25);
    background: rgba(40,32,12,0.5);
  }
  .cl-main {
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 12px;
    align-items: stretch;
  }
  @media (max-width: 520px) {
    .cl-main { grid-template-columns: 1fr; }
  }
  .cl-roster {
    background: rgba(8,10,14,0.6);
    border: 1px solid rgba(69,210,255,0.2);
    border-radius: 10px;
    padding: 10px;
    box-shadow: inset 0 0 40px rgba(0,0,0,0.4);
  }
  .cl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
    gap: 6px;
    max-height: 340px;
    overflow-y: auto;
    padding: 4px;
  }
  .cl-grid::-webkit-scrollbar { width: 6px; }
  .cl-grid::-webkit-scrollbar-thumb { background: #2a3d55; border-radius: 3px; }
  .cl-cell {
    aspect-ratio: 4/5;
    border: 2px solid #2a3548;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    transition: transform 0.1s, border-color 0.1s, box-shadow 0.1s;
    box-shadow: inset 0 -6px 12px rgba(0,0,0,0.25);
    min-height: 52px;
  }
  .cl-cell:hover {
    transform: translateY(-2px) scale(1.04);
    border-color: rgba(69,210,255,0.7);
    z-index: 2;
  }
  .cl-cell.on {
    border-color: #ffd54a;
    box-shadow: 0 0 14px rgba(255,213,74,0.55), inset 0 -6px 12px rgba(0,0,0,0.2);
    transform: translateY(-3px) scale(1.06);
    z-index: 3;
  }
  .cl-cell span {
    position: absolute;
    bottom: 2px;
    left: 0; right: 0;
    font-size: 7px;
    text-align: center;
    color: #fff;
    text-shadow: 0 1px 2px #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 2px;
    opacity: 0;
    transition: opacity 0.1s;
  }
  .cl-cell:hover span, .cl-cell.on span { opacity: 1; }
  .cl-showcase {
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, rgba(20,26,38,0.95) 0%, rgba(9,11,16,0.98) 100%);
    border: 2px solid #3a4a62;
    border-radius: 10px;
    padding: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }
  .cl-showcase-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    color: #ffd54a;
    text-align: center;
    margin-bottom: 8px;
  }
  .cl-hero {
    flex: 1;
    min-height: 120px;
    border-radius: 8px;
    border: 2px solid rgba(255,255,255,0.15);
    margin-bottom: 10px;
    box-shadow: inset 0 0 30px rgba(0,0,0,0.3);
    transition: background 0.15s;
  }
  .cl-name {
    font-size: 15px;
    font-weight: 700;
    text-align: center;
    margin: 0 0 8px;
    color: #fff;
    text-transform: capitalize;
  }
  .cl-codes {
    font-family: ui-monospace, monospace;
    font-size: 10px;
    line-height: 1.7;
    color: #9aa6b8;
    background: #0e1118;
    border-radius: 6px;
    padding: 8px;
    margin-bottom: 10px;
    word-break: break-all;
  }
  .cl-codes strong { color: #45d2ff; font-weight: 600; }
  .cl-copy {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    cursor: pointer;
    background: linear-gradient(180deg, #45d2ff, #1f9ad6);
    color: #04121b;
    transition: filter 0.12s, transform 0.08s;
  }
  .cl-copy:hover { filter: brightness(1.08); }
  .cl-copy:active { transform: scale(0.98); }
  .cl-copy.ok { background: linear-gradient(180deg, #7dffb3, #2eaa6a); }
  .cl-foot {
    text-align: center;
    font-size: 9px;
    color: #6b7686;
    margin-top: 10px;
    letter-spacing: 0.08em;
  }
  .cl-search {
    width: 100%;
    padding: 8px 10px;
    margin-bottom: 8px;
    border-radius: 6px;
    border: 1px solid #2a3d55;
    background: #0e1118;
    color: #e9eef6;
    font-size: 12px;
  }
  .cl-search::placeholder { color: #6b7686; }
</style>
<script>
(function () {
  const NAMED = [
    ["indianred","#cd5c5c"],["lightcoral","#f08080"],["salmon","#fa8072"],["darksalmon","#e9967a"],
    ["lightsalmon","#ffa07a"],["crimson","#dc143c"],["red","#ff0000"],["firebrick","#b22222"],
    ["darkred","#8b0000"],["pink","#ffc0cb"],["lightpink","#ffb6c1"],["hotpink","#ff69b4"],
    ["deeppink","#ff1493"],["mediumvioletred","#c71585"],["palevioletred","#db7093"],
    ["coral","#ff7f50"],["tomato","#ff6347"],["orangered","#ff4500"],["darkorange","#ff8c00"],
    ["orange","#ffa500"],["gold","#ffd700"],["yellow","#ffff00"],["lightyellow","#ffffe0"],
    ["lemonchiffon","#fffacd"],["lightgoldenrodyellow","#fafad2"],["papayawhip","#ffefd5"],
    ["moccasin","#ffe4b5"],["peachpuff","#ffdab9"],["palegoldenrod","#eee8aa"],["khaki","#f0e68c"],
    ["darkkhaki","#bdb76b"],["lavender","#e6e6fa"],["thistle","#d8bfd8"],["plum","#dda0dd"],
    ["violet","#ee82ee"],["orchid","#da70d6"],["fuchsia","#ff00ff"],["magenta","#ff00ff"],
    ["mediumorchid","#ba55d3"],["mediumpurple","#9370db"],["rebeccapurple","#663399"],
    ["blueviolet","#8a2be2"],["darkviolet","#9400d3"],["darkorchid","#9932cc"],["darkmagenta","#8b008b"],
    ["purple","#800080"],["indigo","#4b0082"],["mediumslateblue","#7b68ee"],["slateblue","#6a5acd"],
    ["darkslateblue","#483d8b"],["greenyellow","#adff2f"],["chartreuse","#7fff00"],["lawngreen","#7cfc00"],
    ["lime","#00ff00"],["limegreen","#32cd32"],["palegreen","#98fb98"],["lightgreen","#90ee90"],
    ["mediumspringgreen","#00fa9a"],["springgreen","#00ff7f"],["mediumseagreen","#3cb371"],
    ["seagreen","#2e8b57"],["forestgreen","#228b22"],["green","#008000"],["darkgreen","#006400"],
    ["yellowgreen","#9acd32"],["olivedrab","#6b8e23"],["olive","#808000"],["darkolivegreen","#556b2f"],
    ["mediumaquamarine","#66cdaa"],["darkseagreen","#8fbc8f"],["lightseagreen","#20b2aa"],
    ["darkcyan","#008b8b"],["teal","#008080"],["aqua","#00ffff"],["cyan","#00ffff"],
    ["lightcyan","#e0ffff"],["paleturquoise","#afeeee"],["aquamarine","#7fffd4"],["turquoise","#40e0d0"],
    ["mediumturquoise","#48d1cc"],["darkturquoise","#00ced1"],["cadetblue","#5f9ea0"],
    ["steelblue","#4682b4"],["lightsteelblue","#b0c4de"],["powderblue","#b0e0e6"],
    ["lightblue","#add8e6"],["skyblue","#87ceeb"],["lightskyblue","#87cefa"],["deepskyblue","#00bfff"],
    ["dodgerblue","#1e90ff"],["cornflowerblue","#6495ed"],["mediumslateblue","#7b68ee"],
    ["royalblue","#4169e1"],["blue","#0000ff"],["mediumblue","#0000cd"],["darkblue","#00008b"],
    ["navy","#000080"],["midnightblue","#191970"],["cornsilk","#fff8dc"],["blanchedalmond","#ffebcd"],
    ["bisque","#ffe4c4"],["navajowhite","#ffdead"],["wheat","#f5deb3"],["burlywood","#deb887"],
    ["tan","#d2b48c"],["rosybrown","#bc8f8f"],["sandybrown","#f4a460"],["goldenrod","#daa520"],
    ["peru","#cd853f"],["chocolate","#d2691e"],["saddlebrown","#8b4513"],["sienna","#a0522d"],
    ["brown","#a52a2a"],["maroon","#800000"],["white","#ffffff"],["snow","#fffafa"],
    ["honeydew","#f0fff0"],["mintcream","#f5fffa"],["azure","#f0ffff"],["aliceblue","#f0f8ff"],
    ["ghostwhite","#f8f8ff"],["whitesmoke","#f5f5f5"],["seashell","#fff5ee"],["beige","#f5f5dc"],
    ["oldlace","#fdf5e6"],["floralwhite","#fffaf0"],["ivory","#fffff0"],["antiquewhite","#faebd7"],
    ["linen","#faf0e6"],["lavenderblush","#fff0f5"],["mistyrose","#ffe4e1"],["gainsboro","#dcdcdc"],
    ["lightgray","#d3d3d3"],["silver","#c0c0c0"],["darkgray","#a9a9a9"],["gray","#808080"],
    ["dimgray","#696969"],["lightslategray","#778899"],["slategray","#708090"],["darkslategray","#2f4f4f"],
    ["black","#000000"]
  ];

  const ARCHIVE = [
    ["Archive bg","#090b10","Archive"],["Archive surface","#141a26","Archive"],
    ["Archive text","#e9eef6","Archive"],["Archive muted","#9aa6b8","Archive"],
    ["Archive accent","#45d2ff","Archive"],["Archive accent 2","#1f9ad6","Archive"],
    ["Archive danger","#ff6b6b","Archive"],["Archive gold pick","#ffd54a","Archive"]
  ];

  const NEON = [
    ["Neon pink","#ff10f0","Neon"],["Neon green","#39ff14","Neon"],["Neon cyan","#00fff7","Neon"],
    ["Neon orange","#ff5f1f","Neon"],["Neon yellow","#ffff33","Neon"],["Neon purple","#bc13fe","Neon"],
    ["Neon blue","#04d9ff","Neon"],["Neon red","#ff073a","Neon"],["Electric lime","#ccff00","Neon"],
    ["Hot magenta","#ff006e","Neon"]
  ];

  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    const toHex = (n) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
    return "#" + toHex(r) + toHex(g) + toHex(b);
  }

  function hueFamily(h) {
    if (h < 15 || h >= 345) return "Red";
    if (h < 45) return "Orange";
    if (h < 70) return "Yellow";
    if (h < 150) return "Green";
    if (h < 195) return "Cyan";
    if (h < 255) return "Blue";
    if (h < 290) return "Purple";
    if (h < 345) return "Pink";
    return "Red";
  }

  function hexToRgb(hex) {
    let h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
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

  function labelLight(hex) {
    const [r, g, b] = hexToRgb(hex).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45;
  }

  function buildPalette() {
    const seen = new Set();
    const out = [];
    function add(name, hex, family) {
      const key = hex.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ name, hex: key, family });
    }
    NAMED.forEach(([name, hex]) => {
      const [r, g, b] = hexToRgb(hex);
      const [h] = rgbToHsl(r, g, b);
      let fam = hueFamily(h);
      if (["white","snow","ivory","ghostwhite","whitesmoke","floralwhite","linen","seashell","mintcream","honeydew","azure","aliceblue","beige","antiquewhite","oldlace","cornsilk","blanchedalmond","lavenderblush","mistyrose","gainsboro","lightgray","silver","darkgray","gray","dimgray","lightslategray","slategray","darkslategray","black"].includes(name)) fam = name === "black" ? "Gray" : "White";
      if (["brown","chocolate","saddlebrown","sienna","maroon","peru","tan","sandybrown","rosybrown","burlywood","wheat","goldenrod","darkkhaki"].includes(name)) fam = "Brown";
      add(name, hex, fam);
    });
    for (let h = 0; h < 360; h += 12) {
      [28, 42, 55, 68, 82].forEach((l) => add("H" + h + " L" + l, hslToHex(h, 74, l), hueFamily(h)));
    }
    ARCHIVE.forEach(([n, h, f]) => add(n, h, f));
    NEON.forEach(([n, h, f]) => add(n, h, f));
    return out.sort((a, b) => a.family.localeCompare(b.family) || a.name.localeCompare(b.name));
  }

  const PALETTE = buildPalette();
  const FAMILIES = ["All", ...Array.from(new Set(PALETTE.map((c) => c.family))).sort()];

  let filter = "All";
  let query = "";
  let selected = PALETTE.find((c) => c.hex === "#45d2ff") || PALETTE[0];

  const root = document.getElementById("cl-app");
  root.innerHTML =
    '<div class="cl-title">COLOR LIBRARY</div>' +
    '<div class="cl-sub">SELECT YOUR SHADE</div>' +
    '<div class="cl-tabs" id="cl-tabs"></div>' +
    '<div class="cl-main">' +
      '<div class="cl-roster">' +
        '<input class="cl-search" id="cl-search" type="search" placeholder="Search name or hex..." />' +
        '<div class="cl-grid" id="cl-grid"></div>' +
      '</div>' +
      '<div class="cl-showcase">' +
        '<div class="cl-showcase-label">PREVIEW</div>' +
        '<div class="cl-hero" id="cl-hero"></div>' +
        '<p class="cl-name" id="cl-name"></p>' +
        '<div class="cl-codes" id="cl-codes"></div>' +
        '<button type="button" class="cl-copy" id="cl-copy">COPY HEX</button>' +
      '</div>' +
    '</div>' +
    '<p class="cl-foot" id="cl-foot"></p>';

  const tabsEl = document.getElementById("cl-tabs");
  const gridEl = document.getElementById("cl-grid");
  const searchEl = document.getElementById("cl-search");

  function filtered() {
    return PALETTE.filter((c) => {
      if (filter !== "All" && c.family !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.hex.includes(q);
    });
  }

  function renderShowcase() {
    const [r, g, b] = hexToRgb(selected.hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    document.getElementById("cl-hero").style.background = selected.hex;
    document.getElementById("cl-name").textContent = selected.name;
    document.getElementById("cl-codes").innerHTML =
      "<strong>hex</strong> " + selected.hex + "<br>" +
      "<strong>rgb</strong> rgb(" + r + ", " + g + ", " + b + ")<br>" +
      "<strong>hsl</strong> hsl(" + h + ", " + s + "%, " + l + "%)<br>" +
      "<strong>family</strong> " + selected.family;
    document.getElementById("cl-foot").textContent =
      filtered().length + " visible / " + PALETTE.length + " total colors";
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    FAMILIES.forEach((f) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cl-tab" + (filter === f ? " on" : "");
      b.textContent = f;
      b.onclick = () => { filter = f; renderGrid(); renderTabs(); };
      tabsEl.appendChild(b);
    });
  }

  function renderGrid() {
    gridEl.innerHTML = "";
    const list = filtered();
    list.forEach((c) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cl-cell" + (selected.hex === c.hex ? " on" : "");
      cell.style.background = "linear-gradient(180deg, " + c.hex + " 0%, " + c.hex + "cc 100%)";
      cell.title = c.name + " " + c.hex;
      const span = document.createElement("span");
      span.textContent = c.name;
      span.style.color = labelLight(c.hex) ? "#04121b" : "#fff";
      span.style.textShadow = labelLight(c.hex) ? "none" : "0 1px 2px #000";
      cell.appendChild(span);
      cell.onclick = () => {
        selected = c;
        renderGrid();
        renderShowcase();
      };
      gridEl.appendChild(cell);
    });
    renderShowcase();
  }

  document.getElementById("cl-copy").onclick = async () => {
    const btn = document.getElementById("cl-copy");
    try {
      await navigator.clipboard.writeText(selected.hex);
      btn.textContent = "COPIED!";
      btn.classList.add("ok");
      setTimeout(() => { btn.textContent = "COPY HEX"; btn.classList.remove("ok"); }, 1200);
    } catch (e) {
      btn.textContent = selected.hex;
    }
  };

  searchEl.addEventListener("input", () => { query = searchEl.value.trim(); renderGrid(); });
  renderTabs();
  renderGrid();
})();
</script>
```

<details class="entry-fold">
<summary>Prompt an AI (color palette)</summary>
<div class="fold-body">
<p>Give the model this context:</p>
<ul>
<li>Target format: hex, rgb, or hsl</li>
<li>Role: background, text, accent, chart series, border</li>
<li>Constraints: must meet contrast on <code>#0e1118</code> or white</li>
<li>Mood: neon, muted, archive-dark, pastel</li>
</ul>
<p>Sample prompt: <em>"Suggest 5 hex accent colors for a dark HVAC dashboard. Background is #0e1118. Need one warning color and one success color. Output hex only with a one-line use case each."</em></p>
<p>Point it at this roster for inspiration, or at the family dropdowns in <a href="#/e/css-colors">css-colors</a> for smaller curated sets.</p>
</div>
</details>

<details class="entry-fold">
<summary>Build it yourself (CSS variables from picks)</summary>
<div class="fold-body">
<p>After you copy a hex from the roster, drop it into <code>:root</code>:</p>
<pre><code>:root {
  --hero: #45d2ff;      /* from Color Library */
  --hero-dim: #1f9ad6;
  --surface: #141a26;
  --ink: #e9eef6;
}
.card {
  background: var(--surface);
  border: 1px solid var(--hero);
  color: var(--ink);
}</code></pre>
<p>Generate tints in HSL without guessing: keep hue fixed, lower lightness for dark mode surfaces, raise it for hover states. See <a href="#/e/css-colors">css-colors</a> for the HSL shade row example.</p>
</div>
</details>

## Pair with css-colors

| Need | Go to |
|------|-------|
| Understand hex, rgb, hsl | [css-colors](#/e/css-colors) |
| Browse 300+ shades visually | **This entry** |
| Theme this archive | **Archive** tab in the demo |
| Loud chart accents | **Neon** tab or [chartjs](#/e/chartjs) demos |

## Quick reference

- Click a portrait to preview. Double-purpose: click **COPY HEX** for clipboard.
- Search box filters by color name or hex fragment (`ff6`, `coral`, `archive`).
- Named CSS colors use official keywords. Generated `H### L##` entries are HSL-derived helpers, not browser keywords.
- For production, prefer CSS variables over scattering raw hex across dozens of rules.
