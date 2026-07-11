// ─────────────────────────────────────────────────────────────────────────────
// BIG STEPPERS AI — Transactional email templates
// Mobile-responsive, inline-styled HTML. Plug into Supabase Auth templates /
// Resend / Postmark. Every template shares one branded base.
// ─────────────────────────────────────────────────────────────────────────────

const BLUE = "#5046FF";
const YELLOW = "#E5FF00";

type BaseArgs = {
  preheader: string;
  eyebrow: string;
  title: string;
  body: string; // inner HTML paragraphs
  ctaLabel?: string;
  ctaUrl?: string;
  footNote?: string;
};

export function baseEmail({ preheader, eyebrow, title, body, ctaLabel, ctaUrl, footNote }: BaseArgs): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0C;font-family:'DM Sans','Helvetica Neue',Arial,sans-serif;">
<span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0C;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
  <!-- Wordmark -->
  <tr><td align="center" style="padding-bottom:28px;">
    <span style="font-size:18px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;">BIG STEPPERS</span>
    <span style="font-size:13px;font-weight:700;color:${YELLOW};font-family:'DM Mono',monospace;">&nbsp;AI</span>
  </td></tr>
  <!-- Card -->
  <tr><td style="background:#141418;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:36px 32px;">
    <p style="margin:0 0 10px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:${YELLOW};font-family:'DM Mono',monospace;">${eyebrow}</p>
    <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#FFFFFF;font-weight:800;">${title}</h1>
    <div style="font-size:14px;line-height:1.65;color:rgba(255,255,255,0.62);">${body}</div>
    ${ctaLabel ? `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr><td style="border-radius:12px;background:linear-gradient(135deg,${BLUE},#7B6FFF);">
      <a href="${ctaUrl || "#"}" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:12px;">${ctaLabel}</a>
    </td></tr></table>` : ""}
    ${footNote ? `<p style="margin:24px 0 0;font-size:12px;color:rgba(255,255,255,0.35);">${footNote}</p>` : ""}
  </td></tr>
  <!-- Footer -->
  <tr><td align="center" style="padding-top:28px;">
    <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.4);">
      <a href="{{dashboard_url}}" style="color:rgba(255,255,255,0.6);text-decoration:none;">Dashboard</a>&nbsp;&nbsp;·&nbsp;&nbsp;
      <a href="mailto:support@bigsteppersai.com" style="color:rgba(255,255,255,0.6);text-decoration:none;">support@bigsteppersai.com</a>
    </p>
    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">BIG STEPPERS AI · Premium AI Video Commercials<br>You're receiving this because you have an account with us.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

const p = (t: string) => `<p style="margin:0 0 14px;">${t}</p>`;
const row = (label: string, value: string) =>
  `<tr><td style="padding:8px 0;font-size:13px;color:rgba(255,255,255,0.45);">${label}</td><td align="right" style="padding:8px 0;font-size:13px;color:#FFFFFF;font-family:'DM Mono',monospace;">${value}</td></tr>`;
const table = (rows: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;border-top:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);">${rows}</table>`;

