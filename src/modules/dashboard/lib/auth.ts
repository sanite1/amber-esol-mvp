import { jwtDecode } from "jwt-decode";

export interface DecodedJwt {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "admin" | "tutor" | "student";
  profilePicture: string;
  exp: number;
  iat: number;
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getDecodedJwt = (tokn: string = ""): DecodedJwt | null => {
  try {
    const token = getToken() || tokn;
    if (!token) return null;
    const decoded = jwtDecode<DecodedJwt>(token);
    return decoded;
  } catch {
    return null;
  }
};

export const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem("refreshToken", refreshToken);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const isAuthenticated = (): boolean => {
  try {
    const decodedToken = getDecodedJwt();
    if (decodedToken) {
      return decodedToken.exp > Date.now() / 1000;
    }
    return false;
  } catch {
    return false;
  }
};

export const isAdmin = (): boolean => {
  try {
    const decodedToken = getDecodedJwt();
    return decodedToken?.role === "admin" || false;
  } catch {
    return false;
  }
};

export const isTutor = (): boolean => {
  try {
    const decodedToken = getDecodedJwt();
    return decodedToken?.role === "tutor" || false;
  } catch {
    return false;
  }
};

export const isStudent = (): boolean => {
  try {
    const decodedToken = getDecodedJwt();
    return decodedToken?.role === "student" || false;
  } catch {
    return false;
  }
};
