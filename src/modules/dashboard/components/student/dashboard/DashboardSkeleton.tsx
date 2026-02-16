function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#0B2343]/[0.06] rounded-lg animate-pulse ${className}`}
    />
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4"
        >
          <Bone className="h-3 w-16 mb-2" />
          <Bone className="h-6 w-10" />
        </div>
      ))}
    </div>
  );
}

export function UpcomingLessonsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 space-y-3">
      <Bone className="h-4 w-32 mb-1" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Bone className="w-9 h-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-3 w-36" />
            <Bone className="h-2.5 w-24" />
          </div>
          <Bone className="h-7 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SpendingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bone className="w-7 h-7 rounded-lg" />
        <Bone className="h-4 w-20" />
      </div>
      <Bone className="h-16 w-full rounded-xl mb-3" />
      <div className="grid grid-cols-2 gap-2">
        <Bone className="h-12 rounded-lg" />
        <Bone className="h-12 rounded-lg" />
      </div>
    </div>
  );
}

export function MessagesSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 space-y-3">
      <Bone className="h-4 w-32 mb-1" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Bone className="w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-3 w-28" />
            <Bone className="h-2.5 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bone className="w-7 h-7 rounded-lg" />
        <Bone className="h-4 w-28" />
      </div>
      <Bone className="h-10 w-full rounded-xl mb-3" />
      <div className="grid grid-cols-3 gap-2">
        <Bone className="h-10 rounded-lg" />
        <Bone className="h-10 rounded-lg" />
        <Bone className="h-10 rounded-lg" />
      </div>
    </div>
  );
}

export function RecommendedSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
      <Bone className="h-4 w-40 mb-3" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-3 rounded-xl border border-[#0B2343]/[0.04]"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <Bone className="w-9 h-9 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Bone className="h-3 w-24" />
                <Bone className="h-2.5 w-16" />
              </div>
            </div>
            <Bone className="h-7 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
