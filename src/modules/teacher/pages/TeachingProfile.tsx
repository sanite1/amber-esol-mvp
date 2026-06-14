/**
 * Teaching profile editor — the teacher-side input to needs-based
 * learner matching.
 *
 * Three multi-select chip groups (levels taught, languages spoken,
 * specialisms). What the teacher declares here drives which new
 * learners are auto-assigned to them and how they rank in the org
 * admin's "suggested teachers" panel:
 *   - levels act as a hard filter (when set)
 *   - a shared language is the strongest boost
 *   - specialisms boost matching learner needs (exam route, work)
 *
 * Leaving everything empty is safe — the teacher stays eligible for
 * all learners and assignment falls back to load-balancing.
 */
import { useEffect, useState } from "react";
import { GraduationCap, Languages, Loader2, Sparkles } from "lucide-react";
import {
  useTeachingProfile,
  useUpdateTeachingProfile,
} from "../api/teachingProfileApi";
import { ESOL_L1_LANGUAGES } from "../../../lib/data/languages";

const LEVELS: Array<{ code: string; label: string }> = [
  { code: "e1", label: "Entry 1" },
  { code: "e2", label: "Entry 2" },
  { code: "e3", label: "Entry 3" },
  { code: "l1", label: "Level 1" },
  { code: "l2", label: "Level 2" },
];

const SPECIALISMS: Array<{ key: string; label: string; hint: string }> = [
  {
    key: "exam_preparation",
    label: "Exam preparation",
    hint: "Regulated ESOL qualifications and exam technique",
  },
  {
    key: "employability",
    label: "Employability",
    hint: "Workplace English, CVs, interviews",
  },
  {
    key: "everyday_english",
    label: "Everyday English",
    hint: "Conversation, community life, services",
  },
  {
    key: "family_learning",
    label: "Family learning",
    hint: "Supporting parents — schools, healthcare",
  },
  {
    key: "send_support",
    label: "SEND support",
    hint: "Experience with additional learning needs",
  },
  {
    key: "digital_skills",
    label: "Digital skills",
    hint: "Blending essential digital skills into English",
  },
];

// "Other" is a learner-side catch-all — meaningless as a teacher
// matching signal, so it's not offered here.
const LANGUAGE_OPTIONS = ESOL_L1_LANGUAGES.filter((l) => l !== "Other");

const toggle = (list: string[], value: string): string[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export default function TeachingProfile() {
  const { data, isLoading } = useTeachingProfile();
  const { mutate: save, isPending: saving } = useUpdateTeachingProfile();

  const [levels, setLevels] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [specialisms, setSpecialisms] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate local state once from the fetched profile.
  useEffect(() => {
    const profile = data?.data?.teaching_profile;
    if (profile && !hydrated) {
      setLevels(profile.levels_taught ?? []);
      setLanguages(profile.languages_spoken ?? []);
      setSpecialisms(profile.specialisms ?? []);
      setHydrated(true);
    }
  }, [data, hydrated]);

  const handleSave = () =>
    save({
      levels_taught: levels,
      languages_spoken: languages,
      specialisms,
    });

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <Loader2
          size={24}
          className="text-[#ff7c22] animate-spin mx-auto mb-2"
          aria-hidden="true"
        />
        <p className="text-sm text-[#0B2343]/40">Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          Teaching profile
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1 max-w-2xl">
          New learners are matched to teachers using this profile — the levels
          you teach, the languages you speak, and your specialisms. Leaving a
          section empty means "no preference": you stay eligible for every
          learner.
        </p>
      </div>

      {/* Levels taught */}
      <section className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap
            size={15}
            className="text-[#ff7c22]"
            aria-hidden="true"
          />
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
            Levels you teach
          </h2>
        </div>
        <p className="text-xs text-[#0B2343]/45 mb-3">
          Learners outside these levels won't be auto-assigned to you.
        </p>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <ChipToggle
              key={l.code}
              label={l.label}
              selected={levels.includes(l.code)}
              onToggle={() => setLevels((prev) => toggle(prev, l.code))}
            />
          ))}
        </div>
      </section>

      {/* Languages spoken */}
      <section className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-1">
          <Languages size={15} className="text-[#ff7c22]" aria-hidden="true" />
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
            Languages you speak
          </h2>
        </div>
        <p className="text-xs text-[#0B2343]/45 mb-3">
          Sharing a learner's first language is the strongest matching signal —
          especially for Entry-level learners.
        </p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <ChipToggle
              key={lang}
              label={lang}
              selected={languages.includes(lang)}
              onToggle={() => setLanguages((prev) => toggle(prev, lang))}
            />
          ))}
        </div>
      </section>

      {/* Specialisms */}
      <section className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={15} className="text-[#ff7c22]" aria-hidden="true" />
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
            Specialisms
          </h2>
        </div>
        <p className="text-xs text-[#0B2343]/45 mb-3">
          Used to match learners whose goals fit your strengths — e.g.
          exam-route learners to exam-preparation specialists.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SPECIALISMS.map((s) => {
            const selected = specialisms.includes(s.key);
            return (
              <button
                key={s.key}
                type="button"
                aria-pressed={selected}
                onClick={() => setSpecialisms((prev) => toggle(prev, s.key))}
                className={`text-left rounded-xl border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 ${
                  selected
                    ? "bg-[#fff8ee] border-[#ff7c22]/40"
                    : "bg-white border-[#0B2343]/[0.08] hover:border-[#ff7c22]/30"
                }`}
              >
                <p
                  className={`text-sm font-bold ${
                    selected ? "text-[#ff7c22]" : "text-[#0B2343]"
                  }`}
                >
                  {s.label}
                </p>
                <p className="text-[11px] text-[#0B2343]/45 mt-0.5 leading-snug">
                  {s.hint}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 disabled:opacity-60 transition-colors"
        >
          {saving && (
            <Loader2 size={15} className="animate-spin" aria-hidden="true" />
          )}
          Save profile
        </button>
      </div>
    </div>
  );
}

function ChipToggle({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`px-3 py-2 min-h-[36px] rounded-full text-xs font-bold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 ${
        selected
          ? "bg-[#ff7c22] border-[#ff7c22] text-white"
          : "bg-white border-[#0B2343]/[0.12] text-[#0B2343]/70 hover:border-[#ff7c22]/40 hover:text-[#0B2343]"
      }`}
    >
      {label}
    </button>
  );
}
