# The SillyTavern Field Manual

```json
{
  "id": "sillytavern-field-manual",
  "title": "The SillyTavern Field Manual",
  "category": "Structure",
  "tags": ["sillytavern", "world-info", "lorebooks", "ai", "roleplay", "openrouter", "character-cards", "prompts", "knowledge-management"],
  "summary": "SillyTavern is a local UI for LLM roleplay. This manual maps the cockpit: connections, character cards, World Info, presets, group chats, and how to stand up a campaign world without wasting tokens.",
  "library": "https://docs.sillytavern.app/",
  "intro": "SillyTavern is a free, local app that wraps around language models for character chat and roleplay. It does not write anything itself. You pick the model, define characters, load lore, and shape prompts. The model writes the prose. Learn which panel owns which job and the steep curve flattens fast.",
  "sources": [
    "https://docs.sillytavern.app/",
    "https://docs.sillytavern.app/usage/core-concepts/worldinfo/",
    "https://docs.sillytavern.app/usage/core-concepts/characterdesign/",
    "https://docs.sillytavern.app/usage/core-concepts/groupchats/",
    "https://www.reddit.com/r/SillyTavernAI/",
    "Operator field manual (sillytavern-field-manual.html)"
  ],
  "added": "2026-06-19 09:30 PT",
  "updated": "2026-06-19 09:30 PT",
  "verdict": "The model narrates. You own the cockpit. World Info is the craft: keywords in, lore at the right moment, tokens spared."
}
```

