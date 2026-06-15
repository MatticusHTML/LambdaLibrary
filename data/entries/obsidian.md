# Obsidian and Canvas: local notes, infinite boards, and where JavaScript fits

```json
{
  "id": "obsidian",
  "title": "Obsidian and Canvas: local notes, infinite boards, and where JavaScript fits",
  "category": "Structure",
  "tags": ["obsidian", "electron", "canvas", "markdown", "plugins", "javascript", "typescript", "cursor", "knowledge-management"],
  "summary": "Deep guide to Obsidian as an Electron note app: vaults, Canvas, JSON Canvas files, community plugins, embedding Chart.js and React-style HTML, and pairing the vault with Cursor for AI search.",
  "library": "https://obsidian.md/",
  "intro": "Obsidian is a desktop and mobile app for personal notes. Your notes live as plain Markdown files in a folder on your computer, not in someone else's cloud. Canvas is its built-in whiteboard: drag notes, images, and links onto an infinite board, connect them with lines, and save the layout as an open JSON file you can read or edit anywhere.",
  "sources": [
    "https://obsidian.md/",
    "https://help.obsidian.md/Plugins/Canvas",
    "https://help.obsidian.md/Plugins/Community+plugins",
    "https://jsoncanvas.org/spec/1.0/",
    "https://github.com/obsidianmd/obsidian-api",
    "https://docs.obsidian.md/",
    "https://obsidian.md/blog/future-of-plugins/",
    "https://github.com/lengff123/cursor-bridge",
    "https://github.com/the-pieza/obsidian-html-embed",
    "https://github.com/tj19961229/obsidian-artifacts-plugin",
    "https://forum.obsidian.md/t/any-details-on-the-canvas-api/57120"
  ],
  "added": "2026-06-15 16:12 PT",
  "updated": "2026-06-15 16:12 PT",
  "verdict": "Markdown on disk, graphs on canvas, plugins when you outgrow defaults. Pair it with Cursor and your vault becomes searchable. The format is yours. The UI is negotiable."
}
```

