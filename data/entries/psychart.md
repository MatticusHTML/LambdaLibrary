# psychart: psychrometric and pump charts in the browser

```json
{
  "id": "psychart",
  "title": "psychart: psychrometric and pump charts in the browser",
  "category": "Graphs",
  "tags": ["psychart", "pumpchart", "psychrometric", "graphs", "javascript", "npm", "hvac", "engineering"],
  "summary": "The psychart npm package renders Psychart (HVAC psychrometric charts) and Pumpchart (pump performance curves) in the browser. Pump curves, operation points, and live demos included.",
  "library": "https://npm.nicfv.com/index.html",
  "intro": "This tool draws visual charts for pump performance and indoor air conditions right in your browser. It is useful when you need to see where a submersible pump runs on its curve, or how warm and humid the air in a space actually is, before you wade into the formulas. You feed it numbers, it gives you a picture.",
  "header": "assets/entries/psychart-header.png",
  "sources": [
    "https://npm.nicfv.com/index.html",
    "https://npm.nicfv.com/documents/psychart.Examples_Pump_Curve.html",
    "https://www.npmjs.com/package/psychart",
    "https://github.com/nicfv/npm"
  ],
  "added": "2026-06-15 12:43 PT",
  "updated": "2026-06-15 12:57 PT",
  "verdict": "Two chart types, one package. Plot the state, append the element, read the curves. The library does the thermodynamics so you can focus on the system."
}
```

