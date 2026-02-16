function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#0B2343]/[0.06] ${className}`}
    />
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4"
        >
          <Bone className="h-3 w-14 mb-2" />
          <Bone className="h-6 w-12" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <Bone className="h-4 w-32 mb-4" />
      <div className="flex items-end gap-2 h-36 sm:h-44">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bone
            key={i}
            className="flex-1 rounded-t-lg"
            // style={{ height: `${30 + Math.random() * 70}%` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 sm:p-5 space-y-3">
      <Bone className="h-4 w-28" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Bone className="w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-3 w-32" />
            <Bone className="h-2.5 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2.5">
        <Bone className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
        <div className="space-y-1.5">
          <Bone className="h-5 w-36" />
          <Bone className="h-3 w-48" />
        </div>
      </div>
      <StatsSkeleton />
      <ChartSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <ListSkeleton />
        <ListSkeleton />
      </div>
    </div>
  );
}
