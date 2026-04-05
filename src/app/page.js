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
import { loadStripe } from "@stripe/stripe-js";

/* =========================================================
   SUPABASE
========================================================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* =========================================================
   DESIGN SYSTEM — CINEMATIC APPLE STYLE
========================================================= */

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

// Color map for clip indicators
const SUBTITLE_COLORS = {
  black: "#000000",
  white: "#ffffff",
  red: "#ef4444",
  green: "#22c55e",
  blue: "#3b82f6",
  yellow: "#facc15",
};

/* =========================================================
   UI PRIMITIVES
========================================================= */

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

/* =========================================================
   PAGE ENGINE
========================================================= */

const PAGES = {
  LANDING: "landing",
  WELCOME: "welcome",
  DASHBOARD: "dashboard",
  PROCESSING: "processing",
  RESULTS: "results",
  PRICING: "pricing",
  TERMS: "terms",
  PRIVACY: "privacy",
  COPYRIGHT: "copyright",
  CREDITS: "credits",
};

/* =========================================================
   SAFE JSON
========================================================= */

function safeJson(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

/* =========================================================
   MAIN APP
========================================================= */

export default function ClipGenius() {
  const [page, setPage] = useState(PAGES.LANDING);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  /* ================= PROFILE ================= */

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

  /* =========================================================
     NAVBAR
  ========================================================= */

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
          <button onClick={() => setPage(PAGES.LANDING)} style={navBtn}>
            Home
          </button>

          <button onClick={() => setPage(PAGES.DASHBOARD)} style={navBtn}>
            Dashboard
          </button>

          <button onClick={() => setPage(PAGES.PRICING)} style={navBtn}>
            Pricing
          </button>

          <button onClick={() => setPage(PAGES.CREDITS)} style={navBtn}>
            Credits
          </button>

          <SignedOut>
            <SignInButton mode="modal">
              <span>
                <Btn variant="ghost">Sign in</Btn>
              </span>
            </SignInButton>

            <SignUpButton mode="modal">
              <span>
                <Btn>Start free</Btn>
              </span>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
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

  /* =========================================================
     LANDING
  ========================================================= */

  function Landing() {
    return (
      <div style={{ marginTop: 40 }}>
        <div style={{ maxWidth: 900 }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              background: "rgba(255,255,255,0.05)",
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            ⚡ REALTIME CLIP ENGINE
          </div>

          <h1 style={{ fontSize: 60, margin: "16px 0", lineHeight: 1.05 }}>
            Turn long videos into viral clips instantly.
          </h1>

          <p style={{ color: colors.textDim, fontSize: 17, lineHeight: 1.6 }}>
            Upload once. AI finds the strongest moments. Export ready for TikTok,
            Reels and Shorts in minutes.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <SignedOut>
              <SignUpButton mode="modal">
                <span>
                  <Btn>Generate clips now</Btn>
                </span>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Btn onClick={() => setPage(PAGES.DASHBOARD)}>
                Open dashboard
              </Btn>
            </SignedIn>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     WELCOME
  ========================================================= */

  function Welcome() {
    return (
      <Panel style={{ marginTop: 30 }}>
        <h2>Welcome to ClipGenius</h2>
        <p style={{ color: colors.textDim }}>
          Your AI engine is ready. Upload a video and generate clips instantly.
        </p>

        <Btn onClick={() => setPage(PAGES.DASHBOARD)}>
          Go to Dashboard
        </Btn>
      </Panel>
    );
  }

  /* =========================================================
     DASHBOARD — GENERATOR ENGINE WITH PROGRESS BAR & CREDITS
  ========================================================= */

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

    // PROGRESS BAR STATES
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // CREDITS STATES
    const [credits, setCredits] = useState(0);
    const [showBuyCredits, setShowBuyCredits] = useState(false);
    const [buyingCredits, setBuyingCredits] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loadingCredits, setLoadingCredits] = useState(false);

    const subtitleColors = [
      { id: "black", color: "#000000" },
      { id: "white", color: "#ffffff" },
      { id: "red", color: "#ef4444" },
      { id: "green", color: "#22c55e" },
      { id: "blue", color: "#3b82f6" },
      { id: "yellow", color: "#facc15" },
    ];

    // Load credits on mount
    async function loadCredits() {
      try {
        setLoadingCredits(true);
        const res = await fetch("/api/credits");
        const data = await res.json();
        if (data.balance !== undefined) {
          setCredits(data.balance);
        }
        if (data.transactions) {
          setTransactions(data.transactions);
        }
      } catch (e) {
        console.log("Error loading credits:", e);
      } finally {
        setLoadingCredits(false);
      }
    }

    // Buy credits with Stripe
    async function buyCredits(creditsAmount) {
      setBuyingCredits(true);
      try {
        const res = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credits: creditsAmount }),
        });
        const { url } = await res.json();
        window.location.href = url;
      } catch (e) {
        alert("Error starting checkout");
      } finally {
        setBuyingCredits(false);
      }
    }

    async function loadJobs() {
      try {
        setLoadingJobs(true);
        const res = await fetch("/api/jobs");
        const text = await res.text();
        const data = safeJson(text);

        if (!res.ok) throw new Error();
        setJobs(data?.jobs || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingJobs(false);
      }
    }

    useEffect(() => {
      loadJobs();
      loadCredits();
      // Poll for job updates every 5 seconds
      const interval = setInterval(() => {
        if (!creating) loadJobs();
      }, 5000);
      return () => clearInterval(interval);
    }, [creating]);

    // Check for Stripe success redirect
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get("success");
      const sessionId = urlParams.get("session_id");
      
      if (success === "true" && sessionId) {
        // Refresh credits after successful payment
        loadCredits();
        // Remove query params from URL
        window.history.replaceState({}, document.title, window.location.pathname);
        alert("✅ Payment successful! Credits added to your account.");
      }
    }, []);

    async function createJob() {
      if (!acceptTerms) {
        alert("You must confirm content ownership and accept Terms.");
        return;
      }

      if (!file && !youtubeUrl) {
        alert("Upload video OR paste YouTube link");
        return;
      }

      // CHECK CREDITS BEFORE GENERATING
      if (credits < maxClips) {
        alert(`Insufficient credits. You need ${maxClips} credits but have ${credits}. Buy more credits.`);
        setShowBuyCredits(true);
        return;
      }

      try {
        setCreating(true);
        setStatusText("Uploading…");
        setUploadProgress(0);
        setIsUploading(true);

        let videoPath = null;

        if (file) {
          // 1. Get signed upload URL
          const resUpload = await fetch("/api/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
            }),
          });

          const { uploadUrl, path } = await resUpload.json();

          // 2. Upload with progress tracking
          await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (event) => {
              if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percent);
                setStatusText(`Uploading: ${percent}%`);
              }
            });

            xhr.onload = () => {
              if (xhr.status === 200) {
                resolve();
              } else {
                reject(new Error("Upload failed"));
              }
            };

            xhr.onerror = () => reject(new Error("Upload failed"));

            xhr.open("PUT", uploadUrl);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.send(file);
          });

          videoPath = path;
        }

        setStatusText("AI generating clips…");
        setUploadProgress(0);
        setIsUploading(false);

        const res = await fetch("/api/jobs/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clipLength,
            maxClips,
            ratio,
            subtitleOn,
            subtitleColor,
            videoPath,
            youtubeUrl,
          }),
        });

        const text = await res.text();
        const json = safeJson(text);

        if (!res.ok) throw new Error(json?.error || "Job failed");

        // DEDUCT CREDITS AFTER JOB CREATED
        const spendRes = await fetch("/api/credits/spend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            amount: maxClips,
            jobId: json.job?.id 
          }),
        });

        const spendData = await spendRes.json();
        if (spendData.success) {
          setCredits(spendData.balance);
        }

        setFile(null);
        setYoutubeUrl("");
        setStatusText("Clips generating ⚡");

        await loadJobs();

        setTimeout(() => setStatusText(""), 3000);
      } catch (e) {
        console.log(e);
        alert("Error creating job: " + e.message);
      } finally {
        setCreating(false);
        setIsUploading(false);
      }
    }

    return (
      <div
        style={{
          marginTop: 34,
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 22,
        }}
      >
        <Panel>
          <h2>Generate Clips</h2>
          <p style={{ color: colors.textDim }}>
            Upload → AI detects moments → clips ready fast.
          </p>

          {/* CREDITS DISPLAY */}
          <div
            style={{
              marginTop: 16,
              padding: 16,
              background: "rgba(139,92,246,0.1)",
              borderRadius: 16,
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 14, color: colors.textDim }}>
                  Your Credits
                </div>
                <div
                  style={{ fontSize: 32, fontWeight: 800, color: "#8b5cf6" }}
                >
                  {loadingCredits ? "..." : credits}
                </div>
                <div style={{ fontSize: 12, color: colors.textDim }}>
                  1 credit = 1 clip
                </div>
              </div>
              <Btn
                onClick={() => setShowBuyCredits(true)}
                variant="primary"
                disabled={buyingCredits}
              >
                {buyingCredits ? "Loading..." : "Buy Credits"}
              </Btn>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13 }}>Upload video</div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13 }}>or YouTube link</div>
            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background: "rgba(255,255,255,0.04)",
                color: "white",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 22,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 13 }}>Clip length</div>
              <input
                type="number"
                value={clipLength}
                onChange={(e) => setClipLength(parseInt(e.target.value))}
                style={{ width: "100%", padding: 10, borderRadius: 12 }}
              />
            </div>

            <div>
              <div style={{ fontSize: 13 }}>Max clips</div>
              <input
                type="number"
                value={maxClips}
                onChange={(e) => setMaxClips(parseInt(e.target.value))}
                style={{ width: "100%", padding: 10, borderRadius: 12 }}
              />
              <div style={{ fontSize: 11, color: colors.textDim, marginTop: 4 }}>
                Cost: {maxClips} credits
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13 }}>Ratio</div>
              <select
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 12 }}
              >
                <option value="9:16">9:16</option>
                <option value="1:1">1:1</option>
                <option value="16:9">16:9</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 26 }}>
            <div style={{ fontWeight: 800 }}>Subtitles</div>
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <Btn
                variant={subtitleOn ? "primary" : "ghost"}
                onClick={() => setSubtitleOn(true)}
              >
                ON
              </Btn>
              <Btn
                variant={!subtitleOn ? "primary" : "ghost"}
                onClick={() => setSubtitleOn(false)}
              >
                OFF
              </Btn>
            </div>

            {subtitleOn && (
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                {subtitleColors.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSubtitleColor(c.id)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 999,
                      background: c.color,
                      border:
                        subtitleColor === c.id
                          ? "3px solid white"
                          : "2px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 26 }}>
            <label
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <span style={{ fontSize: 13, color: colors.textDim }}>
                I confirm I own this content and accept the Terms.
              </span>
            </label>
          </div>

          {/* PROGRESS BAR */}
          {isUploading && (
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  width: "100%",
                  height: 8,
                  background: "#333",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    background: "#8b5cf6",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: 8,
                  fontSize: 13,
                  color: "#8b5cf6",
                  fontWeight: 500,
                }}
              >
                Uploading: {uploadProgress}%
              </div>
            </div>
          )}

          <div style={{ marginTop: 30 }}>
            <Btn onClick={createJob} disabled={creating || credits < maxClips}>
              {creating
                ? "Generating…"
                : credits < maxClips
                ? `Need ${maxClips - credits} more credits`
                : "Generate Clips"}
            </Btn>
          </div>

          {statusText && (
            <div style={{ marginTop: 14, color: "#8b5cf6", fontWeight: 800 }}>
              {statusText}
            </div>
          )}
        </Panel>

        <Panel>
          <h3>Your Jobs</h3>
          {loadingJobs ? (
            <div style={{ color: colors.textDim }}>Loading…</div>
          ) : jobs.length === 0 ? (
            <div style={{ color: colors.textDim }}>No clips yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {jobs.map((j) => (
                <div
                  key={j.id}
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    border: `1px solid ${colors.border}`,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>
                    {j.status}
                    {j.clip_count && ` • ${j.clip_count} clips`}
                    {j.credits_spent && (
                      <span style={{ fontSize: 11, color: colors.textDim, marginLeft: 8 }}>
                        ({j.credits_spent} credits)
                      </span>
                    )}
                  </div>

                  {/* Show individual clips if completed */}
                  {j.status === "completed" && j.clips && j.clips.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div
                        style={{
                          fontSize: 13,
                          color: colors.textDim,
                          marginBottom: 10,
                        }}
                      >
                        Your clips:
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        {j.clips.map((clip, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "8px 12px",
                              background: "rgba(255,255,255,0.05)",
                              borderRadius: 12,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <div
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: 4,
                                  background:
                                    SUBTITLE_COLORS[clip.color] || "#8b5cf6",
                                }}
                              />
                              <span style={{ fontSize: 13 }}>
                                Clip {clip.index} • Score: {clip.viralScore}%
                              </span>
                              {clip.hook && (
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: colors.textDim,
                                  }}
                                >
                                  "{clip.hook.substring(0, 30)}..."
                                </span>
                              )}
                            </div>
                            <a
                              href={clip.url}
                              download
                              style={{
                                background: "#8b5cf6",
                                border: "none",
                                color: "white",
                                padding: "4px 12px",
                                borderRadius: 8,
                                fontSize: 12,
                                cursor: "pointer",
                                textDecoration: "none",
                              }}
                            >
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ZIP download button */}
                  {j.status === "completed" && j.result_url && (
                    <div style={{ marginTop: 12 }}>
                      <a
                        href={j.result_url}
                        download
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          border: `1px solid ${colors.border}`,
                          color: "white",
                          padding: "6px 14px",
                          borderRadius: 10,
                          fontSize: 12,
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        📦 Download ZIP (All Clips)
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* BUY CREDITS MODAL */}
        {showBuyCredits && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowBuyCredits(false)}
          >
            <div
              style={{
                background: colors.panel,
                border: `1px solid ${colors.border}`,
                borderRadius: 24,
                padding: 32,
                maxWidth: 500,
                width: "90%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginBottom: 20 }}>Buy Credits</h3>
              <p style={{ color: colors.textDim, marginBottom: 20 }}>
                Generate viral clips with AI. 1 credit = 1 clip.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { credits: 100, price: "$4.99", popular: false },
                  { credits: 500, price: "$19.99", popular: true },
                  { credits: 1000, price: "$34.99", popular: false },
                  { credits: 5000, price: "$149.99", popular: false },
                ].map((plan) => (
                  <div
                    key={plan.credits}
                    onClick={() => buyCredits(plan.credits)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 16,
                      background: plan.popular
                        ? "rgba(139,92,246,0.2)"
                        : "rgba(255,255,255,0.05)",
                      borderRadius: 12,
                      cursor: buyingCredits ? "not-allowed" : "pointer",
                      border: plan.popular
                        ? "1px solid #8b5cf6"
                        : `1px solid ${colors.border}`,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>
                        {plan.credits} Credits
                      </div>
                      <div style={{ fontSize: 12, color: colors.textDim }}>
                        Generate {plan.credits} viral clips
                      </div>
                      {plan.popular && (
                        <div
                          style={{
                            fontSize: 10,
                            color: "#8b5cf6",
                            marginTop: 4,
                          }}
                        >
                          Most Popular
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>
                      {plan.price}
                    </div>
                  </div>
                ))}
              </div>
              <Btn
                onClick={() => setShowBuyCredits(false)}
                variant="ghost"
                style={{ marginTop: 20, width: "100%" }}
              >
                Cancel
              </Btn>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
     PROCESSING SCREEN
  ========================================================= */

  function ProcessingScreen({ job }) {
    const stages = [
      "Uploading video",
      "Analyzing speech",
      "Detecting viral moments",
      "Cutting clips",
      "Rendering subtitles",
      "Finalizing exports",
    ];

    const [stage, setStage] = useState(0);

    useEffect(() => {
      const t = setInterval(() => {
        setStage((s) => (s < stages.length - 1 ? s + 1 : s));
      }, 1800);

      return () => clearInterval(t);
    }, []);

    return (
      <div style={{ marginTop: 40 }}>
        <Panel style={{ textAlign: "center" }}>
          <h2>AI is generating your clips</h2>
          <p style={{ color: colors.textDim }}>
            Fast engine running. Sit tight.
          </p>

          <div style={{ marginTop: 26 }}>
            {stages.map((s, i) => (
              <div
                key={s}
                style={{
                  padding: 12,
                  marginBottom: 10,
                  borderRadius: 14,
                  border: `1px solid ${colors.border}`,
                  background:
                    i === stage
                      ? "rgba(139,92,246,0.25)"
                      : "rgba(255,255,255,0.04)",
                  fontWeight: i === stage ? 800 : 500,
                }}
              >
                {i <= stage ? "⚡" : "•"} {s}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    );
  }

  /* =========================================================
     CREDITS PAGE
  ========================================================= */

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
        if (data.balance !== undefined) {
          setCreditBalance(data.balance);
        }
        if (data.transactions) {
          setTransactionsList(data.transactions);
        }
      } catch (e) {
        console.log("Error loading credits:", e);
      } finally {
        setLoading(false);
      }
    }

    async function buyCredits(creditsAmount) {
      setBuying(true);
      try {
        const res = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credits: creditsAmount }),
        });
        const { url } = await res.json();
        window.location.href = url;
      } catch (e) {
        alert("Error starting checkout");
      } finally {
        setBuying(false);
      }
    }

    useEffect(() => {
      loadCreditData();
    }, []);

    return (
      <div style={{ marginTop: 40 }}>
        <h1 style={{ fontSize: 36, marginBottom: 20 }}>Your Credits</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 22,
          }}
        >
          <Panel>
            <h2>Current Balance</h2>
            {loading ? (
              <div style={{ color: colors.textDim }}>Loading...</div>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 800,
                    color: "#8b5cf6",
                    margin: "20px 0",
                  }}
                >
                  {creditBalance}
                </div>
                <p style={{ color: colors.textDim, marginBottom: 20 }}>
                  1 credit = 1 clip generated
                </p>
                <Btn onClick={() => setShowBuyModal(true)}>Buy More Credits</Btn>
              </>
            )}
          </Panel>

          <Panel>
            <h2>Transaction History</h2>
            {loading ? (
              <div style={{ color: colors.textDim }}>Loading...</div>
            ) : transactionsList.length === 0 ? (
              <p style={{ color: colors.textDim }}>No transactions yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {transactionsList.map((tx) => (
                  <div
                    key={tx.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {tx.type === "purchase" ? "🎉 Purchase" : "🎬 Clip Generation"}
                      </div>
                      <div style={{ fontSize: 12, color: colors.textDim }}>
                        {new Date(tx.created_at).toLocaleDateString()}
                      </div>
                      {tx.description && (
                        <div style={{ fontSize: 12, color: colors.textDim }}>
                          {tx.description}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: tx.amount > 0 ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* BUY CREDITS MODAL */}
        {showBuyModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowBuyModal(false)}
          >
            <div
              style={{
                background: colors.panel,
                border: `1px solid ${colors.border}`,
                borderRadius: 24,
                padding: 32,
                maxWidth: 500,
                width: "90%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginBottom: 20 }}>Buy Credits</h3>
              <p style={{ color: colors.textDim, marginBottom: 20 }}>
                Generate viral clips with AI. 1 credit = 1 clip.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { credits: 100, price: "$4.99", popular: false },
                  { credits: 500, price: "$19.99", popular: true },
                  { credits: 1000, price: "$34.99", popular: false },
                  { credits: 5000, price: "$149.99", popular: false },
                ].map((plan) => (
                  <div
                    key={plan.credits}
                    onClick={() => buyCredits(plan.credits)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 16,
                      background: plan.popular
                        ? "rgba(139,92,246,0.2)"
                        : "rgba(255,255,255,0.05)",
                      borderRadius: 12,
                      cursor: buying ? "not-allowed" : "pointer",
                      border: plan.popular
                        ? "1px solid #8b5cf6"
                        : `1px solid ${colors.border}`,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>
                        {plan.credits} Credits
                      </div>
                      <div style={{ fontSize: 12, color: colors.textDim }}>
                        Generate {plan.credits} viral clips
                      </div>
                      {plan.popular && (
                        <div
                          style={{
                            fontSize: 10,
                            color: "#8b5cf6",
                            marginTop: 4,
                          }}
                        >
                          Most Popular
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>
                      {plan.price}
                    </div>
                  </div>
                ))}
              </div>
              <Btn
                onClick={() => setShowBuyModal(false)}
                variant="ghost"
                style={{ marginTop: 20, width: "100%" }}
              >
                Cancel
              </Btn>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
     PRICING PAGE
  ========================================================= */

  function Pricing() {
    const [buying, setBuying] = useState(false);

    async function buyCredits(creditsAmount) {
      setBuying(true);
      try {
        const res = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credits: creditsAmount }),
        });
        const { url } = await res.json();
        window.location.href = url;
      } catch (e) {
        alert("Error starting checkout");
      } finally {
        setBuying(false);
      }
    }

    return (
      <div style={{ marginTop: 40 }}>
        <h1 style={{ fontSize: 48, marginBottom: 16 }}>Simple, transparent pricing</h1>
        <p style={{ color: colors.textDim, fontSize: 18, marginBottom: 40 }}>
          Pay only for what you use. No monthly subscriptions.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginTop: 20,
          }}
        >
          {[
            { credits: 100, price: "$4.99", pricePerClip: "$0.05", popular: false, description: "Perfect for testing" },
            { credits: 500, price: "$19.99", pricePerClip: "$0.04", popular: true, description: "Most popular" },
            { credits: 1000, price: "$34.99", pricePerClip: "$0.035", popular: false, description: "Best value" },
            { credits: 5000, price: "$149.99", pricePerClip: "$0.03", popular: false, description: "For creators" },
          ].map((plan) => (
            <Panel
              key={plan.credits}
              style={{
                textAlign: "center",
                border: plan.popular ? "1px solid #8b5cf6" : `1px solid ${colors.border}`,
                transform: plan.popular ? "scale(1.02)" : "scale(1)",
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    display: "inline-block",
                    background: "#8b5cf6",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    marginBottom: 16,
                  }}
                >
                  POPULAR
                </div>
              )}
              <h2 style={{ fontSize: 48, marginBottom: 8 }}>{plan.price}</h2>
              <div style={{ fontSize: 14, color: colors.textDim, marginBottom: 16 }}>
                {plan.credits} credits
              </div>
              <div style={{ fontSize: 13, color: colors.textDim, marginBottom: 24 }}>
                {plan.pricePerClip} per clip
              </div>
              <p style={{ color: colors.textDim, marginBottom: 24 }}>{plan.description}</p>
              <Btn
                onClick={() => buyCredits(plan.credits)}
                disabled={buying}
                variant={plan.popular ? "primary" : "ghost"}
              >
                {buying ? "Processing..." : `Buy ${plan.credits} credits`}
              </Btn>
            </Panel>
          ))}
        </div>

        <Panel style={{ marginTop: 40, textAlign: "center" }}>
          <h3>Need more?</h3>
          <p style={{ color: colors.textDim, marginBottom: 16 }}>
            Contact us for custom enterprise plans
          </p>
          <Btn variant="ghost">Contact Sales</Btn>
        </Panel>
      </div>
    );
  }

  /* =========================================================
     VIRAL SCORE CALCULATOR (UI ONLY)
  ========================================================= */

  function getViralScore() {
    return Math.floor(72 + Math.random() * 25);
  }

  /* =========================================================
     CLIP CARD PREVIEW
  ========================================================= */

  function ClipCard({ clip }) {
    const score = getViralScore();

    return (
      <div
        style={{
          borderRadius: 22,
          overflow: "hidden",
          border: `1px solid ${colors.border}`,
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            height: 180,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url('/placeholder.jpg') center/cover",
          }}
        />

        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>
            Viral Score: {score}%
          </div>
          <div style={{ fontSize: 13, color: colors.textDim }}>
            Hook suggestion: "This part changes everything…"
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <Btn variant="ghost">Preview</Btn>
            <Btn>Export</Btn>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     RESULTS SCREEN
  ========================================================= */

  function ResultsScreen({ jobs }) {
    if (!jobs || jobs.length === 0) {
      return (
        <Panel style={{ marginTop: 30 }}>
          <h2>No clips yet</h2>
        </Panel>
      );
    }

    return (
      <div style={{ marginTop: 30 }}>
        <h2>Generated Clips</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: 18,
            marginTop: 20,
          }}
        >
          {jobs.map((j, i) => (
            <ClipCard key={i} clip={j} />
          ))}
        </div>

        <Panel style={{ marginTop: 26 }}>
          <h3>Export</h3>
          <p style={{ color: colors.textDim }}>
            Download all clips as ZIP or publish directly.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Btn>Download ZIP</Btn>
            <Btn variant="ghost">Export TikTok</Btn>
            <Btn variant="ghost">Export Reels</Btn>
            <Btn variant="ghost">Export Shorts</Btn>
          </div>
        </Panel>
      </div>
    );
  }

  /* =========================================================
     PAGE ROUTER
  ========================================================= */

  function PageRenderer() {
    switch (page) {
      case PAGES.LANDING:
        return <Landing />;
      case PAGES.WELCOME:
        return <Welcome />;
      case PAGES.DASHBOARD:
        return <Dashboard />;
      case PAGES.PROCESSING:
        return <ProcessingScreen job={null} />;
      case PAGES.RESULTS:
        return <ResultsScreen jobs={jobs} />;
      case PAGES.PRICING:
        return <Pricing />;
      case PAGES.CREDITS:
        return <Credits />;
      default:
        return <Landing />;
    }
  }

  /* =========================================================
     ROOT LAYOUT
  ========================================================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: gradients.main,
        color: "white",
        padding: 28,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Navbar />
        <PageRenderer />
      </div>
    </div>
  );
}