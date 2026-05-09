import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Power,
} from "lucide-react";
import { useListOrgs, useUpdateOrgStatus } from "../../lib/api/esolOrg";
import ProvisionOrgModal from "../../components/admin/orgs/ProvisionOrgModal";
import { formatDate } from "../../lib/utils/esolHelpers";

const PER_PAGE = 15;

export default function AdminOrgs() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading } = useListOrgs({
    page,
    limit: PER_PAGE,
    search: debouncedSearch || undefined,
  });

  const { mutate: toggleStatus } = useUpdateOrgStatus();

  const orgs = data?.data?.organisations ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
            Organisations
          </h1>
          <p className="text-sm text-[#0B2343]/50 mt-1">
            Manage ESOL client organisations on the platform.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
        >
          <Plus size={16} /> Provision organisation
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/30"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug, or contact email…"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2
              size={24}
              className="text-[#ff7c22] animate-spin mx-auto mb-2"
            />
            <p className="text-sm text-[#0B2343]/40">Loading organisations…</p>
          </div>
        ) : orgs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
              <Building2 size={20} className="text-[#0B2343]/30" />
            </div>
            <p className="text-sm font-semibold text-[#0B2343]">
              No organisations yet
            </p>
            <p className="text-xs text-[#0B2343]/40 mt-1">
              Provision your first organisation to begin onboarding ESOL
              learners.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#ff7c22] text-white text-xs font-bold rounded-lg hover:bg-[#e56a10] transition-colors"
            >
              <Plus size={14} /> Provision organisation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#0B2343]/[0.06] bg-[#fafbfc]">
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Organisation
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Contact
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Payment
                  </th>
                  <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                    Created
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
                {orgs.map((org) => {
                  const adminUser =
                    typeof org.adminUserId === "object"
                      ? org.adminUserId
                      : null;
                  return (
                    <tr
                      key={org._id}
                      className="border-b border-[#0B2343]/[0.04] last:border-0 hover:bg-[#0B2343]/[0.01] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center">
                            <Building2
                              size={16}
                              className="text-[#0B2343]/60"
                            />
                          </div>
                          <div>
                            <Link
                              to={`/admin/orgs/${org._id}`}
                              className="text-sm font-semibold text-[#0B2343] hover:text-[#ff7c22] transition-colors"
                            >
                              {org.name}
                            </Link>
                            <p className="text-xs text-[#0B2343]/40">
                              @{org.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#0B2343]/70">
                          {adminUser
                            ? `${adminUser.firstname} ${adminUser.lastname}`
                            : org.contactName}
                        </p>
                        <p className="text-xs text-[#0B2343]/40">
                          {adminUser ? adminUser.email : org.contactEmail}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className="font-semibold text-[#0B2343]/70">
                          {org.paymentModel === "invoiced"
                            ? "Invoiced"
                            : "Stripe"}
                        </span>
                        <span className="text-[#0B2343]/40">
                          {" · "}
                          {org.invoiceCycle}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#0B2343]/50">
                        {formatDate(org.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                            org.isActive
                              ? "text-emerald-700 bg-emerald-50"
                              : "text-red-700 bg-red-50"
                          }`}
                        >
                          {org.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            toggleStatus({
                              orgId: org._id,
                              isActive: !org.isActive,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0B2343]/[0.08] text-xs font-bold text-[#0B2343]/60 rounded-lg hover:bg-[#0B2343]/[0.02] transition-colors"
                          title={org.isActive ? "Deactivate" : "Activate"}
                        >
                          <Power size={12} />
                          {org.isActive ? "Deactivate" : "Activate"}
                        </button>
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
              {pagination.total} organisations
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

      <ProvisionOrgModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
