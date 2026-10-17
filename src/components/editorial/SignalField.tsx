"use client";

import { useEffect, useRef } from "react";
import { ridgeLift, ripple } from "@/lib/editorial/signal";
import { CURSOR_QUERY, REDUCED_MOTION_QUERY } from "./hooks";

const LINES = 24;
const STEP = 8; // px between samples along a ridge
const PEAK = 60; // px a ridge rises right under the cursor
const IDLE_FRAME_MS = 33; // ~30 fps while nothing is chasing the cursor

/**
 * A ridgeline field behind the hero: stacked signal lines — a data plot and a
 * techno record sleeve at once — that rise into a peak where the cursor
 * passes, each ridge hiding the ones behind it. Drawn once and left still
 * under reduced motion and on touch or small screens (nothing to chase).
 */
export function SignalField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const follows = window.matchMedia(CURSOR_QUERY).matches;
    // Reduced motion, or no cursor to chase (phones): drawn once and left still.
    const still = window.matchMedia(REDUCED_MOTION_QUERY).matches || !follows;
    const target = { x: 0, y: 0, strength: 0 };
    const peak = { x: 0, y: 0, strength: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastDraw = 0;
    let visible = true;
    const startedAt = performance.now();
    // Colours come from the landing palette (globals.css → .editorial).
    const styles = getComputedStyle(canvas);
    const token = (name: string) => styles.getPropertyValue(name).trim() || "0 0% 50%";
    const ground = `hsl(${token("--background")})`;
    const ink = token("--foreground");
    const glow = token("--primary");

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const top = height * 0.16;
      const gap = (height * 0.98 - top) / (LINES - 1);
      for (let i = 0; i < LINES; i++) {
        const base = top + i * gap;
        const ridge = new Path2D();
        let lifted = 0;
        for (let x = 0; x <= width + STEP; x += STEP) {
          const lift = ridgeLift(x - peak.x, base - peak.y, peak.strength);
          lifted = Math.max(lifted, lift);
          // A little texture inside the peak so it reads as a signal, not a hill.
          const texture = 1 + 0.35 * Math.sin(x * 0.21 + i * 2.3 + time * 3);
          const y = base + ripple(x, i, time) - PEAK * lift * texture;
          if (x === 0) ridge.moveTo(x, y);
          else ridge.lineTo(x, y);
        }
        const area = new Path2D(ridge);
        area.lineTo(width + STEP, height);
        area.lineTo(0, height);
        area.closePath();
        ctx.fillStyle = ground;
        ctx.fill(area);
        // Quiet ink everywhere; the stretch under the cursor lights up in the accent.
        const stroke = ctx.createLinearGradient(peak.x - 260, 0, peak.x + 260, 0);
        stroke.addColorStop(0, `hsl(${ink} / 0.09)`);
        stroke.addColorStop(0.5, lifted > 0.02 ? `hsl(${glow} / ${0.12 + 0.5 * lifted})` : `hsl(${ink} / 0.09)`);
        stroke.addColorStop(1, `hsl(${ink} / 0.09)`);
        ctx.strokeStyle = stroke;
        ctx.stroke(ridge);
      }
    };

    const tick = (now: number) => {
      frame = 0;
      peak.x += (target.x - peak.x) * 0.14;
      peak.y += (target.y - peak.y) * 0.14;
      peak.strength += (target.strength - peak.strength) * 0.08;
      const chasing = peak.strength > 0.01 || target.strength > 0;
      if (chasing || now - lastDraw >= IDLE_FRAME_MS) {
        draw((now - startedAt) / 1000);
        lastDraw = now;
      }
      if (visible) frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 1;
      draw(still ? 0 : (performance.now() - startedAt) / 1000);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside) {
        target.x = x;
        target.y = y;
      }
      target.strength = inside ? 1 : 0;
    };
    const onLeave = () => {
      target.strength = 0;
    };

    const resizer = new ResizeObserver(resize);
    resizer.observe(canvas);

    if (still) return () => resizer.disconnect();

    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(tick);
    });
    watcher.observe(canvas);
    if (follows) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      watcher.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`} />;
}
