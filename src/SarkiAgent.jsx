import { useState, useEffect } from "react";
import {
  Home, Search, UserPlus, ArrowDownLeft, Users, Landmark, ChevronRight,
  LogIn, AlertCircle, Plus, Smartphone, MapPin, CheckCircle2, Languages, Loader2
} from "lucide-react";

const I18N = {
  fr: {
    space: "Espace agent", connectWithToken: "Connecte-toi avec ton jeton API agent.",
    serverAddr: "Adresse du serveur", apiToken: "Jeton API",
    connect: "Se connecter", exploreDemo: "Explorer en mode démonstration",
    loginErr: "Connexion impossible ({e}). Vérifie le jeton.",
    demoBanner: "Mode démonstration — actions non enregistrées", loading: "Chargement…",
    home: "Tournée", search: "Membres", enroll: "Enrôler", actions: "Actions",
    hello: "Barka, {n}", today: "Aujourd'hui",
    kpiVisits: "Membres", kpiCollected: "Collecté", kpiNew: "Nouveaux",
    nextStops: "Prochains arrêts",
    searchPh: "Code, nom ou téléphone…", noResult: "Aucun résultat.",
    savings: "Épargne", loans: "Prêt", tontines: "Tontine",
    deposit: "Enregistrer un dépôt", repay: "Remboursement",
    enrollTitle: "Enrôler un nouveau membre", enrollSub: "KYC rapide sur le terrain",
    fullName: "Nom complet", phone: "Téléphone", id: "Pièce d'identité", agency: "Agence",
    submit: "Enregistrer", cancel: "Annuler",
    amount: "Montant", from: "Pour", method: "Mode", cash: "Espèces", momo: "Mobile money",
    success: "Opération enregistrée", successSub: "Synchronisée avec le serveur",
    saving: "Enregistrement…", new: "Nouveau", errSave: "Échec de l'enregistrement",
    selectAccount: "Compte d'épargne", noAccounts: "Ce membre n'a pas de compte ouvert.",
  },
  ha: {
    space: "Wurin wakili", connectWithToken: "Shiga da tokenkin wakili.",
    serverAddr: "Adireshin sabar", apiToken: "Token na API",
    connect: "Shiga", exploreDemo: "Bincika a yanayin gwaji",
    loginErr: "Ba a iya haɗawa ba ({e}). Duba tokenka.",
    demoBanner: "Yanayin gwaji — ba a adana ayyuka ba", loading: "Ana lodawa…",
    home: "Yawo", search: "Mambobi", enroll: "Rajista", actions: "Ayyuka",
    hello: "Barka, {n}", today: "Yau",
    kpiVisits: "Mambobi", kpiCollected: "An tara", kpiNew: "Sabbi",
    nextStops: "Tasoshi masu zuwa",
    searchPh: "Lambar mamba, suna ko waya…", noResult: "Babu sakamako.",
    savings: "Tara", loans: "Bashi", tontines: "Tontin",
    deposit: "Sa kuɗi", repay: "Biyan bashi",
    enrollTitle: "Yi rajista da sabon mamba", enrollSub: "KYC mai sauri a wuri",
    fullName: "Suna cikakke", phone: "Waya", id: "Takardar shaida", agency: "Reshe",
    submit: "Adana", cancel: "Soke",
    amount: "Adadi", from: "Don", method: "Hanya", cash: "Tsabar kuɗi", momo: "Wayar tarho",
    success: "An adana aikin", successSub: "An aiko tare da sabar",
    saving: "Ana adanawa…", new: "Sabon", errSave: "An kasa adanawa",
    selectAccount: "Asusun tarawa", noAccounts: "Wannan mamba ba shi da asusu a buɗe.",
  },
};
const useT = (lang) => (k, v = {}) => {
  let s = (I18N[lang] || I18N.fr)[k] || I18N.fr[k] || k;
  Object.keys(v).forEach((x) => { s = s.replace(`{${x}}`, v[x]); });
  return s;
};

