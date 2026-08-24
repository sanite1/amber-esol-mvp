import type {
  AISessionMode,
  EsolLevel,
  FundingStatus,
  UlnStatus,
  DbsCheckStatus,
  SafeguardingLevel,
} from "../types/esol";

export const ESOL_LEVELS: EsolLevel[] = [
  "Entry 1",
  "Entry 2",
  "Entry 3",
  "Level 1",
  "Level 2",
];

export const SESSION_MODES: AISessionMode[] = ["BRIDGE", "ANCHOR", "IMMERSION"];

export const sessionModeLabel = (mode: AISessionMode): string => {
  switch (mode) {
    case "BRIDGE":
      return "Bridge";
    case "ANCHOR":
      return "Anchor";
    case "IMMERSION":
      return "Immersion";
  }
};

export const sessionModeDescription = (mode: AISessionMode): string => {
  switch (mode) {
    case "BRIDGE":
      return "English with occasional first-language support";
    case "ANCHOR":
      return "Vocabulary-focused practice";
    case "IMMERSION":
      return "English-only practice";
  }
};

export const sessionModeColours = (mode: AISessionMode) => {
  switch (mode) {
    case "BRIDGE":
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      };
    case "ANCHOR":
      return {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      };
    case "IMMERSION":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
      };
  }
};

export const fundingStatusLabel = (status?: FundingStatus | null): string => {
  switch (status) {
    case "esfa_funded":
      return "ESFA-funded";
    case "self_funded":
      return "Self-funded";
    case "employer_funded":
      return "Employer-funded";
    default:
      return "Not set";
  }
};

export const ulnStatusLabel = (status?: UlnStatus | null): string => {
  switch (status) {
    case "verified":
      return "Verified";
    case "pending":
      return "Pending";
    case "not_required":
      return "Not required";
    default:
      return "Not set";
  }
};

export const dbsStatusLabel = (status?: DbsCheckStatus | null): string => {
  switch (status) {
    case "clear":
    case "cleared":
      return "Clear";
    case "pending":
      return "Pending";
    case "flagged":
      return "Flagged";
    case "expired":
      return "Expired";
    default:
      return "Not set";
  }
};

export const safeguardingLevelColours = (level: SafeguardingLevel) => {
  switch (level) {
    case "critical":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
      };
    case "high":
      return {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-300",
      };
    case "medium":
      return {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-300",
      };
    case "low":
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      };
  }
};

export const formatDate = (iso?: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (iso?: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const initials = (firstname?: string, lastname?: string): string => {
  const f = firstname?.charAt(0) ?? "";
  const l = lastname?.charAt(0) ?? "";
  return `${f}${l}`.toUpperCase() || "?";
};
