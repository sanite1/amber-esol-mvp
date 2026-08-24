/**
 * Session chrome copy bank + shared helpers — extracted from
 * AiTutorSession.tsx so the page file stays manageable. Used by
 * the unified session page (new + resumed sessions) and its
 * sub-components.
 */

import { LANGUAGES, LangCode } from "../../data/translations";

// ─────────────────────────────────────────────────────────────────────
// Language wiring (mirrors the PlacementAssessment pattern)
// ─────────────────────────────────────────────────────────────────────

// MVP banks (AI Tutor Brief §3): en, ar, yue (Cantonese), tr (Turkish).
// Deferred banks (so/fa/zh/bn/ur) are kept — not deleted — so any
// existing learner whose L1 is in the shelved set still renders, and
// the revenue-/coverage-triggered revival is a picker change, not a
// re-translate. Missing keys fall back to the `en` slot via t().
type BankLang =
  | "en"
  | "ar"
  | "yue"
  | "tr"
  // deferred (shelved behind the MVP picker gate)
  | "zh"
  | "so"
  | "fa"
  | "bn"
  | "ur";

const LANG_TO_BANK: Record<string, BankLang> = {
  // MVP
  en: "en",
  ar: "ar",
  yue: "yue", // Cantonese — own bank now (was folded into zh pre-MVP)
  tr: "tr",
  // deferred — mapped so existing data still renders
  "fa-AF": "fa",
  ps: "en",
  zh: "zh",
  so: "so",
  bn: "bn",
  ur: "ur",
};

const readSavedLang = (): LangCode => {
  if (typeof window === "undefined") return "en";
  const raw = window.localStorage.getItem("esol_lang");
  return (LANGUAGES.find((l) => l.code === raw)?.code ?? "en") as LangCode;
};

type CopyKey =
  | "loading_session"
  | "starting_message"
  | "resume_opening"
  | "typing"
  | "input_placeholder"
  | "input_label"
  | "send"
  | "exit"
  | "font_size"
  | "translate_toggle_label"
  | "translate_placeholder"
  | "safeguarding_break"
  | "session_complete_title"
  | "session_complete_score"
  | "session_complete_vocab"
  | "session_complete_finish"
  | "feedback_prompt"
  | "feedback_thanks"
  | "unread_title"
  | "unread_next"
  | "unread_done"
  | "unread_from_teacher"
  | "error_network"
  | "error_retry"
  // F32 speaking turns
  | "speak_prompt"
  | "speak_hint_typed"
  | "spoken_label"
  | "pron_clear"
  | "pron_mostly"
  | "pron_unclear"
  | "mic_record"
  | "mic_stop"
  | "mic_sending"
  | "mic_not_heard";

/**
 * Compact local i18n for the chat chrome. Wizard `translations.ts`
 * stays focused on wizard chrome; AI tutor chrome lives here so the
 * two grow independently.
 */
