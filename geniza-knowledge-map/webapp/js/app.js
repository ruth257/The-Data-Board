// Geniza Knowledge Map — milestone 1 prototype.
// No backend, no build step: fetches the pre-built ./data/graph.json and
// renders progressive-disclosure exploration with Cytoscape.js.
"use strict";

const state = {
  nodesById: new Map(),
  edgesById: new Map(),
  adjacency: new Map(), // nodeId -> [edgeId,...]
  trail: [],            // [{id, label}]
  currentId: null,
  cy: null,
  log: [],
  flagged: [],
  sessionId: null,
};

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function nodeLabel(node) {
  if (node.type === "document") return node.shelfmark || `Document ${node.id.replace("document:", "")}`;
  if (node.type === "place") return node.name;
  if (node.type === "publication") return (node.citation || node.id).slice(0, 60);
  return node.id;
}

function nodeSearchText(node) {
  if (node.type === "document") {
    return [node.shelfmark, node.description, node.doc_type, ...(node.languages || []), ...(node.tags || [])].join(" ");
  }
  if (node.type === "place") return node.name;
  if (node.type === "publication") return node.citation || "";
  return "";
}

// ---------- persistence (local only, no personal data) ----------

function loadPersisted() {
  state.sessionId = sessionStorage.getItem("gkm_session_id") || uuid();
  sessionStorage.setItem("gkm_session_id", state.sessionId);
  try {
    state.log = JSON.parse(localStorage.getItem("gkm_log") || "[]");
    state.flagged = JSON.parse(localStorage.getItem("gkm_flagged") || "[]");
  } catch (e) {
    state.log = [];
    state.flagged = [];
  }
}

function persistLog() {
  localStorage.setItem("gkm_log", JSON.stringify(state.log));
}
function persistFlagged() {
  localStorage.setItem("gkm_flagged", JSON.stringify(state.flagged));
}