[psychart](https://www.npmjs.com/package/psychart) is a JavaScript library by Nicolas Ventura, documented at [npm.nicfv.com](https://npm.nicfv.com/index.html). One npm install gives you two chart classes:

- **Psychart** plots air-vapor mixture states on a psychrometric chart (HVAC and ASHRAE territory).
- **Pumpchart** plots hydraulic pump states: flow rate vs head pressure, plus pump and system curves.

Both follow the same workflow: create the chart object, call `plot()` with a state, then `document.body.append(chart.getElement())` to render it.

This entry focuses on **psychart** the package. The wider [npm.nicfv.com](https://npm.nicfv.com/index.html) site hosts documentation for other packages too, but psychart is the one with the graph tools.

## Why this entry uses `demo` blocks, not `preview`

The archive has two live window types. They look similar. They behave differently on purpose.

**`preview` blocks** render HTML and CSS inside a sandboxed iframe. Scripts are turned off. That is a security choice: preview is for markup lessons where you do not want arbitrary JavaScript running in the page. The first entry, HTML vs CSS, uses preview correctly.

**`demo` blocks** also use an iframe, but scripts are allowed. That is required for JavaScript libraries like psychart. The chart code imports the package, runs calculations, and draws to the DOM. None of that works with scripts sandboxed off.

This is not a GitHub Pages limitation. GitHub Pages serves static files fine either way. The difference is which iframe sandbox flags the engine sets:

| Block | Scripts | Best for |
|-------|---------|----------|
| `preview` | Off | HTML, CSS, layout lessons |
| `demo` | On | npm libraries, charts, interactive JS |

When you host from GitHub, both block types work the same as on localhost. You only need the right block type for the content.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>If an entry teaches a JS library and the live sample shows blank or broken output, check the block type first. HTML lessons get <code>preview</code>. Libraries get <code>demo</code>. Mixing them up is the usual culprit.</p>
</div>

## Pumpchart (pump performance curves)

Pump charts show the relationship between **flow rate** (x-axis) and **head pressure** (y-axis) for centrifugal pumps. A **state** is fixed by those two values. Optional extras include pump speed, input power, and efficiency.

### Pump curve and system curve

Pumpchart draws two quadratic curves on top of the axes:

**Pump performance curve** shows what the pump can deliver at a given speed. At zero flow, head is maximum. At maximum flow, head drops to zero. The docs express this as:

`P(q) = H_max × [1 - (q / Q_max)²]`

**System curve** shows head loss in the piping system as flow increases. Static head plus friction:

`S(q) = H_static + k_fric × q²`

For a **closed** system, the system curve passes through the origin (no flow, no loss). For an **open** system, it intercepts the y-axis at static head: the elevation the pump must overcome before any flow moves.

### Operation point

In steady state, the pump always operates **on the system curve**. Where the pump curve (at the current speed) crosses the system curve is the **operation point**.

You can move that point two ways:

1. **Change pump speed** (multiple speed settings or a VFD). This keeps efficiency high because the pump is doing what it was sized for.
2. **Throttle the system** (valve, restriction). This bends the system curve but wastes energy: same motor power, less flow.

Pumpchart can estimate speed from a plotted state if you do not provide it. If you provide power, it calculates output power and efficiency from head and flow.

### NPSHr (not drawn yet)

The docs note that **Net Positive Suction Head required (NPSHr)** is not shown on Pumpchart yet. It matters: if suction pressure drops below NPSHr, cavitation damages the pump and piping. Worth knowing when you size real equipment even if this chart does not plot it.

<details class="entry-fold">
<summary>Prompt an AI (Pumpchart)</summary>
<div class="fold-body">
<p>Give the model context before you ask it to write code:</p>
<ul>
<li>Package name: <code>psychart</code>, import <code>{ Pumpchart }</code></li>
<li>Your units: flow (gpm, m³/h), head (psi, ft, bar), speed (rpm)</li>
<li>Pump curve inputs: <code>maxFlow</code>, <code>maxHead</code></li>
<li>System curve inputs: <code>static</code> head, <code>friction</code> coefficient</li>
<li>Whether you need time-colored points (pass <code>timestamp</code> in plot options)</li>
</ul>
<p>Sample prompt: <em>"Using psychart Pumpchart, create a pump chart in ES modules. maxFlow 3000 gpm, maxHead 35 psi, static head 5, friction 2e-6. Plot 50 random operating points over one hour with timestamps. Use webpack or esm.sh."</em></p>
<p>Always ask it to cite the [Pump Curve example](https://npm.nicfv.com/documents/psychart.Examples_Pump_Curve.html) and verify that pump and system curves cross at exactly one point. The docs say initialization errors happen when curves cross zero or multiple times.</p>
</div>
</details>

<details class="entry-fold">
<summary>Build it yourself (Pumpchart)</summary>
<div class="fold-body">
<p><strong>Install</strong> (local project with webpack, matching the official example):</p>
<pre><code>npm init -y
npm pkg set type="module"
npm i psychart@1.0.0 webpack-cli</code></pre>
<p><strong>Minimal pattern:</strong></p>
<pre><code>import { Pumpchart } from "psychart";

const pumpchart = new Pumpchart();
document.body.append(pumpchart.getElement());
pumpchart.plot({ flow: 60, head: 40 });</code></pre>
<p><strong>Configured chart</strong> (curves, speeds, units) matches the live demo below. After editing source, run <code>npx webpack --mode development --watch</code> and open <code>index.html</code> in a browser.</p>
<p><strong>API surface:</strong> options go in <code>new Pumpchart({ ... })</code>. Each point is <code>pumpchart.plot({ flow, head, power? }, { timestamp?, name? })</code>. Tooltips appear on hover. Append with <code>pumpchart.getElement()</code>.</p>
</div>
</details>

### Live demo: configured pump curve

This runs the real library via [esm.sh](https://esm.sh/). Same pattern as a local webpack build, without the build step.

```demo Pumpchart with curves and timed points
<script type="module">
import { Pumpchart } from "https://esm.sh/psychart@1.0.0";

const pumpchart = new Pumpchart({
  curve: {
    pump: { maxFlow: 3000, maxHead: 35 },
    system: { static: 5, friction: 2e-6 },
  },
  speed: { max: 60, operation: 45, steps: [15, 30, 45] },
  units: { flow: "gpm", head: "psi", power: "kW", speed: "rpm" },
});

const now = Date.now();
const onehr = 60 * 60 * 1000;
for (let t = now; t < now + onehr; t += onehr / 30) {
  const flow = Math.random() * 2500;
  const head = Math.random() * 25;
  pumpchart.plot(
    { flow, head, power: flow * head / 2000 },
    { timestamp: t }
  );
}

document.body.append(pumpchart.getElement());
</script>
```

```demo Minimal Pumpchart (defaults)
<script type="module">
import { Pumpchart } from "https://esm.sh/psychart@1.0.0";

const pumpchart = new Pumpchart();
document.body.append(pumpchart.getElement());
pumpchart.plot({ flow: 60, head: 40 });
pumpchart.plot({ flow: 120, head: 30 }, { name: "Second point" });
</script>
```

## Psychart (psychrometric charts)

Psychrometric charts plot thermodynamic properties of moist air. ASHRAE adopts these for HVAC work. **Two properties fix a state**; everything else can be derived.

Default axes show four properties:

- **Dry bulb (db):** air temperature from a dry thermometer.
- **Wet bulb:** temperature of a wet surface evaporating into the air.
- **Dew point:** temperature where water condenses out.
- **Relative humidity:** vapor pressure vs saturation pressure (0 to 100%).

Advanced variables (vapor pressure, humidity ratio, enthalpy, specific volume, degree of saturation) appear when you enable them in data options.

Psychart supports US and SI units, altitude, graph bounds, ASHRAE comfort envelopes, time-series coloring, and multiple independent data series on one panel.

<details class="entry-fold">
<summary>Prompt an AI (Psychart)</summary>
<div class="fold-body">
<p>Tell the model which two measurements fix each state. Examples:</p>
<ul>
<li><code>{ db: 68, other: 55, measurement: 'dbwb' }</code> dry bulb + wet bulb</li>
<li>Dry bulb + dew point, or dry bulb + relative humidity</li>
</ul>
<p>Warn the model about constraints from the docs: wet bulb and dew point must be ≤ dry bulb. Relative humidity must be 0–1 (or 0–100% with the right measurement type). Bad inputs throw errors.</p>
<p>Sample prompt: <em>"Using psychart Psychart, plot two states: 68°F db / 55°F wb, and 75°F db / 50°F wb. US units. Label the second point 'Afternoon'."</em></p>
</div>
</details>

<details class="entry-fold">
<summary>Build it yourself (Psychart)</summary>
<div class="fold-body">
<pre><code>import { Psychart } from "psychart";

const psychart = new Psychart();
document.body.append(psychart.getElement());
psychart.plot({ db: 68, other: 55, measurement: "dbwb" });</code></pre>
<p>Configuration lives in <code>new Psychart({ unitSystem, dbMin, dbMax, ... })</code>. See the [Mollier Diagram example](https://npm.nicfv.com/documents/psychart.Examples_Mollier_Diagram.html) on npm.nicfv.com for SI layout with flipped axes.</p>
<p>Performance note from the docs: Psychart works best with modest data volumes (a few days of points). Large series slow the chart. Use the legend to hide series, or <code>Psychart.clearData()</code> to reset (that wipes everything, so save data elsewhere first).</p>
</div>
</details>

### Live demo: psychrometric points

```demo Psychart default chart
<script type="module">
import { Psychart } from "https://esm.sh/psychart@1.0.0";

const psychart = new Psychart();
document.body.append(psychart.getElement());
psychart.plot({ db: 68, other: 55, measurement: "dbwb" });
psychart.plot({ db: 75, other: 50, measurement: "dbwb" }, { name: "Afternoon" });
</script>
```

## Package facts (verified)

| Field | Value |
|-------|-------|
| npm package | `psychart` |
| Current version | 1.0.0 (published 2026-04-16 per npm) |
| License | BSD-3-Clause-LBNL |
| Repository | [github.com/nicfv/npm](https://github.com/nicfv/npm) |
| Author | Nicolas Ventura (npm@nicfv.com) |
| Dependencies | dimensional, psychrolib, smath, viridis |

Bug reports and feature requests go to the GitHub issues page linked from [npm.nicfv.com](https://npm.nicfv.com/index.html). Critical security issues: npm@nicfv.com per the site docs.

## Shared API pattern

Both chart classes work the same way at the surface:

1. `const chart = new ChartClass(options?)`
2. `chart.plot(state, dataOptions?)` for each point or series
3. `document.body.append(chart.getElement())` to mount the SVG/DOM output

Hover tooltips show detail on points and axis labels. Pumpchart estimates speed from flow and head when speed is omitted. Psychart accepts timestamps for gradient coloring across time.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>When you file future graph libraries in this archive, use <code>demo</code> blocks and load from a pinned CDN version (e.g. <code>psychart@1.0.0</code>). Pinning keeps the entry stable if the package updates. Link to the official docs for webpack setup when the library expects a build step.</p>
</div>

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Read the curves before you read the dots. On Pumpchart, the intersection of pump and system curves is the story. On Psychart, know which two measurements you used to fix each state before you trust derived values in the tooltip.</p>
</div>
