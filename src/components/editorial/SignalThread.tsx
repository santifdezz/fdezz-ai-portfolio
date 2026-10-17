"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION_QUERY, transport } from "./hooks";
import { SECTION_IDS } from "./copy";

const WIDTH = 48;
const BASE_X = 14;
const AMP = 24; // px a peak leans out of the line
const SIGMA = 64; // px: how wide a peak is along the line
const SAMPLE = 6; // px between samples
const LINE_AT = 0.35; // where the reading line sits, as a share of the viewport

/**
 * One signal line that runs down the left edge for the whole page. Its resting
 * state is a thin trace with a dot on the reading line; every section's top
 * edge pushes a peak into it as it crosses the viewport, strongest when it
 * reaches the reading line, so the page reads as one waveform with a beat per
 * section. It runs on the shared transport clock, so scroll speed and tape
 * stops move it too. Desktop only: no room beside the content on small
 * screens, and none under reduced motion.
 */
export function SignalThread() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches || !window.matchMedia("(min-width: 1024px)").matches) return;

    const styles = getComputedStyle(canvas);
    const token = (n: string) => styles.getPropertyValue(n).trim() || "0 0% 50%";
    const ink = token("--foreground");
    const glow = token("--primary");
    let height = 0;
    let frame = 0;
    let clock = 0;
    let lastTick = performance.now();
    let moving = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      height = window.innerHeight;
      canvas.width = Math.round(WIDTH * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      moving = true;
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const draw = (now: number) => {
      frame = 0;
      clock += ((now - lastTick) / 1000) * transport.rate;
      lastTick = now;
      const line = height * LINE_AT;
      const tops = SECTION_IDS.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [el.getBoundingClientRect().top] : [];
      });
      // Strength of each section's peak: 1 on the reading line, fading out over ~45% of the viewport.
      const peaks = tops.map((top) => ({ y: top, s: Math.max(0, 1 - Math.abs(top - line) / (height * 0.45)) })).filter((p) => p.s > 0);

      ctx.clearRect(0, 0, WIDTH, height);
      ctx.beginPath();
      let hottest = 0;
      for (let y = -SAMPLE; y <= height + SAMPLE; y += SAMPLE) {
        let lean = 0;
        for (const p of peaks) {
          const d = (y - p.y) / SIGMA;
          lean += p.s * Math.exp(-d * d * 0.5) * (0.62 + 0.38 * Math.sin(y * 0.33 + clock * 9));
        }
        hottest = Math.max(hottest, lean);
        const x = BASE_X + AMP * lean + 0.6 * Math.sin(y * 0.04 + clock * 1.4);
        if (y < 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, `hsl(${ink} / 0.06)`);
      grad.addColorStop(LINE_AT, `hsl(${glow} / ${0.35 + 0.55 * Math.min(1, hottest)})`);
      grad.addColorStop(1, `hsl(${ink} / 0.06)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.25;
      ctx.lineJoin = "round";
      ctx.stroke();

      // The playhead dot rides the reading line.
      ctx.fillStyle = `hsl(${glow})`;
      ctx.beginPath();
      ctx.arc(BASE_X, line, 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Keep drawing while the page is moving or the clock is off its steady rate; sleep otherwise.
      if (moving || peaks.length > 0) {
        moving = false;
        frame = requestAnimationFrame(draw);
      }
    };

    const wake = () => {
      moving = true;
      if (!frame) {
        lastTick = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-y-0 left-0 z-20 hidden h-full lg:block" style={{ width: WIDTH }} />;
}
