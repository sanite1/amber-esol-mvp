import { useState } from "react";
import {
  ChevronDown,
  Clock,
  Calendar,
  Video,
  Star,
  MapPin,
  Sparkles,
  FileText,
  AlertTriangle,
  PoundSterling,
  UserX,
  Globe,
  CreditCard,
  MessageSquare,
  CalendarClock,
  GraduationCap,
  ArrowRight,
  Users,
  Target,
  Check,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { TutorLesson } from "../../../data/tutor/tutorLessonsData";
import {
  useCompleteBooking,
  useUpdateMeetingUrl,
} from "../../../lib/api/booking";
import { Link2, Pencil, ExternalLink } from "lucide-react";

interface Props {
  lesson: TutorLesson;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  upcoming: {
    label: "Upcoming",
    color: "text-[#ff7c22]",
    bg: "bg-[#ff7c22]/10",
  },
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-[#ff7c22]",
    bg: "bg-[#ff7c22]/10",
  },
  completed: { label: "Completed", color: "text-green-700", bg: "bg-green-50" },
  cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50" },
  no_show: { label: "No Show", color: "text-amber-700", bg: "bg-amber-50" },
};

const paymentStatusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pending: {
    label: "Payment Pending",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  paid: { label: "Paid", color: "text-green-700", bg: "bg-green-50" },
  refunded: { label: "Refunded", color: "text-blue-700", bg: "bg-blue-50" },
  failed: { label: "Payment Failed", color: "text-red-700", bg: "bg-red-50" },
  free: { label: "Free", color: "text-gray-600", bg: "bg-gray-100" },
};

function formatDateTime(isoStr?: string): string {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TutorLessonCard({
  lesson,
  onAccept,
  onDecline,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [editingMeetingUrl, setEditingMeetingUrl] = useState(false);
  const [meetingUrlInput, setMeetingUrlInput] = useState(
    lesson.meetingUrl || ""
  );
  const updateMeetingUrlMutation = useUpdateMeetingUrl();
  const completeBooking = useCompleteBooking();

  const isPending = lesson.originalStatus === "pending";
  const status =
    statusConfig[isPending ? "pending" : lesson.status] ??
    statusConfig.upcoming;
  const payment = lesson.paymentStatus
    ? (paymentStatusConfig[lesson.paymentStatus] ?? paymentStatusConfig.pending)
    : null;
  const now = new Date();

  const lessonDate = new Date(lesson.date);
  const isToday = lessonDate.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = lessonDate.toDateString() === tomorrow.toDateString();

  const dateLabel = isToday
    ? "Today"
    : isTomorrow
      ? "Tomorrow"
      : lessonDate.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });

  const isJoinable = (() => {
    if (!lesson.meetingUrl || lesson.status !== "upcoming" || isPending)
      return false;
    const ld = new Date(lesson.date);
    const [h, m] = lesson.startTime.split(":").map(Number);
    ld.setHours(h, m, 0, 0);
    const diff = (ld.getTime() - now.getTime()) / 60000;
    return diff <= 15 && diff >= -60;
  })();

  const isCompletable = (() => {
    if (lesson.status !== "upcoming") return false;
    const now = new Date();
    const lessonEnd = new Date(`${lesson.date}T${lesson.endTime}`);
    return lessonEnd < now;
  })();

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onAccept) return;
    setIsAccepting(true);
    onAccept(lesson.id);
    // mutation handles the rest; loading clears on re-render
  };

  const handleDeclineClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeclineInput) {
      if (!onDecline) return;
      setIsDeclining(true);
      onDecline(lesson.id);
    } else {
      setShowDeclineInput(true);
    }
  };

  const handleSaveMeetingUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!meetingUrlInput.trim()) return;
    updateMeetingUrlMutation.mutate(
      { id: lesson.id, meetingUrl: meetingUrlInput.trim() },
      {
        onSuccess: () => {
          setEditingMeetingUrl(false);
        },
      }
    );
  };

  const isProcessing = isAccepting || isDeclining;

  return (
    <div
      className={`rounded-xl border transition-colors ${
        expanded
          ? "border-[#0B2343]/10 bg-white shadow-sm"
          : isPending
            ? "border-[#ff7c22]/20 bg-[#ff7c22]/[0.02]"
            : isJoinable
              ? "border-[#ff7c22]/20 bg-[#ff7c22]/[0.02]"
              : "border-[#0B2343]/[0.06] bg-white hover:border-[#0B2343]/10"
      }`}
    >
      {/* ── Collapsed: Desktop ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="hidden sm:flex w-full items-center gap-3 p-3.5 text-left"
      >
        <div className="w-10 h-10 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0 text-xs font-semibold text-[#0B2343]/50">
          {lesson.studentAvatar ? (
            <img
              src={lesson.studentAvatar}
              alt={lesson.studentName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            lesson.studentName
              .split(" ")
              .map((n) => n[0])
              .join("")
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#0B2343] truncate">
              {lesson.studentName}
            </p>
            <span className="text-[11px] font-medium text-[#0B2343]/50 bg-[#0B2343]/[0.05] px-2 py-0.5 rounded">
              {lesson.studentLevel}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${status.bg} ${status.color}`}
            >
              {status.label}
            </span>
            {lesson.lessonType === "trial" && (
              <span className="flex items-center gap-0.5 text-[11px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-2 py-0.5 rounded">
                <Sparkles size={10} />
                Trial
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-[#0B2343]/50">
            <span>{dateLabel}</span>
            <span>·</span>
            <span>
              {lesson.startTime} – {lesson.endTime}
            </span>
            <span>·</span>
            <span>{lesson.specialty}</span>
            {lesson.earnings > 0 && (
              <>
                <span>·</span>
                <span className="text-green-600 font-semibold">
                  £{lesson.earnings}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isPending && onAccept && (
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleAccept}
                disabled={isProcessing}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isAccepting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Check size={12} />
                )}
                Accept
              </button>
              <button
                onClick={handleDeclineClick}
                disabled={isProcessing}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                {isDeclining ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <X size={12} />
                )}
                Decline
              </button>
            </div>
          )}
          {isJoinable && (
            <a
              href={lesson.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#ff7c22] text-white text-xs font-semibold hover:bg-[#e56a10] transition-colors"
            >
              <Video size={13} />
              Join
            </a>
          )}
          {isCompletable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                completeBooking.mutate(lesson.id);
              }}
              disabled={completeBooking.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 size={12} />
              {completeBooking.isPending ? "Completing..." : "Mark Complete"}
            </button>
          )}

          <ChevronDown
            size={16}
            className={`text-[#0B2343]/30 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* ── Collapsed: Mobile ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex sm:hidden w-full flex-col gap-2.5 p-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0 text-[11px] font-semibold text-[#0B2343]/50">
            {lesson.studentAvatar ? (
              <img
                src={lesson.studentAvatar}
                alt={lesson.studentName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              lesson.studentName
                .split(" ")
                .map((n) => n[0])
                .join("")
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-semibold text-[#0B2343] truncate">
                {lesson.studentName}
              </p>
              <span className="text-[10px] font-medium text-[#0B2343]/50 bg-[#0B2343]/[0.05] px-1.5 py-0.5 rounded">
                {lesson.studentLevel}
              </span>
              {lesson.lessonType === "trial" && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-1.5 py-0.5 rounded">
                  <Sparkles size={9} />
                  Trial
                </span>
              )}
            </div>
            <p className="text-xs text-[#0B2343]/45 mt-0.5">
              {lesson.specialty}
            </p>
          </div>
          <ChevronDown
            size={15}
            className={`text-[#0B2343]/30 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>

        <div className="flex items-center justify-between ml-[46px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${status.bg} ${status.color}`}
            >
              {status.label}
            </span>
            <span className="text-xs text-[#0B2343]/45">
              {dateLabel} · {lesson.startTime}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {lesson.earnings > 0 && (
              <span className="text-xs font-semibold text-green-600">
                £{lesson.earnings}
              </span>
            )}
          </div>
        </div>

        {/* Mobile pending actions */}
        {isPending && onAccept && (
          <div
            className="flex gap-2 ml-[46px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isAccepting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Check size={12} />
              )}
              Accept
            </button>
            <button
              onClick={handleDeclineClick}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {isDeclining ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <X size={12} />
              )}
              Decline
            </button>
          </div>
        )}
      </button>

      {/* ── Expanded details ── */}
      {expanded && (
        <div className="px-3.5 pb-3.5 pt-0">
          <div className="border-t border-[#0B2343]/[0.06] pt-3.5 space-y-3.5">
            {/* Decline reason input */}
            {showDeclineInput && isPending && (
              <div className="p-3 rounded-lg bg-red-50/60 border border-red-200/60">
                <p className="text-xs font-semibold text-red-600 mb-2">
                  Reason for declining
                </p>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Schedule conflict, not available…"
                  className="w-full rounded-lg border border-red-200 bg-white p-2.5 text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/30 outline-none focus:border-red-300 resize-none"
                  rows={2}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeclining(true);
                      onDecline?.(lesson.id);
                    }}
                    disabled={isDeclining}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {isDeclining ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <X size={11} />
                    )}
                    Confirm Decline
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeclineInput(false);
                      setDeclineReason("");
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#0B2343]/10 text-xs text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Student & Lesson info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
              <div className="flex items-center gap-2 text-xs text-[#0B2343]/60">
                <MapPin size={13} className="text-[#0B2343]/30 shrink-0" />
                <span>{lesson.country || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#0B2343]/60">
                <Calendar size={13} className="text-[#0B2343]/30 shrink-0" />
                <span>
                  {lessonDate.toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#0B2343]/60">
                <Clock size={13} className="text-[#0B2343]/30 shrink-0" />
                <span>
                  {lesson.startTime} – {lesson.endTime}
                </span>
              </div>
              {lesson.timezone && (
                <div className="flex items-center gap-2 text-xs text-[#0B2343]/60">
                  <Globe size={13} className="text-[#0B2343]/30 shrink-0" />
                  <span>{lesson.timezone}</span>
                </div>
              )}
              {lesson.earnings > 0 && (
                <div className="flex items-center gap-2 text-xs text-[#0B2343]/60">
                  <PoundSterling
                    size={13}
                    className="text-green-500 shrink-0"
                  />
                  <span className="font-medium">
                    £{lesson.earnings}
                    {lesson.currency && lesson.currency !== "GBP"
                      ? ` ${lesson.currency}`
                      : ""}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-[#0B2343]/60">
                <Sparkles size={13} className="text-[#0B2343]/30 shrink-0" />
                <span className="capitalize">{lesson.lessonType} lesson</span>
              </div>
            </div>

            {/* Student Learning Profile */}
            {lesson.learningPreferences && (
              <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100/60">
                <div className="flex items-center gap-2 mb-2.5">
                  <GraduationCap size={14} className="text-indigo-500" />
                  <p className="text-xs font-semibold text-indigo-700">
                    Student Learning Profile
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(lesson.learningPreferences.currentLevel ||
                    lesson.learningPreferences.targetLevel) && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        {lesson.learningPreferences.currentLevel && (
                          <span className="font-medium text-[#0B2343]/70 bg-[#0B2343]/[0.05] px-2 py-0.5 rounded capitalize">
                            {lesson.learningPreferences.currentLevel}
                          </span>
                        )}
                        {lesson.learningPreferences.currentLevel &&
                          lesson.learningPreferences.targetLevel && (
                            <ArrowRight
                              size={12}
                              className="text-[#0B2343]/25"
                            />
                          )}
                        {lesson.learningPreferences.targetLevel && (
                          <span className="font-medium text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded capitalize">
                            {lesson.learningPreferences.targetLevel}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {lesson.learningPreferences.lessonTypePreference && (
                    <div className="flex items-center gap-2 text-xs text-[#0B2343]/60">
                      <Users size={12} className="text-indigo-400 shrink-0" />
                      <span className="capitalize">
                        {lesson.learningPreferences.lessonTypePreference}
                      </span>
                    </div>
                  )}
                  {lesson.learningPreferences.goals &&
                    lesson.learningPreferences.goals.length > 0 && (
                      <div className="sm:col-span-2">
                        <p className="text-[11px] font-medium text-[#0B2343]/45 mb-1.5">
                          Goals
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {lesson.learningPreferences.goals.map((goal) => (
                            <span
                              key={goal}
                              className="flex items-center gap-1 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg"
                            >
                              <Target
                                size={10}
                                className="text-indigo-400 shrink-0"
                              />
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  {lesson.learningPreferences.preferredSchedule &&
                    lesson.learningPreferences.preferredSchedule.length > 0 && (
                      <div className="sm:col-span-2">
                        <p className="text-[11px] font-medium text-[#0B2343]/45 mb-1.5">
                          Preferred Schedule
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {lesson.learningPreferences.preferredSchedule.map(
                            (time) => (
                              <span
                                key={time}
                                className="flex items-center gap-1 text-xs text-[#0B2343]/60 bg-[#0B2343]/[0.04] px-2 py-1 rounded-lg capitalize"
                              >
                                <Clock
                                  size={10}
                                  className="text-[#0B2343]/30 shrink-0"
                                />
                                {time}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Payment status */}
            {payment && (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-[#0B2343]/35" />
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${payment.bg} ${payment.color}`}
                  >
                    {payment.label}
                  </span>
                </div>
                {/* {lesson.stripeCheckoutSessionId && (
                  <span className="flex items-center gap-1 text-[11px] text-[#0B2343]/35 font-mono">
                    <Hash size={10} />
                    {lesson.stripeCheckoutSessionId.slice(0, 24)}…
                  </span>
                )} */}
              </div>
            )}
            {/* Meeting link (tutor can view / edit) */}
            {(lesson.status === "upcoming" ||
              lesson.originalStatus === "confirmed") && (
              <div className="p-3 rounded-lg bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Link2 size={14} className="text-[#0B2343]/40" />
                    <p className="text-xs font-semibold text-[#0B2343]/60">
                      Meeting Link
                    </p>
                  </div>
                  {!editingMeetingUrl && !isPending && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMeetingUrlInput(lesson.meetingUrl || "");
                        setEditingMeetingUrl(true);
                      }}
                      className="flex items-center gap-1 text-[11px] font-medium text-[#ff7c22] hover:underline"
                    >
                      <Pencil size={10} />
                      {lesson.meetingUrl ? "Change" : "Add link"}
                    </button>
                  )}
                </div>

                {editingMeetingUrl ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <input
                      type="url"
                      value={meetingUrlInput}
                      onChange={(e) => setMeetingUrlInput(e.target.value)}
                      placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                      className="w-full rounded-lg border border-[#0B2343]/10 bg-white p-2.5 text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 transition-colors"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveMeetingUrl}
                        disabled={
                          !meetingUrlInput.trim() ||
                          updateMeetingUrlMutation.isPending
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ff7c22] text-white text-xs font-semibold hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
                      >
                        {updateMeetingUrlMutation.isPending ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <Check size={11} />
                        )}
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMeetingUrl(false);
                          setMeetingUrlInput(lesson.meetingUrl || "");
                        }}
                        className="px-3 py-1.5 rounded-lg border border-[#0B2343]/10 text-xs text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-[10px] text-[#0B2343]/30 mt-2">
                      Paste your own Zoom, Google Meet, or Teams link to
                      override the auto-generated room.
                    </p>
                  </div>
                ) : lesson.meetingUrl ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={lesson.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-[#ff7c22] hover:underline truncate flex items-center gap-1"
                    >
                      {lesson.meetingUrl}
                      <ExternalLink size={10} className="shrink-0" />
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-[#0B2343]/30">
                    {isPending
                      ? "A Zoom meeting link will be generated when you confirm this booking."
                      : "No meeting link yet. Add your Zoom or Google Meet link so your student can join."}
                  </p>
                )}
              </div>
            )}

            {/* Student message */}
            {lesson.message && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                <MessageSquare
                  size={14}
                  className="text-blue-500 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs font-semibold text-blue-700 mb-0.5">
                    Student message
                  </p>
                  <p className="text-sm text-blue-600/80 leading-relaxed">
                    {lesson.message}
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            {lesson.notes && (
              <div className="p-3 rounded-lg bg-[#0B2343]/[0.02]">
                <p className="text-sm text-[#0B2343]/60 leading-relaxed">
                  📝 {lesson.notes}
                </p>
              </div>
            )}

            {/* Materials */}
            {lesson.materials && lesson.materials.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#0B2343]/50 mb-2">
                  Materials
                </p>
                <div className="flex flex-wrap gap-2">
                  {lesson.materials.map((mat) => (
                    <span
                      key={mat}
                      className="flex items-center gap-1.5 text-xs text-[#0B2343]/60 bg-[#0B2343]/[0.04] px-2.5 py-1.5 rounded-lg"
                    >
                      <FileText size={11} className="text-[#0B2343]/35" />
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            {lesson.feedback && (
              <div className="p-3 rounded-lg bg-green-50/60 border border-green-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < lesson.feedback!.rating
                            ? "text-[#ff7c22]"
                            : "text-[#0B2343]/15"
                        }
                        fill={
                          i < lesson.feedback!.rating ? "currentColor" : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#0B2343]/45">
                    from {lesson.studentName}
                  </span>
                </div>
                <p className="text-sm text-[#0B2343]/60 leading-relaxed">
                  "{lesson.feedback.comment}"
                </p>
              </div>
            )}

            {/* Cancellation info */}
            {lesson.status === "cancelled" && lesson.cancellationReason && (
              <div className="p-3 rounded-lg bg-red-50/60 border border-red-200/60">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle
                    size={14}
                    className="text-red-500 shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-red-600 mb-0.5">
                      Cancelled by{" "}
                      {lesson.cancelledBy === "student"
                        ? "student"
                        : lesson.cancelledBy === "admin"
                          ? "admin"
                          : "you"}
                    </p>
                    <p className="text-sm text-red-500/80 leading-relaxed">
                      {lesson.cancellationReason}
                    </p>
                    {lesson.cancelledAt && (
                      <p className="text-xs text-red-400 mt-1.5">
                        {formatDateTime(lesson.cancelledAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* No show */}
            {lesson.status === "no_show" && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/60 border border-amber-200/60">
                <UserX size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-700">
                    Student did not attend
                  </p>
                  <p className="text-sm text-amber-600/80">
                    You've been compensated for this lesson
                  </p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            {(lesson.createdAt || lesson.updatedAt) && (
              <div className="flex items-center gap-5 flex-wrap pt-2 border-t border-[#0B2343]/[0.05]">
                {lesson.createdAt && (
                  <span className="flex items-center gap-1.5 text-xs text-[#0B2343]/40">
                    <CalendarClock size={12} />
                    Booked: {formatDateTime(lesson.createdAt)}
                  </span>
                )}
                {lesson.updatedAt && lesson.updatedAt !== lesson.createdAt && (
                  <span className="flex items-center gap-1.5 text-xs text-[#0B2343]/40">
                    <CalendarClock size={12} />
                    Updated: {formatDateTime(lesson.updatedAt)}
                  </span>
                )}
              </div>
            )}

            {/* Join hint */}
            {lesson.status === "upcoming" &&
              !isPending &&
              lesson.meetingUrl &&
              !isJoinable && (
                <p className="text-xs text-[#0B2343]/40">
                  Join button will appear 15 minutes before the lesson
                </p>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
