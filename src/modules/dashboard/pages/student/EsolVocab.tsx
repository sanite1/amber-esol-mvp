import { useState, useMemo } from "react";
import { Library, Loader2, Search } from "lucide-react";
import { useListSessions } from "../../lib/api/esolSession";

export default function EsolVocab() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useListSessions({ limit: 50 });

  const allVocab = useMemo(() => {
    const sessions = data?.data?.sessions ?? [];
    const seen = new Set<string>();
    const result: { word: string; topic?: string; date: string }[] = [];
    for (const session of sessions) {
      for (const word of session.vocabIntroduced ?? []) {
        const key = word.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          result.push({
            word,
            topic: session.topic ?? undefined,
            date: session.createdAt,
          });
        }
      }
    }
    return result;
  }, [data]);

  const filtered = search
    ? allVocab.filter((v) =>
        v.word.toLowerCase().includes(search.toLowerCase()),
      )
    : allVocab;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          Your vocabulary
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1">
          Words and phrases you've encountered in your AI tutor sessions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
        <div className="relative">
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
      </div>

      {isLoading ? (
        <div className="p-12 text-center">
          <Loader2
            size={24}
            className="text-[#ff7c22] animate-spin mx-auto mb-2"
          />
          <p className="text-sm text-[#0B2343]/40">Loading your vocabulary…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
            <Library size={20} className="text-[#0B2343]/30" />
          </div>
          <p className="text-sm font-semibold text-[#0B2343]">
            {search ? "No matches" : "No vocabulary yet"}
          </p>
          <p className="text-xs text-[#0B2343]/40 mt-1">
            {search
              ? "Try a different search."
              : "Words you encounter in AI sessions will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item, i) => (
            <div
              key={`${item.word}-${i}`}
              className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 hover:border-amber-200 hover:bg-amber-50/30 transition-colors"
            >
              <p className="text-base font-extrabold text-[#0B2343]">
                {item.word}
              </p>
              <p className="text-[11px] text-[#0B2343]/40 mt-1">
                {item.topic ? `From: ${item.topic}` : "General practice"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
