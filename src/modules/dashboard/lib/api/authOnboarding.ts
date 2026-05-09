import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import Cookies from "js-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import {
  DecodedUser,
  LoginPayload,
  LoginResponse,
  RegisterStudentPayload,
  RegisterTutorPayload,
  RegisterAdminPayload,
  RegisterResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  UpdatePasswordPayload,
  UpdateUserPayload,
  UpdateUserResponse,
  RefreshResponse,
  DeleteAccountPayload,
  UserData,
  TutorFilters,
  TutorListResponse,
} from "../types/authOnboarding";
import {
  getRefreshToken,
  removeAuthToken,
  setAuthToken,
  setRefreshToken,
} from "../auth";

/* ──────────────────────────────────────────────
   Helper: persist tokens & decoded user
   ────────────────────────────────────────────── */

const persistAuth = (accessToken: string, refreshToken?: string) => {
  setAuthToken(accessToken);
  Cookies.set("authToken", accessToken, { expires: 7, path: "/" });

  if (refreshToken) {
    setRefreshToken(refreshToken);
  }

  const decoded: DecodedUser = jwtDecode(accessToken);
  localStorage.setItem("user", JSON.stringify(decoded));
};

/* ──────────────────────────────────────────────
   Helper: extract error message
   ────────────────────────────────────────────── */

const getErrorMessage = (
  error: ApiError,
  fallback = "Something went wrong. Please try again.",
): string => {
  return (
    error.response?.data?.fields?.[0]?.message ||
    error.response?.data?.message ||
    fallback
  );
};

/* ═══════════════════════════════════════════════
   LOGIN
   ═══════════════════════════════════════════════ */

export const login = async (
  payload: LoginPayload,
): Promise<ApiResponse<LoginResponse>> => {
  const res = await api.post<ApiResponse<LoginResponse>>(
    "/users/login",
    payload,
  );
  persistAuth(res.data.accessToken, res.data.refreshToken);
  return res;
};

