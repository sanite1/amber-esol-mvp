import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import { axios } from "../../../../lib/network/axios";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";
import type { PaginatedResponse } from "../types/esol";

export type OrgInvoiceStatus =
  | "draft"
  | "issued"
  | "paid"
  | "overdue"
  | "cancelled";

export interface OrgInvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  bookingIds?: string[];
}

export interface OrgInvoice {
  _id: string;
  orgId: string | { _id: string; name: string; slug: string };
  invoiceNumber: string;
  periodStart: string;
  periodEnd: string;
  lineItems: OrgInvoiceLineItem[];
  subtotal: number;
  vatAmount: number;
  vatRate: number;
  totalAmount: number;
  currency: string;
  status: OrgInvoiceStatus;
  issuedAt?: string | null;
  dueAt?: string | null;
  paidAt?: string | null;
  pdfUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceListResponse extends PaginatedResponse<OrgInvoice> {
  invoices: OrgInvoice[];
}

export interface GenerateInvoiceRequest {
  orgId: string;
  periodStart: string;
  periodEnd: string;
  notes?: string;
}

export interface ListInvoicesQuery {
  page?: number;
  limit?: number;
  status?: OrgInvoiceStatus;
  orgId?: string;
}

/* ── Generate invoice (admin) ── */

export const useGenerateInvoice = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<OrgInvoice>, ApiError, GenerateInvoiceRequest>(
    {
      mutationFn: (data) =>
        api.post<ApiResponse<OrgInvoice>>("/esol/invoices/generate", data),
      onSuccess: (res) => {
        toast.success(res.message || "Invoice generated");
        qc.invalidateQueries({ queryKey: ["esolInvoices"] });
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Failed to generate invoice",
        );
      },
    },
  );
};

/* ── List invoices ── */

export const useListInvoices = (query?: ListInvoicesQuery) => {
  return useQuery<ApiResponse<InvoiceListResponse>, ApiError>({
    queryKey: [
      "esolInvoices",
      query?.page,
      query?.limit,
      query?.status,
      query?.orgId,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", String(query.page));
      if (query?.limit) params.append("limit", String(query.limit));
      if (query?.status) params.append("status", query.status);
      if (query?.orgId) params.append("orgId", query.orgId);
      const qs = params.toString();
      return api.get<ApiResponse<InvoiceListResponse>>(
        `/esol/invoices${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
  });
};

/* ── Get single invoice ── */

export const useGetInvoice = (invoiceId: string | undefined) => {
  return useQuery<ApiResponse<OrgInvoice>, ApiError>({
    queryKey: ["esolInvoice", invoiceId],
    queryFn: () =>
      api.get<ApiResponse<OrgInvoice>>(`/esol/invoices/${invoiceId}`),
    enabled: Boolean(invoiceId),
  });
};

/* ── Mark invoice paid (admin) ── */

export const useMarkInvoicePaid = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<OrgInvoice>,
    ApiError,
    { invoiceId: string; data: { paidAt?: string; notes?: string } }
  >({
    mutationFn: ({ invoiceId, data }) =>
      api.patch<ApiResponse<OrgInvoice>>(
        `/esol/invoices/${invoiceId}/mark-paid`,
        data,
      ),
    onSuccess: (res, vars) => {
      toast.success(res.message || "Invoice marked as paid");
      qc.invalidateQueries({ queryKey: ["esolInvoices"] });
      qc.invalidateQueries({ queryKey: ["esolInvoice", vars.invoiceId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to mark as paid");
    },
  });
};

/* ── Download PDF ── */

export const downloadInvoicePdf = async (
  invoiceId: string,
  invoiceNumber: string,
) => {
  try {
    const response = await axios.get(`/esol/invoices/${invoiceId}/pdf`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to download invoice");
  }
};
