// Combined Light Broadsheet — the full corpus, 1516–1914 (close of the Ottoman period).
// Population curve + an eight-lane event plot of all 122 documented events.
(function () {
  const CATS = window.CORPUS_CATS;
  const LANES = window.CORPUS_LANES;

  function CardCombined() {
    const ink = "#1c1815";
    const red = "#9c2b1c";
    const cream = "#f4efe4";

    return (
      <div className="cmb">
        <style>{`
          .cmb{
            width:760px; box-sizing:border-box; background:${cream};
            border:1px solid #ddd4c2; border-radius:6px; padding:0; color:${ink};
            font-family:"Source Serif 4", Georgia, serif;
            box-shadow:0 24px 60px -28px rgba(40,30,18,0.45); overflow:hidden;
          }
          .cmb-head{padding:30px 36px 20px;border-bottom:2px solid ${ink};}
          .cmb-rail{display:flex;justify-content:space-between;align-items:center;white-space:nowrap;
            font-family:"Archivo",sans-serif;font-size:12.5px;letter-spacing:0.16em;
            text-transform:uppercase;color:#8a7e68;margin-bottom:12px;}
          .cmb-head h1{font-family:"Newsreader",serif;font-weight:500;font-size:33px;
            line-height:1.05;margin:0;letter-spacing:-0.01em;color:${ink};}
          .cmb-head h1 .sep{color:${red};font-weight:400;margin:0 4px;}
          .cmb-head .dek{font-size:16px;line-height:1.45;color:#6b5f4c;margin:9px 0 0;text-wrap:pretty;}
          .cmb-body{padding:22px 36px 28px;}
          .cmb-figttl{font-family:"Archivo",sans-serif;font-size:12px;font-weight:700;letter-spacing:0.13em;
            text-transform:uppercase;color:#8a7e68;margin:0 0 10px;}

          .cmb-chart{position:relative;width:652px;max-width:100%;}
          .evp-tip{position:absolute;z-index:6;background:#211d18;color:#f1ece2;border-radius:8px;
            padding:11px 13px 12px;box-shadow:0 14px 34px -12px rgba(0,0,0,0.6);pointer-events:none;}
          .evp-tip.above{transform:translate(-50%,calc(-100% - 13px));}
          .evp-tip.below{transform:translate(-50%,13px);}
          .evp-tip .arw{position:absolute;border:7px solid transparent;}
          .evp-tip.above .arw{bottom:-7px;border-top-color:#211d18;border-bottom:0;}
          .evp-tip.below .arw{top:-7px;border-bottom-color:#211d18;border-top:0;}
          .evp-tip .cat{font-family:"Archivo",sans-serif;font-size:10.5px;font-weight:700;
            letter-spacing:0.12em;text-transform:uppercase;display:flex;align-items:center;gap:7px;}
          .evp-tip .cat .sw{width:9px;height:9px;border-radius:50%;flex:none;}
          .evp-tip .cat .pips{margin-left:auto;display:flex;gap:3px;align-items:center;}
          .evp-tip .cat .pips i{width:5px;height:5px;border-radius:50%;background:#5a5249;}
          .evp-tip .cat .pips i.f{background:currentColor;}
          .evp-tip .yp{font-family:"Newsreader",serif;font-size:16px;font-weight:600;margin:5px 0 4px;
            display:flex;gap:9px;align-items:baseline;flex-wrap:wrap;}
          .evp-tip .yp .pl{font-family:"Archivo",sans-serif;font-size:10.5px;font-weight:500;
            letter-spacing:0.03em;text-transform:uppercase;color:#a89e8d;}
          .evp-tip .tx{font-size:13.5px;line-height:1.42;color:#d9d2c5;text-wrap:pretty;}
          .evp-tip .src{font-family:"Archivo",sans-serif;font-size:10.5px;letter-spacing:0.02em;
            color:#8f8675;margin-top:7px;}

          .cmb-keys{display:flex;align-items:center;gap:10px 18px;flex-wrap:wrap;margin:16px 0 0;
            padding-bottom:18px;border-bottom:1px solid #d8cfbd;
            font-family:"Archivo",sans-serif;font-size:12.5px;color:#5a5142;}
          .cmb-keys .it{display:flex;align-items:center;gap:7px;}
          .cmb-keys .dot{width:11px;height:11px;border-radius:50%;flex:none;box-shadow:0 0 0 1.5px ${cream};}
          .cmb-keys .meta{display:flex;align-items:center;gap:7px;color:#9c8f78;}
          .cmb-keys .sep{width:1px;height:14px;background:#d8cfbd;}

          .cmb-cap{font-size:17px;line-height:1.5;color:#3f372d;margin:18px 0 22px;text-wrap:pretty;}
          .cmb-cap b{font-weight:600;color:${ink};}

          .cmb-cmp{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid #ddd4c2;
            border-radius:8px;overflow:hidden;}
          .cmb-cmp .col{padding:18px 20px;}
          .cmb-cmp .col.pre{background:rgba(176,35,26,0.05);}
          .cmb-cmp .col.post{background:rgba(63,138,85,0.06);border-left:1px solid #ddd4c2;}
          .cmb-cmp h4{font-family:"Archivo",sans-serif;font-size:11.5px;letter-spacing:0.1em;
            text-transform:uppercase;margin:0 0 2px;font-weight:700;}
          .cmb-cmp .pre h4{color:${red};}
          .cmb-cmp .post h4{color:#357046;}
          .cmb-cmp .span{font-family:"Archivo",sans-serif;font-size:10.5px;letter-spacing:0.06em;
            text-transform:uppercase;color:#9c8f78;margin:0 0 13px;}
          .cmb-cmp .row{display:flex;justify-content:space-between;align-items:baseline;gap:10px;
            padding:7px 0;border-top:1px solid rgba(28,24,21,0.08);}
          .cmb-cmp .row .k{font-size:13.5px;color:#6b5f4c;}
          .cmb-cmp .row .v{font-family:"Newsreader",serif;font-size:18px;font-weight:600;color:${ink};
            text-align:right;}
          .cmb-cmp .row .v.big{font-size:22px;}

          .cmb-foot{font-size:14.5px;line-height:1.5;color:#4a4135;text-wrap:pretty;margin:20px 0 0;}
          .cmb-foot b{font-weight:600;color:${ink};}
          .cmb-foot .src{display:block;margin-top:9px;font-style:italic;font-size:13px;color:#857a64;}
        `}</style>

        <div className="cmb-head">
          <div className="cmb-rail">
            <span>1516 – 1914 · the full corpus</span>
            <span>122 documented events</span>
          </div>
          <h1>
            Jewish Population <span className="sep">·</span> Ottoman Palestine
          </h1>
          <p className="dek">
            The estimated population, over a century-by-category record of violence, extortion, expulsion,
            immigration, halukah, and institution-building — compiled from a multi-source corpus.
          </p>
        </div>

        <div className="cmb-body">
          <p className="cmb-figttl">Population &amp; the documented record, by year</p>
          <div className="cmb-chart">
            <EventPlot />
          </div>

          <div className="cmb-keys">
            {LANES.map((k) => (
              <span className="it" key={k}>
                <span className="dot" style={{ background: CATS[k].color }}></span>
                {CATS[k].label} <span style={{ color: "#9c8f78", marginLeft: 2 }}>{CATS[k].n}</span>
              </span>
            ))}
            <span className="sep"></span>
            <span className="meta">
              <svg width="40" height="14" viewBox="0 0 40 14">
                <circle cx="5" cy="7" r="3" fill="#9c8f78" />
                <circle cx="18" cy="7" r="4.5" fill="#9c8f78" />
                <circle cx="33" cy="7" r="6" fill="#9c8f78" />
              </svg>
              size = intensity
            </span>
            <span className="meta">
              <span style={{ display: "inline-block", width: 14, height: 12, background: "#7d7259", opacity: 0.28, borderLeft: "1.5px dashed #7d7259", borderRight: "1.5px dashed #7d7259" }}></span>
              Tanzimat 1839–1858
            </span>
            <span style={{ marginLeft: "auto", color: "#b1a48c" }}>Hover any dot for the record →</span>
          </div>

          <p className="cmb-cap">
            Flat, then halved, then tripled. The population peaked near <b>~12K</b> around 1567, fell by half across
            230 years of continuous immigration, and did not regain the peak until <b>~1860</b>. The record inverts
            across the Tanzimat — from the <b>1839</b> Hatt-ı Şerif of Gülhane (the promise) to the <b>1858</b> Penal
            &amp; Land Codes (its enforcement): the coercion lanes empty out as the construction lanes fill in. Same
            place, same community — the variable that changed was the protection regime.
          </p>

          <div className="cmb-cmp">
            <div className="col pre">
              <h4>Dhimmi era</h4>
              <p className="span">1516–1840 · 324 yrs · no consular protection · jizya in force</p>
              <div className="row"><span className="k">Net population</span><span className="v big">+3,000</span></div>
              <div className="row"><span className="k">1567 peak</span><span className="v">halved</span></div>
              <div className="row"><span className="k">Coercion events</span><span className="v">59</span></div>
              <div className="row"><span className="k">Diaspora money</span><span className="v">subsistence</span></div>
            </div>
            <div className="col post">
              <h4>Consular + Tanzimat</h4>
              <p className="span">1840–1882 · ~42 yrs · British consul 1838+ · jizya abolished 1856</p>
              <div className="row"><span className="k">Net population</span><span className="v big">+17,000</span></div>
              <div className="row"><span className="k">1567 peak</span><span className="v">regained ~1860</span></div>
              <div className="row"><span className="k">Pogrom-scale massacres</span><span className="v">0</span></div>
              <div className="row"><span className="k">Diaspora money</span><span className="v">capital</span></div>
            </div>
          </div>

          <p className="cmb-foot">
            <span className="src">
              All pre-1839 figures are estimates (no systematic count before the 1839 Montefiore censuses). "0 massacres"
              is the urban Old Yishuv; net growth is after heavy yerida (50–80% departure); the post-1856 thinning is
              partly the inventory's construction. Sources: Morris, Barnai, Ayalon, Cohen, David, Gerber, Lewis, Eliav, Yaari, Schwarz, Finn.
            </span>
          </p>
        </div>
      </div>
    );
  }

  window.CardCombined = CardCombined;
})();
