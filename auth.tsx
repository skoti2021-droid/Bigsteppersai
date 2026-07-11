import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { MailCheck, KeyRound, Sparkles } from "lucide-react";
import { useStore } from "./store";
import { AuthShell, PrimaryButton, GhostButton, Field, TextInput, PasswordInput, StrengthMeter, passwordScore, Checkbox, BODY, MONO, BLUE, YELLOW } from "./ui";

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// ─── Sign Up ─────────────────────────────────────────────────────────────────
export function SignUp() {
  const { signUp } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);

  const errors = {
    firstName: !f.firstName.trim() ? "First name is required" : "",
    lastName: !f.lastName.trim() ? "Last name is required" : "",
    email: !f.email ? "Business email is required" : !emailOk(f.email) ? "Enter a valid email address" : "",
    password: passwordScore(f.password) < 3 ? "Use 8+ characters with a number and an uppercase letter" : "",
  };
  const valid = !errors.firstName && !errors.lastName && !errors.email && !errors.password && terms && privacy;

  const submit = async () => {
    setTouched({ firstName: true, lastName: true, email: true, password: true });
    if (!valid) return;
    setBusy(true);
    await signUp(f);
    nav("/verify-email");
  };

  return (
    <AuthShell title="Create your account" sub="Your first cinematic commercial is minutes away." footer={<>Already have an account? <Link to="/login" className="text-white hover:underline">Sign in</Link></>}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" error={touched.firstName ? errors.firstName : ""}>
            <TextInput value={f.firstName} onChange={(e) => setF({ ...f, firstName: e.target.value })} onBlur={() => setTouched((t) => ({ ...t, firstName: true }))} placeholder="Alex" autoComplete="given-name" />
          </Field>
          <Field label="Last name" error={touched.lastName ? errors.lastName : ""}>
            <TextInput value={f.lastName} onChange={(e) => setF({ ...f, lastName: e.target.value })} onBlur={() => setTouched((t) => ({ ...t, lastName: true }))} placeholder="Morgan" autoComplete="family-name" />
          </Field>
        </div>
        <Field label="Business email" error={touched.email ? errors.email : ""}>
          <TextInput type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} onBlur={() => setTouched((t) => ({ ...t, email: true }))} placeholder="you@yourbusiness.com" autoComplete="email" />
        </Field>
        <Field label="Password" error={touched.password ? errors.password : ""}>
          <PasswordInput value={f.password} onChange={(v) => setF({ ...f, password: v })} autoComplete="new-password" />
          <StrengthMeter pw={f.password} />
        </Field>
        <div className="space-y-2.5 pt-1">
          <Checkbox checked={terms} onChange={setTerms}>I agree to the <a href="#/" className="text-white/90 underline">Terms of Service</a></Checkbox>
          <Checkbox checked={privacy} onChange={setPrivacy}>I agree to the <a href="#/" className="text-white/90 underline">Privacy Policy</a></Checkbox>
        </div>
        <div className="pt-2">
          <PrimaryButton full onClick={submit} disabled={busy}>{busy ? "Creating your account…" : "Create account"}</PrimaryButton>
        </div>
      </div>
    </AuthShell>
  );
}

// ─── Verify Email ─────────────────────────────────────────────────────────────
export function VerifyEmail() {
  const { user, verifyEmail } = useStore();
  const nav = useNavigate();
  return (
    <AuthShell title="Check your inbox" sub={`We sent a verification link to ${user?.email || "your email"}.`}>
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: BLUE + "22", border: `1px solid ${BLUE}40` }}>
          <MailCheck size={26} style={{ color: "#9B93FF" }} />
        </div>
        <p className="text-sm text-white/50 mb-7 leading-relaxed" style={{ fontFamily: BODY }}>
          Click the button in the email to verify your account. You'll be redirected to sign in.
        </p>
        {/* Demo mode: simulates clicking the link inside the verification email */}
        <PrimaryButton full onClick={() => { verifyEmail(); nav("/login"); }}>I've verified my email</PrimaryButton>
        <button className="mt-4 text-xs text-white/40 hover:text-white/70 transition-colors" style={{ fontFamily: MONO }}>
          Resend email
        </button>
      </div>
    </AuthShell>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
export function Login() {
  const { signIn, user } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!emailOk(email)) return setErr("Enter a valid email address");
    if (!password) return setErr("Enter your password");
    setErr("");
    setBusy(true);
    await signIn(email, password, remember);
    nav("/dashboard");
  };

  return (
    <AuthShell title="Welcome back" sub="Sign in to your studio." footer={<>New to BIG STEPPERS AI? <Link to="/signup" className="text-white hover:underline">Create an account</Link></>}>
      <div className="space-y-4">
        <Field label="Business email">
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbusiness.com" autoComplete="email" />
        </Field>
        <Field label="Password">
          <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" />
        </Field>
        <div className="flex items-center justify-between">
          <Checkbox checked={remember} onChange={setRemember}>Remember me</Checkbox>
          <Link to="/forgot-password" className="text-[13px] text-white/50 hover:text-white transition-colors" style={{ fontFamily: BODY }}>
            Forgot password?
          </Link>
        </div>
        {err && <p className="text-xs" style={{ color: "#FF6B6B", fontFamily: BODY }}>{err}</p>}
        <PrimaryButton full onClick={submit} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</PrimaryButton>
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] uppercase tracking-wider text-white/30" style={{ fontFamily: MONO }}>or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        {/* Architecture ready — wire to supabase.auth.signInWithOAuth / signInWithOtp */}
        <GhostButton full onClick={() => {}}>Continue with Google</GhostButton>
        <GhostButton full onClick={() => {}}>Email me a magic link</GhostButton>
      </div>
    </AuthShell>
  );
}

// ─── Forgot Password ──────────────────────────────────────────────────────────
export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  if (sent)
    return (
      <AuthShell title="Reset link sent" sub={`If an account exists for ${email}, a reset link is on its way.`}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: YELLOW + "15", border: `1px solid ${YELLOW}30` }}>
            <Sparkles size={26} style={{ color: YELLOW }} />
          </div>
          <p className="text-sm text-white/50 mb-6" style={{ fontFamily: BODY }}>
            Check your inbox and follow the link to choose a new password.
          </p>
          <Link to="/login" className="w-full"><PrimaryButton full>Back to sign in</PrimaryButton></Link>
        </motion.div>
      </AuthShell>
    );

  return (
    <AuthShell title="Reset your password" sub="Enter your email and we'll send you a reset link." footer={<Link to="/login" className="text-white hover:underline">Back to sign in</Link>}>
      <div className="space-y-4">
        <Field label="Business email" error={err}>
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbusiness.com" autoComplete="email" />
        </Field>
        <PrimaryButton
          full
          onClick={() => {
            if (!emailOk(email)) return setErr("Enter a valid email address");
            // SUPABASE: supabase.auth.resetPasswordForEmail(email) → Password Reset email template
            setErr("");
            setSent(true);
          }}
        >
          <span className="inline-flex items-center gap-2"><KeyRound size={15} /> Send reset link</span>
        </PrimaryButton>
      </div>
    </AuthShell>
  );
}