function logAction(action, { sourceNode = null, targetNode = null, edgeType = null } = {}) {
  const entry = {
    session_id: state.sessionId,
    timestamp: new Date().toISOString(),
    starting_document: state.trail.length ? state.trail[0].id : null,
    action,
    source_node: sourceNode,
    target_node: targetNode,
    edge_type: edgeType,
    view: "document",
    path_length: state.trail.length,
  };
  state.log.push(entry);
  persistLog();
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- data loading ----------

async function loadGraph() {
  const res = await fetch("data/graph.json");
  const graph = await res.json();
  for (const n of graph.nodes) state.nodesById.set(n.id, n);
  for (const e of graph.edges) {
    state.edgesById.set(e.id, e);
    if (!state.adjacency.has(e.source)) state.adjacency.set(e.source, []);
    if (!state.adjacency.has(e.target)) state.adjacency.set(e.target, []);
    state.adjacency.get(e.source).push(e.id);
    state.adjacency.get(e.target).push(e.id);
  }
}

// ---------- cytoscape ----------

function initCy() {
  state.cy = cytoscape({
    container: document.getElementById("cy"),
    style: [
      {
        selector: "node",
        style: {
          label: "data(label)",
          "font-size": 9,
          "text-wrap": "ellipsis",
          "text-max-width": "90px",
          color: "#1a1a18",
          "text-valign": "bottom",
          "text-margin-y": 4,
        },
      },
      { selector: "node[kind='document']", style: { "background-color": "#3a5a78", shape: "round-rectangle", width: 22, height: 22 } },
      { selector: "node[kind='place']", style: { "background-color": "#4a7a5a", shape: "triangle", width: 20, height: 20 } },
      { selector: "node[kind='publication']", style: { "background-color": "#8a5a2a", shape: "diamond", width: 20, height: 20 } },
      { selector: "node.current", style: { "border-width": 3, "border-color": "#2a5a8a", "border-style": "solid" } },
      { selector: "node.in-trail", style: { "border-width": 2, "border-color": "#7a4b2a" } },
      {
        selector: "edge",
        style: {
          width: 1.5,
          "line-color": "#b9b6ab",
          "target-arrow-shape": "none",
          "curve-style": "bezier",
          opacity: 0.85,
        },
      },
      { selector: "edge[kind='associated_with_place']", style: { "line-color": "#4a7a5a" } },
      { selector: "edge[kind='cited_by_publication']", style: { "line-color": "#8a5a2a" } },
      { selector: "edge[kind='shares_fragment']", style: { "line-color": "#2a5a8a", width: 2.5 } },
    ],
    layout: { name: "grid" },
  });

  state.cy.on("tap", "node", (evt) => {
    const id = evt.target.id();
    selectNode(id, { pushTrail: true, log: true });
  });
  state.cy.on("tap", "edge", (evt) => {
    showEvidence(evt.target.data("edgeId"));
  });
}

function ensureNodeInGraph(nodeId) {
  if (state.cy.getElementById(nodeId).length) return;
  const node = state.nodesById.get(nodeId);
  state.cy.add({ data: { id: nodeId, label: nodeLabel(node), kind: node.type } });
}

function ensureEdgeInGraph(edgeId) {
  if (state.cy.getElementById(edgeId).length) return;
  const edge = state.edgesById.get(edgeId);
  ensureNodeInGraph(edge.source);
  ensureNodeInGraph(edge.target);
  state.cy.add({ data: { id: edgeId, source: edge.source, target: edge.target, kind: edge.type, edgeId } });
}

function relayout(rootId) {
  const layout = state.cy.layout({
    name: "breadthfirst",
    roots: rootId ? [rootId] : undefined,
    directed: false,
    spacingFactor: 1.15,
    animate: true,
    animationDuration: 300,
  });
  layout.run();
}

function highlightCurrent() {
  state.cy.nodes().removeClass("current in-trail");
  const trailIds = new Set(state.trail.map((t) => t.id));
  state.cy.nodes().forEach((n) => {
    if (trailIds.has(n.id())) n.addClass("in-trail");
  });
  if (state.currentId) {
    const el = state.cy.getElementById(state.currentId);
    if (el.length) el.addClass("current");
  }
}

// ---------- selection / trail / expansion ----------

function selectNode(nodeId, { pushTrail, log }) {
  const node = state.nodesById.get(nodeId);
  if (!node) return;
  ensureNodeInGraph(nodeId);

  const previousId = state.currentId;
  state.currentId = nodeId;

  if (pushTrail) {
    const already = state.trail.findIndex((t) => t.id === nodeId);
    if (already >= 0) {
      state.trail = state.trail.slice(0, already + 1); // clicking a trail node truncates (go backward)
    } else {
      state.trail.push({ id: nodeId, label: nodeLabel(node) });
    }
  }

  if (log) {
    logAction(previousId ? "navigate" : "start", {
      sourceNode: previousId,
      targetNode: nodeId,
    });
  }

  renderTrail();
  renderDetails(node);
  highlightCurrent();
  relayout(nodeId);
}

function expandCurrent() {
  if (!state.currentId) return;
  const edgeIds = state.adjacency.get(state.currentId) || [];
  for (const eid of edgeIds) ensureEdgeInGraph(eid);
  highlightCurrent();
  relayout(state.currentId);
  logAction("expand", { sourceNode: state.currentId });
  renderDetails(state.nodesById.get(state.currentId)); // refresh connection list
  document.getElementById("viz-hint").textContent =
    edgeIds.length === 0
      ? "No source-established relationships for this node in the sampled graph (a real, honest gap — not every node connects to something)."
      : "Click any connected node to make it the new focus. Click an edge for its evidence.";
}

function renderTrail() {
  const ol = document.getElementById("trail");
  ol.innerHTML = "";
  if (!state.trail.length) {
    ol.innerHTML = '<li class="trail-empty">Search for a document to begin.</li>';
    return;
  }
  state.trail.forEach((step, i) => {
    const li = document.createElement("li");
    li.textContent = step.label;
    if (step.id === state.currentId) li.classList.add("current");
    li.addEventListener("click", () => selectNode(step.id, { pushTrail: true, log: true }));
    ol.appendChild(li);
  });
}

function fieldRow(dt, dd) {
  if (dd === null || dd === undefined || dd === "") return "";
  return `<dt>${dt}</dt><dd>${dd}</dd>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderDetails(node) {
  const container = document.getElementById("node-details");
  let html = `<span class="node-type-tag ${node.type}">${node.type}</span>`;

  if (node.type === "document") {
    html += `<dl>`;
    html += fieldRow("PGP ID", escapeHtml(node.id.replace("document:", "")));
    html += fieldRow("Shelfmark", escapeHtml(node.shelfmark));
    html += fieldRow("Document type", escapeHtml(node.doc_type || ""));
    html += fieldRow("Date", escapeHtml(node.date_display || ""));
    html += fieldRow("Languages", escapeHtml((node.languages || []).join(", ")));
    html += fieldRow("Library / collection", escapeHtml([node.library, node.collection].filter(Boolean).join(" / ")));
    html += fieldRow("Description", escapeHtml((node.description || "").slice(0, 400)) + ((node.description || "").length > 400 ? "…" : ""));
    html += fieldRow("Tags", escapeHtml((node.tags || []).join(", ")));
    html += fieldRow("PGP record", node.url ? `<a href="${escapeHtml(node.url)}" target="_blank" rel="noopener">${escapeHtml(node.url)}</a>` : "");
    html += `</dl>`;
  } else if (node.type === "place") {
    html += `<dl>`;
    html += fieldRow("Name", escapeHtml(node.name));
    html += fieldRow("Coordinates", escapeHtml(node.coordinates || ""));
    html += fieldRow("Region?", node.is_region ? "Yes" : "No");
    html += fieldRow("PGP record", node.url ? `<a href="${escapeHtml(node.url)}" target="_blank" rel="noopener">${escapeHtml(node.url)}</a>` : "");
    html += `</dl>`;
  } else if (node.type === "publication") {
    html += `<dl>`;
    html += fieldRow("Citation", escapeHtml(node.citation || ""));
    html += fieldRow("Type", escapeHtml(node.source_type || ""));
    html += fieldRow("Year", escapeHtml(node.year || ""));
    html += fieldRow("Link", node.url ? `<a href="${escapeHtml(node.url)}" target="_blank" rel="noopener">${escapeHtml(node.url)}</a>` : "");
    html += `</dl>`;
  }

  const edgeIds = state.adjacency.get(node.id) || [];
  html += `<button class="expand-btn" id="expand-btn" type="button">Expand relationships (${edgeIds.length})</button>`;
  if (edgeIds.length) {
    html += `<ul class="edge-list">`;
    for (const eid of edgeIds) {
      const e = state.edgesById.get(eid);
      const otherId = e.source === node.id ? e.target : e.source;
      const other = state.nodesById.get(otherId);
      html += `<li>${escapeHtml(e.type)} → <a href="#" data-nav="${otherId}">${escapeHtml(nodeLabel(other))}</a>
        <button class="why" data-why="${eid}" type="button">Why?</button></li>`;
    }
    html += `</ul>`;
  }
  html += `<button class="flag-btn" id="flag-btn" type="button">Flag as interesting</button>`;

  container.innerHTML = html;

  document.getElementById("expand-btn").addEventListener("click", expandCurrent);
  document.getElementById("flag-btn").addEventListener("click", flagCurrent);
  container.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (evt) => {
      evt.preventDefault();
      const targetId = evt.target.getAttribute("data-nav");
      ensureNodeInGraph(targetId);
      const edgeIds2 = state.adjacency.get(node.id) || [];
      for (const eid of edgeIds2) {
        const e = state.edgesById.get(eid);
        if (e.source === targetId || e.target === targetId) ensureEdgeInGraph(eid);
      }
      selectNode(targetId, { pushTrail: true, log: true });
    });
  });
  container.querySelectorAll("[data-why]").forEach((el) => {
    el.addEventListener("click", () => showEvidence(el.getAttribute("data-why")));
  });
}

function showEvidence(edgeId) {
  const e = state.edgesById.get(edgeId);
  if (!e) return;
  document.getElementById("evidence-title").textContent = `Why am I seeing this? (${e.type})`;
  document.getElementById("evidence-body").textContent = e.evidence;
  document.getElementById("evidence-popover").hidden = false;
}

function flagCurrent() {
  if (!state.currentId) return;
  state.flagged.push({
    starting_node: state.trail.length ? state.trail[0].id : state.currentId,
    current_node: state.currentId,
    exploration_path: state.trail.map((t) => t.id),
    timestamp: new Date().toISOString(),
  });
  persistFlagged();
  const btn = document.getElementById("flag-btn");
  const original = btn.textContent;
  btn.textContent = "Flagged.";
  setTimeout(() => (btn.textContent = original), 1200);
}

// ---------- search ----------

function runSearch(query) {
  const box = document.getElementById("search-results");
  const q = query.trim().toLowerCase();
  if (q.length < 2) {
    box.hidden = true;
    box.innerHTML = "";
    return;
  }
  const results = [];
  for (const node of state.nodesById.values()) {
    if (nodeSearchText(node).toLowerCase().includes(q)) {
      results.push(node);
      if (results.length >= 25) break;
    }
  }
  if (!results.length) {
    box.innerHTML = '<div class="search-result">No matches.</div>';
    box.hidden = false;
    return;
  }
  box.innerHTML = results
    .map((n) => `<div class="search-result" data-id="${n.id}"><span class="kind">${n.type}</span>${escapeHtml(nodeLabel(n))}</div>`)
    .join("");
  box.hidden = false;
  box.querySelectorAll(".search-result[data-id]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-id");
      box.hidden = true;
      document.getElementById("search-input").value = "";
      // Starting a fresh search resets the trail — this is a new starting point.
      state.trail = [];
      selectNode(id, { pushTrail: true, log: true });
    });
  });
}

// ---------- boot ----------

async function main() {
  loadPersisted();
  initCy();
  await loadGraph();

  document.getElementById("search-input").addEventListener("input", (e) => runSearch(e.target.value));
  document.getElementById("evidence-close").addEventListener("click", () => {
    document.getElementById("evidence-popover").hidden = true;
  });
  document.getElementById("export-log").addEventListener("click", () => downloadJson("gkm_session_log.json", state.log));
  document.getElementById("export-surprises").addEventListener("click", () => downloadJson("gkm_flagged_discoveries.json", state.flagged));
}

main();
