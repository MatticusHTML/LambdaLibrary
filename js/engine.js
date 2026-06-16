/* ============================================================
   Lambda // Index  —  engine
   Reads data/manifest.md, then each data/entries/<slug>.md.
   Derives the index, search, categories, counts. Nothing about
   the library is hardcoded here. Add a file, register the slug,
   and this picks it up. fetch() means this must be served, not
   opened with file://.
   ============================================================ */

const STATE = { entries: [], byId: {}, category: "All", query: "" };

const $ = (sel) => document.querySelector(sel);

/* ---------- boot ---------- */
async function boot(){
  try{
    const manifest = parseJsonBlock(await fetchText("data/manifest.md"));
    const slugs = Array.isArray(manifest.entries) ? manifest.entries : [];
    const loaded = await Promise.all(slugs.map(loadEntry));
    STATE.entries = loaded.filter(Boolean);
    STATE.entries.forEach((e) => { STATE.byId[e.id] = e; });
    STATE.log = await loadLog();
    $("#entry-count").textContent = STATE.entries.length + (STATE.entries.length === 1 ? " entry" : " entries");
    runGreeting();
    renderChips();
    route();
    window.addEventListener("hashchange", route);
  }catch(err){
    const box = $("#boot-error");
    box.hidden = false;
    box.textContent = "Lambda could not open the archive. " + err.message + " If you opened this as a local file, it needs to be served. Use GitHub Pages or a local static server.";
  }
}

async function fetchText(path){
  const res = await fetch(path, { cache: "no-store" });
  if(!res.ok) throw new Error("Missing " + path + " (" + res.status + ").");
  return res.text();
}

function parseJsonBlock(md){
  const m = md.match(/```json\s*([\s\S]*?)```/);
  if(!m) throw new Error("No json block found.");
  return JSON.parse(m[1].trim());
}

async function loadEntry(slug){
  try{
    const raw = await fetchText("data/entries/" + slug + ".md");
    const meta = parseJsonBlock(raw);
    const after = raw.slice(raw.indexOf("```", raw.indexOf("```json") + 7) + 3);
    meta.body = after.trim();
    meta.id = meta.id || slug;
    meta.tags = meta.tags || [];
    meta.sources = meta.sources || [];
    return meta;
  }catch(err){
    console.warn("Skipped entry " + slug + ": " + err.message);
    return null;
  }
}

async function loadLog(){
  try{
    const data = parseJsonBlock(await fetchText("data/log.md"));
    return Array.isArray(data.sessions) ? data.sessions : [];
  }catch(err){
    console.warn("No session log loaded: " + err.message);
    return [];
  }
}

/* ---------- greeting (typed, once) ---------- */
function runGreeting(){
  const el = $("#greeting");
  const line = "Lambda. " + STATE.entries.length + " entries on file. What do you need?";
  if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    el.textContent = line; return;
  }
  let i = 0;
  el.innerHTML = "<span class='cursor'>_</span>";
  const tick = () => {
    if(i <= line.length){
      el.innerHTML = line.slice(0, i) + "<span class='cursor'>_</span>";
      i++; setTimeout(tick, 26);
    }else{
      el.textContent = line;
    }
  };
  tick();
}

/* ---------- categories ---------- */
function categories(){
  const counts = {};
  STATE.entries.forEach((e) => { counts[e.category] = (counts[e.category] || 0) + 1; });
  return Object.keys(counts).sort().map((c) => ({ name: c, n: counts[c] }));
}

function renderChips(){
  const wrap = $("#chips");
  wrap.innerHTML = "";
  const all = document.createElement("button");
  all.className = "chip" + (STATE.category === "All" ? " on" : "");
  all.innerHTML = "All <span class='n'>" + STATE.entries.length + "</span>";
  all.onclick = () => { STATE.category = "All"; renderChips(); renderGrid(); };
  wrap.appendChild(all);
  categories().forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip" + (STATE.category === c.name ? " on" : "");
    b.innerHTML = esc(c.name) + " <span class='n'>" + c.n + "</span>";
    b.onclick = () => { STATE.category = c.name; renderChips(); renderGrid(); };
    wrap.appendChild(b);
  });
}

