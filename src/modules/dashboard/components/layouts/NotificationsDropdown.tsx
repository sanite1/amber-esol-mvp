import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Loader2 } from "lucide-react";
import { Notification, NotificationType } from "../../lib/types/notifications";
import {
  useFetchNotifications,
  useFetchUnreadCount,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "../../lib/api/notifications";

/* ── Helper: relative time ── */

const timeAgo = (dateStr: string): string => {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

/* ── Helper: notification route ── */

const getNotificationRoute = (notification: Notification): string | null => {
  const { type, data } = notification;
  const routes: Partial<Record<NotificationType, string | null>> = {
    booking_created: data?.bookingIds?.[0]
      ? `/tutor/lessons`
      : "/tutor/lessons",
    booking_confirmed: "/lessons",
    booking_declined: "/lessons",
    booking_cancelled: "/lessons",
    booking_completed: "/lessons",
    booking_reminder: "/lessons",
    message_received: data?.conversationId
      ? `/messages?chat=${data.conversationId}`
      : "/messages",
    payment_processed: "/payments",
    payment_failed: "/payments",
    refund_processed: "/payments",
    review_posted: "/tutor/reviews",
    review_reply: "/lessons",
    review_reported: "/admin/reviews",
    review_hidden: "/lessons",
    review_restored: "/lessons",
    payout_requested: "/tutor/earnings",
    payout_completed: "/tutor/earnings",
    payout_rejected: "/tutor/earnings",
    account_suspended: null,
    account_reactivated: null,
    system: null,
  };
  return routes[type] ?? null;
};

const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Hooks
  const { data: notificationsData, isLoading } = useFetchNotifications({
    limit: 10,
    sort: "newest",
  });
  const { data: unreadData } = useFetchUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = notificationsData?.data?.notifications ?? [];
  const unreadCount = unreadData?.data?.count ?? 0;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      // Mark as read if unread
      if (!notification.read) {
        markRead.mutate(notification._id);
      }

      // Navigate to relevant page
      const route = getNotificationRoute(notification);
      if (route) {
        navigate(route);
      }

      setOpen(false);
    },
    [markRead, navigate],
  );

  const handleMarkAllRead = useCallback(() => {
    markAllRead.mutate();
  }, [markAllRead]);

  return (
    <div className="relative notifications-dropdown" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
      >
        <Bell size={18} className="text-[#0B2343]/35" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#ff7c22] text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg shadow-[#0B2343]/8 border border-[#0B2343]/[0.06] overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#0B2343]/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#0B2343]">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#ff7c22]/10 text-[#ff7c22]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={markAllRead.isPending}
                    className="text-xs text-[#ff7c22] hover:underline font-medium disabled:opacity-50"
                  >
                    {markAllRead.isPending ? "Marking..." : "Mark all read"}
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2
                    size={20}
                    className="animate-spin text-[#0B2343]/20"
                  />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={24} className="mx-auto text-[#0B2343]/15 mb-2" />
                  <p className="text-xs text-[#0B2343]/35">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left px-4 py-3 hover:bg-[#0B2343]/[0.02] cursor-pointer transition-colors border-b border-[#0B2343]/[0.03] last:border-b-0 ${
                      !notification.read ? "bg-[#ff7c22]/[0.03]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {!notification.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff7c22] mt-1.5 shrink-0" />
                      )}
                      <div className={!notification.read ? "" : "ml-4"}>
                        <p className="text-sm font-medium text-[#0B2343] leading-snug">
                          {notification.title}
                        </p>
                        <p className="text-xs text-[#0B2343]/45 mt-0.5 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-[#0B2343]/25 mt-1">
                          {timeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            {/* {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-[#0B2343]/[0.06]">
                <button
                  onClick={() => {
                    navigate("/notifications");
                    setOpen(false);
                  }}
                  className="w-full py-1.5 text-xs font-semibold text-[#ff7c22] hover:bg-[#ff7c22]/[0.04] rounded-md transition-colors"
                >
                  View all notifications
                </button>
              </div>
            )} */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown;
