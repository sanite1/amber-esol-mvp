import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useListLearners } from "../../lib/api/esolLearner";
import {
  ESOL_LEVELS,
  formatDate,
  fundingStatusLabel,
} from "../../lib/utils/esolHelpers";
import type { FundingStatus } from "../../lib/types/esol";

const PER_PAGE = 15;

export default function OrgLearners() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [fundingFilter, setFundingFilter] = useState<FundingStatus | "">("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, levelFilter, fundingFilter]);

  const { data, isLoading } = useListLearners({
    page,
    limit: PER_PAGE,
    search: debouncedSearch || undefined,
    esolLevel: levelFilter || undefined,
    fundingStatus: fundingFilter || undefined,
  });

  const learners = data?.data?.learners ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
            Learners
          </h1>
          <p className="text-sm text-[#0B2343]/50 mt-1">
            Manage your organisation's ESOL learners.
          </p>
        </div>
        <Link
          to="/org/invitations"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
        >
          <Plus size={16} /> Invite learner
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/30"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
        >
          <option value="">All levels</option>
          {ESOL_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <select
          value={fundingFilter}
          onChange={(e) =>
            setFundingFilter(e.target.value as FundingStatus | "")
          }
          className="px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
        >
          <option value="">All funding</option>
          <option value="esfa_funded">ESFA-funded</option>
          <option value="self_funded">Self-funded</option>
          <option value="employer_funded">Employer-funded</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2
              size={24}
              className="text-[#ff7c22] animate-spin mx-auto mb-2"
            />
            <p className="text-sm text-[#0B2343]/40">Loading learners…</p>
          </div>
        ) : learners.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#0B2343]/[0.06] bg-[#fafbfc]">
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Learner
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Level
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    L1
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Funding
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Onboarded
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {learners.map((learner) => (
                  <tr
                    key={learner._id}
                    className="border-b border-[#0B2343]/[0.04] last:border-0 hover:bg-[#0B2343]/[0.01] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/org/learners/${learner._id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff7c22] to-[#e56a10] text-white text-xs font-bold flex items-center justify-center">
                          {learner.firstname.charAt(0)}
                          {learner.lastname.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0B2343] group-hover:text-[#ff7c22] transition-colors">
                            {learner.firstname} {learner.lastname}
                          </p>
                          <p className="text-xs text-[#0B2343]/40">
                            {learner.email}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {learner.esolLevel ? (
                        <span className="text-xs font-semibold text-[#0B2343]/70 px-2 py-1 rounded-md bg-[#0B2343]/[0.04]">
                          {learner.esolLevel}
                        </span>
                      ) : (
                        <span className="text-xs text-[#0B2343]/30">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0B2343]/60">
                      {learner.l1Language || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0B2343]/60">
                      {fundingStatusLabel(learner.fundingStatus)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0B2343]/60">
                      {formatDate(learner.esolOnboardedAt)}
                    </td>
                    <td className="px-6 py-4">
                      {learner.verified ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                          Awaiting verification
                        </span>
                      )}
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
              {pagination.total} learners
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

function EmptyState() {
  return (
    <div className="p-12 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
        <Users size={20} className="text-[#0B2343]/30" />
      </div>
      <p className="text-sm font-semibold text-[#0B2343]">No learners found</p>
      <p className="text-xs text-[#0B2343]/40 mt-1">
        Try adjusting your filters, or invite new learners to get started.
      </p>
      <Link
        to="/org/invitations"
        className="inline-block mt-4 px-4 py-2 bg-[#ff7c22] text-white text-xs font-bold rounded-lg hover:bg-[#e56a10] transition-colors"
      >
        Invite a learner
      </Link>
    </div>
  );
}
