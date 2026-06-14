import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getDecodedJwt,
  getRefreshToken,
  getToken,
  removeAuthToken,
  DecodedJwt,
} from "../lib/auth";
import { useRefresh, clearAuthCookie } from "../lib/api/authOnboarding";

interface AuthContextType {
  isAuthenticated: boolean;
  user: DecodedJwt | null;
  loading: boolean;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  refreshAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<DecodedJwt | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = getToken();
    const decoded = getDecodedJwt(token || "");
    return !!token && !!decoded && decoded.exp > Date.now() / 1000;
  });

  const { mutateAsync: refreshMutation } = useRefresh();
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    // 1. Tokens — both the access JWT (cookie + localStorage) and the
    //    refresh token. `removeAuthToken` clears both localStorage keys;
    //    `clearAuthCookie` clears the cookie with the same domain/path
    //    attributes it was set with.
    removeAuthToken();
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    clearAuthCookie();

    // 2. React state — anyone reading useAuth() flips to logged-out
    //    synchronously so mid-render guards bounce instead of flashing
    //    private content.
    setUser(null);
    setIsAuthenticated(false);

    // 3. react-query cache — without this, a user who logs out and
    //    logs back in as a DIFFERENT role would see the previous
    //    role's cached pages (teacher-priority-queue, admin-org-list,
    //    etc.) for a moment before the per-query staleTime expires.
    //    `clear()` is more aggressive than `invalidate()` — every
    //    cached payload is dropped, so the next mount refetches.
    queryClient.clear();
  }, [queryClient]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        logout();
        return;
      }

      await refreshMutation();
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
      setIsAuthenticated(true);
    } catch {
      logout();
    }
  }, [refreshMutation, logout]);

  const refreshAuthState = useCallback(() => {
    const token = getToken();
    const decoded = getDecodedJwt(token || "");

    if (!token || !decoded) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    setIsAuthenticated(true);
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  // Listen for userUpdated events (dispatched after profile updates)
  useEffect(() => {
    const handleUserUpdated = () => {
      refreshAuthState();
    };
    window.addEventListener("userUpdated", handleUserUpdated);
    return () => window.removeEventListener("userUpdated", handleUserUpdated);
  }, [refreshAuthState]);

  // Listen for `auth:unauthorized` — dispatched by the axios interceptor
  // when any non-auth endpoint returns 401 (session timeout, revoked
  // token, etc.). The interceptor will hard-redirect to /login a tick
  // later; we clear React state synchronously here so any visible UI
  // (e.g. mid-edit modals, partial dashboards) tears down cleanly
  // before the navigation.
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [logout]);

  // Check token validity on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      const decoded = getDecodedJwt(token || "");

      if (!token || !decoded) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        await refreshAccessToken();
      } else {
        setIsAuthenticated(true);
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
      }

      setLoading(false);
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh 1 minute before expiry
  useEffect(() => {
    const token = getToken();
    const decoded = getDecodedJwt(token || "");
    if (!decoded) return;

    const currentTime = Date.now() / 1000;
    const timeToExpiry = decoded.exp - currentTime;

    if (timeToExpiry > 60) {
      const timeout = setTimeout(
        refreshAccessToken,
        (timeToExpiry - 60) * 1000,
      );
      return () => clearTimeout(timeout);
    }
  }, [user, refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        logout,
        refreshAccessToken,
        refreshAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
