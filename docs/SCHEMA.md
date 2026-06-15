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
