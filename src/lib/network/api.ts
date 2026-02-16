import { AxiosResponse } from "axios";

import { axios } from "./axios";
import { requestQueue } from "./request-queue";

const api = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    return requestQueue.addTask(async () => {
      const response: AxiosResponse<T> = await axios.get(url, { params });
      return response.data;
    });
  },
  post: async <T>(url: string, data: any, headers?: any): Promise<T> => {
    return requestQueue.addTask(async () => {
      const response: AxiosResponse<T> = await axios.post(url, data, headers);
      return response.data;
    });
  },
  delete: async <T>(url: string, data?: any): Promise<T> => {
    return requestQueue.addTask(async () => {
      const response: AxiosResponse<T> = await axios.delete(url, data);
      return response.data;
    });
  },
  patch: async <T>(url: string, data?: any, headers?: any): Promise<T> => {
    return requestQueue.addTask(async () => {
      const response: AxiosResponse<T> = await axios.patch(url, data, headers);
      return response.data;
    });
  },
  put: async <T>(url: string, data?: any, headers?: any): Promise<T> => {
    return requestQueue.addTask(async () => {
      const response: AxiosResponse<T> = await axios.put(url, data, headers);
      return response.data;
    });
  },
};

export default api;