/* ---------- index grid ---------- */
function renderGrid(){
  const grid = $("#grid");
  const q = STATE.query;
  const list = STATE.entries.filter((e) => {
    const inCat = STATE.category === "All" || e.category === STATE.category;
    const hay = (e.title + " " + e.summary + " " + e.category + " " + e.tags.join(" ")).toLowerCase();
    return inCat && (q === "" || hay.includes(q));
  });
  grid.innerHTML = "";
  if(!list.length){
    grid.innerHTML = "<div class='empty'>Nothing matches. The archive does not pretend otherwise.</div>";
    return;
  }
  list.forEach((e) => {
    const card = document.createElement("button");
    card.className = "card";
    card.innerHTML =
      "<div class='card-meta'><span class='cat'>" + esc(e.category) + "</span>" +
        (e.tool ? "<span class='card-tool'>Tool</span>" : "") +
        "<span>" + esc(dateOnly(e.added)) + "</span></div>" +
      "<div class='card-title'>" + esc(e.title) + "</div>" +
      "<div class='card-summary'>" + esc(e.summary) + "</div>" +
      (e.verdict ? "<div class='card-verdict'>" + esc(e.verdict) + "</div>" : "");
    card.onclick = () => { location.hash = "#/e/" + e.id; };
    grid.appendChild(card);
  });
}

/* ---------- routing ---------- */
function setView(visibleId){
  ["index-view", "reader-view", "tool-view", "log-view"].forEach((id) => {
    document.getElementById(id).hidden = (id !== visibleId);
  });
  document.body.classList.toggle("tool-active", visibleId === "tool-view");
}

