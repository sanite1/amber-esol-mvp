import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Transaction,
  Wallet,
  Payout,
  PaymentMethod,
  CreatePaymentIntentPayload,
  CreatePaymentIntentResponse,
  RequestPayoutPayload,
  RefundPayload,
  FlagTransactionPayload,
  AddPaymentMethodPayload,
  ApprovePayoutPayload,
  RejectPayoutPayload,
  CompletePayoutPayload,
  TransactionFilters,
  PayoutFilters,
  MonthlyChartQuery,
  ListTransactionsResponse,
  PaymentSummaryResponse,
  ListPayoutsResponse,
  MonthlyChartResponse,
} from "../types/payment";

/* ──────────────────────────────────────────────
   Helper: extract error message
   ────────────────────────────────────────────── */

const getErrorMessage = (
  error: ApiError,
  fallback = "Something went wrong. Please try again."
): string => {
  return (
    error.response?.data?.fields?.[0]?.message ||
    error.response?.data?.message ||
    fallback
  );
};

/* ═══════════════════════════════════════════════
   CREATE PAYMENT INTENT
   POST /api/payments/create-intent
   ═══════════════════════════════════════════════ */

export const createPaymentIntent = async (
  payload: CreatePaymentIntentPayload
): Promise<ApiResponse<CreatePaymentIntentResponse>> => {
  const res = await api.post<ApiResponse<CreatePaymentIntentResponse>>(
    "/payments/create-intent",
    payload
  );
  return res;
};