const C = {
  bg: "#F1F4FB", paper: "#FFFFFF", ink: "#13234E", muted: "#5E6A88",
  line: "#E9ECF5", blue: "#2E55D4", blueD: "#1F3D9E", blueT: "#EAF0FF",
  gold: "#E7B24C", goldS: "#F4CE84", ok: "#2BA46A", okBg: "#E6F6EE", late: "#D9743C",
};
const F = "'Bricolage Grotesque', system-ui, sans-serif";
const SHADOW = "0 12px 32px -18px rgba(19,35,78,.30)";
const fmt = (n) => Number(n || 0).toLocaleString("fr-FR");
const DEFAULT_BASE = "http://213.136.78.130:32871";

async function api(base, path, { method = "GET", token, body } = {}) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(base.replace(/\/$/, "") + path, opts);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
  return data;
}

const DEMO_DATA = {
  agent: { name: "Moussa Ibrahim", agency: "Agence de Niamey", agency_id: 1 },
  members: [
    { id: 1, code: "MEM/2026/00001", name: "Aïssa Maïga", phone: "+227 90 11 22 33", agency: "Agence de Niamey", savings_total: 25000 },
    { id: 2, code: "MEM/2026/00002", name: "Chafaatou Oumarou", phone: "+227 90 00 00 00", agency: "Agence de Niamey", savings_total: 10000 },
  ],
};

const CSS = `
.sk-card{transition:box-shadow .2s ease, transform .2s ease}
.sk-lift:hover{transform:translateY(-3px);box-shadow:0 20px 40px -22px rgba(19,35,78,.4)}
.sk-btn{transition:filter .15s ease, transform .15s ease}
.sk-btn:hover{filter:brightness(.96)}
.sk-btn:active{transform:scale(.97)}
button:focus-visible,input:focus-visible{outline:2px solid ${C.blue};outline-offset:2px}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.sk-spin{animation:spin 1s linear infinite}
`;

