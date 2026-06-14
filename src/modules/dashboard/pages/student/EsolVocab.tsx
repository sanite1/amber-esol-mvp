import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Library,
  Loader2,
  Search,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Sparkles,
  Repeat,
  MessageCircle,
} from "lucide-react";
import {
  useListVocab,
  useUpdateMastery,
  type VocabItem,
} from "../../lib/api/esolVocab";
import { formatDate } from "../../lib/utils/esolHelpers";

const PER_PAGE = 30;

/** Ledger rows store level codes ("e1"…"l2"); show the display form. */
const LEVEL_OPTIONS = [
  { code: "e1", label: "Entry 1" },
  { code: "e2", label: "Entry 2" },
  { code: "e3", label: "Entry 3" },
  { code: "l1", label: "Level 1" },
  { code: "l2", label: "Level 2" },
] as const;

const levelLabel = (code?: string | null): string | null => {
  if (!code) return null;
  const hit = LEVEL_OPTIONS.find((o) => o.code === code.trim().toLowerCase());
  return hit ? hit.label : code;
};

const isWordMastered = (v: VocabItem): boolean =>
  (v.masteryScore ?? 0) >= 0.7 || v.retained === true;

export default function EsolVocab() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, levelFilter]);

  const { data, isLoading } = useListVocab({
    page,
    limit: PER_PAGE,
    search: debouncedSearch || undefined,
    esolLevel: levelFilter || undefined,
  });

  const { mutate: updateMastery, isPending: masteryPending } =
    useUpdateMastery();

  const vocab = data?.data?.vocab ?? [];
  const stats = data?.data?.stats;
  const pagination = data?.data?.pagination;
  const hasAnyVocab = (stats?.total ?? 0) > 0;
  const filtering = Boolean(debouncedSearch || levelFilter);

  return (
    <div className="space-y-5">
      {/* Header + practise CTA */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
            Your vocabulary
          </h1>
          <p className="text-sm text-[#0B2343]/50 mt-1">
            Words and phrases from your AI tutor sessions. Words you keep using
            well are marked as learned automatically — or tap thumbs up when you
            know one.
          </p>
        </div>
        {hasAnyVocab && (
          <button
            type="button"
            onClick={() => navigate("/esol/scenarios")}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
          >
            <MessageCircle size={15} aria-hidden="true" />
            Practise in a session
          </button>
        )}
      </div>

      {/* Learner-wide stats — stable while searching/filtering */}
      {hasAnyVocab && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            label="Total words"
            value={String(stats.total)}
            icon={Library}
            colour="from-amber-50 to-amber-100/40"
            iconBg="bg-amber-100"
            iconColour="text-amber-700"
          />
          <StatCard
            label="Mastered"
            value={String(stats.mastered)}
            icon={CheckCircle2}
            colour="from-emerald-50 to-emerald-100/40"
            iconBg="bg-emerald-100"
            iconColour="text-emerald-700"
          />
          <StatCard
            label="To practise"
            value={String(stats.needs_practice)}
            icon={Repeat}
            colour="from-sky-50 to-sky-100/40"
            iconBg="bg-sky-100"
            iconColour="text-sky-700"
            className="col-span-2 sm:col-span-1"
          />
        </div>
      )}

      {/* Search + level filter */}
      {hasAnyVocab && (
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/30"
              aria-hidden="true"
            />
            <label htmlFor="vocab-search" className="sr-only">
              Search your vocabulary
            </label>
            <input
              id="vocab-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your vocabulary…"
              className="w-full pl-11 pr-4 py-2.5 min-h-[44px] rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
          </div>
          <label htmlFor="vocab-level" className="sr-only">
            Filter by level
          </label>
          <select
            id="vocab-level"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2.5 min-h-[44px] rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
          >
            <option value="">All levels</option>
            {LEVEL_OPTIONS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center">
          <Loader2
            size={24}
            className="text-[#ff7c22] animate-spin mx-auto mb-2"
            aria-hidden="true"
          />
          <p className="text-sm text-[#0B2343]/40">Loading your vocabulary…</p>
        </div>
      ) : vocab.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-10 sm:p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
            <Library
              size={20}
              className="text-[#0B2343]/30"
              aria-hidden="true"
            />
          </div>
          <p className="text-sm font-semibold text-[#0B2343]">
            {filtering ? "No matches" : "No vocabulary yet"}
          </p>
          <p className="text-xs text-[#0B2343]/40 mt-1 max-w-sm mx-auto">
            {filtering
              ? "Try a different search or level filter."
              : "Every new word your AI tutor introduces in a session is saved here so you can revisit it any time."}
          </p>
          {!filtering && (
            <button
              type="button"
              onClick={() => navigate("/esol/scenarios")}
              className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
            >
              <MessageCircle size={15} aria-hidden="true" />
              Start your first scenario
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vocab.map((item) => (
              <VocabCard
                key={item._id}
                item={item}
                busy={masteryPending}
                onUpdateMastery={(score) =>
                  updateMastery({ vocabId: item._id, masteryScore: score })
                }
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-1 sm:px-4">
              <p className="text-xs text-[#0B2343]/50">
                Page {pagination.page} of {pagination.totalPages} ·{" "}
                {pagination.total} words
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Previous page"
                  className="p-2.5 rounded-md border border-[#0B2343]/[0.08] disabled:opacity-30 hover:bg-white transition-colors"
                >
                  <ChevronLeft size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Next page"
                  className="p-2.5 rounded-md border border-[#0B2343]/[0.08] disabled:opacity-30 hover:bg-white transition-colors"
                >
                  <ChevronRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function VocabCard({
  item,
  busy,
  onUpdateMastery,
}: {
  item: VocabItem;
  busy: boolean;
  onUpdateMastery: (score: number) => void;
}) {
  const mastered = isWordMastered(item);
  const needsPractice =
    !mastered && item.masteryScore !== undefined && item.masteryScore > 0;
  const encounters = item.times_encountered ?? 0;
  const level = levelLabel(item.esolLevel);
  const lastSeen = item.last_seen_at ?? item.introducedAt;

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        mastered
          ? "bg-emerald-50/40 border-emerald-200"
          : "bg-white border-[#0B2343]/[0.06] hover:border-amber-200 hover:bg-amber-50/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-extrabold text-[#0B2343] break-words">
            {item.word}
          </p>
          <p className="text-[11px] text-[#0B2343]/40 mt-1">
            {item.topic ? `From: ${item.topic}` : "General practice"}
            {" · "}
            {formatDate(lastSeen)}
          </p>
        </div>
        {mastered ? (
          <CheckCircle2
            size={16}
            className="text-emerald-600 shrink-0 mt-1"
            aria-label="Mastered"
          />
        ) : (
          <Circle
            size={16}
            className="text-[#0B2343]/20 shrink-0 mt-1"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Progress chips — encounters / level / auto-retention */}
      <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
        {encounters > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0B2343]/[0.05] text-[10px] font-bold text-[#0B2343]/60">
            <Repeat size={9} aria-hidden="true" />
            Seen {encounters}×
          </span>
        )}
        {level && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-[10px] font-bold text-sky-700">
            {level}
          </span>
        )}
        {item.retained && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700">
            <Sparkles size={9} aria-hidden="true" />
            Learned in sessions
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#0B2343]/[0.04]">
        <button
          type="button"
          disabled={busy}
          onClick={() => onUpdateMastery(0.9)}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[36px] rounded-lg text-[11px] font-bold transition-colors disabled:opacity-50 ${
            mastered
              ? "bg-emerald-100 text-emerald-700"
              : "bg-[#0B2343]/[0.04] text-[#0B2343]/60 hover:bg-emerald-50 hover:text-emerald-700"
          }`}
        >
          <ThumbsUp size={11} aria-hidden="true" /> I know this
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onUpdateMastery(0.2)}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[36px] rounded-lg text-[11px] font-bold transition-colors disabled:opacity-50 ${
            needsPractice
              ? "bg-amber-100 text-amber-700"
              : "bg-[#0B2343]/[0.04] text-[#0B2343]/60 hover:bg-amber-50 hover:text-amber-700"
          }`}
        >
          <ThumbsDown size={11} aria-hidden="true" /> Need practice
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  colour,
  iconBg,
  iconColour,
  className = "",
}: {
  label: string;
  value: string;
  icon: typeof Library;
  colour: string;
  iconBg: string;
  iconColour: string;
  className?: string;
}) {
  return (
    <div
      className={`relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${colour} border border-[#0B2343]/[0.04] ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#0B2343]/50 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] mt-2">
            {value}
          </p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          <Icon size={18} className={iconColour} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
