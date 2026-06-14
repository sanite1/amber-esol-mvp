/**
 * Demo-mode global state — brief Function 16 frontend wiring.
 *
 * The backend stamps `X-Demo-Mode: true` on every API response when
 * the server is running in demo mode. This module captures that
 * header off any axios response, stores it in a module-singleton,
 * and exposes a `useIsDemoMode()` hook so React components can
 * subscribe.
 *
 * Why not Context?
 *
 *   The demo flag is read by components in completely unrelated
 *   subtrees (the dashboard layout banner, individual page action
 *   buttons, the MIS panel). A Context Provider would have to wrap
 *   the entire app and force every consumer to import via the
 *   provider. `useSyncExternalStore` over a module-level subscriber
 *   set gives us the same React semantics with zero provider chain.
 *
 * Persistence
 *
 *   We mirror the latest known value into sessionStorage so a hard
 *   refresh shows the banner before the first API response lands.
 *   `sessionStorage` (not local) so a tab opening a non-demo
 *   deployment in the same browser starts clean.
 *
 * Read invariants
 *
 *   The header is the source of truth. We NEVER flip the demo flag
 *   based on URL, env, or build-time config — that would let a demo
 *   deployment ship to a prod URL by accident and silently hide the
 *   banner. Every API response either reaffirms or clears the flag
 *   based on what the server sends.
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "amber:demo-mode";

const readInitial = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

let current: boolean = readInitial();
const listeners = new Set<() => void>();

const persist = (value: boolean) => {
  if (typeof window === "undefined") return;
  try {
    if (value) window.sessionStorage.setItem(STORAGE_KEY, "true");
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // sessionStorage can throw under privacy modes; the in-memory
    // value is still the source of truth, so we swallow.
  }
};

/**
 * Update the demo-mode flag. Called by the axios response
 * interceptor on every API response.
 *
 * Idempotent: if the flag isn't changing, we skip the notify so
 * React doesn't re-render every subscriber on a no-op.
 */
export const setDemoMode = (value: boolean): void => {
  if (current === value) return;
  current = value;
  persist(value);
  listeners.forEach((l) => l());
};

export const getDemoMode = (): boolean => current;

/**
 * useSyncExternalStore-compatible subscriber. React batches updates
 * and only re-renders when getSnapshot returns a different value.
 */
const subscribe = (cb: () => void): (() => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const getSnapshot = (): boolean => current;

/**
 * Hook — returns `true` when the backend has flagged this session
 * as a demo deployment. Renders the persistent banner and gates
 * the ILR / MIS UI affordances.
 */
export const useIsDemoMode = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, () => false);
