# Lambda // Index

A growing personal reference archive. You and a friend dig into a topic, Lambda
files it as a clean entry, and it is on your phone forever after. The archive
only grows.

Static site. No backend, no build step, no npm, no framework. Vanilla JS engine,
data as JSON inside markdown, history is additive. Lambda runs all updates from
inside Cursor. You publish with GitHub Desktop.

---

## What is in here

```
index.html               the hub shell
css/style.css            the locked dark theme
js/engine.js             reads the data, derives the index, handles the reader
data/
  manifest.md            master list of entry slugs (the engine reads this)
  library-state.md       Lambda's memory, the menu that learns over time
  log.md                 session log, written on every goodnight
  entries/
    html-vs-css.md       first entry, with two live preview windows
AGENTS.md                Lambda's operating protocol (Cursor reads this)
docs/
  LAMBDA_PROTOCOL.md     full strict behavior spec
  SCHEMA.md              the data contract for entries and the manifest
assets/favicon.svg       the prism mark
.nojekyll                tells GitHub Pages to serve files as-is
```

## Running it

The site loads its data with `fetch()`, so it must be served, not opened from a
file. Double-clicking `index.html` will fail.

- On GitHub Pages: just push and open the Pages URL.
- Locally, from the project folder: `python3 -m http.server` then open
  `http://localhost:8000`.

## Deploying

1. In GitHub Desktop, review the changed files.
2. Commit with a short message.
3. Push.
4. GitHub Pages serves from `main`, repo root. Open the Pages URL.

No command-line git. Lambda never runs git either. She edits files and stops.

## The goodnight to good morning loop

Lambda works across two machines. The loop ties them together.

- Any greeting wakes her: `activate`, `hello`, `hello lambda`, `good morning`.
- When you are done for the day, say `goodnight`. She finishes or parks anything
  in progress, writes a session summary to `data/log.md`, and signs off. Then you
  publish in GitHub Desktop.
- At home, clone or pull the repo, open it in Cursor, and say `good morning`. She
  reads the recent log, recaps where you left off, and you keep going. Never fresh.

The same log is on the site under the Log button, so you can scroll past
goodnights from your phone. Each entry is one session.

## Sharing one entry

Entries have their own link. Send a friend the hub URL plus the entry hash:

```
https://<user>.github.io/lambda-index/#/e/html-vs-css
```

It opens straight to that entry. Phone friendly.

## Adding an entry

You do not hand-edit. In Cursor, ask Lambda to file a new entry. She reads her
memory, confirms the category, writes the entry file, registers it in the
manifest, and updates her memory. Then you publish in GitHub Desktop. See
`AGENTS.md` and `docs/SCHEMA.md` for the details.

---

The archive grows. It does not forget.
