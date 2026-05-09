import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import {
  getDecodedJwt,
  getRefreshToken,
  getToken,
  removeAuthToken,
  DecodedJwt,
} from "../lib/auth";
import { useRefresh } from "../lib/api/authOnboarding";

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

  const logout = useCallback(() => {
    removeAuthToken();
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    Cookies.remove("authToken");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

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
