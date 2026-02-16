import Axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";

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