export const EMAILS: Record<string, { name: string; html: string }> = {
  verifyEmail: {
    name: "Verify Email",
    html: baseEmail({
      preheader: "Confirm your email to activate your BIG STEPPERS AI account.",
      eyebrow: "Verify your email",
      title: "One click and you're in.",
      body: p("Hi {{first_name}},") + p("Welcome to BIG STEPPERS AI. Confirm your email address to activate your account and start creating cinematic AI commercials."),
      ctaLabel: "Verify email address",
      ctaUrl: "{{verify_url}}",
      footNote: "This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.",
    }),
  },
  welcome: {
    name: "Welcome",
    html: baseEmail({
      preheader: "Your studio is ready.",
      eyebrow: "Welcome",
      title: "Welcome to the studio, {{first_name}}.",
      body: p("Your account is verified and your studio is ready.") + p("From here it takes three quick questions to put your first commercial into production — we handle the script, visuals, voiceover, and edit."),
      ctaLabel: "Create your first commercial",
      ctaUrl: "{{dashboard_url}}/create",
    }),
  },
  paymentSuccess: {
    name: "Payment Confirmation",
    html: baseEmail({
      preheader: "Your subscription is active.",
      eyebrow: "Payment confirmed",
      title: "Your {{plan_name}} plan is active.",
      body: p("Hi {{first_name}}, thanks — your payment went through and your subscription is live.") + table(row("Plan", "{{plan_name}}") + row("Billing", "{{billing_cycle}}") + row("Amount", "{{amount}}") + row("Next renewal", "{{renewal_date}}")),
      ctaLabel: "Go to dashboard",
      ctaUrl: "{{dashboard_url}}",
    }),
  },
  invoice: {
    name: "Invoice",
    html: baseEmail({
      preheader: "Your invoice from BIG STEPPERS AI.",
      eyebrow: "Invoice {{invoice_number}}",
      title: "Your invoice is ready.",
      body: p("Hi {{first_name}}, here's your invoice for this billing period.") + table(row("Invoice", "{{invoice_number}}") + row("Date", "{{invoice_date}}") + row("Plan", "{{plan_name}}") + row("Total", "{{amount}}")),
      ctaLabel: "Download invoice (PDF)",
      ctaUrl: "{{invoice_url}}",
      footNote: "You can find all invoices anytime under Billing in your dashboard.",
    }),
  },
  receipt: {
    name: "Receipt",
    html: baseEmail({
      preheader: "Payment received — thank you.",
      eyebrow: "Receipt",
      title: "Payment received. Thank you.",
      body: p("This confirms we received your payment.") + table(row("Amount", "{{amount}}") + row("Payment method", "{{card_brand}} ····{{card_last4}}") + row("Date", "{{payment_date}}") + row("Reference", "{{payment_id}}")),
      ctaLabel: "View billing history",
      ctaUrl: "{{dashboard_url}}/billing",
    }),
  },
  passwordReset: {
    name: "Password Reset",
    html: baseEmail({
      preheader: "Reset your BIG STEPPERS AI password.",
      eyebrow: "Password reset",
      title: "Choose a new password.",
      body: p("Hi {{first_name}}, we received a request to reset your password. Click below to choose a new one."),
      ctaLabel: "Reset password",
      ctaUrl: "{{reset_url}}",
      footNote: "This link expires in 60 minutes. If you didn't request this, your account is safe — no action needed.",
    }),
  },
  commercialReceived: {
    name: "Commercial Received",
    html: baseEmail({
      preheader: "Your commercial brief is in.",
      eyebrow: "Project submitted",
      title: "We've got your brief.",
      body: p("Hi {{first_name}}, your commercial <strong style=\"color:#fff;\">{{project_name}}</strong> has been submitted and is now in creative review.") + p("You'll hear from us at every stage — and you can watch the live timeline anytime."),
      ctaLabel: "Track progress",
      ctaUrl: "{{dashboard_url}}/projects",
    }),
  },
  commercialStarted: {
    name: "Commercial Started",
    html: baseEmail({
      preheader: "Production has begun.",
      eyebrow: "In production",
      title: "Lights on. Production has begun.",
      body: p("Hi {{first_name}}, <strong style=\"color:#fff;\">{{project_name}}</strong> just moved into AI generation.") + p("Our pipeline is crafting visuals, voiceover, and score to match your brief. Estimated delivery: <strong style=\"color:#fff;\">{{eta}}</strong>."),
      ctaLabel: "View timeline",
      ctaUrl: "{{dashboard_url}}/projects",
    }),
  },
  commercialDelivered: {
    name: "Commercial Delivered",
    html: baseEmail({
      preheader: "Your commercial is ready to watch.",
      eyebrow: "Delivered",
      title: "Your commercial is ready. 🎬",
      body: p("Hi {{first_name}}, <strong style=\"color:#fff;\">{{project_name}}</strong> is finished and waiting for you.") + p("Download it in every platform format, or request a revision if anything needs a tweak — we'll jump right on it."),
      ctaLabel: "Watch & download",
      ctaUrl: "{{dashboard_url}}/projects",
    }),
  },
  revisionReceived: {
    name: "Revision Received",
    html: baseEmail({
      preheader: "Your revision notes are with the team.",
      eyebrow: "Revision in progress",
      title: "Revision received — on it.",
      body: p("Hi {{first_name}}, your revision notes for <strong style=\"color:#fff;\">{{project_name}}</strong> are with the team.") + p("We'll deliver the updated cut within <strong style=\"color:#fff;\">{{revision_eta}}</strong>."),
      ctaLabel: "View project",
      ctaUrl: "{{dashboard_url}}/projects",
    }),
  },
  paymentFailed: {
    name: "Payment Failed",
    html: baseEmail({
      preheader: "Action needed: we couldn't process your payment.",
      eyebrow: "Payment issue",
      title: "We couldn't process your payment.",
      body: p("Hi {{first_name}}, your recent payment of <strong style=\"color:#fff;\">{{amount}}</strong> didn't go through.") + p("Update your payment method to keep your subscription active — we'll retry automatically in {{retry_days}} days."),
      ctaLabel: "Update payment method",
      ctaUrl: "{{portal_url}}",
      footNote: "Need help? Reply to this email and our team will sort it out.",
    }),
  },
  subscriptionRenewed: {
    name: "Subscription Renewed",
    html: baseEmail({
      preheader: "Your subscription has renewed.",
      eyebrow: "Renewed",
      title: "You're set for another cycle.",
      body: p("Hi {{first_name}}, your {{plan_name}} subscription renewed successfully.") + table(row("Plan", "{{plan_name}}") + row("Amount", "{{amount}}") + row("Next renewal", "{{renewal_date}}")),
      ctaLabel: "Go to dashboard",
      ctaUrl: "{{dashboard_url}}",
    }),
  },
  subscriptionCancelled: {
    name: "Subscription Cancelled",
    html: baseEmail({
      preheader: "Your subscription has been cancelled.",
      eyebrow: "Cancelled",
      title: "Your subscription is cancelled.",
      body: p("Hi {{first_name}}, your {{plan_name}} subscription has been cancelled and you won't be charged again.") + p("You'll keep access until <strong style=\"color:#fff;\">{{access_until}}</strong>, and your delivered commercials remain downloadable forever.") + p("Changed your mind? Reactivating takes one click."),
      ctaLabel: "Reactivate subscription",
      ctaUrl: "{{dashboard_url}}/billing",
      footNote: "We'd love to know what we could've done better — just reply to this email.",
    }),
  },
};
