# SCHEMA — Lambda // Index

The data contract. The engine and Lambda both rely on this. Do not drift from it
without updating the engine to match.

---

## Entry file: `data/entries/<slug>.md`

Each entry is one markdown file. It contains a human header (optional), then
exactly one fenced `json` block, then the body. The engine reads the json block
for the index card, and renders everything after the json block as the doc.

### Meta json block

```json
{
  "id": "kebab-case-slug",
  "title": "Human readable title",
  "category": "Broad bucket, e.g. Web Development",
  "tags": ["lowercase", "kebab-tags"],
  "summary": "One or two sentences for the index card.",
  "library": "Required when the entry covers a library or package. Primary URL: npm page, docs site, or repo homepage.",
  "intro": "Required on library entries. Plain-language opener for a non-expert. What the tool is for, in human terms, before the technical sections.",
  "header": "Optional. Path to a hero image, e.g. assets/entries/slug-header.png",
  "sources": ["MDN Web Docs", "https://example.com/page", "Cameron, in person"],
  "added": "2026-06-15 09:12 PT",
  "updated": "2026-06-15 09:12 PT",
  "verdict": "One dry Lambda line. Her signature sign-off."
}
```

Rules:
- `id` equals the filename slug and never changes once set.
- `tags` and `sources` are arrays. Empty array is allowed. Unknown source becomes `Not provided`.
- `added` is set once. `updated` moves to now in PT on every edit.
- All timestamps are Pacific Time, format `YYYY-MM-DD HH:MM PT`.
- `verdict` is required. It is the only place Lambda's voice appears in the entry.
- `library` is required on any entry that discusses a library, package, or framework.
  Use the primary home URL (docs site, npm page, or official repo). The engine
  renders it as a prominent link in the reader.
- `intro` is required on library entries. One or two sentences in plain language
  for someone who is not a pro yet. The engine renders it under the library link,
  before the body.
- No em dashes in any field.

### Body

Plain markdown after the json block. Headings, paragraphs, lists, bold, inline
`code`, code blocks, blockquotes, and links all render. The body teaches in clear
prose. It is not written in Lambda's terse voice. Her voice is the verdict.

### Live preview blocks

A fenced block with the info word `preview` becomes a live window: the code on
the left, the same code rendered in a sandboxed iframe on the right. The text
after `preview` on the same line is the window label.

    ```preview HTML only
    <h1>Hello</h1>
    <p>This renders live, next to its own code.</p>
    ```

Notes:
- The preview renders HTML and CSS. Scripts are sandboxed off, so previews are
  for markup and styling, not JavaScript behavior.
- A preview block cannot contain triple backticks.
- Include at least one preview in any entry that teaches markup or styling.

### Live demo blocks

A fenced block with the info word `demo` becomes a live window like preview, but
the iframe allows JavaScript. Use this for npm libraries, charts, and anything
that must run code. The text after `demo` on the same line is the window label.

    ```demo Minimal example
    <script type="module">
    import { Thing } from "https://esm.sh/package@1.0.0";
    // mount and run
    </script>
    ```

Notes:
- Pin CDN versions (e.g. `package@1.0.0`) so the entry stays stable.
- Partial HTML is wrapped in a document shell automatically. Full documents
  starting with `<!DOCTYPE` or `<html` pass through unchanged.
- Sandbox allows scripts and same-origin only. Not a GitHub Pages limitation:
  both preview and demo work on any static host; the block type sets behavior.
- A demo block cannot contain triple backticks.

### Teaching aids (optional HTML in the body)

Library and graph entries often include:

- `<div class="lambda-tip">` callouts for Lambda teacher notes (label in
  `.lambda-tip-label`, body in plain paragraphs).
- `<details class="entry-fold">` with `<summary>` for collapsible sections.
  Standard pattern: one fold titled "Prompt an AI", one titled "Build it yourself".

These are raw HTML inside the markdown body. The engine passes them through marked.

---

## Manifest: `data/manifest.md`

One json block. The engine reads only that block.

```json
{
  "archive": "Lambda // Index",
  "tagline": "A growing reference archive. Filed by Lambda.",
  "entries": ["newest-slug", "older-slug"]
}
```

- `entries` is display order, newest first. Prepend on file. Never remove.
- Every slug must have a matching file at `data/entries/<slug>.md`.

---

## Library state: `data/library-state.md`

Lambda's memory. Human and agent read it. The website does not. No fixed schema,
but it always tracks: entry count, last filed, category counts, tag vocabulary,
open threads, and a conventions log. See the file itself for the living format.

## Session log: `data/log.md`

One json block. The engine reads it for the Log view. Lambda writes one session
on every goodnight, prepended newest first. Append, never delete.

```json
{
  "sessions": [
    {
      "date": "2026-06-15 18:55 PT",
      "title": "Short session title",
      "summary": "One or two sentences on what the session was.",
      "did": ["What got done", "Another thing done"],
      "next": ["What to pick up next time"]
    }
  ]
}
```

- `date` is Pacific Time, `YYYY-MM-DD HH:MM PT`.
- `did` and `next` are arrays. `next` is also synced into library-state open threads.
- No em dashes in any field.

---

## Adding an entry, end to end

1. Write `data/entries/<slug>.md` to the meta + body schema above.
2. Prepend `<slug>` to `entries` in `data/manifest.md`.
3. Update `data/library-state.md`.
4. Operator publishes in GitHub Desktop. The agent never runs git.