export default function SarkiAgent() {
  const [lang, setLangState] = useState(() => { try { return localStorage.getItem("sarki.lang") || "fr"; } catch { return "fr"; } });
  const setLang = (l) => { setLangState(l); try { localStorage.setItem("sarki.lang", l); } catch {} };
  const t = useT(lang);

  const [session, setSession] = useState(null);
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null);

  if (!session) return (<><style>{CSS}</style>
    <Gate t={t} lang={lang} setLang={setLang}
      onConnect={(s) => setSession(s)}
      onDemo={() => setSession({ demo: true, agent: DEMO_DATA.agent })} />
  </>);

  const nav = [
    { id: "home", label: t("home"), icon: Home },
    { id: "search", label: t("search"), icon: Search },
    { id: "enroll", label: t("enroll"), icon: UserPlus },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{CSS}</style>
      {session.demo && <div style={{ background: C.goldS, color: C.ink, fontSize: 12.5, textAlign: "center", padding: "6px 10px", fontWeight: 500 }}>{t("demoBanner")}</div>}

      <div className="md:flex" style={{ maxWidth: 1180, margin: "0 auto" }}>
        <aside className="hidden md:flex" style={{ flexDirection: "column", width: 236, background: C.paper, borderRight: `1px solid ${C.line}`, padding: 22, minHeight: "100vh", position: "sticky", top: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Seal /><span style={{ fontFamily: F, fontWeight: 800, fontSize: 21 }}>Sar<span style={{ color: C.blue }}>ki</span> <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: ".08em" }}>AGENT</span></span>
            </div>
            <LangSwitch lang={lang} setLang={setLang} />
          </div>
          {nav.map((n) => { const A = n.icon; const on = view === n.id;
            return (<button key={n.id} onClick={() => { setView(n.id); setSelected(null); setAction(null); }} className="sk-btn"
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", border: "none", borderRadius: 13, cursor: "pointer", marginBottom: 4, textAlign: "left", fontSize: 14, fontWeight: on ? 600 : 500, background: on ? C.blueT : "transparent", color: on ? C.blue : C.muted }}>
              <A size={18} /> {n.label}
            </button>);
          })}
          <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${C.line}`, fontSize: 12, color: C.muted }}>
            <b style={{ color: C.ink, display: "block" }}>{session.agent.name}</b>{session.agent.agency || "—"}
          </div>
        </aside>

        <main className="flex-1" style={{ padding: "20px 18px 104px" }}>
          {action ? <ActionForm session={session} t={t} action={action} onClose={() => setAction(null)} />
            : selected ? <MemberProfile session={session} t={t} memberId={selected} onClose={() => setSelected(null)} onAction={setAction} />
            : view === "home" ? <HomeView session={session} t={t} lang={lang} setLang={setLang} onPick={(id) => setSelected(id)} />
            : view === "search" ? <SearchView session={session} t={t} onPick={(id) => setSelected(id)} />
            : view === "enroll" ? <EnrollForm session={session} t={t} />
            : null}
        </main>
      </div>

      <nav className="md:hidden" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,.94)", backdropFilter: "blur(10px)", borderTop: `1px solid ${C.line}`, display: "grid", gridTemplateColumns: "repeat(3,1fr)", padding: "9px 4px 12px" }}>
        {nav.map((n) => { const A = n.icon; const on = view === n.id;
          return (<button key={n.id} onClick={() => { setView(n.id); setSelected(null); setAction(null); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, border: "none", background: "none", cursor: "pointer", color: on ? C.blue : C.muted, fontSize: 11, fontWeight: on ? 600 : 500 }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 26, borderRadius: 13, background: on ? C.blueT : "transparent" }}><A size={19} /></span>{n.label}
          </button>);
        })}
      </nav>
    </div>
  );
}

function Seal() {
  return (<svg width="34" height="34" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" stroke={C.blue} strokeWidth="1.4" opacity=".5" />
    <path d="M24 6 L30 18 L43 20 L33 29 L36 42 L24 35 L12 42 L15 29 L5 20 L18 18 Z" fill="none" stroke={C.gold} strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="24" cy="24" r="4.2" fill={C.blue} />
  </svg>);
}
function LangSwitch({ lang, setLang }) {
  return (<button onClick={() => setLang(lang === "fr" ? "ha" : "fr")} className="sk-btn"
    style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 999, border: "none", background: C.paper, color: C.ink, fontWeight: 600, fontSize: 12, cursor: "pointer", boxShadow: SHADOW }}>
    <Languages size={14} /> {lang.toUpperCase()}
  </button>);
}
const Card = ({ children, style, lift, onClick }) => (
  <div onClick={onClick} className={`sk-card${lift ? " sk-lift" : ""}`}
    style={{ background: C.paper, borderRadius: 22, padding: 18, boxShadow: SHADOW, cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>
);
function Header({ title, sub, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <div>
        <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: 24, letterSpacing: "-.02em", margin: 0 }}>{title}</h1>
        {sub && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}
function Spinner({ size = 16 }) { return <Loader2 size={size} className="sk-spin" />; }
function CloseBtn({ onClose }) {
  return <button onClick={onClose} style={{ border: "none", background: "none", color: C.muted, fontSize: 18, cursor: "pointer", padding: 6 }}>✕</button>;
}

function Gate({ t, lang, setLang, onConnect, onDemo }) {
  const [base, setBase] = useState(DEFAULT_BASE);
  const [token, setToken] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  async function connect() {
    setErr(""); setLoading(true);
    try {
      const agent = await api(base, "/api/v1/agent/me", { token });
      onConnect({ base: base.replace(/\/$/, ""), token, agent, demo: false });
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ width: 372, maxWidth: "92vw", background: C.paper, borderRadius: 24, padding: 28, boxShadow: SHADOW }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Seal /><span style={{ fontFamily: F, fontWeight: 800, fontSize: 22 }}>Sar<span style={{ color: C.blue }}>ki</span></span>
          </div>
          <LangSwitch lang={lang} setLang={setLang} />
        </div>
        <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: 20, margin: "0 0 4px" }}>{t("space")}</h1>
        <p style={{ fontSize: 13, color: C.muted, margin: "0 0 16px" }}>{t("connectWithToken")}</p>
        <label style={lbl}>{t("serverAddr")}</label>
        <input value={base} onChange={(e) => setBase(e.target.value)} style={inp} />
        <label style={lbl}>{t("apiToken")}</label>
        <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Bearer token…" style={inp} />
        {err && <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#FBEDE2", color: C.late, fontSize: 12.5, padding: "9px 11px", borderRadius: 10, marginTop: 12 }}><AlertCircle size={16} style={{ flex: "0 0 auto", marginTop: 1 }} /><span>{t("loginErr", { e: err })}</span></div>}
        <button onClick={connect} disabled={!token || loading} className="sk-btn"
          style={{ width: "100%", marginTop: 16, padding: 13, borderRadius: 13, border: "none", background: token && !loading ? C.gold : C.line, color: C.ink, fontWeight: 600, fontSize: 14, cursor: token && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {loading ? <Spinner /> : <LogIn size={17} />} {t("connect")}
        </button>
        <button onClick={onDemo} className="sk-btn"
          style={{ width: "100%", marginTop: 9, padding: 12, borderRadius: 13, border: `1px solid ${C.line}`, background: C.paper, color: C.blue, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
          {t("exploreDemo")}
        </button>
      </div>
    </div>
  );
}

function HomeView({ session, t, lang, setLang, onPick }) {
  const [members, setMembers] = useState(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      if (session.demo) { setMembers(DEMO_DATA.members); return; }
      try {
        const data = await api(session.base, "/api/v1/agent/members", { token: session.token });
        if (alive) setMembers(data.members || []);
      } catch { if (alive) setMembers([]); }
    })();
    return () => { alive = false; };
  }, [session]);
  return (
    <>
      <Header title={t("hello", { n: (session.agent.name || "").split(" ")[0] })}
        sub={`${t("today")} · ${session.agent.agency || ""}`}
        right={<span className="md:hidden"><LangSwitch lang={lang} setLang={setLang} /></span>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        <Kpi lbl={t("kpiVisits")} val={members ? members.length : "—"} />
        <Kpi lbl={t("kpiCollected")} val={"—"} unit="F" gold />
        <Kpi lbl={t("kpiNew")} val={"—"} />
      </div>
      <Card>
        <div style={sect}>{t("nextStops")}</div>
        {!members && <div style={{ padding: 14, color: C.muted, fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}><Spinner /> {t("loading")}</div>}
        {members && members.length === 0 && <div style={{ padding: 14, color: C.muted, fontSize: 13 }}>—</div>}
        {members && members.slice(0, 5).map((m, i, arr) => (
          <div key={m.id} onClick={() => onPick(m.id)} className="sk-btn"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${C.line}`, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <span style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(150deg,${C.blue},#3E63E0)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 700, fontSize: 14 }}>{m.name[0]}</span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={11} /> {m.agency}
                </div>
              </div>
            </div>
            <ChevronRight size={18} color={C.muted} />
          </div>
        ))}
      </Card>
    </>
  );
}
function Kpi({ lbl, val, unit, gold }) {
  return (
    <Card style={{ padding: 15 }}>
      <div style={{ fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>{lbl}</div>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 22, marginTop: 6, color: gold ? C.gold : C.ink }}>
        {val}{unit && <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}> {unit}</span>}
      </div>
    </Card>
  );
}

