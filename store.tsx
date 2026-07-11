import React, { createContext, useContext, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// BIG STEPPERS AI — App Store
// Demo-mode state layer. Every function marked `// SUPABASE:` is the exact
// point where the real Supabase / Stripe call plugs in. UI never changes.
// ─────────────────────────────────────────────────────────────────────────────

export type Video = {
  id: string;
  industry: string;
  title: string;
  views: string;
  aspect: "9:16";
  img: string; // thumbnail
  reelUrl?: string; // instagram permalink
  videoUrl?: string; // direct mp4 (self-hosted)
  source: "seed" | "manual" | "instagram";
  addedAt: string;
};

export type ProjectStatus =
  | "Submitted"
  | "Creative Review"
  | "Script"
  | "AI Generation"
  | "Editing"
  | "Quality Check"
  | "Client Review"
  | "Delivered";

export const PROJECT_STAGES: ProjectStatus[] = [
  "Submitted",
  "Creative Review",
  "Script",
  "AI Generation",
  "Editing",
  "Quality Check",
  "Client Review",
  "Delivered",
];

export type Project = {
  id: string;
  name: string;
  promote: string;
  duration: string;
  style: string;
  website?: string;
  cta?: string;
  notes?: string;
  status: ProjectStatus;
  createdAt: string;
  deliveredUrl?: string;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  plan: "Starter" | "Growth" | "Pro" | null;
  billing: "monthly" | "yearly" | null;
  renewalDate: string | null;
};

// guarded persistence — never crashes in sandboxed previews
const save = (k: string, v: unknown) => {
  try {
    window.localStorage.setItem("bsai_" + k, JSON.stringify(v));
  } catch {}
};
const load = <T,>(k: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem("bsai_" + k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const SEED_VIDEOS: Video[] = [
  { industry: "Roofing", title: "Elite Roofing Solutions", views: "2.4M", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=450&h=800&fit=crop&auto=format" },
  { industry: "Dentist", title: "Bright Smile Studio", views: "1.8M", img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=450&h=800&fit=crop&auto=format" },
  { industry: "Restaurant", title: "The Golden Fork", views: "3.1M", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=450&h=800&fit=crop&auto=format" },
  { industry: "Real Estate", title: "Thompson Luxury Homes", views: "950K", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=450&h=800&fit=crop&auto=format" },
  { industry: "HVAC", title: "Arctic Air Systems", views: "780K", img: "https://images.unsplash.com/photo-1558002038-bb4237bb4e07?w=450&h=800&fit=crop&auto=format" },
  { industry: "Med Spa", title: "Luxe Wellness & Aesthetics", views: "1.2M", img: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=450&h=800&fit=crop&auto=format" },
  { industry: "Law Firm", title: "Morrison & Associates", views: "620K", img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=450&h=800&fit=crop&auto=format" },
  { industry: "Plumbing", title: "ProFlow Solutions", views: "890K", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=450&h=800&fit=crop&auto=format" },
  { industry: "Solar", title: "Green Energy Solar", views: "1.5M", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=450&h=800&fit=crop&auto=format" },
  { industry: "Gym", title: "Iron Temple Fitness", views: "2.1M", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=450&h=800&fit=crop&auto=format" },
  { industry: "Auto Detailing", title: "Prestige Auto Detail", views: "740K", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=450&h=800&fit=crop&auto=format" },
  { industry: "Landscaping", title: "Verdant Gardens", views: "680K", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=450&h=800&fit=crop&auto=format" },
].map((v, i) => ({ ...v, id: "seed-" + (i + 1), aspect: "9:16" as const, source: "seed" as const, addedAt: new Date().toISOString() }));

type Store = {
  user: User | null;
  videos: Video[];
  projects: Project[];
  signUp: (u: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  verifyEmail: () => void;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => void;
  subscribe: (plan: User["plan"], billing: "monthly" | "yearly") => void;
  cancelPlan: () => void;
  addVideo: (v: Omit<Video, "id" | "addedAt" | "aspect">) => void;
  removeVideo: (id: string) => void;
  createProject: (p: Omit<Project, "id" | "status" | "createdAt">) => Project;
  advanceProject: (id: string) => void;
};

const Ctx = createContext<Store | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load("user", null));
  const [videos, setVideos] = useState<Video[]>(() => load("videos", SEED_VIDEOS));
  const [projects, setProjects] = useState<Project[]>(() => load("projects", []));

  const signUp: Store["signUp"] = useCallback(async ({ firstName, lastName, email }) => {
    // SUPABASE: supabase.auth.signUp({ email, password, options:{ data:{ firstName, lastName } } })
    // → triggers the "Verify Email" template in src/emails/templates.ts
    const u: User = { firstName, lastName, email, verified: false, plan: null, billing: null, renewalDate: null };
    setUser(u);
    save("user", u);
  }, []);

  const verifyEmail = useCallback(() => {
    // SUPABASE: handled by the email link → /auth/confirm redirect
    setUser((u) => {
      const next = u ? { ...u, verified: true } : u;
      save("user", next);
      return next;
    });
  }, []);

  const signIn: Store["signIn"] = useCallback(async (email) => {
    // SUPABASE: supabase.auth.signInWithPassword({ email, password })
    // Magic link ready: supabase.auth.signInWithOtp({ email })
    // Google ready:     supabase.auth.signInWithOAuth({ provider: "google" })
    setUser((u) => {
      const next: User = u && u.email === email ? { ...u, verified: true } : { firstName: email.split("@")[0], lastName: "", email, verified: true, plan: null, billing: null, renewalDate: null };
      save("user", next);
      return next;
    });
  }, []);

  const signOut = useCallback(() => {
    // SUPABASE: supabase.auth.signOut()
    setUser(null);
    save("user", null);
  }, []);

  const subscribe: Store["subscribe"] = useCallback((plan, billing) => {
    // STRIPE: redirect to Stripe Checkout session; webhook marks plan active
    // → triggers Welcome + Payment Confirmation + Invoice + Receipt emails
    const renewal = new Date();
    renewal.setMonth(renewal.getMonth() + (billing === "yearly" ? 12 : 1));
    setUser((u) => {
      const next = u ? { ...u, plan, billing, renewalDate: renewal.toISOString() } : u;
      save("user", next);
      return next;
    });
  }, []);

  const cancelPlan = useCallback(() => {
    // STRIPE: open Stripe Customer Portal (portal handles cancel/upgrade/payment method)
    setUser((u) => {
      const next = u ? { ...u, plan: null, billing: null, renewalDate: null } : u;
      save("user", next);
      return next;
    });
  }, []);

  const addVideo: Store["addVideo"] = useCallback((v) => {
    // SUPABASE: insert into `videos` table — the same table the Instagram
    // Edge Function writes to. Landing grid reads this table.
    setVideos((prev) => {
      const next: Video[] = [{ ...v, aspect: "9:16" as const, id: "v-" + Date.now(), addedAt: new Date().toISOString() }, ...prev];
      save("videos", next);
      return next;
    });
  }, []);

  const removeVideo = useCallback((id: string) => {
    setVideos((prev) => {
      const next = prev.filter((v) => v.id !== id);
      save("videos", next);
      return next;
    });
  }, []);

  const createProject: Store["createProject"] = useCallback((p) => {
    // SUPABASE: insert into `projects` → triggers "Commercial Received" email
    const proj: Project = { ...p, id: "p-" + Date.now(), status: "Submitted", createdAt: new Date().toISOString() };
    setProjects((prev) => {
      const next = [proj, ...prev];
      save("projects", next);
      return next;
    });
    return proj;
  }, []);

  const advanceProject = useCallback((id: string) => {
    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id !== id) return p;
        const i = PROJECT_STAGES.indexOf(p.status);
        return i < PROJECT_STAGES.length - 1 ? { ...p, status: PROJECT_STAGES[i + 1] } : p;
      });
      save("projects", next);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ user, videos, projects, signUp, verifyEmail, signIn, signOut, subscribe, cancelPlan, addVideo, removeVideo, createProject, advanceProject }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside <AppProvider>");
  return s;
}
