/* ============================================================================
   broadsheet-chart.js — population curve + category-lane event plot
   Chart-and-legend-only refactor of the repo's community-plot.js. The React
   broadsheet (broadsheet-app.jsx) now owns the table/filters, so this module
   renders ONLY the SVG chart (#plot) and its legend (#legend). Geometry, dot
   sizing, Tanzimat band, and curve smoothing are unchanged from the original
   so the chart stays pixel-identical to the flagship card-eventplot.

   Reads window.COMMUNITY_CFG.chart + .cats. Call drawBroadsheetChart(events).
   ========================================================================== */
(function () {
  const cfg = window.COMMUNITY_CFG;
  if (!cfg) return;
  const ch = cfg.chart || {};
  const cats = cfg.cats || {};
  const catKeys = Object.keys(cats);
  const [Y0, Y1] = ch.yearRange || [1500, 1950];
  const SANS = 'Archivo, "Helvetica Neue", Arial, sans-serif';

  // ── geometry (matches card-eventplot.jsx / community-plot.js) ───────────
  const W = 652, GL = 132, GR = 16;
  const T = 30, CH = 132, GAP = 12, LH = 23;
  const N = catKeys.length;
  const LY = T + CH + GAP;
  const LANES_BOTTOM = LY + LH * N;
  const H = LANES_BOTTOM + 26;
  const SPAN = Y1 - Y0;
  const maxP = ch.maxP || 100;
  const px = (y) => GL + (W - GL - GR) * (y - Y0) / SPAN;
  const cy = (v) => T + CH * (1 - v / maxP);
  const laneY = (k) => LY + LH * k + LH / 2;
  const TZ = ch.band || ch.tanzimat || [1839, 1858];
  const BAND_LABEL = ch.bandLabel || "TANZIMAT";
  const DIVX = px(TZ[0]), BANDX1 = px(TZ[1]);
  const magR = (m) => 2.6 + 1.5 * Math.sqrt(m || 1);
  const CREAM = "#f4efe4";

  const fmtK = (v) => (ch.popUnit === "K" ? v + "K" : v.toLocaleString());
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function smooth(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1],
            p3 = pts[i + 2] || p2, t = 0.16;
      const c1x = p1[0] + (p2[0] - p0[0]) * t, c1y = p1[1] + (p2[1] - p0[1]) * t;
      const c2x = p2[0] - (p3[0] - p1[0]) * t, c2y = p2[1] - (p3[1] - p1[1]) * t;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  }

  // left-pack with min-gap, rigid left-shift on overflow
  function dodgeRun(evs, lo, hi) {
    const MIN_GAP = 6.5; const xs = []; let prev = null;
    evs.forEach((e) => {
      let x = Math.max(px(e.year), lo);
      if (prev != null && x < prev + MIN_GAP) x = prev + MIN_GAP;
      prev = x; xs.push(x);
    });
    if (xs.length && hi != null && xs[xs.length - 1] > hi) {
      const shift = xs[xs.length - 1] - hi;
      for (let i = 0; i < xs.length; i++) xs[i] = Math.max(lo, xs[i] - shift);
    }
    return xs;
  }

  let EVENTS = [];

  function drawBroadsheetChart(events) {
    const counts = {}; catKeys.forEach((k) => (counts[k] = 0));
    events.forEach((e) => { if (counts[e.cat] != null) counts[e.cat]++; });

    const M = 2.5; const dots = [];
    catKeys.forEach((cat, k) => {
      const evs = events.filter((e) => e.cat === cat).slice().sort((a, b) => a.year - b.year);
      const pre = evs.filter((e) => e.year < TZ[0]);
      const post = evs.filter((e) => e.year >= TZ[0]);
      const preX = dodgeRun(pre, GL, DIVX - M);
      const postX = dodgeRun(post, DIVX + M, W - GR);
      pre.forEach((e, i) => dots.push({ e, cat, x: preX[i], y: laneY(k), r: magR(e.intensity || 2) }));
      post.forEach((e, i) => dots.push({ e, cat, x: postX[i], y: laneY(k), r: magR(e.intensity || 2) }));
    });
    EVENTS = dots.map((d) => d.e);

    const s = [];
    s.push(`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;overflow:visible" font-family='${SANS}' role="img" aria-label="${esc(ch.title || cfg.title || "")}">`);

    // population gridlines + ticks
    (ch.yTicks || []).forEach((v) => {
      s.push(`<line x1="${GL}" x2="${W - GR}" y1="${cy(v)}" y2="${cy(v)}" stroke="rgba(28,24,21,0.07)" stroke-width="1"/>`);
      s.push(`<text x="${GL - 8}" y="${cy(v) + 4}" text-anchor="end" font-size="11" fill="#8c8270">${v === 0 ? "0" : fmtK(v)}</text>`);
    });
    s.push(`<line x1="${GL}" x2="${W - GR}" y1="${cy(0)}" y2="${cy(0)}" stroke="rgba(28,24,21,0.4)" stroke-width="1"/>`);

    // population curve (estimate dashed → documented solid)
    const knots = ch.knots || [];
    const pts = knots.map(([y, v]) => [px(y), cy(v)]);
    const splitAt = knots.findIndex((k) => !k[2]);
    if (splitAt > 0) {
      s.push(`<path d="${smooth(pts.slice(0, splitAt + 1))}" fill="none" stroke="${ch.curveColorEst || "#8c8270"}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="6 6"/>`);
      s.push(`<path d="${smooth(pts.slice(splitAt))}" fill="none" stroke="${ch.curveColor}" stroke-width="2.4" stroke-linecap="round"/>`);
    } else {
      s.push(`<path d="${smooth(pts)}" fill="none" stroke="${ch.curveColor}" stroke-width="2.4" stroke-linecap="round"/>`);
    }
    if (ch.peakLabel && ch.peakYear) {
      const pk = knots.find((k) => k[0] === ch.peakYear);
      const py = pk ? cy(pk[1]) - 8 : T + 10;
      s.push(`<text x="${px(ch.peakYear)}" y="${py}" text-anchor="middle" font-size="11" font-weight="600" fill="${ch.curveColor}">${esc(ch.peakLabel)}</text>`);
    }

    // lane separators + labels + per-lane count column
    catKeys.forEach((cat, k) => {
      const c = cats[cat], y = laneY(k);
      s.push(`<line x1="${GL}" x2="${W - GR}" y1="${y}" y2="${y}" stroke="rgba(28,24,21,0.06)" stroke-width="1"/>`);
      s.push(`<circle cx="${GL - 120}" cy="${y}" r="4.5" fill="${c.color}"/>`);
      s.push(`<text x="${GL - 108}" y="${y + 4}" font-size="12" fill="#544c40" font-weight="500">${esc(c.label)}</text>`);
      s.push(`<text x="${GL - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#8c8270" style="font-variant-numeric:tabular-nums">${counts[cat]}</text>`);
    });

    // Tanzimat band
    s.push(`<rect x="${DIVX}" y="${T}" width="${BANDX1 - DIVX}" height="${LANES_BOTTOM - T}" fill="#7d7259" fill-opacity="0.1"/>`);
    s.push(`<line x1="${DIVX}" x2="${DIVX}" y1="${T}" y2="${LANES_BOTTOM}" stroke="#7d7259" stroke-width="1.25" stroke-dasharray="3 4"/>`);
    s.push(`<line x1="${BANDX1}" x2="${BANDX1}" y1="${T}" y2="${LANES_BOTTOM}" stroke="#7d7259" stroke-width="1.25" stroke-dasharray="3 4"/>`);
    s.push(`<text x="${(DIVX + BANDX1) / 2}" y="${T - 19}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#8a7e62" style="letter-spacing:0.16em">${esc(BAND_LABEL)}</text>`);
    s.push(`<text x="${DIVX - 3}" y="${T - 6}" text-anchor="end" font-size="10.5" font-weight="700" fill="#6f654f">${TZ[0]} ›</text>`);
    s.push(`<text x="${BANDX1 + 3}" y="${T - 6}" text-anchor="start" font-size="10.5" font-weight="700" fill="#6f654f">‹ ${TZ[1]}</text>`);

    // dots (hit target + visible dot)
    dots.forEach((d, i) => {
      s.push(`<circle class="cp-dot" data-i="${i}" cx="${d.x.toFixed(1)}" cy="${d.y}" r="${(d.r + 5).toFixed(1)}" fill="transparent" style="cursor:pointer"/>`);
      s.push(`<circle cx="${d.x.toFixed(1)}" cy="${d.y}" r="${d.r.toFixed(1)}" fill="${cats[d.cat].color}" fill-opacity="0.9" stroke="${CREAM}" stroke-width="1.2" style="pointer-events:none"/>`);
    });

    // year axis
    (ch.xTicks || [1516, 1567, 1700, 1800, 1900]).forEach((y) => {
      if (y < Y0 || y > Y1) return;
      s.push(`<text x="${px(y)}" y="${LANES_BOTTOM + 16}" text-anchor="middle" font-size="11.5" fill="#7a6f5b" style="font-variant-numeric:tabular-nums">${y}</text>`);
    });
    s.push(`</svg>`);

    const host = document.getElementById("plot");
    if (host) { host.innerHTML = s.join(""); wireHover(host); }
    drawLegend();
    drawCompare();
  }

  // Era comparison grid (pre-1840 dhimmi era vs Tanzimat & after) — parity with
  // the flagship card. Reads COMMUNITY_CFG.compare; renders into #compare-root.
  function drawCompare() {
    const el = document.getElementById("compare-root");
    const cmp = cfg.compare;
    if (!el || !cmp) return;
    const col = (c, side) => {
      const rows = (c.rows || []).map((r) =>
        `<div class="row"><span class="k">${esc(r.k)}</span>` +
        `<span class="v${r.big ? " big" : ""}">${esc(r.v)}</span></div>`).join("");
      return `<div class="col ${side}"><h4>${esc(c.label)}</h4>` +
        `<p class="span">${esc(c.span)}</p>${rows}</div>`;
    };
    el.innerHTML =
      `<div class="cmp2">${col(cmp.pre, "pre")}${col(cmp.post, "post")}</div>` +
      (cmp.foot ? `<p class="cmp-foot">${cmp.foot}</p>` : "");
  }

  function wireHover(host) {
    let tip = document.getElementById("cp-tip");
    if (!tip) {
      tip = document.createElement("div");
      tip.id = "cp-tip";
      document.body.appendChild(tip);
    }
    function fill(e) {
      const c = cats[e.cat] || {};
      tip.innerHTML =
        `<b style="color:${c.color || "#fff"}">${esc(e.date)} · ${esc(c.label || e.cat)}</b>` +
        `<div style="color:#c9bfa6;font-style:italic;margin:1px 0 4px">${esc(e.location || "")}</div>` +
        `${esc(e.event)}` +
        (e.src ? `<div style="color:#a89e8d;margin-top:6px;font-size:11.5px">${esc(e.src)}${e.srcType ? " · " + esc(e.srcType) : ""}</div>` : "");
      tip.style.opacity = "1";
    }
    function place(cx, cy2) {
      const r = tip.getBoundingClientRect();
      let x = cx + 14, y = cy2 + 14;
      if (x + r.width > innerWidth - 8) x = cx - r.width - 14;
      if (x < 8) x = 8;
      if (y + r.height > innerHeight - 8) y = cy2 - r.height - 14;
      if (y < 8) y = 8;
      tip.style.left = x + "px"; tip.style.top = y + "px";
    }
    // Desktop: hover to reveal, follow the pointer.
    host.addEventListener("mouseover", (ev) => {
      const t = ev.target.closest(".cp-dot"); if (!t) return;
      const e = EVENTS[+t.getAttribute("data-i")]; if (!e) return;
      fill(e);
    });
    host.addEventListener("mousemove", (ev) => { place(ev.clientX, ev.clientY); });
    host.addEventListener("mouseout", (ev) => { if (ev.target.closest(".cp-dot")) tip.style.opacity = "0"; });
    // Touch / click: tap a dot to pin its record, tap elsewhere to dismiss.
    host.addEventListener("click", (ev) => {
      const t = ev.target.closest(".cp-dot"); if (!t) return;
      const e = EVENTS[+t.getAttribute("data-i")]; if (!e) return;
      const r = t.getBoundingClientRect();
      fill(e);
      place(r.left + r.width / 2, r.top + r.height / 2);
      ev.stopPropagation();
    });
    document.addEventListener("click", (ev) => {
      if (!ev.target.closest(".cp-dot")) tip.style.opacity = "0";
    });
  }

  function drawLegend() {
    const el = document.getElementById("legend"); if (!el) return;
    el.innerHTML = catKeys.map((k) =>
      `<span><i style="background:${cats[k].color}"></i>${esc(cats[k].label)}</span>`).join("") +
      `<span style="color:#8c8270">· hover any dot for the record</span>`;
  }

  window.drawBroadsheetChart = drawBroadsheetChart;
})();
