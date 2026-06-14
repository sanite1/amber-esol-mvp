/**
 * Teacher assignment management — Final Addendum §4 frontend.
 *
 * Three pieces of UI on one page:
 *
 *   1. Teachers table — one row per teacher attached to this org,
 *      with learner counts and a near-capacity badge (≥ 80% of
 *      Organisation.max_learners_per_teacher).
 *
 *   2. "Assign learners" modal — opened from a teacher row. Shows the
 *      org's unassigned + currently-assigned learners; multi-select
 *      with bulk apply.
 *
 *   3. Bulk reassign panel — top-of-page, moves every learner currently
 *      assigned to teacher A onto teacher B.
 *
 * The near-capacity banner sits at the top whenever ANY teacher is at
 * or above 80% utilisation.
 *
 * WCAG 2.1 AA:
 *   - Tables expose `scope="col"`; capacity chip carries a text
 *     label so colour isn't the only signal.
 *   - Modal traps focus (Modal primitive default) and is dismissible
 *     via Escape and the close button.
 *   - All action buttons have `aria-label`s naming the teacher.
 */

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  Trash2,
  UserCheck,
  Loader2,
  Wand2,
} from "lucide-react";
import Modal from "../../../../components/Modal";
import ConfirmModal from "../../../../components/ConfirmModal";
import {
  useOrgAdminCohort,
  useOrgAdminTeachers,
  useRemoveTeacherFromOrg,
  useAssignTeacherToLearner,
  useAutoAssignUnassigned,
} from "../../api/orgAdminApi";
import type { CohortRow, OrgTeacherRow } from "../../lib/types/orgAdmin";
import { levelLabel, specialismLabel } from "../../lib/teachingProfileLabels";

