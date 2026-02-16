const Bone = ({ className = "" }: { className?: string }) => (
  <div
    className={`bg-[#0B2343]/[0.04] rounded-lg animate-pulse ${className}`}
  />
);

export function SearchBarSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Bone className="h-10 flex-1 rounded-xl" />
        <Bone className="h-10 w-36 rounded-xl" />
        <Bone className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-5">
      <Bone className="h-4 w-20 mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Bone className="h-3 w-16 mb-2" />
            <div className="space-y-1.5">
              {Array.from({ length: 3 }).map((_, j) => (
                <Bone key={j} className="h-7 w-full rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TutorCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-5">
      <div className="flex items-start gap-4">
        <Bone className="w-14 h-14 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Bone className="h-5 w-40" />
          <Bone className="h-3.5 w-56" />
          <Bone className="h-3 w-full" />
          <Bone className="h-3 w-4/5" />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#0B2343]/[0.04]">
        <Bone className="h-6 w-16 rounded-md" />
        <Bone className="h-6 w-16 rounded-md" />
        <Bone className="h-6 w-16 rounded-md" />
        <div className="ml-auto flex gap-2">
          <Bone className="h-9 w-24 rounded-lg" />
          <Bone className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function TutorGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <TutorCardSkeleton key={i} />
      ))}
    </div>
  );
}
