import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, Navigate, Routes, Route } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, Clapperboard, FolderOpen, CreditCard, Settings as SettingsIcon, LogOut,
  Plus, Search, Download, RefreshCw, Check, ChevronRight, Globe, Upload,
  Bell, Sparkles, Film, X, Menu,
} from "lucide-react";
import { useStore, Project, PROJECT_STAGES } from "./store";
import { Card, PrimaryButton, GhostButton, Field, TextInput, PasswordInput, StrengthMeter, Wordmark, StatusBadge, Checkbox, BLUE, YELLOW, DISPLAY, BODY, MONO } from "./ui";

// ─── Shell ───────────────────────────────────────────────────────────────────
const NAV = [
  { to: "/dashboard", label: "Home", icon: Home, end: true },
  { to: "/dashboard/create", label: "Create Commercial", icon: Clapperboard },
  { to: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { to: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export function Dashboard() {
  const { user, signOut } = useStore();
  const nav = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (!user.plan) return <Navigate to="/subscribe" replace />;

  const NavItems = ({ onNav }: { onNav?: () => void }) => (
    <nav className="flex-1 space-y-1">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNav}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors"
          style={({ isActive }) => ({
            fontFamily: BODY,
            color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
            background: isActive ? `linear-gradient(135deg, ${BLUE}26, ${BLUE}10)` : "transparent",
            border: isActive ? `1px solid ${BLUE}40` : "1px solid transparent",
          })}
        >
          <Icon size={16} /> {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col p-5 sticky top-0 h-screen" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mb-9 px-1"><Wordmark size={17} /></div>
        <NavItems />
        <button onClick={() => setLogoutOpen(true)} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: BODY }}>
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3 bg-black/85" style={{ backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Wordmark size={15} />
        <button onClick={() => setMobileNav(!mobileNav)} className="p-2 text-white/70" aria-label="Menu">{mobileNav ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      <AnimatePresence>
        {mobileNav && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-30 bg-black/95 pt-20 px-5" style={{ backdropFilter: "blur(20px)" }}>
            <NavItems onNav={() => setMobileNav(false)} />
            <button onClick={() => { setMobileNav(false); setLogoutOpen(true); }} className="mt-2 flex items-center gap-3 px-3.5 py-2.5 text-sm text-white/50" style={{ fontFamily: BODY }}>
              <LogOut size={16} /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 pt-20 lg:pt-10 pb-16 max-w-5xl mx-auto w-full">
        <Routes>
          <Route index element={<DashHome />} />
          <Route path="create" element={<CreateCommercial />} />
          <Route path="projects" element={<Projects />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<SettingsPage onLogout={() => setLogoutOpen(true)} />} />
        </Routes>
      </main>

      {/* Logout modal */}
      <AnimatePresence>
        {logoutOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" style={{ backdropFilter: "blur(8px)" }} onClick={() => setLogoutOpen(false)}>
            <motion.div initial={{ scale: 0.94, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 8 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
              <Card className="p-7 text-center">
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: DISPLAY }}>Sign out?</h3>
                <p className="text-sm text-white/50 mb-6" style={{ fontFamily: BODY }}>Are you sure you want to sign out of your studio?</p>
                <div className="flex gap-3">
                  <GhostButton full onClick={() => setLogoutOpen(false)}>Cancel</GhostButton>
                  <PrimaryButton full onClick={() => { signOut(); nav("/login"); }}>Sign out</PrimaryButton>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PageTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: YELLOW, fontFamily: MONO }}>{eyebrow}</p>}
      <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: DISPLAY }}>{title}</h1>
      {sub && <p className="text-sm text-white/45 mt-1.5" style={{ fontFamily: BODY }}>{sub}</p>}
    </div>
  );
}