export default function TeacherAssignment() {
  const { data: teachersData, isLoading: teachersLoading } =
    useOrgAdminTeachers();

  // Pull a generous slice of the cohort so the assign-learners modal
  // and the bulk-reassign helper can operate without further fetches.
  // 200 is the backend's cap; for the MVP that's enough for most orgs.
  const { data: cohortData, isLoading: cohortLoading } = useOrgAdminCohort({
    limit: 200,
  });

  const teachers = useMemo(
    () => teachersData?.data?.teachers ?? [],
    [teachersData],
  );
  const maxPerTeacher = teachersData?.data?.max_learners_per_teacher ?? 150;
  const learners = cohortData?.data?.rows ?? [];

  const anyNearCapacity = useMemo(
    () => teachers.some((t) => t.near_capacity),
    [teachers],
  );

  const [assignModalFor, setAssignModalFor] = useState<OrgTeacherRow | null>(
    null,
  );
  const autoAssign = useAutoAssignUnassigned();

  return (
    <main
      aria-labelledby="teacher-assignment-heading"
      className="space-y-4 sm:space-y-5"
    >
      {/* ── Header card ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1
              id="teacher-assignment-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight"
            >
              Teacher assignment
            </h1>
            <p className="text-sm sm:text-base text-[#0B2343]/60 mt-2 leading-relaxed max-w-3xl">
              Manage the teachers attached to your organisation and the learners
              each of them looks after. New learners are auto-matched on
              registration; the button places any who are still unassigned.
            </p>
          </div>
          <button
            type="button"
            onClick={() => autoAssign.mutate()}
            disabled={autoAssign.isPending || teachers.length === 0}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {autoAssign.isPending ? (
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            ) : (
              <Wand2 size={15} aria-hidden="true" />
            )}
            Auto-assign unassigned
          </button>
        </div>
      </section>

      {/* ── Soft capacity banner ── */}
      {anyNearCapacity && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5"
        >
          <span
            aria-hidden="true"
            className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center"
          >
            <AlertTriangle size={16} />
          </span>
          <p className="text-sm text-amber-900 leading-relaxed">
            One or more teachers are at or over <strong>80%</strong> of their
            learner capacity ({maxPerTeacher} per teacher). Consider
            redistributing learners using the Bulk reassign panel below or the
            Assign learners modal on each row.
          </p>
        </div>
      )}

      {/* ── Bulk reassign panel ── */}
      <BulkReassignPanel teachers={teachers} learners={learners} />

      {/* ── Teachers table ── */}
      <section
        aria-labelledby="teachers-table-heading"
        className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden"
      >
        <header className="px-5 sm:px-6 pt-5 pb-3">
          <h2
            id="teachers-table-heading"
            className="text-base sm:text-lg font-extrabold text-[#0B2343]"
          >
            Teachers in your organisation
          </h2>
        </header>

        <TeachersTable
          teachers={teachers}
          loading={teachersLoading}
          maxPerTeacher={maxPerTeacher}
          onOpenAssign={setAssignModalFor}
        />
      </section>

      {/* ── Assign learners modal ── */}
      <AssignLearnersModal
        open={Boolean(assignModalFor)}
        teacher={assignModalFor}
        learners={learners}
        learnersLoading={cohortLoading}
        onClose={() => setAssignModalFor(null)}
      />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TeachersTable
// ─────────────────────────────────────────────────────────────────────

interface TeachersTableProps {
  teachers: OrgTeacherRow[];
  loading: boolean;
  maxPerTeacher: number;
  onOpenAssign: (teacher: OrgTeacherRow) => void;
}

function TeachersTable({
  teachers,
  loading,
  maxPerTeacher,
  onOpenAssign,
}: TeachersTableProps) {
  const removeTeacher = useRemoveTeacherFromOrg();
  // Remove flows through the design-system ConfirmModal, not
  // window.confirm. Holds the teacher being detached while open.
  const [removeTarget, setRemoveTarget] = useState<OrgTeacherRow | null>(null);

  const confirmRemove = () => {
    if (!removeTarget) return;
    removeTeacher.mutate(
      { teacherId: removeTarget._id },
      { onSettled: () => setRemoveTarget(null) },
    );
  };

  const removeTargetName = removeTarget
    ? `${removeTarget.firstname} ${removeTarget.lastname}`.trim() || "(unnamed)"
    : "";

  return (
    <div className="overflow-x-auto">
      <table
        aria-label="Teachers attached to this organisation"
        className="w-full min-w-[760px] border-collapse text-sm"
      >
        <thead className="bg-[#fafbfc]">
          <tr>
            <th
              scope="col"
              className="text-left px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
            >
              Teacher
            </th>
            <th
              scope="col"
              className="text-left px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
            >
              Email
            </th>
            <th
              scope="col"
              className="text-right px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55 whitespace-nowrap"
            >
              Learners
            </th>
            <th
              scope="col"
              className="text-left px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55 min-w-[220px]"
            >
              Utilisation
            </th>
            <th
              scope="col"
              className="text-right px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {loading && teachers.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center">
                <Loader2
                  size={28}
                  aria-label="Loading teachers"
                  className="inline-block animate-spin text-[#0B2343]/45"
                />
              </td>
            </tr>
          ) : teachers.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-10 px-5 text-center text-sm text-[#0B2343]/55"
              >
                No ESOL-approved teachers attached to this organisation yet. Ask
                Amber to approve a tutor, then add them here.
              </td>
            </tr>
          ) : (
            teachers.map((t) => {
              const utilisationPct = Math.round(t.utilisation * 100);
              const cappedPct = Math.min(utilisationPct, 100);
              const name = `${t.firstname} ${t.lastname}`.trim() || "(unnamed)";
              return (
                <tr
                  key={t._id}
                  className="border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc]"
                >
                  <td className="align-top px-4 sm:px-5 py-3">
                    <p className="font-bold text-[#0B2343]">{name}</p>
                    {/* Teaching profile chips — what matching uses. */}
                    {t.teaching_profile.levels_taught.length +
                      t.teaching_profile.languages_spoken.length +
                      t.teaching_profile.specialisms.length >
                    0 ? (
                      <div className="flex flex-wrap gap-1 mt-1.5 max-w-[260px]">
                        {t.teaching_profile.levels_taught.map((code) => (
                          <span
                            key={`lv-${code}`}
                            className="inline-flex px-1.5 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-[10px] font-bold text-sky-700"
                          >
                            {levelLabel(code)}
                          </span>
                        ))}
                        {t.teaching_profile.languages_spoken.map((lang) => (
                          <span
                            key={`lang-${lang}`}
                            className="inline-flex px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700"
                          >
                            {lang}
                          </span>
                        ))}
                        {t.teaching_profile.specialisms.map((s) => (
                          <span
                            key={`sp-${s}`}
                            className="inline-flex px-1.5 py-0.5 rounded-full bg-[#fff8ee] border border-[#ff7c22]/25 text-[10px] font-bold text-[#ff7c22]"
                          >
                            {specialismLabel(s)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#0B2343]/35 mt-1">
                        No teaching profile yet
                      </p>
                    )}
                  </td>
                  <td className="align-top px-4 sm:px-5 py-3 text-[#0B2343]/75">
                    {t.email ?? "—"}
                  </td>
                  <td className="align-top px-4 sm:px-5 py-3 text-right tabular-nums text-[#0B2343]/80">
                    {t.assigned_learner_count} / {maxPerTeacher}
                  </td>
                  <td className="align-top px-4 sm:px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex-1 h-1.5 rounded-full bg-[#0B2343]/[0.08] overflow-hidden"
                        role="progressbar"
                        aria-label={`Utilisation ${utilisationPct} percent`}
                        aria-valuenow={cappedPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`h-full transition-all ${
                            t.near_capacity ? "bg-amber-500" : "bg-[#ff7c22]"
                          }`}
                          style={{ width: `${cappedPct}%` }}
                        />
                      </div>
                      {t.near_capacity ? (
                        <span
                          aria-label={`Near capacity: ${utilisationPct}%`}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 whitespace-nowrap"
                        >
                          {utilisationPct}% — near
                        </span>
                      ) : (
                        <span className="text-xs text-[#0B2343]/55 tabular-nums whitespace-nowrap">
                          {utilisationPct}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="align-top px-4 sm:px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenAssign(t)}
                        aria-label={`Assign learners to ${name}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors whitespace-nowrap"
                      >
                        <UserCheck size={13} aria-hidden="true" />
                        Assign
                      </button>
                      <button
                        type="button"
                        onClick={() => setRemoveTarget(t)}
                        disabled={removeTeacher.isPending}
                        title={`Detach ${name} from this org. All currently-assigned learners will be unassigned.`}
                        aria-label={`Remove ${name} from this organisation`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Remove-teacher confirmation — design-system modal. */}
      <ConfirmModal
        open={removeTarget !== null}
        onCancel={() => setRemoveTarget(null)}
        onConfirm={confirmRemove}
        title="Remove teacher?"
        titleId="remove-teacher-title"
        tone="danger"
        confirmLabel="Remove teacher"
        busy={removeTeacher.isPending}
        message={
          removeTarget && (
            <>
              Remove{" "}
              <strong className="font-bold text-[#0B2343]">
                {removeTargetName}
              </strong>{" "}
              from this organisation? Their{" "}
              {removeTarget.assigned_learner_count} assigned learner
              {removeTarget.assigned_learner_count === 1 ? "" : "s"} will be
              unassigned.
            </>
          )
        }
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AssignLearnersModal — multi-select with bulk apply per teacher
// ─────────────────────────────────────────────────────────────────────

interface AssignLearnersModalProps {
  open: boolean;
  teacher: OrgTeacherRow | null;
  learners: CohortRow[];
  learnersLoading: boolean;
  onClose: () => void;
}

function AssignLearnersModal({
  open,
  teacher,
  learners,
  learnersLoading,
  onClose,
}: AssignLearnersModalProps) {
  const assignMutation = useAssignTeacherToLearner();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("");

  // Initial selection — every learner currently assigned to this teacher.
  const initialSelected = useMemo(() => {
    if (!teacher) return new Set<string>();
    return new Set(
      learners
        .filter((l) => l.assigned_teacher_id === teacher._id)
        .map((l) => l._id),
    );
  }, [teacher, learners]);

  // Sync the selection whenever the modal target changes.
  useEffect(() => {
    setSelected(new Set(initialSelected));
    setFilter("");
  }, [initialSelected]);

  if (!teacher) return null;

  const teacherName = `${teacher.firstname} ${teacher.lastname}`.trim();

  const filterLower = filter.trim().toLowerCase();
  const filteredLearners = filterLower
    ? learners.filter((l) =>
        `${l.firstname} ${l.lastname}`.toLowerCase().includes(filterLower),
      )
    : learners;

  const toggle = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /**
   * Apply the selection diff. The backend's capacity warning toasts
   * independently per-call when relevant.
   */
  const onApply = async () => {
    const toAssign = Array.from(selected).filter(
      (id) => !initialSelected.has(id),
    );
    const toUnassign = Array.from(initialSelected).filter(
      (id) => !selected.has(id),
    );

    const calls = [
      ...toAssign.map((learnerId) =>
        assignMutation.mutateAsync({
          learnerId,
          data: { teacher_id: teacher._id },
        }),
      ),
      ...toUnassign.map((learnerId) =>
        assignMutation.mutateAsync({
          learnerId,
          data: { teacher_id: null },
        }),
      ),
    ];

    await Promise.allSettled(calls);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Assign learners to ${teacherName || "teacher"}`}
      titleId="assign-learners-title"
      size="lg"
      disableEscapeKey={assignMutation.isPending}
      disableBackdropClick={assignMutation.isPending}
    >
      <Modal.Body>
        <p className="text-sm text-[#0B2343]/70 leading-relaxed mb-4">
          {teacher.assigned_learner_count} of {teacher.max_learners_per_teacher}{" "}
          learners assigned. Tick to add, untick to remove. Changes apply when
          you click <strong className="font-bold text-[#0B2343]">Apply</strong>.
        </p>

        <label className="block mb-3">
          <span className="sr-only">Filter learner list</span>
          <input
            type="text"
            placeholder="Filter by name…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter learner list"
            className="w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
          />
        </label>

        {learnersLoading ? (
          <div className="flex justify-center py-8">
            <Loader2
              size={28}
              aria-label="Loading learners"
              className="animate-spin text-[#0B2343]/45"
            />
          </div>
        ) : filteredLearners.length === 0 ? (
          <div
            role="status"
            className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900"
          >
            No learners match.
          </div>
        ) : (
          <div className="rounded-xl border border-[#0B2343]/[0.06] overflow-hidden">
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table
                aria-label="Learners"
                className="w-full min-w-[480px] border-collapse text-sm"
              >
                <thead className="bg-[#fafbfc] sticky top-0 z-10">
                  <tr>
                    <th
                      scope="col"
                      aria-hidden="true"
                      className="w-12 px-3 py-2.5"
                    />
                    <th
                      scope="col"
                      className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                    >
                      Learner
                    </th>
                    <th
                      scope="col"
                      className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                    >
                      Current teacher
                    </th>
                    <th
                      scope="col"
                      className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLearners.map((l) => {
                    const isSelected = selected.has(l._id);
                    const otherTeacher =
                      l.assigned_teacher_id &&
                      l.assigned_teacher_id !== teacher._id
                        ? (l.assigned_teacher_name ?? "another teacher")
                        : null;
                    return (
                      <tr
                        key={l._id}
                        onClick={() => toggle(l._id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            toggle(l._id);
                          }
                        }}
                        className={`cursor-pointer border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-inset ${isSelected ? "bg-[#fff8ee]" : ""}`}
                      >
                        <td className="align-top px-3 py-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggle(l._id)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Select ${l.firstname} ${l.lastname}`}
                            className="w-4 h-4 rounded border-[#0B2343]/30 text-[#ff7c22] focus:ring-[#ff7c22] accent-[#ff7c22]"
                          />
                        </td>
                        <td className="align-top px-3 py-2.5 text-[#0B2343]">
                          {l.firstname} {l.lastname}
                        </td>
                        <td className="align-top px-3 py-2.5">
                          {otherTeacher ? (
                            <span className="text-xs text-amber-700">
                              {otherTeacher} (will be reassigned)
                            </span>
                          ) : l.assigned_teacher_id === teacher._id ? (
                            <span className="text-xs text-[#0B2343]">
                              {teacherName}
                            </span>
                          ) : (
                            <span className="text-xs text-[#0B2343]/55">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="align-top px-3 py-2.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#0B2343]/[0.12] text-[#0B2343]/70 bg-white whitespace-nowrap">
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Actions>
        <button
          type="button"
          onClick={onApply}
          disabled={assignMutation.isPending}
          aria-label={`Apply assignment changes to ${teacherName}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
        >
          {assignMutation.isPending ? (
            <>
              <Loader2 size={14} aria-hidden="true" className="animate-spin" />
              Applying…
            </>
          ) : (
            "Apply"
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={assignMutation.isPending}
          className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────
// BulkReassignPanel — move every learner from teacher A → teacher B
// ─────────────────────────────────────────────────────────────────────

interface BulkReassignPanelProps {
  teachers: OrgTeacherRow[];
  learners: CohortRow[];
}

function BulkReassignPanel({ teachers, learners }: BulkReassignPanelProps) {
  const assignMutation = useAssignTeacherToLearner();
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");

  const fromTeacher = teachers.find((t) => t._id === fromId);
  const toTeacher = teachers.find((t) => t._id === toId);

  const learnersToMove = useMemo(
    () =>
      fromId ? learners.filter((l) => l.assigned_teacher_id === fromId) : [],
    [fromId, learners],
  );

  const projectedNewLoad = toTeacher
    ? toTeacher.assigned_learner_count + learnersToMove.length
    : 0;
  const projectedExceedsCap =
    toTeacher !== undefined &&
    projectedNewLoad > toTeacher.max_learners_per_teacher;

  const canSubmit =
    fromId !== "" &&
    toId !== "" &&
    fromId !== toId &&
    learnersToMove.length > 0 &&
    !assignMutation.isPending;

  // Bulk move flows through the design-system ConfirmModal, not
  // window.confirm. The Move button opens it; the modal's confirm
  // fires the mutations.
  const [confirmMoveOpen, setConfirmMoveOpen] = useState(false);

  const onSubmit = () => {
    if (!canSubmit) return;
    setConfirmMoveOpen(true);
  };

  const confirmMove = async () => {
    await Promise.allSettled(
      learnersToMove.map((l) =>
        assignMutation.mutateAsync({
          learnerId: l._id,
          data: { teacher_id: toId },
        }),
      ),
    );
    setConfirmMoveOpen(false);
    setFromId("");
    setToId("");
  };

  return (
    <section
      aria-labelledby="bulk-reassign-title"
      className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          aria-hidden="true"
          className="w-9 h-9 rounded-xl bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
        >
          <ArrowRightLeft size={16} />
        </span>
        <h2
          id="bulk-reassign-title"
          className="text-base sm:text-lg font-extrabold text-[#0B2343]"
        >
          Bulk reassign
        </h2>
      </div>
      <p className="text-sm text-[#0B2343]/60 mt-1 mb-4 leading-relaxed max-w-3xl">
        Move every learner currently assigned to one teacher onto another.
        Useful when a teacher leaves the organisation or hits capacity.
      </p>

      <div className="flex flex-col md:flex-row md:items-end gap-3">
        <label className="flex flex-col gap-1 min-w-0 md:min-w-[220px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
            From teacher
          </span>
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
          >
            <option value="">— Select —</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.firstname} {t.lastname} ({t.assigned_learner_count} learners)
              </option>
            ))}
          </select>
        </label>

        <span
          aria-hidden="true"
          className="hidden md:flex items-center text-[#0B2343]/45 pb-2.5"
        >
          <ArrowRightLeft size={16} />
        </span>

        <label className="flex flex-col gap-1 min-w-0 md:min-w-[220px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
            To teacher
          </span>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
          >
            <option value="">— Select —</option>
            {teachers
              .filter((t) => t._id !== fromId)
              .map((t) => (
                <option key={t._id} value={t._id}>
                  {t.firstname} {t.lastname} ({t.assigned_learner_count}{" "}
                  learners)
                </option>
              ))}
          </select>
        </label>

        <div className="flex-1" />

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="Apply bulk reassignment"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors whitespace-nowrap"
        >
          {assignMutation.isPending && (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          )}
          {assignMutation.isPending
            ? "Moving…"
            : learnersToMove.length > 0
              ? `Move ${learnersToMove.length} learner${learnersToMove.length === 1 ? "" : "s"}`
              : "Move learners"}
        </button>
      </div>

      {/* Soft-cap projection — surfaced eagerly so the org admin sees the
          capacity overflow before they click Move. */}
      {projectedExceedsCap && toTeacher && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 mt-4"
        >
          <span
            aria-hidden="true"
            className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center"
          >
            <AlertTriangle size={16} />
          </span>
          <p className="text-sm text-amber-900 leading-relaxed">
            This would push{" "}
            <strong className="font-bold">
              {toTeacher.firstname} {toTeacher.lastname}
            </strong>{" "}
            to {projectedNewLoad} learners — over the{" "}
            {toTeacher.max_learners_per_teacher} cap. The move will still go
            through (capacity is a soft warning), but consider splitting the
            cohort across two teachers.
          </p>
        </div>
      )}

      {/* Bulk-move confirmation — design-system modal. */}
      <ConfirmModal
        open={confirmMoveOpen}
        onCancel={() => setConfirmMoveOpen(false)}
        onConfirm={confirmMove}
        title="Move learners?"
        titleId="bulk-reassign-confirm-title"
        tone="primary"
        confirmLabel={`Move ${learnersToMove.length} learner${learnersToMove.length === 1 ? "" : "s"}`}
        busy={assignMutation.isPending}
        message={
          <>
            Move{" "}
            <strong className="font-bold text-[#0B2343]">
              {learnersToMove.length} learner
              {learnersToMove.length === 1 ? "" : "s"}
            </strong>{" "}
            from{" "}
            <strong className="font-bold text-[#0B2343]">
              {fromTeacher?.firstname} {fromTeacher?.lastname}
            </strong>{" "}
            to{" "}
            <strong className="font-bold text-[#0B2343]">
              {toTeacher?.firstname} {toTeacher?.lastname}
            </strong>
            ?
            {projectedExceedsCap && toTeacher && (
              <>
                {" "}
                This pushes them over their {toTeacher.max_learners_per_teacher}
                -learner cap.
              </>
            )}
          </>
        }
      />
    </section>
  );
}
