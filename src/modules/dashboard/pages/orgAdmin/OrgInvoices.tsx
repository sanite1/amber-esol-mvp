import { useEffect, useState } from "react";
import {
  Receipt,
  Loader2,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  useListInvoices,
  downloadInvoicePdf,
  type OrgInvoiceStatus,
} from "../../lib/api/esolInvoice";
import { formatDate } from "../../lib/utils/esolHelpers";

const PER_PAGE = 20;

const formatCurrency = (amount: number, currency = "GBP"): string =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);

export default function OrgInvoices() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrgInvoiceStatus | "all">(
    "all",
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const { data, isLoading } = useListInvoices({
    page,
    limit: PER_PAGE,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

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
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          Invoices
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1">
          Your organisation's ESOL invoices.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 flex items-center gap-3">
        <Filter size={14} className="text-[#0B2343]/50" />
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
              No invoices yet
            </p>
            <p className="text-xs text-[#0B2343]/40 mt-1">
              Invoices appear here once your organisation has billable activity.
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
                    Period
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Issued
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Due
                  </th>
                  <th className="text-right text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Total
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-right text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv._id}
                    className="border-b border-[#0B2343]/[0.04] last:border-0 hover:bg-[#0B2343]/[0.01] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#0B2343]">
                        {inv.invoiceNumber}
                      </p>
                      <p className="text-xs text-[#0B2343]/40">
                        {inv.lineItems.length} line item
                        {inv.lineItems.length === 1 ? "" : "s"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#0B2343]/60">
                      {formatDate(inv.periodStart)} —{" "}
                      {formatDate(inv.periodEnd)}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#0B2343]/60">
                      {formatDate(inv.issuedAt)}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#0B2343]/60">
                      {formatDate(inv.dueAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#0B2343] text-right">
                      {formatCurrency(inv.totalAmount, inv.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
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
                    </td>
                  </tr>
                ))}
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
