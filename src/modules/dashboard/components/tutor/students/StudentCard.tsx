import { useState } from "react";
import {
  ChevronDown,
  Star,
  Clock,
  BookOpen,
  Calendar,
  MessageSquare,
  AlertTriangle,
  XCircle,
  Target,
  StickyNote,
  Loader2,
  Check,
  Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TutorStudent } from "../../../lib/types/myStudents";
import { useUpdateStudentNotes } from "../../../lib/api/myStudents";

interface Props {
  student: TutorStudent;
}

const statusConfig: Record<
  TutorStudent["status"],
  { label: string; dot: string; bg: string; text: string }
> = {
  active: {
    label: "Active",
    dot: "bg-emerald-400",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  trial: {
    label: "Trial",
    dot: "bg-[#ff7c22]",
    bg: "bg-[#ff7c22]/10",
    text: "text-[#ff7c22]",
  },
  inactive: {
    label: "Inactive",
    dot: "bg-[#0B2343]/25",
    bg: "bg-[#0B2343]/5",
    text: "text-[#0B2343]/40",
  },
};

const lessonStatusColors: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-600",
  upcoming: "bg-blue-50 text-blue-600",
  cancelled: "bg-red-50 text-red-400",
  no_show: "bg-amber-50 text-amber-600",
};

