function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#0B2343]/[0.06] rounded-lg animate-pulse ${className}`}
    />
  );
}

export function SummarySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3"
        >
          <Bone className="h-2.5 w-16 mb-1.5" />
          <Bone className="h-5 w-10" />
        </div>
      ))}
    </div>
  );
}

export function WeeklyScheduleSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 space-y-3">
      <Bone className="h-5 w-36 mb-2" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Bone className="h-5 w-9 rounded-full" />
          <Bone className="h-4 w-16" />
          <div className="flex-1 flex gap-2">
            <Bone className="h-8 w-28 rounded-lg" />
            <Bone className="h-8 w-28 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OverridesSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 space-y-3">
      <Bone className="h-5 w-32 mb-2" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 border border-[#0B2343]/[0.04] rounded-xl"
        >
          <Bone className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-3 w-32" />
            <Bone className="h-2.5 w-24" />
          </div>
          <Bone className="h-7 w-14 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 space-y-3">
      <Bone className="h-5 w-36 mb-2" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <Bone className="h-3 w-32" />
          <Bone className="h-8 w-36 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
