# React: building interactive UIs from components

```json
{
  "id": "react",
  "title": "React: building interactive UIs from components",
  "category": "Web Development",
  "tags": ["react", "javascript", "components", "jsx", "ui", "frontend", "npm"],
  "summary": "React is a JavaScript library for building user interfaces from reusable components. State, interactivity, and live demos. Filed at Cameron's insistence.",
  "library": "https://react.dev/",
  "intro": "React helps you build web pages that react when people click, type, or scroll. Instead of one long HTML file, you split the page into small reusable pieces called components, like a search bar or a like button, and React keeps the screen in sync when data changes.",
  "sources": [
    "https://react.dev/",
    "https://react.dev/learn",
    "https://www.npmjs.com/package/react",
    "https://github.com/facebook/react",
    "Cameron, in person"
  ],
  "added": "2026-06-15 13:31 PT",
  "updated": "2026-06-15 13:31 PT",
  "verdict": "Components, state, render. HTML gives you the skeleton. React gives it a nervous system. Cameron was right to insist."
}
```

[React](https://react.dev/) is a JavaScript **library** for building user interfaces on the web (and, via React Native, on mobile). The [official site](https://react.dev/) describes it as the tool for creating UIs from individual pieces called **components**. It is widely used in production and actively maintained. The docs currently highlight **React 19**.

Cameron insisted this one get filed. Fair. It sits next to [html-vs-css](#/e/html-vs-css) in **Web Development**: HTML is structure, CSS is presentation, JavaScript is behavior, and React is how many teams organize behavior and UI into maintainable pieces.

## What React actually is (and is not)

**React is a library**, not a full app framework. It handles components and updating the screen. It does not prescribe routing, data fetching, or folder layout by itself. For a complete app, the [React docs](https://react.dev/) recommend a full-stack framework such as [Next.js](https://nextjs.org/) or React Router.

You can also **add React to an existing HTML page** without rebuilding everything. That matters when you are learning: you do not have to go all-in on day one.

## Core ideas

### Components

A React component is a JavaScript function that returns UI. Small pieces combine into pages and apps. The [React homepage](https://react.dev/) shows a `Video` component built from `Thumbnail`, a link, and `LikeButton`.

### JSX

Most React code uses **JSX**: a syntax extension that looks like HTML inside JavaScript. It is not required (you can use plain function calls), but it is the norm. JSX keeps markup close to the logic that controls it.

### State and interactivity

When the user types, clicks, or toggles something, you update **state**. React re-renders the affected components so the screen matches the new data. The classic hook for this is `useState`. The docs walk through searchable lists and forms as teaching examples.

### One-way data flow

Data flows **down** from parent components to children via **props**. Events flow **up** through callback functions. That pattern keeps large apps predictable.

<details class="entry-fold">
<summary>Prompt an AI (React)</summary>
<div class="fold-body">
<p>Give the model this context:</p>
<ul>
<li>React version (19.x if following current docs)</li>
<li>Whether you want JSX or plain <code>createElement</code></li>
<li>Component tree (what is the parent, what are the children)</li>
<li>What state you need and what triggers updates</li>
<li>Setup: Vite, Next.js, or CDN/esm for a quick test</li>
</ul>
<p>Sample prompt: <em>"Create a React 19 component with useState: a counter with + and - buttons. Use JSX. Explain where state lives and what causes a re-render."</em></p>
<p>Ask it to link to [react.dev/learn](https://react.dev/learn) and to avoid class components unless you specifically need legacy syntax. Prefer function components and hooks.</p>
</div>
</details>

<details class="entry-fold">
<summary>Build it yourself (React)</summary>
<div class="fold-body">
<p><strong>Recommended path (local project):</strong></p>
<pre><code>npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev</code></pre>
<p><strong>Minimal mental model:</strong></p>
<pre><code>import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
      Count: {count}
    &lt;/button&gt;
  );
}

export default Counter;</code></pre>
<p>Start with the [Quick Start](https://react.dev/learn) on react.dev. It covers components, JSX, state, and effects in order. Add a framework later when you need routing and server data.</p>
</div>
</details>

## Live demo: interactive counter

Uses React 19 from [esm.sh](https://esm.sh/) inside a `demo` block. No build step in the iframe, same idea as the Chart.js and psychart entries.

```demo Counter with useState
<div id="reactRoot"></div>
<style>
  #reactRoot { font-family: system-ui, sans-serif; padding: 12px; }
  #reactRoot button {
    margin: 0 6px; padding: 8px 14px; cursor: pointer;
    background: #45d2ff; color: #04121b; border: 0; border-radius: 8px;
    font-weight: 600;
  }
  #reactRoot .count { font-size: 18px; margin: 0 8px; }
</style>
<script type="module">
import { createElement, useState } from "https://esm.sh/react@19";
import { createRoot } from "https://esm.sh/react-dom@19/client";

function Counter() {
  const [count, setCount] = useState(0);
  return createElement("div", null,
    createElement("span", { className: "count" }, "Count: ", count),
    createElement("button", { onClick: () => setCount(count + 1) }, "+"),
    createElement("button", { onClick: () => setCount(count - 1) }, "-")
  );
}

createRoot(document.getElementById("reactRoot")).render(createElement(Counter));
</script>
```

## Live demo: like button (props + state)

```demo Like button component
<div id="likeRoot"></div>
<style>
  #likeRoot { font-family: system-ui, sans-serif; padding: 12px; }
  #likeRoot button {
    padding: 10px 18px; cursor: pointer; border-radius: 8px;
    border: 1px solid #45d2ff; background: transparent; color: #1f9ad6;
    font-weight: 600;
  }
  #likeRoot button.on { background: #45d2ff; color: #04121b; }
</style>
<script type="module">
import { createElement, useState } from "https://esm.sh/react@19";
import { createRoot } from "https://esm.sh/react-dom@19/client";

function LikeButton() {
  const [liked, setLiked] = useState(false);
  return createElement("button", {
    className: liked ? "on" : "",
    onClick: () => setLiked(!liked)
  }, liked ? "Unlike" : "Like");
}

createRoot(document.getElementById("likeRoot")).render(createElement(LikeButton));
</script>
```

## Where React fits in your stack

| Layer | Tool | Job |
|-------|------|-----|
| Structure | HTML | What is on the page |
| Presentation | CSS | How it looks |
| Behavior | JavaScript | What it does |
| UI organization | **React** | Components, state, efficient updates |

Chart libraries in this archive ([Chart.js](#/e/chartjs), [psychart](#/e/psychart)) can run inside React components. React is the shell; those libraries are often the chart inside the shell.

## Ecosystem (from react.dev)

- **Frameworks:** Next.js, React Router for full apps, routing, and server features.
- **React Native / Expo:** Same component skills, native mobile apps.
- **Server Components:** Async components that run on the server (documented on react.dev for advanced use).
- **Community:** Large docs audience, conferences, Stack Overflow tag `reactjs`.

The React project has moved toward community governance via the **React Foundation** (hosted by the Linux Foundation), per [react.dev news](https://react.dev/). Check the site for current release notes and security advisories.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Learn components and <code>useState</code> before hooks like <code>useEffect</code> or server features. If you can build a button that updates a number on screen, you understand the core loop: state changes, React re-renders.</p>
</div>

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>React is a library entry, so it uses <code>demo</code> blocks, not <code>preview</code>. Same rule as Chart.js and psychart: JavaScript must run for the live sample to work.</p>
</div>

## Package facts (verified)

| Field | Value |
|-------|-------|
| npm package | `react` (companion: `react-dom`) |
| Docs version | 19.x (per [react.dev](https://react.dev/) at time of filing) |
| License | MIT |
| Repository | [github.com/facebook/react](https://github.com/facebook/react) |
| Homepage | [react.dev](https://react.dev/) |

Install: `npm install react react-dom`. For a new app, the docs point to Vite or a framework starter rather than wiring everything by hand.
