function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#0B2343]/[0.06] ${className}`}
    />
  );
}

export function UsersStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4"
        >
          <Bone className="h-3 w-14 mb-2" />
          <Bone className="h-6 w-10" />
        </div>
      ))}
    </div>
  );
}

export function UsersFilterSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <Bone className="h-9 w-full sm:w-56 rounded-xl" />
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-8 w-16 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <Bone className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Bone className="h-4 w-28" />
          <Bone className="h-3 w-44" />
        </div>
        <Bone className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function UsersPageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2.5">
        <Bone className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
        <div className="space-y-1.5">
          <Bone className="h-5 w-24" />
          <Bone className="h-3 w-40" />
        </div>
      </div>
      <UsersStatsSkeleton />
      <UsersFilterSkeleton />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
