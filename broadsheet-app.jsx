/* ============================================================================
   broadsheet-app.jsx — the React inventory for a community page
   Renders the stats bar, control rail (category tabs + search + location +
   evidence filters), the sortable multi-column table with in-table category
   section heads, and expandable corpus-passage detail rows.

   Tier 1: uses only fields present in the per-community JSON
   (year, date, cat, location, event, quote?, src, srcType, passages[]).
   No actor/scale/cross-link columns (those need data the light pages lack).

   Reads window.COMMUNITY_CFG + window.DATA. Call renderBroadsheet().
   ========================================================================== */
const { useState, useMemo, useRef, useCallback } = React;

const CFG = window.COMMUNITY_CFG || {};
const CATS = CFG.cats || {};
const CAT_KEYS = Object.keys(CATS);
const CAT_ORDER = {};
CAT_KEYS.forEach((k, i) => (CAT_ORDER[k] = i));

const EVID_LABEL = {
  primary: "Primary",
  eyewitness: "Eyewitness",
  chronicle: "Community chronicle",
  secondary: "Secondary",
};

function catColor(cat) { return (CATS[cat] || {}).color || "#6b6358"; }
function catLabel(cat) { return (CATS[cat] || {}).label || cat; }

/* ── Headline stats bar (bespoke per page, from cfg.stats) ─────────────── */
function StatsBar() {
  const stats = CFG.stats || [];
  if (!stats.length) return null;
  return (
    <section className="stats">
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <div className="n">{s.n}</div>
          <div className="l">{s.l}</div>
        </div>
      ))}
    </section>
  );
}

/* ── Expandable detail: corpus passages ───────────────────────────────── */
function DetailPanel({ event }) {
  const passages = event.passages || [];
  return (
    <div className="detail-panel" style={{ borderLeftColor: catColor(event.cat) }}>
      {passages.length > 0 ? (
        <React.Fragment>
          <div className="detail-section-head">Corpus passages</div>
          {passages.map((p, i) => (
            <div key={i} className="passage">
              <div className="passage-file">{(p.file || "").replace(/_/g, " ")}</div>
              <div className="passage-text">{p.text}</div>
            </div>
          ))}
        </React.Fragment>
      ) : (
        <div className="no-passages">
          Cited source: <b>{event.src || "—"}</b>
          {event.srcType ? ` (${EVID_LABEL[event.srcType] || event.srcType})` : ""}.
          {event.quote
            ? " The quoted line above is the cited excerpt."
            : " A full corpus passage is not yet curated for this row."}
        </div>
      )}
    </div>
  );
}

