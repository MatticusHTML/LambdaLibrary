# Color Library

```json
{
  "id": "color-library",
  "title": "Color Library",
  "category": "Web Development",
  "tags": ["css", "color", "hex", "palette", "design", "ui", "tool", "frontend", "dlc"],
  "summary": "Full-page color tool. Base pack: 300+ CSS shades. DLC packs: curated palettes from games and media. Copy hex, rgb, hsl. Theory in css-colors.",
  "tool": true,
  "toolSrc": "tools/color-library.html",
  "sources": [
    "MDN Web Docs, named colors",
    "MDN Web Docs, CSS color values",
    "THE FINALS Brand Guide, Colors page (operator screenshot, 2026-06-16)",
    "THE FINALS Brand Guide, Typography page (operator screenshot, 2026-06-16)"
  ],
  "added": "2026-06-16 10:28 PT",
  "updated": "2026-06-16 15:20 PT",
  "verdict": "Base game included. DLC drops when you find a palette worth remembering. The Finals went first."
}
```

Tool entry. Opens full page from the index.

**Base** is the general CSS roster (300+ colors). **DLC packs** are curated palettes filed in `data/color-dlc.json`. Each pack uses the same grid UI with its own theme. First DLC: **The Finals** (Embark Studios brand colors from the official brand guide).

For hex, RGB, and HSL theory, see [css-colors](#/e/css-colors).

## DLC packs on file

| Pack | Colors | Source |
|------|--------|--------|
| Base | 300+ | CSS named, HSL grid, Lambda theme, Neon |
| The Finals | 4 colors + Saira typography | Brand guide colors and typography pages |
| ARC Raiders | 6 colors | Logo palette strip (operator screenshot) |

To add a DLC later: extend `data/color-dlc.json` with colors (hex required). Add a `typography` block only when you provide font specs from the same media. Publish when ready.
