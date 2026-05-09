import React, { useState, useEffect } from "react";
import { Ticket } from "lucide-react";
import {
  useFetchAdminTickets,
  useAdminReplyTicket,
  useUpdateTicketStatus,
  useUpdateTicketPriority,
} from "../../lib/api/adminTickets";
import type { AdminTicket } from "../../lib/types/adminTickets";
import { TicketsPageSkeleton } from "../../components/admin/tickets/TicketsSkeleton";
import TicketsStatsRow from "../../components/admin/tickets/TicketsStatsRow";
import TicketsFilterBar, {
  type TicketStatusFilter,
  type TicketCategoryFilter,
  type TicketPriorityFilter,
  type TicketUserFilter,
  type TicketSort,
} from "../../components/admin/tickets/TicketsFilterBar";
import TicketCard from "../../components/admin/tickets/TicketCard";
import TicketDetailModal from "../../components/admin/tickets/TicketDetailModal";
import TicketsPagination from "../../components/admin/tickets/TicketsPagination";

const PER_PAGE = 8;

export default function AdminTickets() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatusFilter>("all");
  const [categoryFilter, setCategoryFilter] =
    useState<TicketCategoryFilter>("all");
  const [priorityFilter, setPriorityFilter] =
    useState<TicketPriorityFilter>("all");
  const [userFilter, setUserFilter] = useState<TicketUserFilter>("all");
  const [sort, setSort] = useState<TicketSort>("newest");
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(
    null,
  );

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    statusFilter,
    categoryFilter,
    priorityFilter,
    userFilter,
    sort,
  ]);

  // Fetch
  const { data, isLoading } = useFetchAdminTickets({
    page,
    limit: PER_PAGE,
    search: debouncedSearch || undefined,
    status: statusFilter,
    category: categoryFilter,
    priority: priorityFilter,
    submitterType: userFilter,
    sort,
  });

  const replyMutation = useAdminReplyTicket();
  const statusMutation = useUpdateTicketStatus();
  const priorityMutation = useUpdateTicketPriority();

  const tickets = data?.data?.tickets || [];
  const stats = data?.data?.stats || {
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    awaitingUserTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    avgResponseTimeHours: 0,
    avgResolutionTimeHours: 0,
    ticketsThisWeek: 0,
    studentTickets: 0,
    tutorTickets: 0,
    urgentTickets: 0,
  };
  const pagination = data?.data?.pagination || {
    page: 1,
    limit: PER_PAGE,
    total: 0,
    totalPages: 1,
  };

  // ── Handlers ──

  function handleReply(ticketId: string, message: string) {
    replyMutation.mutate(
      { ticketId, message },
      {
        onSuccess: (res) => {
          // Update selected ticket with new data
          if (res.data) {
            const updated = res.data as any;
            setSelectedTicket((prev) => {
              if (!prev || prev.id !== ticketId) return prev;
              return {
                ...prev,
                messages: (updated.messages || []).map((m: any) => ({
                  id: (m._id || m.id || "").toString(),
                  senderId: m.senderId?.toString() || "",
                  senderName: m.senderName,
                  senderType: m.senderType,
                  message: m.message,
                  createdAt:
                    m.createdAt instanceof Date
                      ? m.createdAt.toISOString()
                      : m.createdAt || new Date().toISOString(),
                  attachments: m.attachments || [],
                })),
                status: updated.status || prev.status,
                updatedAt: updated.updatedAt || new Date().toISOString(),
              };
            });
          }
        },
      },
    );
  }

  function handleChangeStatus(
    ticketId: string,
    newStatus: AdminTicket["status"],
  ) {
    statusMutation.mutate(
      { ticketId, status: newStatus },
      {
        onSuccess: (res) => {
          setSelectedTicket((prev) => {
            if (!prev || prev.id !== ticketId) return prev;
            return {
              ...prev,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              resolvedAt: (res.data as any)?.resolvedAt || prev.resolvedAt,
            };
          });
        },
      },
    );
  }

  function handleChangePriority(
    ticketId: string,
    newPriority: AdminTicket["priority"],
  ) {
    priorityMutation.mutate(
      { ticketId, priority: newPriority },
      {
        onSuccess: () => {
          setSelectedTicket((prev) => {
            if (!prev || prev.id !== ticketId) return prev;
            return {
              ...prev,
              priority: newPriority,
              updatedAt: new Date().toISOString(),
            };
          });
        },
      },
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/[0.06] flex items-center justify-center">
          <Ticket size={18} className="text-[#0B2343]/60" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
            Support Tickets
          </h1>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/50">
            View and respond to support requests from students and tutors
          </p>
        </div>
      </div>

      {isLoading ? (
        <TicketsPageSkeleton />
      ) : (
        <>
          <TicketsStatsRow stats={stats} />

          <TicketsFilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            userFilter={userFilter}
            onUserChange={setUserFilter}
            sort={sort}
            onSortChange={setSort}
            totalCount={pagination.total}
          />

          {tickets.length > 0 ? (
            <div className="space-y-2.5 sm:space-y-3">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={setSelectedTicket}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] py-12 sm:py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#0B2343]/[0.04] flex items-center justify-center mx-auto mb-3">
                <Ticket size={20} className="text-[#0B2343]/30" />
              </div>
              <p className="text-sm font-medium text-[#0B2343]/60 mb-1">
                No tickets found
              </p>
              <p className="text-xs text-[#0B2343]/40">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}

          <TicketsPagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onReply={handleReply}
          onChangeStatus={handleChangeStatus}
          onChangePriority={handleChangePriority}
        />
      )}
    </div>
  );
}
