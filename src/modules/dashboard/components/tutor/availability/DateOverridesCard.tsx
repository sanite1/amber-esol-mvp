import { useState } from "react";
import {
  CalendarX2,
  CalendarPlus,
  Plus,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import type {
  DateOverride,
  TimeBlock,
  CreateOverridePayload,
} from "../../../lib/types/availability";
import { timeSlotOptions } from "../../../data/tutor/tutorAvailabilityData";

interface Props {
  overrides: DateOverride[];
  onAdd: (payload: CreateOverridePayload) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  isAdding: boolean;
  isRemoving: boolean;
}

export default function DateOverridesCard({
  overrides,
  onAdd,
  onRemove,
  isAdding,
  isRemoving,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"unavailable" | "extra">(
    "unavailable",
  );
  const [formDate, setFormDate] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formBlocks, setFormBlocks] = useState<TimeBlock[]>([
    { startTime: "09:00", endTime: "12:00" },
  ]);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const now = new Date();

  const handleAdd = async () => {
    if (!formDate) return;
    try {
      await onAdd({
        date: formDate,
        type: formType,
        reason: formReason || undefined,
        blocks: formType === "extra" ? formBlocks : undefined,
      });
      setShowForm(false);
      setFormDate("");
      setFormReason("");
      setFormType("unavailable");
      setFormBlocks([{ startTime: "09:00", endTime: "12:00" }]);
    } catch {
      // error is handled by the hook toast
    }
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await onRemove(id);
    } catch {
      // error is handled by the hook toast
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const futureOverrides = overrides
    .filter((o) => new Date(o.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastOverrides = overrides
    .filter((o) => new Date(o.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const inputClass =
    "w-full px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors";

  const selectClass =
    "px-2 py-1.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30 transition-colors";

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
        <div className="min-w-0">
          <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343]">
            Date Overrides
          </h3>
          <p className="text-[9px] sm:text-[10px] text-[#0B2343]/30 mt-0.5">
            Block specific dates or add extra availability
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="shrink-0 flex items-center gap-1 px-2 py-1.5 sm:px-3 rounded-lg bg-[#0B2343]/[0.04] text-[10px] sm:text-[11px] text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
        >
          {showForm ? <X size={11} /> : <Plus size={11} />}
          <span className="hidden sm:inline">
            {showForm ? "Cancel" : "Add Override"}
          </span>
          <span className="sm:hidden">{showForm ? "Cancel" : "Add"}</span>
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="p-3 sm:p-4 rounded-xl border border-[#ff7c22]/15 bg-[#ff7c22]/[0.02] mb-3 sm:mb-4">
          <div className="space-y-3">
            {/* Type selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setFormType("unavailable")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] sm:text-xs font-medium border transition-colors ${
                  formType === "unavailable"
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-[#0B2343]/[0.06] text-[#0B2343]/30 hover:border-[#0B2343]/[0.12]"
                }`}
              >
                <CalendarX2 size={12} />
                Day Off
              </button>
              <button
                onClick={() => setFormType("extra")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] sm:text-xs font-medium border transition-colors ${
                  formType === "extra"
                    ? "border-green-200 bg-green-50 text-green-600"
                    : "border-[#0B2343]/[0.06] text-[#0B2343]/30 hover:border-[#0B2343]/[0.12]"
                }`}
              >
                <CalendarPlus size={12} />
                Extra Hours
              </button>
            </div>

            {/* Date + reason */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="text-[9px] sm:text-[10px] font-medium text-[#0B2343]/40 mb-1 block">
                  Date
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[9px] sm:text-[10px] font-medium text-[#0B2343]/40 mb-1 block">
                  Reason (optional)
                </label>
                <input
                  type="text"
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="e.g. Doctor's appointment"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Time blocks for extra */}
            {formType === "extra" && (
              <div>
                <label className="text-[9px] sm:text-[10px] font-medium text-[#0B2343]/40 mb-1.5 block">
                  Extra Time Blocks
                </label>
                <div className="space-y-1.5">
                  {formBlocks.map((block, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 sm:gap-1.5 flex-wrap"
                    >
                      <select
                        value={block.startTime}
                        onChange={(e) => {
                          const updated = [...formBlocks];
                          updated[i] = { ...block, startTime: e.target.value };
                          setFormBlocks(updated);
                        }}
                        className={`flex-1 min-w-[80px] ${selectClass}`}
                      >
                        {timeSlotOptions.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <span className="text-[9px] text-[#0B2343]/15 shrink-0">
                        –
                      </span>
                      <select
                        value={block.endTime}
                        onChange={(e) => {
                          const updated = [...formBlocks];
                          updated[i] = { ...block, endTime: e.target.value };
                          setFormBlocks(updated);
                        }}
                        className={`flex-1 min-w-[80px] ${selectClass}`}
                      >
                        {timeSlotOptions.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      {formBlocks.length > 1 && (
                        <button
                          onClick={() =>
                            setFormBlocks(formBlocks.filter((_, j) => j !== i))
                          }
                          className="shrink-0 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 size={11} className="text-red-300" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setFormBlocks([
                        ...formBlocks,
                        { startTime: "14:00", endTime: "17:00" },
                      ])
                    }
                    className="text-[10px] text-[#ff7c22] font-medium hover:underline"
                  >
                    + Add another block
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={!formDate || isAdding}
              className="w-full py-2 sm:py-2.5 rounded-xl bg-[#ff7c22] text-white text-[11px] sm:text-xs font-semibold hover:bg-[#e56a10] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
            >
              {isAdding ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Plus size={13} />
              )}
              {isAdding ? "Adding…" : "Add Override"}
            </button>
          </div>
        </div>
      )}

      {/* Upcoming overrides */}
      {futureOverrides.length > 0 && (
        <div className="space-y-2 mb-3 sm:mb-4">
          <p className="text-[9px] sm:text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider">
            Upcoming
          </p>
          {futureOverrides.map((override) => (
            <div
              key={override._id}
              className={`flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl border ${
                override.type === "unavailable"
                  ? "border-red-100 bg-red-50/30"
                  : "border-green-100 bg-green-50/30"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  override.type === "unavailable" ? "bg-red-50" : "bg-green-50"
                }`}
              >
                {override.type === "unavailable" ? (
                  <CalendarX2 size={13} className="text-red-400 sm:scale-110" />
                ) : (
                  <CalendarPlus
                    size={13}
                    className="text-green-500 sm:scale-110"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <p className="text-xs sm:text-sm font-medium text-[#0B2343]/60 truncate">
                    {formatDate(override.date)}
                  </p>
                  <span
                    className={`text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                      override.type === "unavailable"
                        ? "bg-red-100 text-red-500"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {override.type === "unavailable" ? "Day Off" : "Extra"}
                  </span>
                </div>
                {override.reason && (
                  <p className="text-[10px] sm:text-[11px] text-[#0B2343]/30 mt-0.5 truncate">
                    {override.reason}
                  </p>
                )}
                {override.blocks && override.blocks.length > 0 && (
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                    {override.blocks.map((b, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 text-[9px] sm:text-[10px] text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 rounded"
                      >
                        <Clock size={8} className="sm:scale-110" />
                        {b.startTime} – {b.endTime}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemove(override._id)}
                disabled={isRemoving && removingId === override._id}
                className="shrink-0 p-1 sm:p-1.5 rounded-lg hover:bg-red-100/50 transition-colors disabled:opacity-30"
              >
                {isRemoving && removingId === override._id ? (
                  <Loader2
                    size={12}
                    className="animate-spin text-red-400 sm:scale-110"
                  />
                ) : (
                  <Trash2
                    size={12}
                    className="text-red-300 hover:text-red-500 sm:scale-110"
                  />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Past overrides */}
      {pastOverrides.length > 0 && (
        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-[9px] sm:text-[10px] font-semibold text-[#0B2343]/15 uppercase tracking-wider">
            Past
          </p>
          {pastOverrides.slice(0, 3).map((override) => (
            <div
              key={override._id}
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl border border-[#0B2343]/[0.03] opacity-50"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#0B2343]/[0.03] flex items-center justify-center shrink-0">
                {override.type === "unavailable" ? (
                  <CalendarX2
                    size={11}
                    className="text-[#0B2343]/15 sm:scale-110"
                  />
                ) : (
                  <CalendarPlus
                    size={11}
                    className="text-[#0B2343]/15 sm:scale-110"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-xs text-[#0B2343]/30 truncate">
                  {formatDate(override.date)}
                </p>
                {override.reason && (
                  <p className="text-[9px] sm:text-[10px] text-[#0B2343]/15 truncate">
                    {override.reason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {overrides.length === 0 && !showForm && (
        <div className="py-5 sm:py-6 text-center">
          <AlertTriangle
            size={16}
            className="text-[#0B2343]/10 mx-auto mb-2 sm:scale-110"
          />
          <p className="text-[11px] sm:text-xs text-[#0B2343]/20 px-2">
            No date overrides set. Your weekly schedule applies to all dates.
          </p>
        </div>
      )}
    </div>
  );
}
