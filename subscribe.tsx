import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Check, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { useStore, User } from "./store";
import { Card, PrimaryButton, GhostButton, Wordmark, BLUE, YELLOW, DISPLAY, BODY, MONO } from "./ui";

const PLANS: { name: Exclude<User["plan"], null>; monthly: number; desc: string; features: string[]; highlight?: boolean }[] = [
  { name: "Starter", monthly: 49, desc: "Test the AI advantage risk-free", features: ["1 AI Commercial / month", "30-second cinematic video", "All platform formats", "Commercial license", "3-5 day delivery"] },
  { name: "Growth", monthly: 149, desc: "Most popular for growing businesses", features: ["3 AI Commercials / month", "30-60 second videos", "All platform formats", "Priority 48hr delivery", "2 revision rounds", "Social media captions"], highlight: true },
  { name: "Pro", monthly: 299, desc: "Monthly content domination", features: ["8 commercials / month", "All video lengths", "Rush 24hr delivery", "Dedicated account manager", "Monthly strategy call", "Unlimited revisions"] },
];

export function Subscribe() {
  const { subscribe, user } = useStore();
  const nav = useNavigate();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [processing, setProcessing] = useState<string | null>(null);

  const choose = (plan: Exclude<User["plan"], null>) => {
    setProcessing(plan);
    // STRIPE: create Checkout Session server-side, redirect to session.url.
    // The webhook (checkout.session.completed) activates the plan and sends
    // Welcome + Payment Confirmation + Invoice + Receipt emails.
    setTimeout(() => {
      subscribe(plan, billing);
      nav("/payment-success");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-black px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Wordmark size={20} />
          <span className="inline-flex items-center gap-1.5 text-[11px] text-white/40" style={{ fontFamily: MONO }}>
            <ShieldCheck size={13} /> Secure checkout by Stripe
          </span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: DISPLAY }}>
            {user?.firstName ? `${user.firstName}, choose your plan` : "Choose your plan"}
          </h1>
          <p className="text-white/50 text-sm" style={{ fontFamily: BODY }}>Cancel anytime. Upgrade whenever you're ready to scale.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 mt-7 p-1 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-colors capitalize"
                style={{ fontFamily: BODY, background: billing === b ? `linear-gradient(135deg, ${BLUE}, #7B6FFF)` : "transparent", color: billing === b ? "#fff" : "rgba(255,255,255,0.45)" }}
              >
                {b}
                {b === "yearly" && <span className="ml-1.5 text-[10px]" style={{ color: billing === b ? YELLOW : YELLOW + "99", fontFamily: MONO }}>−20%</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((p, i) => {
            const price = billing === "yearly" ? Math.round(p.monthly * 0.8) : p.monthly;
            return (
              <motion.div key={p.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className={`relative h-full flex flex-col ${p.highlight ? "ring-1" : ""}`} pad>
                  {p.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black" style={{ background: YELLOW, fontFamily: MONO }}>
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: DISPLAY }}>{p.name}</h3>
                  <p className="text-xs text-white/45 mb-5" style={{ fontFamily: BODY }}>{p.desc}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white" style={{ fontFamily: DISPLAY }}>${price}</span>
                    <span className="text-sm text-white/40 ml-1" style={{ fontFamily: BODY }}>/month{billing === "yearly" ? ", billed yearly" : ""}</span>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px] text-white/65" style={{ fontFamily: BODY }}>
                        <Check size={14} className="mt-0.5 shrink-0" style={{ color: p.highlight ? YELLOW : "#9B93FF" }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <PrimaryButton full onClick={() => choose(p.name)} disabled={!!processing}>
                    {processing === p.name ? "Opening secure checkout…" : `Continue with ${p.name}`}
                  </PrimaryButton>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-white/30 mt-10" style={{ fontFamily: MONO }}>
          Payments are processed by Stripe. We never see or store your card details.
        </p>
      </div>
    </div>
  );
}

export function PaymentSuccess() {
  const { user } = useStore();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-lg text-center">
        <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-7" style={{ background: YELLOW + "15", border: `1px solid ${YELLOW}35`, boxShadow: `0 0 60px ${YELLOW}20` }}>
          <Sparkles size={32} style={{ color: YELLOW }} />
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: YELLOW, fontFamily: MONO }}>Subscription active</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: DISPLAY }}>
          Welcome to the studio{user?.firstName ? `, ${user.firstName}` : ""}.
        </h1>
        <p className="text-white/50 text-sm mb-9 leading-relaxed" style={{ fontFamily: BODY }}>
          Your <span className="text-white">{user?.plan}</span> plan is live. A receipt and invoice are on their way to your inbox. Let's make something cinematic.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <PrimaryButton onClick={() => nav("/dashboard/create")}>
            <span className="inline-flex items-center gap-2">Create your first commercial <ArrowRight size={15} /></span>
          </PrimaryButton>
          <GhostButton onClick={() => nav("/dashboard")}>Go to dashboard</GhostButton>
        </div>
      </motion.div>
    </div>
  );
}
