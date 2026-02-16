import { AxiosError } from "axios";

const genericMessage =
  "Something went wrong while trying to connect with the server";

type FieldsMap = Record<string, string>;

const handleApiError = (
  error: AxiosError<any> | unknown,
  fields: FieldsMap = {},
): string => {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[Axios Error]", error, (error as AxiosError)?.response);
  }

  const axiosError = error as AxiosError<any>;

  // ✅ Correct way: data lives under response
  if (!axiosError?.response) {
    return genericMessage;
  }

  const { response } = axiosError;
  const data = response?.data as any;

  switch (response?.status) {
    case 400: {
      const keys = Object.keys(data || {});
      const firstItem = data?.[keys[0]];
      if (Array.isArray(firstItem)) return `${keys[0]}: ${firstItem[0]}`;
      if (typeof firstItem === "string") return firstItem;

      const detailKeys = Object.keys(data?.detail || {});
      if (detailKeys.length) {
        const firstDetail = data?.detail[detailKeys[0]];
        if (Array.isArray(firstDetail))
          return `${detailKeys[0]}: ${firstDetail[0]}`;
        if (typeof firstDetail === "string") return firstDetail;
      }

      const dataErrors = Object.keys(data?.errors || {});
      if (dataErrors.length > 0) {
        const firstError = data?.errors[dataErrors[0]];
        if (Array.isArray(firstError)) {
          return `${fields[dataErrors[0]] || dataErrors[0]}: ${firstError[0]}`;
        }
        if (typeof firstError === "string") return firstError;
      }

      return (
        data?.detail ||
        (data?.error && data?.error[0]?.message) ||
        data?.message ||
        genericMessage
      );
    }
    case 401:
      return (
        data?.detail ||
        (data?.error && data?.error[0]?.message) ||
        data?.message ||
        data?.data ||
        "You are not authorized to perform this action"
      );
    case 404:
      return (
        data?.detail ||
        (data?.error && data?.error[0]?.message) ||
        data?.message ||
        "The resource you are trying to load cannot be found"
      );
    case 409:
      return (
        data?.detail ||
        (data?.error && data?.error[0]?.message) ||
        data?.message ||
        "A duplicate already exists"
      );
    case 500:
      return genericMessage;
    default:
      return (
        data?.detail ||
        (data?.error && data?.error[0]?.message) ||
        data?.message ||
        genericMessage
      );
  }
};

export default handleApiError;
