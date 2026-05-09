import {
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { useGetOrg } from "../../lib/api/esolOrg";
import { getDecodedJwt } from "../../lib/auth";
import { formatDate } from "../../lib/utils/esolHelpers";

export default function OrgSettings() {
  const user = getDecodedJwt();
  const orgId = user?.orgId ?? undefined;
  const { data, isLoading } = useGetOrg(orgId ?? undefined);

  const org = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-[#ff7c22] animate-spin" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-[#0B2343]/50">
          Organisation details unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          Organisation
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1">
          Your organisation's settings and contract details.
        </p>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0B2343] flex items-center justify-center">
            {org.logoUrl ? (
              <img
                src={org.logoUrl}
                alt={org.name}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <Building2 size={28} className="text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#0B2343]">
              {org.name}
            </h2>
            <p className="text-xs text-[#0B2343]/40 mt-1">@{org.slug}</p>
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                  org.isActive
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-red-700 bg-red-50"
                }`}
              >
                {org.isActive ? "Active" : "Inactive"}
              </span>
              <span className="text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-2 py-1 rounded-md bg-[#0B2343]/[0.04]">
                {org.paymentModel === "invoiced" ? "Invoiced" : "Stripe"}
              </span>
              <span className="text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-2 py-1 rounded-md bg-[#0B2343]/[0.04]">
                {org.invoiceCycle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact details */}
      <Section title="Contact details">
        <DetailRow icon={Mail} label="Contact email" value={org.contactEmail} />
        <DetailRow
          icon={Building2}
          label="Contact name"
          value={org.contactName}
        />
        <DetailRow icon={Phone} label="Phone" value={org.phoneNumber || "—"} />
        {org.address && (
          <DetailRow
            icon={MapPin}
            label="Address"
            value={[
              org.address.street,
              org.address.city,
              org.address.postcode,
              org.address.country,
            ]
              .filter(Boolean)
              .join(", ")}
          />
        )}
      </Section>

      {/* Contract */}
      <Section title="Contract & funding">
        <DetailRow
          label="Contract starts"
          value={formatDate(org.contractStart)}
        />
        <DetailRow label="Contract ends" value={formatDate(org.contractEnd)} />
        <DetailRow
          label="Maximum learners"
          value={org.maxLearners ? String(org.maxLearners) : "Unlimited"}
        />
        <DetailRow
          icon={FileText}
          label="ILR provider reference"
          value={org.ilrProviderRef || "Not set"}
        />
      </Section>

      <p className="text-xs text-[#0B2343]/35 text-center">
        To update organisation details, please contact your Amber Training
        account manager.
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#0B2343]/[0.06]">
        <h3 className="text-sm font-extrabold text-[#0B2343]">{title}</h3>
      </div>
      <div className="px-6 py-2">{children}</div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#0B2343]/[0.04] last:border-0">
      <div className="flex items-center gap-2 text-xs text-[#0B2343]/50">
        {Icon && <Icon size={13} />}
        {label}
      </div>
      <p className="text-sm font-semibold text-[#0B2343] text-right">{value}</p>
    </div>
  );
}
