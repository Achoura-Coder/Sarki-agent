import { useState, useEffect } from "react";
import {
  Home, Search, UserPlus, ArrowDownLeft, Users, Wallet, Landmark, ChevronRight,
  LogIn, AlertCircle, Plus, Smartphone, MapPin, CheckCircle2, Languages
} from "lucide-react";

const I18N = {
  fr: {
    space: "Espace agent",
    connectWithToken: "Connecte-toi avec ton jeton API agent.",
    serverAddr: "Adresse du serveur", apiToken: "Jeton API",
    connect: "Se connecter", exploreDemo: "Explorer en mode démonstration",
    loginErr: "Connexion impossible ({e}). Vérifie le jeton.",
    demoBanner: "Mode démonstration — actions non enregistrées",
    home: "Tournée", search: "Membres", enroll: "Enrôler", actions: "Actions",
    hello: "Barka, agent", today: "Aujourd'hui",
    kpiVisits: "Visites prévues", kpiCollected: "Collecté", kpiNew: "Nouveaux membres",
    nextStops: "Prochains arrêts", at: "à",
    searchPh: "Code, nom ou téléphone…",
    profile: "Profil membre", noMember: "Aucun membre sélectionné.",
    savings: "Épargne", loans: "Prêt", tontines: "Tontine", score: "Score",
    deposit: "Enregistrer un dépôt", contribute: "Cotisation tontine", repay: "Remboursement",
    enrollTitle: "Enrôler un nouveau membre", enrollSub: "KYC rapide sur le terrain",
    fullName: "Nom complet", phone: "Téléphone", id: "Pièce d'identité", agency: "Agence",
    submit: "Enregistrer", cancel: "Annuler",
    amount: "Montant", from: "Pour", method: "Mode", cash: "Espèces", momo: "Mobile money",
    success: "Opération enregistrée", successSub: "Synchronisation à la prochaine connexion",
    new: "Nouveau",
  },
  ha: {
    space: "Wurin wakili",
    connectWithToken: "Shiga da tokenkin wakili.",
    serverAddr: "Adireshin sabar", apiToken: "Token na API",
    connect: "Shiga", exploreDemo: "Bincika a yanayin gwaji",
    loginErr: "Ba a iya haɗawa ba ({e}). Duba tokenka.",
    demoBanner: "Yanayin gwaji — ba a adana ayyuka ba",
    home: "Yawo", search: "Mambobi", enroll: "Rajista", actions: "Ayyuka",
    hello: "Barka, wakili", today: "Yau",
    kpiVisits: "Ziyarce-ziyarce", kpiCollected: "An tara", kpiNew: "Sabbin mambobi",
    nextStops: "Tasoshi masu zuwa", at: "a",
    searchPh: "Lambar mamba, suna ko waya…",
    profile: "Bayanin mamba", noMember: "Babu mamba da aka zaba.",
    savings: "Tara", loans: "Bashi", tontines: "Tontin", score: "Maki",
    deposit: "Sa kuɗi", contribute: "Gudummawar tontin", repay: "Biyan bashi",
    enrollTitle: "Yi rajista da sabon mamba", enrollSub: "KYC mai sauri a wuri",
    fullName: "Suna cikakke", phone: "Waya", id: "Takardar shaida", agency: "Reshe",
    submit: "Adana", cancel: "Soke",
    amount: "Adadi", from: "Don", method: "Hanya", cash: "Tsabar kuɗi", momo: "Wayar tarho",
    success: "An adana aikin", successSub: "Aiki tare zai zo ƙarshe da haɗi mai zuwa",
    new: "Sabon",
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
  gold: "#E7B24C", goldS: "#F4CE84", ok: "#2BA46A", okBg: "#E6F6EE",
};
const F = "'Bricolage Grotesque', system-ui, sans-serif";
const SHADOW = "0 12px 32px -18px rgba(19,35,78,.30)";
const fmt = (n) => Number(n || 0).toLocaleString("fr-FR");

const DEMO = {
  agent: { name: "Moussa Ibrahim", agency: "Agence de Niamey", code: "AG/2026/00001" },
  stats: { visits: 6, collected: 145000, newMembers: 2 },
  stops: [
    { time: "09:00", member: "Chafaatou Oumarou", code: "MEM/2026/00002", task: "Cotisation tontine", area: "Niamey, Plateau" },
    { time: "10:30", member: "Aïssa Maïga", code: "MEM/2026/00001", task: "Dépôt épargne", area: "Niamey, Yantala" },
    { time: "14:00", member: "Fatima Issa", code: "MEM/2026/00004", task: "Échéance de prêt", area: "Niamey, Goudel" },
  ],
  members: [
    { code: "MEM/2026/00001", name: "Aïssa Maïga", phone: "+227 90 11 22 33", score: 82, savings: 25000, loanResidual: 0, tontine: "Tontine Albarka" },
    { code: "MEM/2026/00002", name: "Chafaatou Oumarou", phone: "+227 90 00 00 00", score: 78, savings: 10000, loanResidual: 85000, tontine: "Tontine Albarka" },
    { code: "MEM/2026/00003", name: "Ibrahim Sow", phone: "+227 96 12 34 56", score: 71, savings: 18000, loanResidual: 0, tontine: "Tontine Albarka" },
    { code: "MEM/2026/00004", name: "Fatima Issa", phone: "+227 92 55 66 77", score: 65, savings: 8500, loanResidual: 45000, tontine: null },
    { code: "MEM/2026/00005", name: "Moussa Garba", phone: "+227 94 77 88 99", score: 88, savings: 32000, loanResidual: 0, tontine: "Tontine Albarka" },
  ],
};

const CSS = `
.sk-card{transition:box-shadow .2s ease, transform .2s ease}
.sk-lift:hover{transform:translateY(-3px);box-shadow:0 20px 40px -22px rgba(19,35,78,.4)}
.sk-btn{transition:filter .15s ease, transform .15s ease}
.sk-btn:hover{filter:brightness(.96)}
.sk-btn:active{transform:scale(.97)}
button:focus-visible,input:focus-visible{outline:2px solid ${C.blue};outline-offset:2px}
`;

export default function SarkiAgent() {
  const [lang, setLangState] = useState(() => { try { return localStorage.getItem("sarki.lang") || "fr"; } catch { return "fr"; } });
  const setLang = (l) => { setLangState(l); try { localStorage.setItem("sarki.lang", l); } catch {} };
  const t = useT(lang);

  const [data, setData] = useState(null);
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null);

  if (!data) return (<><style>{CSS}</style><Gate t={t} lang={lang} setLang={setLang} onDemo={() => setData({ ...DEMO, demo: true })} /></>);

  const nav = [
    { id: "home", label: t("home"), icon: Home },
    { id: "search", label: t("search"), icon: Search },
    { id: "enroll", label: t("enroll"), icon: UserPlus },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{CSS}</style>
      {data.demo && <div style={{ background: C.goldS, color: C.ink, fontSize: 12.5, textAlign: "center", padding: "6px 10px", fontWeight: 500 }}>{t("demoBanner")}</div>}

      <div className="md:flex" style={{ maxWidth: 1180, margin: "0 auto" }}>
        <aside className="hidden md:flex" style={{ flexDirection: "column", width: 236, background: C.paper, borderRight: `1px solid ${C.line}`, padding: 22, minHeight: "100vh", position: "sticky", top: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Seal /><span style={{ fontFamily: F, fontWeight: 800, fontSize: 21 }}>Sar<span style={{ color: C.blue }}>ki</span> <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: ".08em" }}>AGENT</span></span>
            </div>
            <LangSwitch lang={lang} setLang={setLang} />
          </div>
          {nav.map((n) => { const A = n.icon; const on = view === n.id;
            return (<button key={n.id} onClick={() => { setView(n.id); setSelected(null); setAction(null); }} className="sk-btn" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", border: "none", borderRadius: 13, cursor: "pointer", marginBottom: 4, textAlign: "left", fontSize: 14, fontWeight: on ? 600 : 500, background: on ? C.blueT : "transparent", color: on ? C.blue : C.muted }}><A size={18} /> {n.label}</button>);
          })}
          <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${C.line}`, fontSize: 12, color: C.muted }}>
            <b style={{ color: C.ink, display: "block" }}>{data.agent.name}</b>{data.agent.agency}
          </div>
        </aside>

        <main className="flex-1" style={{ padding: "20px 18px 104px" }}>
          {action ? <ActionForm d={data} t={t} action={action} member={selected} onClose={() => setAction(null)} />
            : selected ? <MemberProfile d={data} t={t} member={selected} onClose={() => setSelected(null)} onAction={setAction} />
            : view === "home" ? <HomeView d={data} t={t} lang={lang} setLang={setLang} onPick={(m) => setSelected(m)} />
            : view === "search" ? <SearchView d={data} t={t} onPick={(m) => setSelected(m)} />
            : view === "enroll" ? <EnrollForm t={t} d={d => setData({ ...data, members: [d, ...data.members] })} />
            : null}
        </main>
      </div>

      <nav className="md:hidden" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,.94)", backdropFilter: "blur(10px)", borderTop: `1px solid ${C.line}`, display: "grid", gridTemplateColumns: "repeat(3,1fr)", padding: "9px 4px 12px" }}>
        {nav.map((n) => { const A = n.icon; const on = view === n.id;
          return (<button key={n.id} onClick={() => { setView(n.id); setSelected(null); setAction(null); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, border: "none", background: "none", cursor: "pointer", color: on ? C.blue : C.muted, fontSize: 11, fontWeight: on ? 600 : 500 }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 26, borderRadius: 13, background: on ? C.blueT : "transparent" }}><A size={19} /></span>{n.label}</button>);
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

function Gate({ t, lang, setLang, onDemo }) {
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
        <input defaultValue="http://213.136.78.130:32823" style={inp} />
        <label style={lbl}>{t("apiToken")}</label>
        <input placeholder="Bearer token…" style={inp} />
        <button disabled className="sk-btn" style={{ width: "100%", marginTop: 16, padding: 13, borderRadius: 13, border: "none", background: C.line, color: C.ink, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <LogIn size={17} /> {t("connect")}
        </button>
        <button onClick={onDemo} className="sk-btn" style={{ width: "100%", marginTop: 9, padding: 12, borderRadius: 13, border: `1px solid ${C.line}`, background: C.paper, color: C.blue, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
          {t("exploreDemo")}
        </button>
      </div>
    </div>
  );
}

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

function HomeView({ d, t, lang, setLang, onPick }) {
  return (
    <>
      <Header title={t("hello")} sub={`${t("today")} · ${d.agent.agency}`}
        right={<span className="md:hidden"><LangSwitch lang={lang} setLang={setLang} /></span>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        <Kpi lbl={t("kpiVisits")} val={d.stats.visits} />
        <Kpi lbl={t("kpiCollected")} val={fmt(d.stats.collected)} unit="F" gold />
        <Kpi lbl={t("kpiNew")} val={d.stats.newMembers} />
      </div>

      <Card>
        <div style={sect}>{t("nextStops")}</div>
        {d.stops.map((s, i) => {
          const member = d.members.find((m) => m.code === s.code);
          return (
            <div key={i} onClick={() => member && onPick(member)} className="sk-btn"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i === d.stops.length - 1 ? "none" : `1px solid ${C.line}`, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 46, padding: "6px 0", borderRadius: 10, background: C.blueT, color: C.blue, fontFamily: F, fontWeight: 700, fontSize: 13 }}>{s.time}</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{s.member}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={11} /> {s.area} · {s.task}
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color={C.muted} />
            </div>
          );
        })}
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

function SearchView({ d, t, onPick }) {
  const [q, setQ] = useState("");
  const filtered = d.members.filter((m) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return m.code.toLowerCase().includes(s) || m.name.toLowerCase().includes(s) || m.phone.replace(/\s/g, "").includes(s.replace(/\s/g, ""));
  });
  return (
    <>
      <Header title={t("search")} sub={`${filtered.length} / ${d.members.length}`} />
      <div style={{ display: "flex", gap: 8, alignItems: "center", background: C.paper, borderRadius: 14, padding: "10px 14px", boxShadow: SHADOW, marginBottom: 14 }}>
        <Search size={18} color={C.muted} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPh")}
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent" }} />
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {filtered.length === 0 && <div style={{ padding: 18, color: C.muted, fontSize: 14 }}>—</div>}
        {filtered.map((m, i) => (
          <div key={m.code} onClick={() => onPick(m)} className="sk-btn"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: i === filtered.length - 1 ? "none" : `1px solid ${C.line}`, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(150deg,${C.blue},#3E63E0)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 700, fontSize: 14 }}>{m.name[0]}</span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 11.5, color: C.muted }}>{m.code} · {m.phone}</div>
              </div>
            </div>
            <ScoreChip v={m.score} t={t} />
          </div>
        ))}
      </Card>
    </>
  );
}

function ScoreChip({ v, t }) {
  const color = v >= 75 ? C.ok : v >= 60 ? C.gold : "#D9743C";
  return <span style={{ fontSize: 11, fontWeight: 600, color, background: `${color}22`, padding: "3px 9px", borderRadius: 20 }}>{t("score")} {v}</span>;
}

function MemberProfile({ d, t, member, onClose, onAction }) {
  return (
    <>
      <Header title={member.name} sub={member.code}
        right={<button onClick={onClose} style={{ border: "none", background: "none", color: C.muted, fontSize: 14, cursor: "pointer" }}>✕</button>} />

      <div style={{ borderRadius: 22, padding: 18, color: "#fff", marginBottom: 14, background: `linear-gradient(140deg, ${C.blue}, ${C.blueD})`, boxShadow: "0 18px 38px -22px rgba(31,61,158,.55)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.8)" }}>{t("savings")}</span>
          <ScoreChip v={member.score} t={t} />
        </div>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 30, marginTop: 4 }}>{fmt(member.savings)}<span style={{ fontSize: 13, color: "rgba(255,255,255,.8)" }}> F CFA</span></div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)", marginTop: 6 }}>{member.phone}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <Card style={{ padding: 15 }}>
          <div style={{ fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>{t("loans")}</div>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 20, marginTop: 6 }}>{fmt(member.loanResidual)}<span style={{ fontSize: 11, color: C.muted }}> F</span></div>
        </Card>
        <Card style={{ padding: 15 }}>
          <div style={{ fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>{t("tontines")}</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 7 }}>{member.tontine || "—"}</div>
        </Card>
      </div>

      <Card>
        <div style={sect}>{t("actions")}</div>
        <ActionBtn icon={ArrowDownLeft} label={t("deposit")} onClick={() => onAction("deposit")} />
        {member.tontine && <ActionBtn icon={Users} label={t("contribute")} onClick={() => onAction("contribute")} />}
        {member.loanResidual > 0 && <ActionBtn icon={Landmark} label={t("repay")} onClick={() => onAction("repay")} />}
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

function ActionForm({ t, action, member, onClose }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [done, setDone] = useState(false);
  const title = action === "deposit" ? t("deposit") : action === "contribute" ? t("contribute") : t("repay");

  if (done) return (
    <>
      <Header title={title} right={<button onClick={onClose} style={{ border: "none", background: "none", color: C.muted, fontSize: 14, cursor: "pointer" }}>✕</button>} />
      <Card style={{ textAlign: "center", padding: 30 }}>
        <CheckCircle2 size={56} color={C.ok} style={{ display: "block", margin: "0 auto 14px" }} />
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 18 }}>{t("success")}</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{t("successSub")}</div>
        <button onClick={onClose} className="sk-btn" style={{ marginTop: 18, padding: "11px 24px", borderRadius: 12, border: "none", background: C.gold, color: C.ink, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>OK</button>
      </Card>
    </>
  );

  return (
    <>
      <Header title={title} sub={member.name}
        right={<button onClick={onClose} style={{ border: "none", background: "none", color: C.muted, fontSize: 14, cursor: "pointer" }}>✕</button>} />
      <Card>
        <label style={lbl}>{t("from")}</label>
        <div style={{ ...inp, background: C.bg, color: C.muted }}>{member.name} · {member.code}</div>

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

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button onClick={onClose} className="sk-btn" style={{ flex: 1, padding: 12, borderRadius: 12, border: `1px solid ${C.line}`, background: C.paper, color: C.ink, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>{t("cancel")}</button>
          <button disabled={!amount || amount <= 0} onClick={() => setDone(true)} className="sk-btn"
            style={{ flex: 2, padding: 12, borderRadius: 12, border: "none", background: amount > 0 ? C.gold : C.line, color: C.ink, fontWeight: 600, fontSize: 13.5, cursor: amount > 0 ? "pointer" : "default" }}>{t("submit")}</button>
        </div>
      </Card>
    </>
  );
}

function EnrollForm({ t, d: addMember }) {
  const [form, setForm] = useState({ name: "", phone: "", id: "", agency: "Agence de Niamey" });
  const [done, setDone] = useState(null);
  function submit() {
    if (!form.name || !form.phone) return;
    const code = "MEM/2026/" + String(Math.floor(Math.random() * 90000) + 10000);
    const member = { code, name: form.name, phone: form.phone, score: 50, savings: 0, loanResidual: 0, tontine: null };
    addMember(member);
    setDone(member);
  }
  if (done) return (
    <>
      <Header title={t("enroll")} />
      <Card style={{ textAlign: "center", padding: 30 }}>
        <CheckCircle2 size={56} color={C.ok} style={{ display: "block", margin: "0 auto 14px" }} />
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 18 }}>{done.name}</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{done.code}</div>
        <button onClick={() => { setDone(null); setForm({ name: "", phone: "", id: "", agency: "Agence de Niamey" }); }} className="sk-btn"
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
        <input value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })} style={inp} />
        <button disabled={!form.name || !form.phone} onClick={submit} className="sk-btn"
          style={{ width: "100%", marginTop: 18, padding: 13, borderRadius: 13, border: "none", background: (form.name && form.phone) ? C.gold : C.line, color: C.ink, fontWeight: 600, fontSize: 14, cursor: (form.name && form.phone) ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <UserPlus size={17} /> {t("submit")}
        </button>
      </Card>
    </>
  );
}

const sect = { fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted, fontWeight: 600, marginBottom: 8 };
const lbl = { display: "block", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: C.muted, fontWeight: 600, margin: "10px 0 5px" };
const inp = { width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.line}`, fontSize: 14, outline: "none", boxSizing: "border-box" };
