"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
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

const BRAKE_MS = 150; // time constant: ~600ms from full speed to a stop
const NUDGE_DECAY_MS = 260;
const MAX_NUDGE = 2.2;

/**
 * Treats the CSS animations inside `ref` as a turntable instead of a loop:
 * hover or focus brakes them to a stop over ~600ms and releasing spins them
 * back up; with `pitch`, scrolling nudges the speed like a hand on the
 * platter (faster scrolling down, slower scrolling up). No-op when reduced
 * motion has removed the animations.
 */
export function useTurntable<T extends HTMLElement>(ref: RefObject<T | null>, { pitch = false } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.getAnimations !== "function") return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    el.dataset.turntable = "on";
    let rate = 1;
    let nudge = 0;
    let held = false;
    let frame = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let lastScroll = last;

    const apply = () => {
      // CSS animations only: hover transitions inside (the vinyl's button) must not freeze.
      for (const animation of el.getAnimations({ subtree: true })) {
        if ("animationName" in animation) animation.playbackRate = rate;
      }
    };
    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min(64, now - last);
      last = now;
      nudge *= Math.exp(-dt / NUDGE_DECAY_MS);
      const goal = held ? 0 : 1 + nudge;
      rate += (goal - rate) * (1 - Math.exp(-dt / BRAKE_MS));
      if (Math.abs(goal - rate) < 0.002 && Math.abs(nudge) < 0.002) rate = goal;
      apply();
      if (rate !== goal || Math.abs(nudge) >= 0.002) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const hold = () => {
      held = true;
      wake();
    };
    const release = () => {
      held = false;
      wake();
    };
    const onScroll = () => {
      const now = performance.now();
      const velocity = (window.scrollY - lastY) / Math.max(16, now - lastScroll); // px/ms
      lastY = window.scrollY;
      lastScroll = now;
      nudge = Math.max(-0.9, Math.min(MAX_NUDGE, nudge + velocity * 0.6));
      wake();
    };

    el.addEventListener("pointerenter", hold);
    el.addEventListener("pointerleave", release);
    el.addEventListener("focusin", hold);
    el.addEventListener("focusout", release);
    if (pitch) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      delete el.dataset.turntable;
      el.removeEventListener("pointerenter", hold);
      el.removeEventListener("pointerleave", release);
      el.removeEventListener("focusin", hold);
      el.removeEventListener("focusout", release);
      window.removeEventListener("scroll", onScroll);
      rate = 1;
      apply();
    };
  }, [ref, pitch]);
}