function SearchView({ session, t, onPick }) {
  const [q, setQ] = useState("");
  const [members, setMembers] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (session.demo) {
          const s = q.toLowerCase();
          const r = DEMO_DATA.members.filter((m) => !s || m.name.toLowerCase().includes(s) || m.code.toLowerCase().includes(s) || m.phone.includes(s));
          if (alive) setMembers(r);
        } else {
          const data = await api(session.base, `/api/v1/agent/members?q=${encodeURIComponent(q)}`, { token: session.token });
          if (alive) setMembers(data.members || []);
        }
      } catch { if (alive) setMembers([]); }
      if (alive) setLoading(false);
    }, 250);
    return () => { alive = false; clearTimeout(timer); };
  }, [q, session]);
  return (
    <>
      <Header title={t("search")} sub={members ? `${members.length}` : ""} />
      <div style={{ display: "flex", gap: 8, alignItems: "center", background: C.paper, borderRadius: 14, padding: "10px 14px", boxShadow: SHADOW, marginBottom: 14 }}>
        <Search size={18} color={C.muted} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPh")}
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent" }} />
        {loading && <Spinner size={15} />}
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {!members && <div style={{ padding: 18, color: C.muted, fontSize: 14 }}>{t("loading")}</div>}
        {members && members.length === 0 && <div style={{ padding: 18, color: C.muted, fontSize: 14 }}>{t("noResult")}</div>}
        {members && members.map((m, i) => (
          <div key={m.id} onClick={() => onPick(m.id)} className="sk-btn"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: i === members.length - 1 ? "none" : `1px solid ${C.line}`, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(150deg,${C.blue},#3E63E0)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 700, fontSize: 14 }}>{m.name[0]}</span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 11.5, color: C.muted }}>{m.code} · {m.phone}</div>
              </div>
            </div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: C.gold }}>{fmt(m.savings_total)} F</div>
          </div>
        ))}
      </Card>
    </>
  );
}

