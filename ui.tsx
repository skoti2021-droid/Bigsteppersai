import React, { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Check } from "lucide-react";

// Exact tokens from the landing page — never introduce a new visual language.
export const BLUE = "#5046FF";
export const YELLOW = "#E5FF00";
export const DISPLAY = "'Bricolage Grotesque', sans-serif";
export const BODY = "'DM Sans', sans-serif";
export const MONO = "'DM Mono', monospace";

export function Wordmark({ size = 18 }: { size?: number }) {
  return (
    <a href="#/" className="inline-flex items-baseline gap-1 select-none" style={{ textDecoration: "none" }}>
      <span className="font-bold text-white tracking-tight" style={{ fontFamily: DISPLAY, fontSize: size }}>
        BIG STEPPERS
      </span>
      <span className="font-bold" style={{ fontFamily: MONO, fontSize: size * 0.72, color: YELLOW }}>
        AI
      </span>
    </a>
  );
}

export function PrimaryButton({ children, onClick, type = "button", full, disabled }: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; full?: boolean; disabled?: boolean }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`px-5 py-3 rounded-xl text-sm font-semibold text-white transition-opacity ${full ? "w-full" : ""} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      style={{ background: `linear-gradient(135deg, ${BLUE}, #7B6FFF)`, boxShadow: disabled ? "none" : `0 8px 32px ${BLUE}45`, fontFamily: BODY }}
    >
      {children}
    </motion.button>
  );
}

export function GhostButton({ children, onClick, full }: { children: React.ReactNode; onClick?: () => void; full?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-colors ${full ? "w-full" : ""}`}
      style={{ border: "1px solid rgba(255,255,255,0.12)", fontFamily: BODY }}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "", pad = true }: { children: React.ReactNode; className?: string; pad?: boolean }) {
  return (
    <div className={`rounded-2xl bg-gray-900 ${pad ? "p-6" : ""} ${className}`} style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
      {children}
    </div>
  );
}

export function Field({ label, optional, error, children }: { label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 mb-1.5 text-[13px] text-white/70" style={{ fontFamily: BODY }}>
        {label}
        {optional && (
          <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider text-white/40" style={{ border: "1px solid rgba(255,255,255,0.12)", fontFamily: MONO }}>
            Optional
          </span>
        )}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-xs" style={{ color: "#FF6B6B", fontFamily: BODY }}>
          {error}
        </span>
      )}
    </label>
  );
}

export const inputStyle: React.CSSProperties = {
  fontFamily: BODY,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
};

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-shadow focus:ring-2 ${props.className || ""}`}
      style={{ ...inputStyle, ...(props.style || {}), ["--tw-ring-color" as string]: BLUE + "66" }}
    />
  );
}

export function PasswordInput({ value, onChange, placeholder = "Password", autoComplete }: { value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <TextInput type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export function passwordScore(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0–4
}

export function StrengthMeter({ pw }: { pw: string }) {
  const score = passwordScore(pw);
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  const colors = ["rgba(255,255,255,0.15)", "#FF6B6B", "#FFB86B", "#7B6FFF", YELLOW];
  if (!pw) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ background: i < score ? colors[score] : "rgba(255,255,255,0.1)" }} />
        ))}
      </div>
      <span className="mt-1 block text-[11px]" style={{ color: colors[score], fontFamily: MONO }}>
        {labels[score]}
      </span>
    </div>
  );
}

export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="mt-0.5 w-4.5 h-4.5 min-w-[18px] h-[18px] rounded-md flex items-center justify-center transition-colors"
        style={{ background: checked ? BLUE : "rgba(255,255,255,0.06)", border: checked ? "none" : "1px solid rgba(255,255,255,0.15)" }}
      >
        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
      </button>
      <span className="text-[13px] text-white/60 leading-snug" style={{ fontFamily: BODY }}>
        {children}
      </span>
    </label>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const done = status === "Delivered";
  const review = status === "Client Review";
  const color = done ? YELLOW : review ? "#7B6FFF" : "rgba(255,255,255,0.6)";
  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
      style={{ color, border: `1px solid ${done || review ? color + "50" : "rgba(255,255,255,0.15)"}`, background: "rgba(0,0,0,0.4)", fontFamily: MONO }}
    >
      {status}
    </span>
  );
}

export function AuthShell({ title, sub, children, footer }: { title: string; sub?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Wordmark size={22} />
      </div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-white mb-1.5" style={{ fontFamily: DISPLAY }}>
            {title}
          </h1>
          {sub && (
            <p className="text-sm text-white/50 mb-7" style={{ fontFamily: BODY }}>
              {sub}
            </p>
          )}
          {children}
        </Card>
        {footer && <div className="mt-5 text-center text-sm text-white/50" style={{ fontFamily: BODY }}>{footer}</div>}
      </motion.div>
    </div>
  );
}
