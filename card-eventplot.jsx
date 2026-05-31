// EventPlot — population curve over seven category lanes on one shared time axis.
// All 100 corpus events (+3 disasters) plotted as dots, colored by category and
// sized by intensity. Hover any dot for its corpus detail.
(function () {
  const { useState } = React;

  const CATS = window.CORPUS_CATS;
  const LANES = window.CORPUS_LANES;

  // ── Geometry ───────────────────────────────────────────────────────────
  const W = 652, GL = 132, GR = 16;
  const PW = W - GL - GR;
  const T = 30, CH = 132, GAP = 12;
  const LH = 23;
  const LY = T + CH + GAP;
  const LANES_BOTTOM = LY + LH * LANES.length;
  const H = LANES_BOTTOM + 26;

  const Y0 = 1516, Y1 = 1914, SPAN = Y1 - Y0;
  const MAXY = 90;
  const px = (y) => GL + (PW * (y - Y0)) / SPAN;
  const cy = (v) => T + CH * (1 - v / MAXY);
  const laneY = (k) => LY + LH * k + LH / 2;

  const magR = (m) => 2.6 + 1.5 * Math.sqrt(m || 1);
  const DIVX = px(1839);     // Gülhane edict — Tanzimat proclaimed
  const BANDX1 = px(1858);   // Penal & Land Codes — Tanzimat codified

  // Population curve knots.
  const KNOTS = [
    [1516, 5.0], [1567, 12.0], [1620, 8.0], [1660, 5.0],
    [1700, 6.0], [1780, 6.0], [1837, 6.5], [1840, 8.0], [1856, 11.0],
    [1860, 13.5], [1870, 18.0], [1881, 25.0], [1893, 40.0], [1904, 50.0],
    [1908, 70.0], [1914, 85.0],
  ];
  function smooth(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const t = 0.16;
      const c1x = p1[0] + (p2[0] - p0[0]) * t, c1y = p1[1] + (p2[1] - p0[1]) * t;
      const c2x = p2[0] - (p3[0] - p1[0]) * t, c2y = p2[1] - (p3[1] - p1[1]) * t;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  }
  const curvePts = KNOTS.map(([y, v]) => [px(y), cy(v)]);
  const splitAt = KNOTS.findIndex(([y]) => y >= 1840);
  const solidPath = smooth(curvePts.slice(0, splitAt + 1));
  const dashPath = smooth(curvePts.slice(splitAt));

  // Build plotted dots with per-lane dodging — done independently within each
  // era so a dense pre-1839 cluster never gets pushed across the 1839 divider.
  const MIN_GAP = 6.5;
  function dodgeRun(evs, lo, hi) {
    // Left-to-right packing, then rigid left-shift if it overflows the hi bound.
    const xs = [];
    let prev = null;
    evs.forEach((e) => {
      let x = Math.max(px(e.y), lo);
      if (prev != null && x < prev + MIN_GAP) x = prev + MIN_GAP;
      prev = x;
      xs.push(x);
    });
    if (xs.length && hi != null && xs[xs.length - 1] > hi) {
      const shift = xs[xs.length - 1] - hi;
      for (let i = 0; i < xs.length; i++) xs[i] = Math.max(lo, xs[i] - shift);
    }
    return xs;
  }
  function buildDots() {
    const all = [];
    const M = 2.5; // keep dots clear of the divider line
    LANES.forEach((cat, k) => {
      const evs = (cat === "disaster" ? window.DISASTERS.map((d) => ({ ...d, c: "disaster" })) : window.CORPUS.filter((e) => e.c === cat))
        .slice()
        .sort((a, b) => a.y - b.y);
      const pre = evs.filter((e) => e.y < 1839);
      const post = evs.filter((e) => e.y >= 1839);
      const preX = dodgeRun(pre, GL, DIVX - M);
      const postX = dodgeRun(post, DIVX + M, W - GR);
      pre.forEach((e, i) => all.push({ ev: e, cat, x: preX[i], y: laneY(k), r: magR(e.m) }));
      post.forEach((e, i) => all.push({ ev: e, cat, x: postX[i], y: laneY(k), r: magR(e.m) }));
    });
    return all;
  }
  const DOTS = buildDots();

  const YEAR_TICKS = [1516, 1567, 1700, 1800, 1900];
  const GRIDS = [1600, 1700, 1800];

  function EventPlot() {
    const [hi, setHi] = useState(null);   // hovered dot index
    const [lane, setLane] = useState(null); // hovered category (legend/label)
    const cream = "#f4efe4", ink = "#1c1815", red = "#9c2b1c";

    const hv = hi != null ? DOTS[hi] : null;
    let tip = null;
    if (hv) {
      const TIPW = 248;
      const left = Math.max(TIPW / 2 + 4, Math.min(W - TIPW / 2 - 4, hv.x));
      const arrow = Math.max(8, Math.min(92, ((hv.x - (left - TIPW / 2)) / TIPW) * 100));
      const below = hv.y < 150;
      tip = { left, top: hv.y, arrow, below, w: TIPW };
    }

    return (
      <div className="evp" style={{ position: "relative", width: W + "px", maxWidth: "100%" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible", fontFamily: '"Archivo", sans-serif' }}>
          {/* curve gridlines */}
          {[0, 25, 50, 75].map((v) => (
            <line key={"g" + v} x1={GL} x2={W - GR} y1={cy(v)} y2={cy(v)} stroke="rgba(28,24,21,0.07)" strokeWidth="1" />
          ))}
          <text x={GL - 8} y={cy(75) + 4} textAnchor="end" fontSize="11" fill="#9c8f78">75K</text>
          <text x={GL - 8} y={cy(50) + 4} textAnchor="end" fontSize="11" fill="#9c8f78">50K</text>
          <text x={GL - 8} y={cy(25) + 4} textAnchor="end" fontSize="11" fill="#9c8f78">25K</text>
          <text x={GL - 8} y={cy(0) + 4} textAnchor="end" fontSize="11" fill="#9c8f78">0</text>
          <line x1={GL} x2={W - GR} y1={cy(0)} y2={cy(0)} stroke="rgba(28,24,21,0.4)" strokeWidth="1" />

          {/* faint era gridlines through whole figure */}
          {GRIDS.map((y) => (
            <line key={"vg" + y} x1={px(y)} x2={px(y)} y1={T} y2={LANES_BOTTOM} stroke="rgba(28,24,21,0.05)" strokeWidth="1" />
          ))}

          {/* population curve */}
          <path d={solidPath} fill="none" stroke={red} strokeWidth="2.4" strokeLinecap="round" />
          <path d={dashPath} fill="none" stroke={red} strokeWidth="2.4" strokeLinecap="round" strokeDasharray="6 6" />
          <text x={px(1567)} y={cy(12) - 8} textAnchor="middle" fontSize="11" fontWeight="600" fill={red}>~12K · 1567 peak</text>

          {/* lane separators + labels */}
          {LANES.map((cat, k) => (
            <g key={"lane" + cat}>
              <line x1={GL} x2={W - GR} y1={laneY(k)} y2={laneY(k)} stroke="rgba(28,24,21,0.06)" strokeWidth="1" />
              <circle cx={GL - 120} cy={laneY(k)} r="4.5" fill={CATS[cat].color} />
              <text
                x={GL - 108} y={laneY(k) + 4} fontSize="12"
                fill={lane === cat ? ink : "#5a5142"} fontWeight={lane === cat ? 700 : 500}
                style={{ cursor: "default" }}
                onMouseEnter={() => setLane(cat)} onMouseLeave={() => setLane((p) => (p === cat ? null : p))}
              >
                {CATS[cat].label}
              </text>
              <text x={GL - 10} y={laneY(k) + 4} textAnchor="end" fontSize="11" fill="#b1a48c" style={{ fontVariantNumeric: "tabular-nums" }}>
                {CATS[cat].n}
              </text>
            </g>
          ))}
          {/* divider between coercion (+ disaster aside) and construction lanes */}
          <line x1={GL} x2={W - GR} y1={LY + LH * 5} y2={LY + LH * 5} stroke="rgba(28,24,21,0.18)" strokeWidth="1" strokeDasharray="2 3" />

          {/* Tanzimat reform band: 1839 proclamation → 1858 codification */}
          <rect x={DIVX} y={T} width={BANDX1 - DIVX} height={LANES_BOTTOM - T} fill="#7d7259" fillOpacity="0.1" />
          <line x1={DIVX} x2={DIVX} y1={T} y2={LANES_BOTTOM} stroke="#7d7259" strokeWidth="1.25" strokeDasharray="3 4" />
          <line x1={BANDX1} x2={BANDX1} y1={T} y2={LANES_BOTTOM} stroke="#7d7259" strokeWidth="1.25" strokeDasharray="3 4" />
          <text x={(DIVX + BANDX1) / 2} y={T - 19} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#8a7e62" style={{ letterSpacing: "0.16em" }}>TANZIMAT</text>
          <text x={DIVX - 3} y={T - 6} textAnchor="end" fontSize="10.5" fontWeight="700" fill="#6f654f">1839 ›</text>
          <text x={BANDX1 + 3} y={T - 6} textAnchor="start" fontSize="10.5" fontWeight="700" fill="#6f654f">‹ 1858</text>

          {/* event dots */}
          {DOTS.map((d, i) => {
            const dim = lane && lane !== d.cat;
            const on = hi === i;
            return (
              <g key={i}>
                <circle
                  cx={d.x} cy={d.y} r={d.r + 5} fill="transparent" style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi((p) => (p === i ? null : p))}
                />
                <circle
                  cx={d.x} cy={d.y} r={on ? d.r + 1.5 : d.r}
                  fill={CATS[d.cat].color}
                  fillOpacity={dim ? 0.18 : 0.9}
                  stroke={cream} strokeWidth={on ? 2 : 1.2}
                  style={{ pointerEvents: "none" }}
                />
              </g>
            );
          })}

          {/* year axis */}
          {YEAR_TICKS.map((y) => (
            <text key={"yt" + y} x={px(y)} y={LANES_BOTTOM + 16} textAnchor="middle" fontSize="11.5" fill="#857a64" style={{ fontVariantNumeric: "tabular-nums" }}>{y}</text>
          ))}
        </svg>

        {hv && (
          <div
            className={"evp-tip " + (tip.below ? "below" : "above")}
            style={{ left: `${tip.left}px`, top: `${tip.top}px`, width: `${tip.w}px` }}
          >
            <span className="arw" style={{ left: `${tip.arrow}%`, marginLeft: "-7px" }}></span>
            <div className="cat" style={{ color: CATS[hv.cat].color }}>
              <span className="sw" style={{ background: CATS[hv.cat].color }}></span>
              <span style={{ color: "#f1ece2" }}>{CATS[hv.cat].label}</span>
              <span className="pips">
                {[1, 2, 3, 4, 5].map((p) => (
                  <i key={p} className={p <= hv.ev.m ? "f" : ""}></i>
                ))}
              </span>
            </div>
            <div className="yp">
              {hv.ev.y}
              <span className="pl">{hv.ev.p}</span>
            </div>
            <div className="tx">{hv.ev.t}</div>
            <div className="src">{hv.ev.s}</div>
          </div>
        )}
      </div>
    );
  }

  window.EventPlot = EventPlot;
})();