[SillyTavern](https://docs.sillytavern.app/) (ST) is a **locally installed interface** for text-generation LLMs, image engines, and TTS. It is open source, free, and built for power users who want every lever exposed. Since it is only a front end, you still need a **backend**: OpenRouter, OpenAI, a local Kobold/Ollama setup, or services like AI Horde.

This entry is the operator's field manual: the mental model, the top bar, character cards, World Info, presets, group chats, and a practical build order for a persistent campaign world.

## The mental model

SillyTavern looks like a cockpit because it is one. The model writes words. You control what reaches it before each reply. Almost everything in the app is one of four jobs:

| Job | What you manage |
|-----|-----------------|
| **Connection** | Which model writes. OpenRouter + DeepSeek, local Ollama, etc. |
| **Who** | Characters and your persona. The people in the scene. |
| **World** | Lorebooks (World Info). Facts injected only when relevant. |
| **How** | Presets and prompts. Voice, rules, tone. |

A fifth job, **real mechanics** (dice, HP, stats), lives in **extensions** on purpose. The model narrates; the math lives elsewhere so it cannot fudge numbers.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>ST chooses control over hand-holding. The official docs call the learning curve "part of the fun." Nothing is hidden. Every icon is a lever. Once you know which panel owns which job, setup is fast.</p>
</div>

```preview The four jobs (concept map)
<style>
  .st-flow { font-family: system-ui, sans-serif; background: #14161B; color: #ECE5D6;
    padding: 20px; border-radius: 12px; border: 1px solid rgba(236,229,214,.2); }
  .st-flow .row { display: flex; flex-wrap: wrap; align-items: stretch; gap: 8px; }
  .st-step { flex: 1 1 120px; background: #22262F; border: 1px solid rgba(236,229,214,.15);
    border-radius: 8px; padding: 12px; }
  .st-step .t { font-size: 10px; letter-spacing: .12em; color: #D6A84E; margin-bottom: 6px; }
  .st-step .d { font-size: 13px; color: #B6AF9F; line-height: 1.4; }
  .st-arrow { color: #D6A84E; display: flex; align-items: center; font-size: 18px; padding: 0 4px; }
</style>
<div class="st-flow">
  <div class="row">
    <div class="st-step"><div class="t">CONNECTION</div><div class="d">Which model writes the words.</div></div>
    <div class="st-arrow">›</div>
    <div class="st-step"><div class="t">WHO</div><div class="d">Characters and your persona.</div></div>
    <div class="st-arrow">›</div>
    <div class="st-step"><div class="t">WORLD</div><div class="d">Lorebooks, injected when relevant.</div></div>
    <div class="st-arrow">›</div>
    <div class="st-step"><div class="t">HOW</div><div class="d">Presets, prompts, tone rules.</div></div>
  </div>
</div>
```

## The top bar, decoded

The icon row across the top opens **drawers**. These are the panels you live in:

| Icon | Panel | Role |
|------|-------|------|
| **Plug** | API Connections | Model backends and keys |
| **Sliders** | AI Response Config | Presets, Prompt Manager (Chat Completion) |
| **Capital A** | Advanced Formatting | Prompt formatting for **Text Completion** local backends |
| **Globe** | World Info | Lorebooks |
| **Gear** | User Settings | App preferences |
| **Image** | Backgrounds | Scene backgrounds |
| **Puzzle** | Extensions | Add-ons (dice, TTS, images, etc.) |
| **ID badge** | Persona Management | Your player character |
| **Contacts** | Characters | Character cards and groups |

**Chat Completion vs Text Completion:** With cloud models (OpenRouter, OpenAI, Claude, DeepSeek), use **Chat Completion**. Presets live in the **sliders** panel. **Text Completion** is for local backends (KoboldCpp, Ollama, LM Studio). Formatting moves to the **A** panel.

The **magic wand** in the chat input bar is a separate Extensions quick-menu for in-chat actions, not the top-bar Extensions button.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Hover any icon for its tooltip. Icon art and left-to-right order shift between ST versions and themes. The <em>functions</em> above are what stay stable.</p>
</div>

## Connecting a model

Open the **plug** icon → API Connections.

1. Pick **Chat Completion** for cloud / OpenRouter.
2. Paste your API key.
3. Choose a model (e.g. DeepSeek).
4. Test with a plain "hello" before anything fancy.
5. Save as a **Connection Profile** so swapping models later is one click.

For local inference on your own GPU, use **Text Completion** and point at KoboldCpp, Ollama, or LM Studio.

## Characters and cards

Open **contacts** → **Create New Character** (or import a `.png` / `.json` card). A card is a bundle of text fields. The key distinction: **which fields are sent every turn vs once**.

### Sent every turn

| Field | Purpose |
|-------|---------|
| **Description** | Core identity: appearance, traits, background. Always in context. |
| **Personality** | Short trait summary. |
| **Scenario** | The situation right now. |
| **Character's Note** | Injected at fixed depth each turn (Advanced Definitions). |

### Sent once / fades

| Field | Purpose |
|-------|---------|
| **First Message** | Opening line. Sets POV, tense, length, and style for the whole chat. Spend effort here. |
| **Example Messages** | Teach voice by showing it. Precede each with `<START>`. Dropped when context fills (can be locked). |
| **Alt. Greetings** | Extra first-message swipes; groups pick one at random. |

Only **Name** is required. Behind **Advanced Definitions**: per-character Main Prompt override, **Post-History Instructions** (strongest steering, injected last before the reply), Talkativeness for groups, creator notes.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>The model imitates what it sees. If your First Message is tight third-person grimdark with actions in <em>italics</em>, that is what you keep getting. Write the First Message as the exact sample of the style you want.</p>
</div>

## Your persona

The **ID badge** icon opens Persona Management. This defines **you**, the player character. Whatever you name your persona becomes the `{{user}}` macro everywhere. For an open-world GM setup, keep it light: a name and a sentence or two.

## World Info and lorebooks

This is the heart of worldbuilding. A **lorebook** (World Info) is a **dynamic dictionary**: small entries tied to keywords. When a keyword appears in recent conversation, that entry's text is slipped into the prompt. The model knows about the Rusty Flagon the moment someone walks in, not a token sooner.

### How an entry fires

1. **Scan** — ST reads the last few messages (Scan Depth) for keywords.
2. **Match** — A key like "Rusty Flagon" appears; the entry activates.
3. **Inject** — The entry's Content is inserted at its Position.
4. **Know** — The model "remembers" that place for this reply.

### Fields that matter

| Field | What it does |
|-------|----------------|
| **Keys** | Trigger words. Enter after each. Not case-sensitive by default; comma = OR. |
| **Content** | The only text injected. Keys and titles are not sent. Write standalone snippets. |
| **Status** | Constant = always inserted. Normal = when a key appears. Vectorized = semantic match (needs Vector Storage extension). |
| **Secondary Keys + Logic** | AND ANY, AND ALL, NOT ANY, NOT ALL for precise conditions. |
| **Insertion Order** | When several fire, lower order = closer to the reply = stronger pull. |
| **Position** | Where it lands. "In-chat @depth" is strongest. |
| **Probability** | % chance when triggered. 30 for a random ambush; 1 to occasionally wake something ancient. |
| **Recursion** | A fired entry's text can trigger other entries (faction entry mentions a city → city entry fires). |

**Token budget:** Triggered entries share a budget (auto ~20% of context if left at 0). Too many fires and only highest-priority entries make it. That is why World Info beats stuffing the card: only **relevant** lore spends tokens each turn.

### Where a book lives

A lorebook can be **Global** (every chat), bound to a **Character**, **Persona**, or single **Chat**. Character and global books combine at generation. For a shared campaign world: one **global** book so every NPC draws the same canon, plus tiny character-specific books for private knowledge.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Keyword entries for places, factions, and named NPCs. A few <strong>Constant</strong> entries for world tone, magic rules, and GM standing instructions. Let recursion wire them. Concise, standalone, interlinked.</p>
</div>

## Group chats

For multi-NPC scenes: Characters panel → create a group → add members.

- **Reply order** — Natural (talkativeness-weighted), List, Manual, or Pooled/random.
- **Talkativeness** — Shy → Chatty slider in Advanced Definitions. Default 50%.
- **Mute / Solo** — Speech-bubble icon silences a character or forces only them to answer.
- **Auto-mode** — NPCs talk among themselves without you typing each turn.
- **Per-character lore** — Character/tag filters so secrets stay with the right NPC.

## Presets and the prompt stack

The **sliders** panel (AI Response Configuration) holds presets. For Chat Completion, the **Prompt Manager** is an ordered, toggleable list. Top to bottom is roughly what the model receives:

```preview Prompt stack (top to bottom)
<style>
  .st-layers { font-family: system-ui, sans-serif; background: #14161B; color: #ECE5D6;
    padding: 16px; border-radius: 12px; border: 1px solid rgba(236,229,214,.2); }
  .st-layer { display: flex; gap: 12px; align-items: center; background: #22262F;
    border: 1px solid rgba(236,229,214,.15); border-radius: 8px; padding: 10px 14px; margin-bottom: 7px; font-size: 14px; }
  .st-layer.hot { border-color: #D6A84E; background: rgba(214,168,78,.07); }
  .st-layer .nm { font-weight: 700; min-width: 160px; color: #ECE5D6; }
  .st-layer.hot .nm { color: #D6A84E; }
  .st-layer .ds { color: #B6AF9F; font-size: 13px; line-height: 1.4; }
</style>
<div class="st-layers">
  <div class="st-layer hot"><span class="nm">Main / System Prompt</span><span class="ds">Overall instruction and tone rules.</span></div>
  <div class="st-layer"><span class="nm">World Info (before)</span><span class="ds">Constant lore and early-position entries.</span></div>
  <div class="st-layer"><span class="nm">Persona + Character</span><span class="ds">You, then Description / Personality / Scenario.</span></div>
  <div class="st-layer"><span class="nm">Example Messages</span><span class="ds">Voice samples until context fills.</span></div>
  <div class="st-layer"><span class="nm">Chat History</span><span class="ds">Conversation so far, with at-depth lore woven in.</span></div>
  <div class="st-layer hot"><span class="nm">Post-History Instructions</span><span class="ds">Last word before the reply. Strongest steering.</span></div>
</div>
```

The **Main Prompt** sets the frame. **Post-History Instructions** get the final say. **Author's Note** is bonus injection at any depth for scene steering.

On samplers: a minimal stack of **Min P + Temperature** (plus optional repetition penalty) is the modern recommendation. Import community presets from the Import button at the top of the panel.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>If you edit a prompt block, click Save on the block <em>and</em> Save at the top of the panel. Skip either and your edit vanishes when you switch presets.</p>
</div>

## Running a scene

| Control | What it does |
|---------|----------------|
| **Swipe** | Fresh take on the latest reply without losing your place. |
| **Edit** | Pencil on any message. Fix or steer the AI's words directly. |
| **Regenerate** | Redo the last reply from scratch. |
| **Branch / checkpoint** | Bookmark a moment; spin off an alternate timeline. |
| **OOC** | Out of character with brackets: `[OOC: dial up the menace here.]` |
| **Prompt itemization** | Icon on a reply shows the exact prompt sent. Debug lore that will not trigger. |

## Standing up a campaign world (build order)

A practical assembly path:

1. **Connection profile** — Everyday narrator model over OpenRouter; keep alternates (faster cloud model, local model) as extra profiles.
2. **The GM card** — Blank Game Master narrator. Standing behavior in Description; hard rules ("never speak for `{{user}}`", "keep the world dangerous") in Post-History Instructions.
3. **Your persona** — Light sketch so the GM has someone to address.
4. **The global lorebook** — Keyword entry per location, faction, and major NPC; 2–3 Constant entries for world tone, magic rules, and how the GM handles dice/stats. Bind to the GM card.
5. **The RP preset** — Import a community preset; bake tone rules into Main Prompt and Post-History Instructions.
6. **Later** — Group chat for NPCs with per-character lore filters; RPG Companion extension for real dice and HP outside the text.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>Confirm a plain chat works first. Then add <em>one</em> thing: a lorebook entry, a preset, a persona. Watch what changes. Stack everything at once and you will not know which lever moved the world.</p>
</div>

<details class="entry-fold">
<summary>Prompt an AI (SillyTavern setup)</summary>
<div class="fold-body">
<p>Give the model this context:</p>
<ul>
<li>Backend: Chat Completion via OpenRouter (or local Text Completion)</li>
<li>Campaign type: GM narrator + player persona + keyword lorebook</li>
<li>Which panels you are configuring (plug, contacts, globe, sliders)</li>
<li>Whether you need group chat or extensions for dice</li>
</ul>
<p>Sample prompt: <em>"I use SillyTavern with OpenRouter and DeepSeek. Help me structure a global World Info book for a fantasy city: keyword entries for three locations, one faction, constant entries for magic rules and GM tone. List the fields I should fill per entry and where Post-History Instructions should go on the GM card."</em></p>
<p>Point it at <a href="https://docs.sillytavern.app/usage/core-concepts/worldinfo/">World Info docs</a> and <a href="https://docs.sillytavern.app/usage/core-concepts/characterdesign/">Character Design</a> for canon behavior.</p>
</div>
</details>

<details class="entry-fold">
<summary>Build it yourself (first session checklist)</summary>
<div class="fold-body">
<ol>
<li>Install SillyTavern from <a href="https://docs.sillytavern.app/">official docs</a> (release branch for stability).</li>
<li>Plug icon → Chat Completion → your API → test "hello".</li>
<li>Contacts → create or import one character. Write First Message in the style you want.</li>
<li>ID badge → light persona (name + one line).</li>
<li>Globe → one lorebook → one Normal entry with a keyword and tight Content. Chat the keyword and use prompt itemization to confirm it fired.</li>
<li>Sliders → note Main Prompt and Post-History Instructions. Save both levels when you edit.</li>
</ol>
<p>Community: <a href="https://www.reddit.com/r/SillyTavernAI/">r/SillyTavernAI</a>. Docs target roughly v1.13–1.17; labels and icons shift between releases. Functions and worldbuilding logic hold steady.</p>
</div>
</details>

## Live demo: keyword lore trigger (concept)

This is not SillyTavern itself. It shows how World Info scanning works: recent text is checked for a keyword, and matching lore appears in an "injected context" panel.

```demo World Info keyword scan (concept)
<div id="wi-demo" style="font-family:system-ui,sans-serif;background:#14161B;color:#ECE5D6;padding:16px;border-radius:12px;max-width:420px;">
  <label style="display:block;font-size:12px;color:#D6A84E;margin-bottom:6px;">Recent chat (type a keyword)</label>
  <textarea id="wi-input" rows="3" style="width:100%;background:#22262F;border:1px solid rgba(236,229,214,.2);color:#ECE5D6;color-scheme:dark;border-radius:8px;padding:10px;font:inherit;font-size:14px;">We walk into the Rusty Flagon tavern.</textarea>
  <div id="wi-out" style="margin-top:12px;padding:12px;background:rgba(214,168,78,.08);border-left:3px solid #D6A84E;border-radius:0 8px 8px 0;font-size:13px;color:#B6AF9F;min-height:48px;">
    <strong style="color:#D6A84E;display:block;font-size:11px;letter-spacing:.1em;margin-bottom:6px;">INJECTED LORE</strong>
    <span id="wi-lore">Waiting for keyword match…</span>
  </div>
</div>
<script>
var LORE = {
  "rusty flagon": "The Rusty Flagon: a dockside tavern known for cheap ale, hired blades, and rumors that never stay quiet.",
  "silver order": "The Silver Order: knights who swear oaths at dawn and break fewer than you'd expect."
};
function scan() {
  var text = document.getElementById("wi-input").value.toLowerCase();
  var hit = null;
  Object.keys(LORE).forEach(function(k) {
    if (text.indexOf(k) !== -1) hit = LORE[k];
  });
  document.getElementById("wi-lore").textContent = hit || "No entry fired. Try \"Rusty Flagon\" or \"Silver Order\".";
}
document.getElementById("wi-input").addEventListener("input", scan);
scan();
</script>
```

*Demo block: teaches World Info keyword injection. Preview blocks above map the four jobs and prompt stack. A full ST session runs locally, not in the archive sandbox.*
