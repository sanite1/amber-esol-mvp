/**
 * Safeguarding response-text CMS — Final Addendum §2.
 *
 * Edits the pre-written crisis responses a learner sees the moment a
 * safeguarding disclosure is detected, per disclosure category per
 * language. Saves go live immediately (the backend reloads its
 * in-memory pre-cache) — no deployment.
 *
 * Empty non-English texts are valid: the lookup falls back to English
 * until a signed-off translation lands. English itself can't be
 * emptied (server-enforced) because it's the universal fall-back.
 */
import { useEffect, useState } from "react";
import { Languages, Loader2, ShieldAlert } from "lucide-react";
import {
  useSafeguardingMessages,
  useUpdateSafeguardingMessage,
} from "../api/safeguardingMessagesApi";

const CATEGORY_LABELS: Record<string, string> = {
  self_harm: "Self-harm",
  domestic_abuse: "Domestic abuse",
  radicalisation: "Radicalisation",
  child_concern: "Child concern",
  exploitation: "Exploitation",
  mental_health_crisis: "Mental health crisis",
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  ar: "Arabic",
  so: "Somali",
  fa: "Dari / Farsi",
  zh: "Chinese",
};

export default function SafeguardingMessages() {
  const { data, isLoading } = useSafeguardingMessages();
  const update = useUpdateSafeguardingMessage();

  const bank = data?.data?.bank ?? null;
  const categories = data?.data?.categories ?? [];
  const languages = data?.data?.languages ?? [];

  const [activeLang, setActiveLang] = useState("en");
  // Local draft state keyed `${category}|${language}` — hydrated from
  // the bank, edited freely, saved per cell.
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!bank) return;
    const next: Record<string, string> = {};
    for (const [cat, langs] of Object.entries(bank)) {
      for (const [lang, text] of Object.entries(langs)) {
        next[`${cat}|${lang}`] = text ?? "";
      }
    }
    setDrafts(next);
  }, [bank]);

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <Loader2
          size={24}
          className="text-[#ff7c22] animate-spin mx-auto mb-2"
          aria-hidden="true"
        />
        <p className="text-sm text-[#0B2343]/40">Loading response texts…</p>
      </div>
    );
  }

  return (
    <main
      aria-labelledby="sg-messages-heading"
      className="space-y-4 sm:space-y-5"
    >
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ShieldAlert
            size={18}
            className="text-[#ff7c22]"
            aria-hidden="true"
          />
          <h1
            id="sg-messages-heading"
            className="text-xl sm:text-2xl font-extrabold text-[#0B2343] leading-tight"
          >
            Safeguarding response texts
          </h1>
        </div>
        <p className="text-sm text-[#0B2343]/60 mt-2 leading-relaxed max-w-3xl">
          These are the pre-written messages a learner sees the instant a
          disclosure is detected — served from memory, never generated live.
          Saving updates the live platform immediately. A blank translation
          falls back to English; English itself can't be blank.
        </p>
      </section>

      {/* Language tabs */}
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setActiveLang(lang)}
            aria-pressed={activeLang === lang}
            className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-full text-xs font-bold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 ${
              activeLang === lang
                ? "bg-[#0B2343] border-[#0B2343] text-white"
                : "bg-white border-[#0B2343]/[0.12] text-[#0B2343]/70 hover:border-[#ff7c22]/40"
            }`}
          >
            <Languages size={12} aria-hidden="true" />
            {LANGUAGE_LABELS[lang] ?? lang}
          </button>
        ))}
      </div>

      {/* Category editors for the active language */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const key = `${cat}|${activeLang}`;
          const saved = bank?.[cat]?.[activeLang] ?? "";
          const draft = drafts[key] ?? "";
          const dirty = draft !== saved;
          const isRtl = activeLang === "ar" || activeLang === "fa";

          return (
            <section
              key={key}
              className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="text-sm font-extrabold text-[#0B2343]">
                  {CATEGORY_LABELS[cat] ?? cat}
                </h2>
                <button
                  type="button"
                  disabled={!dirty || update.isPending}
                  onClick={() =>
                    update.mutate({
                      category: cat,
                      language: activeLang,
                      text: draft,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-lg bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {update.isPending && (
                    <Loader2
                      size={11}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  {dirty ? "Save" : "Saved"}
                </button>
              </div>
              <label htmlFor={`sg-${key}`} className="sr-only">
                {CATEGORY_LABELS[cat] ?? cat} response text in{" "}
                {LANGUAGE_LABELS[activeLang] ?? activeLang}
              </label>
              <textarea
                id={`sg-${key}`}
                rows={4}
                dir={isRtl ? "rtl" : "ltr"}
                value={draft}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, [key]: e.target.value }))
                }
                placeholder={
                  activeLang === "en"
                    ? "English response (required — universal fall-back)"
                    : "Leave blank to fall back to English until a signed-off translation is ready"
                }
                className="w-full rounded-xl border border-[#0B2343]/[0.12] bg-[#fafbfc] px-4 py-3 text-sm text-[#0B2343] placeholder:text-[#0B2343]/30 leading-relaxed outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors resize-y min-h-[96px]"
                maxLength={2000}
              />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[11px] text-[#0B2343]/40">
                  {draft.length}/2000
                </p>
                {/* Learner-eye preview of the saved text */}
                {saved && !dirty && (
                  <p className="text-[11px] text-emerald-700">
                    Live on the platform
                  </p>
                )}
                {dirty && (
                  <p className="text-[11px] text-amber-700">Unsaved changes</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
