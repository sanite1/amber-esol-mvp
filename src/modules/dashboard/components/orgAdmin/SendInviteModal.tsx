import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Mail, Loader2, Copy, CheckCheck, AlertCircle } from "lucide-react";
import { useCreateReferral } from "../../lib/api/esolReferral";
import { ESOL_LEVELS } from "../../lib/utils/esolHelpers";

const schema = z.object({
  email: z.string().optional(),
  esolLevel: z.string().optional(),
  expiresInDays: z.coerce.number().int().min(1).max(365).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SendInviteModal({ open, onClose }: Props) {
  const { mutateAsync: createReferral, isPending } = useCreateReferral();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { expiresInDays: 30 },
  });

  if (!open) return null;

  const onSubmit = async (data: FormData) => {
    try {
      const res = await createReferral({
        email: data.email || undefined,
        esolLevel: data.esolLevel || undefined,
        expiresInDays: data.expiresInDays,
      });
      setInviteUrl(res.data.inviteUrl);
    } catch {
      // Toast handled in hook
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    reset();
    setInviteUrl(null);
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#0B2343]/[0.06]">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B2343]">
              Invite a learner
            </h2>
            <p className="text-xs text-[#0B2343]/40 mt-0.5">
              Generate an invitation link
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={18} className="text-[#0B2343]/50" />
          </button>
        </div>

        <div className="p-6">
          {inviteUrl ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-start gap-3">
                  <CheckCheck
                    size={18}
                    className="text-emerald-600 shrink-0 mt-0.5"
                  />
                  <div className="text-sm text-emerald-800">
                    <p className="font-semibold">Invitation created</p>
                    <p className="text-xs mt-1">
                      The link below is unique to this invitation. Share it with
                      your learner.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                  Invitation link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 px-4 py-3 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-xs text-[#0B2343] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-4 py-3 bg-[#ff7c22] text-white text-xs font-bold rounded-xl hover:bg-[#e56a10] transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCheck size={14} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 border border-[#0B2343]/[0.08] text-sm font-bold text-[#0B2343]/60 rounded-xl hover:bg-[#0B2343]/[0.02] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                  Learner email (optional)
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                  />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="learner@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                      errors.email
                        ? "border-red-300"
                        : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email.message}
                  </p>
                )}
                <p className="text-[11px] text-[#0B2343]/35 mt-1.5">
                  If provided, the invitation email is sent automatically.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                  Assigned ESOL level (optional)
                </label>
                <select
                  {...register("esolLevel")}
                  className="w-full px-4 py-3 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none appearance-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
                >
                  <option value="">Set later</option>
                  {ESOL_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                  Expires in (days)
                </label>
                <input
                  type="number"
                  {...register("expiresInDays")}
                  min={1}
                  max={365}
                  className="w-full px-4 py-3 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating…
                  </>
                ) : (
                  "Generate invitation"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
