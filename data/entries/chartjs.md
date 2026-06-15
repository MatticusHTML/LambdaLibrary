# Chart.js: charts for the web

```json
{
  "id": "chartjs",
  "title": "Chart.js: charts for the web",
  "category": "Graphs",
  "tags": ["chartjs", "charts", "graphs", "javascript", "npm", "canvas", "data-visualization"],
  "summary": "Deep guide to Chart.js: eight chart types, config anatomy, scales, plugins, mixed charts, and nine live demos from bar charts to pump-style scatter plots.",
  "library": "https://www.chartjs.org/",
  "intro": "Chart.js turns rows of numbers into bar charts, line graphs, pie charts, and more on any web page. If you have data in a spreadsheet and want a clean visual for a dashboard, a report, or a project, this library draws it for you and handles colors, labels, and resizing when the window changes size.",
  "sources": [
    "https://www.chartjs.org/",
    "https://www.chartjs.org/docs/latest/",
    "https://www.chartjs.org/docs/latest/getting-started/index",
    "https://www.chartjs.org/samples/",
    "https://www.npmjs.com/package/chart.js",
    "https://github.com/chartjs/Chart.js"
  ],
  "added": "2026-06-15 12:59 PT",
  "updated": "2026-06-15 14:31 PT",
  "verdict": "Canvas, config object, done. The defaults are good enough to ship. Tune the options when the story needs it."
}
```

