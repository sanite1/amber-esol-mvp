function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#0B2343]/[0.06] rounded-lg animate-pulse ${className}`}
    />
  );
}

export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3"
        >
          <Bone className="h-2.5 w-14 mb-1.5" />
          <Bone className="h-5 w-10" />
        </div>
      ))}
    </div>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3">
      <div className="flex items-center gap-2">
        <Bone className="h-8 w-20 rounded-lg" />
        <Bone className="h-8 w-20 rounded-lg" />
        <Bone className="h-8 w-20 rounded-lg" />
        <div className="flex-1" />
        <Bone className="h-8 w-40 rounded-lg" />
      </div>
    </div>
  );
}

export function LessonCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.04] p-3">
      <div className="flex items-center gap-3">
        <Bone className="w-9 h-9 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Bone className="h-3.5 w-32" />
          <Bone className="h-2.5 w-48" />
        </div>
        <Bone className="h-7 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function LessonListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <LessonCardSkeleton key={i} />
      ))}
    </div>
  );
}
