import { useEffect, useState } from "react";
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
} from "lucide-react";
import {
  useListVocab,
  useUpdateMastery,
  type VocabItem,
} from "../../lib/api/esolVocab";
import { ESOL_LEVELS, formatDate } from "../../lib/utils/esolHelpers";

const PER_PAGE = 30;

export default function EsolVocab() {
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

  const { mutate: updateMastery } = useUpdateMastery();

  const vocab = data?.data?.vocab ?? [];
  const pagination = data?.data?.pagination;

  const masteredCount = vocab.filter(
    (v) => (v.masteryScore ?? 0) >= 0.7,
  ).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          Your vocabulary
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1">
          Words and phrases you've encountered in your AI tutor sessions. Tap
          thumbs up if you've mastered a word.
        </p>
      </div>

      {!isLoading && vocab.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            label="Total words"
            value={String(pagination?.total ?? vocab.length)}
            icon={Library}
            colour="from-amber-50 to-amber-100/40"
            iconBg="bg-amber-100"
            iconColour="text-amber-700"
          />
          <StatCard
            label="Mastered (this page)"
            value={String(masteredCount)}
            icon={CheckCircle2}
            colour="from-emerald-50 to-emerald-100/40"
            iconBg="bg-emerald-100"
            iconColour="text-emerald-700"
          />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/30"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your vocabulary…"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
        >
          <option value="">All levels</option>
          {ESOL_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="p-12 text-center">
          <Loader2
            size={24}
            className="text-[#ff7c22] animate-spin mx-auto mb-2"
          />
          <p className="text-sm text-[#0B2343]/40">Loading your vocabulary…</p>
        </div>
      ) : vocab.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
            <Library size={20} className="text-[#0B2343]/30" />
          </div>
          <p className="text-sm font-semibold text-[#0B2343]">
            {search || levelFilter ? "No matches" : "No vocabulary yet"}
          </p>
          <p className="text-xs text-[#0B2343]/40 mt-1">
            {search || levelFilter
              ? "Try a different filter."
              : "Words you encounter in AI sessions will appear here."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vocab.map((item) => (
              <VocabCard
                key={item._id}
                item={item}
                onUpdateMastery={(score) =>
                  updateMastery({ vocabId: item._id, masteryScore: score })
                }
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-4">
              <p className="text-xs text-[#0B2343]/50">
                Page {pagination.page} of {pagination.totalPages} ·{" "}
                {pagination.total} words
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-md border border-[#0B2343]/[0.08] disabled:opacity-30 hover:bg-white transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-md border border-[#0B2343]/[0.08] disabled:opacity-30 hover:bg-white transition-colors"
                >
                  <ChevronRight size={14} />
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
  onUpdateMastery,
}: {
  item: VocabItem;
  onUpdateMastery: (score: number) => void;
}) {
  const isMastered = (item.masteryScore ?? 0) >= 0.7;
  const needsPractice =
    !isMastered && item.masteryScore !== undefined && item.masteryScore > 0;

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        isMastered
          ? "bg-emerald-50/40 border-emerald-200"
          : "bg-white border-[#0B2343]/[0.06] hover:border-amber-200 hover:bg-amber-50/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-extrabold text-[#0B2343]">{item.word}</p>
          <p className="text-[11px] text-[#0B2343]/40 mt-1">
            {item.topic ? `From: ${item.topic}` : "General practice"}
            {" · "}
            {formatDate(item.introducedAt)}
          </p>
        </div>
        {isMastered ? (
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-1" />
        ) : (
          <Circle size={16} className="text-[#0B2343]/20 shrink-0 mt-1" />
        )}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#0B2343]/[0.04]">
        <button
          onClick={() => onUpdateMastery(0.9)}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
            isMastered
              ? "bg-emerald-100 text-emerald-700"
              : "bg-[#0B2343]/[0.04] text-[#0B2343]/60 hover:bg-emerald-50 hover:text-emerald-700"
          }`}
        >
          <ThumbsUp size={11} /> I know this
        </button>
        <button
          onClick={() => onUpdateMastery(0.2)}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
            needsPractice
              ? "bg-amber-100 text-amber-700"
              : "bg-[#0B2343]/[0.04] text-[#0B2343]/60 hover:bg-amber-50 hover:text-amber-700"
          }`}
        >
          <ThumbsDown size={11} /> Need practice
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
}: {
  label: string;
  value: string;
  icon: typeof Library;
  colour: string;
  iconBg: string;
  iconColour: string;
}) {
  return (
    <div
      className={`relative p-5 rounded-2xl bg-gradient-to-br ${colour} border border-[#0B2343]/[0.04]`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#0B2343]/50 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-extrabold text-[#0B2343] mt-2">{value}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          <Icon size={18} className={iconColour} />
        </div>
      </div>
    </div>
  );
}
