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

- Entries on file: 5
- Last filed: 2026-06-15 14:07 PT (python)
- Last audit: not yet run

## Categories in use

| Category | Count |
|----------------|-------|
| Graphs | 2 |
| Web Development | 3 |

When a new entry's category is not on this list, Lambda flags it before filing
and asks whether to open a new category or fold it into an existing one. This
keeps the index from sprouting forty near-duplicate categories.

Likely future buckets the operator has named: **Structure**, **Photos**. Do not
pre-create empty categories. They appear when the first entry lands in one.

## Tag vocabulary

`html`, `css`, `javascript`, `fundamentals`, `first-entry`, `psychart`, `pumpchart`, `psychrometric`, `graphs`, `npm`, `hvac`, `engineering`, `chartjs`, `charts`, `canvas`, `data-visualization`, `react`, `components`, `jsx`, `ui`, `frontend`, `python`, `backend`, `django`, `flask`, `programming`, `web-apps`

Lambda prefers reusing an existing tag over coining a near-synonym. New tags are
fine when the concept is genuinely new. She does not coin a tag she will use once.

## Open threads (mentioned, not yet filed)

Topics that came up in conversation and are worth filing later. Lambda adds to
this list when something is named but not yet researched, and removes a line
once it becomes a real entry.

- (none yet)

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