const COPY: Record<BankLang, Record<CopyKey, string>> = {
  en: {
    loading_session: "Loading your session…",
    starting_message: "Starting…",
    resume_opening:
      'Hi {name} — today we will practise "{topic}". Are you ready?',
    typing: "Amber is typing…",
    input_placeholder: "Type your message in English",
    input_label: "Your message",
    send: "Send",
    exit: "Exit session",
    font_size: "Text size",
    translate_toggle_label: "Show in my language",
    translate_placeholder: "Translation coming soon",
    safeguarding_break: "Take a break",
    session_complete_title: "Great work!",
    session_complete_score: "Your score",
    session_complete_vocab: "Words you have learned",
    session_complete_finish: "Finish",
    feedback_prompt: "How did this session feel?",
    feedback_thanks: "Thanks for your feedback!",
    unread_title: "A message from your teacher",
    unread_next: "Next",
    unread_done: "Start session",
    unread_from_teacher: "Your teacher",
    error_network:
      "Something went wrong. Please check your connection and try again.",
    error_retry: "Try again",
    // F32 speaking turns
    speak_prompt: "Say it out loud:",
    speak_hint_typed: "This one is for speaking. Tap the microphone to say it.",
    spoken_label: "Spoken answer",
    pron_clear: "Clear",
    pron_mostly: "Nearly there",
    pron_unclear: "Let's try that again",
    mic_record: "Record your answer",
    mic_stop: "Stop and send",
    mic_sending: "Sending your answer…",
    mic_not_heard: "Couldn't hear that. Try again, or type instead.",
  },
  ar: {
    loading_session: "جارٍ تحميل جلستك…",
    starting_message: "جارٍ البدء…",
    resume_opening: 'مرحباً {name} — اليوم سنتدرب على "{topic}". هل أنت مستعد؟',
    typing: "أمبر تكتب…",
    input_placeholder: "اكتب رسالتك بالإنجليزية",
    input_label: "رسالتك",
    send: "إرسال",
    exit: "الخروج من الجلسة",
    font_size: "حجم النص",
    translate_toggle_label: "عرض بلغتي",
    translate_placeholder: "الترجمة قريباً",
    safeguarding_break: "خذ استراحة",
    session_complete_title: "أحسنت!",
    session_complete_score: "نتيجتك",
    session_complete_vocab: "الكلمات التي تعلمتها",
    session_complete_finish: "إنهاء",
    feedback_prompt: "كيف كانت هذه الجلسة؟",
    feedback_thanks: "شكراً على ملاحظاتك!",
    unread_title: "رسالة من معلمك",
    unread_next: "التالي",
    unread_done: "ابدأ الجلسة",
    unread_from_teacher: "معلمك",
    error_network: "حدث خطأ ما. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
    error_retry: "حاول مرة أخرى",
    // F32 speaking turns
    speak_prompt: "قلها بصوت عالٍ:",
    speak_hint_typed: "هذه للتحدث. اضغط على الميكروفون لقولها.",
    spoken_label: "إجابة منطوقة",
    pron_clear: "واضح",
    pron_mostly: "قريب جداً",
    pron_unclear: "لنحاول مرة أخرى",
    mic_record: "سجّل إجابتك",
    mic_stop: "إيقاف وإرسال",
    mic_sending: "جارٍ إرسال إجابتك…",
    mic_not_heard: "لم أسمع ذلك. حاول مرة أخرى أو اكتب بدلاً من ذلك.",
  },
  so: {
    loading_session: "Waxaa la soo dejinayaa kalfadhigaaga…",
    starting_message: "Waa la bilaabayaa…",
    resume_opening:
      'Hello {name} — maanta waxaan ku tababaranaynaa "{topic}". Diyaar ma tahay?',
    typing: "Amber waxay qortaa…",
    input_placeholder: "Ku qor fariintaada Ingiriisi",
    input_label: "Fariintaada",
    send: "Dir",
    exit: "Ka bax kalfadhiga",
    font_size: "Cabbirka qoraalka",
    translate_toggle_label: "Ku tus afkayga",
    translate_placeholder: "Tarjumaadda waa la soo bandhigi doonaa",
    safeguarding_break: "Qaad nasasho",
    session_complete_title: "Shaqo wanaagsan!",
    session_complete_score: "Buundadaada",
    session_complete_vocab: "Erayada aad bartay",
    session_complete_finish: "Dhammee",
    feedback_prompt: "Sidee buu kalfadhigan dareemay?",
    feedback_thanks: "Mahadsanid jawaabtaada!",
    unread_title: "Fariin ka timid macallinkaaga",
    unread_next: "Xiga",
    unread_done: "Bilow kalfadhi",
    unread_from_teacher: "Macallinkaaga",
    error_network:
      "Wax baa qaldamay. Fadlan hubi xiriirkaaga oo mar kale isku day.",
    error_retry: "Mar kale isku day",
    // F32 speaking turns — en fallback copy (deferred bank)
    speak_prompt: "Say it out loud:",
    speak_hint_typed: "This one is for speaking. Tap the microphone to say it.",
    spoken_label: "Spoken answer",
    pron_clear: "Clear",
    pron_mostly: "Nearly there",
    pron_unclear: "Let's try that again",
    mic_record: "Record your answer",
    mic_stop: "Stop and send",
    mic_sending: "Sending your answer…",
    mic_not_heard: "Couldn't hear that. Try again, or type instead.",
  },
  fa: {
    loading_session: "در حال بارگذاری جلسه شما…",
    starting_message: "در حال شروع…",
    resume_opening:
      'سلام {name} — امروز "{topic}" را تمرین می‌کنیم. آماده‌اید؟',
    typing: "Amber در حال تایپ کردن است…",
    input_placeholder: "پیام خود را به انگلیسی بنویسید",
    input_label: "پیام شما",
    send: "ارسال",
    exit: "خروج از جلسه",
    font_size: "اندازه متن",
    translate_toggle_label: "نمایش به زبان من",
    translate_placeholder: "ترجمه به زودی",
    safeguarding_break: "استراحت کنید",
    session_complete_title: "آفرین!",
    session_complete_score: "امتیاز شما",
    session_complete_vocab: "کلماتی که یاد گرفته‌اید",
    session_complete_finish: "پایان",
    feedback_prompt: "این جلسه چطور بود؟",
    feedback_thanks: "ممنون از بازخورد شما!",
    unread_title: "پیامی از معلم شما",
    unread_next: "بعدی",
    unread_done: "شروع جلسه",
    unread_from_teacher: "معلم شما",
    error_network:
      "مشکلی پیش آمد. لطفاً اتصال خود را بررسی کرده و دوباره امتحان کنید.",
    error_retry: "دوباره امتحان کنید",
    // F32 speaking turns — en fallback copy (deferred bank)
    speak_prompt: "Say it out loud:",
    speak_hint_typed: "This one is for speaking. Tap the microphone to say it.",
    spoken_label: "Spoken answer",
    pron_clear: "Clear",
    pron_mostly: "Nearly there",
    pron_unclear: "Let's try that again",
    mic_record: "Record your answer",
    mic_stop: "Stop and send",
    mic_sending: "Sending your answer…",
    mic_not_heard: "Couldn't hear that. Try again, or type instead.",
  },
  zh: {
    loading_session: "正在載入您的課程…",
    starting_message: "開始中…",
    resume_opening: "你好 {name} — 今天我們會練習「{topic}」。準備好了嗎？",
    typing: "Amber 正在打字…",
    input_placeholder: "用英語輸入您的訊息",
    input_label: "您的訊息",
    send: "傳送",
    exit: "離開課程",
    font_size: "文字大小",
    translate_toggle_label: "顯示我的語言",
    translate_placeholder: "翻譯功能即將推出",
    safeguarding_break: "休息一下",
    session_complete_title: "做得好!",
    session_complete_score: "您的分數",
    session_complete_vocab: "您學會的單字",
    session_complete_finish: "完成",
    feedback_prompt: "這次的課程感覺如何?",
    feedback_thanks: "感謝您的回饋!",
    unread_title: "來自老師的訊息",
    unread_next: "下一個",
    unread_done: "開始課程",
    unread_from_teacher: "您的老師",
    error_network: "出現了問題。請檢查您的網路連線並重試。",
    error_retry: "再試一次",
    // F32 speaking turns — en fallback copy (deferred bank)
    speak_prompt: "Say it out loud:",
    speak_hint_typed: "This one is for speaking. Tap the microphone to say it.",
    spoken_label: "Spoken answer",
    pron_clear: "Clear",
    pron_mostly: "Nearly there",
    pron_unclear: "Let's try that again",
    mic_record: "Record your answer",
    mic_stop: "Stop and send",
    mic_sending: "Sending your answer…",
    mic_not_heard: "Couldn't hear that. Try again, or type instead.",
  },
  // MVP — Cantonese (yue-HK). Rendered in written Traditional Chinese,
  // which serves Cantonese readers for formal UI chrome. FLAG: confirm
  // with a native Cantonese speaker before pilot; spoken-Cantonese
  // particles aren't used here as this is screen chrome, not dialogue.
  yue: {
    loading_session: "正在載入您的課程…",
    starting_message: "開始中…",
    resume_opening: "你好 {name} — 今日我哋會練習「{topic}」。準備好未？",
    typing: "Amber 正在打字…",
    input_placeholder: "用英語輸入您的訊息",
    input_label: "您的訊息",
    send: "傳送",
    exit: "離開課程",
    font_size: "文字大小",
    translate_toggle_label: "顯示我的語言",
    translate_placeholder: "翻譯功能即將推出",
    safeguarding_break: "休息一下",
    session_complete_title: "做得好!",
    session_complete_score: "您的分數",
    session_complete_vocab: "您學會的單字",
    session_complete_finish: "完成",
    feedback_prompt: "這次的課程感覺如何?",
    feedback_thanks: "感謝您的回饋!",
    unread_title: "來自老師的訊息",
    unread_next: "下一個",
    unread_done: "開始課程",
    unread_from_teacher: "您的老師",
    error_network: "出現了問題。請檢查您的網路連線並重試。",
    error_retry: "再試一次",
    // F32 speaking turns
    speak_prompt: "大聲講出嚟：",
    speak_hint_typed: "呢題要講出嚟。撳咪高風講。",
    spoken_label: "口講答案",
    pron_clear: "清楚",
    pron_mostly: "差少少",
    pron_unclear: "再試一次",
    mic_record: "錄低你嘅答案",
    mic_stop: "停止並發送",
    mic_sending: "發送緊你嘅答案…",
    mic_not_heard: "聽唔到。再試一次，或者打字。",
  },
  // MVP — Turkish (tr-TR). Launch-territory language (Enfield/Haringey).
  // FLAG: machine-then-reviewed draft; confirm with a native Turkish
  // speaker before pilot. Chrome strings only — Amber's tutor turns are
  // server-side and remain English-driven.
  tr: {
    loading_session: "Oturumunuz yükleniyor…",
    starting_message: "Başlıyor…",
    resume_opening:
      'Merhaba {name} — bugün "{topic}" konusunu çalışacağız. Hazır mısın?',
    typing: "Amber yazıyor…",
    input_placeholder: "Mesajınızı İngilizce yazın",
    input_label: "Mesajınız",
    send: "Gönder",
    exit: "Oturumdan çık",
    font_size: "Yazı boyutu",
    translate_toggle_label: "Kendi dilimde göster",
    translate_placeholder: "Çeviri yakında geliyor",
    safeguarding_break: "Ara ver",
    session_complete_title: "Harika iş!",
    session_complete_score: "Puanınız",
    session_complete_vocab: "Öğrendiğiniz kelimeler",
    session_complete_finish: "Bitir",
    feedback_prompt: "Bu oturum nasıldı?",
    feedback_thanks: "Geri bildiriminiz için teşekkürler!",
    unread_title: "Öğretmeninizden bir mesaj",
    unread_next: "İleri",
    unread_done: "Oturumu başlat",
    unread_from_teacher: "Öğretmeniniz",
    error_network:
      "Bir şeyler ters gitti. Lütfen bağlantınızı kontrol edip tekrar deneyin.",
    error_retry: "Tekrar dene",
    // F32 speaking turns
    speak_prompt: "Yüksek sesle söyle:",
    speak_hint_typed: "Bu konuşma içindir. Söylemek için mikrofona dokun.",
    spoken_label: "Sesli cevap",
    pron_clear: "Net",
    pron_mostly: "Neredeyse",
    pron_unclear: "Tekrar deneyelim",
    mic_record: "Cevabını kaydet",
    mic_stop: "Durdur ve gönder",
    mic_sending: "Cevabın gönderiliyor…",
    mic_not_heard: "Duyamadım. Tekrar dene ya da yaz.",
  },
  // Phase 5 / BE-F — Bengali. Translations co-authored with a
  // native speaker; chrome strings only (Amber's tutor turns are
  // server-side and remain English-driven). Any key the renderer
  // requests but is absent here falls back to COPY.en via t().
  bn: {
    loading_session: "আপনার সেশন লোড হচ্ছে…",
    starting_message: "শুরু হচ্ছে…",
    resume_opening:
      'হ্যালো {name} — আজ আমরা "{topic}" অনুশীলন করব। আপনি কি প্রস্তুত?',
    typing: "Amber টাইপ করছে…",
    input_placeholder: "ইংরেজিতে আপনার বার্তা লিখুন",
    input_label: "আপনার বার্তা",
    send: "পাঠান",
    exit: "সেশন থেকে বের হন",
    font_size: "লেখার আকার",
    translate_toggle_label: "আমার ভাষায় দেখান",
    translate_placeholder: "অনুবাদ শীঘ্রই আসছে",
    safeguarding_break: "একটু বিরতি নিন",
    session_complete_title: "চমৎকার কাজ!",
    session_complete_score: "আপনার স্কোর",
    session_complete_vocab: "আপনি শিখেছেন এমন শব্দ",
    session_complete_finish: "শেষ করুন",
    feedback_prompt: "এই সেশনটি কেমন লাগল?",
    feedback_thanks: "আপনার মতামতের জন্য ধন্যবাদ!",
    unread_title: "আপনার শিক্ষকের কাছ থেকে একটি বার্তা",
    unread_next: "পরবর্তী",
    unread_done: "সেশন শুরু করুন",
    unread_from_teacher: "আপনার শিক্ষক",
    error_network:
      "কিছু একটা ভুল হয়েছে। অনুগ্রহ করে সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
    error_retry: "আবার চেষ্টা করুন",
    // F32 speaking turns — en fallback copy (deferred bank)
    speak_prompt: "Say it out loud:",
    speak_hint_typed: "This one is for speaking. Tap the microphone to say it.",
    spoken_label: "Spoken answer",
    pron_clear: "Clear",
    pron_mostly: "Nearly there",
    pron_unclear: "Let's try that again",
    mic_record: "Record your answer",
    mic_stop: "Stop and send",
    mic_sending: "Sending your answer…",
    mic_not_heard: "Couldn't hear that. Try again, or type instead.",
  },
  // Phase 5 / BE-F — Urdu. Same translation philosophy as bn; the
  // RTL handling happens at the HTML root (lang/dir) — these strings
  // stay character-encoded and don't carry Unicode bidi controls.
  ur: {
    loading_session: "آپ کا سیشن لوڈ ہو رہا ہے…",
    starting_message: "شروع ہو رہا ہے…",
    resume_opening:
      'ہیلو {name} — آج ہم "{topic}" کی مشق کریں گے۔ کیا آپ تیار ہیں؟',
    typing: "Amber لکھ رہا ہے…",
    input_placeholder: "اپنا پیغام انگریزی میں لکھیں",
    input_label: "آپ کا پیغام",
    send: "بھیجیں",
    exit: "سیشن سے باہر نکلیں",
    font_size: "متن کا سائز",
    translate_toggle_label: "میری زبان میں دکھائیں",
    translate_placeholder: "ترجمہ جلد آ رہا ہے",
    safeguarding_break: "تھوڑا وقفہ لیں",
    session_complete_title: "زبردست!",
    session_complete_score: "آپ کا اسکور",
    session_complete_vocab: "آپ نے جو الفاظ سیکھے",
    session_complete_finish: "ختم کریں",
    feedback_prompt: "یہ سیشن کیسا لگا؟",
    feedback_thanks: "آپ کی رائے کا شکریہ!",
    unread_title: "آپ کے استاد کی طرف سے ایک پیغام",
    unread_next: "اگلا",
    unread_done: "سیشن شروع کریں",
    unread_from_teacher: "آپ کا استاد",
    error_network:
      "کچھ غلط ہو گیا۔ براہ کرم اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔",
    error_retry: "دوبارہ کوشش کریں",
    // F32 speaking turns — en fallback copy (deferred bank)
    speak_prompt: "Say it out loud:",
    speak_hint_typed: "This one is for speaking. Tap the microphone to say it.",
    spoken_label: "Spoken answer",
    pron_clear: "Clear",
    pron_mostly: "Nearly there",
    pron_unclear: "Let's try that again",
    mic_record: "Record your answer",
    mic_stop: "Stop and send",
    mic_sending: "Sending your answer…",
    mic_not_heard: "Couldn't hear that. Try again, or type instead.",
  },
};

const t = (
  bank: BankLang,
  key: CopyKey,
  vars?: Record<string, string | number>,
): string => {
  let out = COPY[bank][key] ?? COPY.en[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars))
      out = out.replace(`{${k}}`, String(v));
  }
  return out;
};

// ─────────────────────────────────────────────────────────────────────
// State machine + message model
// ─────────────────────────────────────────────────────────────────────
type FontSize = "sm" | "md" | "lg";

const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const formatTimer = (startMs: number): string => {
  const elapsedSec = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
  const m = Math.floor(elapsedSec / 60);
  const s = elapsedSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────

export { LANG_TO_BANK, readSavedLang, COPY, t, FONT_SIZE_CLASSES, formatTimer };
export type { BankLang, CopyKey, FontSize };
