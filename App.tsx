import React, { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { useStore } from "./store";
import {
  Play,
  Star,
  Check,
  ArrowRight,
  Menu,
  X,
  MessageCircle,
  TrendingUp,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Film,
  Zap,
  Globe,
} from "lucide-react";

// ─── Brand ──────────────────────────────────────────────────────────────────
const BLUE = "#5046FF";
const YELLOW = "#E5FF00";

const DISPLAY = "'Bricolage Grotesque', sans-serif";
const BODY = "'DM Sans', sans-serif";
const MONO = "'DM Mono', monospace";

// ─── Data ────────────────────────────────────────────────────────────────────
const HERO_VIDEOS = [
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4",
    label: "Med Spa",
  },
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4",
    label: "Real Estate",
  },
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4",
    label: "Restaurant",
  },
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4",
    label: "Luxury Brand",
  },
];

const NAV_LINKS = [
  { label: "Commercials", href: "#commercials" },
  { label: "Industries", href: "#industries" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const STATS = [
  { value: "10,000+", label: "Commercials Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "340%", label: "Avg. Lead Increase" },
  { value: "50+", label: "Countries Served" },
];

const INDUSTRIES = [
  { name: "Roofing", icon: "🏠" },
  { name: "HVAC", icon: "❄️" },
  { name: "Plumbing", icon: "🔧" },
  { name: "Electricians", icon: "⚡" },
  { name: "Dentists", icon: "🦷" },
  { name: "Med Spas", icon: "💆" },
  { name: "Restaurants", icon: "🍽️" },
  { name: "Gyms", icon: "💪" },
  { name: "Real Estate", icon: "🏡" },
  { name: "Law Firms", icon: "⚖️" },
  { name: "Auto Detailing", icon: "🚗" },
  { name: "Landscaping", icon: "🌿" },
  { name: "Solar", icon: "☀️" },
  { name: "Insurance", icon: "🛡️" },
  { name: "Mortgage", icon: "🏦" },
  { name: "Veterinary", icon: "🐾" },
  { name: "Salons", icon: "✂️" },
  { name: "Barbershops", icon: "💈" },
  { name: "Home Remodeling", icon: "🔨" },
  { name: "Pest Control", icon: "🐜" },
];

const COMMERCIALS = [
  {
    id: 1,
    industry: "Roofing",
    title: "Elite Roofing Solutions",
    views: "2.4M",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=450&h=800&fit=crop&auto=format",
  },
  {
    id: 2,
    industry: "Dentist",
    title: "Bright Smile Studio",
    views: "1.8M",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=450&h=800&fit=crop&auto=format",
  },
  {
    id: 3,
    industry: "Restaurant",
    title: "The Golden Fork",
    views: "3.1M",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=450&h=800&fit=crop&auto=format",
  },
  {
    id: 4,
    industry: "Real Estate",
    title: "Thompson Luxury Homes",
    views: "950K",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=450&h=800&fit=crop&auto=format",
  },
  {
    id: 5,
    industry: "HVAC",
    title: "Arctic Air Systems",
    views: "780K",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1558002038-bb4237bb4e07?w=450&h=800&fit=crop&auto=format",
  },
  {
    id: 6,
    industry: "Med Spa",
    title: "Luxe Wellness & Aesthetics",
    views: "1.2M",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=450&h=800&fit=crop&auto=format",
  },
  {
    id: 7,
    industry: "Law Firm",
    title: "Morrison & Associates",
    views: "620K",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=450&h=800&fit=crop&auto=format",
  },
  {
    id: 8,
    industry: "Plumbing",
    title: "ProFlow Solutions",
    views: "890K",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=450&h=800&fit=crop&auto=format",
  },
  {
    id: 9,
    industry: "Solar",
    title: "Green Energy Solar",
    views: "1.5M",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=450&h=800&fit=crop&auto=format",
  },
  {
    id: 10,
    industry: "Gym",
    title: "Iron Temple Fitness",
    views: "2.1M",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=450&h=800&fit=crop&auto=format",
  },
  {
    id: 11,
    industry: "Auto Detailing",
    title: "Prestige Auto Detail",
    views: "740K",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=450&h=800&fit=crop&auto=format",
  },
  {
    id: 12,
    industry: "Landscaping",
    title: "Verdant Gardens",
    views: "680K",
    aspect: "9:16" as const,
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=450&h=800&fit=crop&auto=format",
  },
];

const TESTIMONIALS = [
  {
    name: "Marcus Johnson",
    business: "Elite Roofing Solutions",
    location: "Houston, TX",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    rating: 5,
    text: "Within 3 weeks of running our AI commercial, phone calls doubled. Clients started asking if we were a national franchise. Best investment in 20 years.",
  },
  {
    name: "Dr. Sarah Chen",
    business: "Bright Smile Dental",
    location: "Vancouver, BC",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    rating: 5,
    text: "New patient bookings increased 340% in the first month. The commercial looks like something from a Fortune 500 healthcare brand. Unreal quality.",
  },
  {
    name: "Ahmed Al-Rashid",
    business: "Luxe Med Spa",
    location: "Dubai, UAE",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
    rating: 5,
    text: "Our competitors spend 10x more and their ads look worse. BIG STEPPERS AI completely changed the game for our business in Dubai.",
  },
  {
    name: "Emma Thompson",
    business: "Thompson Real Estate",
    location: "Sydney, NSW",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop",
    rating: 5,
    text: "I now look like the premium agent in my market. Listings sell faster at higher prices because buyers perceive me as a top-tier brand.",
  },
  {
    name: "Carlos Mendoza",
    business: "Green Energy Solar",
    location: "Miami, FL",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    rating: 5,
    text: "From 5 leads a week to 30+ leads. We position ourselves as the Apple of solar companies in Florida. The ROI is insane.",
  },
  {
    name: "Priya Sharma",
    business: "Spice Garden Restaurant",
    location: "London, UK",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
    rating: 5,
    text: "The commercial went viral on Instagram. We had to hire 4 more staff to handle demand. Absolutely life-changing for our small restaurant.",
  },
];

const FAQS = [
  {
    q: "What exactly is an AI commercial?",
    a: "An AI commercial is a professionally crafted video advertisement created using cutting-edge artificial intelligence. We combine AI-generated visuals, professional voiceover, custom music, and motion graphics to deliver cinema-quality commercials at a fraction of traditional production costs.",
  },
  {
    q: "How long does it take to receive my commercial?",
    a: "Most commercials are delivered within 3-5 business days. Rush delivery (24-48 hours) is available on Growth and Pro packages at no additional cost.",
  },
  {
    q: "What video formats and sizes do I receive?",
    a: "You receive your commercial optimized for every major platform: Instagram Reels & Stories (9:16), Facebook Ads (1:1 and 16:9), YouTube Pre-Roll (16:9), TikTok (9:16), and Google Display Network — all included.",
  },
  {
    q: "Do I need to provide footage or photos?",
    a: "No. We create everything from scratch using AI. If you have existing brand photos or footage you would like incorporated, we can use those too — but it is completely optional.",
  },
  {
    q: "How much does traditional video production cost?",
    a: "Traditional commercial production typically costs $5,000–$50,000+ per video when you factor in crew, location rental, editing, and multiple revision rounds. BIG STEPPERS AI delivers comparable — often superior — results starting at $49.",
  },
  {
    q: "Can I run my commercial as a paid advertisement?",
    a: "Absolutely. All commercials come with full commercial licensing, allowing use in paid ad campaigns across Meta, Google, TikTok, YouTube, LinkedIn, and all programmatic ad networks.",
  },
  {
    q: "Do you serve businesses outside the United States?",
    a: "Yes. We serve businesses in the United States, Canada, United Kingdom, Australia, New Zealand, UAE, Singapore, and 40+ additional countries. Our AI can produce commercials in English, Spanish, French, Arabic, and 10+ other languages.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: 49,
    period: "one-time",
    desc: "Test the AI advantage risk-free",
    features: [
      "1 AI Commercial",
      "30-second cinematic video",
      "All platform formats",
      "Commercial license",
      "3-5 day delivery",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Growth",
    price: 149,
    period: "one-time",
    desc: "Most popular for growing businesses",
    features: [
      "3 AI Commercials",
      "30-60 second videos",
      "All platform formats",
      "Commercial license",
      "Priority 48hr delivery",
      "2 revision rounds",
      "Social media captions",
    ],
    cta: "Start Growing",
    highlight: true,
  },
  {
    name: "Pro",
    price: 299,
    period: "/month",
    desc: "Monthly content domination",
    features: [
      "8 commercials per month",
      "All video lengths",
      "All platform formats",
      "Rush 24hr delivery",
      "Dedicated account manager",
      "Monthly strategy call",
      "Unlimited revisions",
    ],
    cta: "Go Pro",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: null,
    period: "custom",
    desc: "Custom solutions for agencies & chains",
    features: [
      "Custom volume & pricing",
      "White-label licensing",
      "API access",
      "Dedicated production team",
      "SLA guarantee",
      "Analytics dashboard",
    ],
    cta: "Contact Us",
    highlight: false,
  },
];

const STEPS = [
  {
    num: "01",
    icon: <MessageCircle size={22} />,
    title: "Tell Us About Your Business",
    desc: "Share your business name, services, target audience, and the message you want to convey. Takes less than 5 minutes.",
  },
  {
    num: "02",
    icon: <Sparkles size={22} />,
    title: "We Create Your Commercial",
    desc: "Our AI production engine crafts cinematic visuals, professional voiceover, custom music, and motion graphics.",
  },
  {
    num: "03",
    icon: <Play size={22} />,
    title: "Review and Approve",
    desc: "Watch your preview. Request revisions or give the green light. We iterate until it is exactly right.",
  },
  {
    num: "04",
    icon: <TrendingUp size={22} />,
    title: "Receive & Launch",
    desc: "Download in every format, ready for social media, paid ads, your website, and digital displays.",
  },
];

const TICKER_BRANDS = [
  "Elite Roofing",
  "Bright Smile Dental",
  "The Golden Fork",
  "Thompson Real Estate",
  "Arctic Air HVAC",
  "Luxe Med Spa",
  "Morrison Law",
  "ProFlow Plumbing",
  "Green Energy Solar",
  "Iron Temple Gym",
  "Prestige Auto Detail",
  "Verdant Gardens",
];

const SOCIAL_LINKS = [
  { icon: <Instagram size={17} />, href: "#", label: "Instagram" },
  { icon: <Facebook size={17} />, href: "#", label: "Facebook" },
  { icon: <Linkedin size={17} />, href: "#", label: "LinkedIn" },
  { icon: <Youtube size={17} />, href: "#", label: "YouTube" },
  { icon: <Twitter size={17} />, href: "#", label: "X (Twitter)" },
  { icon: <MessageCircle size={17} />, href: "#", label: "WhatsApp" },
];

const FOOTER_LINKS: Record<string, string[]> = {
  Company: ["About Us", "Blog", "Careers", "Press", "Affiliate Program"],
  Industries: [
    "Roofing",
    "Dentists",
    "Restaurants",
    "Real Estate",
    "HVAC",
    "Med Spas",
  ],
  Resources: ["Case Studies", "Pricing", "FAQ", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GradientText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: `linear-gradient(135deg, ${BLUE} 0%, #8B7FFF 50%, ${YELLOW} 100%)`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}

function SectionLabel({ children, color = BLUE }: { children: React.ReactNode; color?: string }) {
  return (
    <p
      className="text-xs uppercase tracking-[0.22em] mb-4 font-medium"
      style={{ color, fontFamily: MONO }}
    >
      {children}
    </p>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ large = false }: { large?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex-shrink-0">
        <div
          className={`${large ? "w-11 h-11 rounded-2xl text-sm" : "w-9 h-9 rounded-xl text-xs"} flex items-center justify-center font-black text-black`}
          style={{ background: `linear-gradient(135deg, ${BLUE}, ${YELLOW})` }}
        >
          BS
        </div>
        <div
          className={`absolute inset-0 ${large ? "rounded-2xl" : "rounded-xl"} blur-lg opacity-50`}
          style={{ background: `linear-gradient(135deg, ${BLUE}, ${YELLOW})` }}
        />
      </div>
      <div style={{ fontFamily: DISPLAY }}>
        <div
          className={`${large ? "text-xl" : "text-base"} font-bold tracking-tight leading-none text-white`}
        >
          BIG STEPPERS
        </div>
        <div
          className={`${large ? "text-sm" : "text-xs"} font-bold tracking-[0.15em] uppercase`}
          style={{ color: BLUE }}
        >
          AI
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 40);
      setPastHero(window.scrollY > window.innerHeight * 0.72);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: pastHero ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(0,0,0,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
          pointerEvents: pastHero ? "auto" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />

          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
                style={{ fontFamily: BODY }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#/login"
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
              style={{ fontFamily: BODY }}
            >
              Sign In
            </a>
            <motion.a
              href="#/signup"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{
                background: `linear-gradient(135deg, ${BLUE}, #7B6FFF)`,
                boxShadow: `0 8px 32px ${BLUE}45`,
                fontFamily: BODY,
              }}
            >
              Get Your Commercial
            </motion.a>
          </div>

          <button
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-40 flex flex-col pt-20 px-6 pb-8"
            style={{ background: "rgba(0,0,0,0.97)", backdropFilter: "blur(30px)" }}
          >
            {NAV_LINKS.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="py-4 text-2xl font-semibold text-white border-b"
                style={{ borderColor: "rgba(255,255,255,0.08)", fontFamily: DISPLAY }}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
              className="mt-8 py-4 rounded-2xl font-bold text-black text-lg"
              style={{
                background: `linear-gradient(135deg, ${BLUE}, ${YELLOW})`,
                fontFamily: DISPLAY,
              }}
            >
              Get Your AI Commercial
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Video Hero ───────────────────────────────────────────────────────────────
function VideoHero() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  const switchVideo = (index: number) => {
    if (index === activeVideo || isTransitioning) return;
    setIsTransitioning(true);
    setActiveVideo(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">

      {/* ── Video layers ── */}
      {HERO_VIDEOS.map((v, i) => (
        <video
          key={i}
          src={v.src}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === activeVideo ? 1 : 0,
            transition: "opacity 1000ms ease-in-out",
            zIndex: 0,
          }}
        />
      ))}

      {/* Colour grade overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%)",
          zIndex: 1,
        }}
      />

      {/* PNG texture overlay with train-bob */}
      <img
        src="https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ zIndex: 2, animation: "trainBob 3s ease-in-out infinite" }}
      />

      {/* ── Content layer ── */}
      <div
        className="relative flex flex-col h-full px-5 sm:px-8 max-w-7xl mx-auto w-full"
        style={{ zIndex: 3 }}
      >

        {/* Nav */}
        <nav className="flex items-center justify-between py-5 flex-shrink-0">
          <Logo />

          {/* Desktop pill */}
          <div className="hidden md:flex items-center gap-0.5 px-2 py-1.5 rounded-full liquid-glass">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="px-4 py-1.5 rounded-full text-sm text-white/80 hover:text-white transition-colors duration-200"
                style={{ fontFamily: BODY }}
              >
                {label}
              </a>
            ))}
            <a
              href="#pricing"
              className="px-5 py-2 rounded-full text-sm font-semibold text-black ml-1 transition-opacity hover:opacity-90"
              style={{ background: "white", fontFamily: BODY }}
            >
              Get Started
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative w-10 h-10 rounded-full flex items-center justify-center liquid-glass"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span
              className="absolute transition-all duration-300"
              style={{
                opacity: mobileMenuOpen ? 0 : 1,
                transform: mobileMenuOpen ? "rotate(90deg) scale(0.75)" : "rotate(0deg) scale(1)",
              }}
            >
              <Menu size={18} className="text-white" />
            </span>
            <span
              className="absolute transition-all duration-300"
              style={{
                opacity: mobileMenuOpen ? 1 : 0,
                transform: mobileMenuOpen ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.75)",
              }}
            >
              <X size={18} className="text-white" />
            </span>
          </button>
        </nav>

        {/* Hero content — centered */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="liquid-glass rounded-full px-4 py-2 text-sm text-white/85 mb-7 inline-flex items-center gap-2"
            style={{ fontFamily: BODY }}
          >
            <Sparkles size={13} style={{ color: YELLOW }} />
            Over 10,000 AI Commercials Delivered Worldwide
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.06] tracking-tight text-white max-w-5xl mb-5"
            style={{ fontFamily: DISPLAY }}
          >
            Imagine Your Business
            <br />
            <GradientText>Looking Like This.</GradientText>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.7 }}
            className="text-white/65 max-w-xl leading-relaxed mb-8 text-sm sm:text-base"
            style={{ fontFamily: BODY }}
          >
            AI-powered commercials that make your business look premium, professional,
            and unforgettable — for a fraction of traditional production costs.
          </motion.p>

          {/* Email input pill */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.65 }}
            className="liquid-glass rounded-full flex items-center gap-2 p-1.5 w-full max-w-[320px] sm:max-w-sm mb-8"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your business email"
              className="flex-1 bg-transparent text-white placeholder-white/45 text-sm px-3 outline-none min-w-0"
              style={{ fontFamily: BODY }}
            />
            <a
              href="#pricing"
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold text-black whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ background: "white", fontFamily: BODY }}
            >
              Get Your Commercial
            </a>
          </motion.div>

          {/* Video switcher */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="flex items-center gap-1 sm:gap-2"
          >
            {HERO_VIDEOS.map((v, i) => (
              <button
                key={i}
                onClick={() => switchVideo(i)}
                className="px-3 py-1.5 text-xs font-medium transition-all duration-300 border-b-2"
                style={{
                  color: i === activeVideo ? "white" : "rgba(255,255,255,0.48)",
                  borderBottomColor: i === activeVideo ? BLUE : "transparent",
                  fontFamily: BODY,
                }}
              >
                {v.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Bottom stats bar */}
        <div
          className="flex-shrink-0 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 py-5 text-xs sm:text-sm text-white/60"
          style={{ fontFamily: BODY }}
        >
          {STATS.map(({ value, label }, i) => (
            <React.Fragment key={label}>
              {i > 0 && (
                <span className="text-white/20 hidden sm:inline select-none">|</span>
              )}
              <span>
                <span className="text-white font-semibold">{value}</span>{" "}
                {label}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
          >
            {NAV_LINKS.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 + i * 0.055,
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="py-3 text-3xl font-bold text-white"
                style={{ fontFamily: DISPLAY }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </motion.a>
            ))}
            <motion.a
              href="#pricing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.38, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="mt-6 px-8 py-4 rounded-2xl font-bold text-white text-lg"
              style={{
                background: `linear-gradient(135deg, ${BLUE}, #7B6FFF)`,
                fontFamily: BODY,
                boxShadow: `0 16px 48px ${BLUE}50`,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Your Commercial
            </motion.a>

            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
function SocialProofTicker() {
  const doubled = [...TICKER_BRANDS, ...TICKER_BRANDS];
  return (
    <div
      className="py-8 overflow-hidden border-y"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.015)",
      }}
    >
      <p
        className="text-center text-[10px] uppercase tracking-[0.25em] text-white/25 mb-5"
        style={{ fontFamily: MONO }}
      >
        Trusted by businesses worldwide across 50+ countries
      </p>
      <div className="overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          className="flex items-center gap-10 whitespace-nowrap"
        >
          {doubled.map((brand, i) => (
            <div key={i} className="flex items-center gap-3 flex-shrink-0">
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background:
                    i % 3 === 0 ? BLUE : i % 3 === 1 ? YELLOW : "#ffffff50",
                }}
              />
              <span
                className="text-sm font-medium text-white/35 uppercase tracking-wider"
                style={{ fontFamily: BODY }}
              >
                {brand}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Commercial Library ───────────────────────────────────────────────────────
function CommercialLibrary() {
  const [activeFilter, setActiveFilter] = useState("All");
  // Live video list — powered by the admin panel & Instagram sync (store.tsx)
  const { videos } = useStore();
  const filters = ["All", ...Array.from(new Set(videos.map((v) => v.industry)))];

  const filtered =
    activeFilter === "All"
      ? videos
      : videos.filter((c) => c.industry === activeFilter);

  return (
    <section id="commercials" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-12">
          <SectionLabel color={YELLOW}>Live Commercial Library</SectionLabel>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: DISPLAY }}
          >
            See What&apos;s Possible for{" "}
            <GradientText>Your Business</GradientText>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto" style={{ fontFamily: BODY }}>
            Browse our growing library of AI-powered commercials across every industry.
            Filter by yours to see real examples.
          </p>
        </FadeUp>

        {/* Filters */}
        <FadeUp delay={0.1} className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: BODY,
                background:
                  activeFilter === f
                    ? `linear-gradient(135deg, ${BLUE}, #7B6FFF)`
                    : "rgba(255,255,255,0.05)",
                color: activeFilter === f ? "#fff" : "rgba(255,255,255,0.45)",
                border:
                  activeFilter === f
                    ? "none"
                    : "1px solid rgba(255,255,255,0.09)",
                boxShadow:
                  activeFilter === f ? `0 4px 20px ${BLUE}40` : "none",
              }}
            >
              {f}
            </button>
          ))}
        </FadeUp>

        {/* Uniform 9:16 portrait grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              const isPortrait = item.aspect === "9:16";
              return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.28, delay: i * 0.04 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-gray-900"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  aspectRatio: "9 / 16",
                }}
                onClick={() => item.reelUrl && window.open(item.reelUrl, "_blank", "noopener")}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Aspect badge */}
                <div
                  className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(6px)",
                    color: isPortrait ? YELLOW : "rgba(255,255,255,0.6)",
                    border: `1px solid ${isPortrait ? YELLOW + "40" : "rgba(255,255,255,0.15)"}`,
                    fontFamily: MONO,
                  }}
                >
                  {isPortrait ? "9:16" : "16:9"}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: `${BLUE}CC`, backdropFilter: "blur(10px)" }}
                  >
                    <Play size={17} fill="white" className="text-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p
                    className="text-[10px] font-semibold mb-0.5 uppercase tracking-wider"
                    style={{ color: YELLOW, fontFamily: MONO }}
                  >
                    {item.industry}
                  </p>
                  <p
                    className="text-sm font-semibold text-white"
                    style={{ fontFamily: BODY }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs text-white/45 mt-0.5"
                    style={{ fontFamily: MONO }}
                  >
                    {item.views} views
                  </p>
                </div>

                {/* Industry tag */}
                <div
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: "rgba(0,0,0,0.75)",
                    backdropFilter: "blur(8px)",
                    color: YELLOW,
                    border: `1px solid ${YELLOW}30`,
                    fontFamily: MONO,
                  }}
                >
                  {item.industry}
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <FadeUp delay={0.3} className="text-center mt-10">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: BLUE, fontFamily: BODY }}
          >
            View Full Portfolio
            <ArrowRight size={16} />
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section
      className="py-24"
      style={{ background: "linear-gradient(180deg, #000 0%, #06061a 50%, #000 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-16">
          <SectionLabel>How It Works</SectionLabel>
          <h2
            className="text-4xl sm:text-5xl font-black text-white"
            style={{ fontFamily: DISPLAY }}
          >
            From Brief to <GradientText>Broadcast</GradientText>
            <br />
            in Days, Not Months
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.1}>
              <div
                className="relative p-6 rounded-2xl h-full"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {/* Ghost number */}
                <div
                  className="absolute -top-5 -right-1 text-8xl font-black select-none leading-none"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: `1px ${BLUE}25`,
                    fontFamily: DISPLAY,
                  }}
                >
                  {step.num}
                </div>

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${BLUE}18`, color: BLUE }}
                >
                  {step.icon}
                </div>

                <h3
                  className="text-base font-bold text-white mb-2.5"
                  style={{ fontFamily: DISPLAY }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm text-white/45 leading-relaxed"
                  style={{ fontFamily: BODY }}
                >
                  {step.desc}
                </p>

                {i < STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-12 -right-2.5 w-5 h-px"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${BLUE}60, transparent)`,
                    }}
                  />
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Industries ───────────────────────────────────────────────────────────────
function Industries() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="industries" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-12">
          <SectionLabel color={YELLOW}>Industries We Serve</SectionLabel>
          <h2
            className="text-4xl sm:text-5xl font-black text-white"
            style={{ fontFamily: DISPLAY }}
          >
            We Make <GradientText>Every Industry</GradientText>
            <br />
            Look World-Class
          </h2>
        </FadeUp>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {INDUSTRIES.map((ind, i) => (
            <FadeUp key={ind.name} delay={i * 0.025}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                onHoverStart={() => setHovered(ind.name)}
                onHoverEnd={() => setHovered(null)}
                className="p-4 rounded-2xl text-center cursor-pointer transition-all duration-200"
                style={{
                  background:
                    hovered === ind.name
                      ? `${BLUE}14`
                      : "rgba(255,255,255,0.028)",
                  border: `1px solid ${
                    hovered === ind.name
                      ? `${BLUE}45`
                      : "rgba(255,255,255,0.07)"
                  }`,
                  boxShadow:
                    hovered === ind.name
                      ? `0 8px 30px ${BLUE}20`
                      : "none",
                }}
              >
                <div className="text-2xl mb-2">{ind.icon}</div>
                <p
                  className="text-xs font-medium"
                  style={{
                    color:
                      hovered === ind.name
                        ? "#fff"
                        : "rgba(255,255,255,0.55)",
                    fontFamily: BODY,
                  }}
                >
                  {ind.name}
                </p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Before / After ───────────────────────────────────────────────────────────
function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(4, Math.min(96, pct)));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    updatePos(e.clientX);
  };
  const onMouseUp = () => { isDragging.current = false; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) updatePos(e.clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    updatePos(e.touches[0].clientX);
  };

  return (
    <section className="py-24" style={{ background: "#040412" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-12">
          <SectionLabel>The Transformation</SectionLabel>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-3"
            style={{ fontFamily: DISPLAY }}
          >
            Before vs.{" "}
            <GradientText>After BIG STEPPERS AI</GradientText>
          </h2>
          <p className="text-white/45 text-sm" style={{ fontFamily: BODY }}>
            Drag the slider to experience the difference AI makes.
          </p>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div
            ref={containerRef}
            className="relative aspect-video rounded-3xl overflow-hidden cursor-col-resize select-none bg-gray-900"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseUp}
            onTouchMove={onTouchMove}
          >
            {/* BEFORE */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1280&h=720&fit=crop&auto=format"
                alt="Before: typical local business look"
                className="w-full h-full object-cover"
                style={{ filter: "grayscale(80%) contrast(0.9) brightness(0.7)" }}
              />
              <div
                className="absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs font-bold text-white/80"
                style={{
                  background: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: MONO,
                }}
              >
                BEFORE
              </div>
              <div
                className="absolute bottom-4 left-4 text-sm text-white/50"
                style={{ fontFamily: BODY }}
              >
                Typical local business presentation
              </div>
            </div>

            {/* AFTER — clips from left at sliderPos */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&h=720&fit=crop&auto=format"
                alt="After: premium AI commercial"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${BLUE}20, ${YELLOW}08)`,
                }}
              />
              <div
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold text-black"
                style={{
                  background: `linear-gradient(135deg, ${BLUE}, ${YELLOW})`,
                  fontFamily: MONO,
                }}
              >
                AFTER BIG STEPPERS AI
              </div>
              <div
                className="absolute bottom-4 right-4 text-sm text-white font-semibold"
                style={{ fontFamily: BODY }}
              >
                Looks like a $10M national brand
              </div>
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: `${sliderPos}%`,
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            >
              <div className="w-0.5 h-full bg-white/70" />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "#fff",
                  boxShadow: `0 0 0 3px ${BLUE}, 0 10px 30px rgba(0,0,0,0.6)`,
                }}
              >
                <div className="flex items-center gap-0">
                  <ChevronLeft size={10} className="text-gray-700" />
                  <ChevronRight size={10} className="text-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-12">
          <SectionLabel>Pricing</SectionLabel>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: DISPLAY }}
          >
            Investment in <GradientText>Your Brand</GradientText>
          </h2>
          <p className="text-white/50 max-w-lg mx-auto" style={{ fontFamily: BODY }}>
            Traditional commercial production costs $5,000–$50,000.
            Our AI delivers the same — often better — quality starting at $49.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan, i) => (
            <FadeUp key={plan.name} delay={i * 0.08}>
              <div
                className="relative p-6 rounded-2xl h-full flex flex-col"
                style={{
                  background: plan.highlight
                    ? `linear-gradient(135deg, ${BLUE}18, ${YELLOW}08)`
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${
                    plan.highlight ? BLUE : "rgba(255,255,255,0.07)"
                  }`,
                  boxShadow: plan.highlight
                    ? `0 24px 60px ${BLUE}28`
                    : "none",
                }}
              >
                {plan.highlight && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-black whitespace-nowrap"
                    style={{
                      background: `linear-gradient(135deg, ${BLUE}, ${YELLOW})`,
                      fontFamily: MONO,
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <h3
                  className="text-lg font-bold text-white mb-1"
                  style={{ fontFamily: DISPLAY }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-xs text-white/45 mb-5"
                  style={{ fontFamily: BODY }}
                >
                  {plan.desc}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  {plan.price ? (
                    <>
                      <span
                        className="text-4xl font-black text-white"
                        style={{ fontFamily: DISPLAY }}
                      >
                        ${plan.price}
                      </span>
                      <span
                        className="text-white/35 text-sm"
                        style={{ fontFamily: BODY }}
                      >
                        {plan.period}
                      </span>
                    </>
                  ) : (
                    <span
                      className="text-3xl font-black text-white"
                      style={{ fontFamily: DISPLAY }}
                    >
                      Custom
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: plan.highlight
                            ? `${BLUE}28`
                            : "rgba(255,255,255,0.08)",
                        }}
                      >
                        <Check
                          size={9}
                          style={{
                            color: plan.highlight
                              ? BLUE
                              : "rgba(255,255,255,0.5)",
                          }}
                        />
                      </div>
                      <span
                        className="text-sm text-white/65"
                        style={{ fontFamily: BODY }}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm"
                  style={{
                    background: plan.highlight
                      ? `linear-gradient(135deg, ${BLUE}, #7B6FFF)`
                      : "rgba(255,255,255,0.07)",
                    color: "#fff",
                    border: plan.highlight
                      ? "none"
                      : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: plan.highlight
                      ? `0 10px 32px ${BLUE}40`
                      : "none",
                    fontFamily: BODY,
                  }}
                >
                  {plan.cta}
                </motion.button>

                {plan.price && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Shield size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
                    <span
                      className="text-xs text-white/30"
                      style={{ fontFamily: MONO }}
                    >
                      Secure · Card · Apple Pay · Google Pay
                    </span>
                  </div>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonial Carousel ─────────────────────────────────────────────────────
function TestimonialCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(420);
  const CARD_GAP = 24;
  const COUNT = TESTIMONIALS.length; // 6
  const tripled = useMemo(
    () => [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS],
    []
  );

  // Start at middle copy so we can seamlessly wrap both directions
  const idxRef = useRef(COUNT);
  const [idx, setIdx] = useState(COUNT);
  const [animate, setAnimate] = useState(true);
  const busyRef = useRef(false);
  const isHovering = useRef(false);

  useLayoutEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setCardWidth(Math.min(424, Math.max(280, w - 48)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const go = useCallback((dir: 1 | -1) => {
    if (busyRef.current) return;
    busyRef.current = true;
    const next = idxRef.current + dir;
    idxRef.current = next;
    setAnimate(true);
    setIdx(next);

    setTimeout(() => {
      let landed = next;
      if (next >= COUNT * 2) landed = COUNT;
      else if (next < COUNT) landed = COUNT * 2 - 1;

      if (landed !== next) {
        idxRef.current = landed;
        setAnimate(false);
        setIdx(landed);
        setTimeout(() => {
          setAnimate(true);
          busyRef.current = false;
        }, 50);
      } else {
        busyRef.current = false;
      }
    }, 820);
  }, [COUNT]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovering.current) go(1);
    }, 3200);
    return () => clearInterval(timer);
  }, [go]);

  const translateX = -(idx * (cardWidth + CARD_GAP));

  return (
    <section
      id="testimonials"
      className="py-24 overflow-hidden"
      style={{ background: "#040412" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <SectionLabel color={YELLOW}>Client Results</SectionLabel>
            <h2
              className="text-4xl sm:text-5xl font-black text-white"
              style={{ fontFamily: DISPLAY }}
            >
              Real Businesses. <GradientText>Real Results.</GradientText>
            </h2>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={YELLOW} style={{ color: YELLOW }} />
              ))}
              <span
                className="text-xs text-white/40 ml-1.5"
                style={{ fontFamily: MONO }}
              >
                5/5 Rating
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => go(-1)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                style={{
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <ChevronLeft size={17} className="text-white/65" />
              </button>
              <button
                onClick={() => go(1)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                style={{
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <ChevronRight size={17} className="text-white/65" />
              </button>
            </div>
          </div>
        </FadeUp>

        {/* Carousel track */}
        <div
          ref={containerRef}
          onMouseEnter={() => { isHovering.current = true; }}
          onMouseLeave={() => { isHovering.current = false; }}
        >
          <div
            className="flex"
            style={{
              gap: CARD_GAP,
              transform: `translateX(${translateX}px)`,
              transition: animate
                ? "transform 0.82s cubic-bezier(0.4,0,0.2,1)"
                : "none",
              willChange: "transform",
            }}
          >
            {tripled.map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 p-6 md:p-8 rounded-[32px] flex flex-col"
                style={{
                  width: cardWidth,
                  background: "rgba(255,255,255,0.038)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Quote mark */}
                <svg
                  width="28"
                  height="21"
                  viewBox="0 0 32 24"
                  fill="none"
                  className="mb-5 opacity-25"
                >
                  <path
                    d="M0 24V14.4C0 6.4 4.267 1.6 12.8 0L14.4 2.4C10.133 3.467 8 6.133 8 10.4H14.4V24H0ZM17.6 24V14.4C17.6 6.4 21.867 1.6 30.4 0L32 2.4C27.733 3.467 25.6 6.133 25.6 10.4H32V24H17.6Z"
                    fill="white"
                  />
                </svg>

                <p
                  className="text-white/72 text-sm leading-relaxed flex-1 mb-5"
                  style={{ fontFamily: BODY }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={12} fill={YELLOW} style={{ color: YELLOW }} />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    style={{ border: `2px solid ${BLUE}40` }}
                    loading="lazy"
                  />
                  <div>
                    <p
                      className="font-semibold text-white text-sm"
                      style={{ fontFamily: BODY }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-[11px] text-white/38"
                      style={{ fontFamily: MONO }}
                    >
                      → {t.business} &middot; {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ROI Calculator ───────────────────────────────────────────────────────────
function ROICalculator() {
  const [revenue, setRevenue] = useState(25000);
  const [competitors, setCompetitors] = useState(5);

  const leadsIncrease = Math.round(revenue * 0.0028 * (1 + competitors * 0.12));
  const brandValue = Math.round(revenue * 0.26);
  const roi = Math.round(((brandValue - 149) / 149) * 100);

  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-12">
          <SectionLabel>ROI Calculator</SectionLabel>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-3"
            style={{ fontFamily: DISPLAY }}
          >
            See Your <GradientText>Potential Return</GradientText>
          </h2>
          <p className="text-white/45" style={{ fontFamily: BODY }}>
            Adjust the sliders to estimate your business uplift from AI commercials.
          </p>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div
            className="p-8 rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label
                  className="block text-sm text-white/60 mb-3"
                  style={{ fontFamily: BODY }}
                >
                  Monthly Revenue:{" "}
                  <span className="text-white font-bold">
                    ${revenue.toLocaleString()}
                  </span>
                </label>
                <input
                  type="range"
                  min={5000}
                  max={500000}
                  step={5000}
                  value={revenue}
                  onChange={(e) => setRevenue(+e.target.value)}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, ${BLUE} ${
                      ((revenue - 5000) / (500000 - 5000)) * 100
                    }%, rgba(255,255,255,0.1) ${
                      ((revenue - 5000) / (500000 - 5000)) * 100
                    }%)`,
                  }}
                />
                <div
                  className="flex justify-between text-[10px] text-white/25 mt-1"
                  style={{ fontFamily: MONO }}
                >
                  <span>$5K</span>
                  <span>$500K</span>
                </div>
              </div>

              <div>
                <label
                  className="block text-sm text-white/60 mb-3"
                  style={{ fontFamily: BODY }}
                >
                  Local Competitors:{" "}
                  <span className="text-white font-bold">{competitors}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={competitors}
                  onChange={(e) => setCompetitors(+e.target.value)}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, ${BLUE} ${
                      ((competitors - 1) / 19) * 100
                    }%, rgba(255,255,255,0.1) ${
                      ((competitors - 1) / 19) * 100
                    }%)`,
                  }}
                />
                <div
                  className="flex justify-between text-[10px] text-white/25 mt-1"
                  style={{ fontFamily: MONO }}
                >
                  <span>1</span>
                  <span>20+</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  label: "Projected New Leads / Mo",
                  value: `+${leadsIncrease}`,
                  color: BLUE,
                },
                {
                  label: "Estimated Brand Value Added",
                  value: `$${brandValue.toLocaleString()}`,
                  color: YELLOW,
                },
                {
                  label: "Potential ROI",
                  value: `${roi.toLocaleString()}%`,
                  color: "#10ff88",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="p-5 rounded-2xl text-center"
                  style={{
                    background: `${color}0d`,
                    border: `1px solid ${color}22`,
                  }}
                >
                  <div
                    className="text-3xl font-black mb-2"
                    style={{ color, fontFamily: DISPLAY }}
                  >
                    {value}
                  </div>
                  <div
                    className="text-[10px] text-white/45 uppercase tracking-wider"
                    style={{ fontFamily: MONO }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p
                className="text-[11px] text-white/25 mb-5"
                style={{ fontFamily: MONO }}
              >
                * Estimates based on average client results across 10,000+ commercials. Individual results may vary.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl font-bold text-black"
                style={{
                  background: `linear-gradient(135deg, ${BLUE}, ${YELLOW})`,
                  fontFamily: BODY,
                  boxShadow: `0 16px 48px ${BLUE}40`,
                }}
              >
                Claim Your ROI — Get a Commercial Today
              </motion.button>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24" style={{ background: "#040412" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-12">
          <SectionLabel color={YELLOW}>FAQ</SectionLabel>
          <h2
            className="text-4xl sm:text-5xl font-black text-white"
            style={{ fontFamily: DISPLAY }}
          >
            Common <GradientText>Questions</GradientText>
          </h2>
        </FadeUp>

        <div className="space-y-2.5">
          {FAQS.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: `1px solid ${
                    open === i ? `${BLUE}40` : "rgba(255,255,255,0.07)"
                  }`,
                  background:
                    open === i ? `${BLUE}07` : "rgba(255,255,255,0.025)",
                  transition: "border-color 0.2s, background 0.2s",
                }}
              >
                <button
                  className="w-full flex items-start justify-between p-5 text-left gap-4"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span
                    className="font-semibold text-white text-sm leading-snug"
                    style={{ fontFamily: BODY }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.22 }}
                    className="flex-shrink-0 mt-0.5"
                  >
                    <ChevronDown
                      size={17}
                      style={{
                        color:
                          open === i ? BLUE : "rgba(255,255,255,0.35)",
                      }}
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-5 pb-5 text-sm text-white/55 leading-relaxed"
                        style={{ fontFamily: BODY }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Strip ───────────────────────────────────────────────────────────
function FeaturesStrip() {
  const features = [
    { icon: <Film size={20} />, title: "Cinema-Quality AI", desc: "4K resolution, professional color grading" },
    { icon: <Zap size={20} />, title: "48-Hour Delivery", desc: "Fast turnaround without sacrificing quality" },
    { icon: <Globe size={20} />, title: "15+ Languages", desc: "Reach audiences in any country" },
    { icon: <Shield size={20} />, title: "Full Commercial License", desc: "Use everywhere — paid ads, TV, web" },
  ];

  return (
    <section className="py-16 bg-black border-t border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <FadeUp key={feat.title} delay={i * 0.08}>
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${BLUE}18`, color: BLUE }}
                >
                  {feat.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1" style={{ fontFamily: DISPLAY }}>
                    {feat.title}
                  </h4>
                  <p className="text-xs text-white/40 leading-relaxed" style={{ fontFamily: BODY }}>
                    {feat.desc}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner (with mouse-trail thumbnail effect) ───────────────────────────
type TrailItem = { id: number; x: number; y: number; rotation: number; img: string };

function CTABanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const lastSpawnAt = useRef(0);
  const spawnCounter = useRef(0);
  const thumbnails = COMMERCIALS.map((c) => c.img);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastSpawnAt.current < 80) return;
    lastSpawnAt.current = now;
    if (!bannerRef.current) return;

    const rect = bannerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotation = (Math.random() - 0.5) * 22;
    const img = thumbnails[spawnCounter.current % thumbnails.length];
    spawnCounter.current++;

    const id = now + Math.random();
    setTrail((prev) => [...prev.slice(-10), { id, x, y, rotation, img }]);

    setTimeout(() => {
      setTrail((prev) => prev.filter((t) => t.id !== id));
    }, 1050);
  }, [thumbnails]);

  return (
    <section className="py-20 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <div
            ref={bannerRef}
            className="relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center cursor-crosshair"
            style={{
              background: `linear-gradient(135deg, ${BLUE}28 0%, transparent 60%, ${YELLOW}12 100%)`,
              border: `1px solid ${BLUE}30`,
            }}
            onMouseMove={handleMouseMove}
          >
            {/* Trail thumbnails */}
            {trail.map((item) => (
              <div
                key={item.id}
                className="absolute pointer-events-none rounded-xl overflow-hidden"
                style={{
                  left: item.x - 80,
                  top: item.y - 48,
                  width: 160,
                  height: 90,
                  transform: `rotate(${item.rotation}deg)`,
                  animation: "trailFade 1.05s ease-out forwards",
                  zIndex: 20,
                  boxShadow: `0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)`,
                }}
              >
                <img
                  src={item.img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Ambient orbs */}
            <div
              className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[100px] opacity-25 pointer-events-none"
              style={{ background: BLUE }}
            />
            <div
              className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full blur-[80px] opacity-15 pointer-events-none"
              style={{ background: YELLOW }}
            />

            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <Logo large />
              </div>

              <h2
                className="text-4xl sm:text-6xl font-black text-white mt-6 mb-4 leading-tight"
                style={{ fontFamily: DISPLAY }}
              >
                Ready to Look Like a{" "}
                <GradientText>National Brand?</GradientText>
              </h2>
              <p
                className="text-white/55 max-w-xl mx-auto mb-8"
                style={{ fontFamily: BODY }}
              >
                Join 10,000+ businesses that upgraded their brand perception
                with AI-powered commercials. Starting at just $49.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.a
                  href="#pricing"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base"
                  style={{
                    background: `linear-gradient(135deg, ${BLUE}, #7B6FFF)`,
                    boxShadow: `0 1px 2px 0 ${BLUE}33, 0 4px 8px 0 ${BLUE}28, 0 9px 12px 0 ${BLUE}18, 0 17px 14px 0 ${BLUE}08, inset 0 2px 8px 0 rgba(255,255,255,0.14)`,
                    fontFamily: BODY,
                  }}
                >
                  Get Your AI Commercial — From $49
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </motion.a>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white/80 text-base"
                  style={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.04)",
                    fontFamily: BODY,
                  }}
                >
                  Talk to a Specialist
                </motion.a>
              </div>

              <p
                className="text-xs text-white/25 mt-6"
                style={{ fontFamily: MONO }}
              >
                Hover over this section to preview our commercial library
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      id="contact"
      className="bg-black border-t"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo large />
            <p
              className="mt-4 text-sm text-white/45 leading-relaxed max-w-xs"
              style={{ fontFamily: BODY }}
            >
              AI-Powered Commercials That Make Local Businesses Look Like
              National Brands. Serving 50+ countries worldwide.
            </p>
            <div className="flex items-center gap-2 mt-6">
              {SOCIAL_LINKS.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:hello@bigsteppersai.com"
                className="flex items-center gap-2 text-sm text-white/35 hover:text-white/60 transition-colors"
                style={{ fontFamily: MONO }}
              >
                <Mail size={13} />
                hello@bigsteppersai.com
              </a>
              <a
                href="tel:+18005000000"
                className="flex items-center gap-2 text-sm text-white/35 hover:text-white/60 transition-colors"
                style={{ fontFamily: MONO }}
              >
                <Phone size={13} />
                +1 (800) BIG-STEP
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 mb-4"
                style={{ fontFamily: MONO }}
              >
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/45 hover:text-white/80 transition-colors"
                      style={{ fontFamily: BODY }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <p
            className="text-xs text-white/25"
            style={{ fontFamily: MONO }}
          >
            © 2024 BIG STEPPERS AI. All rights reserved. AI-Powered Commercial Production.
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#10ff88" }}
            />
            <span
              className="text-xs text-white/25"
              style={{ fontFamily: MONO }}
            >
              Available in United States · Canada · UK · Australia · UAE · Singapore
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating Bottom Nav ─────────────────────────────────────────────────────
function FloatingNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 360);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-3 py-2 rounded-full"
          style={{
            background: "rgba(8,8,8,0.92)",
            backdropFilter: "blur(24px) saturate(1.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.05)",
          }}
        >
          {/* Logo mark */}
          <div className="relative flex-shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-[11px]"
              style={{
                background: `linear-gradient(135deg, ${BLUE}, ${YELLOW})`,
              }}
            >
              BS
            </div>
            <div
              className="absolute inset-0 rounded-lg blur-md opacity-40"
              style={{
                background: `linear-gradient(135deg, ${BLUE}, ${YELLOW})`,
              }}
            />
          </div>

          <div
            className="w-px h-5 flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />

          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="px-5 py-2 rounded-full font-semibold text-white text-sm whitespace-nowrap"
            style={{
              background: `linear-gradient(135deg, ${BLUE}, #7B6FFF)`,
              fontFamily: BODY,
              boxShadow: `0 4px 16px ${BLUE}50`,
            }}
          >
            Get Your Commercial
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── WhatsApp Button ──────────────────────────────────────────────────────────
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/18005000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full animate-ping opacity-25 bg-green-500" />
        <motion.div
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.93 }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: "#25D366",
            boxShadow: "0 12px 40px rgba(37,211,102,0.45)",
          }}
        >
          <MessageCircle size={26} fill="white" className="text-white" />
        </motion.div>
        <div
          className="absolute bottom-full right-0 mb-3 px-3 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.92)",
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: BODY,
          }}
        >
          Chat with us on WhatsApp
        </div>
      </div>
    </a>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <NavBar />
      <VideoHero />
      <SocialProofTicker />
      <FeaturesStrip />
      <CommercialLibrary />
      <HowItWorks />
      <Industries />
      <Pricing />
      <TestimonialCarousel />
      <ROICalculator />
      <FAQ />
      <CTABanner />
      <Footer />
      <FloatingNav />
      <WhatsAppButton />
    </div>
  );
}
