import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Upload,
  FileText,
  AlertCircle,
  Sparkles,
  Lock,
} from "lucide-react";
import {
  useGetPlacementQuestions,
  useCompleteOnboarding,
  type PlacementAnswer,
  type OnboardingPayload,
  type OnboardingResult,
} from "../../lib/api/esolOnboarding";
import PasswordInput from "../../../../components/PasswordInput";
import {
  NATIONALITIES,
  UK_ETHNICITY_GROUPS,
} from "../../../../lib/data/demographics";
import { ESOL_L1_LANGUAGES } from "../../../../lib/data/languages";

// Tigrinya is excluded from MVP per the Project Silk brief —
// no frontier LLM has confirmed reliable Tigrinya support yet.
// Re-add in v1.1 after Tigrinya-speaking ESOL professional evaluation.
//
// Shared with the teacher teaching-profile editor — matching compares
// learner L1 and teacher languages verbatim, so both pickers must use
// the same list. See src/lib/data/languages.ts.
const LANGUAGES = ESOL_L1_LANGUAGES;

// NATIONALITIES + UK_ETHNICITY_GROUPS come from the shared
// src/lib/data/demographics.ts module — the previous inline
// 19-entry nationality shortlist forced most learners into
// "Other", which defeats equality monitoring.

interface Props {
  token: string;
  prefilledEmail?: string | null;
  onSuccess: (result: OnboardingResult) => void;
}

type Step =
  | "language"
  | "personal"
  | "background"
  | "document"
  | "assessment"
  | "uln"
  | "review";

