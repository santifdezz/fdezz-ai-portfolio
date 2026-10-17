"use client";

import { useEffect, useRef } from "react";
import { ridgeLift, ripple } from "@/lib/editorial/signal";
import { REDUCED_MOTION_QUERY } from "./hooks";

const LINES = 26;
const STEP = 8;
const PEAK = 150; // px the travelling pulse rises
const RUN_MS = 2000; // the wave plays this long; the overlay lifts on its own CSS clock

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * The opening title: a stack of signal lines (the hero's field) takes a pulse
 * that sweeps across them like an audio peak while the name tightens out of
 * wide tracking, then the whole sheet lifts to reveal the hero. The sheet and
 * the name are plain CSS (so they run before hydration and the hero's
 * entrances are timed against `--intro`); only the wave needs JS. Phones get
 * the name alone and a shorter run; returning visitors in the same session and
 * reduced motion skip it (see layout.tsx and globals.css).
 */
export function Intro({ name, role }: { name: string; role: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches || window.matchMedia("(max-width: 767px)").matches) return;
    if (document.documentElement.dataset.intro === "done") return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 1;

    const styles = getComputedStyle(canvas);
    const token = (n: string) => styles.getPropertyValue(n).trim() || "0 0% 50%";
    const ground = `hsl(${token("--background")})`;
    const ink = token("--foreground");
    const glow = token("--primary");
    const gap = Math.min(22, (height * 0.62) / LINES);
    const mid = (LINES - 1) / 2;
    const start = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      const ms = now - start;
      const k = Math.min(1, ms / RUN_MS);
      const seconds = ms / 1000;
      // The pulse is born, travels the width, and decays as the sheet starts to lift.
      const energy = smooth(0, 0.25, k) * (1 - smooth(0.7, 1, k));
      const peakX = width * (0.04 + 0.92 * smooth(0.05, 0.85, k));
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < LINES; i++) {
        const base = height * 0.5 + (i - mid) * gap;
        const reach = 1 - Math.abs(i - mid) / (mid + 2); // centre lines rise highest
        const ridge = new Path2D();
        let lifted = 0;
        for (let x = 0; x <= width + STEP; x += STEP) {
          const lift = ridgeLift(x - peakX, 0, 1) * energy * reach;
          lifted = Math.max(lifted, lift);
          const texture = 1 + 0.45 * Math.sin(x * 0.19 + i * 2.1 + seconds * 14);
          const y = base + ripple(x, i, seconds * 2) - PEAK * lift * texture;
          if (x === 0) ridge.moveTo(x, y);
          else ridge.lineTo(x, y);
        }
        const area = new Path2D(ridge);
        area.lineTo(width + STEP, height);
        area.lineTo(0, height);
        area.closePath();
        ctx.fillStyle = ground;
        ctx.fill(area);
        const stroke = ctx.createLinearGradient(peakX - 320, 0, peakX + 320, 0);
        stroke.addColorStop(0, `hsl(${ink} / 0.10)`);
        stroke.addColorStop(0.5, `hsl(${glow} / ${0.14 + 0.8 * Math.min(1, lifted * 1.6)})`);
        stroke.addColorStop(1, `hsl(${ink} / 0.10)`);
        ctx.strokeStyle = stroke;
        ctx.stroke(ridge);
      }
      if (ms < RUN_MS + 400) frame = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, width, height);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div aria-hidden className="intro pointer-events-none fixed inset-0 z-[70] grid place-items-center overflow-hidden bg-[hsl(var(--background))]">
      <canvas ref={canvasRef} className="absolute inset-0 size-full max-md:hidden" />
      <div className="relative text-center">
        <p className="intro-name font-display text-[clamp(2.4rem,8.4vw,8rem)] font-light leading-none">
          {Array.from(name).map((ch, i) => (
            <span key={i} className="intro-char" style={{ ["--i" as string]: i }}>
              {ch === " " ? " " : ch}
            </span>
          ))}
        </p>
        <p className="intro-role mt-5 font-mono text-[11px] uppercase tracking-[0.32em] text-[hsl(var(--muted-foreground))]">{role}</p>
      </div>
    </div>
  );
}