[Obsidian](https://obsidian.md/) is a **local-first** knowledge app. Your **vault** is a normal folder of files. Notes are `.md` Markdown. Settings and plugins live in a hidden `.obsidian` folder inside that vault. Nothing requires the internet to open your notes.

The desktop app is built on **Electron**: Chromium plus Node.js, packaged for Windows, macOS, and Linux. Mobile uses **Capacitor**. Despite Electron's reputation for heaviness, Obsidian's core UI is custom-built (not a giant React app), and most users report it stays fast even with large vaults and many plugins.

This entry covers the app itself, **Canvas**, how **JavaScript** and **TypeScript** fit in, whether libraries from this archive (like [Chart.js](#/e/chartjs) and [React](#/e/react)) can run inside Obsidian, and how **Cursor** pairs with a vault for AI-assisted search and editing.

## What Obsidian gives you out of the box

### Vault and Markdown

- **Vault:** one folder = one knowledge base. You can have multiple vaults.
- **Notes:** standard Markdown files with Obsidian extensions: `[[wikilinks]]`, embeds (`![[note]]`), tags, and **Properties** (YAML front matter with typed fields).
- **Backlinks:** every note shows who links to it. That turns a folder of files into a graph of ideas.
- **Graph view:** visual map of note connections. **Local graph** (around one note) is usually more useful than the full-vault graph on huge archives.

### Core plugins (built in, toggle in Settings)

Obsidian ships many **core plugins** you enable per vault. Relevant ones for this archive:

| Core plugin | What it does |
|-------------|--------------|
| **Canvas** | Infinite 2D board for cards, lines, and groups |
| **Graph view** | Network diagram of wikilinks |
| **Backlinks** | Incoming links pane |
| **Outgoing links** | Links from the current note |
| **Templates** | Insert boilerplate into new notes |
| **Daily notes** | Dated journal entries |
| **Bases** | Database-style views over note properties (tables, filters) |

Canvas and Bases are the main "structure beyond linear notes" tools. Bases indexes Properties into filterable views; Canvas is spatial layout.

### Community plugins

Turn off **Restricted Mode** in Settings, then browse **Community plugins**. The [Obsidian Community](https://community.obsidian.md/) directory lists thousands of plugins and themes (the Obsidian team reported 4,000+ projects and 120M+ downloads in their 2025 community launch blog post; the directory continues to grow).

Categories on the community site include Integrations, Charts, Bases, Automation, and more. Plugins are third-party code: install only what you trust. Obsidian reviews plugins before listing them, but you remain responsible for what runs in your vault.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Before you write a custom plugin, search <a href="https://community.obsidian.md/plugins">community.obsidian.md/plugins</a>. If someone already solved "embed HTML with JavaScript" or "open this folder in Cursor," use that first. Your time is better spent on content than reinventing a ribbon icon.</p>
</div>

## Canvas: visual note-taking

Canvas is a **core plugin** for arranging knowledge in 2D space. [Official Canvas help](https://help.obsidian.md/Plugins/Canvas) describes it as infinite space to lay out notes, attachments, and web pages and draw relationships between them.

### Creating and opening canvases

- Command palette: **Canvas: Create new canvas**
- File explorer: right-click a folder → **New canvas**
- Ribbon: **Create new canvas** icon

Canvases save as **`.canvas` files** in your vault. They are plain JSON, not proprietary binary.

### Card types

| Card | Source | Notes |
|------|--------|-------|
| **Note card** | Existing `.md` file | Live preview; double-click to edit |
| **Text card** | Inline text only | Markdown supported; convert to file for backlinks |
| **Media card** | Image, audio, PDF, etc. | From vault or drag-in |
| **Web card** | URL | Embedded page; Ctrl/Cmd+click to open in browser |
| **Group** | Container | Visual frame around related cards |

You can drag files from the file explorer, embed whole folders, duplicate with Alt/Option+drag, snap with Space held while moving, and color cards or connection lines.

### Connections

- Hover a card edge, drag the handle to another card to create a **directed edge**
- Double-click a line to add a **label**
- Right-click a line: **Go to source** / **Go to target** when cards are far apart
- Drag midpoint handles to reroute or disconnect

### Embedding a canvas in a note

Use the normal embed syntax in Markdown:

```markdown
![[My Project Board.canvas]]
```

The canvas renders inside the note reading view.

### JSON Canvas: the open file format

Obsidian co-created **[JSON Canvas](https://jsoncanvas.org/)** (spec 1.0, March 2024). Any app can read or write `.canvas` files. The format has two top-level arrays: `nodes` and `edges`.

**Node types:** `text`, `file`, `link`, `group`

Shared node fields include `id`, `x`, `y`, `width`, `height`, and optional `color`.

**Edge fields** include `fromNode`, `toNode`, optional `fromSide` / `toSide` (`top`, `right`, `bottom`, `left`), arrow ends (`fromEnd`, `toEnd`), and optional `label`.

Example (minimal):

```json
{
  "nodes": [
    {
      "id": "a1",
      "type": "text",
      "x": 0,
      "y": 0,
      "width": 260,
      "height": 120,
      "text": "[[Chart.js]] entry ideas"
    },
    {
      "id": "b2",
      "type": "file",
      "x": 320,
      "y": 0,
      "width": 400,
      "height": 300,
      "file": "projects/pump-chart-notes.md"
    }
  ],
  "edges": [
    {
      "id": "e1",
      "fromNode": "a1",
      "toNode": "b2",
      "label": "implements"
    }
  ]
}
```

Because the format is JSON on disk, you can generate or edit canvases with a script outside Obsidian (Node, Python, Cursor agent, CI job) and open the result in the app.

### Canvas API: what plugins can (and cannot) do

**Stable:** read/write `.canvas` files as JSON. Type definitions live in [obsidian-api `canvas.d.ts`](https://github.com/obsidianmd/obsidian-api/blob/HEAD/canvas.d.ts) and match [jsoncanvas.org](https://jsoncanvas.org/spec/1.0/).

**Unstable:** manipulating the **live Canvas editor** at runtime. Obsidian does not yet expose a fully documented public Canvas API comparable to the Markdown editor API. Plugin authors often inspect internal objects in the dev console (for example `app.workspace.getLeavesOfType('canvas')[0].view.canvas`) or manipulate files on disk. Forum threads through 2025 still request a first-class Canvas API for selection, text editing inside cards, and programmatic layout.

Popular community extensions such as **Advanced Canvas** add features on top of those internals. Treat runtime canvas hooks as **best-effort**: they can break on app updates.

## JavaScript and TypeScript in Obsidian

Obsidian's UI is web technology, but **your notes are not a JavaScript runtime by default**.

### Three layers

| Layer | Language | Where it runs | Typical use |
|-------|----------|---------------|-------------|
| **Notes** | Markdown (+ HTML snippets) | Reading view | Writing, embeds, properties |
| **Community plugins** | TypeScript → bundled `main.js` | Electron app APIs | Commands, panes, file tools |
| **Embedded HTML** | HTML/CSS/JS in iframe | Sandboxed inside a note | Charts, demos, widgets |

### Plugin development (TypeScript API)

Official path: extend the `Plugin` class from the `obsidian` package. See [docs.obsidian.md](https://docs.obsidian.md/) and the [sample plugin template](https://github.com/obsidianmd/obsidian-sample-plugin).

Workflow:

1. Clone or copy the sample plugin into `.obsidian/plugins/your-plugin-id/`
2. `npm install` and `npm run dev` (compiles `main.ts` → `main.js`)
3. Reload Obsidian and enable the plugin

Each plugin folder needs `manifest.json` and `main.js`. Plugins access `this.app` (vault, workspace, metadata cache), register commands, views, settings tabs, and events. CodeMirror 6 extensions are supported for editor behavior.

**Node and Electron APIs** are available when `isDesktopOnly` is set appropriately in the manifest. Mobile plugins must avoid desktop-only APIs.

This is **TypeScript/JavaScript**, not Python. Your [Python](#/e/python) backend code does not run inside Obsidian unless you call it externally (CLI, server, or a plugin that shells out).

### Why `<script>` in a note usually fails

Reading view **sanitizes** raw HTML. Inline `<script>` blocks and arbitrary `<iframe>` tags are stripped or blocked for security. That is intentional: notes are documents, not arbitrary programs.

To run **Chart.js**, **D3**, **React**, or the same patterns as this archive's `demo` blocks, use one of these patterns:

#### Pattern A: HTML file + embed plugin (recommended for library charts)

1. Store a self-contained `.html` file in the vault (CDN imports like `esm.sh/chart.js@4` work inside that file).
2. Embed it with a community plugin:

| Plugin | Code block | Notes |
|--------|------------|-------|
| [HTML Embed](https://github.com/the-pieza/obsidian-html-embed) | `html-embed` | Vault-relative file via `app://` resource path; sandboxed iframe |
| [Local HTML Embed](https://github.com/Poesy-Lab/obsidian-local-html-embed) | `html-embed` | Explicitly lists Chart.js, D3, Plotly compatibility |
| [Obsidian Artifacts](https://github.com/tj19961229/obsidian-artifacts-plugin) | `html-render` | Inline HTML/CSS/JS block; sandboxed; CSP limits external loads in v1 |

Example with HTML Embed:

````markdown
```html-embed
file: demos/pump-tdh-chart.html
height: 480
```
````

Inside `pump-tdh-chart.html`, reuse the same Chart.js config style as the [chartjs](#/e/chartjs) entry. The chart runs in an iframe, not in Obsidian's core renderer.

#### Pattern B: Build a plugin with bundled React

For deep integration (custom sidebar, settings, vault events), write a plugin and bundle React or Preact with Rollup/esbuild. Mount with `createRoot` into a `ItemView` container. This is how professional plugins ship UI. Heavier than Pattern A, but you get full API access.

#### Pattern C: Dataview and Templater (no custom JS)

**Dataview** queries notes like a database (`TABLE`, `LIST`, `FROM #tag`). **Templater** runs templates with logic. Neither replaces Chart.js, but they cover many "show me structured notes" tasks without writing a plugin.

### Mapping this archive's libraries to Obsidian

| Archive entry | Inside Obsidian? | Practical path |
|---------------|------------------|----------------|
| [html-vs-css](#/e/html-vs-css) | Yes | Native Markdown and Canvas text cards |
| [chartjs](#/e/chartjs) | Yes, via iframe HTML | HTML Embed + `.html` file with canvas chart |
| [psychart](#/e/psychart) | Partial | If psychart ships browser JS, embed HTML; domain charts may need a dedicated plugin |
| [react](#/e/react) | Yes, with friction | Standalone HTML + esm.sh React, or bundled plugin; not in raw `.md` |
| [python](#/e/python) | No (in-app) | Run scripts outside Obsidian; store output as notes or generate `.canvas` JSON |

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Keep one <code>demos/</code> folder in the vault for Chart.js and React HTML files. Link to those files from Canvas cards and from Markdown embeds. When you update a chart in Cursor, Obsidian picks up the file change on disk. Same workflow as LambdaLibrary: files are the source of truth.</p>
</div>

<details class="entry-fold">
<summary>Prompt an AI (Obsidian + Canvas)</summary>
<div class="fold-body">
<p>Give the model this context:</p>
<ul>
<li>Vault layout (folders, naming convention)</li>
<li>Whether you want Markdown notes, a <code>.canvas</code> file, or both</li>
<li>Target: core plugin only vs community plugin (name it if known)</li>
<li>For charts: "HTML file + html-embed plugin" vs custom TypeScript plugin</li>
<li>For Cursor: vault path, whether @Codebase indexing is enabled</li>
</ul>
<p>Sample prompt: <em>"Create a JSON Canvas file with three nodes: a text card linking to [[Pump Notes]], a file card for pump-data.md, and a group labeled 'HVAC'. Connect text to file with label 'references'. Output valid JSON Canvas 1.0."</em></p>
<p>Sample prompt: <em>"Write a standalone HTML file for Obsidian HTML Embed that loads Chart.js 4 from esm.sh and plots TDH vs GPM from this CSV snippet."</em></p>
<p>Ask it to cite <a href="https://jsoncanvas.org/spec/1.0/">jsoncanvas.org</a> for canvas files and <a href="https://docs.obsidian.md/">docs.obsidian.md</a> for plugins. Warn it that live Canvas editor APIs are limited; prefer file-level JSON edits when automating.</p>
</div>
</details>

<details class="entry-fold">
<summary>Build it yourself (Obsidian + Cursor)</summary>
<div class="fold-body">
<p><strong>1. Vault as project in Cursor</strong></p>
<ol>
<li>Install Obsidian and create or open a vault (a folder on disk).</li>
<li>In Cursor: File → Open Folder → select that vault folder.</li>
<li>Wait for indexing (Cursor embeds files for @Codebase search).</li>
<li>In chat, use <code>@Codebase</code> and ask natural-language questions across your notes.</li>
</ol>
<p><strong>2. Optional: Cursor Bridge plugin</strong></p>
<ol>
<li>In Obsidian: Settings → Community plugins → Browse → install <strong>Cursor Bridge</strong>.</li>
<li>Command palette: "Open in Cursor" on the active note or a folder.</li>
<li>Configure the Cursor executable path on Windows if needed.</li>
</ol>
<p><strong>3. Canvas workflow</strong></p>
<ol>
<li>Enable the Canvas core plugin.</li>
<li>Create <code>boards/project.canvas</code>.</li>
<li>Drag in notes from this archive's topics (Chart.js, React, Python) as file cards.</li>
<li>Export or sync the vault through Git; edit <code>.canvas</code> JSON in Cursor when automating layout.</li>
</ol>
<p><strong>4. First plugin (TypeScript)</strong></p>
<pre><code>git clone https://github.com/obsidianmd/obsidian-sample-plugin.git my-plugin
cd my-plugin &amp;&amp; npm install &amp;&amp; npm run dev
# Copy output to Vault/.obsidian/plugins/my-plugin/</code></pre>
</div>
</details>

## Obsidian + Cursor: integration reality

There is **no official Obsidian ↔ Cursor plugin from either company**. Integration is workflow-based, and it works well because both tools respect plain files.

### Open the vault in Cursor

Your vault **is** a folder of Markdown (plus `.canvas`, attachments, `.obsidian` config). Open that folder as a Cursor project. Cursor indexes the text files and lets you:

- Ask questions across the whole vault with **@Codebase**
- Edit notes with AI assistance
- Run terminal commands, scripts, and git in the same tree Obsidian watches

Obsidian detects external file changes and reloads notes. Edit in Cursor, read in Obsidian. No sync service required.

### Cursor Bridge plugin

[Cursor Bridge](https://github.com/lengff123/cursor-bridge) (community plugin) adds one-click "Open in Cursor" from a note, folder, or context menu. Supports Windows and macOS. Useful when Obsidian is your daily driver and Cursor is your AI editor.

### What Cursor does not replace

- Canvas drag-and-drop layout (still Obsidian)
- Mobile Obsidian app
- Obsidian-specific plugin UI and command palette
- WYSIWYG wikilink autocomplete in the same form (Cursor is a code editor)

### LambdaLibrary angle

This archive itself is Markdown + JSON + static demos. You can clone or copy LambdaLibrary into a vault subfolder, open the repo root in Cursor, and file entries from chat while previewing on GitHub Pages. Obsidian becomes a **reader** for your filed notes; Cursor remains the **authoring** environment. Same pattern as any Markdown knowledge base.

## Electron under the hood (why this matters)

Electron means:

- **Chromium** renders the UI (HTML, CSS, JS).
- **Node.js** APIs are available to the main process and, selectively, plugins.
- **Offline-first** is natural: the vault is local files.

Obsidian deliberately avoids shipping your notes to their servers for core features. Sync and Publish are optional paid add-ons; the free app is fully usable without them.

Tradeoffs:

- **Pros:** extensible, cross-platform, web skills transfer to plugin dev.
- **Cons:** higher RAM/CPU than a native text editor; Electron apps can feel heavy on low-end hardware.

## Live preview: wikilinks and embeds

Obsidian-flavored Markdown in a note (preview block shows syntax only; Obsidian renders wikilinks in the app):

```preview Obsidian-style links
<div style="font-family: system-ui, sans-serif; padding: 16px; max-width: 520px;">
  <h3 style="margin-top:0;">In your .md file</h3>
  <pre style="background:#1a2332;color:#e6edf3;padding:12px;border-radius:8px;font-size:13px;"># Pump research

Links to another note: [[chartjs]]

Embeds a note: ![[psychart]]

Embeds a canvas board:
![[project-board.canvas]]

Tag: #graphs</pre>
  <p style="color:#666;font-size:13px;">In Obsidian, [[chartjs]] becomes a clickable link. ![[note]] inlines the note body.</p>
</div>
```

## Live demo: JSON Canvas rendered in the browser

Obsidian itself cannot run inside this archive's iframe. This demo **parses the same JSON Canvas node/edge shape** and draws a miniature board, so you can see how `.canvas` files relate to spatial layout. Pin-free vanilla JS; conceptually similar to what Obsidian displays.

```demo JSON Canvas mini-board
<div id="jc-root"></div>
<style>
  #jc-root { font-family: system-ui, sans-serif; padding: 12px; }
  #jc-root svg { background: #0f1419; border-radius: 10px; border: 1px solid #2a3544; }
  #jc-root .jc-label { fill: #8b9cb3; font-size: 11px; }
  #jc-root .jc-title { fill: #45d2ff; font-size: 12px; font-weight: 600; }
</style>
<script type="module">
const data = {
  nodes: [
    { id: "n1", type: "text", x: 20, y: 40, width: 180, height: 70,
      text: "[[Obsidian Canvas]]" },
    { id: "n2", type: "text", x: 280, y: 20, width: 200, height: 90,
      text: "Embed Chart.js\nvia HTML file" },
    { id: "n3", type: "text", x: 280, y: 140, width: 200, height: 70,
      text: "Edit vault in Cursor\n@Codebase search" },
    { id: "g1", type: "group", x: 10, y: 10, width: 520, height: 220, label: "Lambda archive workflow" }
  ],
  edges: [
    { id: "e1", fromNode: "n1", toNode: "n2", label: "demos" },
    { id: "e2", fromNode: "n1", toNode: "n3", label: "sync" }
  ]
};

const colors = { text: "#1e2a3a", group: "#151c28", stroke: "#45d2ff", edge: "#5a6a7a" };
const root = document.getElementById("jc-root");
const pad = 16;
const W = 560, H = 260;
const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("width", W);
svg.setAttribute("height", H);
svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

const nodeById = Object.fromEntries(data.nodes.map(n => [n.id, n]));

data.edges.forEach(e => {
  const a = nodeById[e.fromNode], b = nodeById[e.toNode];
  if (!a || !b) return;
  const x1 = a.x + a.width, y1 = a.y + a.height / 2;
  const x2 = b.x, y2 = b.y + b.height / 2;
  const line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", x1); line.setAttribute("y1", y1);
  line.setAttribute("x2", x2); line.setAttribute("y2", y2);
  line.setAttribute("stroke", colors.edge);
  line.setAttribute("stroke-width", "2");
  line.setAttribute("marker-end", "url(#arrow)");
  svg.appendChild(line);
  if (e.label) {
    const t = document.createElementNS(svgNS, "text");
    t.setAttribute("x", (x1 + x2) / 2);
    t.setAttribute("y", (y1 + y2) / 2 - 6);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("class", "jc-label");
    t.textContent = e.label;
    svg.appendChild(t);
  }
});

const defs = document.createElementNS(svgNS, "defs");
const marker = document.createElementNS(svgNS, "marker");
marker.setAttribute("id", "arrow");
marker.setAttribute("markerWidth", "8");
marker.setAttribute("markerHeight", "8");
marker.setAttribute("refX", "6");
marker.setAttribute("refY", "3");
marker.setAttribute("orient", "auto");
const path = document.createElementNS(svgNS, "path");
path.setAttribute("d", "M0,0 L0,6 L6,3 z");
path.setAttribute("fill", colors.edge);
marker.appendChild(path);
defs.appendChild(marker);
svg.appendChild(defs);

[...data.nodes].sort((a, b) => (a.type === "group" ? -1 : 1)).forEach(n => {
  const g = document.createElementNS(svgNS, "g");
  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("x", n.x); rect.setAttribute("y", n.y);
  rect.setAttribute("width", n.width); rect.setAttribute("height", n.height);
  rect.setAttribute("rx", n.type === "group" ? 12 : 8);
  rect.setAttribute("fill", n.type === "group" ? colors.group : colors.text);
  rect.setAttribute("stroke", colors.stroke);
  rect.setAttribute("stroke-width", n.type === "group" ? 1.5 : 2);
  g.appendChild(rect);
  if (n.type === "group" && n.label) {
    const t = document.createElementNS(svgNS, "text");
    t.setAttribute("x", n.x + 10); t.setAttribute("y", n.y + 18);
    t.setAttribute("class", "jc-title");
    t.textContent = n.label;
    g.appendChild(t);
  }
  if (n.text) {
    n.text.split("\n").forEach((line, i) => {
      const t = document.createElementNS(svgNS, "text");
      t.setAttribute("x", n.x + 10);
      t.setAttribute("y", n.y + 28 + i * 16);
      t.setAttribute("fill", "#c5d4e8");
      t.setAttribute("font-size", "12");
      t.textContent = line;
      g.appendChild(t);
    });
  }
  svg.appendChild(g);
});

root.appendChild(svg);
</script>
```

**Demo note:** Obsidian Canvas is an app feature, not a browser npm package. This demo teaches the **JSON Canvas file format** Obsidian saves. For real Chart.js or React behavior inside Obsidian, use an HTML embed plugin and a vault-local HTML file as described above.

## Security and maintenance

- **Community plugins** execute code with vault access. Prefer well-maintained plugins with clear repos.
- **Restricted Mode** blocks third-party plugins until you explicitly opt in.
- **HTML embeds** run JavaScript in a sandbox, but only embed HTML you wrote or trust.
- **Updates:** Obsidian and plugins do not all auto-update together. Check for plugin updates after an Obsidian major release.

## Quick reference

| Goal | Tool |
|------|------|
| Write linked notes | Markdown + wikilinks |
| See connections | Graph view, backlinks |
| Spatial layout | Canvas (`.canvas` JSON) |
| Query note metadata | Bases, Dataview plugin |
| Interactive charts | HTML file + HTML Embed / Artifacts |
| Custom app behavior | TypeScript plugin API |
| AI search across notes | Cursor on vault folder + @Codebase |
| Jump Obsidian → Cursor | Cursor Bridge plugin |

## Sources and further reading

- [Obsidian home](https://obsidian.md/)
- [Canvas help](https://help.obsidian.md/Plugins/Canvas)
- [Community plugins help](https://help.obsidian.md/Plugins/Community+plugins)
- [JSON Canvas spec 1.0](https://jsoncanvas.org/spec/1.0/)
- [Plugin API types](https://github.com/obsidianmd/obsidian-api)
- [Developer docs](https://docs.obsidian.md/)
- [Future of plugins (community directory)](https://obsidian.md/blog/future-of-plugins/)
- [Cursor Bridge](https://github.com/lengff123/cursor-bridge)
- [Canvas API forum discussion](https://forum.obsidian.md/t/any-details-on-the-canvas-api/57120)