function MemberProfile({ session, t, memberId, onClose, onAction }) {
  const [member, setMember] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (session.demo) {
          const m = DEMO_DATA.members.find((x) => x.id === memberId);
          if (alive) setMember({ ...m, savings: [{ id: 1, number: "EP/DEMO/0001", balance: m.savings_total, state: "open" }], loans: [], tontines: [] });
        } else {
          const data = await api(session.base, `/api/v1/agent/member/${memberId}`, { token: session.token });
          if (alive) setMember(data);
        }
      } catch (e) { if (alive) setErr(e.message); }
    })();
    return () => { alive = false; };
  }, [memberId, session]);
  if (err) return <><Header title="—" right={<CloseBtn onClose={onClose} />} /><Card><div style={{ color: C.late, fontSize: 14 }}>{err}</div></Card></>;
  if (!member) return <><Header title="—" right={<CloseBtn onClose={onClose} />} /><Card><div style={{ display: "flex", gap: 8, alignItems: "center", color: C.muted, fontSize: 13 }}><Spinner /> {t("loading")}</div></Card></>;

  const loanResidual = (member.loans || []).reduce((s, l) => s + (l.residual || 0), 0);
  const tontine = (member.tontines || [])[0];

  return (
    <>
      <Header title={member.name} sub={member.code} right={<CloseBtn onClose={onClose} />} />
      <div style={{ borderRadius: 22, padding: 18, color: "#fff", marginBottom: 14, background: `linear-gradient(140deg, ${C.blue}, ${C.blueD})`, boxShadow: "0 18px 38px -22px rgba(31,61,158,.55)" }}>
        <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.8)" }}>{t("savings")}</div>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 30, marginTop: 4 }}>{fmt(member.savings_total)}<span style={{ fontSize: 13, color: "rgba(255,255,255,.8)" }}> F CFA</span></div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)", marginTop: 6 }}>{member.phone}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <Card style={{ padding: 15 }}>
          <div style={{ fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>{t("loans")}</div>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 20, marginTop: 6 }}>{fmt(loanResidual)}<span style={{ fontSize: 11, color: C.muted }}> F</span></div>
        </Card>
        <Card style={{ padding: 15 }}>
          <div style={{ fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>{t("tontines")}</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 7 }}>{tontine ? tontine.name : "—"}</div>
        </Card>
      </div>
      <Card>
        <div style={sect}>{t("actions")}</div>
        <ActionBtn icon={ArrowDownLeft} label={t("deposit")} onClick={() => onAction({ kind: "deposit", member })} />
        {member.loans && member.loans.some((l) => l.residual > 0) &&
          <ActionBtn icon={Landmark} label={t("repay")} onClick={() => onAction({ kind: "repay", member })} />}
      </Card>
    </>
  );
}
function ActionBtn({ icon: I, label, onClick }) {
  return (
    <button onClick={onClick} className="sk-btn"
      style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "none", borderRadius: 12, background: C.bg, color: C.ink, fontWeight: 600, fontSize: 13.5, cursor: "pointer", marginTop: 8, textAlign: "left" }}>
      <span style={{ width: 34, height: 34, borderRadius: 10, background: C.blueT, color: C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}><I size={17} /></span>
      <span style={{ flex: 1 }}>{label}</span>
      <ChevronRight size={17} color={C.muted} />
    </button>
  );
}