[Chart.js](https://www.chartjs.org/) is an open-source JavaScript charting library. It renders on an **HTML5 canvas** element, not SVG. That choice makes it fast with large datasets and keeps your DOM tree light compared to libraries that draw thousands of SVG nodes.

The [official docs](https://www.chartjs.org/docs/latest/) describe it as one of the most widely used chart libraries for web developers. It is community maintained, MIT licensed, and works with plain JavaScript or popular frameworks ([React](#/e/react), Vue, Svelte, Angular) via wrappers or direct import.

## Chart.js vs specialty graph libraries

This archive also covers [psychart](#/e/psychart), which draws **engineering charts** (pump curves, psychrometric diagrams) with domain math baked in. Chart.js is the general-purpose option: you bring labels and numbers, it draws standard chart types.

| Goal | Use |
|------|-----|
| Dashboard, sales, categories, trends | **Chart.js** |
| Pump curve + system curve + operation point | **psychart Pumpchart** |
| TDH slider + horizontal line across catalog models | **Chart.js line/scatter** (custom logic) or your canvas tool |
| Standard bar/line/pie on a web page | **Chart.js** |

Use Chart.js when the goal is "show this data clearly." Use psychart when the goal is "show pump or HVAC physics on the right kind of chart."

## When to use which chart type

Chart.js ships eight built-in types. Pick the type that matches the **question** you are asking:

| Type | Question it answers | Example |
|------|---------------------|---------|
| **bar** | Which category is bigger? | Sales by weekday |
| **line** | How does this change over time or sequence? | Pump flow by month |
| **pie** / **doughnut** | What share of the whole? | Budget split |
| **radar** | How do several traits compare on one profile? | Spec sheet across models |
| **polar area** | Like pie, but radius (not slice angle) shows magnitude | Not covered in demos below |
| **bubble** | x, y, and a third dimension as bubble size | Not covered in demos below |
| **scatter** | Is there a relationship between two numbers? | TDH vs GPM points |
| **mixed** | Two stories on one canvas (bars + trend line) | Revenue bars + growth line |

You can also use [community chart types](https://github.com/chartjs/awesome) or build custom plugins.

## The mental model

Every Chart.js chart follows the same three pieces:

1. **A `<canvas>` element** in your HTML. Chart.js draws pixels onto it.
2. **A chart type** (`bar`, `line`, `pie`, etc.).
3. **A config object** with `data` and `options`.

```javascript
new Chart(canvasElement, {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed"],
    datasets: [{
      label: "Cafe sales",
      data: [12, 19, 8],
      backgroundColor: "#45d2ff"
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true } }
  }
});
```

### The `data` object

- **`labels`:** category names (x-axis for bar/line, slice names for pie). Can be omitted for scatter where both axes are numeric.
- **`datasets`:** an array. Each dataset is one series (one line, one set of bars, one color group). Multiple datasets = multiple lines or grouped/stacked bars on the same chart.

Common dataset fields:

| Field | Purpose |
|-------|---------|
| `label` | Name in legend and tooltips |
| `data` | Numbers (or `{x, y}` objects for scatter) |
| `backgroundColor` | Fill color (bars, pie slices, area under line) |
| `borderColor` | Line or bar outline color |
| `borderWidth` | Stroke thickness |
| `tension` | Line curve smoothness (0 = straight segments) |
| `fill` | Shade area under a line |
| `stack` | Same stack id = bars stack on top of each other |

### The `options` object

Controls behavior and appearance:

- **`responsive: true`** — chart resizes with its container (default on).
- **`plugins`** — legend, title, subtitle, tooltip, colors plugin (v4).
- **`scales`** — x and y axes: min/max, titles, grid lines, `stacked: true` for stacked bars.
- **`indexAxis: 'y'`** — flips a bar chart horizontal (categories on the left).

Chart.js 4.x includes sensible defaults: animations on, responsive resizing, and a built-in [colors plugin](https://www.chartjs.org/) so you often get a polished chart with zero styling work. [Tree-shaking](https://www.chartjs.org/docs/latest/) lets bundlers drop chart types you do not import, shrinking bundle size.

## Multiple datasets on one chart

One canvas can show **several series at once**. Each item in `datasets` gets its own color and legend entry. Use this to compare two pump models, two years of sales, or actual vs target.

For **grouped bars**, give each dataset the same labels and different `data` arrays. For **stacked bars**, add `stack: "same"` to each dataset and set `scales.x.stacked` and `scales.y.stacked` to true.

## Mixed charts (bar + line)

Since Chart.js 2.0, each dataset can declare its own `type`. One dataset can be `bar` while another is `line` on the same chart. Typical use: bars for monthly totals, line for rolling average or target.

```javascript
datasets: [
  { type: "bar", label: "Revenue", data: [10, 20, 15] },
  { type: "line", label: "Target", data: [12, 18, 16], borderColor: "#ff6b6b" }
]
```

## Tooltips, legend, and interactivity

Hover any point or bar and Chart.js shows a **tooltip** with the value. The **legend** toggles datasets on and off when clicked (useful with many lines). No extra code required for basic tooltips; customize via `options.plugins.tooltip`.

To **update data after load** (e.g. user enters a new TDH), keep a reference to the chart instance, mutate `chart.data.datasets[0].data`, then call `chart.update()`. That pattern powers live dashboards and pump lookup tools.

## Canvas vs CSS styling

Chart.js draws on canvas. You **cannot** style individual bars with CSS selectors the way you would SVG. Colors, fonts, and grid lines go through the config object or [plugins](https://www.chartjs.org/docs/latest/developers/plugins.html). Community plugins add zoom, pan, and annotations.

## Using Chart.js with React

Install `chart.js` and optionally `react-chartjs-2`. Register the chart types you need, pass `data` and `options` as props. The mental model is identical; React owns the component lifecycle, Chart.js owns the canvas. Your [react](#/e/react) entry covers components; Chart.js is a natural fit inside one.

<details class="entry-fold">
<summary>Prompt an AI (Chart.js)</summary>
<div class="fold-body">
<p>Give the model this context:</p>
<ul>
<li>Library: Chart.js v4.5.1, npm package <code>chart.js</code></li>
<li>Chart type (bar, line, pie, mixed, scatter, stacked, horizontal)</li>
<li>Labels array and one or more datasets with values</li>
<li>Whether axes should start at zero, stack, or use a second y-axis</li>
<li>CDN script tag vs ES module import</li>
<li>Framework if any (React + react-chartjs-2, or plain JS)</li>
</ul>
<p>Sample prompt: <em>"Chart.js 4.5.1: stacked bar chart, three datasets (Q1, Q2, Q3) for labels Jan–Jun. Colors #45d2ff, #1f9ad6, #6b7686. Responsive, legend top, y axis begins at zero."</em></p>
<p>Ask it to link to the [Getting Started guide](https://www.chartjs.org/docs/latest/getting-started/index) and [samples gallery](https://www.chartjs.org/samples/). Pin CDN version <code>chart.js@4.5.1</code>.</p>
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
<p>Docs: [Getting Started](https://www.chartjs.org/docs/latest/getting-started/index). Browse [samples](https://www.chartjs.org/samples/) for copy-paste starting points.</p>
</div>
</details>

---

## Live demos

All demos use `chart.js@4.5.1` from CDN inside `demo` blocks. Each chart is interactive: hover for tooltips, click legend items to hide series where applicable.

### Bar chart (weekly sales)

Compares categories side by side. The simplest starting point.

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

### Line chart (trend over time)

Shows change across a sequence. `tension` curves the line; `fill` shades the area underneath.

```demo Line chart (pump flow by month)
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
  options: { responsive: true, plugins: { legend: { display: true } } }
});
</script>
```

### Multi-line chart (compare two models)

Two datasets, same labels. This is the pattern for overlaying pump model curves: each model is one dataset, shared TDH or GPM labels on the x-axis.

```demo Multi-line (two pump models)
<canvas id="multiLine" height="240"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script>
new Chart(document.getElementById("multiLine"), {
  type: "line",
  data: {
    labels: [50, 100, 150, 200, 250, 300],
    datasets: [
      {
        label: "05RPS10 (1 HP)",
        data: [8, 7.5, 7, 6.5, 5.5, 4.5],
        borderColor: "#e0a800",
        tension: 0.2
      },
      {
        label: "05RPS15 (1.5 HP)",
        data: [8, 8, 7.5, 7, 6.5, 5.5],
        borderColor: "#2c9b3f",
        tension: 0.2
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "GPM at TDH (ft) — 05RPS family sample" }
    },
    scales: {
      x: { title: { display: true, text: "TDH (ft)" } },
      y: { title: { display: true, text: "GPM" }, beginAtZero: true }
    }
  }
});
</script>
```

### Scatter plot (TDH vs GPM)

Both axes are numeric. Each point is `{x, y}`. Good for plotting raw curve table rows before you connect them with a line.

```demo Scatter (pump curve points)
<canvas id="scatterChart" height="240"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script>
new Chart(document.getElementById("scatterChart"), {
  type: "scatter",
  data: {
    datasets: [{
      label: "05RPS10 table points",
      data: [
        { x: 8, y: 50 }, { x: 7.5, y: 100 }, { x: 7, y: 150 },
        { x: 6.5, y: 200 }, { x: 5.5, y: 250 }, { x: 4.5, y: 300 }
      ],
      backgroundColor: "#e0a800",
      pointRadius: 6
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "GPM" }, reverse: false },
      y: { title: { display: true, text: "TDH (ft)" } }
    }
  }
});
</script>
```

### Stacked bar chart

Several datasets share the same labels and stack vertically. Shows composition (e.g. revenue by product line per quarter).

```demo Stacked bar (quarterly mix)
<canvas id="stackedBar" height="240"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script>
new Chart(document.getElementById("stackedBar"), {
  type: "bar",
  data: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      { label: "Pumps", data: [30, 45, 38, 52], backgroundColor: "#45d2ff", stack: "s" },
      { label: "Parts", data: [12, 18, 15, 20], backgroundColor: "#1f9ad6", stack: "s" },
      { label: "Service", data: [8, 10, 14, 11], backgroundColor: "#6b7686", stack: "s" }
    ]
  },
  options: {
    responsive: true,
    scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
  }
});
</script>
```

### Horizontal bar chart

Same as bar, but categories run down the left. Set `indexAxis: 'y'`. Useful when labels are long (model names, regions).

```demo Horizontal bar (HP comparison)
<canvas id="hBar" height="220"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script>
new Chart(document.getElementById("hBar"), {
  type: "bar",
  data: {
    labels: ["1/2 HP", "3/4 HP", "1 HP", "1.5 HP", "2 HP"],
    datasets: [{
      label: "Max GPM @ 200 ft TDH (sample)",
      data: [5.5, 6, 6.5, 7, 7.5],
      backgroundColor: "#45d2ff"
    }]
  },
  options: {
    indexAxis: "y",
    responsive: true,
    scales: { x: { beginAtZero: true } }
  }
});
</script>
```

### Doughnut chart (parts of a whole)

Pie and doughnut show proportions. Doughnut has a hole in the center; easier to read labels for many slices.

```demo Doughnut (install mix)
<canvas id="doughnut" height="240"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script>
new Chart(document.getElementById("doughnut"), {
  type: "doughnut",
  data: {
    labels: ["Submersible", "Surface", "Solar", "Other"],
    datasets: [{
      data: [45, 30, 18, 7],
      backgroundColor: ["#45d2ff", "#1f9ad6", "#e0a800", "#6b7686"]
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: "right" } }
  }
});
</script>
```

### Mixed chart (bars + line)

Bars for one metric, line for another on the same canvas. Each dataset sets its own `type`.

```demo Mixed bar and line
<canvas id="mixedChart" height="240"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script>
new Chart(document.getElementById("mixedChart"), {
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        type: "bar",
        label: "Units sold",
        data: [40, 55, 48, 62, 58],
        backgroundColor: "rgba(69,210,255,0.6)",
        order: 2
      },
      {
        type: "line",
        label: "Target",
        data: [45, 50, 50, 55, 60],
        borderColor: "#ff6b6b",
        borderWidth: 2,
        fill: false,
        order: 1
      }
    ]
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  }
});
</script>
```

### Radar chart (multi-trait comparison)

Each axis is one trait. One dataset = one profile (one pump model, one product). Good for spec comparisons at a glance.

```demo Radar (model specs)
<canvas id="radarChart" height="260"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script>
new Chart(document.getElementById("radarChart"), {
  type: "radar",
  data: {
    labels: ["Max TDH", "Max GPM", "Efficiency", "Reliability", "Value"],
    datasets: [
      {
        label: "Model A",
        data: [7, 6, 8, 7, 6],
        borderColor: "#45d2ff",
        backgroundColor: "rgba(69,210,255,0.2)"
      },
      {
        label: "Model B",
        data: [8, 5, 7, 8, 7],
        borderColor: "#e0a800",
        backgroundColor: "rgba(224,168,0,0.2)"
      }
    ]
  },
  options: {
    responsive: true,
    scales: { r: { beginAtZero: true, max: 10 } }
  }
});
</script>
```

---

## Notable features (v3 and v4)

From the [Chart.js site](https://www.chartjs.org/) and [docs](https://www.chartjs.org/docs/latest/):

- **Responsive:** redraws when the browser window resizes.
- **Animations:** enabled by default; each property can be configured in v3+.
- **Performance:** decimation plugin for huge datasets; canvas keeps DOM lean.
- **Mixed charts:** bar and line together on one canvas (demo above).
- **Custom scales:** time, logarithmic, or fully custom axes.
- **Plugins:** subtitles, colors palette (v4), annotations, zoom (via community plugins).
- **TypeScript:** built-in typings.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Start with one chart type and one dataset. Get labels and numbers on screen before you touch colors, dual axes, or mixed types. Chart.js defaults are deliberately good. Fighting them on day one is optional.</p>
</div>

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>For pump catalog work: multi-line charts with GPM on y and TDH on x mirror your curve tables. Add a horizontal annotation line at the user's TDH with the annotation plugin, or draw it yourself on update. That is the Chart.js path for your TDH lookup tool.</p>
</div>

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Pin your CDN or npm version. Chart.js ships major releases with breaking changes every few years. All demos here use <code>4.5.1</code>. Match that in your project unless you are deliberately upgrading.</p>
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

Support: [Stack Overflow tagged chart.js](https://stackoverflow.com/questions/tagged/chart.js), Discord and GitHub Discussions linked from the [docs](https://www.chartjs.org/docs/latest/).
