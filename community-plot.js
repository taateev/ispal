// community-plot.js — shared renderer for the per-community pages.
// Mirrors the Jewish card-eventplot.jsx design (geometry, dot sizing, lane
// labels, Tanzimat band) so all community pages share one look.
//
// window.COMMUNITY_CFG = {
//   knots:      [[year, value, est?], ...],   // population curve (est=true → dashed)
//   maxP:       number,                        // population y-axis max
//   popUnit:    "souls" | "K",
//   curveColor: "#hex", curveColorEst: "#hex",
//   peakLabel:  "~12K · 1567 peak", peakYear: 1567,   // optional curve annotation
//   cats:       { key: {label, color:"#hex"}, ... },  // SHORT labels; order = lane order
//   eventsUrl:  "events-xxx.json",
//   yearRange:  [1500, 1950],
//   tanzimat:   [1839, 1858],
//   yTicks:     [0, ...],                       // up to 4 population gridline values
// }
(function () {
  const cfg = window.COMMUNITY_CFG;
  if (!cfg) return;
  const catKeys = Object.keys(cfg.cats);
  const [Y0, Y1] = cfg.yearRange;
  const SANS = 'Archivo, "Helvetica Neue", Arial, sans-serif';

  // ── geometry (matches card-eventplot.jsx) ───────────────────────────────
  const W = 652, GL = 132, GR = 16;
  const T = 30, CH = 132, GAP = 12, LH = 23;
  const N = catKeys.length;
  const LY = T + CH + GAP;
  const LANES_BOTTOM = LY + LH * N;
  const H = LANES_BOTTOM + 26;
  const SPAN = Y1 - Y0;
  const px = (y) => GL + (W - GL - GR) * (y - Y0) / SPAN;
  const cy = (v) => T + CH * (1 - v / cfg.maxP);
  const laneY = (k) => LY + LH * k + LH / 2;
  const TZ = cfg.tanzimat || [1839, 1858];
  const DIVX = px(TZ[0]), BANDX1 = px(TZ[1]);
  const magR = (m) => 2.6 + 1.5 * Math.sqrt(m || 1);
  const CREAM = "#f4efe4";

  const fmtK = (v) => (cfg.popUnit === "K" ? v + "K" : v.toLocaleString());
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

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

  // left-pack with min-gap, rigid left-shift on overflow (matches dodgeRun)
  function dodgeRun(evs, lo, hi) {
    const MIN_GAP = 6.5; const xs = []; let prev = null;
    evs.forEach((e) => { let x = Math.max(px(e.year), lo); if (prev != null && x < prev + MIN_GAP) x = prev + MIN_GAP; prev = x; xs.push(x); });
    if (xs.length && hi != null && xs[xs.length - 1] > hi) {
      const shift = xs[xs.length - 1] - hi;
      for (let i = 0; i < xs.length; i++) xs[i] = Math.max(lo, xs[i] - shift);
    }
    return xs;
  }

  let EVENTS = [];
  function drawPlot(events) {
    EVENTS = events;
    const counts = {}; catKeys.forEach((k) => (counts[k] = 0));
    events.forEach((e) => { if (counts[e.cat] != null) counts[e.cat]++; });

    // dots, per-lane, split pre/post-Tanzimat
    const M = 2.5; const dots = [];
    catKeys.forEach((cat, k) => {
      const evs = events.filter((e) => e.cat === cat).slice().sort((a, b) => a.year - b.year);
      const pre = evs.filter((e) => e.year < TZ[0]); const post = evs.filter((e) => e.year >= TZ[0]);
      const preX = dodgeRun(pre, GL, DIVX - M); const postX = dodgeRun(post, DIVX + M, W - GR);
      pre.forEach((e, i) => dots.push({ e, cat, x: preX[i], y: laneY(k), r: magR(e.n || 2) }));
      post.forEach((e, i) => dots.push({ e, cat, x: postX[i], y: laneY(k), r: magR(e.n || 2) }));
    });
    EVENTS = dots.map((d) => d.e); // index alignment for hover

    const s = [];
    s.push(`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;overflow:visible" font-family='${SANS}' role="img" aria-label="${esc(cfg.title || "")}">`);

    // curve gridlines + ticks
    (cfg.yTicks || []).forEach((v) => {
      s.push(`<line x1="${GL}" x2="${W - GR}" y1="${cy(v)}" y2="${cy(v)}" stroke="rgba(28,24,21,0.07)" stroke-width="1"/>`);
      s.push(`<text x="${GL - 8}" y="${cy(v) + 4}" text-anchor="end" font-size="11" fill="#9c8f78">${v === 0 ? "0" : fmtK(v)}</text>`);
    });
    s.push(`<line x1="${GL}" x2="${W - GR}" y1="${cy(0)}" y2="${cy(0)}" stroke="rgba(28,24,21,0.4)" stroke-width="1"/>`);

    // population curve (est dashed → documented solid)
    const pts = cfg.knots.map(([y, v]) => [px(y), cy(v)]);
    const splitAt = cfg.knots.findIndex((k) => !k[2]);
    if (splitAt > 0) {
      s.push(`<path d="${smooth(pts.slice(0, splitAt + 1))}" fill="none" stroke="${cfg.curveColorEst || "#9c8f78"}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="6 6"/>`);
      s.push(`<path d="${smooth(pts.slice(splitAt))}" fill="none" stroke="${cfg.curveColor}" stroke-width="2.4" stroke-linecap="round"/>`);
    } else {
      s.push(`<path d="${smooth(pts)}" fill="none" stroke="${cfg.curveColor}" stroke-width="2.4" stroke-linecap="round"/>`);
    }
    if (cfg.peakLabel && cfg.peakYear) {
      const pk = cfg.knots.find((k) => k[0] === cfg.peakYear);
      const py = pk ? cy(pk[1]) - 8 : T + 10;
      s.push(`<text x="${px(cfg.peakYear)}" y="${py}" text-anchor="middle" font-size="11" font-weight="600" fill="${cfg.curveColor}">${esc(cfg.peakLabel)}</text>`);
    }

    // lane separators + labels + count column
    catKeys.forEach((cat, k) => {
      const c = cfg.cats[cat], y = laneY(k);
      s.push(`<line x1="${GL}" x2="${W - GR}" y1="${y}" y2="${y}" stroke="rgba(28,24,21,0.06)" stroke-width="1"/>`);
      s.push(`<circle cx="${GL - 120}" cy="${y}" r="4.5" fill="${c.color}"/>`);
      s.push(`<text x="${GL - 108}" y="${y + 4}" font-size="12" fill="#5a5142" font-weight="500">${esc(c.label)}</text>`);
      s.push(`<text x="${GL - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#b1a48c" style="font-variant-numeric:tabular-nums">${counts[cat]}</text>`);
    });

    // Tanzimat band
    s.push(`<rect x="${DIVX}" y="${T}" width="${BANDX1 - DIVX}" height="${LANES_BOTTOM - T}" fill="#7d7259" fill-opacity="0.1"/>`);
    s.push(`<line x1="${DIVX}" x2="${DIVX}" y1="${T}" y2="${LANES_BOTTOM}" stroke="#7d7259" stroke-width="1.25" stroke-dasharray="3 4"/>`);
    s.push(`<line x1="${BANDX1}" x2="${BANDX1}" y1="${T}" y2="${LANES_BOTTOM}" stroke="#7d7259" stroke-width="1.25" stroke-dasharray="3 4"/>`);
    s.push(`<text x="${(DIVX + BANDX1) / 2}" y="${T - 19}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#8a7e62" style="letter-spacing:0.16em">TANZIMAT</text>`);
    s.push(`<text x="${DIVX - 3}" y="${T - 6}" text-anchor="end" font-size="10.5" font-weight="700" fill="#6f654f">${TZ[0]} ›</text>`);
    s.push(`<text x="${BANDX1 + 3}" y="${T - 6}" text-anchor="start" font-size="10.5" font-weight="700" fill="#6f654f">‹ ${TZ[1]}</text>`);

    // dots
    dots.forEach((d, i) => {
      s.push(`<circle class="cp-dot" data-i="${i}" cx="${d.x.toFixed(1)}" cy="${d.y}" r="${(d.r + 5).toFixed(1)}" fill="transparent" style="cursor:pointer"/>`);
      s.push(`<circle cx="${d.x.toFixed(1)}" cy="${d.y}" r="${d.r.toFixed(1)}" fill="${cfg.cats[d.cat].color}" fill-opacity="0.9" stroke="${CREAM}" stroke-width="1.2" style="pointer-events:none"/>`);
    });

    // year axis
    (cfg.xTicks || [1516, 1567, 1700, 1800, 1900]).forEach((y) => {
      if (y < Y0 || y > Y1) return;
      s.push(`<text x="${px(y)}" y="${LANES_BOTTOM + 16}" text-anchor="middle" font-size="11.5" fill="#857a64" style="font-variant-numeric:tabular-nums">${y}</text>`);
    });
    s.push(`</svg>`);
    const host = document.getElementById("plot");
    host.innerHTML = s.join("");
    wireHover(host);
  }

  function wireHover(host) {
    let tip = document.getElementById("cp-tip");
    if (!tip) {
      tip = document.createElement("div");
      tip.id = "cp-tip";
      tip.style.cssText = "position:fixed;z-index:50;max-width:300px;background:#1c1815;color:#f4efe4;" +
        'font:13px/1.45 Archivo,"Helvetica Neue",Arial,sans-serif;padding:9px 11px;border-radius:3px;' +
        "box-shadow:0 10px 30px -8px rgba(0,0,0,.6);pointer-events:none;opacity:0;transition:opacity .08s;";
      document.body.appendChild(tip);
    }
    host.addEventListener("mouseover", (ev) => {
      const t = ev.target.closest(".cp-dot"); if (!t) return;
      const e = EVENTS[+t.getAttribute("data-i")]; if (!e) return;
      const c = cfg.cats[e.cat] || {};
      tip.innerHTML = `<b style="color:${c.color || "#fff"}">${esc(e.date)} · ${esc(c.label || e.cat)}</b>` +
        `<div style="color:#c9bfa6;font-style:italic;margin:1px 0 4px">${esc(e.location || "")}</div>` +
        `${esc(e.event)}` + (e.src ? `<div style="color:#9a9080;margin-top:5px;font-size:11.5px">${esc(e.src)}${e.srcType ? " · " + esc(e.srcType) : ""}</div>` : "");
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

  function drawLegend() {
    const el = document.getElementById("legend"); if (!el) return;
    el.innerHTML = catKeys.map((k) => `<span><i style="background:${cfg.cats[k].color}"></i>${esc(cfg.cats[k].label)}</span>`).join("") +
      `<span style="color:#9a9080">· hover any dot for the record</span>`;
  }

  function drawLog(events) {
    const el = document.getElementById("log"); if (!el) return;
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
