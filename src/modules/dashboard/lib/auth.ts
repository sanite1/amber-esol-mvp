/* eslint-disable camelcase */
import { jwtDecode } from "jwt-decode";

// Define shape of decoded JWT if you know it
export interface DecodedJwt {
  exp: number; // Expiration timestamp
  role?: string; // User role (admin, etc.)
  [key: string]: any; // Allow extra claims
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem("token", token);
  // localStorage.setItem("refreshToken", refreshToken);
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getDecodedJwt = (tokn: string = ""): DecodedJwt | null => {
  try {
    const token = getToken() || tokn;
    if (!token) return null;

    // ⚠️ FIX: The original `now.getSeconds() > 259200` made no sense
    // (getSeconds() is just 0–59). I assume you meant expiry check.
    const decoded = jwtDecode<DecodedJwt>(token);

    return decoded;
  } catch (e) {
    return null;
  }
};

export const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem("refreshToken", refreshToken);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const removeDomainObj = (): void => {
  localStorage.removeItem("domain");
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("token");
};

export const logOut = (): void => {
  removeAuthToken();
};

export const isAuthenticated = (): boolean => {
  try {
    const decodedToken = getDecodedJwt();
    if (decodedToken) {
      const { exp } = decodedToken;
      const currentTime = Date.now() / 1000;
      return exp > currentTime;
    }
    return false;
  } catch {
    return false;
  }
};

export const isAdmin = (): boolean => {
  try {
    const decodedToken = getDecodedJwt();
    if (decodedToken) {
      return decodedToken.role === "admin";
    }
    return false;
  } catch {
    return false;
  }
};
