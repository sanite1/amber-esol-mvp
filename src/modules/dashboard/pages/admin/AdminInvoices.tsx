import { useEffect, useState } from "react";
import {
  Receipt,
  Loader2,
  Download,
  CheckCircle2,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";
import {
  useListInvoices,
  useGenerateInvoice,
  useMarkInvoicePaid,
  downloadInvoicePdf,
  type OrgInvoiceStatus,
} from "../../lib/api/esolInvoice";
import { useListOrgs } from "../../lib/api/esolOrg";
import { formatDate } from "../../lib/utils/esolHelpers";

const PER_PAGE = 20;

const formatCurrency = (amount: number, currency = "GBP"): string =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(
    amount,
  );

export default function AdminInvoices() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrgInvoiceStatus | "all">(
    "all",
  );
  const [orgFilter, setOrgFilter] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, orgFilter]);

  const { data: orgsData } = useListOrgs({ limit: 100 });
  const orgs = orgsData?.data?.organisations ?? [];

  const { data, isLoading } = useListInvoices({
    page,
    limit: PER_PAGE,
    status: statusFilter === "all" ? undefined : statusFilter,
    orgId: orgFilter || undefined,
  });

  const { mutate: markPaid } = useMarkInvoicePaid();

  const invoices = data?.data?.invoices ?? [];
  const pagination = data?.data?.pagination;

  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    setDownloadingId(invoiceId);
    try {
      await downloadInvoicePdf(invoiceId, invoiceNumber);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
            All invoices
          </h1>
          <p className="text-sm text-[#0B2343]/50 mt-1">
            Cross-organisation invoice management.
          </p>
        </div>
        <button
          onClick={() => setGenerateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
        >
          <Plus size={16} /> Generate invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 flex flex-wrap gap-3">
        <select
          value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors min-w-[200px]"
        >
          <option value="">All organisations</option>
          {orgs.map((o) => (
            <option key={o._id} value={o._id}>
              {o.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as OrgInvoiceStatus | "all")
          }
          className="px-4 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="issued">Issued</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2
              size={24}
              className="text-[#ff7c22] animate-spin mx-auto mb-2"
            />
            <p className="text-sm text-[#0B2343]/40">Loading invoices…</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
              <Receipt size={20} className="text-[#0B2343]/30" />
            </div>
            <p className="text-sm font-semibold text-[#0B2343]">
              No invoices found
            </p>
            <p className="text-xs text-[#0B2343]/40 mt-1">
              Try adjusting your filters or generate one manually.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#0B2343]/[0.06] bg-[#fafbfc]">
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Invoice
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Organisation
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Period
                  </th>
                  <th className="text-right text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Total
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-right text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const org = typeof inv.orgId === "object" ? inv.orgId : null;
                  return (
                    <tr
                      key={inv._id}
                      className="border-b border-[#0B2343]/[0.04] last:border-0 hover:bg-[#0B2343]/[0.01] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#0B2343]">
                          {inv.invoiceNumber}
                        </p>
                        <p className="text-xs text-[#0B2343]/40">
                          Issued {formatDate(inv.issuedAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#0B2343]/70">
                        {org?.name ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#0B2343]/60">
                        {formatDate(inv.periodStart)} —{" "}
                        {formatDate(inv.periodEnd)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#0B2343] text-right">
                        {formatCurrency(inv.totalAmount, inv.currency)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <button
                            onClick={() =>
                              handleDownload(inv._id, inv.invoiceNumber)
                            }
                            disabled={downloadingId === inv._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0B2343]/[0.08] text-xs font-bold text-[#0B2343]/60 rounded-lg hover:bg-[#0B2343]/[0.02] disabled:opacity-50 transition-colors"
                          >
                            {downloadingId === inv._id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Download size={12} />
                            )}
                            PDF
                          </button>
                          {inv.status !== "paid" &&
                            inv.status !== "cancelled" && (
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Mark invoice ${inv.invoiceNumber} as paid?`,
                                    )
                                  ) {
                                    markPaid({
                                      invoiceId: inv._id,
                                      data: {},
                                    });
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                              >
                                <CheckCircle2 size={12} /> Mark paid
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-[#0B2343]/[0.06] flex items-center justify-between bg-[#fafbfc]">
            <p className="text-xs text-[#0B2343]/50">
              Page {pagination.page} of {pagination.totalPages} ·{" "}
              {pagination.total} invoices
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-md border border-[#0B2343]/[0.08] disabled:opacity-30 hover:bg-white transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-md border border-[#0B2343]/[0.08] disabled:opacity-30 hover:bg-white transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <GenerateInvoiceModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: OrgInvoiceStatus }) {
  const config = {
    draft: { label: "Draft", classes: "text-[#0B2343]/50 bg-[#0B2343]/[0.04]" },
    issued: { label: "Issued", classes: "text-amber-700 bg-amber-50" },
    paid: { label: "Paid", classes: "text-emerald-700 bg-emerald-50" },
    overdue: { label: "Overdue", classes: "text-red-700 bg-red-50" },
    cancelled: {
      label: "Cancelled",
      classes: "text-[#0B2343]/50 bg-[#0B2343]/[0.04]",
    },
  }[status];

  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${config.classes}`}
    >
      {config.label}
    </span>
  );
}

function GenerateInvoiceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: orgsData } = useListOrgs({ limit: 100 });
  const orgs = orgsData?.data?.organisations ?? [];
  const { mutateAsync: generate, isPending } = useGenerateInvoice();
  const [orgId, setOrgId] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleClose = () => {
    setOrgId("");
    setPeriodStart("");
    setPeriodEnd("");
    setNotes("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await generate({
        orgId,
        periodStart: new Date(periodStart).toISOString(),
        periodEnd: new Date(periodEnd).toISOString(),
        notes: notes || undefined,
      });
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not generate invoice");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#0B2343]/[0.06]">
          <h2 className="text-lg font-extrabold text-[#0B2343]">
            Generate invoice
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={18} className="text-[#0B2343]/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              Organisation
            </label>
            <select
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            >
              <option value="">Select an organisation…</option>
              {orgs
                .filter((o) => o.paymentModel === "invoiced")
                .map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                Period start
              </label>
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                Period end
              </label>
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none resize-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#0B2343]/[0.06]">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-[#0B2343]/[0.08] text-sm font-bold text-[#0B2343]/60 rounded-xl hover:bg-[#0B2343]/[0.02] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Generating…
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
