/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import {
  getDecodedJwt,
  getRefreshToken,
  getToken,
  removeAuthToken,
} from "../lib/auth";
import { useRefresh } from "../lib/api/authOnboarding";

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  user: any | null;
  loading: boolean;
  refreshAccessToken: () => Promise<void>;
  refreshAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);

  // ✅ initialize state from localStorage
  const [user, setUser] = useState<any | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = getToken();
    const decoded = getDecodedJwt(token || "");
    return !!token && !!decoded && decoded.exp > Date.now() / 1000;
  });

  const { mutateAsync: refresh } = useRefresh();

  // --- helper: refresh access token automatically ---
  const refreshAccessToken = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        console.warn("No refresh token found. Logging out...");
        logout();
        return;
      }

      await refresh(); // uses your existing refresh API
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token refresh failed ❌", error);
      logout();
    }
  };

  // --- logout clears tokens & updates state ---
  const logout = () => {
    removeAuthToken();
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    Cookies.remove("authToken");

    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshAuthState = () => {
    const token = getToken();
    const decoded = getDecodedJwt(token || "");

    if (!token || !decoded) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    setIsAuthenticated(true);
    setUser(
      localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null
    );
  };

  // const navigate = useNavigate();

  // Redirect if already authenticated
  // useEffect(() => {
  //   if (!loading && isAuthenticated) {
  //     navigate("/", { replace: true });
  //   }
  // }, [isAuthenticated, loading, navigate]);

  // --- check token validity on load ---
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
        setUser(
          localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user")!)
            : null
        );
      }

      setLoading(false);
    };

    initializeAuth();
  }, [localStorage.getItem("token")]);

  // --- auto-refresh 1 min before expiry ---
  useEffect(() => {
    const token = getToken();
    const decoded = getDecodedJwt(token || "");
    if (!decoded) return;

    const currentTime = Date.now() / 1000;
    const timeToExpiry = decoded.exp - currentTime;

    if (timeToExpiry > 60) {
      const timeout = setTimeout(
        refreshAccessToken,
        (timeToExpiry - 60) * 1000
      );
      return () => clearTimeout(timeout);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        logout,
        loading,
        refreshAccessToken,
        refreshAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- hook for components ---
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
