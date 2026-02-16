import React, { useState, useEffect, useMemo } from "react";
import { Ticket } from "lucide-react";
import {
  adminTicketsData,
  type AdminTicket,
} from "../../data/admin/adminTicketsData";
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

const priorityOrder: Record<string, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export default function AdminTickets() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [stats, setStats] = useState(adminTicketsData.stats);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatusFilter>("all");
  const [categoryFilter, setCategoryFilter] =
    useState<TicketCategoryFilter>("all");
  const [priorityFilter, setPriorityFilter] =
    useState<TicketPriorityFilter>("all");
  const [userFilter, setUserFilter] = useState<TicketUserFilter>("all");
  const [sort, setSort] = useState<TicketSort>("newest");
  const [page, setPage] = useState(1);

  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(
    null
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setTickets(adminTicketsData.tickets);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, categoryFilter, priorityFilter, userFilter, sort]);

  // Process
  const processed = useMemo(() => {
    let result = [...tickets];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.submitterName.toLowerCase().includes(q) ||
          t.submitterEmail.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.messages.some((m) => m.message.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    if (userFilter !== "all") {
      result = result.filter((t) => t.submitterType === userFilter);
    }

    switch (sort) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "priority_high":
        result.sort(
          (a, b) =>
            (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
        );
        break;
      case "last_updated":
        result.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
    }

    return result;
  }, [
    tickets,
    search,
    statusFilter,
    categoryFilter,
    priorityFilter,
    userFilter,
    sort,
  ]);

  const totalPages = Math.ceil(processed.length / PER_PAGE);
  const paginated = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Actions ──────────────────────────────────────────

  function handleReply(ticketId: string, message: string) {
    const newMessage = {
      id: `msg-new-${Date.now()}`,
      senderId: "admin-001",
      senderName: "Admin",
      senderType: "admin" as const,
      message,
      createdAt: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              updatedAt: new Date().toISOString(),
              status: t.status === "open" ? ("in_progress" as const) : t.status,
            }
          : t
      )
    );

    setSelectedTicket((prev) => {
      if (!prev || prev.id !== ticketId) return prev;
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
        updatedAt: new Date().toISOString(),
        status: prev.status === "open" ? ("in_progress" as const) : prev.status,
      };
    });

    // Update stats if status changed
    setStats((prev) => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (ticket && ticket.status === "open") {
        return {
          ...prev,
          openTickets: Math.max(0, prev.openTickets - 1),
          inProgressTickets: prev.inProgressTickets + 1,
        };
      }
      return prev;
    });
  }

  function handleChangeStatus(
    ticketId: string,
    newStatus: AdminTicket["status"]
  ) {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              resolvedAt:
                newStatus === "resolved"
                  ? new Date().toISOString()
                  : newStatus === "closed"
                    ? t.resolvedAt || new Date().toISOString()
                    : undefined,
            }
          : t
      )
    );

    setSelectedTicket((prev) => {
      if (!prev || prev.id !== ticketId) return prev;
      return {
        ...prev,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        resolvedAt:
          newStatus === "resolved"
            ? new Date().toISOString()
            : newStatus === "closed"
              ? prev.resolvedAt || new Date().toISOString()
              : undefined,
      };
    });

    // Recalculate stats
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;
    const oldStatus = ticket.status;

    setStats((prev) => {
      const updated = { ...prev };

      // Decrement old
      if (oldStatus === "open")
        updated.openTickets = Math.max(0, updated.openTickets - 1);
      if (oldStatus === "in_progress")
        updated.inProgressTickets = Math.max(0, updated.inProgressTickets - 1);
      if (oldStatus === "awaiting_user")
        updated.awaitingUserTickets = Math.max(
          0,
          updated.awaitingUserTickets - 1
        );
      if (oldStatus === "resolved")
        updated.resolvedTickets = Math.max(0, updated.resolvedTickets - 1);
      if (oldStatus === "closed")
        updated.closedTickets = Math.max(0, updated.closedTickets - 1);

      // Increment new
      if (newStatus === "open") updated.openTickets += 1;
      if (newStatus === "in_progress") updated.inProgressTickets += 1;
      if (newStatus === "awaiting_user") updated.awaitingUserTickets += 1;
      if (newStatus === "resolved") updated.resolvedTickets += 1;
      if (newStatus === "closed") updated.closedTickets += 1;

      return updated;
    });
  }

  function handleChangePriority(
    ticketId: string,
    newPriority: AdminTicket["priority"]
  ) {
    const ticket = tickets.find((t) => t.id === ticketId);
    const wasPriorityUrgent = ticket?.priority === "urgent";
    const isNowUrgent = newPriority === "urgent";

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, priority: newPriority, updatedAt: new Date().toISOString() }
          : t
      )
    );

    setSelectedTicket((prev) => {
      if (!prev || prev.id !== ticketId) return prev;
      return {
        ...prev,
        priority: newPriority,
        updatedAt: new Date().toISOString(),
      };
    });

    if (wasPriorityUrgent && !isNowUrgent) {
      setStats((prev) => ({
        ...prev,
        urgentTickets: Math.max(0, prev.urgentTickets - 1),
      }));
    } else if (!wasPriorityUrgent && isNowUrgent) {
      setStats((prev) => ({ ...prev, urgentTickets: prev.urgentTickets + 1 }));
    }
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

      {loading ? (
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
            totalCount={processed.length}
          />

          {paginated.length > 0 ? (
            <div className="space-y-2.5 sm:space-y-3">
              {paginated.map((ticket) => (
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
            totalPages={totalPages}
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
