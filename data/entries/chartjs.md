# Chart.js: charts for the web

```json
{
  "id": "chartjs",
  "title": "Chart.js: charts for the web",
  "category": "Graphs",
  "tags": ["chartjs", "charts", "graphs", "javascript", "npm", "canvas", "data-visualization"],
  "summary": "Chart.js draws bar, line, pie, and other chart types on an HTML5 canvas. Defaults work out of the box, customization runs deep. Live demos included.",
  "library": "https://www.chartjs.org/",
  "intro": "Chart.js turns rows of numbers into bar charts, line graphs, pie charts, and more on any web page. If you have data in a spreadsheet and want a clean visual for a dashboard, a report, or a project, this library draws it for you and handles colors, labels, and resizing when the window changes size.",
  "sources": [
    "https://www.chartjs.org/",
    "https://www.chartjs.org/docs/latest/",
    "https://www.npmjs.com/package/chart.js",
    "https://github.com/chartjs/Chart.js"
  ],
  "added": "2026-06-15 12:59 PT",
  "updated": "2026-06-15 12:59 PT",
  "verdict": "Canvas, config object, done. The defaults are good enough to ship. Tune the options when the story needs it."
}
```

[Chart.js](https://www.chartjs.org/) is an open-source JavaScript charting library. It renders on an **HTML5 canvas** element, not SVG. That choice makes it fast with large datasets and keeps your DOM tree light compared to libraries that draw thousands of SVG nodes.

The [official docs](https://www.chartjs.org/docs/latest/) describe it as one of the most widely used chart libraries for web developers. It is community maintained, MIT licensed, and works with plain JavaScript or popular frameworks (React, Vue, Svelte, Angular) via wrappers or direct import.

## Chart.js vs specialty graph libraries

This archive also covers [psychart](#/e/psychart), which draws **engineering charts** (pump curves, psychrometric diagrams) with domain math baked in. Chart.js is the general-purpose option: you bring labels and numbers, it draws standard chart types. Use Chart.js when the goal is "show this data clearly." Use psychart when the goal is "show pump or HVAC physics on the right kind of chart."

## Eight chart types

Chart.js ships eight built-in types. All are animated and customizable:

| Type | Good for |
|------|----------|
| **bar** | Comparing categories (sales by day, votes by color) |
| **line** | Trends over time (temperature, traffic, pump readings) |
| **pie** / **doughnut** | Parts of a whole (budget split, market share) |
| **radar** | Comparing several variables at once |
| **polar area** | Like pie, but equal angles, radius shows value |
| **bubble** | Three dimensions: x, y, and bubble size |
| **scatter** | Correlation between two numeric axes |
| **mixed** | Bar and line on the same canvas (Chart.js 2.0+) |

You can also use [community chart types](https://github.com/chartjs/awesome) or build custom plugins.

## The mental model

Every Chart.js chart follows the same three pieces:

1. **A `<canvas>` element** in your HTML. Chart.js draws pixels onto it.
2. **A chart type** (`bar`, `line`, `pie`, etc.).
3. **A config object** with `data` (labels + datasets) and optional `options` (colors, legends, axes, animations).

```javascript
new Chart(canvasElement, {
  type: "bar",
  data: { labels: [...], datasets: [{ label: "...", data: [...] }] },
  options: { /* responsive, plugins, scales */ }
});
```

Chart.js 4.x includes sensible defaults: animations on, responsive resizing, and a built-in [colors plugin](https://www.chartjs.org/) so you often get a polished chart with zero styling work. [Tree-shaking](https://www.chartjs.org/docs/latest/) lets bundlers drop chart types you do not import, shrinking bundle size.

<details class="entry-fold">
<summary>Prompt an AI (Chart.js)</summary>
<div class="fold-body">
<p>Give the model this context:</p>
<ul>
<li>Library: Chart.js v4, npm package <code>chart.js</code></li>
<li>Chart type you want (bar, line, pie, mixed, etc.)</li>
<li>Your labels array and data values</li>
<li>Whether you need responsive layout or a fixed size canvas</li>
<li>Framework if any (React wrapper, Vue, or plain JS)</li>
</ul>
<p>Sample prompt: <em>"Using Chart.js 4.5, create a bar chart with labels Mon through Fri and data [12, 19, 8, 14, 22]. Label the dataset 'Cafe sales'. Use a CDN script tag and a canvas element. Make it responsive."</em></p>
<p>Ask it to link to the [Getting Started guide](https://www.chartjs.org/docs/latest/getting-started/index) and the [samples gallery](https://www.chartjs.org/samples/). Tell it to pin a version in CDN URLs (e.g. <code>chart.js@4.5.1</code>).</p>
</div>
</details>

<details class="entry-fold">
<summary>Build it yourself (Chart.js)</summary>
<div class="fold-body">
<p><strong>Install:</strong></p>
<pre><code>npm install chart.js</code></pre>
<p><strong>Minimal HTML + CDN</strong> (no build step):</p>
<pre><code>&lt;canvas id="myChart"&gt;&lt;/canvas&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
  new Chart(document.getElementById("myChart"), {
    type: "bar",
    data: {
      labels: ["A", "B", "C"],
      datasets: [{ label: "Demo", data: [4, 8, 6] }]
    }
  });
&lt;/script&gt;</code></pre>
<p><strong>ES module import</strong> (bundler or type="module"):</p>
<pre><code>import Chart from "chart.js/auto";
// "auto" registers all chart types. For smaller bundles,
// import only what you need from "chart.js" and register components.</code></pre>
<p>Docs walkthrough: [Getting Started](https://www.chartjs.org/docs/latest/getting-started/index). Browse [samples](https://www.chartjs.org/samples/) for copy-paste starting points.</p>
</div>
</details>

## Live demo: bar chart

```demo Bar chart (weekly sales)
<canvas id="barChart" height="220"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script>
new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [{
      label: "Cafe sales",
      data: [12, 19, 8, 14, 22],
      backgroundColor: ["#45d2ff", "#1f9ad6", "#6b7686", "#45d2ff", "#1f9ad6"]
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true } }
  }
});
</script>
```

## Live demo: line chart

```demo Line chart (flow over months)
<canvas id="lineChart" height="220"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script>
new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Pump flow (gpm)",
      data: [65, 72, 68, 81, 79, 90],
      borderColor: "#45d2ff",
      backgroundColor: "rgba(69,210,255,0.15)",
      tension: 0.3,
      fill: true
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: true } }
  }
});
</script>
```

## Notable features (v3 and v4)

From the [Chart.js site](https://www.chartjs.org/) and [docs](https://www.chartjs.org/docs/latest/):

- **Responsive:** redraws when the browser window resizes.
- **Animations:** enabled by default; each property can be configured in v3+.
- **Performance:** decimation plugin for huge datasets; canvas keeps DOM lean.
- **Mixed charts:** bar and line together on one canvas.
- **Custom scales:** time, logarithmic, or fully custom axes.
- **Plugins:** subtitles, colors palette (v4), annotations, zoom (via community plugins).
- **TypeScript:** built-in typings.

Canvas rendering means you cannot style the chart with CSS the way you would SVG. Colors and fonts go through Chart.js `options` or custom plugins.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Start with one chart type and one dataset. Get labels and numbers on screen before you touch colors, dual axes, or mixed types. Chart.js defaults are deliberately good. Fighting them on day one is optional.</p>
</div>

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Pin your CDN or npm version. Chart.js ships major releases with breaking changes every few years. Your entry demos use <code>4.5.1</code>. Match that in your project unless you are deliberately upgrading.</p>
</div>

## Package facts (verified)

| Field | Value |
|-------|-------|
| npm package | `chart.js` |
| Current version | 4.5.1 (published 2025-10-13 per npm) |
| License | MIT |
| Repository | [github.com/chartjs/Chart.js](https://github.com/chartjs/Chart.js) |
| Weekly downloads | ~13M per npm at time of filing |
| Rendering | HTML5 canvas (IE11+ per project site) |

Support: [Stack Overflow tagged chart.js](https://stackoverflow.com/questions/tagged/chart.js), [Discord](https://www.chartjs.org/docs/latest/) (linked from docs), [GitHub Discussions](https://github.com/chartjs/Chart.js).