export const useCreatePaymentIntent = () => {
  return useMutation<
    ApiResponse<CreatePaymentIntentResponse>,
    ApiError,
    CreatePaymentIntentPayload
  >({
    mutationFn: createPaymentIntent,
    onError: (error: ApiError) => {
      toast.error("Payment Failed", {
        description: getErrorMessage(error, "Failed to create payment intent."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   LIST TRANSACTIONS
   GET /api/payments/transactions
   ═══════════════════════════════════════════════ */

export const fetchTransactions = async (
  filters: TransactionFilters
): Promise<ApiResponse<ListTransactionsResponse>> => {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.status) params.append("status", filters.status);
  if (filters.type) params.append("type", filters.type);
  if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.append("dateTo", filters.dateTo);
  if (filters.search) params.append("search", filters.search);
  if (filters.sort) params.append("sort", filters.sort);

  const res = await api.get<ApiResponse<ListTransactionsResponse>>(
    `/payments/transactions?${params.toString()}`
  );
  return res;
};

export const useFetchTransactions = (filters: TransactionFilters) => {
  return useQuery<ApiResponse<ListTransactionsResponse>, ApiError>({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
    placeholderData: (prev) => prev,
  });
};

/* ═══════════════════════════════════════════════
   GET TRANSACTION BY ID
   GET /api/payments/transactions/:id
   ═══════════════════════════════════════════════ */

export const fetchTransactionById = async (
  id: string
): Promise<ApiResponse<Transaction>> => {
  const res = await api.get<ApiResponse<Transaction>>(
    `/payments/transactions/${id}`
  );
  return res;
};

export const useFetchTransactionById = (id: string) => {
  return useQuery<ApiResponse<Transaction>, ApiError>({
    queryKey: ["transaction", id],
    queryFn: () => fetchTransactionById(id),
    enabled: !!id,
  });
};

/* ═══════════════════════════════════════════════
   PAYMENT SUMMARY
   GET /api/payments/summary
   ═══════════════════════════════════════════════ */

export const fetchPaymentSummary = async (): Promise<
  ApiResponse<PaymentSummaryResponse>
> => {
  const res =
    await api.get<ApiResponse<PaymentSummaryResponse>>("/payments/summary");
  return res;
};

export const useFetchPaymentSummary = () => {
  return useQuery<ApiResponse<PaymentSummaryResponse>, ApiError>({
    queryKey: ["paymentSummary"],
    queryFn: fetchPaymentSummary,
  });
};

/* ═══════════════════════════════════════════════
   WALLET (tutor)
   GET /api/payments/wallet
   ═══════════════════════════════════════════════ */

export const fetchWallet = async (): Promise<ApiResponse<Wallet>> => {
  const res = await api.get<ApiResponse<Wallet>>("/payments/wallet");
  return res;
};

export const useFetchWallet = () => {
  return useQuery<ApiResponse<Wallet>, ApiError>({
    queryKey: ["wallet"],
    queryFn: fetchWallet,
  });
};

/* ═══════════════════════════════════════════════
   REQUEST PAYOUT (tutor)
   POST /api/payments/payouts
   ═══════════════════════════════════════════════ */

export const requestPayout = async (
  payload: RequestPayoutPayload
): Promise<ApiResponse<Payout>> => {
  const res = await api.post<ApiResponse<Payout>>("/payments/payouts", payload);
  return res;
};

export const useRequestPayout = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Payout>, ApiError, RequestPayoutPayload>({
    mutationFn: requestPayout,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["payouts"] });

      toast.success("Payout Requested", {
        description:
          response.message ||
          "Your payout request has been submitted for review.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Payout Request Failed", {
        description: getErrorMessage(
          error,
          "Failed to request payout. Please try again."
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   LIST PAYOUTS
   GET /api/payments/payouts
   ═══════════════════════════════════════════════ */

export const fetchPayouts = async (
  filters: PayoutFilters
): Promise<ApiResponse<ListPayoutsResponse>> => {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.status) params.append("status", filters.status);
  if (filters.sort) params.append("sort", filters.sort);

  const res = await api.get<ApiResponse<ListPayoutsResponse>>(
    `/payments/payouts?${params.toString()}`
  );
  return res;
};

export const useFetchPayouts = (filters: PayoutFilters) => {
  return useQuery<ApiResponse<ListPayoutsResponse>, ApiError>({
    queryKey: ["payouts", filters],
    queryFn: () => fetchPayouts(filters),
    placeholderData: (prev) => prev,
  });
};

/* ═══════════════════════════════════════════════
   APPROVE PAYOUT (admin)
   PATCH /api/payments/payouts/:id/approve
   ═══════════════════════════════════════════════ */

export const approvePayout = async (
  id: string,
  payload: ApprovePayoutPayload
): Promise<ApiResponse<Payout>> => {
  const res = await api.patch<ApiResponse<Payout>>(
    `/payments/payouts/${id}/approve`,
    payload
  );
  return res;
};

export const useApprovePayout = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Payout>,
    ApiError,
    { id: string; payload: ApprovePayoutPayload }
  >({
    mutationFn: ({ id, payload }) => approvePayout(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
      toast.success("Payout Approved", {
        description: response.message || "Payout is now processing.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Approval Failed", {
        description: getErrorMessage(error, "Failed to approve payout."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   REJECT PAYOUT (admin)
   PATCH /api/payments/payouts/:id/reject
   ═══════════════════════════════════════════════ */

export const rejectPayout = async (
  id: string,
  payload: RejectPayoutPayload
): Promise<ApiResponse<Payout>> => {
  const res = await api.patch<ApiResponse<Payout>>(
    `/payments/payouts/${id}/reject`,
    payload
  );
  return res;
};

export const useRejectPayout = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Payout>,
    ApiError,
    { id: string; payload: RejectPayoutPayload }
  >({
    mutationFn: ({ id, payload }) => rejectPayout(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Payout Rejected", {
        description:
          response.message || "Funds have been returned to the tutor.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Rejection Failed", {
        description: getErrorMessage(error, "Failed to reject payout."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   COMPLETE PAYOUT (admin)
   PATCH /api/payments/payouts/:id/complete
   ═══════════════════════════════════════════════ */

export const completePayout = async (
  id: string,
  payload: CompletePayoutPayload
): Promise<ApiResponse<Payout>> => {
  const res = await api.patch<ApiResponse<Payout>>(
    `/payments/payouts/${id}/complete`,
    payload
  );
  return res;
};

export const useCompletePayout = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Payout>,
    ApiError,
    { id: string; payload: CompletePayoutPayload }
  >({
    mutationFn: ({ id, payload }) => completePayout(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
      toast.success("Payout Completed", {
        description: response.message || "Payout has been marked as completed.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Completion Failed", {
        description: getErrorMessage(error, "Failed to complete payout."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   REFUND TRANSACTION
   POST /api/payments/refund/:transactionId
   ═══════════════════════════════════════════════ */

export const refundTransaction = async (
  transactionId: string,
  payload: RefundPayload
): Promise<ApiResponse<Transaction>> => {
  const res = await api.post<ApiResponse<Transaction>>(
    `/payments/refund/${transactionId}`,
    payload
  );
  return res;
};

export const useRefundTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Transaction>,
    ApiError,
    { transactionId: string; payload: RefundPayload }
  >({
    mutationFn: ({ transactionId, payload }) =>
      refundTransaction(transactionId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      queryClient.invalidateQueries({ queryKey: ["paymentSummary"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });

      toast.success("Refund Issued", {
        description: response.message || "The refund has been processed.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Refund Failed", {
        description: getErrorMessage(error, "Failed to process refund."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   FLAG TRANSACTION (admin)
   PATCH /api/payments/transactions/:id/flag
   ═══════════════════════════════════════════════ */

export const flagTransaction = async (
  id: string,
  payload: FlagTransactionPayload
): Promise<ApiResponse<Transaction>> => {
  const res = await api.patch<ApiResponse<Transaction>>(
    `/payments/transactions/${id}/flag`,
    payload
  );
  return res;
};

export const useFlagTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Transaction>,
    ApiError,
    { id: string; payload: FlagTransactionPayload }
  >({
    mutationFn: ({ id, payload }) => flagTransaction(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction"] });

      toast.success("Transaction Updated", {
        description: response.message,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   PAYMENT METHODS
   ═══════════════════════════════════════════════ */

export const fetchPaymentMethods = async (): Promise<
  ApiResponse<PaymentMethod[]>
> => {
  const res = await api.get<ApiResponse<PaymentMethod[]>>("/payments/methods");
  return res;
};

export const useFetchPaymentMethods = () => {
  return useQuery<ApiResponse<PaymentMethod[]>, ApiError>({
    queryKey: ["paymentMethods"],
    queryFn: fetchPaymentMethods,
  });
};

export const addPaymentMethod = async (
  payload: AddPaymentMethodPayload
): Promise<ApiResponse<PaymentMethod>> => {
  const res = await api.post<ApiResponse<PaymentMethod>>(
    "/payments/methods",
    payload
  );
  return res;
};

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PaymentMethod>,
    ApiError,
    AddPaymentMethodPayload
  >({
    mutationFn: addPaymentMethod,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success("Payment Method Added", {
        description: response.message || "Your payment method has been saved.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to Add", {
        description: getErrorMessage(error),
      });
    },
  });
};

export const removePaymentMethod = async (
  id: string
): Promise<ApiResponse<void>> => {
  const res = await api.delete<ApiResponse<void>>(`/payments/methods/${id}`);
  return res;
};

export const useRemovePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: removePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success("Payment Method Removed");
    },
    onError: (error: ApiError) => {
      toast.error("Removal Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

export const setDefaultPaymentMethod = async (
  id: string
): Promise<ApiResponse<PaymentMethod>> => {
  const res = await api.patch<ApiResponse<PaymentMethod>>(
    `/payments/methods/${id}/default`
  );
  return res;
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<PaymentMethod>, ApiError, string>({
    mutationFn: setDefaultPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success("Default Updated");
    },
    onError: (error: ApiError) => {
      toast.error("Update Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   MONTHLY CHART
   GET /api/payments/chart/monthly
   ═══════════════════════════════════════════════ */

export const fetchMonthlyChart = async (
  query?: MonthlyChartQuery
): Promise<ApiResponse<MonthlyChartResponse>> => {
  const params = new URLSearchParams();
  if (query?.year) params.append("year", String(query.year));
  if (query?.months) params.append("months", String(query.months));

  const res = await api.get<ApiResponse<MonthlyChartResponse>>(
    `/payments/chart/monthly?${params.toString()}`
  );
  return res;
};

export const useFetchMonthlyChart = (query?: MonthlyChartQuery) => {
  return useQuery<ApiResponse<MonthlyChartResponse>, ApiError>({
    queryKey: ["monthlyChart", query?.year, query?.months],
    queryFn: () => fetchMonthlyChart(query),
  });
};
