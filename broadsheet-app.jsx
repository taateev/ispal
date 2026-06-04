/* ============================================================================
   broadsheet-app.jsx — the React inventory for a community page
   Renders the stats bar, control rail (category tabs + search + location +
   actor + evidence filters), the sortable multi-column table with in-table
   category section heads, and expandable corpus-passage + cross-link detail.

   Tier 2: renders Actors + Scale columns and cross-links WHEN the per-community
   JSON carries them (actorType[], actor, scaleBig, scaleNote, links[], n).
   Pages whose data lacks those fields degrade gracefully (the columns simply
   render empty). Brought to parity with the flagship jewish.html (Jewish page).

   Reads window.COMMUNITY_CFG + window.DATA. Call renderBroadsheet().
   ========================================================================== */
const { useState, useMemo, useRef, useCallback } = React;

const CFG = window.COMMUNITY_CFG || {};
const CATS = CFG.cats || {};
const CAT_KEYS = Object.keys(CATS);
const CAT_ORDER = {};
CAT_KEYS.forEach((k, i) => (CAT_ORDER[k] = i));
const ACTORS = CFG.actors || {};

const EVID_LABEL = {
  primary: "Primary",
  eyewitness: "Eyewitness",
  chronicle: "Community chronicle",
  secondary: "Secondary",
};

function catColor(cat) { return (CATS[cat] || {}).color || "#6b6358"; }
function catLabel(cat) { return (CATS[cat] || {}).label || cat; }
function actorColor(a) { return (ACTORS[a] || {}).color || "#6b6358"; }
function actorLabel(a) { return (ACTORS[a] || {}).label || a; }

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

