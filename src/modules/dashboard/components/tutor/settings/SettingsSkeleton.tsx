function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#0B2343]/[0.06] ${className}`}
    />
  );
}

export function SettingsSectionSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 sm:p-5 space-y-4">
      <Bone className="h-4 w-32" />
      <div className="space-y-3">
        <Bone className="h-10 w-full rounded-xl" />
        <Bone className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2.5">
        <Bone className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
        <div className="space-y-1.5">
          <Bone className="h-5 w-20" />
          <Bone className="h-3 w-36" />
        </div>
      </div>
      <SettingsSectionSkeleton />
      <SettingsSectionSkeleton />
      <SettingsSectionSkeleton />
    </div>
  );
}
