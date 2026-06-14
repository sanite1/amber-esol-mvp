import Axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { setDemoMode } from "../demoMode";
import { clearAuthCookie } from "../../modules/dashboard/lib/api/authOnboarding";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const axios: AxiosInstance = Axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

axios.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token"); // Retrieve the token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor — capture `X-Demo-Mode` and push it into the
 * global demo-mode store. Function 16: the backend stamps this on
 * every response when DEMO_MODE=true; the frontend reflects that
 * by rendering the persistent banner and hiding ILR/MIS actions.
 *
 * Runs on EVERY response (success or error) so a demo deployment
 * shows the banner immediately on the very first call — even if
 * that call is a 401 to /me before login.
 */
const captureDemoMode = (response?: AxiosResponse | undefined): void => {
  if (!response) return;
  const header = response.headers?.["x-demo-mode"];
  const value = typeof header === "string" && header.toLowerCase() === "true";
  setDemoMode(value);
};

/**
 * Endpoints where a 401 is the API's *intended* signal (bad creds,
 * expired refresh-token, unverified token preview) — not a session
 * timeout. We must NOT redirect the user away from these or we'll
 * disrupt the login / refresh / referral wizard flows.
 *
 * `/users/refresh` is excluded because AuthContext.refreshAccessToken
 * catches that path itself and calls logout() — having axios also
 * tear down state would race the AuthContext.
 */
const AUTH_ENDPOINTS = [
  /\/users\/login\b/,
  /\/users\/refresh\b/,
  /\/users\/register\b/,
  /\/users\/forgot-password\b/,
  /\/users\/reset-password\b/,
  /\/esol\/verify-token\b/,
  /\/esol\/register\b/,
];

const isAuthEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((re) => re.test(url));
};

/**
 * Routes that are public — landing on /login from one of these on
 * a 401 would be jarring (and would clobber a returnTo trail the
 * marketing site might have set). Skip the redirect for these.
 */
const isPublicPath = (pathname: string): boolean => {
  if (pathname === "/login") return true;
  if (pathname === "/signup") return true;
  if (pathname === "/") return true;
  if (pathname.startsWith("/roi-calculator")) return true;
  if (pathname.startsWith("/esol/join")) return true; // referral wizard
  return false;
};

/**
 * Latched flag — prevents the thundering-herd problem where ten
 * parallel react-query refetches all 401 at once and each one tries
 * to redirect. First 401 wins; the rest no-op. The page reload that
 * follows wipes the flag for us.
 */
let unauthorizedHandled = false;

/**
 * Hard logout — clears every storage location the auth layer
 * touches (matches AuthContext.logout() so we don't leave half-state
 * behind), then redirects to /login with a returnTo crumb so the
 * user lands back where they were after re-auth.
 *
 * We dispatch `auth:unauthorized` first so any in-flight React state
 * (modals, optimistic mutations, sockets) can clean up before the
 * page navigates. A 0ms timeout ensures the navigation is the last
 * thing in the microtask queue.
 */
const handleUnauthorized = (): void => {
  if (typeof window === "undefined") return;
  if (unauthorizedHandled) return;
  if (isPublicPath(window.location.pathname)) return;
  unauthorizedHandled = true;

  try {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    clearAuthCookie();
  } catch {
    // localStorage / cookies disabled — swallow; redirect still works
  }

  // Let listeners (AuthContext, in-flight forms, sockets) react
  // before we hard-navigate.
  try {
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  } catch {
    // Older Safari without CustomEvent constructor — non-fatal
  }

  // Preserve where the user was so /login can bounce them back.
  const returnTo = window.location.pathname + window.location.search;
  if (returnTo && returnTo !== "/" && returnTo !== "/login") {
    try {
      sessionStorage.setItem("returnTo", returnTo);
    } catch {
      // sessionStorage unavailable — non-fatal
    }
  }

  // Full reload (not react-router) so every in-memory cache is
  // dropped — query cache, AuthContext, sockets, sonner toasts.
  setTimeout(() => {
    window.location.assign("/login");
  }, 0);
};

axios.interceptors.response.use(
  (response) => {
    captureDemoMode(response);
    return response;
  },
  (error: AxiosError) => {
    // Errors carry the same headers — read them too so an early 401
    // still flips the banner before the user even logs in.
    captureDemoMode(error.response ?? undefined);

    const status = error.response?.status;
    const url = error.config?.url;

    // Global session-expiry handler. Skipped for endpoints whose
    // 401 is the expected API contract (login bad-creds etc.) and
    // for public landing pages where a redirect would be jarring.
    if (status === 401 && !isAuthEndpoint(url)) {
      handleUnauthorized();
    }

    return Promise.reject(error);
  },
);

export type ApiResponse<T = unknown> = {
  statusCode: number;
  message: string;
  data: T;
};

export type ApiAxiosResponse<T = unknown> = AxiosResponse<{
  status: boolean;
  message: string;
  data: T;
}>;

interface ErrorsObject {
  field: string;
  message: string;
}

export type ApiError = AxiosError<{
  status: boolean;
  message: string;
  fields?: { message: string }[];
  errors?: ErrorsObject[];
}>;

export default axios;
