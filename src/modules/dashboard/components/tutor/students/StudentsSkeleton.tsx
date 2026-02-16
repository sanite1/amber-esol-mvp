function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#0B2343]/[0.06] ${className}`}
    />
  );
}

export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4"
        >
          <Bone className="h-3 w-16 mb-2" />
          <Bone className="h-6 w-10" />
        </div>
      ))}
    </div>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
      <Bone className="h-9 w-full sm:w-64 rounded-xl" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-8 w-16 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function StudentCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <Bone className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Bone className="h-4 w-32" />
          <Bone className="h-3 w-48" />
        </div>
        <Bone className="h-6 w-16 rounded-full hidden sm:block" />
      </div>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-10 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function StudentListSkeleton() {
  return (
    <div className="space-y-2.5 sm:space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <StudentCardSkeleton key={i} />
      ))}
    </div>
  );
}