/* ── Expandable detail: corpus passages + connected events ─────────────── */
function DetailPanel({ event, onNavigate }) {
  const passages = event.passages || [];
  const links = event.links || [];
  const linkedEvents = useMemo(() => {
    return links.map((link) => {
      const target = (window.DATA || []).find((e) => `${e.cat}-${e.n}` === link.id);
      return target ? { ...link, target } : null;
    }).filter(Boolean);
  }, [links]);

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
      {linkedEvents.length > 0 && (
        <React.Fragment>
          <div className="detail-section-head">Connected events</div>
          <div className="linked-cards">
            {linkedEvents.map((link, i) => (
              <button key={i} className="linked-card" onClick={() => onNavigate(link.id)}>
                <div className="lc-label">{link.label}</div>
                <div className="lc-title">
                  <span className="lc-cat">{catLabel(link.target.cat)}</span>
                  {link.target.date} — {link.target.location}
                </div>
              </button>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

/* ── Main app ─────────────────────────────────────────────────────────── */
function App() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("all");
  const [actor, setActor] = useState("all");
  const [evid, setEvid] = useState("all");
  const [sortKey, setSortKey] = useState("year");
  const [sortDir, setSortDir] = useState("asc");
  const [openId, setOpenId] = useState(null);
  const rowRefs = useRef({});

  const data = window.DATA || [];
  // stable id + display index keyed on each event's own n (so cross-links resolve)
  const indexed = useMemo(
    () => data.map((e, i) => ({ ...e, _id: `${e.cat}-${e.n != null ? e.n : i}`, _n: e.n != null ? e.n : i + 1 })),
    [data]
  );

  // does this dataset carry actor / scale data? (Tier-2 column gating — computed
  // here, not at module load, so it sees window.DATA after the async fetch)
  const hasActors = useMemo(() => data.some((r) => (r.actorType || []).length || (r.actor && r.actor !== "—")), [data]);
  const hasScale = useMemo(() => data.some((r) => r.scaleBig || r.scale), [data]);

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

  // actor types actually present, ordered by the cfg.actors declaration
  const actorTypes = useMemo(() => {
    const present = new Set();
    indexed.forEach((r) => (r.actorType || []).forEach((a) => present.add(a)));
    return Object.keys(ACTORS).filter((k) => present.has(k));
  }, [indexed]);

  const locations = CFG.locations || [];

  const rows = useMemo(() => {
    let r = indexed.slice();
    if (cat !== "all") r = r.filter((x) => x.cat === cat);
    if (loc !== "all") r = r.filter((x) => (x.location || "").includes(loc));
    if (actor !== "all") r = r.filter((x) => (x.actorType || []).includes(actor));
    if (evid !== "all") r = r.filter((x) => x.srcType === evid);
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      r = r.filter((x) =>
        (x.event || "").toLowerCase().includes(t) ||
        (x.quote || "").toLowerCase().includes(t) ||
        (x.location || "").toLowerCase().includes(t) ||
        (x.actor || "").toLowerCase().includes(t) ||
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
  }, [indexed, cat, q, loc, actor, evid, sortKey, sortDir]);

  function setSort(k) {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  }
  function clearFilters() { setCat("all"); setQ(""); setLoc("all"); setActor("all"); setEvid("all"); }
  const sortMark = (k) => (sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : "·");
  const showSectionHeads = cat === "all" && sortKey === "cat";
  const hasFilters = cat !== "all" || q || loc !== "all" || actor !== "all" || evid !== "all";

  const colCount = 4 + (hasActors ? 1 : 0) + (hasScale ? 1 : 0);

  const toggleRow = useCallback((id) => setOpenId((p) => (p === id ? null : id)), []);
  const navigateTo = useCallback((targetId) => {
    setOpenId(targetId);
    setTimeout(() => {
      const el = rowRefs.current[targetId];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, []);

  return (
    <React.Fragment>
      <div className="controls">
        <label>Category</label>
        <div className="tabs">
          <button
            className={`tab ${cat === "all" ? "on" : ""}`}
            style={cat === "all" ? { background: "var(--ink)", borderColor: "var(--ink)" } : null}
            onClick={() => { setCat("all"); setActor("all"); }}
          >
            All <span className="count">{counts.all}</span>
          </button>
          {CAT_KEYS.map((k) => (
            <button
              key={k}
              className={`tab ${cat === k ? "on" : ""}`}
              style={cat === k ? { background: catColor(k), borderColor: catColor(k) } : null}
              onClick={() => { setCat(k); setActor("all"); }}
            >
              {catLabel(k)} <span className="count">{counts[k]}</span>
            </button>
          ))}
        </div>
        <input
          className="search"
          type="text"
          placeholder="Search events, sources, actors…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {locations.length > 0 && (
          <select className="select" value={loc} onChange={(e) => setLoc(e.target.value)}>
            <option value="all">All places</option>
            {locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        )}
        {actorTypes.length > 0 && (
          <select className="select" value={actor} onChange={(e) => setActor(e.target.value)}>
            <option value="all">All actors</option>
            {actorTypes.map((a) => <option key={a} value={a}>{actorLabel(a)}</option>)}
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
              {hasActors && <th>Actors</th>}
              {hasScale && <th>Scale</th>}
              <th className={`sortable ${sortKey === "src" ? "sorted" : ""}`} onClick={() => setSort("src")}>
                Source <span className="sortmark">{sortMark("src")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={colCount} className="empty">No matching events. Adjust filters to widen.</td></tr>
            )}
            {rows.map((r, i) => {
              const isOpen = openId === r._id;
              const showHead = showSectionHeads && (i === 0 || rows[i - 1].cat !== r.cat);
              const np = (r.passages || []).length;
              const hasLinks = (r.links || []).length > 0;
              return (
                <React.Fragment key={r._id}>
                  {showHead && (
                    <tr className="sec">
                      <td colSpan={colCount}>
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
                      {hasLinks && <span className="link-badge" title={`${r.links.length} connected event(s)`}>↔ {r.links.length}</span>}
                      <span className={`passage-badge ${np ? "" : "none"}`}>
                        {np
                          ? `▸ ${np} corpus passage${np > 1 ? "s" : ""}`
                          : "▸ source"}
                      </span>
                    </td>
                    {hasActors && (
                      <td className="col-actor">
                        {(r.actorType || []).map((a) => (
                          <span key={a} className="chip" style={{ color: actorColor(a) }}>{actorLabel(a)}</span>
                        ))}
                        {r.actor && r.actor !== "—" && <div className="actor-name">{r.actor}</div>}
                      </td>
                    )}
                    {hasScale && (
                      <td className="col-scale">
                        {r.scaleBig && <span className="big">{r.scaleBig}</span>}
                        {r.scaleNote && <span className="scale-note">{r.scaleNote}</span>}
                      </td>
                    )}
                    <td className="col-src">
                      <span className={`pill ${r.srcType}`}>{EVID_LABEL[r.srcType] || r.srcType}</span><br />
                      {r.src}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="detail-row">
                      <td colSpan={colCount}><DetailPanel event={r} onNavigate={navigateTo} /></td>
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
