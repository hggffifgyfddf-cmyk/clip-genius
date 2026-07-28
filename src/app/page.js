"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const colors = {
  bg: "#040406",
  panel: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  textDim: "rgba(255,255,255,0.65)",
  purple: "#8b5cf6",
  glow: "rgba(139,92,246,0.45)",
};

const gradients = {
  main:
    "radial-gradient(900px 600px at 15% 10%, rgba(139,92,246,0.25), transparent 60%), radial-gradient(900px 600px at 85% 20%, rgba(59,130,246,0.18), transparent 60%), linear-gradient(180deg, #040406, #070712)",
};

const SUBTITLE_COLORS = {
  black: "#000000",
  white: "#ffffff",
  red: "#ef4444",
  green: "#22c55e",
  blue: "#3b82f6",
  yellow: "#facc15",
};

function Btn({ children, onClick, variant = "primary", disabled, style }) {
  const primary = variant === "primary";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        background: primary
          ? "linear-gradient(135deg,#8b5cf6,#6366f1)"
          : "rgba(255,255,255,0.04)",
        color: "white",
        borderRadius: 14,
        padding: "12px 18px",
        fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all .2s ease",
        boxShadow: primary ? "0 0 40px rgba(139,92,246,0.35)" : "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Panel({ children, style }) {
  return (
    <div
      style={{
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        borderRadius: 26,
        padding: 22,
        backdropFilter: "blur(14px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ====== ALL PAGES CONSTANTS ======
const PAGES = {
  LANDING: "landing",
  WELCOME: "welcome",
  DASHBOARD: "dashboard",
  PROCESSING: "processing",
  PRICING: "pricing",
  CREDITS: "credits",
  // LEGAL PAGES
  TERMS: "terms",
  PRIVACY: "privacy",
  COPYRIGHT: "copyright",
  PLATFORM: "platform",
  LEGAL: "legal",
};

function safeJson(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export default function ClipGenius() {
  const [page, setPage] = useState(PAGES.LANDING);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  async function loadProfile() {
    try {
      setLoadingProfile(true);
      const res = await fetch("/api/profile");
      const text = await res.text();
      const data = safeJson(text);
      if (!res.ok) throw new Error();
      setProfile(data?.profile || null);
    } catch {
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  // Paddle.js initialization
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Initialize({
          token: "pdl_live_YOUR_CLIENT_TOKEN_HERE",
          environment: "production",
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  function Navbar() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          borderRadius: 22,
          border: `1px solid ${colors.border}`,
          background: "rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              boxShadow: "0 0 30px rgba(139,92,246,0.6)",
            }}
          >
            CG
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>ClipGenius</div>
            <div style={{ fontSize: 12, color: colors.textDim }}>
              Fastest clip generator alive
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setPage(PAGES.LANDING)} style={navBtn}>Home</button>
          <button onClick={() => setPage(PAGES.DASHBOARD)} style={navBtn}>Dashboard</button>
          <button onClick={() => setPage(PAGES.PRICING)} style={navBtn}>Pricing</button>
          <button onClick={() => setPage(PAGES.CREDITS)} style={navBtn}>Credits</button>
          <button onClick={() => setPage(PAGES.LEGAL)} style={navBtn}>Legal</button>
          <SignedOut>
            <SignInButton mode="modal"><span><Btn variant="ghost">Sign in</Btn></span></SignInButton>
            <SignUpButton mode="modal"><span><Btn>Start free</Btn></span></SignUpButton>
          </SignedOut>
          <SignedIn><UserButton /></SignedIn>
        </div>
      </div>
    );
  }

  const navBtn = {
    background: "none",
    border: "none",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  };

  function Landing() {
    return (
      <div style={{ marginTop: 40 }}>
        <div style={{ maxWidth: 900 }}>
          <div style={{ display: "inline-block", padding: "8px 14px", borderRadius: 999, border: `1px solid ${colors.border}`, background: "rgba(255,255,255,0.05)", fontWeight: 800, fontSize: 12 }}>⚡ REALTIME CLIP ENGINE</div>
          <h1 style={{ fontSize: 60, margin: "16px 0", lineHeight: 1.05 }}>Turn long videos into viral clips instantly.</h1>
          <p style={{ color: colors.textDim, fontSize: 17, lineHeight: 1.6 }}>Upload once. AI finds the strongest moments. Export ready for TikTok, Reels and Shorts in minutes.</p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <SignedOut><SignUpButton mode="modal"><span><Btn>Generate clips now</Btn></span></SignUpButton></SignedOut>
            <SignedIn><Btn onClick={() => setPage(PAGES.DASHBOARD)}>Open dashboard</Btn></SignedIn>
          </div>
        </div>
      </div>
    );
  }

  function Welcome() {
    return (
      <Panel style={{ marginTop: 30 }}>
        <h2>Welcome to ClipGenius</h2>
        <p style={{ color: colors.textDim }}>Your AI engine is ready. Upload a video and generate clips instantly.</p>
        <Btn onClick={() => setPage(PAGES.DASHBOARD)}>Go to Dashboard</Btn>
      </Panel>
    );
  }

  // ============================================================
  // ====== LEGAL PAGE COMPONENTS ======
  // ============================================================

  // 1. TERMS OF SERVICE PAGE
  function TermsPage() {
    return (
      <div style={{ marginTop: 40 }}>
        <Panel>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>📄 Terms of Service</h1>
          <div style={{ color: colors.textDim, marginBottom: 30, borderBottom: `1px solid ${colors.border}`, paddingBottom: 16 }}>Last Updated: July 14, 2026</div>
          <div style={{ background: "#2e1a1a", borderLeft: "5px solid #f87171", padding: 16, marginBottom: 20, borderRadius: "0 8px 8px 0" }}>
            <strong style={{ color: "#f87171" }}>⚠️ IMPORTANT:</strong> By subscribing and using ClipGenius, you agree that you are solely responsible for copyright compliance, content rights, and platform terms. We do not review your content for legal issues. You bear all risk and liability for your use of the Service.
          </div>
          <p style={{ color: colors.textDim }}>By accessing or using the ClipGenius Service, you agree to be bound by these Terms of Service. If you do not agree to these Terms, you may not use the Service.</p>
          <div style={{ background: "#2e1a1a", borderLeft: "5px solid #f87171", padding: 16, margin: "20px 0", borderRadius: "0 8px 8px 0" }}>
            <p><strong style={{ color: "#f87171" }}>⚠️ READ THESE TERMS CAREFULLY</strong></p>
            <p style={{ color: colors.textDim }}>These Terms contain important limitations on liability, warranty disclaimers, indemnification obligations, and an arbitration clause.</p>
          </div>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>1. Acceptance of Terms</h2>
          <p style={{ color: colors.textDim }}>We reserve the right to update these Terms at any time. Your continued use constitutes acceptance of the updated Terms.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>2. Description of Service</h2>
          <p style={{ color: colors.textDim }}>ClipGenius provides an automated video clipping service that processes uploaded videos, identifies viral moments using AI, generates short video clips, adds subtitles and effects, and produces platform-optimized content.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>3. Account Registration</h2>
          <p style={{ color: colors.textDim }}>You must be at least 18 years old, provide accurate information, and maintain account security.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>4. User Content and Intellectual Property</h2>
          <p style={{ color: colors.textDim }}>You retain ownership of your content. By using the Service, you grant us a limited license to process your content to provide the Service.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>5. Prohibited Content</h2>
          <p style={{ color: colors.textDim }}>You may NOT upload illegal content, copyright-infringing material, child sexual abuse material, violence, fraud, defamatory content, harassment, hate speech, pornography, or content that violates others' privacy.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>6. Copyright and Fair Use</h2>
          <p style={{ color: colors.textDim }}>You are responsible for ensuring you have rights to all content. We comply with the DMCA and respond to takedown notices.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>7. Payment and Subscription</h2>
          <p style={{ color: colors.textDim }}>Fees are billed in advance, subscriptions renew automatically, and refunds are at our discretion.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>8. No Warranty on Results</h2>
          <p style={{ color: colors.textDim }}>ClipGenius does not guarantee that any clip will go viral or achieve specific views. Virality scores are estimates only.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>9. AI-Generated Content Disclaimer</h2>
          <p style={{ color: colors.textDim }}>AI-generated content may contain inaccuracies. You are solely responsible for reviewing all output before publishing.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>10. Arbitration & Class Action Waiver</h2>
          <p style={{ color: colors.textDim }}>Any dispute will be resolved through binding arbitration. You waive any right to participate in a class action lawsuit.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>11. Contact</h2>
          <p style={{ color: colors.textDim }}>Email: <a href="mailto:aividsgeneator@gmail.com" style={{ color: "#8b5cf6" }}>aividsgeneator@gmail.com</a></p>
          <Btn onClick={() => setPage(PAGES.LEGAL)} variant="ghost" style={{ marginTop: 20 }}>← Back to Legal Center</Btn>
        </Panel>
      </div>
    );
  }

  // 2. PRIVACY POLICY PAGE
  function PrivacyPage() {
    return (
      <div style={{ marginTop: 40 }}>
        <Panel>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>🔒 Privacy Policy</h1>
          <div style={{ color: colors.textDim, marginBottom: 30, borderBottom: `1px solid ${colors.border}`, paddingBottom: 16 }}>Last Updated: July 14, 2026</div>
          <p style={{ color: colors.textDim }}>ClipGenius is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>1. Information We Collect</h2>
          <p style={{ color: colors.textDim }}><strong>Account Information:</strong> Name, email, username, password (encrypted), profile information.</p>
          <p style={{ color: colors.textDim }}><strong>Content You Upload:</strong> Video files, audio files, images, transcripts, metadata.</p>
          <p style={{ color: colors.textDim }}><strong>Usage Data:</strong> Log data, device information, interaction data, session duration.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>2. How We Use Your Information</h2>
          <p style={{ color: colors.textDim }}>We use your data for service provision, improvement and development, communication, and legal compliance.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>3. Data Sharing</h2>
          <p style={{ color: colors.textDim }}>We share data with hosting providers, payment processors (e.g., Stripe), analytics providers, and customer support tools.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>4. Your Rights</h2>
          <p style={{ color: colors.textDim }}><strong>GDPR (EU/EEA):</strong> Access, rectification, erasure, restriction, portability, objection, withdraw consent.</p>
          <p style={{ color: colors.textDim }}><strong>CCPA (California):</strong> Know, delete, opt-out, non-discrimination, access.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>5. Contact</h2>
          <p style={{ color: colors.textDim }}>Email: <a href="mailto:aividsgeneator@gmail.com" style={{ color: "#8b5cf6" }}>aividsgeneator@gmail.com</a></p>
          <Btn onClick={() => setPage(PAGES.LEGAL)} variant="ghost" style={{ marginTop: 20 }}>← Back to Legal Center</Btn>
        </Panel>
      </div>
    );
  }

  // 3. COPYRIGHT POLICY PAGE
  function CopyrightPage() {
    return (
      <div style={{ marginTop: 40 }}>
        <Panel>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>📋 Copyright & Fair Use Policy</h1>
          <div style={{ color: colors.textDim, marginBottom: 30, borderBottom: `1px solid ${colors.border}`, paddingBottom: 16 }}>Last Updated: July 14, 2026</div>
          <div style={{ background: "#2e1a1a", borderLeft: "5px solid #f87171", padding: 16, marginBottom: 20, borderRadius: "0 8px 8px 0" }}>
            <strong style={{ color: "#f87171" }}>⚠️ IMPORTANT:</strong> ClipGenius is a paid commercial service. You are solely responsible for ensuring your use of any content qualifies as fair use.
          </div>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>1. User Warranties</h2>
          <p style={{ color: colors.textDim }}>You warrant that you own the rights to all content, have the right to create derivative works, and your use will not infringe on any rights.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>2. Fair Use Guidelines</h2>
          <p style={{ color: colors.textDim }}>Transformative use for commentary, criticism, education, parody, and news reporting may qualify as fair use.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>3. Commercial Use Warning</h2>
          <p style={{ color: colors.textDim }}><strong>Because you are using the Service for commercial purposes, fair use protections may be narrower for commercial uses.</strong></p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>4. DMCA Compliance</h2>
          <p style={{ color: colors.textDim }}>DMCA Agent: <a href="mailto:aividsgeneator@gmail.com" style={{ color: "#8b5cf6" }}>aividsgeneator@gmail.com</a></p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>5. Contact</h2>
          <p style={{ color: colors.textDim }}>Email: <a href="mailto:aividsgeneator@gmail.com" style={{ color: "#8b5cf6" }}>aividsgeneator@gmail.com</a></p>
          <Btn onClick={() => setPage(PAGES.LEGAL)} variant="ghost" style={{ marginTop: 20 }}>← Back to Legal Center</Btn>
        </Panel>
      </div>
    );
  }

  // 4. PLATFORM COMPLIANCE PAGE (NEW - with Twitch)
  function PlatformPage() {
    return (
      <div style={{ marginTop: 40 }}>
        <Panel>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>📱 Platform ToS Compliance Policy</h1>
          <div style={{ color: colors.textDim, marginBottom: 30, borderBottom: `1px solid ${colors.border}`, paddingBottom: 16 }}>Last Updated: July 14, 2026</div>
          <div style={{ background: "#2e1a1a", borderLeft: "5px solid #f87171", padding: 16, marginBottom: 20, borderRadius: "0 8px 8px 0" }}>
            <strong style={{ color: "#f87171" }}>⚠️ IMPORTANT:</strong> You are solely responsible for complying with all third-party platform terms of service. ClipGenius provides tools, but you are responsible for how you use them.
          </div>
          <p style={{ color: colors.textDim }}>This Platform Terms of Service Compliance Policy governs your use of third-party platforms, including but not limited to YouTube and Twitch, through the ClipGenius Service.</p>
          <div style={{ background: "#2e1a1a", borderLeft: "5px solid #f87171", padding: 16, margin: "20px 0", borderRadius: "0 8px 8px 0" }}>
            <p><strong style={{ color: "#f87171" }}>⚠️ DISCLAIMER:</strong></p>
            <p style={{ color: colors.textDim }}>We do not guarantee that your use of the Service will comply with any platform's terms. You must independently verify compliance.</p>
          </div>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>1. YouTube Terms of Service</h2>
          <p style={{ color: colors.textDim }}><strong>❌ You may NOT:</strong> Download videos without permission, circumvent security, violate Community Guidelines, spam, harass, or use automated means.</p>
          <p style={{ color: colors.textDim }}><strong>✅ You MAY:</strong> Use your own content, content with permission, fair use content, and public YouTube features.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>2. Twitch Terms of Service</h2>
          <p style={{ color: colors.textDim }}><strong>❌ You may NOT:</strong> Download streams without permission, circumvent security, violate Community Guidelines, harass, spam, or re-upload without permission.</p>
          <p style={{ color: colors.textDim }}><strong>✅ You MAY:</strong> Use your own streams and VODs, content with permission, fair use content, and create transformative clips.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>3. Other Platforms</h2>
          <p style={{ color: colors.textDim }}>Comply with TikTok, Instagram, Vimeo, and each platform's individual terms of service.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>4. Content Ownership</h2>
          <p style={{ color: colors.textDim }}>You warrant you have rights to upload, process, distribute, and commercialize your content.</p>
          <h2 style={{ fontSize: 22, marginTop: 30, marginBottom: 12 }}>5. Contact</h2>
          <p style={{ color: colors.textDim }}>Email: <a href="mailto:aividsgeneator@gmail.com" style={{ color: "#8b5cf6" }}>aividsgeneator@gmail.com</a></p>
          <Btn onClick={() => setPage(PAGES.LEGAL)} variant="ghost" style={{ marginTop: 20 }}>← Back to Legal Center</Btn>
        </Panel>
      </div>
    );
  }

  // 5. LEGAL CENTER (INDEX PAGE)
  function LegalCenter() {
    return (
      <div style={{ marginTop: 40 }}>
        <Panel>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>⚖️ Legal Center</h1>
          <p style={{ color: colors.textDim, marginBottom: 30 }}>Your privacy and rights matter to us. Review our legal documents below.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Terms of Service */}
            <div 
              onClick={() => setPage(PAGES.TERMS)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                padding: 20,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8b5cf6"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
              <h3 style={{ fontSize: 18, marginBottom: 4 }}>Terms of Service</h3>
              <p style={{ fontSize: 13, color: colors.textDim }}>The agreement between you and ClipGenius governing your use of our Service.</p>
              <div style={{ marginTop: 12, display: "inline-block", padding: "2px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: "#2e1a1a", color: "#f87171" }}>Required</div>
            </div>

            {/* Privacy Policy */}
            <div 
              onClick={() => setPage(PAGES.PRIVACY)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                padding: 20,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8b5cf6"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
              <h3 style={{ fontSize: 18, marginBottom: 4 }}>Privacy Policy</h3>
              <p style={{ fontSize: 13, color: colors.textDim }}>How we collect, use, and protect your personal information.</p>
              <div style={{ marginTop: 12, display: "inline-block", padding: "2px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: "#2e1a1a", color: "#f87171" }}>Required</div>
              <span style={{ marginLeft: 4, fontSize: 10, color: "#60a5fa" }}>GDPR / CCPA</span>
            </div>

            {/* Copyright Policy */}
            <div 
              onClick={() => setPage(PAGES.COPYRIGHT)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                padding: 20,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8b5cf6"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
              <h3 style={{ fontSize: 18, marginBottom: 4 }}>Copyright & Fair Use</h3>
              <p style={{ fontSize: 13, color: colors.textDim }}>Our policy on copyright, fair use, and DMCA takedown procedures.</p>
              <div style={{ marginTop: 12, display: "inline-block", padding: "2px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: "#2e1a1a", color: "#f87171" }}>Required</div>
            </div>

            {/* Platform Compliance */}
            <div 
              onClick={() => setPage(PAGES.PLATFORM)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                padding: 20,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8b5cf6"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📱</div>
              <h3 style={{ fontSize: 18, marginBottom: 4 }}>Platform ToS Compliance</h3>
              <p style={{ fontSize: 13, color: colors.textDim }}>How to comply with YouTube, Twitch, TikTok, and Instagram.</p>
              <div style={{ marginTop: 12, display: "inline-block", padding: "2px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: "#1a1a2e", color: "#60a5fa" }}>Important</div>
            </div>
          </div>

          <div style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${colors.border}`, fontSize: 12, color: "#666", textAlign: "center" }}>
            <p>These documents are provided for informational purposes. They do not constitute legal advice.</p>
            <p style={{ marginTop: 4 }}>Contact us at <a href="mailto:aividsgeneator@gmail.com" style={{ color: "#8b5cf6" }}>aividsgeneator@gmail.com</a></p>
          </div>

          <Btn onClick={() => setPage(PAGES.DASHBOARD)} variant="ghost" style={{ marginTop: 20 }}>← Back to Dashboard</Btn>
        </Panel>
      </div>
    );
  }

  // ============================================================
  // ====== DASHBOARD ======
  // ============================================================

  function Dashboard() {
    const [clipLength, setClipLength] = useState(18);
    const [maxClips, setMaxClips] = useState(5);
    const [ratio, setRatio] = useState("9:16");
    const [subtitleOn, setSubtitleOn] = useState(true);
    const [subtitleColor, setSubtitleColor] = useState("white");
    const [file, setFile] = useState(null);
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [creating, setCreating] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [workerProgress, setWorkerProgress] = useState(0);
    const [currentJobId, setCurrentJobId] = useState(null);
    const [workerStatus, setWorkerStatus] = useState("");
    const [credits, setCredits] = useState(0);
    const [showBuyCredits, setShowBuyCredits] = useState(false);
    const [buyingCredits, setBuyingCredits] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loadingCredits, setLoadingCredits] = useState(false);

    // ====== STEP TRACKER STATE ======
    const [currentStep, setCurrentStep] = useState(0);
    const [stepStatus, setStepStatus] = useState("");
    const [elapsedTime, setElapsedTime] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(0);
    const [showTimeTracker, setShowTimeTracker] = useState(false);
    const [processingStages, setProcessingStages] = useState([
      { id: 0, label: "📤 Uploading video", status: "pending", description: "Preparing your video for AI analysis" },
      { id: 1, label: "🎤 Analyzing audio & speech", status: "pending", description: "Detecting speech patterns and key moments" },
      { id: 2, label: "🧠 Detecting viral moments", status: "pending", description: "AI scanning for high-engagement segments" },
      { id: 3, label: "✂️ Cutting clips", status: "pending", description: "Creating optimized short clips from detected moments" },
      { id: 4, label: "🎨 Adding subtitles & effects", status: "pending", description: "Applying subtitles and visual enhancements" },
      { id: 5, label: "📦 Finalizing & exporting", status: "pending", description: "Rendering and preparing your clips for download" },
    ]);

    // Feedback state
    const [feedbackText, setFeedbackText] = useState("");
    const [feedbackRating, setFeedbackRating] = useState(0);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [feedbackSaving, setFeedbackSaving] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    
    // State for viewing clips from a completed job
    const [selectedJobClips, setSelectedJobClips] = useState(null);
    const [showJobClipsModal, setShowJobClipsModal] = useState(false);

    const subtitleColors = [
      { id: "black", color: "#000000" },
      { id: "white", color: "#ffffff" },
      { id: "red", color: "#ef4444" },
      { id: "green", color: "#22c55e" },
      { id: "blue", color: "#3b82f6" },
      { id: "yellow", color: "#facc15" },
    ];

    async function loadCredits() {
      try {
        setLoadingCredits(true);
        const res = await fetch("/api/credits");
        const data = await res.json();
        if (data.balance !== undefined) setCredits(data.balance);
        if (data.transactions) setTransactions(data.transactions);
      } catch (e) { console.log(e); } finally { setLoadingCredits(false); }
    }

    async function buyCredits(creditsAmount) {
      setBuyingCredits(true);
      try {
        const res = await fetch("/api/paddle/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credits: creditsAmount }) });
        const { url } = await res.json();
        window.location.href = url;
      } catch (e) { alert("Error starting checkout: " + e.message); } finally { setBuyingCredits(false); }
    }

    async function loadJobs() {
      try {
        setLoadingJobs(true);
        const res = await fetch("/api/jobs");
        const text = await res.text();
        const data = safeJson(text);
        if (!res.ok) throw new Error();
        setJobs(data?.jobs || []);
      } catch (e) { console.log(e); } finally { setLoadingJobs(false); }
    }

    // Submit feedback to Supabase
    async function submitFeedback() {
      if (!feedbackText.trim() && feedbackRating === 0) {
        alert("Please write some feedback or select a rating.");
        return;
      }
      setFeedbackSaving(true);
      try {
        const { error } = await supabase
          .from('feedback')
          .insert([{
            feedback: feedbackText,
            rating: feedbackRating,
            created_at: new Date().toISOString(),
          }]);
        if (error) throw error;
        setFeedbackSubmitted(true);
        setFeedbackText("");
        setFeedbackRating(0);
        setTimeout(() => setFeedbackSubmitted(false), 3000);
      } catch (e) {
        console.error("Error saving feedback:", e);
        alert("Error saving feedback. Please try again.");
      } finally {
        setFeedbackSaving(false);
      }
    }

    // Function to view clips from a completed job
    function viewJobClips(job) {
      if (job.clips && job.clips.length > 0) {
        setSelectedJobClips(job.clips);
        setShowJobClipsModal(true);
      } else if (job.clips_data && job.clips_data.length > 0) {
        setSelectedJobClips(job.clips_data);
        setShowJobClipsModal(true);
      } else {
        alert("No clips found for this job");
      }
    }

    // ====== TIME TRACKER ======
    useEffect(() => {
      let timeInterval;
      if (showTimeTracker && creating) {
        timeInterval = setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
      }
      return () => clearInterval(timeInterval);
    }, [showTimeTracker, creating]);

    // ====== STEP PROGRESS SIMULATION ======
    useEffect(() => {
      if (!creating || !currentJobId) return;

      // Reset stages when starting
      if (currentStep === 0) {
        setProcessingStages(prev => prev.map((s, i) => 
          i === 0 ? { ...s, status: "active" } : { ...s, status: "pending" }
        ));
        setStepStatus("📤 Uploading video...");
      }

      // Simulate step progression with realistic timing (shows before clips are made)
      const stepTimings = [
        { step: 1, delay: 8000, status: "🎤 Analyzing audio & speech...", description: "Detecting speech patterns and key moments" },
        { step: 2, delay: 15000, status: "🧠 Detecting viral moments...", description: "AI scanning for high-engagement segments" },
        { step: 3, delay: 10000, status: "✂️ Cutting clips...", description: "Creating optimized short clips from detected moments" },
        { step: 4, delay: 12000, status: "🎨 Adding subtitles & effects...", description: "Applying subtitles and visual enhancements" },
        { step: 5, delay: 5000, status: "📦 Finalizing & exporting...", description: "Rendering and preparing your clips for download" },
      ];

      let totalDelay = 0;
      const timers = [];

      // Mark upload as complete (step 0)
      setTimeout(() => {
        setProcessingStages(prev => prev.map((s, i) => 
          i === 0 ? { ...s, status: "complete" } : s
        ));
      }, 2000);

      // Schedule each step
      stepTimings.forEach(({ step, delay, status, description }) => {
        totalDelay += delay;
        const timer = setTimeout(() => {
          setCurrentStep(step);
          setStepStatus(status);
          setProcessingStages(prev => prev.map((s, i) => 
            i === step ? { ...s, status: "active", description: description } : 
            i < step ? { ...s, status: "complete" } : s
          ));
          setEstimatedTime(Math.round((totalDelay / 1000) / 60 * 10) / 10);
        }, totalDelay);
        timers.push(timer);
      });

      // Final completion (all steps done)
      const finalTimer = setTimeout(() => {
        setProcessingStages(prev => prev.map(s => ({ ...s, status: "complete" })));
        setCurrentStep(6);
        setStepStatus("✅ Complete! Your clips are ready!");
      }, totalDelay + 3000);

      return () => {
        timers.forEach(t => clearTimeout(t));
        clearTimeout(finalTimer);
      };
    }, [creating, currentJobId]);

    // REAL-TIME + POLLING
    useEffect(() => {
      if (!currentJobId) return;

      function updateProgress(job) {
        const totalClips = job.max_clips || 5;
        const progress = (job.clip_count / totalClips) * 100;
        setWorkerProgress(progress);
        setWorkerStatus(`Processing clip ${job.clip_count || 0} of ${totalClips}`);
        
        if (job.status === 'completed') {
          setWorkerProgress(100);
          setWorkerStatus("Complete!");
          setCreating(false);
          setShowFeedback(true);
          // Mark all steps as complete
          setProcessingStages(prev => prev.map(s => ({ ...s, status: "complete" })));
          setStepStatus("✅ All clips generated successfully!");
          setTimeout(() => { 
            setWorkerProgress(0); 
            setCurrentJobId(null); 
            setWorkerStatus(""); 
            setShowTimeTracker(false);
          }, 3000);
          loadJobs();
          loadCredits();
        }
        
        if (job.status === 'failed') {
          setWorkerStatus("Failed!");
          setCreating(false);
          setProcessingStages(prev => prev.map(s => ({ ...s, status: "error" })));
          alert("Job failed: " + job.error_message);
        }
      }

      const channel = supabase
        .channel(`job-${currentJobId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'jobs',
            filter: `id=eq.${currentJobId}`
          },
          (payload) => {
            updateProgress(payload.new);
          }
        )
        .subscribe();

      const interval = setInterval(async () => {
        const { data: job, error } = await supabase
          .from('jobs')
          .select('clip_count, max_clips, status, clips_data')
          .eq('id', currentJobId)
          .single();
        
        if (job && !error) {
          updateProgress(job);
        }
      }, 2000);

      return () => {
        supabase.removeChannel(channel);
        clearInterval(interval);
      };
    }, [currentJobId]);

    useEffect(() => { loadJobs(); loadCredits(); }, []);

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get("success");
      if (success === "true") {
        loadCredits();
        window.history.replaceState({}, document.title, window.location.pathname);
        alert("✅ Payment successful! Credits added to your account.");
      }
    }, []);

    // ====== RESET PROGRESS STEPS ======
    function resetProcessingSteps() {
      setCurrentStep(0);
      setStepStatus("");
      setElapsedTime(0);
      setEstimatedTime(0);
      setShowTimeTracker(false);
      setProcessingStages([
        { id: 0, label: "📤 Uploading video", status: "pending", description: "Preparing your video for AI analysis" },
        { id: 1, label: "🎤 Analyzing audio & speech", status: "pending", description: "Detecting speech patterns and key moments" },
        { id: 2, label: "🧠 Detecting viral moments", status: "pending", description: "AI scanning for high-engagement segments" },
        { id: 3, label: "✂️ Cutting clips", status: "pending", description: "Creating optimized short clips from detected moments" },
        { id: 4, label: "🎨 Adding subtitles & effects", status: "pending", description: "Applying subtitles and visual enhancements" },
        { id: 5, label: "📦 Finalizing & exporting", status: "pending", description: "Rendering and preparing your clips for download" },
      ]);
    }

    // ====== RENDER STEP PROGRESS ======
    function renderStepProgress() {
      return (
        <div style={{ marginTop: 20 }}>
          {/* Time Tracker */}
          {showTimeTracker && (
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "12px 16px",
              background: "rgba(139,92,246,0.1)",
              borderRadius: 12,
              marginBottom: 16,
              border: "1px solid rgba(139,92,246,0.3)"
            }}>
              <div>
                <span style={{ fontSize: 13, color: colors.textDim }}>⏱️ Elapsed: </span>
                <span style={{ fontWeight: 700, color: "#fff" }}>
                  {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s
                </span>
              </div>
              <div>
                <span style={{ fontSize: 13, color: colors.textDim }}>⏳ Est. remaining: </span>
                <span style={{ fontWeight: 700, color: "#8b5cf6" }}>
                  {estimatedTime > 0 ? `${estimatedTime}m` : "Calculating..."}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#22c55e" }}>
                🔄 Keep this tab open
              </div>
            </div>
          )}

          {/* Step Status Text */}
          {stepStatus && (
            <div style={{ 
              fontSize: 15, 
              fontWeight: 600, 
              color: "#8b5cf6",
              marginBottom: 16,
              padding: "8px 12px",
              background: "rgba(139,92,246,0.08)",
              borderRadius: 8,
              border: "1px solid rgba(139,92,246,0.15)"
            }}>
              {stepStatus}
            </div>
          )}

          {/* Step List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {processingStages.map((stage) => (
              <div
                key={stage.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: stage.status === "complete" ? "rgba(34,197,94,0.1)" :
                             stage.status === "active" ? "rgba(139,92,246,0.15)" :
                             stage.status === "error" ? "rgba(239,68,68,0.1)" :
                             "rgba(255,255,255,0.03)",
                  border: `1px solid ${
                    stage.status === "complete" ? "rgba(34,197,94,0.3)" :
                    stage.status === "active" ? "rgba(139,92,246,0.3)" :
                    stage.status === "error" ? "rgba(239,68,68,0.3)" :
                    "rgba(255,255,255,0.06)"
                  }`,
                  transition: "all 0.3s ease",
                  opacity: stage.status === "pending" ? 0.5 : 1,
                }}
              >
                {/* Status Icon */}
                <div style={{ width: 28, fontSize: 18, flexShrink: 0 }}>
                  {stage.status === "complete" && "✅"}
                  {stage.status === "active" && "⏳"}
                  {stage.status === "pending" && "⏸️"}
                  {stage.status === "error" && "❌"}
                </div>

                {/* Step Label & Description */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: 14, 
                    fontWeight: stage.status === "active" ? 700 : 500,
                    color: stage.status === "complete" ? "#22c55e" :
                           stage.status === "active" ? "#8b5cf6" :
                           stage.status === "error" ? "#ef4444" :
                           colors.textDim
                  }}>
                    {stage.label}
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: colors.textDim,
                    marginTop: 2
                  }}>
                    {stage.status === "complete" ? "✓ Done" :
                     stage.status === "active" ? stage.description :
                     stage.status === "error" ? "⚠️ Error" :
                     stage.description}
                  </div>
                </div>

                {/* Progress Dots */}
                <div style={{ display: "flex", gap: 4 }}>
                  {stage.status === "active" && (
                    <>
                      <span style={{ animation: "pulse 1s ease-in-out infinite" }}>●</span>
                      <span style={{ animation: "pulse 1s ease-in-out infinite 0.3s" }}>●</span>
                      <span style={{ animation: "pulse 1s ease-in-out infinite 0.6s" }}>●</span>
                    </>
                  )}
                  {stage.status === "complete" && (
                    <span style={{ color: "#22c55e" }}>●</span>
                  )}
                  {stage.status === "pending" && (
                    <span style={{ color: "#444" }}>○</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Wait Time Message */}
          {showTimeTracker && (
            <div style={{ 
              marginTop: 16, 
              padding: "12px 16px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 10,
              border: `1px solid ${colors.border}`,
              textAlign: "center"
            }}>
              <p style={{ fontSize: 13, color: colors.textDim, margin: 0 }}>
                ⏰ This process takes 5-10 minutes. Feel free to keep this tab open and relax! ☕
              </p>
            </div>
          )}
        </div>
      );
    }

    async function createJob() {
      if (!acceptTerms) {
        alert("You must confirm content ownership and accept Terms.");
        return;
      }
      if (!file && !youtubeUrl) {
        alert("Upload video OR paste YouTube/Twitch link");
        return;
      }
      if (credits < maxClips) {
        alert(`Insufficient credits. You need ${maxClips} credits but have ${credits}. Buy more credits.`);
        setShowBuyCredits(true);
        return;
      }

      // Reset and start progress tracking
      resetProcessingSteps();
      setShowTimeTracker(true);
      setElapsedTime(0);
      setEstimatedTime(0);

      try {
        setCreating(true);
        setWorkerProgress(0);
        setWorkerStatus("Waiting for AI...");
        setStatusText("Uploading video...");
        setUploadProgress(0);
        setIsUploading(true);
        setShowFeedback(false);

        let videoPath = null;

        if (file) {
          const resUpload = await fetch("/api/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: file.name, contentType: file.type }),
          });
          const { uploadUrl, path } = await resUpload.json();

          await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", (event) => {
              if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percent);
                setStatusText(`Uploading: ${percent}%`);
              }
            });
            xhr.onload = () => { if (xhr.status === 200) resolve(); else reject(new Error("Upload failed")); };
            xhr.onerror = () => reject(new Error("Upload failed"));
            xhr.open("PUT", uploadUrl);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.send(file);
          });
          videoPath = path;
        }

        setUploadProgress(100);
        setStatusText("Video uploaded! Starting AI...");
        setIsUploading(false);
        setWorkerProgress(0);
        setWorkerStatus("AI analyzing video... 0%");

        const res = await fetch("/api/jobs/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clipLength, maxClips, ratio, subtitleOn, subtitleColor, videoPath, youtubeUrl }),
        });

        const text = await res.text();
        const json = safeJson(text);
        if (!res.ok) throw new Error(json?.error || "Job failed");

        if (json.job?.id) {
          setCurrentJobId(json.job.id);
          setWorkerStatus("AI processing... 0%");
        }

        const spendRes = await fetch("/api/credits/spend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: maxClips, jobId: json.job?.id }),
        });
        const spendData = await spendRes.json();
        if (spendData.success) setCredits(spendData.balance);

        setFile(null);
        setYoutubeUrl("");
        setStatusText("");
        await loadJobs();

      } catch (e) {
        console.log(e);
        alert("Error creating job: " + e.message);
        setCreating(false);
        setWorkerProgress(0);
        setWorkerStatus("");
        setIsUploading(false);
        setShowTimeTracker(false);
      }
    }

    return (
      <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 22 }}>
        <Panel>
          <h2>Generate Clips</h2>
          <p style={{ color: colors.textDim }}>Upload → AI detects moments → clips ready fast.</p>

          <div style={{ marginTop: 16, padding: 16, background: "rgba(139,92,246,0.1)", borderRadius: 16, border: "1px solid rgba(139,92,246,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, color: colors.textDim }}>Your Credits</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#8b5cf6" }}>{loadingCredits ? "..." : credits}</div>
                <div style={{ fontSize: 12, color: colors.textDim }}>1 credit = 1 clip</div>
              </div>
              <Btn onClick={() => setShowBuyCredits(true)} variant="primary" disabled={buyingCredits}>{buyingCredits ? "Loading..." : "Buy Credits"}</Btn>
            </div>
          </div>

          <div style={{ marginTop: 18 }}><div style={{ fontSize: 13 }}>Upload video</div><input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13 }}>or YouTube / Twitch link</div>
            <input 
              value={youtubeUrl} 
              onChange={(e) => setYoutubeUrl(e.target.value)} 
              placeholder="https://youtube.com/... or https://twitch.tv/..." 
              style={{ width: "100%", padding: 12, borderRadius: 12, border: `1px solid ${colors.border}`, background: "rgba(255,255,255,0.04)", color: "white" }} 
            />
          </div>

          <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><div style={{ fontSize: 13 }}>Clip length</div><input type="number" value={clipLength} onChange={(e) => setClipLength(parseInt(e.target.value))} style={{ width: "100%", padding: 10, borderRadius: 12 }} /></div>
            <div><div style={{ fontSize: 13 }}>Max clips</div><input type="number" value={maxClips} onChange={(e) => setMaxClips(parseInt(e.target.value))} style={{ width: "100%", padding: 10, borderRadius: 12 }} /><div style={{ fontSize: 11, color: colors.textDim, marginTop: 4 }}>Cost: {maxClips} credits</div></div>
            <div><div style={{ fontSize: 13 }}>Ratio</div><select value={ratio} onChange={(e) => setRatio(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 12 }}><option value="9:16">9:16</option><option value="1:1">1:1</option><option value="16:9">16:9</option></select></div>
          </div>

          <div style={{ marginTop: 26 }}>
            <div style={{ fontWeight: 800 }}>Subtitles</div>
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}><Btn variant={subtitleOn ? "primary" : "ghost"} onClick={() => setSubtitleOn(true)}>ON</Btn><Btn variant={!subtitleOn ? "primary" : "ghost"} onClick={() => setSubtitleOn(false)}>OFF</Btn></div>
            {subtitleOn && (<div style={{ display: "flex", gap: 10, marginTop: 14 }}>{subtitleColors.map(c => (<div key={c.id} onClick={() => setSubtitleColor(c.id)} style={{ width: 36, height: 36, borderRadius: 999, background: c.color, border: subtitleColor === c.id ? "3px solid white" : "2px solid rgba(255,255,255,0.2)", cursor: "pointer" }} />))}</div>)}
          </div>

          <div style={{ marginTop: 26 }}>
            <label style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
              <span style={{ fontSize: 13, color: colors.textDim }}>
                I confirm I own this content and accept the{" "}
                <span onClick={() => setPage(PAGES.TERMS)} style={{ color: "#8b5cf6", cursor: "pointer", textDecoration: "underline" }}>Terms of Service</span>,{" "}
                <span onClick={() => setPage(PAGES.PRIVACY)} style={{ color: "#8b5cf6", cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</span>, and{" "}
                <span onClick={() => setPage(PAGES.COPYRIGHT)} style={{ color: "#8b5cf6", cursor: "pointer", textDecoration: "underline" }}>Copyright Policy</span>.
              </span>
            </label>
          </div>

          {isUploading && (
            <div style={{ marginTop: 20 }}>
              <div style={{ width: "100%", height: 8, background: "#333", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${uploadProgress}%`, height: "100%", background: "#8b5cf6", transition: "width 0.3s ease" }} /></div>
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 13, color: "#8b5cf6", fontWeight: 500 }}>Uploading: {uploadProgress}%</div>
            </div>
          )}

          {creating && (
            <div style={{ marginTop: 20 }}>
              <div style={{ width: "100%", height: 8, background: "#333", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${workerProgress}%`, height: "100%", background: "#22c55e", transition: "width 0.3s ease" }} /></div>
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 13, color: "#22c55e", fontWeight: 500 }}>{workerStatus} - {Math.round(workerProgress)}%</div>
            </div>
          )}

          {/* ====== STEP PROGRESS TRACKER ====== */}
          {creating && renderStepProgress()}

          <div style={{ marginTop: 30 }}><Btn onClick={createJob} disabled={creating || credits < maxClips}>{creating ? "Processing..." : credits < maxClips ? `Need ${maxClips - credits} more credits` : "Generate Clips"}</Btn></div>
          {statusText && <div style={{ marginTop: 14, color: "#8b5cf6", fontWeight: 800 }}>{statusText}</div>}

          {/* Feedback Section */}
          {showFeedback && !feedbackSubmitted && (
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${colors.border}` }}>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>💬 How was your experience?</h3>
              <p style={{ fontSize: 13, color: colors.textDim, marginBottom: 12 }}>Your feedback helps us improve ClipGenius!</p>
              
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    style={{
                      fontSize: 30,
                      cursor: "pointer",
                      color: star <= feedbackRating ? "#facc15" : "#444",
                      transition: "color 0.2s ease",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us what you think... (optional)"
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 12,
                  border: `1px solid ${colors.border}`,
                  background: "rgba(255,255,255,0.04)",
                  color: "white",
                  minHeight: 80,
                  resize: "vertical",
                  fontFamily: "inherit",
                  fontSize: 14,
                }}
              />
              
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <Btn onClick={submitFeedback} disabled={feedbackSaving} variant="primary">
                  {feedbackSaving ? "Saving..." : "Submit Feedback"}
                </Btn>
                <Btn onClick={() => setShowFeedback(false)} variant="ghost">
                  Skip
                </Btn>
              </div>
            </div>
          )}

          {feedbackSubmitted && (
            <div style={{ marginTop: 24, padding: 16, background: "rgba(34,197,94,0.15)", borderRadius: 12, border: "1px solid #22c55e" }}>
              <p style={{ color: "#22c55e", fontWeight: 700 }}>✅ Thank you for your feedback!</p>
            </div>
          )}
        </Panel>

        <Panel>
          <h3>Your Jobs</h3>
          {loadingJobs ? (<div style={{ color: colors.textDim }}>Loading…</div>) : jobs.length === 0 ? (<div style={{ color: colors.textDim }}>No clips yet.</div>) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {jobs.map((j) => (
                <div 
                  key={j.id} 
                  style={{ 
                    padding: 16, 
                    borderRadius: 16, 
                    border: `1px solid ${colors.border}`, 
                    background: "rgba(255,255,255,0.03)",
                    cursor: j.status === "completed" ? "pointer" : "default",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => {
                    if (j.status === "completed") {
                      viewJobClips(j);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (j.status === "completed") {
                      e.currentTarget.style.background = "rgba(139,92,246,0.15)";
                      e.currentTarget.style.borderColor = "#8b5cf6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = `1px solid ${colors.border}`;
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>
                    {j.status}
                    {j.clip_count && ` • ${j.clip_count} clips`}
                    {j.credits_spent && (<span style={{ fontSize: 11, color: colors.textDim, marginLeft: 8 }}>({j.credits_spent} credits)</span>)}
                  </div>
                  {j.status === "completed" && (
                    <div style={{ fontSize: 12, color: "#8b5cf6" }}>
                      👆 Click to view and download clips
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Modal to view clips */}
        {showJobClipsModal && selectedJobClips && selectedJobClips.length > 0 && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              backdropFilter: "blur(10px)",
            }}
            onClick={() => setShowJobClipsModal(false)}
          >
            <div
              style={{
                background: colors.panel,
                border: `1px solid ${colors.border}`,
                borderRadius: 24,
                padding: 32,
                maxWidth: 800,
                width: "90%",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: 28, marginBottom: 20, textAlign: "center" }}>🎬 Your Clips</h2>
              <p style={{ color: colors.textDim, textAlign: "center", marginBottom: 24 }}>
                {selectedJobClips.length} clips - Click download to save to your device
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {selectedJobClips.map((clip, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 16,
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 16,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                        Clip {clip.index || idx + 1}
                      </div>
                      <div style={{ fontSize: 12, color: colors.textDim }}>
                        Score: {clip.viralScore}% • Color: {clip.color}
                      </div>
                      {clip.hook && (
                        <div style={{ fontSize: 13, color: "#8b5cf6", marginTop: 4 }}>
                          "{clip.hook}"
                        </div>
                      )}
                    </div>
                    <video
                      src={clip.url}
                      controls
                      style={{
                        width: 120,
                        height: 213,
                        borderRadius: 8,
                        background: "#000",
                        marginLeft: 16,
                      }}
                    />
                    <a
                      href={clip.url}
                      download={`clip_${clip.index || idx + 1}.mp4`}
                      style={{
                        background: "#8b5cf6",
                        border: "none",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: 8,
                        fontSize: 12,
                        cursor: "pointer",
                        textDecoration: "none",
                        marginLeft: 16,
                      }}
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
              <Btn
                onClick={() => setShowJobClipsModal(false)}
                variant="primary"
                style={{ marginTop: 24, width: "100%" }}
              >
                Close
              </Btn>
            </div>
          </div>
        )}

        {showBuyCredits && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowBuyCredits(false)}>
            <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 24, padding: 32, maxWidth: 500, width: "90%" }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginBottom: 20 }}>Buy Credits</h3>
              <p style={{ color: colors.textDim, marginBottom: 20 }}>Generate viral clips with AI. 1 credit = 1 clip.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[{ credits: 100, price: "$4.99", popular: false }, { credits: 500, price: "$19.99", popular: true }, { credits: 1000, price: "$34.99", popular: false }, { credits: 5000, price: "$149.99", popular: false }].map((plan) => (
                  <div key={plan.credits} onClick={() => buyCredits(plan.credits)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: plan.popular ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)", borderRadius: 12, cursor: buyingCredits ? "not-allowed" : "pointer", border: plan.popular ? "1px solid #8b5cf6" : `1px solid ${colors.border}`, transition: "all 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                    <div><div style={{ fontWeight: 700, fontSize: 18 }}>{plan.credits} Credits</div><div style={{ fontSize: 12, color: colors.textDim }}>Generate {plan.credits} viral clips</div>{plan.popular && (<div style={{ fontSize: 10, color: "#8b5cf6", marginTop: 4 }}>Most Popular</div>)}</div>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>{plan.price}</div>
                  </div>
                ))}
              </div>
              <Btn onClick={() => setShowBuyCredits(false)} variant="ghost" style={{ marginTop: 20, width: "100%" }}>Cancel</Btn>
            </div>
          </div>
        )}
      </div>
    );
  }

  function ProcessingScreen({ job }) {
    const stages = ["Uploading video", "Analyzing speech", "Detecting viral moments", "Cutting clips", "Rendering subtitles", "Finalizing exports"];
    const [stage, setStage] = useState(0);
    useEffect(() => {
      const t = setInterval(() => { setStage((s) => (s < stages.length - 1 ? s + 1 : s)); }, 1800);
      return () => clearInterval(t);
    }, []);
    return (
      <div style={{ marginTop: 40 }}>
        <Panel style={{ textAlign: "center" }}>
          <h2>AI is generating your clips</h2>
          <p style={{ color: colors.textDim }}>Fast engine running. Sit tight.</p>
          <div style={{ marginTop: 26 }}>{stages.map((s, i) => (<div key={s} style={{ padding: 12, marginBottom: 10, borderRadius: 14, border: `1px solid ${colors.border}`, background: i === stage ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.04)", fontWeight: i === stage ? 800 : 500 }}>{i <= stage ? "⚡" : "•"} {s}</div>))}</div>
        </Panel>
      </div>
    );
  }

  function Credits() {
    const [creditBalance, setCreditBalance] = useState(0);
    const [transactionsList, setTransactionsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [buying, setBuying] = useState(false);

    async function loadCreditData() {
      try {
        setLoading(true);
        const res = await fetch("/api/credits");
        const data = await res.json();
        if (data.balance !== undefined) setCreditBalance(data.balance);
        if (data.transactions) setTransactionsList(data.transactions);
      } catch (e) { console.log(e); } finally { setLoading(false); }
    }

    async function buyCredits(creditsAmount) {
      setBuying(true);
      try {
        const res = await fetch("/api/paddle/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credits: creditsAmount }) });
        const { url } = await res.json();
        window.location.href = url;
      } catch (e) { alert("Error starting checkout: " + e.message); } finally { setBuying(false); }
    }

    useEffect(() => { loadCreditData(); }, []);

    return (
      <div style={{ marginTop: 40 }}>
        <h1 style={{ fontSize: 36, marginBottom: 20 }}>Your Credits</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
          <Panel>
            <h2>Current Balance</h2>
            {loading ? (<div style={{ color: colors.textDim }}>Loading...</div>) : (<><div style={{ fontSize: 64, fontWeight: 800, color: "#8b5cf6", margin: "20px 0" }}>{creditBalance}</div><p style={{ color: colors.textDim, marginBottom: 20 }}>1 credit = 1 clip generated</p><Btn onClick={() => setShowBuyModal(true)}>Buy More Credits</Btn></>)}
          </Panel>
          <Panel>
            <h2>Transaction History</h2>
            {loading ? (<div style={{ color: colors.textDim }}>Loading...</div>) : transactionsList.length === 0 ? (<p style={{ color: colors.textDim }}>No transactions yet.</p>) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{transactionsList.map((tx) => (<div key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${colors.border}` }}><div><div style={{ fontWeight: 600 }}>{tx.type === "purchase" ? "🎉 Purchase" : "🎬 Clip Generation"}</div><div style={{ fontSize: 12, color: colors.textDim }}>{new Date(tx.created_at).toLocaleDateString()}</div>{tx.description && (<div style={{ fontSize: 12, color: colors.textDim }}>{tx.description}</div>)}</div><div style={{ fontWeight: 700, color: tx.amount > 0 ? "#22c55e" : "#ef4444" }}>{tx.amount > 0 ? `+${tx.amount}` : tx.amount}</div></div>))}</div>
            )}
          </Panel>
        </div>
        {showBuyModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowBuyModal(false)}>
            <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 24, padding: 32, maxWidth: 500, width: "90%" }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginBottom: 20 }}>Buy Credits</h3>
              <p style={{ color: colors.textDim, marginBottom: 20 }}>Generate viral clips with AI. 1 credit = 1 clip.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[{ credits: 100, price: "$4.99", popular: false }, { credits: 500, price: "$19.99", popular: true }, { credits: 1000, price: "$34.99", popular: false }, { credits: 5000, price: "$149.99", popular: false }].map((plan) => (<div key={plan.credits} onClick={() => buyCredits(plan.credits)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: plan.popular ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)", borderRadius: 12, cursor: buying ? "not-allowed" : "pointer", border: plan.popular ? "1px solid #8b5cf6" : `1px solid ${colors.border}`, transition: "all 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}><div><div style={{ fontWeight: 700, fontSize: 18 }}>{plan.credits} Credits</div><div style={{ fontSize: 12, color: colors.textDim }}>Generate {plan.credits} viral clips</div>{plan.popular && (<div style={{ fontSize: 10, color: "#8b5cf6", marginTop: 4 }}>Most Popular</div>)}</div><div style={{ fontSize: 24, fontWeight: 800 }}>{plan.price}</div></div>))}</div>
              <Btn onClick={() => setShowBuyModal(false)} variant="ghost" style={{ marginTop: 20, width: "100%" }}>Cancel</Btn>
            </div>
          </div>
        )}
      </div>
    );
  }

  function Pricing() {
    const [buying, setBuying] = useState(false);
    async function buyCredits(creditsAmount) {
      setBuying(true);
      try {
        const res = await fetch("/api/paddle/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credits: creditsAmount }) });
        const { url } = await res.json();
        window.location.href = url;
      } catch (e) { alert("Error starting checkout: " + e.message); } finally { setBuying(false); }
    }
    return (
      <div style={{ marginTop: 40 }}>
        <h1 style={{ fontSize: 48, marginBottom: 16 }}>Simple, transparent pricing</h1>
        <p style={{ color: colors.textDim, fontSize: 18, marginBottom: 40 }}>Pay only for what you use. No monthly subscriptions.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginTop: 20 }}>
          {[{ credits: 100, price: "$4.99", pricePerClip: "$0.05", popular: false, description: "Perfect for testing" }, { credits: 500, price: "$19.99", pricePerClip: "$0.04", popular: true, description: "Most popular" }, { credits: 1000, price: "$34.99", pricePerClip: "$0.035", popular: false, description: "Best value" }, { credits: 5000, price: "$149.99", pricePerClip: "$0.03", popular: false, description: "For creators" }].map((plan) => (
            <Panel key={plan.credits} style={{ textAlign: "center", border: plan.popular ? "1px solid #8b5cf6" : `1px solid ${colors.border}`, transform: plan.popular ? "scale(1.02)" : "scale(1)" }}>
              {plan.popular && (<div style={{ display: "inline-block", background: "#8b5cf6", padding: "4px 12px", borderRadius: 20, fontSize: 12, marginBottom: 16 }}>POPULAR</div>)}
              <h2 style={{ fontSize: 48, marginBottom: 8 }}>{plan.price}</h2>
              <div style={{ fontSize: 14, color: colors.textDim, marginBottom: 16 }}>{plan.credits} credits</div>
              <div style={{ fontSize: 13, color: colors.textDim, marginBottom: 24 }}>{plan.pricePerClip} per clip</div>
              <p style={{ color: colors.textDim, marginBottom: 24 }}>{plan.description}</p>
              <Btn onClick={() => buyCredits(plan.credits)} disabled={buying} variant={plan.popular ? "primary" : "ghost"}>{buying ? "Processing..." : `Buy ${plan.credits} credits`}</Btn>
            </Panel>
          ))}
        </div>
        <Panel style={{ marginTop: 40, textAlign: "center" }}><h3>Need more?</h3><p style={{ color: colors.textDim, marginBottom: 16 }}>Contact us for custom enterprise plans</p><Btn variant="ghost">Contact Sales</Btn></Panel>
      </div>
    );
  }

  // ============================================================
  // ====== PAGE RENDERER - ALL ROUTES ======
  // ============================================================
  function PageRenderer() {
    switch (page) {
      case PAGES.LANDING: return <Landing />;
      case PAGES.WELCOME: return <Welcome />;
      case PAGES.DASHBOARD: return <Dashboard />;
      case PAGES.PROCESSING: return <ProcessingScreen job={null} />;
      case PAGES.PRICING: return <Pricing />;
      case PAGES.CREDITS: return <Credits />;
      // LEGAL PAGES
      case PAGES.TERMS: return <TermsPage />;
      case PAGES.PRIVACY: return <PrivacyPage />;
      case PAGES.COPYRIGHT: return <CopyrightPage />;
      case PAGES.PLATFORM: return <PlatformPage />;
      case PAGES.LEGAL: return <LegalCenter />;
      default: return <Landing />;
    }
  }

  return (
    <div style={{ minHeight: "vh", background: gradients.main, color: "white", padding: 28 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Navbar />
        <PageRenderer />
      </div>
    </div>
  );
}