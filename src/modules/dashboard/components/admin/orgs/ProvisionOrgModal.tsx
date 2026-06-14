import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Modal from "../../../../../components/Modal";
import { useProvisionOrg } from "../../../lib/api/esolOrg";

const schema = z.object({
  name: z.string().min(2, "Organisation name is required"),
  contactEmail: z.string().email("Valid email required"),
  contactName: z.string().min(2, "Contact name is required"),
  phoneNumber: z.string().optional(),
  paymentModel: z.string(),
  invoiceCycle: z.string(),
  maxLearners: z.coerce.number().int().min(1).optional(),
  ilrProviderRef: z.string().optional(),
  contractStart: z.string().optional(),
  contractEnd: z.string().optional(),
  adminFirstname: z.string().min(1, "Admin first name required"),
  adminLastname: z.string().min(1, "Admin last name required"),
  adminEmail: z.string().email("Valid admin email required"),
  adminPhoneNumber: z.string().min(7, "Admin phone required"),
  adminPassword: z
    .string()
    .min(8, "Min 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Must contain uppercase, lowercase, and a number",
    ),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProvisionOrgModal({ open, onClose }: Props) {
  const { mutateAsync: provisionOrg, isPending } = useProvisionOrg();
  const [success, setSuccess] = useState<{
    orgName: string;
    adminEmail: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      paymentModel: "invoiced",
      invoiceCycle: "monthly",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await provisionOrg({
        ...data,
        paymentModel: data.paymentModel as "invoiced" | "stripe",
        invoiceCycle: data.invoiceCycle as "monthly" | "quarterly" | "annual",
        contractStart: data.contractStart || undefined,
        contractEnd: data.contractEnd || undefined,
        phoneNumber: data.phoneNumber || undefined,
        ilrProviderRef: data.ilrProviderRef || undefined,
      });
      setSuccess({
        orgName: res.data.organisation.name,
        adminEmail: res.data.adminUser.email,
      });
    } catch {
      // Toast handled in hook
    }
  };

  const handleClose = () => {
    reset();
    setSuccess(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Provision new organisation"
      titleId="provision-org-title"
      size="lg"
      disableEscapeKey={isPending}
      disableBackdropClick={isPending}
    >
      <Modal.Body>
        {success ? (
          /* ── Success state ── */
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle2
                size={26}
                aria-hidden="true"
                className="text-emerald-600"
              />
            </div>
            <h3 className="text-lg font-extrabold text-[#0B2343]">
              {success.orgName} provisioned
            </h3>
            <p className="text-sm text-[#0B2343]/55 mt-2">
              A verification email has been sent to{" "}
              <strong>{success.adminEmail}</strong>. Once they verify, they can
              sign in and start managing learners.
            </p>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <p className="text-sm text-[#0B2343]/70 leading-relaxed mb-4">
              Create the organisation and its primary admin account.
            </p>
            <form
              id="provision-org-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <Section title="Organisation details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Organisation name" error={errors.name?.message}>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="Acme Training Ltd"
                      className={inputClasses(Boolean(errors.name))}
                    />
                  </Field>
                  <Field
                    label="Contact name"
                    error={errors.contactName?.message}
                  >
                    <input
                      type="text"
                      {...register("contactName")}
                      placeholder="Jane Smith"
                      className={inputClasses(Boolean(errors.contactName))}
                    />
                  </Field>
                  <Field
                    label="Contact email"
                    error={errors.contactEmail?.message}
                  >
                    <input
                      type="email"
                      {...register("contactEmail")}
                      placeholder="contact@acme.org"
                      className={inputClasses(Boolean(errors.contactEmail))}
                    />
                  </Field>
                  <Field label="Phone number">
                    <input
                      type="tel"
                      {...register("phoneNumber")}
                      placeholder="+44 …"
                      className={inputClasses(false)}
                    />
                  </Field>
                  <Field label="Payment model">
                    <select
                      {...register("paymentModel")}
                      className={inputClasses(false)}
                    >
                      <option value="invoiced">Invoiced</option>
                      <option value="stripe">Stripe</option>
                    </select>
                  </Field>
                  <Field label="Invoice cycle">
                    <select
                      {...register("invoiceCycle")}
                      className={inputClasses(false)}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </Field>
                  <Field label="Max learners">
                    <input
                      type="number"
                      {...register("maxLearners")}
                      min={1}
                      placeholder="Unlimited"
                      className={inputClasses(false)}
                    />
                  </Field>
                  <Field label="ILR provider reference">
                    <input
                      type="text"
                      {...register("ilrProviderRef")}
                      placeholder="UKPRN"
                      className={inputClasses(false)}
                    />
                  </Field>
                  <Field label="Contract starts">
                    <input
                      type="date"
                      {...register("contractStart")}
                      className={inputClasses(false)}
                    />
                  </Field>
                  <Field label="Contract ends">
                    <input
                      type="date"
                      {...register("contractEnd")}
                      className={inputClasses(false)}
                    />
                  </Field>
                </div>
              </Section>

              <Section title="Organisation admin">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field
                    label="First name"
                    error={errors.adminFirstname?.message}
                  >
                    <input
                      type="text"
                      {...register("adminFirstname")}
                      className={inputClasses(Boolean(errors.adminFirstname))}
                    />
                  </Field>
                  <Field
                    label="Last name"
                    error={errors.adminLastname?.message}
                  >
                    <input
                      type="text"
                      {...register("adminLastname")}
                      className={inputClasses(Boolean(errors.adminLastname))}
                    />
                  </Field>
                  <Field label="Email" error={errors.adminEmail?.message}>
                    <input
                      type="email"
                      {...register("adminEmail")}
                      className={inputClasses(Boolean(errors.adminEmail))}
                    />
                  </Field>
                  <Field label="Phone" error={errors.adminPhoneNumber?.message}>
                    <input
                      type="tel"
                      {...register("adminPhoneNumber")}
                      placeholder="+44 …"
                      className={inputClasses(Boolean(errors.adminPhoneNumber))}
                    />
                  </Field>
                  <Field
                    label="Initial password"
                    error={errors.adminPassword?.message}
                  >
                    <input
                      type="text"
                      {...register("adminPassword")}
                      placeholder="Min. 8 chars, mixed case + number"
                      className={inputClasses(Boolean(errors.adminPassword))}
                    />
                  </Field>
                </div>
              </Section>
            </form>
          </>
        )}
      </Modal.Body>
      <Modal.Actions>
        {success ? (
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
          >
            Done
          </button>
        ) : (
          <>
            <button
              type="submit"
              form="provision-org-form"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
            >
              {isPending && (
                <Loader2
                  size={14}
                  aria-hidden="true"
                  className="animate-spin"
                />
              )}
              {isPending ? "Provisioning…" : "Provision organisation"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
}

const inputClasses = (hasError: boolean): string =>
  `block w-full rounded-xl bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 ${
    hasError
      ? "border border-red-300 focus-visible:ring-red-500"
      : "border border-[#0B2343]/[0.12] focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
  }`;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-bold text-[#0B2343]/60 uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle size={12} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}
