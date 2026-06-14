/**
 * react-query client + global error handling — M0.2.
 *
 * Why a non-bare client
 * ─────────────────────
 * Every page used to define its own `onError` toast handler.
 * That's brittle (forget it and errors silently swallow), noisy
 * (duplicate strings everywhere), and inconsistent (each page
 * extracts a different field from the AxiosError response).
 *
 * This client centralises:
 *   • Mutation error → sonner toast (always, unless `meta.silent`).
 *   • Query error → sonner toast (opt-in via `meta.toastOnError`)
 *     so background refetches don't spam the UI.
 *   • One consistent error-message extractor for both.
 *
 * Per-page handlers still run (react-query fires component-level
 * callbacks first); they can mark `meta: { silent: true }` to
 * suppress the global toast when they've already shown their own.
 *
 * Auth 401s are NOT toasted here — the axios interceptor
 * (src/lib/network/axios.ts) handles them by redirecting to /login.
 * A toast on top of the redirect would be visual noise.
 */

import { QueryCache, MutationCache, QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

/**
 * Pull a human-readable message out of whatever the API / axios /
 * native fetch / runtime threw. Mirrors the precedence already in
 * use across the codebase (see Login.tsx, useTeacherDashboard, etc.)
 * so adopting the global handler doesn't change what users see.
 */
export const extractErrorMessage = (error: unknown): string => {
  if (!error) return "Something went wrong. Please try again.";

  // Axios-shaped error
  const ax = error as AxiosError<{
    message?: string;
    fields?: { message?: string }[];
    errors?: { message?: string }[];
  }>;
  const data = ax?.response?.data;
  if (data) {
    if (Array.isArray(data.fields) && data.fields[0]?.message) {
      return data.fields[0].message;
    }
    if (Array.isArray(data.errors) && data.errors[0]?.message) {
      return data.errors[0].message;
    }
    if (typeof data.message === "string" && data.message.length > 0) {
      return data.message;
    }
  }

  // Native Error
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

/**
 * Distinguish "the axios interceptor will handle this" cases from
 * the ones we should toast about. 401 is owned by the interceptor —
 * it redirects to /login. Toasting on top would look like two bugs.
 *
 * Network errors (no response) we DO toast — "Couldn't reach server"
 * is a legitimate signal the interceptor doesn't show.
 */
const isHandledElsewhere = (error: unknown): boolean => {
  const status = (error as AxiosError)?.response?.status;
  return status === 401;
};

/**
 * Meta shape pages can attach to a query/mutation to opt in/out of
 * the global toast behaviour.
 */
type QueryMeta = {
  silent?: boolean;
  toastOnError?: boolean;
  errorMessage?: string;
};

const queryCache = new QueryCache({
  onError: (error, query) => {
    if (isHandledElsewhere(error)) return;

    const meta = (query.meta ?? {}) as QueryMeta;

    // Queries are *opt-in* for toasts — background refetches on
    // window-focus shouldn't keep raising the same banner. Pages
    // that want the toast (e.g. on-demand `refetch()` actions)
    // set `meta: { toastOnError: true }`.
    if (!meta.toastOnError) return;
    if (meta.silent) return;

    toast.error(meta.errorMessage ?? extractErrorMessage(error));
  },
});

const mutationCache = new MutationCache({
  onError: (error, _variables, _ctx, mutation) => {
    if (isHandledElsewhere(error)) return;

    const meta = (mutation.meta ?? {}) as QueryMeta;
    if (meta.silent) return;

    toast.error(meta.errorMessage ?? extractErrorMessage(error));
  },
});

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      // Don't aggressively retry — many of our endpoints are
      // role-gated 403s that won't suddenly succeed. The few that
      // are flaky network can opt up via per-query config.
      retry: 1,
      // 30s default is a sane balance for dashboard data; pages
      // that want fresher data set their own staleTime.
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Mutations never auto-retry — we don't want a flaky POST
      // /teacher/review to fire twice and create duplicate audit
      // rows on the backend.
      retry: false,
    },
  },
});