export default function EsolOnboardingWizard({
  token,
  prefilledEmail,
  onSuccess,
}: Props) {
  const { data: questionsData, isLoading: questionsLoading } =
    useGetPlacementQuestions();
  const { mutateAsync: complete, isPending: isSubmitting } =
    useCompleteOnboarding();

  const [step, setStep] = useState<Step>("language");
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [l1Language, setL1Language] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState(prefilledEmail ?? "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  // Home postcode BEFORE joining the programme — the ILR SOF routing
  // field. Required so the export can derive the funding authority.
  const [postcodePrior, setPostcodePrior] = useState("");
  const [nationality, setNationality] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [lldd, setLldd] = useState<1 | 2 | 9>(2);
  // Brief-mandated 4-value enum; replaces the prior 3-value version
  // ("in_training" was not a valid brief value).
  const [employment, setEmployment] = useState<
    "unemployed" | "employed" | "self_employed" | "not_in_labour_market"
  >("unemployed");
  const [file, setFile] = useState<File | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [uln, setUln] = useState("");

  const questions = questionsData?.data?.questions ?? [];

  const STEP_ORDER: Step[] = [
    "language",
    "personal",
    "background",
    "document",
    "assessment",
    "uln",
    "review",
  ];
  const stepIndex = STEP_ORDER.indexOf(step);
  const totalSteps = STEP_ORDER.length;

  const goNext = (next: Step) => {
    setError(null);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setError(null);
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
  };

  const handleSubmit = async () => {
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const assessmentResponses: PlacementAnswer[] = Object.entries(answers).map(
      ([questionId, answer]) => ({ questionId, answer }),
    );

    if (!postcodePrior.trim()) {
      setError("Please enter your home postcode before joining this programme");
      return;
    }

    const payload: OnboardingPayload = {
      token,
      firstname,
      lastname,
      email,
      phoneNumber,
      password,
      dateOfBirth: dateOfBirth || undefined,
      // Sent in the brief's canonical snake_case name. The wizard collects
      // ONE postcode and labels it explicitly so learners aren't confused
      // between past and current home postcode.
      postcode_prior: postcodePrior.trim().toUpperCase(),
      nationality: nationality || undefined,
      ethnicity: ethnicity || undefined,
      l1Language,
      lldd_health_prob: lldd,
      employment_status: employment,
      uln: uln || undefined,
      assessmentResponses,
    };

    try {
      const res = await complete({ payload, file: file ?? undefined });
      onSuccess(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Onboarding failed. Please try again.",
      );
    }
  };

  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-[#0B2343]/50 mb-2">
          <span>
            Step {stepIndex + 1} of {totalSteps}
          </span>
          <span>{Math.round(((stepIndex + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-[#0B2343]/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ff7c22] transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {step === "language" && (
        <StepLanguage
          value={l1Language}
          onChange={setL1Language}
          onNext={() => l1Language && goNext("personal")}
        />
      )}

      {step === "personal" && (
        <StepPersonal
          firstname={firstname}
          lastname={lastname}
          email={email}
          phoneNumber={phoneNumber}
          password={password}
          confirmPassword={confirmPassword}
          dateOfBirth={dateOfBirth}
          postcodePrior={postcodePrior}
          emailDisabled={Boolean(prefilledEmail)}
          onChange={(field: string, value: string) => {
            const setters: Record<string, (v: string) => void> = {
              firstname: setFirstname,
              lastname: setLastname,
              email: setEmail,
              phoneNumber: setPhoneNumber,
              password: setPassword,
              confirmPassword: setConfirmPassword,
              dateOfBirth: setDateOfBirth,
              postcodePrior: setPostcodePrior,
            };
            setters[field]?.(value);
          }}
          onBack={goBack}
          onNext={() => {
            if (
              !firstname ||
              !lastname ||
              !email ||
              !phoneNumber ||
              !password ||
              !postcodePrior.trim()
            ) {
              setError(
                "Please complete all required fields, including your home postcode",
              );
              return;
            }
            goNext("background");
          }}
        />
      )}

      {step === "background" && (
        <StepBackground
          nationality={nationality}
          ethnicity={ethnicity}
          lldd={lldd}
          employment={employment}
          onChange={{
            nationality: setNationality,
            ethnicity: setEthnicity,
            lldd: setLldd as any,
            employment: setEmployment as any,
          }}
          onBack={goBack}
          onNext={() => goNext("document")}
        />
      )}

      {step === "document" && (
        <StepDocument
          file={file}
          onFileChange={setFile}
          onBack={goBack}
          onNext={() => goNext("assessment")}
        />
      )}

      {step === "assessment" && (
        <StepAssessment
          questions={questions}
          loading={questionsLoading}
          answers={answers}
          onAnswerChange={(qid: string, val: string) =>
            setAnswers((a) => ({ ...a, [qid]: val }))
          }
          onBack={goBack}
          onNext={() => goNext("uln")}
        />
      )}

      {step === "uln" && (
        <StepUln
          value={uln}
          onChange={setUln}
          onBack={goBack}
          onNext={() => goNext("review")}
        />
      )}

      {step === "review" && (
        <StepReview
          summary={{
            firstname,
            lastname,
            email,
            l1Language,
            assessmentCount: Object.keys(answers).length,
            documentUploaded: Boolean(file),
          }}
          isSubmitting={isSubmitting}
          onBack={goBack}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

// ── Step 1: Language ──────────────────────────────────────────────────
function StepLanguage({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-[#0B2343]">
        What is your first language?
      </h2>
      <p className="text-sm text-[#0B2343]/50 mt-2">
        We use this to teach you English at the right pace using your own
        language as a bridge.
      </p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => onChange(lang)}
            className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-colors ${
              value === lang
                ? "border-[#ff7c22] bg-[#ff7c22]/5 text-[#0B2343]"
                : "border-[#0B2343]/[0.08] bg-white text-[#0B2343]/70 hover:border-[#0B2343]/20"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!value}
        className="mt-8 w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
      >
        Continue <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ── Step 2: Personal ──────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors";

function StepPersonal({
  firstname,
  lastname,
  email,
  phoneNumber,
  password,
  confirmPassword,
  dateOfBirth,
  postcodePrior,
  emailDisabled,
  onChange,
  onBack,
  onNext,
}: any) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-[#0B2343]">Your details</h2>
      <p className="text-sm text-[#0B2343]/50 mt-2">
        Tell us a little about yourself.
      </p>
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" required>
            <input
              type="text"
              value={firstname}
              onChange={(e) => onChange("firstname", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Last name" required>
            <input
              type="text"
              value={lastname}
              onChange={(e) => onChange("lastname", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Email" required>
          <input
            type="email"
            value={email}
            disabled={emailDisabled}
            onChange={(e) => onChange("email", e.target.value)}
            aria-describedby={emailDisabled ? "email-locked-hint" : undefined}
            className={`${inputCls} disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-[#0B2343]/[0.03]`}
          />
          {emailDisabled && (
            <p
              id="email-locked-hint"
              className="text-[11px] text-[#0B2343]/55 mt-1.5 flex items-center gap-1"
            >
              <Lock size={11} aria-hidden="true" />
              This invitation was sent to this email address — it can't be
              changed. Need a different address? Ask your organisation to send a
              new invitation.
            </p>
          )}
        </Field>
        <Field label="Phone number" required>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            placeholder="+44 7700 900000"
            className={inputCls}
          />
        </Field>
        <Field label="Date of birth">
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => onChange("dateOfBirth", e.target.value)}
            className={inputCls}
          />
        </Field>
        {/*
          Postcode field label is explicit ("before joining this programme")
          per brief Function 2 — learners are likely to misread "home
          postcode" as their current address. The value is auto-uppercased
          on submit; we don't pattern-validate client-side so unusual UK
          formats (e.g. crown dependencies) aren't blocked.
        */}
        <Field
          label="Your home postcode before joining this programme"
          required
        >
          <input
            type="text"
            value={postcodePrior}
            onChange={(e) =>
              onChange("postcodePrior", e.target.value.toUpperCase())
            }
            placeholder="e.g. M1 1AE"
            autoComplete="postal-code"
            className={inputCls}
          />
          <p className="text-xs text-[#0B2343]/50 mt-1.5">
            We use this to record your funding region. If you have moved since,
            enter the postcode where you lived when you joined this programme.
          </p>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" required>
            <PasswordInput
              value={password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="Min. 8 characters"
              className={inputCls}
              revealButtonTabbable
            />
          </Field>
          <Field label="Confirm password" required>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              className={inputCls}
              revealButtonTabbable
            />
          </Field>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

// ── Step 3: Background ────────────────────────────────────────────────
function StepBackground({
  nationality,
  ethnicity,
  lldd,
  employment,
  onChange,
  onBack,
  onNext,
}: any) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-[#0B2343]">
        A few more questions
      </h2>
      <p className="text-sm text-[#0B2343]/50 mt-2">
        We collect this information for funding and equality monitoring. It is
        kept private.
      </p>
      <div className="mt-6 space-y-4">
        <Field label="Nationality">
          <select
            value={nationality}
            onChange={(e) => onChange.nationality(e.target.value)}
            className={inputCls}
          >
            <option value="">Prefer not to say</option>
            {NATIONALITIES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ethnicity (optional)">
          {/* Grouped UK ONS categories (Census 2021) — free text
              can't be aggregated for ILR equality monitoring. */}
          <select
            value={ethnicity}
            onChange={(e) => onChange.ethnicity(e.target.value)}
            className={inputCls}
          >
            <option value="">Prefer not to say</option>
            {UK_ETHNICITY_GROUPS.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="Do you have any learning difficulties or disabilities you would like us to know about?">
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: 2, label: "No" },
              { v: 1, label: "Yes" },
              { v: 9, label: "Prefer not to say" },
            ].map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => onChange.lldd(opt.v)}
                className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-colors ${
                  lldd === opt.v
                    ? "border-[#ff7c22] bg-[#ff7c22]/5"
                    : "border-[#0B2343]/[0.08] bg-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Employment status">
          {/*
            Four values per brief Function 3 column spec — the ILR export
            and ASF earnings-threshold logic depend on this exact enum.
            UI labels are learner-friendly; the value stays the brief's
            snake_case enum value.
          */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: "unemployed", label: "Not working" },
              { v: "employed", label: "Working (employed)" },
              { v: "self_employed", label: "Self-employed" },
              {
                v: "not_in_labour_market",
                label: "Not looking for work right now",
              },
            ].map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => onChange.employment(opt.v)}
                className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-colors text-left ${
                  employment === opt.v
                    ? "border-[#ff7c22] bg-[#ff7c22]/5"
                    : "border-[#0B2343]/[0.08] bg-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

// ── Step 4: Document ──────────────────────────────────────────────────
function StepDocument({
  file,
  onFileChange,
  onBack,
  onNext,
}: {
  file: File | null;
  onFileChange: (f: File | null) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-[#0B2343]">
        Upload your status document
      </h2>
      <p className="text-sm text-[#0B2343]/50 mt-2">
        Please upload a photo or PDF of your Home Office status document. This
        helps us check your eligibility for funded learning.
      </p>
      <div className="mt-6">
        <label className="block">
          <input
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            className="sr-only"
          />
          <div className="border-2 border-dashed border-[#0B2343]/[0.12] rounded-2xl p-8 text-center cursor-pointer hover:border-[#ff7c22]/40 hover:bg-[#ff7c22]/[0.02] transition-colors">
            {file ? (
              <>
                <FileText size={32} className="text-[#ff7c22] mx-auto mb-3" />
                <p className="text-sm font-bold text-[#0B2343]">{file.name}</p>
                <p className="text-xs text-[#0B2343]/40 mt-1">
                  {(file.size / 1024).toFixed(0)} KB · click to replace
                </p>
              </>
            ) : (
              <>
                <Upload size={32} className="text-[#0B2343]/30 mx-auto mb-3" />
                <p className="text-sm font-bold text-[#0B2343]">
                  Choose a file
                </p>
                <p className="text-xs text-[#0B2343]/40 mt-1">
                  JPG, PNG or PDF — max 10 MB
                </p>
              </>
            )}
          </div>
        </label>
      </div>
      <p className="text-xs text-[#0B2343]/40 mt-4">
        Your document is stored securely in the EU and is only used to verify
        your eligibility. You can skip this step if you do not have your
        document with you — your account will be flagged for manual review.
      </p>
      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextLabel={file ? "Continue" : "Skip & continue"}
      />
    </div>
  );
}

// ── Step 5: Assessment ────────────────────────────────────────────────
function StepAssessment({
  questions,
  loading,
  answers,
  onAnswerChange,
  onBack,
  onNext,
}: any) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 size={24} className="text-[#ff7c22] animate-spin mx-auto" />
        <p className="text-sm text-[#0B2343]/50 mt-3">
          Loading the placement assessment…
        </p>
      </div>
    );
  }
  return (
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff7c22]/10 mb-3">
        <Sparkles size={11} className="text-[#ff7c22]" />
        <span className="text-[10px] font-bold text-[#ff7c22] uppercase tracking-wider">
          Placement assessment
        </span>
      </div>
      <h2 className="text-2xl font-extrabold text-[#0B2343]">
        Let's find your level
      </h2>
      <p className="text-sm text-[#0B2343]/50 mt-2">
        Answer these questions as best you can. Don't worry if you don't know an
        answer — you can guess or leave it blank.
      </p>
      <div className="mt-6 space-y-6">
        {questions.map((q: any, i: number) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5"
          >
            <p className="text-[10px] font-bold text-[#0B2343]/40 uppercase tracking-wider mb-2">
              Question {i + 1} of {questions.length}
            </p>
            <p className="text-sm font-semibold text-[#0B2343] mb-4 leading-relaxed">
              {q.prompt}
            </p>
            {q.type === "multiple_choice" ? (
              <div className="space-y-2">
                {q.options?.map((opt: string) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onAnswerChange(q.id, opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-colors ${
                      answers[q.id] === opt
                        ? "border-[#ff7c22] bg-[#ff7c22]/5 text-[#0B2343] font-bold"
                        : "border-[#0B2343]/[0.08] bg-[#fafbfc] text-[#0B2343]/70 hover:border-[#0B2343]/20"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                value={answers[q.id] ?? ""}
                onChange={(e) => onAnswerChange(q.id, e.target.value)}
                rows={3}
                placeholder="Write your answer in English…"
                className="w-full px-4 py-3 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none resize-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
              />
            )}
          </div>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

// ── Step 6: ULN ───────────────────────────────────────────────────────
function StepUln({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-[#0B2343]">
        Unique Learner Number (ULN)
      </h2>
      <p className="text-sm text-[#0B2343]/50 mt-2">
        Your ULN is a 10-digit number used by UK education providers. If you
        already have one, please enter it. If not, you can skip this step —
        we'll help you get one later.
      </p>
      <div className="mt-6">
        <Field label="ULN (optional)">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="10-digit number"
            maxLength={10}
            className={inputCls}
          />
        </Field>
        <p className="text-[11px] text-[#0B2343]/40 mt-2">
          Don't have one? Visit gov.uk/education/unique-learner-number after you
          finish onboarding.
        </p>
      </div>
      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextLabel={value ? "Continue" : "Skip & continue"}
      />
    </div>
  );
}

// ── Step 7: Review ────────────────────────────────────────────────────
function StepReview({
  summary,
  isSubmitting,
  onBack,
  onSubmit,
}: {
  summary: any;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-[#0B2343]">Almost done</h2>
      <p className="text-sm text-[#0B2343]/50 mt-2">
        Please review your information. Once you submit, we'll create your
        account and place you at the right English level.
      </p>
      <div className="mt-6 space-y-3">
        <ReviewRow
          label="Name"
          value={`${summary.firstname} ${summary.lastname}`}
        />
        <ReviewRow label="Email" value={summary.email} />
        <ReviewRow label="First language" value={summary.l1Language} />
        <ReviewRow
          label="Status document"
          value={
            summary.documentUploaded
              ? "Uploaded"
              : "Skipped — will be flagged for manual review"
          }
        />
        <ReviewRow
          label="Assessment"
          value={`${summary.assessmentCount} questions answered`}
        />
      </div>
      <div className="mt-6 p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 leading-relaxed">
        By creating your account you agree to our Terms of Service and Privacy
        Policy. Your data is stored securely in the UK and EU.
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-5 py-3.5 border border-[#0B2343]/[0.08] text-sm font-bold text-[#0B2343]/60 rounded-xl hover:bg-[#0B2343]/[0.02] transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Creating your
              account…
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> Create my account
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
        {label} {required && <span className="text-[#ff7c22]">*</span>}
      </label>
      {children}
    </div>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="flex gap-3 mt-8">
      <button
        onClick={onBack}
        className="px-5 py-3.5 border border-[#0B2343]/[0.08] text-sm font-bold text-[#0B2343]/60 rounded-xl hover:bg-[#0B2343]/[0.02] transition-colors"
      >
        <ArrowLeft size={16} />
      </button>
      <button
        onClick={onNext}
        className="flex-1 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors flex items-center justify-center gap-2"
      >
        {nextLabel} <ArrowRight size={16} />
      </button>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#0B2343]/[0.04] last:border-0">
      <span className="text-xs text-[#0B2343]/50">{label}</span>
      <span className="text-sm font-semibold text-[#0B2343] text-right ml-4">
        {value}
      </span>
    </div>
  );
}
