"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMotionValue } from "framer-motion";
import { readingPosition } from "@/lib/editorial/scroll";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Pinned horizontal gallery: wide, tall enough, mouse/trackpad, motion allowed. */
export const PIN_QUERY = `(min-width: 768px) and (min-height: 560px) and ${FINE_POINTER} and ${MOTION_OK}`;
/** Custom cursor: never on touch, small screens or reduced motion. */
export const CURSOR_QUERY = `(min-width: 768px) and ${FINE_POINTER} and ${MOTION_OK}`;
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Hydration-safe: renders the server snapshot (false) while hydrating, then
 * the real value. Framer's useReducedMotion reads matchMedia during the
 * hydration render, which mismatches the server HTML.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const subscribeScroll = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};

export function useScrolledPast(offset: number): boolean {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > offset,
    () => false,
  );
}

/**
 * Where the reader is: the section whose top last crossed a line `lineRatio`
 * down the viewport, plus a 0..1 playhead across all sections that moves
 * without re-rendering. At the very bottom of the page the last section wins,
 * even if it's too short to reach the line.
 */
export function useReadingPosition(ids: readonly string[], lineRatio = 0.35) {
  const [active, setActive] = useState<string | null>(null);
  const playhead = useMotionValue(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const found = ids.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, rect: el.getBoundingClientRect() }] : [];
      });
      const root = document.documentElement;
      const atBottom = window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= root.scrollHeight - 2;
      const position = atBottom
        ? { index: found.length - 1, progress: 1 }
        : readingPosition(
            found.map(({ rect }) => ({ top: rect.top, height: rect.height })),
            window.innerHeight * lineRatio,
          );
      playhead.set(position.progress);
      setActive(found[position.index]?.id ?? null);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids, lineRatio, playhead]);

  return { active, playhead };
}

export type ClipboardState = "idle" | "copied" | "failed";

export function useClipboard(resetMs = 1800) {
  const [state, setState] = useState<ClipboardState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      let next: ClipboardState = "copied";
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        next = "failed";
      }
      setState(next);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setState("idle"), resetMs);
    },
    [resetMs],
  );

  return { state, copy };
}

/** The page's shared clock: loops read `transport.rate`, `useTransport` moves it. */
export const transport = { rate: 1 };

const BRAKE_MS = 150; // time constant: ~600ms from full speed to a stop
const NUDGE_DECAY_MS = 260;
const MAX_NUDGE = 2.2;
const STOP_RATE = 0.35; // where a tape stop dips to before the clock recovers
const STOP_AFTER_MS = 140; // still this long after scrolling = the hand left the platter
const STOP_MIN_NUDGE = 0.25; // only a real push earns a tape stop

/**
 * One transport for the whole page. Every CSS loop marked `data-loop` and every
 * canvas that reads `transport.rate` runs on it: scrolling pushes the speed
 * like a hand on the platter (faster scrolling down, slower scrolling up) and,
 * when the scroll stops after a real push, the clock dips and recovers like a
 * tape stop. Hovering or focusing a `data-brake` element brakes the loops
 * inside it to a stop and releasing spins them back up. No-op under reduced
 * motion, where the loops are already gone.
 */
export function useTransport() {
  useEffect(() => {
    if (typeof document.getAnimations !== "function") return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    let nudge = 0;
    let stop = 1; // < 1 while recovering from a tape stop
    let hold = 1; // 1 free, 0 braked: applies inside the held element only
    let held: Element | null = null;
    let frame = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let lastScroll = last;
    let stopTimer: ReturnType<typeof setTimeout> | undefined;

    const loops = () =>
      document
        .getAnimations()
        .filter((a): a is CSSAnimation => "animationName" in a && !!(a.effect as KeyframeEffect | null)?.target?.closest?.("[data-loop]"));

    const apply = () => {
      transport.rate = Math.max(0, (1 + nudge) * stop);
      for (const animation of loops()) {
        const target = (animation.effect as KeyframeEffect).target as Element;
        const braked = held && held.contains(target) ? hold : 1;
        animation.playbackRate = transport.rate * braked;
      }
    };
    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min(64, now - last);
      last = now;
      nudge *= Math.exp(-dt / NUDGE_DECAY_MS);
      stop += (1 - stop) * (1 - Math.exp(-dt / 220));
      hold += ((held ? 0 : 1) - hold) * (1 - Math.exp(-dt / BRAKE_MS));
      const settled = Math.abs(nudge) < 0.002 && 1 - stop < 0.002 && Math.abs((held ? 0 : 1) - hold) < 0.002;
      if (settled) {
        nudge = 0;
        stop = 1;
        hold = held ? 0 : 1;
      }
      apply();
      if (!settled) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const onScroll = () => {
      const now = performance.now();
      const velocity = (window.scrollY - lastY) / Math.max(16, now - lastScroll); // px/ms
      lastY = window.scrollY;
      lastScroll = now;
      nudge = Math.max(-0.9, Math.min(MAX_NUDGE, nudge + velocity * 0.6));
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        if (Math.abs(nudge) > STOP_MIN_NUDGE) stop = STOP_RATE;
        wake();
      }, STOP_AFTER_MS);
      wake();
    };
    const brakeOf = (e: Event) => (e.target instanceof Element ? e.target.closest("[data-brake]") : null);
    const grab = (e: Event) => {
      const el = brakeOf(e);
      if (!el) return;
      held = el;
      wake();
    };
    const release = (e: Event) => {
      if (brakeOf(e) !== held) return;
      held = null;
      wake();
    };

    // JS is in charge of braking now: switch off the instant CSS pause.
    const brakes = document.querySelectorAll<HTMLElement>("[data-brake]");
    brakes.forEach((el) => (el.dataset.turntable = "on"));

    document.addEventListener("pointerover", grab);
    document.addEventListener("pointerout", release);
    document.addEventListener("focusin", grab);
    document.addEventListener("focusout", release);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(stopTimer);
      document.removeEventListener("pointerover", grab);
      document.removeEventListener("pointerout", release);
      document.removeEventListener("focusin", grab);
      document.removeEventListener("focusout", release);
      window.removeEventListener("scroll", onScroll);
      nudge = 0;
      stop = 1;
      held = null;
      brakes.forEach((el) => delete el.dataset.turntable);
      transport.rate = 1;
      for (const animation of loops()) animation.playbackRate = 1;
    };
  }, []);
}
