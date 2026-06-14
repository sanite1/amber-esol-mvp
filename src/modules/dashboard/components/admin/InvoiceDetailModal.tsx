import React, { useState } from "react";
import {
  Loader2,
  AlertCircle,
  Download,
  CheckCircle2,
  Calendar,
  Building2,
  FileText,
} from "lucide-react";
import Modal from "../../../../components/Modal";
import {
  useGetInvoice,
  useMarkInvoicePaid,
  downloadInvoicePdf,
  type OrgInvoiceStatus,
} from "../../lib/api/esolInvoice";
import { formatDate } from "../../lib/utils/esolHelpers";

/**
 * Invoice detail drawer — F9.1.
 *
 * Opens from a row click on OrgInvoices or AdminInvoices. Shows the
 * full invoice (header + line items + totals breakdown + notes) and
 * exposes PDF download + mark-paid (admin only) actions.
 *
 * Backend contract verified:
 *   GET /api/esol/invoices/:id     — useGetInvoice
 *   GET /api/esol/invoices/:id/pdf — downloadInvoicePdf
 *   PATCH /api/esol/invoices/:id/mark-paid — useMarkInvoicePaid (admin)
 *
 * The list `inv.orgId` is sometimes a populated object, sometimes a
 * bare id. The detail endpoint always returns the populated form
 * (verified in esolInvoice.service.ts getInvoiceService). We render
 * both safely.
 */
interface Props {
  open: boolean;
  invoiceId: string | null;
  onClose: () => void;
  /** Set true when the caller is an Amber admin so the mark-paid
   *  button is shown. Org admins never see it (the endpoint refuses
   *  for them either way, but hiding the affordance avoids the
   *  "is this broken?" confusion). */
  showMarkPaid?: boolean;
}

const formatCurrency = (amount: number, currency = "GBP"): string =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);

const STATUS_PILL: Record<OrgInvoiceStatus, string> = {
  draft: "text-[#0B2343]/60 bg-[#0B2343]/[0.06]",
  issued: "text-amber-700 bg-amber-50",
  paid: "text-emerald-700 bg-emerald-50",
  overdue: "text-red-700 bg-red-50",
  cancelled: "text-[#0B2343]/50 bg-[#0B2343]/[0.04]",
};