function ActionForm({ session, t, action, onClose }) {
  const { kind, member } = action;
  const accounts = member.savings || [];
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState((accounts[0] || {}).id || null);
  const [method, setMethod] = useState("cash");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);
  const title = kind === "deposit" ? t("deposit") : t("repay");

  async function submit() {
    setErr(""); setBusy(true);
    try {
      if (session.demo) { await new Promise((r) => setTimeout(r, 600)); setDone({ ok: true }); }
      else if (kind === "deposit") {
        const res = await api(session.base, "/api/v1/agent/deposit", {
          method: "POST", token: session.token,
          body: { account_id: accountId, amount: Number(amount), reference: method === "momo" ? "MOMO" : "ESPECES" },
        });
        setDone(res);
      } else if (kind === "repay") {
        const loan = (member.loans || []).find((l) => l.residual > 0);
        const res = await api(session.base, "/api/v1/agent/repay", {
          method: "POST", token: session.token, body: { loan_id: loan.id },
        });
        setDone(res);
      }
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  if (done) return (
    <>
      <Header title={title} right={<CloseBtn onClose={onClose} />} />
      <Card style={{ textAlign: "center", padding: 30 }}>
        <CheckCircle2 size={56} color={C.ok} style={{ display: "block", margin: "0 auto 14px" }} />
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 18 }}>{t("success")}</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{t("successSub")}</div>
        <button onClick={onClose} className="sk-btn" style={{ marginTop: 18, padding: "11px 24px", borderRadius: 12, border: "none", background: C.gold, color: C.ink, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>OK</button>
      </Card>
    </>
  );

  const canSubmit = kind === "repay" || (amount && Number(amount) > 0 && accountId);

  return (
    <>
      <Header title={title} sub={member.name} right={<CloseBtn onClose={onClose} />} />
      <Card>
        <label style={lbl}>{t("from")}</label>
        <div style={{ ...inp, background: C.bg, color: C.muted }}>{member.name} · {member.code}</div>

        {kind === "deposit" && (
          accounts.length === 0 ? (
            <div style={{ background: "#FBEDE2", color: C.late, fontSize: 13, padding: 11, borderRadius: 10, marginTop: 12 }}>{t("noAccounts")}</div>
          ) : (
            <>
              <label style={lbl}>{t("selectAccount")}</label>
              <select value={accountId || ""} onChange={(e) => setAccountId(Number(e.target.value))} style={inp}>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.number} — {fmt(a.balance)} F</option>)}
              </select>
              <label style={lbl}>{t("amount")} (F CFA)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" style={{ ...inp, fontFamily: F, fontWeight: 700, fontSize: 22 }} />
              <label style={lbl}>{t("method")}</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ k: "cash", l: t("cash"), I: Plus }, { k: "momo", l: t("momo"), I: Smartphone }].map((o) => {
                  const on = method === o.k; const II = o.I;
                  return (<button key={o.k} onClick={() => setMethod(o.k)} className="sk-btn"
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: 11, borderRadius: 12, border: `1px solid ${on ? C.gold : C.line}`, background: on ? "#FBF1DC" : C.paper, color: on ? C.ink : C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    <II size={15} /> {o.l}
                  </button>);
                })}
              </div>
            </>
          )
        )}

        {err && <div style={{ background: "#FBEDE2", color: C.late, fontSize: 12.5, padding: "9px 11px", borderRadius: 10, marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start" }}><AlertCircle size={15} /><span>{t("errSave")}: {err}</span></div>}

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button onClick={onClose} className="sk-btn" style={{ flex: 1, padding: 12, borderRadius: 12, border: `1px solid ${C.line}`, background: C.paper, color: C.ink, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>{t("cancel")}</button>
          <button disabled={!canSubmit || busy} onClick={submit} className="sk-btn"
            style={{ flex: 2, padding: 12, borderRadius: 12, border: "none", background: canSubmit && !busy ? C.gold : C.line, color: C.ink, fontWeight: 600, fontSize: 13.5, cursor: canSubmit && !busy ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {busy ? <><Spinner /> {t("saving")}</> : t("submit")}
          </button>
        </div>
      </Card>
    </>
  );
}

function EnrollForm({ session, t }) {
  const [form, setForm] = useState({ name: "", phone: "", id: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  async function submit() {
    if (!form.name || !form.phone) return;
    setErr(""); setBusy(true);
    try {
      if (session.demo) {
        await new Promise((r) => setTimeout(r, 500));
        setDone({ name: form.name, code: "MEM/2026/" + String(Math.floor(Math.random() * 90000) + 10000) });
      } else {
        const res = await api(session.base, "/api/v1/agent/enroll", {
          method: "POST", token: session.token,
          body: { name: form.name, phone: form.phone, agency_id: session.agent.agency_id },
        });
        setDone(res);
      }
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  if (done) return (
    <>
      <Header title={t("enroll")} />
      <Card style={{ textAlign: "center", padding: 30 }}>
        <CheckCircle2 size={56} color={C.ok} style={{ display: "block", margin: "0 auto 14px" }} />
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 18 }}>{done.name}</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{done.code}</div>
        <button onClick={() => { setDone(null); setForm({ name: "", phone: "", id: "" }); }} className="sk-btn"
          style={{ marginTop: 18, padding: "11px 24px", borderRadius: 12, border: "none", background: C.gold, color: C.ink, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>{t("new")}</button>
      </Card>
    </>
  );

  return (
    <>
      <Header title={t("enrollTitle")} sub={t("enrollSub")} />
      <Card>
        <label style={lbl}>{t("fullName")}</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inp} />
        <label style={lbl}>{t("phone")}</label>
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+227…" style={inp} />
        <label style={lbl}>{t("id")}</label>
        <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} style={inp} />
        <label style={lbl}>{t("agency")}</label>
        <div style={{ ...inp, background: C.bg, color: C.muted }}>{session.agent.agency || "—"}</div>

        {err && <div style={{ background: "#FBEDE2", color: C.late, fontSize: 12.5, padding: "9px 11px", borderRadius: 10, marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start" }}><AlertCircle size={15} /><span>{t("errSave")}: {err}</span></div>}

        <button disabled={!form.name || !form.phone || busy} onClick={submit} className="sk-btn"
          style={{ width: "100%", marginTop: 18, padding: 13, borderRadius: 13, border: "none", background: (form.name && form.phone && !busy) ? C.gold : C.line, color: C.ink, fontWeight: 600, fontSize: 14, cursor: (form.name && form.phone && !busy) ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {busy ? <><Spinner /> {t("saving")}</> : <><UserPlus size={17} /> {t("submit")}</>}
        </button>
      </Card>
    </>
  );
}

const sect = { fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted, fontWeight: 600, marginBottom: 8 };
const lbl = { display: "block", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: C.muted, fontWeight: 600, margin: "10px 0 5px" };
const inp = { width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.line}`, fontSize: 14, outline: "none", boxSizing: "border-box" };