export default function StudentCard({ student }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(student.notes || "");

  const updateNotesMutation = useUpdateStudentNotes();

  const sc = statusConfig[student.status];

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const daysSinceLastLesson = Math.floor(
    (Date.now() - new Date(student.lastLessonDate).getTime()) / 86400000
  );

  const lastLessonLabel =
    daysSinceLastLesson === 0
      ? "Today"
      : daysSinceLastLesson === 1
        ? "Yesterday"
        : daysSinceLastLesson < 7
          ? `${daysSinceLastLesson}d ago`
          : daysSinceLastLesson < 30
            ? `${Math.floor(daysSinceLastLesson / 7)}w ago`
            : `${Math.floor(daysSinceLastLesson / 30)}mo ago`;

  const formatShortDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const handleSaveNotes = () => {
    updateNotesMutation.mutate(
      { studentId: student.id, notes: notesValue },
      {
        onSuccess: () => {
          setEditingNotes(false);
        },
      }
    );
  };

  const handleCancelNotes = () => {
    setNotesValue(student.notes || "");
    setEditingNotes(false);
  };

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] hover:border-[#0B2343]/[0.12] transition-colors">
      {/* ── Collapsed Row ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-xs font-bold text-[#0B2343]/30 shrink-0 overflow-hidden">
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Name + level + country */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[#0B2343] truncate">
                {student.name}
              </p>
              <span className="text-[10px] font-semibold text-[#0B2343]/30 bg-[#0B2343]/[0.04] px-1.5 py-0.5 rounded shrink-0">
                {student.level}
              </span>
              <span className="text-[10px] text-[#0B2343]/25 shrink-0">
                {student.countryCode}
              </span>
            </div>
            <p className="text-[11px] text-[#0B2343]/35 mt-0.5 truncate">
              Last lesson: {lastLessonLabel}
              {student.nextLessonDate && (
                <span className="ml-2 text-blue-500">
                  · Next: {formatShortDate(student.nextLessonDate)}
                </span>
              )}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center">
              <p className="text-sm font-bold text-[#0B2343]">
                {student.completedLessons}
              </p>
              <p className="text-[9px] text-[#0B2343]/25">lessons</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#0B2343]">
                {student.totalHours}h
              </p>
              <p className="text-[9px] text-[#0B2343]/25">hours</p>
            </div>
            {student.averageRating !== null && (
              <div className="flex items-center gap-0.5">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-[#0B2343]/60">
                  {student.averageRating}
                </span>
              </div>
            )}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.bg}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              <span className={`text-[10px] font-semibold ${sc.text}`}>
                {sc.label}
              </span>
            </div>
          </div>

          {/* Chevron */}
          <ChevronDown
            size={16}
            className={`text-[#0B2343]/20 transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`}
          />
        </div>

        {/* Mobile */}
        <div className="sm:hidden px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[11px] font-bold text-[#0B2343]/30 shrink-0 overflow-hidden">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold text-[#0B2343] truncate">
                  {student.name}
                </p>
                <span className="text-[9px] font-semibold text-[#0B2343]/30 bg-[#0B2343]/[0.04] px-1 py-0.5 rounded shrink-0">
                  {student.level}
                </span>
              </div>
              <p className="text-[10px] text-[#0B2343]/30 mt-0.5">
                {lastLessonLabel} · {student.completedLessons} lessons
              </p>
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${sc.bg} shrink-0`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              <span className={`text-[9px] font-semibold ${sc.text}`}>
                {sc.label}
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-[#0B2343]/20 transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {/* ── Expanded Section ── */}
      {expanded && (
        <div className="border-t border-[#0B2343]/[0.04] px-3 pb-3 sm:px-4 sm:pb-4">
          {/* Quick stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            <div className="bg-[#0B2343]/[0.02] rounded-lg px-2.5 py-2 sm:px-3">
              <p className="text-[10px] text-[#0B2343]/30 flex items-center gap-1">
                <BookOpen size={10} /> Total Lessons
              </p>
              <p className="text-sm font-bold text-[#0B2343] mt-0.5">
                {student.totalLessons}
              </p>
            </div>
            <div className="bg-[#0B2343]/[0.02] rounded-lg px-2.5 py-2 sm:px-3">
              <p className="text-[10px] text-[#0B2343]/30 flex items-center gap-1">
                <Clock size={10} /> Total Hours
              </p>
              <p className="text-sm font-bold text-[#0B2343] mt-0.5">
                {student.totalHours}h
              </p>
            </div>
            <div className="bg-[#0B2343]/[0.02] rounded-lg px-2.5 py-2 sm:px-3">
              <p className="text-[10px] text-[#0B2343]/30 flex items-center gap-1">
                <XCircle size={10} /> Cancelled
              </p>
              <p className="text-sm font-bold text-[#0B2343] mt-0.5">
                {student.cancelledLessons}
              </p>
            </div>
            <div className="bg-[#0B2343]/[0.02] rounded-lg px-2.5 py-2 sm:px-3">
              <p className="text-[10px] text-[#0B2343]/30 flex items-center gap-1">
                <AlertTriangle size={10} /> No‑shows
              </p>
              <p className="text-sm font-bold text-[#0B2343] mt-0.5">
                {student.noShows}
              </p>
            </div>
          </div>

          {/* Info row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[11px] sm:text-xs text-[#0B2343]/40">
            <span>{student.country}</span>
            <span>Speaks: {student.languages.join(", ")}</span>
            <span>Joined {formatShortDate(student.joinedDate)}</span>
            {student.totalSpent > 0 && (
              <span className="font-semibold text-[#0B2343]/60">
                £{student.totalSpent.toLocaleString()} earned
              </span>
            )}
          </div>

          {/* Goals */}
          {student.goals.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Target size={10} /> Goals
              </p>
              <div className="flex flex-wrap gap-1.5">
                {student.goals.map((g, i) => (
                  <span
                    key={i}
                    className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 bg-[#0B2343]/[0.04] px-2 py-0.5 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes — with inline edit */}
          <div className="mt-3">
            {editingNotes ? (
              <div className="bg-amber-50/50 border border-amber-100/60 rounded-lg px-2.5 py-2 sm:px-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <StickyNote size={12} className="text-amber-400" />
                  <span className="text-[10px] font-semibold text-[#0B2343]/30 uppercase tracking-wider">
                    Notes
                  </span>
                </div>
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  className="w-full text-[11px] sm:text-xs text-[#0B2343]/60 bg-white border border-[#0B2343]/[0.08] rounded-lg px-2.5 py-2 outline-none focus:border-[#ff7c22]/30 resize-none"
                  placeholder="Add private notes about this student..."
                />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[9px] text-[#0B2343]/20">
                    {notesValue.length}/1000
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCancelNotes}
                      disabled={updateNotesMutation.isPending}
                      className="px-2.5 py-1 rounded-md text-[10px] font-medium text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      disabled={updateNotesMutation.isPending}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#ff7c22] text-white hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
                    >
                      {updateNotesMutation.isPending ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Check size={10} />
                      )}
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : student.notes ? (
              <div className="flex items-start gap-2 bg-amber-50/50 border border-amber-100/60 rounded-lg px-2.5 py-2 sm:px-3 group">
                <StickyNote
                  size={12}
                  className="text-amber-400 mt-0.5 shrink-0"
                />
                <p className="text-[11px] sm:text-xs text-[#0B2343]/50 leading-relaxed flex-1">
                  {student.notes}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingNotes(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#0B2343]/20 hover:text-[#0B2343]/40 transition-all shrink-0"
                >
                  <Pencil size={11} />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingNotes(true);
                }}
                className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#0B2343]/25 hover:text-[#0B2343]/40 transition-colors"
              >
                <StickyNote size={11} />
                Add notes...
              </button>
            )}
          </div>

          {/* Recent lessons */}
          {student.recentLessons.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider mb-1.5">
                Recent Lessons
              </p>
              <div className="space-y-1.5">
                {student.recentLessons.slice(0, 4).map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs"
                  >
                    <span className="text-[#0B2343]/30 shrink-0 w-14 sm:w-16">
                      {new Date(lesson.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span
                      className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold capitalize ${
                        lessonStatusColors[lesson.status] || ""
                      }`}
                    >
                      {lesson.status.replace("_", " ")}
                    </span>
                    {lesson.type === "trial" && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded bg-[#ff7c22]/10 text-[#ff7c22] text-[9px] sm:text-[10px] font-semibold">
                        Trial
                      </span>
                    )}
                    <span className="text-[#0B2343]/40 truncate flex-1 min-w-0">
                      {lesson.topic || "—"}
                    </span>
                    <span className="text-[#0B2343]/20 shrink-0">
                      {lesson.duration}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 pt-3 border-t border-[#0B2343]/[0.04]">
            <Link
              to={`/tutor/messages?student=${student.id}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B2343]/[0.04] text-[11px] sm:text-xs font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
            >
              <MessageSquare size={12} />
              Message
            </Link>
            <Link
              to={`/tutor/lessons?student=${student.id}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B2343]/[0.04] text-[11px] sm:text-xs font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
            >
              <Calendar size={12} />
              All Lessons
            </Link>
            {student.nextLessonDate && (
              <span className="text-[10px] sm:text-[11px] text-blue-500 sm:ml-auto text-center sm:text-right">
                Next lesson: {formatShortDate(student.nextLessonDate)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
