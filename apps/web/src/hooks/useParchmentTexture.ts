import { useEffect } from "react";

const SEED_KEY = "parchment-texture-seed";
const TEXTURE_SIZE = 512;

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getOrCreateSeed(): number {
  try {
    const stored = localStorage.getItem(SEED_KEY);
    if (stored) return Number(stored);
    const seed = Math.floor(Math.random() * 2147483647);
    localStorage.setItem(SEED_KEY, String(seed));
    return seed;
  } catch {
    return 42;
  }
}

function generateParchmentDataUrl(seed: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const rand = mulberry32(seed);

  const base = ctx.createLinearGradient(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
  base.addColorStop(0, "#f0e4b8");
  base.addColorStop(0.5, "#f5edd0");
  base.addColorStop(1, "#e8d9a8");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  const creaseCount = 50 + Math.floor(rand() * 30);
  for (let i = 0; i < creaseCount; i++) {
    const y = rand() * TEXTURE_SIZE;
    const jitter = (rand() - 0.5) * 4;
    ctx.strokeStyle = `rgba(139, 119, 80, ${0.08 + rand() * 0.12})`;
    ctx.lineWidth = 0.5 + rand() * 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= TEXTURE_SIZE; x += 32) {
      ctx.lineTo(x, y + jitter * Math.sin(x * 0.05 + rand() * 6));
    }
    ctx.stroke();
  }

  const dotCount = 250 + Math.floor(rand() * 150);
  for (let i = 0; i < dotCount; i++) {
    const x = rand() * TEXTURE_SIZE;
    const y = rand() * TEXTURE_SIZE;
    const gray = rand() > 0.5;
    ctx.fillStyle = gray ? `rgba(90, 80, 70, ${0.15 + rand() * 0.2})` : `rgba(120, 90, 60, ${0.12 + rand() * 0.18})`;
    const size = rand() > 0.7 ? 2 : 1;
    ctx.fillRect(x, y, size, size);
  }

  return canvas.toDataURL("image/png");
}

export function useParchmentTexture() {
  useEffect(() => {
    const seed = getOrCreateSeed();
    const url = generateParchmentDataUrl(seed);
    if (url) {
      document.documentElement.style.setProperty("--parchment-texture-url", `url("${url}")`);
    }
  }, []);
}
