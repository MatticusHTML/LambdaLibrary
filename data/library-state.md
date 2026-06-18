# Lambda // Library State

This is Lambda's memory. It is the reason the menu gets smarter over time.

She reads this file at the start of every session so she already knows the
landscape before you ask: what categories exist, which tags are in play, how
many entries are filed, and what topics you have mentioned but not yet filed.
After she files or edits an entry, she updates this file. The menu learns
because its source of truth grows with the archive.

This file is for the agent and the operator. The website does not read it.

---

## Snapshot

- Entries on file: 9
- Music reports on file: 1
- Last filed: 2026-06-18 14:00 PT (how-to-implement-a-chatbot, Web Development)
- Last audit: not yet run

## Categories in use

| Category | Count |
|----------------|-------|
| Graphs | 2 |
| Structure | 1 |
| Web Development | 6 |

When a new entry's category is not on this list, Lambda flags it before filing
and asks whether to open a new category or fold it into an existing one. This
keeps the index from sprouting forty near-duplicate categories.

Likely future buckets the operator has named: **Photos**. Do not pre-create empty
categories. They appear when the first entry lands in one.

## Tag vocabulary

`html`, `css`, `javascript`, `fundamentals`, `first-entry`, `color`, `hex`, `palette`, `design`, `ui`, `tool`, `dlc`, `orchestral`, `trailer-music`, `soundtrack`, `dark-fantasy`, `composer`, `cinematic`, `psychart`, `pumpchart`, `psychrometric`, `graphs`, `npm`, `hvac`, `engineering`, `chartjs`, `charts`, `canvas`, `data-visualization`, `react`, `components`, `jsx`, `ui`, `frontend`, `python`, `backend`, `django`, `flask`, `programming`, `web-apps`, `obsidian`, `electron`, `markdown`, `plugins`, `typescript`, `cursor`, `knowledge-management`, `api`, `cloudflare`, `openrouter`, `chatbot`, `static-site`

Lambda prefers reusing an existing tag over coining a near-synonym. New tags are
fine when the concept is genuinely new. She does not coin a tag she will use once.

## Open threads (mentioned, not yet filed)

Topics that came up in conversation and are worth filing later. Lambda adds to
this list when something is named but not yet researched, and removes a line
once it becomes a real entry.

- Publish in GitHub Desktop; confirm GitHub Pages serves demo blocks, obsidian JSON Canvas demo, and Color Library tool with DLC packs and icons
- RPS pump TDH lookup tool with Chart.js (horizontal TDH line, multi-model curves; discussed with RPS_PUMP_DATA_FULL.md)
- Optional header images for chartjs and react entries
- Run first audit (mode 5)

## Conventions learned

Running log of decisions made while building the archive, so they are not
relitigated every session.

- 2026-06-15: Entry bodies teach in plain, clear prose. Lambda's voice lives in
  the one line verdict and the index chrome, not the body copy.
- 2026-06-15: Any entry that involves markup or code includes at least one live
  `preview` block so the lesson is visible, not just described.
- 2026-06-15: Categories stay broad. "Web Development" holds HTML, CSS, and JS
  rather than splitting into three thin categories this early.
- 2026-06-15: Session loop added. On goodnight, write a session to `data/log.md`
  and sync its next items into open threads above. On good morning, read the log
  first so the session resumes with context.
- 2026-06-15: Categories grow organically. Operator named Graphs, Structure,
  Photos as obvious future buckets. Flag new ones, never pre-create empty
  categories.
- 2026-06-15: Two live block types. `preview` for HTML/CSS (scripts sandboxed
  off). `demo` for JavaScript libraries and charts (scripts on, CDN imports ok).
  GitHub Pages hosts both the same; the block type is the difference.
- 2026-06-15: Library entries always carry a `library` URL in meta. Required.
  Engine shows it as a prominent reader link. Operator rule: never file a library
  entry without one.
- 2026-06-15: Library entries also carry an `intro` in meta: a plain-language
  opener for beginners, rendered under the library link before the body.
- 2026-06-15: Library and graph entries include Lambda tip callouts, collapsible
  folds for "Prompt an AI" vs "Build it yourself", and live `demo` blocks that
  use the library itself. Pin CDN versions for stability.
- 2026-06-15: **Structure** category opened with `obsidian` (knowledge layout,
  vaults, Canvas). Distinct from Graphs (Chart.js, psychart data viz) and Web
  Development (languages and UI code).
- 2026-06-16: Fundamentals entries (e.g. `css-colors`) use `preview` for static
  CSS swatches and `demo` when dropdowns or format conversion need JavaScript.
  No `library` or `intro` meta unless the entry is about a package.
- 2026-06-16: `color-library` is the visual companion to `css-colors`: large
  interactive roster (character-select UI), linked from css-colors for inspiration.
- 2026-06-16: **Tool entries** use `"tool": true` and `"toolSrc"` in meta. Engine
  opens a full-viewport iframe (`tools/*.html`), not a split preview/demo panel.
  Index cards show a Tool badge. Theory stays in reader entries; tools are for use.
- 2026-06-16: Color Library **DLC packs** live in `data/color-dlc.json`. Base pack
  is the built-in roster; each DLC is a named palette (game, film, brand). First
  DLC: The Finals (#D21F3C red, #E5E6E8 white, #1D1A20 black, #F7BB2B yellow).
  Second DLC: ARC Raiders (6-stripe palette from operator logo art, #110817 through #eae1cf).
  Operator feeds new DLCs over time with screenshots or official specs.
- 2026-06-16: DLC `typography` block is optional. Show the Typography dropdown in
  the tool only when the operator provides font specs with a pack. Colors-only DLCs
  skip it.
- 2026-06-16: Color pack icons: operator supplies a square image (~250×250 px,
  PNG usual). File at `assets/dlc/<pack-id>-icon.png`. DLC packs reference it in
  `data/color-dlc.json`; Base pack references it in `tools/color-library.html`
  (`BASE_PACK.icon`).
- 2026-06-18: **Implementation entries** (e.g. `how-to-implement-a-chatbot`) document
  a real project pattern without `library`/`intro` meta. Use `preview` for UI shell,
  `demo` for client-side behavior that does not need secrets. Redact API keys,
  Worker subdomains, and personal roster names in the filed copy; link the public
  demo site instead.
- 2026-06-16: **Music Library** is a second archive mode toggled from the header
  node button (`assets/lambda-music-node.png`). Manifest at `data/music-manifest.md`,
  reports at `data/music/<slug>.md`. Routes `#/music` and `#/music/e/<slug>`.
  Reports link out (Bandcamp, YouTube, SourceAudio); no audio uploads in archive.
