import "dotenv/config";

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import AdmZip from "adm-zip";
import fetch from "node-fetch";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// -------------------- ENV --------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE env vars");
  process.exit(1);
}

if (!OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY");
  process.exit(1);
}

// -------------------- CLIENTS --------------------
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// -------------------- HELPERS --------------------
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safePathForFfmpeg(p) {
  // ffmpeg subtitles filter likes forward slashes on windows
  return p.replace(/\\/g, "/");
}

function secondsToSrtTime(seconds) {
  const ms = Math.floor((seconds % 1) * 1000);
  const total = Math.floor(seconds);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

// Group words into subtitle lines (simple)
function writeSrtFromWords(words, outSrtPath) {
  const groupSize = 6; // 6 words per subtitle block
  let idx = 1;
  let srt = "";

  for (let i = 0; i < words.length; i += groupSize) {
    const chunk = words.slice(i, i + groupSize);
    if (!chunk.length) continue;

    const start = chunk[0]?.start ?? 0;
    const end = chunk[chunk.length - 1]?.end ?? start + 1;

    const text = chunk
      .map((w) => w.word)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (!text) continue;

    srt += `${idx}\n`;
    srt += `${secondsToSrtTime(start)} --> ${secondsToSrtTime(end)}\n`;
    srt += `${text}\n\n`;
    idx++;
  }

  fs.writeFileSync(outSrtPath, srt, "utf8");
}

async function whisperToSrt(wavPath, srtPath) {
  const audioStream = fs.createReadStream(wavPath);

  const transcript = await openai.audio.transcriptions.create({
    file: audioStream,
    model: "gpt-4o-mini-transcribe",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  const words = transcript.words || [];

  if (!words.length) {
    // fallback empty subtitles
    fs.writeFileSync(srtPath, "", "utf8");
    return;
  }

  writeSrtFromWords(words, srtPath);
}

// -------------------- MAIN WORK --------------------
async function runOnce() {
  console.log("🔎 Searching queued job...");

  // 1) Get 1 queued job
  const { data: jobs, error } = await sb
    .from("jobs")
    .select("*")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) throw new Error(error.message);
  if (!jobs || jobs.length === 0) {
    console.log("✅ No jobs queued.");
    return;
  }

  const job = jobs[0];
  console.log("🎯 Found job:", job.id);

  // 2) Mark processing
  await sb.from("jobs").update({ status: "processing" }).eq("id", job.id);

  // 3) Setup workdir
  const workDir = path.join(process.cwd(), "tmp", job.id);
  ensureDir(workDir);

  const inputPath = path.join(workDir, "input.mp4");
  const clipsDir = path.join(workDir, "clips");
  ensureDir(clipsDir);

  // 4) Download video from Supabase Storage using signed URL
  if (!job.video_path) throw new Error("Job missing video_path");

  console.log("🔐 Creating signed URL for video...");
  const { data: signed, error: signErr } = await sb.storage
    .from("clipgenius")
    .createSignedUrl(job.video_path, 60 * 15);

  if (signErr) throw new Error(signErr.message);

  console.log("⬇️ Downloading video...");
  const r = await fetch(signed.signedUrl);
  if (!r.ok) throw new Error("Failed downloading video");
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(inputPath, buf);

  // 5) Generate clips
  const clipSeconds = job.clip_length || 18;
  const maxClips = job.max_clips || 10;

  console.log(`✂️ Generating up to ${maxClips} clips (${clipSeconds}s each)...`);

  // Simple strategy: every 30 seconds
  const step = 30;
  let produced = 0;

  for (let i = 0; i < maxClips; i++) {
    const start = i * step;
    const rawClip = path.join(clipsDir, `clip_${String(i + 1).padStart(2, "0")}.mp4`);

    // Create clip
    const cmd = `ffmpeg -y -ss ${start} -i "${inputPath}" -t ${clipSeconds} -c:v libx264 -preset veryfast -c:a aac "${rawClip}"`;
    try {
      execSync(cmd, { stdio: "ignore" });
    } catch (e) {
      console.log("⚠️ Clip failed at index", i + 1, "- stopping.");
      break;
    }

    // 6) Extract WAV for Whisper
    const wavPath = rawClip.replace(".mp4", ".wav");
    try {
      execSync(`ffmpeg -y -i "${rawClip}" -ar 16000 -ac 1 "${wavPath}"`, {
        stdio: "ignore",
      });
    } catch (e) {
      console.log("⚠️ Audio extract failed for", rawClip);
      break;
    }

    // 7) Whisper transcription -> SRT
    const srtPath = rawClip.replace(".mp4", ".srt");
    console.log("🧠 Whisper captions for clip", i + 1);
    await whisperToSrt(wavPath, srtPath);

    // 8) Burn subtitles
    const captionedClip = rawClip.replace(".mp4", "_captioned.mp4");

    try {
      execSync(
        `ffmpeg -y -i "${rawClip}" -vf "subtitles='${safePathForFfmpeg(srtPath)}'" -c:a copy "${captionedClip}"`,
        { stdio: "ignore" }
      );

      // Replace raw clip with captioned
      fs.unlinkSync(rawClip);
      fs.renameSync(captionedClip, rawClip);
    } catch (e) {
      console.log("⚠️ Caption burn failed for clip", i + 1, "(keeping raw clip)");
      // if captioned created, remove it
      if (fs.existsSync(captionedClip)) fs.unlinkSync(captionedClip);
    }

    // cleanup wav + srt to save space
    if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);
    if (fs.existsSync(srtPath)) fs.unlinkSync(srtPath);

    produced++;
  }

  if (produced === 0) {
    await sb.from("jobs").update({ status: "failed" }).eq("id", job.id);
    throw new Error("No clips produced.");
  }

  // 9) ZIP clips
  console.log("📦 Zipping clips...");
  const zip = new AdmZip();
  const files = fs.readdirSync(clipsDir);

  for (const f of files) {
    zip.addLocalFile(path.join(clipsDir, f));
  }

  const zipPath = path.join(workDir, "clips.zip");
  zip.writeZip(zipPath);

  // 10) Upload ZIP back to Storage
  const zipStoragePath = `${job.user_id}/jobs/${job.id}/clips.zip`;
  console.log("☁️ Uploading ZIP to Storage:", zipStoragePath);

  const zipBuf = fs.readFileSync(zipPath);

  const { error: upZipErr } = await sb.storage
    .from("clipgenius")
    .upload(zipStoragePath, zipBuf, {
      contentType: "application/zip",
      upsert: true,
    });

  if (upZipErr) {
    await sb.from("jobs").update({ status: "failed" }).eq("id", job.id);
    throw new Error(upZipErr.message);
  }

  // 11) Create signed download link (24h)
  const { data: zipSigned, error: zipSignErr } = await sb.storage
    .from("clipgenius")
    .createSignedUrl(zipStoragePath, 60 * 60 * 24);

  if (zipSignErr) {
    await sb.from("jobs").update({ status: "failed" }).eq("id", job.id);
    throw new Error(zipSignErr.message);
  }

  // 12) Update job -> done
  await sb
    .from("jobs")
    .update({
      status: "done",
      clip_count: produced,
      result_url: zipSigned.signedUrl,
      result_zip_path: zipStoragePath,
    })
    .eq("id", job.id);

  console.log("✅ Job finished:", job.id);
  console.log("🔗 Download:", zipSigned.signedUrl);
}

async function main() {
  try {
    await runOnce();
  } catch (err) {
    console.error("❌ Worker error:", err.message);
  }
}

main();
async function loop() {
  while (true) {
    await main();
    await new Promise((r) => setTimeout(r, 5000)); // check every 5 sec
  }
}
loop();