export const useLogin = () => {
  return useMutation<ApiResponse<LoginResponse>, ApiError, LoginPayload>({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Login Successful", {
        description: "Redirecting you to dashboard...",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Login Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   REGISTER STUDENT
   ═══════════════════════════════════════════════ */

export const registerStudent = async (
  payload: RegisterStudentPayload | FormData,
): Promise<ApiResponse<RegisterResponse>> => {
  const isFormData = payload instanceof FormData;
  const res = await api.post<ApiResponse<RegisterResponse>>(
    "/users/register/student",
    payload,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return res;
};

export const useRegisterStudent = () => {
  return useMutation<
    ApiResponse<RegisterResponse>,
    ApiError,
    RegisterStudentPayload | FormData
  >({
    mutationFn: registerStudent,
    onSuccess: (response) => {
      toast.success("Registration Successful", {
        description: response.message,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Registration Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   REGISTER TUTOR
   ═══════════════════════════════════════════════ */

export const registerTutor = async (
  payload: RegisterTutorPayload | FormData,
): Promise<ApiResponse<RegisterResponse>> => {
  const isFormData = payload instanceof FormData;
  const res = await api.post<ApiResponse<RegisterResponse>>(
    "/users/register/tutor",
    payload,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return res;
};

export const useRegisterTutor = () => {
  return useMutation<
    ApiResponse<RegisterResponse>,
    ApiError,
    RegisterTutorPayload | FormData
  >({
    mutationFn: registerTutor,
    onSuccess: (response) => {
      toast.success("Registration Successful", {
        description: response.message,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Registration Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   REGISTER ADMIN
   ═══════════════════════════════════════════════ */

export const registerAdmin = async (
  payload: RegisterAdminPayload | FormData,
): Promise<ApiResponse<RegisterResponse>> => {
  const isFormData = payload instanceof FormData;
  const res = await api.post<ApiResponse<RegisterResponse>>(
    "/users/register/admin",
    payload,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return res;
};

export const useRegisterAdmin = () => {
  return useMutation<
    ApiResponse<RegisterResponse>,
    ApiError,
    RegisterAdminPayload | FormData
  >({
    mutationFn: registerAdmin,
    onSuccess: (response) => {
      toast.success("Admin Registration Successful", {
        description: response.message,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Registration Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   REFRESH TOKEN
   ═══════════════════════════════════════════════ */

export const refresh = async (): Promise<ApiResponse<RefreshResponse>> => {
  const res = await api.post<ApiResponse<RefreshResponse>>("/users/refresh", {
    token: getRefreshToken(),
  });
  persistAuth(res.data.accessToken);
  return res;
};

export const useRefresh = () => {
  return useMutation<ApiResponse<RefreshResponse>, ApiError>({
    mutationFn: refresh,
    onError: (error: ApiError) => {
      toast.error("Session Expired", {
        description: getErrorMessage(error, "Please log in again."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   VERIFY EMAIL
   ═══════════════════════════════════════════════ */

export const verifyEmail = async (
  id: string,
  token: string,
): Promise<ApiResponse> => {
  const res = await api.get<ApiResponse>(`/users/verify/${id}/${token}`);
  return res;
};

export const useVerifyEmail = () => {
  return useMutation<ApiResponse, ApiError, { id: string; token: string }>({
    mutationFn: ({ id, token }) => verifyEmail(id, token),
    onSuccess: (response) => {
      toast.success("Email Verified", {
        description: response.message,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Verification Failed", {
        description: getErrorMessage(
          error,
          "Verification failed. Please try again.",
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   FORGOT PASSWORD
   ═══════════════════════════════════════════════ */

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<ApiResponse> => {
  const res = await api.post<ApiResponse>("/users/forgot-password", payload);
  return res;
};

export const useForgotPassword = () => {
  return useMutation<ApiResponse, ApiError, ForgotPasswordPayload>({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Reset Link Sent", {
        description:
          "If an account with that email exists, a reset link has been sent.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Request Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   RESET PASSWORD
   ═══════════════════════════════════════════════ */

export const resetPassword = async (
  id: string,
  token: string,
  payload: ResetPasswordPayload,
): Promise<ApiResponse> => {
  const res = await api.patch<ApiResponse>(
    `/users/reset-password/${id}/${token}`,
    payload,
  );
  return res;
};

export const useResetPassword = () => {
  return useMutation<
    ApiResponse,
    ApiError,
    { id: string; token: string; password: string; confirmPassword: string }
  >({
    mutationFn: ({ id, token, password, confirmPassword }) =>
      resetPassword(id, token, { password, confirmPassword }),
    onSuccess: (response) => {
      toast.success("Password Reset Successful", {
        description: response.message,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Reset Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   UPDATE PASSWORD (authenticated)
   ═══════════════════════════════════════════════ */

export const updatePassword = async (
  payload: UpdatePasswordPayload,
): Promise<ApiResponse> => {
  const res = await api.patch<ApiResponse>(`/users/update-password`, payload);
  return res;
};

export const useUpdatePassword = () => {
  return useMutation<
    ApiResponse,
    ApiError,
    {
      oldPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }
  >({
    mutationFn: ({ ...payload }) => updatePassword(payload),
    onSuccess: () => {
      toast.success("Password Updated", {
        description: "Your password has been changed successfully.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Password Update Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   GET USER BY ID
   ═══════════════════════════════════════════════ */

export const fetchUserById = async (id: string): Promise<UserData> => {
  const res = await api.get<ApiResponse<UserData>>(`/users/${id}`);
  return res.data;
};

export const useFetchUserById = (id: string) => {
  return useQuery<UserData, ApiError>({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
};

/* ═══════════════════════════════════════════════
   UPDATE USER PROFILE
   ═══════════════════════════════════════════════ */

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload | FormData,
): Promise<ApiResponse<UpdateUserResponse>> => {
  const isFormData = payload instanceof FormData;
  const res = await api.patch<ApiResponse<UpdateUserResponse>>(
    `/users/${id}`,
    payload,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );

  // Persist new tokens from the response
  persistAuth(res.data.accessToken, res.data.refreshToken);

  // Notify other components that user data changed
  window.dispatchEvent(new Event("userUpdated"));

  return res;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UpdateUserResponse>,
    ApiError,
    { id: string; payload: UpdateUserPayload | FormData }
  >({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: (response, variables) => {
      // Invalidate user query so components refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });

      toast.success("Profile Updated", {
        description: response.message,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Update Failed", {
        description: getErrorMessage(
          error,
          "Failed to update profile. Try again.",
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   GET TUTORS (public listing)
   ═══════════════════════════════════════════════ */

export const fetchTutors = async (
  filters: TutorFilters,
): Promise<ApiResponse<TutorListResponse>> => {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.search) params.append("search", filters.search);
  if (filters.sort) params.append("sort", filters.sort);
  if (filters.language) params.append("language", filters.language);
  if (filters.specialization)
    params.append("specialization", filters.specialization);
  if (filters.minPrice !== undefined)
    params.append("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined)
    params.append("maxPrice", String(filters.maxPrice));
  if (filters.level) params.append("level", filters.level);
  if (filters.trialOnly) params.append("trialOnly", "true");

  const response = await api.get(`/users/tutors?${params.toString()}`);
  return response as ApiResponse<TutorListResponse>;
};

export const useFetchTutors = (filters: TutorFilters) => {
  return useQuery({
    queryKey: ["tutors", filters],
    queryFn: () => fetchTutors(filters),
    placeholderData: (prev) => prev, // keep previous data while loading
  });
};

/* ═══════════════════════════════════════════════
   DELETE ACCOUNT
   ═══════════════════════════════════════════════ */

export const deleteAccount = async (
  id: string,
  payload: DeleteAccountPayload,
): Promise<ApiResponse> => {
  const res = await api.delete<ApiResponse>(`/users/${id}`, {
    data: payload,
  });
  return res;
};

export const useDeleteAccount = () => {
  return useMutation<
    ApiResponse,
    ApiError,
    { id: string; payload: DeleteAccountPayload }
  >({
    mutationKey: ["delete-account"],
    mutationFn: ({ id, payload }) => deleteAccount(id, payload),
    onSuccess: (response) => {
      // Clear all auth data
      removeAuthToken();
      Cookies.remove("authToken");
      localStorage.removeItem("user");

      toast.success("Account Deleted", {
        description: response.message || "Your account has been deleted.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Deletion Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   LOGOUT (client-side only)
   ═══════════════════════════════════════════════ */

export const logout = () => {
  removeAuthToken();
  Cookies.remove("authToken");
  localStorage.removeItem("user");
};