function route(){
  const hash = location.hash || "#/";
  if(hash === "#/log"){ return showLog(); }
  const m = hash.match(/^#\/e\/(.+)$/);
  if(m && STATE.byId[m[1]]){
    const entry = STATE.byId[m[1]];
    if(entry.tool && entry.toolSrc){ showTool(entry); }
    else { showReader(entry); }
  }else{
    showIndex();
  }
}

function showIndex(){
  setView("index-view");
  renderGrid();
  window.scrollTo(0, 0);
}

function showLog(){
  setView("log-view");
  renderLog();
  window.scrollTo(0, 0);
}

function renderLog(){
  const view = $("#log-view");
  const sessions = STATE.log || [];
  let html =
    "<button class='reader-back'>&larr; Back to index</button>" +
    "<h1 class='reader-title'>Session log</h1>" +
    "<p class='log-intro'>Where we left off, newest first. Each entry is a goodnight.</p>";
  if(!sessions.length){
    html += "<div class='empty'>No sessions logged yet. Say goodnight to file the first.</div>";
  }else{
    html += "<div class='log-list'>";
    sessions.forEach((s) => {
      html += "<div class='log-item'>" +
        "<div class='log-date'>" + esc(s.date || "") + "</div>" +
        (s.title ? "<div class='log-title'>" + esc(s.title) + "</div>" : "") +
        (s.summary ? "<p class='log-summary'>" + esc(s.summary) + "</p>" : "") +
        (s.did && s.did.length ? "<div class='log-sub'>Done</div><ul class='log-ul'>" + s.did.map((d) => "<li>" + esc(d) + "</li>").join("") + "</ul>" : "") +
        (s.next && s.next.length ? "<div class='log-sub'>Next</div><ul class='log-ul log-next'>" + s.next.map((n) => "<li>" + esc(n) + "</li>").join("") + "</ul>" : "") +
        "</div>";
    });
    html += "</div>";
  }
  view.innerHTML = html;
  view.querySelector(".reader-back").onclick = () => { location.hash = "#/"; };
}

function showTool(e){
  setView("tool-view");
  const view = $("#tool-view");
  view.innerHTML =
    "<div class='tool-bar'>" +
      "<button type='button' class='reader-back tool-back'>&larr; Index</button>" +
      "<span class='tool-title'>" + esc(e.title) + "</span>" +
      "<a class='tool-side' href='#/e/css-colors'>CSS formats</a>" +
    "</div>" +
    "<iframe class='tool-frame' src='" + esc(e.toolSrc) + "' title='" + esc(e.title) + "'></iframe>";
  view.querySelector(".tool-back").onclick = () => { location.hash = "#/"; };
  window.scrollTo(0, 0);
}

function showReader(e){
  setView("reader-view");
  const view = $("#reader-view");
  view.innerHTML =
    "<button class='reader-back'>&larr; Back to index</button>" +
    (e.header ? "<div class='reader-hero'><img src='" + esc(e.header) + "' alt='' /></div>" : "") +
    "<div class='reader-meta'><span class='cat'>" + esc(e.category) + "</span> &middot; filed " + esc(e.added || "") + (e.updated && e.updated !== e.added ? " &middot; updated " + esc(e.updated) : "") + "</div>" +
    "<h1 class='reader-title'>" + esc(e.title) + "</h1>" +
    (e.library ? "<a class='reader-library' href='" + esc(e.library) + "' target='_blank' rel='noopener'>Library <span class='lib-url'>" + esc(libraryLabel(e.library)) + "</span></a>" : "") +
    (e.intro ? "<p class='reader-intro'>" + esc(e.intro) + "</p>" : "") +
    (e.tags.length ? "<div class='reader-tags'>" + e.tags.map((t) => "<span class='tag'>" + esc(t) + "</span>").join("") + "</div>" : "") +
    "<div class='doc'>" + renderBody(e.body) + "</div>" +
    "<div class='reader-foot'>" +
      (e.sources.length ? "<div class='sources'><h4>Sources</h4><ul>" + e.sources.map((s) => "<li>" + linkify(s) + "</li>").join("") + "</ul></div>" : "") +
      (e.verdict ? "<div class='verdict-block'><div class='label'>Lambda's verdict</div><div class='verdict'>" + esc(e.verdict) + "</div></div>" : "") +
    "</div>";
  view.querySelector(".reader-back").onclick = () => { location.hash = "#/"; };
  window.scrollTo(0, 0);
}

/* ---------- markdown + live previews + demos ---------- */
function renderBody(md){
  const previews = [];
  const demos = [];
  let stripped = md.replace(/```demo([^\n]*)\n([\s\S]*?)```/g, (_, title, code) => {
    const idx = demos.length;
    demos.push({ title: title.trim() || "Demo", code: code.replace(/\s+$/, "") });
    return "\n\n@@DEMO" + idx + "@@\n\n";
  });
  stripped = stripped.replace(/```preview([^\n]*)\n([\s\S]*?)```/g, (_, title, code) => {
    const idx = previews.length;
    previews.push({ title: title.trim() || "Preview", code: code.replace(/\s+$/, "") });
    return "\n\n@@PREVIEW" + idx + "@@\n\n";
  });
  let html = (window.marked && window.marked.parse) ? window.marked.parse(stripped) : ("<pre>" + esc(stripped) + "</pre>");
  previews.forEach((p, i) => {
    const token = "@@PREVIEW" + i + "@@";
    html = html.replace("<p>" + token + "</p>", previewHtml(p)).replace(token, previewHtml(p));
  });
  demos.forEach((d, i) => {
    const token = "@@DEMO" + i + "@@";
    html = html.replace("<p>" + token + "</p>", demoHtml(d)).replace(token, demoHtml(d));
  });
  return html;
}

function previewHtml(p){
  return "<div class='preview'>" +
    "<div class='preview-head'><span class='dot'></span>" + esc(p.title) + "</div>" +
    "<div class='preview-body'>" +
      "<pre class='preview-code'><code>" + esc(p.code) + "</code></pre>" +
      "<div class='preview-render'><iframe sandbox srcdoc=\"" + attr(p.code) + "\" title=\"" + esc(p.title) + " live preview\"></iframe></div>" +
    "</div>" +
    "<div class='preview-label'>Live result. HTML and CSS only. Scripts are sandboxed off.</div>" +
  "</div>";
}

function demoSrcdoc(code){
  const trimmed = code.trim();
  if(/^<!DOCTYPE/i.test(trimmed) || /^<html/i.test(trimmed)) return trimmed;
  return "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>html,body{margin:0;padding:0;background:#fff;overflow:hidden}</style></head><body>" + trimmed + "</body></html>";
}

function demoHtml(d){
  return "<div class='demo'>" +
    "<div class='demo-head'><span class='dot'></span>" + esc(d.title) + "</div>" +
    "<div class='demo-body'>" +
      "<pre class='demo-code'><code>" + esc(d.code) + "</code></pre>" +
      "<div class='demo-render'><iframe sandbox=\"allow-scripts allow-same-origin\" srcdoc=\"" + attr(demoSrcdoc(d.code)) + "\" title=\"" + esc(d.title) + " live demo\"></iframe></div>" +
    "</div>" +
    "<div class='demo-label'>Live demo. JavaScript enabled for library charts and interactive samples.</div>" +
  "</div>";
}

/* ---------- helpers ---------- */
function esc(s){ return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function attr(s){ return esc(s).replace(/"/g,"&quot;"); }
function dateOnly(s){ return s ? String(s).split(" ")[0] : ""; }
function linkify(s){
  const m = String(s).match(/^(https?:\/\/\S+)$/);
  return m ? "<a href='" + esc(m[1]) + "' target='_blank' rel='noopener'>" + esc(m[1]) + "</a>" : esc(s);
}
function libraryLabel(url){
  try{
    const u = new URL(url);
    return u.hostname + u.pathname.replace(/\/$/, "");
  }catch(_){
    return url;
  }
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", () => { if(window.marked) boot(); else setTimeout(boot, 60); });
}else{
  if(window.marked) boot(); else setTimeout(boot, 60);
}
