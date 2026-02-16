import { useState } from "react";
import { Plus, Trash2, Loader2, Check, Globe } from "lucide-react";
import type {
  DaySchedule,
  DayOfWeek,
  TimeBlock,
} from "../../../data/tutor/tutorAvailabilityData";
import {
  dayLabels,
  timeSlotOptions,
} from "../../../data/tutor/tutorAvailabilityData";

interface Props {
  schedule: DaySchedule[];
  timezone: string;
  onUpdate: (schedule: DaySchedule[]) => void;
  onSave: () => Promise<void>;
}

export default function WeeklyScheduleCard({
  schedule,
  timezone,
  onUpdate,
  onSave,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const toggleDay = (day: DayOfWeek) => {
    const updated = schedule.map((d) => {
      if (d.day !== day) return d;
      if (d.enabled) {
        return { ...d, enabled: false, blocks: [] };
      }
      return {
        ...d,
        enabled: true,
        blocks: [
          { id: `${day}-${Date.now()}`, startTime: "09:00", endTime: "17:00" },
        ],
      };
    });
    onUpdate(updated);
    setDirty(true);
  };

  const addBlock = (day: DayOfWeek) => {
    const updated = schedule.map((d) => {
      if (d.day !== day) return d;
      const lastBlock = d.blocks[d.blocks.length - 1];
      const newStart = lastBlock ? lastBlock.endTime : "09:00";
      const startH = parseInt(newStart.split(":")[0]);
      const newEnd = `${String(Math.min(startH + 2, 22)).padStart(2, "0")}:00`;
      return {
        ...d,
        blocks: [
          ...d.blocks,
          { id: `${day}-${Date.now()}`, startTime: newStart, endTime: newEnd },
        ],
      };
    });
    onUpdate(updated);
    setDirty(true);
  };

  const removeBlock = (day: DayOfWeek, blockId: string) => {
    const updated = schedule.map((d) => {
      if (d.day !== day) return d;
      const newBlocks = d.blocks.filter((b) => b.id !== blockId);
      return { ...d, blocks: newBlocks, enabled: newBlocks.length > 0 };
    });
    onUpdate(updated);
    setDirty(true);
  };

  const updateBlock = (
    day: DayOfWeek,
    blockId: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const updated = schedule.map((d) => {
      if (d.day !== day) return d;
      return {
        ...d,
        blocks: d.blocks.map((b) =>
          b.id === blockId ? { ...b, [field]: value } : b
        ),
      };
    });
    onUpdate(updated);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
    setDirty(false);
  };

  // Calculate total hours
  const totalHours = schedule.reduce((sum, d) => {
    if (!d.enabled) return sum;
    return (
      sum +
      d.blocks.reduce((bSum, b) => {
        const [sh, sm] = b.startTime.split(":").map(Number);
        const [eh, em] = b.endTime.split(":").map(Number);
        return bSum + (eh + em / 60 - (sh + sm / 60));
      }, 0)
    );
  }, 0);

  const selectClass =
    "px-2 py-1.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-[11px] text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors";

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Weekly Schedule
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-[10px] text-[#0B2343]/30">
              <Globe size={10} />
              {timezone}
            </span>
            <span className="text-[10px] text-[#0B2343]/20">·</span>
            <span className="text-[10px] text-[#ff7c22] font-medium">
              {totalHours.toFixed(1)}h / week
            </span>
          </div>
        </div>
        {dirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff7c22] text-white text-xs font-semibold hover:bg-[#e56a10] disabled:opacity-50 transition-colors self-start sm:self-auto"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Check size={13} />
            )}
            Save Schedule
          </button>
        )}
      </div>

      {/* Days */}
      <div className="space-y-2">
        {schedule.map((daySchedule) => {
          const labels = dayLabels[daySchedule.day];

          return (
            <div
              key={daySchedule.day}
              className={`rounded-xl border p-3 transition-colors ${
                daySchedule.enabled
                  ? "border-[#0B2343]/[0.06] bg-white"
                  : "border-[#0B2343]/[0.03] bg-[#0B2343]/[0.01]"
              }`}
            >
              {/* ── Desktop layout ── */}
              <div className="hidden sm:flex items-start gap-3">
                {/* Toggle */}
                <button
                  onClick={() => toggleDay(daySchedule.day)}
                  className={`mt-0.5 relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
                    daySchedule.enabled ? "bg-[#ff7c22]" : "bg-[#0B2343]/[0.1]"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                      daySchedule.enabled
                        ? "translate-x-[18px]"
                        : "translate-x-[3px]"
                    }`}
                  />
                </button>

                {/* Day label */}
                <span
                  className={`text-sm font-medium w-20 shrink-0 pt-0.5 ${
                    daySchedule.enabled
                      ? "text-[#0B2343]/70"
                      : "text-[#0B2343]/20"
                  }`}
                >
                  {labels.full}
                </span>

                {/* Blocks */}
                {daySchedule.enabled ? (
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {daySchedule.blocks.map((block) => (
                        <div
                          key={block.id}
                          className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.05]"
                        >
                          <select
                            value={block.startTime}
                            onChange={(e) =>
                              updateBlock(
                                daySchedule.day,
                                block.id,
                                "startTime",
                                e.target.value
                              )
                            }
                            className={selectClass}
                          >
                            {timeSlotOptions.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <span className="text-[10px] text-[#0B2343]/20">
                            to
                          </span>
                          <select
                            value={block.endTime}
                            onChange={(e) =>
                              updateBlock(
                                daySchedule.day,
                                block.id,
                                "endTime",
                                e.target.value
                              )
                            }
                            className={selectClass}
                          >
                            {timeSlotOptions.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              removeBlock(daySchedule.day, block.id)
                            }
                            className="p-1 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2
                              size={11}
                              className="text-red-300 hover:text-red-500"
                            />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addBlock(daySchedule.day)}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-dashed border-[#0B2343]/[0.08] text-[10px] text-[#0B2343]/25 hover:border-[#ff7c22]/30 hover:text-[#ff7c22]/50 transition-colors"
                      >
                        <Plus size={10} />
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-[#0B2343]/15 italic pt-0.5">
                    Unavailable
                  </span>
                )}
              </div>

              {/* ── Mobile layout ── */}
              <div className="flex sm:hidden flex-col gap-2">
                {/* Day + toggle row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleDay(daySchedule.day)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
                        daySchedule.enabled
                          ? "bg-[#ff7c22]"
                          : "bg-[#0B2343]/[0.1]"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                          daySchedule.enabled
                            ? "translate-x-[18px]"
                            : "translate-x-[3px]"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-[13px] font-medium ${
                        daySchedule.enabled
                          ? "text-[#0B2343]/70"
                          : "text-[#0B2343]/20"
                      }`}
                    >
                      {labels.short}
                    </span>
                  </div>
                  {daySchedule.enabled && (
                    <button
                      onClick={() => addBlock(daySchedule.day)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] text-[#ff7c22] font-medium hover:bg-[#ff7c22]/[0.05] transition-colors"
                    >
                      <Plus size={9} />
                      Add Block
                    </button>
                  )}
                </div>

                {/* Time blocks */}
                {daySchedule.enabled && daySchedule.blocks.length > 0 && (
                  <div className="space-y-1.5 ml-[46px]">
                    {daySchedule.blocks.map((block) => (
                      <div key={block.id} className="flex items-center gap-1.5">
                        <select
                          value={block.startTime}
                          onChange={(e) =>
                            updateBlock(
                              daySchedule.day,
                              block.id,
                              "startTime",
                              e.target.value
                            )
                          }
                          className={`flex-1 ${selectClass}`}
                        >
                          {timeSlotOptions.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <span className="text-[9px] text-[#0B2343]/15">–</span>
                        <select
                          value={block.endTime}
                          onChange={(e) =>
                            updateBlock(
                              daySchedule.day,
                              block.id,
                              "endTime",
                              e.target.value
                            )
                          }
                          className={`flex-1 ${selectClass}`}
                        >
                          {timeSlotOptions.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeBlock(daySchedule.day, block.id)}
                          className="p-1 rounded hover:bg-red-50 transition-colors shrink-0"
                        >
                          <Trash2 size={11} className="text-red-300" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {!daySchedule.enabled && (
                  <p className="text-[10px] text-[#0B2343]/12 italic ml-[46px]">
                    Unavailable
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
