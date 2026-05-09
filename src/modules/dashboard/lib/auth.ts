import { jwtDecode } from "jwt-decode";

export interface DecodedJwt {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "admin" | "tutor" | "student" | "org_admin";
  profilePicture: string;
  orgId?: string | null;
  esolLevel?: string | null;
  esolTeacherApproved?: boolean | null;
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

export const isOrgAdmin = (): boolean => {
  try {
    const decodedToken = getDecodedJwt();
    return decodedToken?.role === "org_admin" || false;
  } catch {
    return false;
  }
};

export const isEsolLearner = (): boolean => {
  try {
    const decodedToken = getDecodedJwt();
    return Boolean(decodedToken?.role === "student" && decodedToken?.orgId);
  } catch {
    return false;
  }
};

export const isEsolTeacher = (): boolean => {
  try {
    const decodedToken = getDecodedJwt();
    return Boolean(
      decodedToken?.role === "tutor" && decodedToken?.esolTeacherApproved,
    );
  } catch {
    return false;
  }
};

export const syncAuthData = (data: {
  accessToken: string;
  refreshToken?: string;
  user: any;
}) => {
  localStorage.setItem("token", data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  localStorage.setItem("user", JSON.stringify(data.user));
  window.dispatchEvent(new Event("userUpdated"));
};
