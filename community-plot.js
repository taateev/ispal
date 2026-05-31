// community-plot.js — shared renderer for the per-community pages.
// Reads window.COMMUNITY_CFG and renders: an EventPlot (population curve over
// category lanes), the legend, and the documented-record table.
//
// COMMUNITY_CFG = {
//   knots:      [[year, value, est?], ...],   // population curve (est=true → dashed)
//   maxP:       number,                        // population y-axis max
//   popUnit:    "souls" | "K",                 // y-axis tick suffix
//   curveColor: "#hex", curveColorEst: "#hex",
//   cats:       { key: {label, color:"#hex"}, ... },  // order = lane order
//   eventsUrl:  "events-xxx.json",
//   yearRange:  [1500, 1950],
//   tanzimat:   [1839, 1858],
//   yTicks:     [0, ...],                       // population gridline values
// }
(function () {
  const cfg = window.COMMUNITY_CFG;
  if (!cfg) return;
  const catKeys = Object.keys(cfg.cats);
  const [Y0, Y1] = cfg.yearRange;

  // ── geometry ───────────────────────────────────────────────────────────
  const W = 900, GL = 156, GR = 18, GT = 14;
  const CURVE_H = 104, GAP = 18, LANE_H = 23;
  const N = catKeys.length;
  const lanesTop = GT + CURVE_H + GAP;
  const H = lanesTop + LANE_H * N + 28;
  const px = (y) => GL + (W - GL - GR) * (y - Y0) / (Y1 - Y0);
  const cyP = (v) => GT + CURVE_H * (1 - v / cfg.maxP);
  const laneY = (k) => lanesTop + LANE_H * k + LANE_H / 2;
  const TZ = cfg.tanzimat || [1839, 1858];

  function smooth(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, t = 0.16;
      const c1x = p1[0] + (p2[0] - p0[0]) * t, c1y = p1[1] + (p2[1] - p0[1]) * t;
      const c2x = p2[0] - (p3[0] - p1[0]) * t, c2y = p2[1] - (p3[1] - p1[1]) * t;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ── EventPlot ──────────────────────────────────────────────────────────
  let EVENTS = [];
  function drawPlot(events) {
    EVENTS = events;
    const counts = {};
    catKeys.forEach((k) => (counts[k] = 0));
    events.forEach((e) => { if (counts[e.cat] != null) counts[e.cat]++; });

    // per-lane, per-era (split at Tanzimat) horizontal dodging so clusters don't overlap
    const MIN_GAP = 6.4;
    const placed = events.map((e, i) => ({ i, e, lane: catKeys.indexOf(e.cat), x: px(e.year) }))
      .filter((d) => d.lane >= 0);
    catKeys.forEach((k, lane) => {
      [[Y0, TZ[0]], [TZ[0], Y1 + 1]].forEach(([a, b]) => {
        const grp = placed.filter((d) => d.lane === lane && d.e.year >= a && d.e.year < b).sort((p, q) => p.x - q.x);
        let last = -1e9;
        grp.forEach((d) => { if (d.x < last + MIN_GAP) d.x = last + MIN_GAP; last = d.x; });
      });
    });

    const s = [];
    s.push(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(cfg.title || "Population and documented record")}" font-family="Georgia, serif">`);
    // Tanzimat band (full height)
    s.push(`<rect x="${px(TZ[0])}" y="${GT}" width="${px(TZ[1]) - px(TZ[0])}" height="${H - GT - 24}" fill="#9a9080" opacity="0.13"/>`);
    s.push(`<text x="${px(TZ[1]) + 4}" y="${GT + 8}" font-size="9" fill="#8a8270">Tanzimat ${TZ[0]}–${TZ[1]}</text>`);

    // population curve band
    (cfg.yTicks || []).forEach((v) => {
      s.push(`<line x1="${GL}" y1="${cyP(v)}" x2="${W - GR}" y2="${cyP(v)}" stroke="#ddd4bd" stroke-width="1"/>`);
      s.push(`<text x="${GL - 8}" y="${cyP(v) + 3}" text-anchor="end" font-size="9" fill="#9a9080">${v.toLocaleString()}${cfg.popUnit === "K" ? "K" : ""}</text>`);
    });
    s.push(`<text x="${GL - 8}" y="${GT - 2}" text-anchor="end" font-size="9.5" fill="#6b6358" font-style="italic">Population</text>`);
    const pts = cfg.knots.map(([y, v]) => [px(y), cyP(v)]);
    const splitAt = cfg.knots.findIndex((k) => !k[2]);
    if (splitAt > 0) {
      s.push(`<path d="${smooth(pts.slice(0, splitAt + 1))}" fill="none" stroke="${cfg.curveColorEst || "#8a8270"}" stroke-width="2" stroke-dasharray="5 4"/>`);
      s.push(`<path d="${smooth(pts.slice(splitAt))}" fill="none" stroke="${cfg.curveColor}" stroke-width="2.4"/>`);
    } else {
      s.push(`<path d="${smooth(pts)}" fill="none" stroke="${cfg.curveColor}" stroke-width="2.4"/>`);
    }
    cfg.knots.forEach(([y, v, est]) => s.push(`<circle cx="${px(y)}" cy="${cyP(v)}" r="2.6" fill="${est ? (cfg.curveColorEst || "#8a8270") : cfg.curveColor}"/>`));

    // category lanes
    catKeys.forEach((k, lane) => {
      const c = cfg.cats[k], y = laneY(lane);
      s.push(`<line x1="${GL}" y1="${y}" x2="${W - GR}" y2="${y}" stroke="#e3dcc7" stroke-width="1"/>`);
      s.push(`<circle cx="14" cy="${y}" r="4.5" fill="${c.color}"/>`);
      s.push(`<text x="26" y="${y + 4}" font-size="12.5" fill="#3a352d">${esc(c.label)}</text>`);
      s.push(`<text x="${GL - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#9a9080" font-variant-numeric="tabular-nums">${counts[k]}</text>`);
    });

    // dots
    placed.forEach((d) => {
      const c = cfg.cats[d.e.cat];
      const r = d.e.n ? 3.4 + 1.5 * Math.sqrt(d.e.n) : 5;
      s.push(`<circle class="cp-dot" data-i="${d.i}" cx="${d.x.toFixed(1)}" cy="${laneY(d.lane)}" r="${r}" fill="${c.color}" stroke="#f5f1e8" stroke-width="0.8" style="cursor:pointer"/>`);
    });

    // x axis
    (cfg.xTicks || [1500, 1567, 1650, 1700, 1800, 1850, 1900]).forEach((y) => {
      if (y < Y0 || y > Y1) return;
      s.push(`<text x="${px(y)}" y="${lanesTop + LANE_H * N + 16}" text-anchor="middle" font-size="10.5" fill="#9a9080">${y}</text>`);
    });
    s.push(`</svg>`);
    const host = document.getElementById("plot");
    host.innerHTML = s.join("");
    wireHover(host);
  }

  // ── hover tooltip ──────────────────────────────────────────────────────
  function wireHover(host) {
    let tip = document.getElementById("cp-tip");
    if (!tip) {
      tip = document.createElement("div");
      tip.id = "cp-tip";
      tip.style.cssText = "position:fixed;z-index:50;max-width:320px;background:#1a1714;color:#f5f1e8;" +
        "font:13px/1.45 Georgia,serif;padding:9px 11px;border-radius:3px;box-shadow:0 10px 30px -8px rgba(0,0,0,.6);" +
        "pointer-events:none;opacity:0;transition:opacity .08s;";
      document.body.appendChild(tip);
    }
    host.addEventListener("mouseover", (ev) => {
      const t = ev.target.closest(".cp-dot"); if (!t) return;
      const e = EVENTS[+t.getAttribute("data-i")]; if (!e) return;
      const c = cfg.cats[e.cat] || {};
      tip.innerHTML = `<b style="color:${c.color || "#fff"}">${esc(e.date)} · ${esc(c.label || e.cat)}</b>` +
        `<div style="color:#c9bfa6;font-style:italic;margin:1px 0 4px">${esc(e.location || "")}</div>` +
        `${esc(e.event)}` +
        (e.src ? `<div style="color:#9a9080;margin-top:5px;font-size:11.5px">${esc(e.src)}${e.srcType ? " · " + esc(e.srcType) : ""}</div>` : "");
      tip.style.opacity = "1";
    });
    host.addEventListener("mousemove", (ev) => {
      const r = tip.getBoundingClientRect();
      let x = ev.clientX + 14, y = ev.clientY + 14;
      if (x + r.width > innerWidth - 8) x = ev.clientX - r.width - 14;
      if (y + r.height > innerHeight - 8) y = ev.clientY - r.height - 14;
      tip.style.left = x + "px"; tip.style.top = y + "px";
    });
    host.addEventListener("mouseout", (ev) => { if (ev.target.closest(".cp-dot")) tip.style.opacity = "0"; });
  }

  // ── legend ─────────────────────────────────────────────────────────────
  function drawLegend() {
    const el = document.getElementById("legend"); if (!el) return;
    el.innerHTML = catKeys.map((k) => `<span><i style="background:${cfg.cats[k].color}"></i>${esc(cfg.cats[k].label)}</span>`).join("") +
      `<span style="color:#9a9080">· hover any dot for the record</span>`;
  }

  // ── log table ──────────────────────────────────────────────────────────
  function drawLog(events) {
    const el = document.getElementById("log"); if (!el) return;
    events.slice().sort((a, b) => a.year - b.year);
    el.innerHTML = events.slice().sort((a, b) => a.year - b.year).map((e) => {
      const c = cfg.cats[e.cat] || { label: e.cat, color: "#6b6358" };
      const quote = e.quote ? `<span class="quote">“${esc(e.quote)}”</span>` : "";
      const prov = e.srcType ? `<span class="prov ${esc(e.srcType)}">${esc(e.srcType)}</span>` : "";
      return `<tr>
        <td class="date">${esc(e.date)}</td>
        <td><span class="chip" style="color:${c.color}">${esc(c.label)}</span></td>
        <td class="place">${esc(e.location)}</td>
        <td class="ev">${esc(e.event)}${quote}<div class="src">${esc(e.src || "")}${prov}</div></td>
      </tr>`;
    }).join("");
  }

  drawLegend();
  fetch(cfg.eventsUrl)
    .then((r) => r.json())
    .then((events) => { drawPlot(events); drawLog(events); })
    .catch(() => {
      const el = document.getElementById("log");
      if (el) el.innerHTML = `<tr><td colspan="4" class="err">Could not load ${esc(cfg.eventsUrl)} — serve over http (python -m http.server 8080), not file://.</td></tr>`;
    });
})();