// ─── Home ────────────────────────────────────────────────────────────────────
function DashHome() {
  const { user, projects } = useStore();
  const nav = useNavigate();
  const recent = projects.slice(0, 3);
  const active = projects.filter((p) => p.status !== "Delivered").length;
  const delivered = projects.filter((p) => p.status === "Delivered").length;

  return (
    <div>
      <PageTitle eyebrow="Home" title={`Welcome back, ${user!.firstName}.`} sub="Your studio at a glance." />

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1" style={{ fontFamily: MONO }}>Subscription</p>
          <p className="text-lg font-bold text-white" style={{ fontFamily: DISPLAY }}>{user!.plan} <span className="text-[11px] font-normal" style={{ color: YELLOW, fontFamily: MONO }}>Active</span></p>
          <p className="text-xs text-white/40 mt-1" style={{ fontFamily: BODY }}>Renews {user!.renewalDate ? new Date(user!.renewalDate).toLocaleDateString() : "—"}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1" style={{ fontFamily: MONO }}>In production</p>
          <p className="text-2xl font-bold text-white" style={{ fontFamily: DISPLAY }}>{active}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1" style={{ fontFamily: MONO }}>Delivered</p>
          <p className="text-2xl font-bold text-white" style={{ fontFamily: DISPLAY }}>{delivered}</p>
        </Card>
      </div>

      <Card className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" >
        <div>
          <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: DISPLAY }}>Ready for your next commercial?</h3>
          <p className="text-sm text-white/45" style={{ fontFamily: BODY }}>Three quick questions. We handle everything else.</p>
        </div>
        <PrimaryButton onClick={() => nav("/dashboard/create")}>
          <span className="inline-flex items-center gap-2"><Plus size={15} /> Create Commercial</span>
        </PrimaryButton>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: MONO }}>Recent activity</h2>
        {projects.length > 0 && (
          <button onClick={() => nav("/dashboard/projects")} className="text-xs text-white/45 hover:text-white transition-colors inline-flex items-center gap-1" style={{ fontFamily: BODY }}>
            All projects <ChevronRight size={13} />
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <Card className="py-14 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: BLUE + "18", border: `1px solid ${BLUE}35` }}>
            <Film size={26} style={{ color: "#9B93FF" }} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: DISPLAY }}>Your first commercial starts here</h3>
          <p className="text-sm text-white/45 mb-6 max-w-sm" style={{ fontFamily: BODY }}>Tell us what you're promoting and we'll craft a cinematic AI commercial for it.</p>
          <PrimaryButton onClick={() => nav("/dashboard/create")}><span className="inline-flex items-center gap-2"><Sparkles size={15} /> Create your first commercial</span></PrimaryButton>
        </Card>
      ) : (
        <div className="space-y-3">
          {recent.map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: BODY }}>{p.name}</p>
                <p className="text-xs text-white/40 mt-0.5" style={{ fontFamily: MONO }}>{p.duration} · {p.style}</p>
              </div>
              <StatusBadge status={p.status} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Create Commercial ────────────────────────────────────────────────────────
const PROMOTE = ["Business", "Product", "Service", "Offer", "Restaurant", "Real Estate", "Website", "Mobile App", "Event", "Other"];
const DURATIONS = ["15 Seconds", "30 Seconds", "45 Seconds", "60 Seconds", "Other"];
const STYLES = ["Luxury", "Cinematic", "Corporate", "Modern", "Bold", "Emotional", "Minimal", "Funny", "Other"];
const ANALYSIS_LINES = ["Analyzing your website…", "Learning your business…", "Understanding your brand…", "Preparing creative concepts…"];

