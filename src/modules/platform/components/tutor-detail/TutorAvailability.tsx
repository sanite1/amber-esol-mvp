import { CalendarDays } from "lucide-react";
import type { Tutor } from "../../data/tutorsData";

interface Props {
  tutor: Tutor;
}

export default function TutorAvailability({ tutor }: Props) {
  const schedule = tutor.availability;
  if (!schedule || schedule.length === 0) return null;

  return (
    <div data-aos="fade-up" data-aos-delay="50">
      <h3 className="flex items-center gap-2 text-sm font-bold text-[#0B2343] mb-4">
        <CalendarDays size={14} className="text-[#ff7c22]" /> Weekly
        availability
      </h3>
      <div className="space-y-2">
        {schedule.map((day) => (
          <div key={day.day} className="flex items-start gap-3">
            <span className="w-10 text-xs font-bold text-[#0B2343]/50 pt-1.5 shrink-0">
              {day.day}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {day.slots.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg bg-[#22C55E]/[0.08] text-[11px] font-semibold text-[#22C55E] border border-[#22C55E]/10"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
