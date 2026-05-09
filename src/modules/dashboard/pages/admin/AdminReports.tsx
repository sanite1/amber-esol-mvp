import { useState } from "react";
import { FileText, Download, Loader2, Info } from "lucide-react";
import { useListOrgs } from "../../lib/api/esolOrg";
import { downloadIlrCsv } from "../../lib/api/esolReport";

export default function AdminReports() {
  const { data: orgsData } = useListOrgs({ limit: 100 });
  const orgs = orgsData?.data?.organisations ?? [];

  const [orgId, setOrgId] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !periodStart || !periodEnd) return;
    setDownloading(true);
    try {
      await downloadIlrCsv({
        orgId,
        periodStart: new Date(periodStart).toISOString(),
        periodEnd: new Date(periodEnd).toISOString(),
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          Reports
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1">
          Generate compliance reports for ESFA submission.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#0B2343]/[0.06]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-blue-700" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0B2343]">
                ILR / ESFA learner export
              </h2>
              <p className="text-xs text-[#0B2343]/50 mt-1 leading-relaxed max-w-2xl">
                Generates a CSV containing learner enrolment and delivery data
                for ESFA-funded ESOL provision. Includes ULN, level, hours
                delivered, and funding status.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleDownload} className="p-6 space-y-5">
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
              {orgs.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed">
              The export includes all learners enrolled with the selected
              organisation. Hours delivered are computed from completed
              ESOL-invoiced sessions within the chosen period.
            </p>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-[#0B2343]/[0.06]">
            <button
              type="submit"
              disabled={downloading || !orgId || !periodStart || !periodEnd}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {downloading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Download size={14} /> Download CSV
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