function Choice({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              fontFamily: BODY,
              color: on ? "#fff" : "rgba(255,255,255,0.5)",
              background: on ? `linear-gradient(135deg, ${BLUE}, #7B6FFF)` : "rgba(255,255,255,0.04)",
              border: on ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: on ? `0 4px 20px ${BLUE}40` : "none",
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function OptionalRow({ label, children, onSkip, skipped }: { label: string; children: React.ReactNode; onSkip: () => void; skipped: boolean }) {
  return (
    <div className="py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-sm text-white/80" style={{ fontFamily: BODY }}>
          {label}
          <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider text-white/40" style={{ border: "1px solid rgba(255,255,255,0.12)", fontFamily: MONO }}>Optional</span>
        </span>
        <button type="button" onClick={onSkip} className="text-xs transition-colors" style={{ fontFamily: MONO, color: skipped ? YELLOW : "rgba(255,255,255,0.4)" }}>
          {skipped ? "Skipped ✓" : "Skip for now"}
        </button>
      </div>
      {!skipped && children}
    </div>
  );
}

function UploadStub({ hint }: { hint: string }) {
  return (
    <button type="button" className="w-full rounded-xl py-8 flex flex-col items-center gap-2 text-white/35 hover:text-white/60 transition-colors" style={{ border: "1px dashed rgba(255,255,255,0.15)" }}>
      <Upload size={18} />
      <span className="text-xs" style={{ fontFamily: BODY }}>{hint}</span>
    </button>
  );
}

function CreateCommercial() {
  const { createProject } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [promote, setPromote] = useState("");
  const [promoteOther, setPromoteOther] = useState("");
  const [duration, setDuration] = useState("");
  const [durationOther, setDurationOther] = useState("");
  const [style, setStyle] = useState("");
  const [styleOther, setStyleOther] = useState("");
  const [website, setWebsite] = useState("");
  const [colors, setColors] = useState("");
  const [cta, setCta] = useState("");
  const [notes, setNotes] = useState("");
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisLine, setAnalysisLine] = useState(0);
  const [done, setDone] = useState<Project | null>(null);

  useEffect(() => {
    if (!analyzing) return;
    if (analysisLine >= ANALYSIS_LINES.length - 1) return;
    const t = setTimeout(() => setAnalysisLine((l) => l + 1), 1100);
    return () => clearTimeout(t);
  }, [analyzing, analysisLine]);

  const req1 = promote && (promote !== "Other" || promoteOther.trim());
  const req2 = duration && (duration !== "Other" || durationOther.trim());
  const req3 = style && (style !== "Other" || styleOther.trim());

  const finalPromote = promote === "Other" ? promoteOther : promote;
  const finalDuration = duration === "Other" ? durationOther : duration;
  const finalStyle = style === "Other" ? styleOther : style;

  const submit = () => {
    const finish = () => {
      const proj = createProject({
        name: `${finalStyle} ${finalPromote} Commercial`,
        promote: finalPromote,
        duration: finalDuration,
        style: finalStyle,
        website: skipped.website ? undefined : website || undefined,
        cta: skipped.cta ? undefined : cta || undefined,
        notes: skipped.notes ? undefined : notes || undefined,
      });
      setAnalyzing(false);
      setDone(proj);
    };
    if (website && !skipped.website) {
      setAnalyzing(true);
      setAnalysisLine(0);
      setTimeout(finish, ANALYSIS_LINES.length * 1100 + 500);
    } else finish();
  };

  if (analyzing)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }} className="w-14 h-14 rounded-2xl mb-8 flex items-center justify-center" style={{ border: `1px solid ${BLUE}50`, background: BLUE + "15" }}>
          <Globe size={22} style={{ color: "#9B93FF" }} />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.p key={analysisLine} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-lg text-white" style={{ fontFamily: DISPLAY }}>
            {ANALYSIS_LINES[analysisLine]}
          </motion.p>
        </AnimatePresence>
        <p className="text-xs text-white/30 mt-3" style={{ fontFamily: MONO }}>{website}</p>
      </div>
    );

  if (done)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: YELLOW + "15", border: `1px solid ${YELLOW}35` }}>
          <Check size={28} style={{ color: YELLOW }} />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: DISPLAY }}>Your commercial is in production</h2>
        <p className="text-sm text-white/50 max-w-sm mb-8" style={{ fontFamily: BODY }}>
          <span className="text-white">{done.name}</span> has been submitted. You'll get an email at every stage — track it live in Projects.
        </p>
        <div className="flex gap-3">
          <PrimaryButton onClick={() => nav("/dashboard/projects")}>Track progress</PrimaryButton>
          <GhostButton onClick={() => { setDone(null); setStep(1); setPromote(""); setDuration(""); setStyle(""); setWebsite(""); }}>Create another</GhostButton>
        </div>
      </div>
    );

  return (
    <div className="max-w-2xl">
      <PageTitle eyebrow={`Step ${step} of 4`} title="Create your commercial" sub="Only three questions are required. Everything else is optional." />

      {/* progress */}
      <div className="flex gap-1.5 mb-10">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="h-1 flex-1 rounded-full transition-colors duration-500" style={{ background: s <= step ? `linear-gradient(90deg, ${BLUE}, #7B6FFF)` : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-5" style={{ fontFamily: DISPLAY }}>What would you like to promote?</h2>
              <Choice options={PROMOTE} value={promote} onChange={setPromote} />
              {promote === "Other" && (
                <div className="mt-4"><TextInput value={promoteOther} onChange={(e) => setPromoteOther(e.target.value)} placeholder="Tell us what you're promoting" /></div>
              )}
              <div className="mt-9 flex justify-end"><PrimaryButton onClick={() => setStep(2)} disabled={!req1}>Continue</PrimaryButton></div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-5" style={{ fontFamily: DISPLAY }}>Video duration</h2>
              <Choice options={DURATIONS} value={duration} onChange={setDuration} />
              {duration === "Other" && (
                <div className="mt-4"><TextInput value={durationOther} onChange={(e) => setDurationOther(e.target.value)} placeholder="Custom duration — e.g. 90 seconds" /></div>
              )}
              <div className="mt-9 flex justify-between"><GhostButton onClick={() => setStep(1)}>Back</GhostButton><PrimaryButton onClick={() => setStep(3)} disabled={!req2}>Continue</PrimaryButton></div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-5" style={{ fontFamily: DISPLAY }}>Video style</h2>
              <Choice options={STYLES} value={style} onChange={setStyle} />
              {style === "Other" && (
                <div className="mt-4"><TextInput value={styleOther} onChange={(e) => setStyleOther(e.target.value)} placeholder="Describe the style you have in mind" /></div>
              )}
              <div className="mt-9 flex justify-between"><GhostButton onClick={() => setStep(2)}>Back</GhostButton><PrimaryButton onClick={() => setStep(4)} disabled={!req3}>Continue</PrimaryButton></div>
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-1" style={{ fontFamily: DISPLAY }}>Anything to add?</h2>
              <p className="text-sm text-white/40 mb-4" style={{ fontFamily: BODY }}>All of this is optional — skip anything and we'll take it from here.</p>

              <OptionalRow label="Business website" skipped={!!skipped.website} onSkip={() => setSkipped((s) => ({ ...s, website: !s.website }))}>
                <TextInput value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourbusiness.com" />
              </OptionalRow>
              <OptionalRow label="Upload logo" skipped={!!skipped.logo} onSkip={() => setSkipped((s) => ({ ...s, logo: !s.logo }))}>
                <UploadStub hint="Drop your logo here — PNG or SVG" />
              </OptionalRow>
              <OptionalRow label="Upload photos" skipped={!!skipped.photos} onSkip={() => setSkipped((s) => ({ ...s, photos: !s.photos }))}>
                <UploadStub hint="Add photos of your business, product, or team" />
              </OptionalRow>
              <OptionalRow label="Upload videos" skipped={!!skipped.videos} onSkip={() => setSkipped((s) => ({ ...s, videos: !s.videos }))}>
                <UploadStub hint="Any existing footage you'd like us to use" />
              </OptionalRow>
              <OptionalRow label="Brand colors" skipped={!!skipped.colors} onSkip={() => setSkipped((s) => ({ ...s, colors: !s.colors }))}>
                <TextInput value={colors} onChange={(e) => setColors(e.target.value)} placeholder="e.g. Navy blue and gold — or hex codes" />
              </OptionalRow>
              <OptionalRow label="Call to action" skipped={!!skipped.cta} onSkip={() => setSkipped((s) => ({ ...s, cta: !s.cta }))}>
                <TextInput value={cta} onChange={(e) => setCta(e.target.value)} placeholder='e.g. "Call today for a free quote"' />
              </OptionalRow>
              <OptionalRow label="Anything else you'd like us to know?" skipped={!!skipped.notes} onSkip={() => setSkipped((s) => ({ ...s, notes: !s.notes }))}>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Tone, must-mention offers, competitors you admire…"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none resize-none"
                  style={{ fontFamily: BODY, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
                />
              </OptionalRow>

              <div className="mt-9 flex justify-between">
                <GhostButton onClick={() => setStep(3)}>Back</GhostButton>
                <PrimaryButton onClick={submit}><span className="inline-flex items-center gap-2"><Sparkles size={15} /> Submit commercial</span></PrimaryButton>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Timeline({ status }: { status: Project["status"] }) {
  const current = PROJECT_STAGES.indexOf(status);
  return (
    <div className="mt-5">
      <div className="flex items-center">
        {PROJECT_STAGES.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center min-w-0">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center transition-colors shrink-0"
                style={{
                  background: i < current ? BLUE : i === current ? `linear-gradient(135deg, ${BLUE}, #7B6FFF)` : "rgba(255,255,255,0.07)",
                  border: i === current ? `1px solid ${YELLOW}80` : "1px solid transparent",
                  boxShadow: i === current ? `0 0 16px ${BLUE}70` : "none",
                }}
              >
                {i < current && <Check size={11} className="text-white" strokeWidth={3} />}
              </div>
            </div>
            {i < PROJECT_STAGES.length - 1 && <div className="h-px flex-1 mx-1" style={{ background: i < current ? BLUE : "rgba(255,255,255,0.08)" }} />}
          </React.Fragment>
        ))}
      </div>
      <div className="hidden sm:flex mt-2">
        {PROJECT_STAGES.map((s, i) => (
          <span key={s} className="flex-1 text-center text-[8px] uppercase tracking-wide truncate px-0.5" style={{ fontFamily: MONO, color: i === current ? YELLOW : i < current ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)" }}>
            {s}
          </span>
        ))}
      </div>
      <p className="sm:hidden mt-2 text-[10px] uppercase tracking-wider text-center" style={{ fontFamily: MONO, color: YELLOW }}>{status}</p>
    </div>
  );
}

function Projects() {
  const { projects, advanceProject } = useStore();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "In Production", "Client Review", "Delivered"];

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const matchQ = p.name.toLowerCase().includes(q.toLowerCase()) || p.style.toLowerCase().includes(q.toLowerCase());
        const matchF =
          filter === "All" ||
          (filter === "Delivered" && p.status === "Delivered") ||
          (filter === "Client Review" && p.status === "Client Review") ||
          (filter === "In Production" && p.status !== "Delivered" && p.status !== "Client Review");
        return matchQ && matchF;
      }),
    [projects, q, filter]
  );

  return (
    <div>
      <PageTitle eyebrow="Projects" title="Your commercials" sub="Every project, tracked from brief to delivery." />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
            style={{ fontFamily: BODY, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors" style={{ fontFamily: BODY, color: filter === f ? "#fff" : "rgba(255,255,255,0.45)", background: filter === f ? `linear-gradient(135deg, ${BLUE}, #7B6FFF)` : "rgba(255,255,255,0.04)", border: filter === f ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="py-14 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: BLUE + "18", border: `1px solid ${BLUE}35` }}>
            <FolderOpen size={26} style={{ color: "#9B93FF" }} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: DISPLAY }}>{projects.length === 0 ? "No projects yet" : "Nothing matches that search"}</h3>
          <p className="text-sm text-white/45 mb-6 max-w-sm" style={{ fontFamily: BODY }}>
            {projects.length === 0 ? "Your commercials will live here — with a live production timeline for each one." : "Try a different search or filter."}
          </p>
          {projects.length === 0 && <PrimaryButton onClick={() => nav("/dashboard/create")}><span className="inline-flex items-center gap-2"><Plus size={15} /> Create Commercial</span></PrimaryButton>}
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((p) => (
            <Card key={p.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-white" style={{ fontFamily: DISPLAY }}>{p.name}</p>
                  <p className="text-xs text-white/40 mt-0.5" style={{ fontFamily: MONO }}>
                    {p.duration} · {p.style} · {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <Timeline status={p.status} />
              <div className="mt-5 flex flex-wrap gap-2.5">
                {p.status === "Delivered" && (
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-black transition-opacity hover:opacity-90" style={{ background: YELLOW, fontFamily: BODY }}>
                    <Download size={13} /> Download
                  </button>
                )}
                {(p.status === "Client Review" || p.status === "Delivered") && (
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white transition-colors" style={{ border: "1px solid rgba(255,255,255,0.12)", fontFamily: BODY }}>
                    <RefreshCw size={13} /> Request revision
                  </button>
                )}
                {p.status !== "Delivered" && (
                  // Demo control: in production the studio team advances stages
                  <button onClick={() => advanceProject(p.id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 transition-colors" style={{ border: "1px dashed rgba(255,255,255,0.12)", fontFamily: MONO }}>
                    Demo: advance stage <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Billing ──────────────────────────────────────────────────────────────────
function Billing() {
  const { user, cancelPlan } = useStore();
  const nav = useNavigate();
  const invoices = user!.plan
    ? [{ id: "INV-" + new Date().getFullYear() + "-001", date: new Date().toLocaleDateString(), amount: user!.plan === "Starter" ? "$49.00" : user!.plan === "Growth" ? "$149.00" : "$299.00", status: "Paid" }]
    : [];

  return (
    <div>
      <PageTitle eyebrow="Billing" title="Plan & payments" sub="Managed securely through Stripe." />

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1" style={{ fontFamily: MONO }}>Current plan</p>
          <p className="text-xl font-bold text-white mb-1" style={{ fontFamily: DISPLAY }}>{user!.plan}</p>
          <p className="text-xs text-white/40" style={{ fontFamily: BODY }}>
            Billed {user!.billing} · Renews {user!.renewalDate ? new Date(user!.renewalDate).toLocaleDateString() : "—"}
          </p>
          <div className="mt-5 flex gap-2.5">
            <PrimaryButton onClick={() => nav("/subscribe")}>Upgrade</PrimaryButton>
            {/* STRIPE: both buttons open the Stripe Customer Portal in production */}
            <GhostButton onClick={() => { cancelPlan(); nav("/subscribe"); }}>Cancel plan</GhostButton>
          </div>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1" style={{ fontFamily: MONO }}>Payment method</p>
          <p className="text-base text-white mt-2" style={{ fontFamily: BODY }}>Visa ending in 4242</p>
          <p className="text-xs text-white/40 mt-1" style={{ fontFamily: MONO }}>Expires 12/28</p>
          <div className="mt-5">
            <GhostButton onClick={() => {}}>Manage in Stripe portal</GhostButton>
          </div>
        </Card>
      </div>

      <Card pad={false}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: MONO }}>Billing history</h3>
        </div>
        {invoices.length === 0 ? (
          <p className="px-6 py-10 text-sm text-white/35 text-center" style={{ fontFamily: BODY }}>Your invoices will appear here after your first payment.</p>
        ) : (
          invoices.map((inv) => (
            <div key={inv.id} className="px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm text-white" style={{ fontFamily: BODY }}>{inv.id}</p>
                <p className="text-xs text-white/40" style={{ fontFamily: MONO }}>{inv.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-white" style={{ fontFamily: MONO }}>{inv.amount}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ color: YELLOW, border: `1px solid ${YELLOW}40`, fontFamily: MONO }}>{inv.status}</span>
                <button className="text-white/40 hover:text-white transition-colors" aria-label="Download invoice"><Download size={15} /></button>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsPage({ onLogout }: { onLogout: () => void }) {
  const { user } = useStore();
  const [first, setFirst] = useState(user!.firstName);
  const [last, setLast] = useState(user!.lastName);
  const [pw, setPw] = useState("");
  const [notif, setNotif] = useState({ production: true, delivery: true, billing: true, tips: false });
  const [lang, setLang] = useState("English");
  const [saved, setSaved] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const flash = (m: string) => { setSaved(m); setTimeout(() => setSaved(""), 2200); };

  return (
    <div className="max-w-2xl">
      <PageTitle eyebrow="Settings" title="Your account" />
      {saved && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-5 px-4 py-2.5 rounded-xl text-sm" style={{ background: YELLOW + "12", border: `1px solid ${YELLOW}35`, color: YELLOW, fontFamily: BODY }}>
          {saved}
        </motion.div>
      )}

      <Card className="mb-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5" style={{ fontFamily: MONO }}>Profile</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name"><TextInput value={first} onChange={(e) => setFirst(e.target.value)} /></Field>
          <Field label="Last name"><TextInput value={last} onChange={(e) => setLast(e.target.value)} /></Field>
        </div>
        <div className="mt-4"><Field label="Business email"><TextInput value={user!.email} disabled style={{ opacity: 0.5 }} /></Field></div>
        <div className="mt-5"><PrimaryButton onClick={() => flash("Profile saved")}>Save changes</PrimaryButton></div>
      </Card>

      <Card className="mb-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5" style={{ fontFamily: MONO }}>Password</h3>
        <Field label="New password"><PasswordInput value={pw} onChange={setPw} autoComplete="new-password" /><StrengthMeter pw={pw} /></Field>
        <div className="mt-5"><PrimaryButton onClick={() => { setPw(""); flash("Password updated"); }} disabled={pw.length < 8}>Update password</PrimaryButton></div>
      </Card>

      <Card className="mb-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5" style={{ fontFamily: MONO }}>Notifications</h3>
        <div className="space-y-3.5">
          {([["production", "Production updates"], ["delivery", "Commercial delivered"], ["billing", "Billing & receipts"], ["tips", "Tips & inspiration"]] as const).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-sm text-white/70" style={{ fontFamily: BODY }}>{label}</span>
              <button
                role="switch"
                aria-checked={notif[k]}
                onClick={() => setNotif((n) => ({ ...n, [k]: !n[k] }))}
                className="w-10 h-6 rounded-full relative transition-colors"
                style={{ background: notif[k] ? BLUE : "rgba(255,255,255,0.1)" }}
              >
                <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: notif[k] ? 18 : 2 }} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5" style={{ fontFamily: MONO }}>Language</h3>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ fontFamily: BODY, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(20,20,24,1)" }}>
          {["English", "Español", "Français", "Deutsch", "हिन्दी", "Português"].map((l) => <option key={l}>{l}</option>)}
        </select>
      </Card>

      <Card>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ fontFamily: MONO, color: "#FF6B6B" }}>Danger zone</h3>
        <p className="text-sm text-white/45 mb-5" style={{ fontFamily: BODY }}>Deleting your account removes all projects and cancels your subscription. This can't be undone.</p>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="px-5 py-3 rounded-xl text-sm font-semibold transition-colors" style={{ color: "#FF6B6B", border: "1px solid rgba(255,107,107,0.35)", fontFamily: BODY }}>
            Delete account
          </button>
        ) : (
          <div className="flex gap-3">
            <GhostButton onClick={() => setConfirmDelete(false)}>Keep my account</GhostButton>
            <button onClick={onLogout} className="px-5 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "#C53030", fontFamily: BODY }}>
              Yes, delete everything
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
