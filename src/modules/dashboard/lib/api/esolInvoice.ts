import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import { axios } from "../../../../lib/network/axios";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";
import type { PaginatedResponse } from "../types/esol";

/**
 * Status enum from amber-esol-backend/src/models/OrgInvoice.ts.
 *
 * Important — F9.2 audit note: the backend has NO frontend-callable
 * "issue" endpoint (no POST /esol/invoices/:id/issue and no PATCH
 * with status: "issued"). The draft → issued transition happens
 * server-side, driven by `autoGenerateInvoicesCronService` which
 * runs the periodic billing job (see
 *   amber-esol-backend/src/services/esolInvoice.service.ts
 * ). The only client-callable status transitions are:
 *
 *   - useGenerateInvoice → creates a new invoice (initial: "draft")
 *   - useMarkInvoicePaid → moves any non-paid / non-cancelled
 *                          status straight to "paid"
 *
 * If the product ever needs a manual "issue" affordance, add the
 * backend endpoint first. The `"issued"` value stays in the enum
 * so the existing list/filter/badge UI handles backend-issued
 * invoices correctly today.
 */
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
