# HTML vs CSS, and where JavaScript fits

Entry meta lives in the json block below. The engine reads that block for the
index card, then renders everything after it as the doc. The `preview` blocks
become live windows: code on the left, the same code actually rendering on the
right.

```json
{
  "id": "html-vs-css",
  "title": "HTML vs CSS, and where JavaScript fits",
  "category": "Web Development",
  "tags": ["html", "css", "javascript", "fundamentals", "first-entry"],
  "summary": "What HTML, CSS, and JavaScript each do, how they pair, and a side by side look at the same page before and after styling.",
  "sources": ["MDN Web Docs", "Cameron, in person"],
  "added": "2026-06-15 09:12 PT",
  "updated": "2026-06-15 09:12 PT",
  "verdict": "HTML is the skeleton, CSS is the wardrobe, JavaScript is the nervous system. Skip the skeleton and the rest has nothing to hang on."
}
```

Every web page you have ever opened is built from three layers doing three
different jobs. Most of the confusion about web code disappears the moment you
stop treating them as one thing and start seeing the division of labor.

## HTML is the structure

HTML stands for HyperText Markup Language. It is not a programming language. It
does not calculate or decide anything. Its only job is to describe **what the
content is**: this is a heading, this is a paragraph, this is a list, this is a
button. You wrap content in tags, and the tags give it meaning.

Think of it as the framing of a house. Walls, doors, rooms. No paint, no
furniture, no electricity. Just the structure that says where everything goes.

## CSS is the presentation

CSS stands for Cascading Style Sheets. Its only job is to describe **how the
content looks**: colors, fonts, spacing, size, position, layout. CSS never
changes what the content is. It changes how the content is dressed.

Back to the house: CSS is the paint, the flooring, the lighting, the furniture
placement. Same rooms, completely different feel.

The key idea is **separation of concerns**. The structure does not care how it
looks, and the styling does not care what the words say. You can hand the exact
same HTML to two different stylesheets and get two completely different pages.
That is the whole trick, and it is easier to see than to explain.

## The same page, twice

Here is a tiny page with structure only. No styling at all. This is what the
browser shows when it is left to its own defaults: black text, white background,
plain serif font, everything stacked top to bottom.

```preview HTML only
<h1>Cameron's Cafe</h1>
<p>Fresh coffee, slow mornings.</p>
<h2>Today's menu</h2>
<ul>
  <li>Espresso</li>
  <li>Cold brew</li>
  <li>Matcha</li>
</ul>
<button>Order now</button>
```

Now the exact same HTML, with a `<style>` block added. Not one word of content
changed. Only the presentation layer was added on top.

```preview HTML with CSS added
<style>
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
    background: #0e1118;
    color: #e9eef6;
    padding: 28px;
  }
  h1 { color: #45d2ff; margin: 0 0 4px; letter-spacing: 0.02em; }
  p  { color: #9aa6b8; margin: 0 0 22px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7686; }
  ul { list-style: none; padding: 0; }
  li {
    padding: 11px 14px; margin-bottom: 8px;
    background: #141a26; border: 1px solid rgba(96,170,224,0.3);
    border-radius: 10px;
  }
  button {
    margin-top: 14px; padding: 11px 22px;
    background: #45d2ff; color: #04121b; font-weight: 600;
    border: 0; border-radius: 10px; cursor: pointer;
  }
</style>
<h1>Cameron's Cafe</h1>
<p>Fresh coffee, slow mornings.</p>
<h2>Today's menu</h2>
<ul>
  <li>Espresso</li>
  <li>Cold brew</li>
  <li>Matcha</li>
</ul>
<button>Order now</button>
```

Same skeleton. Different wardrobe. The browser rendered both from the same set
of tags. That is the relationship in one screen.

## Where JavaScript fits

HTML and CSS are static. They describe a page and then sit there. They cannot
respond to a click, fetch new data, or change anything after the page loads.
That is the third layer's job.

JavaScript is the actual programming language of the three. It adds **behavior**.
When you press that Order now button and something happens, that is JavaScript
listening for the click and reacting. When a page updates without reloading,
loads more results as you scroll, or validates a form, that is JavaScript.

The clean mental model:

- **HTML** puts the content on the page.
- **CSS** decides how that content looks.
- **JavaScript** decides what happens when the content is used.

A page can exist with HTML alone. It can look good with HTML and CSS. It only
becomes interactive when JavaScript joins. Each layer is optional on top of the
one before it, and each one has exactly one job.

## The one thing to remember

If something is about **what is on the page**, that is HTML. If it is about
**how it looks**, that is CSS. If it is about **what it does**, that is
JavaScript. When you are reading code and feel lost, sorting each piece into one
of those three buckets is usually enough to find your footing.
