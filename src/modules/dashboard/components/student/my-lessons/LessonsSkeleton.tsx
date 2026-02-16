const Bone = ({ className = "" }: { className?: string }) => (
  <div
    className={`bg-[#0B2343]/[0.04] rounded-lg animate-pulse ${className}`}
  />
);

export function LessonStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4"
        >
          <Bone className="w-8 h-8 rounded-lg mb-3" />
          <Bone className="h-6 w-12 mb-1" />
          <Bone className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function LessonFilterBarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>
      <div className="flex gap-2 sm:ml-auto">
        <Bone className="h-9 w-40 rounded-lg" />
        <Bone className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export function LessonCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-5">
      <div className="flex items-start gap-4">
        <Bone className="w-11 h-11 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Bone className="h-4 w-32" />
            <Bone className="h-5 w-16 rounded-full" />
          </div>
          <Bone className="h-3 w-48" />
        </div>
        <Bone className="h-6 w-20 rounded-md shrink-0" />
      </div>
      <div className="mt-4 pt-4 border-t border-[#0B2343]/[0.04] flex items-center justify-between">
        <div className="flex gap-4">
          <Bone className="h-3.5 w-20" />
          <Bone className="h-3.5 w-24" />
          <Bone className="h-3.5 w-14" />
        </div>
        <div className="flex gap-2">
          <Bone className="h-8 w-20 rounded-lg" />
          <Bone className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function LessonListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <LessonCardSkeleton key={i} />
      ))}
    </div>
  );
}
