/**
 * Stage 3 Objectives tab — current objectives + history of changes.
 */

import type { LearnerDetail } from "../../../../lib/types/orgAdmin";

interface Props {
  detail: LearnerDetail;
}

const SOURCE_LABEL: Record<string, string> = {
  placement_assessment: "Placement",
  level_change: "Level change",
  teacher_override: "Teacher override",
};

export default function Stage3ObjectivesTab({ detail }: Props) {
  const objectives = detail.stage3_objectives ?? [];

  const groups = new Map<string, typeof objectives>();
  for (const o of objectives) {
    const key = o.target_level ?? "unspecified";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(o);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
        Stage 3 objectives
      </h2>

      {objectives.length === 0 ? (
        <div
          role="status"
          className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900"
        >
          No Stage 3 objectives have been set yet.
        </div>
      ) : (
        Array.from(groups.entries()).map(([level, items]) => (
          <section
            key={level}
            className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6"
          >
            <h3 className="text-sm font-bold text-[#0B2343] mb-3">
              At {level === "unspecified" ? "(no level)" : level.toUpperCase()}
            </h3>
            <ul className="space-y-2 list-none m-0 p-0">
              {items.map((o) => (
                <li
                  key={o.id}
                  className="rounded-xl border border-[#0B2343]/[0.06] p-3"
                >
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span
                      aria-label={`Skill code ${o.skill_domain}`}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B2343]/[0.06] text-[#0B2343]/70"
                    >
                      {o.skill_domain}
                    </span>
                    {o.set_from && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#0B2343]/[0.12] text-[#0B2343]/65 bg-white">
                        {SOURCE_LABEL[o.set_from] ?? o.set_from}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#0B2343]/85 leading-relaxed">
                    {o.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
