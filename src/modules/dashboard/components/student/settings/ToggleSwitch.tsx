interface Props {
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({ enabled, onChange, disabled }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
        enabled ? "bg-[#ff7c22]" : "bg-[#0B2343]/[0.1]"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