/* ── Main app ─────────────────────────────────────────────────────────── */
function App() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("all");
  const [evid, setEvid] = useState("all");
  const [sortKey, setSortKey] = useState("year");
  const [sortDir, setSortDir] = useState("asc");
  const [openId, setOpenId] = useState(null);
  const rowRefs = useRef({});

  const data = window.DATA || [];
  // give every event a stable id + display index
  const indexed = useMemo(
    () => data.map((e, i) => ({ ...e, _id: `${e.cat}-${i}`, _n: i + 1 })),
    [data]
  );

  const counts = useMemo(() => {
    const c = { all: indexed.length };
    CAT_KEYS.forEach((k) => (c[k] = 0));
    indexed.forEach((r) => { if (c[r.cat] != null) c[r.cat]++; });
    return c;
  }, [indexed]);

  const evidTypes = useMemo(() => {
    const seen = [];
    indexed.forEach((r) => { if (r.srcType && !seen.includes(r.srcType)) seen.push(r.srcType); });
    return seen;
  }, [indexed]);

  const locations = CFG.locations || [];

  const rows = useMemo(() => {
    let r = indexed.slice();
    if (cat !== "all") r = r.filter((x) => x.cat === cat);
    if (loc !== "all") r = r.filter((x) => (x.location || "").includes(loc));
    if (evid !== "all") r = r.filter((x) => x.srcType === evid);
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      r = r.filter((x) =>
        (x.event || "").toLowerCase().includes(t) ||
        (x.quote || "").toLowerCase().includes(t) ||
        (x.location || "").toLowerCase().includes(t) ||
        (x.src || "").toLowerCase().includes(t) ||
        (x.date || "").toLowerCase().includes(t) ||
        catLabel(x.cat).toLowerCase().includes(t)
      );
    }
    r.sort((a, b) => {
      let av, bv;
      if (sortKey === "location") { av = a.location || ""; bv = b.location || ""; }
      else if (sortKey === "cat") { av = CAT_ORDER[a.cat] ?? 99; bv = CAT_ORDER[b.cat] ?? 99; }
      else if (sortKey === "src") { av = (a.srcType || "") + (a.src || ""); bv = (b.srcType || "") + (b.src || ""); }
      else { av = a.year; bv = b.year; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return a.year - b.year; // tie-break chronological
    });
    return r;
  }, [indexed, cat, q, loc, evid, sortKey, sortDir]);

  function setSort(k) {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  }
  function clearFilters() { setCat("all"); setQ(""); setLoc("all"); setEvid("all"); }
  const sortMark = (k) => (sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : "·");
  const showSectionHeads = cat === "all" && sortKey === "cat";
  const hasFilters = cat !== "all" || q || loc !== "all" || evid !== "all";

  const toggleRow = useCallback((id) => setOpenId((p) => (p === id ? null : id)), []);

  return (
    <React.Fragment>
      <div className="controls">
        <label>Category</label>
        <div className="tabs">
          <button
            className={`tab ${cat === "all" ? "on" : ""}`}
            style={cat === "all" ? { background: "var(--ink)", borderColor: "var(--ink)" } : null}
            onClick={() => setCat("all")}
          >
            All <span className="count">{counts.all}</span>
          </button>
          {CAT_KEYS.map((k) => (
            <button
              key={k}
              className={`tab ${cat === k ? "on" : ""}`}
              style={cat === k ? { background: catColor(k), borderColor: catColor(k) } : null}
              onClick={() => setCat(k)}
            >
              {catLabel(k)} <span className="count">{counts[k]}</span>
            </button>
          ))}
        </div>
        <input
          className="search"
          type="text"
          placeholder="Search events, sources, places…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {locations.length > 0 && (
          <select className="select" value={loc} onChange={(e) => setLoc(e.target.value)}>
            <option value="all">All places</option>
            {locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        )}
        <select className="select" value={evid} onChange={(e) => setEvid(e.target.value)}>
          <option value="all">All evidence</option>
          {evidTypes.map((t) => <option key={t} value={t}>{EVID_LABEL[t] || t}</option>)}
        </select>
        {hasFilters && <button className="clearbtn" onClick={clearFilters}>Clear ✕</button>}
      </div>

      <div className="tablewrap">
        <table className="t">
          <thead>
            <tr>
              <th className="num">#</th>
              <th className={`sortable ${sortKey === "year" ? "sorted" : ""}`} onClick={() => setSort("year")}>
                Date <span className="sortmark">{sortMark("year")}</span>
              </th>
              <th className={`sortable ${sortKey === "location" ? "sorted" : ""}`} onClick={() => setSort("location")}>
                Place <span className="sortmark">{sortMark("location")}</span>
              </th>
              <th>Event</th>
              <th className={`sortable ${sortKey === "src" ? "sorted" : ""}`} onClick={() => setSort("src")}>
                Source <span className="sortmark">{sortMark("src")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan="5" className="empty">No matching events. Adjust filters to widen.</td></tr>
            )}
            {rows.map((r, i) => {
              const isOpen = openId === r._id;
              const showHead = showSectionHeads && (i === 0 || rows[i - 1].cat !== r.cat);
              const np = (r.passages || []).length;
              return (
                <React.Fragment key={r._id}>
                  {showHead && (
                    <tr className="sec">
                      <td colSpan="5">
                        <span className="secdot" style={{ background: catColor(r.cat) }}></span>
                        {catLabel(r.cat)}
                        <span className="seccount">{counts[r.cat]} {counts[r.cat] === 1 ? "event" : "events"}</span>
                      </td>
                    </tr>
                  )}
                  <tr
                    ref={(el) => (rowRefs.current[r._id] = el)}
                    className={`clickable ${isOpen ? "expanded" : ""}`}
                    onClick={() => toggleRow(r._id)}
                  >
                    <td className="num">{String(r._n).padStart(2, "0")}</td>
                    <td className="col-date">
                      {r.date}
                      <span className="sub" style={{ color: catColor(r.cat) }}>{catLabel(r.cat)}</span>
                    </td>
                    <td className="col-loc"><span className="loc-name">{r.location}</span></td>
                    <td className="col-event">
                      {r.event}
                      {r.quote && <blockquote>{r.quote}</blockquote>}
                      <span className={`passage-badge ${np ? "" : "none"}`}>
                        {np
                          ? `▸ ${np} corpus passage${np > 1 ? "s" : ""}`
                          : "▸ source"}
                      </span>
                    </td>
                    <td className="col-src">
                      <span className={`pill ${r.srcType}`}>{EVID_LABEL[r.srcType] || r.srcType}</span><br />
                      {r.src}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="detail-row">
                      <td colSpan="5"><DetailPanel event={r} /></td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="resultcount">
        Showing <b>{rows.length}</b> of {indexed.length} events. Click a row for the corpus
        passage; column headers sort; filters combine as AND.
      </div>
    </React.Fragment>
  );
}

window.renderBroadsheet = function () {
  const statsHost = document.getElementById("stats-root");
  if (statsHost) ReactDOM.createRoot(statsHost).render(<StatsBar />);
  const root = document.getElementById("app-root");
  if (root) ReactDOM.createRoot(root).render(<App />);
};
