function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#0B2343]/[0.06] ${className}`}
    />
  );
}

export function ReviewsOverviewSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex flex-col items-center gap-2">
          <Bone className="h-12 w-20" />
          <Bone className="h-3 w-16" />
          <Bone className="h-3 w-24" />
        </div>
        <div className="flex-1 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Bone className="h-3 w-6" />
              <Bone className="h-2.5 flex-1 rounded-full" />
              <Bone className="h-3 w-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReviewsFilterSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <Bone className="h-9 w-full sm:w-56 rounded-xl" />
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-8 w-14 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <Bone className="w-9 h-9 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Bone className="h-4 w-28" />
          <Bone className="h-3 w-full" />
          <Bone className="h-3 w-4/5" />
          <Bone className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function ReviewsListSkeleton() {
  return (
    <div className="space-y-2.5 sm:space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ReviewsPageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2.5">
        <Bone className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
        <div className="space-y-1.5">
          <Bone className="h-5 w-24" />
          <Bone className="h-3 w-40" />
        </div>
      </div>
      <ReviewsOverviewSkeleton />
      <ReviewsFilterSkeleton />
      <ReviewsListSkeleton />
    </div>
  );
}