export default function InvoiceDetailModal({
  open,
  invoiceId,
  onClose,
  showMarkPaid = false,
}: Props) {
  const { data, isLoading, isError, error } = useGetInvoice(
    open ? (invoiceId ?? undefined) : undefined,
  );
  const { mutate: markPaid, isPending: marking } = useMarkInvoicePaid();
  const [downloading, setDownloading] = useState(false);

  const invoice = data?.data;
  const org =
    invoice && typeof invoice.orgId === "object" ? invoice.orgId : null;

  const handleDownload = async () => {
    if (!invoice) return;
    setDownloading(true);
    try {
      await downloadInvoicePdf(invoice._id, invoice.invoiceNumber);
    } finally {
      setDownloading(false);
    }
  };

  const handleMarkPaid = () => {
    if (!invoice) return;
    if (!window.confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
      return;
    }
    markPaid({ invoiceId: invoice._id, data: {} });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invoice detail"
      titleId="invoice-detail-title"
      size="lg"
      disableEscapeKey={marking}
      disableBackdropClick={marking}
    >
      <Modal.Body>
        {isLoading && (
          <div className="p-12 text-center">
            <Loader2
              size={24}
              aria-hidden="true"
              className="text-[#ff7c22] animate-spin mx-auto mb-2"
            />
            <p className="text-sm text-[#0B2343]/40">Loading invoice…</p>
          </div>
        )}

        {isError && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
            <AlertCircle
              size={18}
              aria-hidden="true"
              className="text-red-500 shrink-0 mt-0.5"
            />
            <p className="text-sm text-red-600">
              {error?.response?.data?.message ??
                error?.message ??
                "Could not load this invoice."}
            </p>
          </div>
        )}

        {invoice && !isLoading && !isError && (
          <>
            <p className="text-sm text-[#0B2343]/70 leading-relaxed mb-4">
              {invoice.invoiceNumber}
            </p>

            <div className="space-y-6">
              {/* Status + total summary */}
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${STATUS_PILL[invoice.status]}`}
                  >
                    {invoice.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#0B2343]/50 uppercase tracking-wider">
                    Total
                  </p>
                  <p className="text-2xl font-extrabold text-[#0B2343]">
                    {formatCurrency(invoice.totalAmount, invoice.currency)}
                  </p>
                </div>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.04]">
                <MetaRow
                  icon={<Building2 size={14} aria-hidden="true" />}
                  label="Organisation"
                  value={org?.name ?? "—"}
                />
                <MetaRow
                  icon={<Calendar size={14} aria-hidden="true" />}
                  label="Period"
                  value={`${formatDate(invoice.periodStart)} — ${formatDate(invoice.periodEnd)}`}
                />
                <MetaRow
                  icon={<Calendar size={14} aria-hidden="true" />}
                  label="Issued"
                  value={invoice.issuedAt ? formatDate(invoice.issuedAt) : "—"}
                />
                <MetaRow
                  icon={<Calendar size={14} aria-hidden="true" />}
                  label="Due"
                  value={invoice.dueAt ? formatDate(invoice.dueAt) : "—"}
                />
                {invoice.paidAt && (
                  <MetaRow
                    icon={<CheckCircle2 size={14} aria-hidden="true" />}
                    label="Paid"
                    value={formatDate(invoice.paidAt)}
                  />
                )}
              </div>

              {/* Line items table */}
              <div>
                <h3 className="text-sm font-extrabold text-[#0B2343] mb-3">
                  Line items
                  <span className="text-xs font-normal text-[#0B2343]/40 ml-2">
                    {invoice.lineItems.length} item
                    {invoice.lineItems.length === 1 ? "" : "s"}
                  </span>
                </h3>
                {invoice.lineItems.length === 0 ? (
                  <p className="text-sm text-[#0B2343]/50 italic">
                    No line items on this invoice.
                  </p>
                ) : (
                  <div className="overflow-x-auto border border-[#0B2343]/[0.06] rounded-xl">
                    <table className="w-full min-w-[480px]">
                      <thead className="bg-[#fafbfc]">
                        <tr className="border-b border-[#0B2343]/[0.06]">
                          <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55 px-3 py-2.5">
                            Description
                          </th>
                          <th className="text-right text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55 px-3 py-2.5">
                            Qty
                          </th>
                          <th className="text-right text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55 px-3 py-2.5">
                            Unit
                          </th>
                          <th className="text-right text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55 px-3 py-2.5">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.lineItems.map((li, idx) => (
                          <tr
                            key={`${li.description}-${idx}`}
                            className="border-b border-[#0B2343]/[0.04] last:border-0"
                          >
                            <td className="align-top px-3 py-3 text-sm text-[#0B2343]">
                              {li.description}
                              {li.bookingIds && li.bookingIds.length > 0 && (
                                <span className="block text-[11px] text-[#0B2343]/40 mt-0.5">
                                  {li.bookingIds.length} booking
                                  {li.bookingIds.length === 1 ? "" : "s"}
                                </span>
                              )}
                            </td>
                            <td className="align-top px-3 py-3 text-sm text-[#0B2343]/70 text-right">
                              {li.quantity}
                            </td>
                            <td className="align-top px-3 py-3 text-sm text-[#0B2343]/70 text-right">
                              {formatCurrency(li.unitPrice, invoice.currency)}
                            </td>
                            <td className="align-top px-3 py-3 text-sm font-semibold text-[#0B2343] text-right">
                              {formatCurrency(li.amount, invoice.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Totals breakdown */}
              <div className="rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.04] p-4 ml-auto max-w-xs">
                <TotalsRow
                  label="Subtotal"
                  value={formatCurrency(invoice.subtotal, invoice.currency)}
                />
                <TotalsRow
                  label={`VAT (${Math.round(invoice.vatRate * 100)}%)`}
                  value={formatCurrency(invoice.vatAmount, invoice.currency)}
                />
                <div className="border-t border-[#0B2343]/[0.08] mt-2 pt-2">
                  <TotalsRow
                    label="Total"
                    value={formatCurrency(
                      invoice.totalAmount,
                      invoice.currency,
                    )}
                    bold
                  />
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div>
                  <h3 className="text-sm font-extrabold text-[#0B2343] mb-2 flex items-center gap-2">
                    <FileText size={14} aria-hidden="true" />
                    Notes
                  </h3>
                  <p className="text-sm text-[#0B2343]/70 whitespace-pre-wrap p-4 rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.04]">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </Modal.Body>
      {invoice && !isLoading && !isError && (
        <Modal.Actions>
          {showMarkPaid &&
            invoice.status !== "paid" &&
            invoice.status !== "cancelled" && (
              <button
                type="button"
                onClick={handleMarkPaid}
                disabled={marking}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 transition-colors"
              >
                {marking ? (
                  <Loader2
                    size={14}
                    aria-hidden="true"
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle2 size={14} aria-hidden="true" />
                )}
                Mark paid
              </button>
            )}
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
          >
            {downloading ? (
              <Loader2 size={14} aria-hidden="true" className="animate-spin" />
            ) : (
              <Download size={14} aria-hidden="true" />
            )}
            Download PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
          >
            Close
          </button>
        </Modal.Actions>
      )}
    </Modal>
  );
}

/* ── Local helpers ─────────────────────────────────────────────── */

const MetaRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    <span className="text-[#0B2343]/40 mt-0.5">{icon}</span>
    <div className="min-w-0">
      <p className="text-[11px] text-[#0B2343]/50 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm text-[#0B2343] font-semibold truncate">{value}</p>
    </div>
  </div>
);

const TotalsRow: React.FC<{
  label: string;
  value: string;
  bold?: boolean;
}> = ({ label, value, bold }) => (
  <div className="flex justify-between text-sm py-1">
    <span
      className={bold ? "font-extrabold text-[#0B2343]" : "text-[#0B2343]/60"}
    >
      {label}
    </span>
    <span
      className={bold ? "font-extrabold text-[#0B2343]" : "text-[#0B2343]/80"}
    >
      {value}
    </span>
  </div>
);
