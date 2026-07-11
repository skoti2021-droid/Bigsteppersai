import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Instagram, Trash2, Plus, Zap, Mail, Film, Check, Copy, ExternalLink } from "lucide-react";
import { useStore } from "./store";
import { Card, PrimaryButton, GhostButton, Field, TextInput, Wordmark, BLUE, YELLOW, DISPLAY, BODY, MONO } from "./ui";
import { EMAILS } from "../emails/templates";

// ─────────────────────────────────────────────────────────────────────────────
// Hidden admin panel — not linked anywhere. Reachable only at #/admin.
// Change ADMIN_PASSCODE before going live (or replace the gate with a
// Supabase role check: profiles.role === 'admin').
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_PASSCODE = "bigsteppers2026";

const INDUSTRIES = ["Roofing", "Dentist", "Restaurant", "Real Estate", "HVAC", "Med Spa", "Law Firm", "Plumbing", "Solar", "Gym", "Auto Detailing", "Landscaping", "Barbershop", "Home Remodeling", "Pest Control", "Luxury Brand", "Other"];

export function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"reels" | "autosync" | "emails">("reels");

  if (!unlocked)
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="mb-8"><Wordmark size={20} /></div>
        <Card className="w-full max-w-sm p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: YELLOW, fontFamily: MONO }}>Admin</p>
          <h1 className="text-xl font-bold text-white mb-5" style={{ fontFamily: DISPLAY }}>Studio control room</h1>
          <Field label="Passcode" error={err}>
            <TextInput type="password" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (code === ADMIN_PASSCODE ? setUnlocked(true) : setErr("Incorrect passcode"))} placeholder="••••••••••••" />
          </Field>
          <div className="mt-5">
            <PrimaryButton full onClick={() => (code === ADMIN_PASSCODE ? setUnlocked(true) : setErr("Incorrect passcode"))}>Enter</PrimaryButton>
          </div>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: YELLOW, fontFamily: MONO }}>Admin</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: DISPLAY }}>Studio control room</h1>
          </div>
          <Wordmark size={15} />
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto">
          {([["reels", "Website Reels", Film], ["autosync", "Instagram Auto-Sync", Zap], ["emails", "Email Templates", Mail]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors" style={{ fontFamily: BODY, color: tab === id ? "#fff" : "rgba(255,255,255,0.45)", background: tab === id ? `linear-gradient(135deg, ${BLUE}, #7B6FFF)` : "rgba(255,255,255,0.04)", border: tab === id ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)" }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {tab === "reels" && <ReelManager />}
        {tab === "autosync" && <AutoSync />}
        {tab === "emails" && <EmailPreviews />}
      </div>
    </div>
  );
}

// ─── Option 1: 10-second manual reel add ─────────────────────────────────────
function ReelManager() {
  const { videos, addVideo, removeVideo } = useStore();
  const [reelUrl, setReelUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [title, setTitle] = useState("");
  const [thumb, setThumb] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [err, setErr] = useState("");
  const [added, setAdded] = useState(false);

  const submit = () => {
    if (!reelUrl.trim()) return setErr("Paste the Instagram reel link");
    if (!industry) return setErr("Pick an industry so it lands under the right title");
    if (!title.trim()) return setErr("Give it a title — this shows on the card");
    setErr("");
    addVideo({
      industry,
      title: title.trim(),
      views: "New",
      img: thumb.trim() || `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=450&h=800&fit=crop&auto=format`,
      reelUrl: reelUrl.trim(),
      videoUrl: videoUrl.trim() || undefined,
      source: "manual",
    });
    setReelUrl(""); setTitle(""); setThumb(""); setVideoUrl(""); setIndustry("");
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <Card>
        <div className="flex items-center gap-2.5 mb-1">
          <Instagram size={17} style={{ color: "#9B93FF" }} />
          <h2 className="text-base font-bold" style={{ fontFamily: DISPLAY }}>Add a reel to the website</h2>
        </div>
        <p className="text-xs text-white/40 mb-6" style={{ fontFamily: BODY }}>Paste the link, pick the industry — it's live on the landing page grid instantly.</p>

        <div className="space-y-4">
          <Field label="Instagram reel link">
            <TextInput value={reelUrl} onChange={(e) => setReelUrl(e.target.value)} placeholder="https://www.instagram.com/reel/…" />
          </Field>
          <Field label="Industry">
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ fontFamily: BODY, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(20,20,24,1)" }}>
              <option value="">Choose the industry…</option>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Card title">
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Skyline Roofing Co." />
          </Field>
          <Field label="Thumbnail image URL" optional>
            <TextInput value={thumb} onChange={(e) => setThumb(e.target.value)} placeholder="https://… (9:16 image)" />
          </Field>
          <Field label="Direct video URL" optional>
            <TextInput value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://… (mp4 — plays natively instead of linking out)" />
          </Field>
          {err && <p className="text-xs" style={{ color: "#FF6B6B", fontFamily: BODY }}>{err}</p>}
          <PrimaryButton full onClick={submit}>
            <span className="inline-flex items-center gap-2">{added ? <><Check size={15} /> Added — it's live</> : <><Plus size={15} /> Add to website</>}</span>
          </PrimaryButton>
        </div>
      </Card>

      <Card pad={false}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily: MONO }}>Live on the site</h3>
          <span className="text-xs text-white/35" style={{ fontFamily: MONO }}>{videos.length} videos</span>
        </div>
        <div className="max-h-[520px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {videos.map((v) => (
              <motion.div key={v.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 px-6 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <img src={v.img} alt="" className="w-9 h-14 object-cover rounded-lg shrink-0" style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate" style={{ fontFamily: BODY }}>{v.title}</p>
                  <p className="text-[10px] uppercase tracking-wider" style={{ fontFamily: MONO, color: v.source === "seed" ? "rgba(255,255,255,0.3)" : v.source === "manual" ? "#9B93FF" : YELLOW }}>
                    {v.industry} · {v.source === "seed" ? "original" : v.source}
                  </p>
                </div>
                {v.reelUrl && (
                  <a href={v.reelUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-colors" aria-label="Open reel"><ExternalLink size={14} /></a>
                )}
                <button onClick={() => removeVideo(v.id)} className="text-white/25 hover:text-red-400 transition-colors" aria-label="Remove"><Trash2 size={14} /></button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}

// ─── Option 2: Fully automatic Instagram Graph API sync ──────────────────────
const DEFAULT_MAP: [string, string][] = [
  ["#roofing", "Roofing"], ["#dentist", "Dentist"], ["#restaurant", "Restaurant"],
  ["#realestate", "Real Estate"], ["#hvac", "HVAC"], ["#medspa", "Med Spa"],
  ["#lawfirm", "Law Firm"], ["#plumbing", "Plumbing"], ["#solar", "Solar"],
  ["#gym", "Gym"], ["#autodetailing", "Auto Detailing"], ["#landscaping", "Landscaping"],
];

function AutoSync() {
  const [map, setMap] = useState<[string, string][]>(DEFAULT_MAP);
  const [newTag, setNewTag] = useState("");
  const [newInd, setNewInd] = useState("");
  const [copied, setCopied] = useState(false);

  const copyMap = () => {
    const json = JSON.stringify(Object.fromEntries(map), null, 2);
    try { navigator.clipboard.writeText(json); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
          <div className="flex items-center gap-2.5">
            <Zap size={17} style={{ color: YELLOW }} />
            <h2 className="text-base font-bold" style={{ fontFamily: DISPLAY }}>Instagram auto-sync</h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ color: "#FFB86B", border: "1px solid rgba(255,184,107,0.35)", fontFamily: MONO }}>
            Not connected — setup required
          </span>
        </div>
        <p className="text-sm text-white/50 leading-relaxed mb-6" style={{ fontFamily: BODY }}>
          Post a reel with a hashtag from the map below and it appears on the website under that industry — no touching the site. Runs on a Supabase Edge Function that checks your feed every 30 minutes via the Instagram Graph API.
        </p>

        <div className="rounded-xl p-5 mb-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[10px] uppercase tracking-wider mb-4" style={{ color: YELLOW, fontFamily: MONO }}>One-time setup — about 20 minutes</p>
          <ol className="space-y-3 text-sm text-white/60 list-none" style={{ fontFamily: BODY }}>
            {[
              ["1", "Switch your Instagram to a Business or Creator account and link it to a Facebook Page (Instagram settings → Account type)."],
              ["2", "Create a free app at developers.facebook.com → add the “Instagram Graph API” product."],
              ["3", "Generate a long-lived access token for your account (60 days, auto-refreshed by the sync function)."],
              ["4", "Deploy the ready-made Edge Function in supabase/functions/instagram-sync — add your token as a Supabase secret."],
              ["5", "Run supabase/schema.sql once to create the videos + hashtag map tables. Done — post with a hashtag and it's live."],
            ].map(([n, t]) => (
              <li key={n} className="flex gap-3">
                <span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background: BLUE + "30", color: "#9B93FF", fontFamily: MONO }}>{n}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-[11px] text-white/30" style={{ fontFamily: MONO }}>
          The Edge Function code, database schema, and full instructions ship with the project in /supabase.
        </p>
      </Card>

      <Card>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily: MONO }}>Hashtag → industry map</h3>
          <button onClick={copyMap} className="inline-flex items-center gap-1.5 text-xs text-white/45 hover:text-white transition-colors" style={{ fontFamily: MONO }}>
            <Copy size={12} /> {copied ? "Copied" : "Copy as JSON"}
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 mb-5">
          {map.map(([tag, ind], i) => (
            <div key={tag} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-sm" style={{ fontFamily: MONO, color: "#9B93FF" }}>{tag}</span>
              <span className="text-xs text-white/60" style={{ fontFamily: BODY }}>→ {ind}</span>
              <button onClick={() => setMap(map.filter((_, j) => j !== i))} className="text-white/20 hover:text-red-400 transition-colors" aria-label="Remove mapping"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <TextInput value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="#hashtag" />
          <select value={newInd} onChange={(e) => setNewInd(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ fontFamily: BODY, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(20,20,24,1)" }}>
            <option value="">Industry…</option>
            {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
          </select>
          <GhostButton onClick={() => {
            const t = newTag.trim().toLowerCase();
            if (!t.startsWith("#") || !newInd) return;
            setMap([...map, [t, newInd]]);
            setNewTag(""); setNewInd("");
          }}>Add</GhostButton>
        </div>
      </Card>
    </div>
  );
}

// ─── Email previews ───────────────────────────────────────────────────────────
function EmailPreviews() {
  const keys = Object.keys(EMAILS);
  const [active, setActive] = useState(keys[0]);
  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-5 items-start">
      <Card pad={false} className="lg:sticky lg:top-6">
        <div className="p-2 max-h-[560px] overflow-y-auto">
          {keys.map((k) => (
            <button key={k} onClick={() => setActive(k)} className="w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] transition-colors" style={{ fontFamily: BODY, color: active === k ? "#fff" : "rgba(255,255,255,0.45)", background: active === k ? BLUE + "22" : "transparent", border: active === k ? `1px solid ${BLUE}40` : "1px solid transparent" }}>
              {EMAILS[k].name}
            </button>
          ))}
        </div>
      </Card>
      <Card pad={false} className="overflow-hidden">
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-xs" style={{ fontFamily: MONO, color: "rgba(255,255,255,0.5)" }}>{EMAILS[active].name} — live preview</span>
          <span className="text-[10px] uppercase tracking-wider text-white/25" style={{ fontFamily: MONO }}>src/emails/templates.ts</span>
        </div>
        <iframe title={EMAILS[active].name} srcDoc={EMAILS[active].html} className="w-full bg-black" style={{ height: 640, border: "none" }} />
      </Card>
    </div>
  );
}
