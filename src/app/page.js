"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const PRESETS = [
  {
    id: "viral",
    name: "Viral Shorts",
    desc: "Fast pacing + strong hooks",
  },
  {
    id: "gaming",
    name: "Gaming Highlights",
    desc: "Reactions, clutches, funny moments",
  },
  {
    id: "podcast",
    name: "Podcast Clips",
    desc: "Clean talk moments + captions later",
  },
  {
    id: "sports",
    name: "Sports Moments",
    desc: "Action + celebrations + hype",
  },
];

const RATIOS = [
  { id: "9:16", label: "9:16 (TikTok / Reels / Shorts)" },
  { id: "1:1", label: "1:1 (Instagram Feed)" },
  { id: "16:9", label: "16:9 (YouTube Wide)" },
];

export default function Home() {
  // Settings
  const [preset, setPreset] = useState("viral");
  const [ratio, setRatio] = useState("9:16");
  const [clipLength, setClipLength] = useState(18);
  const [maxClips, setMaxClips] = useState(10);

  // Upload
  const [file, setFile] = useState(null);
  const [agree, setAgree] = useState(false);

  // UI
  const [creating, setCreating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const presetObj = useMemo(
    () => PRESETS.find((p) => p.id === preset),
    [preset]
  );

  async function loadJobs() {
    setLoadingJobs(true);
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (e) {
      console.error(e);
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function createJob() {
    if (!file) return alert("Upload a video first.");
    if (!agree)
      return alert(
        "You must accept the rules (own content + auto delete after 72h)."
      );

    setCreating(true);
    setUploadProgress("Uploading video...");

    try {
      // ✅ BIG UPLOAD direct to Supabase Storage
      const sb = supabaseBrowser();

      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `uploads/${Date.now()}_${cleanName}`;

      const { error: upErr } = await sb.storage
        .from("clipgenius")
        .upload(path, file, { upsert: false });

      if (upErr) {
        alert("Upload failed: " + upErr.message);
        setUploadProgress("");
        return;
      }

      setUploadProgress("Creating job...");

      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preset,
          ratio,
          clipLength,
          maxClips,
          videoPath: path,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to create job");
        setUploadProgress("");
        return;
      }

      setFile(null);
      setAgree(false);
      setUploadProgress("");
      await loadJobs();

      alert("✅ Job created! Status = queued.");
    } catch (e) {
      console.error(e);
      setUploadProgress("");
      alert("Error creating job.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="app">
      {/* NAV */}
      <header className="nav">
        <div className="navLeft">
          <div className="logo">⚡</div>
          <div>
            <div className="brand">ClipGenius</div>
            <div className="tagline">AI Clipper for Streams & Long Videos</div>
          </div>
        </div>

        <div className="navRight">
          <SignedOut>
            <div className="navActions">
              <SignInButton mode="modal">
                <button className="btn ghost">Sign in</button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="btn primary">Sign up</button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="navActions">
              <button className="btn ghost" onClick={loadJobs}>
                {loadingJobs ? "Refreshing..." : "Refresh"}
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </header>

      {/* LANDING FOR LOGGED OUT */}
      <SignedOut>
        <main className="landing">
          <div className="hero">
            <div className="heroText">
              <div className="pill">
                🚀 Built for creators • Clips in minutes
              </div>

              <h1>
                Turn long videos into{" "}
                <span className="gradientText">viral Shorts</span> automatically.
              </h1>

              <p>
                Upload your stream, select preset + ratio, and ClipGenius will
                generate short clips you can post instantly.
              </p>

              <div className="ctaRow">
                <SignUpButton mode="modal">
                  <button className="btn primary big">Start Free</button>
                </SignUpButton>

                <SignInButton mode="modal">
                  <button className="btn ghost big">I already have an account</button>
                </SignInButton>
              </div>

              <div className="mini">
                ✅ 1GB+ uploads • ✅ 72h auto-delete • ✅ Pro exports (soon)
              </div>
            </div>

            <div className="heroCard">
              <div className="heroCardTop">
                <div className="heroTitle">Example Output</div>
                <div className="heroSub">Short clips ready to download</div>
              </div>

              <div className="fakeClips">
                <div className="fakeClip">
                  <div className="clipThumb" />
                  <div>
                    <div className="clipName">W Moment #01</div>
                    <div className="clipMeta">9:16 • 18s</div>
                  </div>
                </div>

                <div className="fakeClip">
                  <div className="clipThumb" />
                  <div>
                    <div className="clipName">Funny Reaction #02</div>
                    <div className="clipMeta">9:16 • 21s</div>
                  </div>
                </div>

                <div className="fakeClip">
                  <div className="clipThumb" />
                  <div>
                    <div className="clipName">Highlight #03</div>
                    <div className="clipMeta">9:16 • 17s</div>
                  </div>
                </div>
              </div>

              <div className="hr" />

              <div className="heroBottom">
                <div className="stat">
                  <div className="statNum">⚡ Fast</div>
                  <div className="statLabel">Auto clipping</div>
                </div>
                <div className="stat">
                  <div className="statNum">🎬 Clean</div>
                  <div className="statLabel">Ready exports</div>
                </div>
                <div className="stat">
                  <div className="statNum">🧠 AI</div>
                  <div className="statLabel">Captions soon</div>
                </div>
              </div>
            </div>
          </div>

          <div className="features">
            <div className="feature">
              <div className="fIcon">📌</div>
              <div className="fTitle">Smart presets</div>
              <div className="fDesc">
                Viral / Gaming / Podcast / Sports.
              </div>
            </div>

            <div className="feature">
              <div className="fIcon">📱</div>
              <div className="fTitle">Multi ratio export</div>
              <div className="fDesc">
                9:16, 1:1, 16:9 support.
              </div>
            </div>

            <div className="feature">
              <div className="fIcon">🧼</div>
              <div className="fTitle">Auto delete</div>
              <div className="fDesc">
                Content deleted after 72h for safety.
              </div>
            </div>
          </div>
        </main>
      </SignedOut>

      {/* DASHBOARD FOR LOGGED IN */}
      <SignedIn>
        <main className="dashboard">
          <div className="dashTop">
            <div>
              <div className="dashTitle">Dashboard</div>
              <div className="dashSub">
                Create a job → wait for processing → download clips.
              </div>
            </div>
          </div>

          <div className="dashGrid">
            {/* CREATE */}
            <div className="card">
              <div className="cardHeader">
                <div>
                  <div className="cardTitle">Create Clip Job</div>
                  <div className="cardSub">
                    Preset: <b>{presetObj?.name}</b> • Ratio: <b>{ratio}</b> •{" "}
                    <b>{clipLength}s</b> clips • Max <b>{maxClips}</b>
                  </div>
                </div>
              </div>

              <div className="hr" />

              <div className="sectionTitle">Choose preset</div>
              <div className="presetGrid">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    className={`presetCard ${preset === p.id ? "active" : ""}`}
                    onClick={() => setPreset(p.id)}
                  >
                    <div className="presetName">{p.name}</div>
                    <div className="presetDesc">{p.desc}</div>
                  </button>
                ))}
              </div>

              <div className="hr" />

              <div className="formGrid">
                <div>
                  <div className="label">Ratio</div>
                  <select
                    className="select"
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                  >
                    {RATIOS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="label">Clip length (sec)</div>
                  <input
                    className="input"
                    type="number"
                    min={6}
                    max={90}
                    value={clipLength}
                    onChange={(e) =>
                      setClipLength(parseInt(e.target.value || "18", 10))
                    }
                  />
                </div>

                <div>
                  <div className="label">Max clips</div>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    max={50}
                    value={maxClips}
                    onChange={(e) =>
                      setMaxClips(parseInt(e.target.value || "10", 10))
                    }
                  />
                </div>
              </div>

              <div className="hr" />

              <div className="sectionTitle">Upload video</div>
              <input
                className="file"
                type="file"
                accept="video/mp4,video/webm,video/mov,video/quicktime"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              {file ? (
                <div className="small">
                  Selected: <b>{file.name}</b> •{" "}
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              ) : (
                <div className="small muted">No file selected.</div>
              )}

              <div className="hr" />

              <label className="tos">
  <input
    type="checkbox"
    checked={agree}
    onChange={(e) => setAgree(e.target.checked)}
  />
  <span>
    I confirm I own this content or have permission to use it, and I agree to the{" "}
    <a href="/terms" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
      Terms
    </a>
    ,{" "}
    <a href="/privacy" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
      Privacy Policy
    </a>
    , and{" "}
    <a href="/copyright" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
      Copyright Policy
    </a>
    . Files may be deleted after <b>72 hours</b>.
  </span>
</label>

              {uploadProgress ? (
                <div className="progress">{uploadProgress}</div>
              ) : null}

              <button className="btn primary" disabled={creating} onClick={createJob}>
                {creating ? "Working..." : "Create job"}
              </button>
            </div>

            {/* JOB LIST */}
            <div className="card">
              <div className="cardHeader row">
                <div>
                  <div className="cardTitle">Your Jobs</div>
                  <div className="cardSub">
                    You can refresh anytime. Worker must be running to process.
                  </div>
                </div>

                <button className="btn ghost" onClick={loadJobs}>
                  {loadingJobs ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              <div className="hr" />

              {jobs.length === 0 ? (
                <div className="empty">
                  No jobs yet. Upload a video and create your first job ⚡
                </div>
              ) : (
                <div className="jobs">
                  {jobs.map((j) => (
                    <div key={j.id} className="jobRow">
                      <div>
                        <div className="jobTitle">
                          {j.preset} • {j.ratio} • {j.clip_length}s • {j.max_clips}{" "}
                          clips
                        </div>
                        <div className="jobMeta">
                          Status: <b>{j.status}</b> •{" "}
                          {new Date(j.created_at).toLocaleString()}
                        </div>
                      </div>

                      <div>
                        {j.status === "done" && j.result_zip_path ? (
                          <a
                            className="btn primary"
                            href={`/api/jobs/download?jobId=${j.id}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Download ZIP
                          </a>
                        ) : (
                          <span className={`chip ${j.status}`}>{j.status}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="hr" />

              <div className="small muted">
                Next: AI captions + highlight detection + Stripe payments.
              </div>
            </div>
          </div>
        </main>
      </SignedIn>

      <style jsx global>{`
        :root {
          --bg: #050611;
          --card: rgba(255, 255, 255, 0.06);
          --border: rgba(255, 255, 255, 0.12);
          --text: rgba(255, 255, 255, 0.92);
          --muted: rgba(255, 255, 255, 0.6);
          --shadow: 0 12px 40px rgba(0, 0, 0, 0.5);

          --brand1: #8b5cf6;
          --brand2: #22c55e;
          --brand3: #38bdf8;

          --radius: 22px;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: radial-gradient(
              circle at 20% 10%,
              rgba(139, 92, 246, 0.35),
              transparent 40%
            ),
            radial-gradient(
              circle at 70% 0%,
              rgba(56, 189, 248, 0.25),
              transparent 40%
            ),
            radial-gradient(
              circle at 90% 90%,
              rgba(34, 197, 94, 0.22),
              transparent 45%
            ),
            var(--bg);
          color: var(--text);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .app {
          max-width: 1200px;
          margin: 0 auto;
          padding: 22px;
        }

        /* NAV */
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          backdrop-filter: blur(10px);
        }

        .navLeft {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .logo {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 1),
            rgba(56, 189, 248, 1)
          );
          font-size: 20px;
          box-shadow: 0 10px 35px rgba(139, 92, 246, 0.35);
        }

        .brand {
          font-weight: 900;
          letter-spacing: 0.2px;
        }

        .tagline {
          font-size: 12px;
          color: var(--muted);
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* LANDING */
        .landing {
          margin-top: 26px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 18px;
          align-items: stretch;
        }

        @media (max-width: 950px) {
          .hero {
            grid-template-columns: 1fr;
          }
        }

        .heroText {
          padding: 26px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: var(--shadow);
        }

        .pill {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 10px;
        }

        h1 {
          margin: 0;
          margin-top: 8px;
          font-size: 46px;
          line-height: 1.05;
          letter-spacing: -0.8px;
        }

        @media (max-width: 550px) {
          h1 {
            font-size: 34px;
          }
        }

        .gradientText {
          background: linear-gradient(90deg, var(--brand1), var(--brand3));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .heroText p {
          margin-top: 14px;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.6;
        }

        .ctaRow {
          display: flex;
          gap: 12px;
          margin-top: 18px;
          flex-wrap: wrap;
        }

        .mini {
          margin-top: 14px;
          color: var(--muted);
          font-size: 13px;
        }

        .heroCard {
          padding: 18px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: var(--shadow);
          backdrop-filter: blur(10px);
        }

        .heroCardTop {
          margin-bottom: 10px;
        }

        .heroTitle {
          font-weight: 900;
        }

        .heroSub {
          color: var(--muted);
          font-size: 13px;
        }

        .fakeClips {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 12px;
        }

        .fakeClip {
          display: flex;
          gap: 12px;
          align-items: center;
          border: 1px solid var(--border);
          background: rgba(0, 0, 0, 0.25);
          padding: 12px;
          border-radius: 16px;
        }

        .clipThumb {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.5),
            rgba(34, 197, 94, 0.4),
            rgba(56, 189, 248, 0.5)
          );
        }

        .clipName {
          font-weight: 800;
        }

        .clipMeta {
          color: var(--muted);
          font-size: 12px;
          margin-top: 2px;
        }

        .heroBottom {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .stat {
          padding: 12px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.25);
        }

        .statNum {
          font-weight: 900;
        }

        .statLabel {
          font-size: 12px;
          color: var(--muted);
          margin-top: 4px;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 18px;
        }

        @media (max-width: 950px) {
          .features {
            grid-template-columns: 1fr;
          }
        }

        .feature {
          padding: 18px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: var(--shadow);
        }

        .fIcon {
          font-size: 20px;
        }

        .fTitle {
          font-weight: 900;
          margin-top: 8px;
        }

        .fDesc {
          color: var(--muted);
          font-size: 13px;
          margin-top: 6px;
          line-height: 1.5;
        }

        /* DASHBOARD */
        .dashboard {
          margin-top: 20px;
        }

        .dashTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 20px 0 14px;
        }

        .dashTitle {
          font-size: 22px;
          font-weight: 900;
        }

        .dashSub {
          color: var(--muted);
          font-size: 13px;
          margin-top: 6px;
        }

        .dashGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 950px) {
          .dashGrid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          padding: 18px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: var(--shadow);
          backdrop-filter: blur(10px);
        }

        .cardHeader {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
        }

        .cardHeader.row {
          align-items: center;
        }

        .cardTitle {
          font-weight: 900;
          font-size: 18px;
        }

        .cardSub {
          color: var(--muted);
          font-size: 12px;
          margin-top: 6px;
          line-height: 1.4;
        }

        .hr {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 16px 0;
        }

        .sectionTitle {
          font-weight: 900;
          font-size: 13px;
          margin-bottom: 10px;
        }

        .presetGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 550px) {
          .presetGrid {
            grid-template-columns: 1fr;
          }
        }

        .presetCard {
          text-align: left;
          padding: 12px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.25);
          cursor: pointer;
          transition: transform 0.12s ease, border-color 0.12s ease;
        }

        .presetCard:hover {
          transform: translateY(-1px);
          border-color: rgba(139, 92, 246, 0.65);
        }

        .presetCard.active {
          border-color: rgba(56, 189, 248, 0.85);
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15);
        }

        .presetName {
          font-weight: 900;
        }

        .presetDesc {
          color: var(--muted);
          font-size: 12px;
          margin-top: 4px;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 950px) {
          .formGrid {
            grid-template-columns: 1fr;
          }
        }

        .label {
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 6px;
        }

        .input,
        .select {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(0, 0, 0, 0.35);
          color: var(--text);
          padding: 12px 12px;
          border-radius: 16px;
          outline: none;
        }

        .file {
          width: 100%;
          padding: 12px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(0, 0, 0, 0.35);
          color: var(--text);
        }

        .tos {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.4;
        }

        .progress {
          padding: 12px;
          border-radius: 16px;
          border: 1px solid rgba(139, 92, 246, 0.35);
          background: rgba(139, 92, 246, 0.12);
          margin-bottom: 12px;
          font-size: 13px;
        }

        .btn {
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text);
          padding: 11px 14px;
          border-radius: 16px;
          cursor: pointer;
          font-weight: 800;
        }

        .btn.big {
          padding: 14px 18px;
          border-radius: 18px;
        }

        .btn:hover {
          border-color: rgba(255, 255, 255, 0.25);
        }

        .btn.primary {
          border: none;
          background: linear-gradient(90deg, var(--brand1), var(--brand3));
          box-shadow: 0 14px 40px rgba(139, 92, 246, 0.35);
        }

        .btn.ghost {
          background: transparent;
        }

        .btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .small {
          font-size: 12px;
          color: var(--text);
          margin-top: 8px;
        }

        .small.muted {
          color: var(--muted);
        }

        .empty {
          color: var(--muted);
          font-size: 13px;
          padding: 12px;
          border: 1px dashed rgba(255, 255, 255, 0.18);
          border-radius: 18px;
        }

        .jobs {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .jobRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.25);
          padding: 12px;
          border-radius: 18px;
        }

        .jobTitle {
          font-weight: 900;
        }

        .jobMeta {
          color: var(--muted);
          font-size: 12px;
          margin-top: 4px;
        }

        .chip {
          font-size: 12px;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: var(--muted);
        }

        .chip.done {
          border-color: rgba(34, 197, 94, 0.5);
          color: rgba(34, 197, 94, 0.95);
        }

        .chip.queued {
          border-color: rgba(56, 189, 248, 0.45);
          color: rgba(56, 189, 248, 0.95);
        }

        .chip.processing {
          border-color: rgba(139, 92, 246, 0.5);
          color: rgba(139, 92, 246, 0.95);
        }

        .chip.failed {
          border-color: rgba(239, 68, 68, 0.6);
          color: rgba(239, 68, 68, 0.95);
        }
      `}</style>
      <footer
  style={{
    marginTop: 30,
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.12)",
    display: "flex",
    justifyContent: "center",
    gap: 14,
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
  }}
>
  <a href="/terms" style={{ textDecoration: "underline" }}>Terms</a>
  <a href="/privacy" style={{ textDecoration: "underline" }}>Privacy</a>
  <a href="/copyright" style={{ textDecoration: "underline" }}>Copyright</a>
</footer>
    </div>
  );
}
<div style={{ marginTop: 22, textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
  <a href="/terms">Terms</a> • <a href="/privacy">Privacy</a> •{" "}
  <a href="/copyright">Copyright</a>
</div>