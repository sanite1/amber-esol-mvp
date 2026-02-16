const Bone = ({ className = "" }: { className?: string }) => (
  <div
    className={`bg-[#0B2343]/[0.04] rounded-lg animate-pulse ${className}`}
  />
);

export function FilterBarSkeleton() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {Array.from({ length: 4 }).map((_, i) => (
        <Bone key={i} className="h-9 w-24 rounded-lg" />
      ))}
      <div className="ml-auto flex items-center gap-2">
        <Bone className="h-9 w-44 rounded-lg" />
        <Bone className="h-9 w-32 rounded-lg" />
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
          <Bone className="h-5 w-36" />
          <Bone className="h-3.5 w-56" />
          <div className="flex gap-2 mt-1">
            <Bone className="h-5 w-16 rounded-full" />
            <Bone className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <Bone className="h-8 w-8 rounded-lg shrink-0" />
      </div>
      <div className="mt-4 pt-4 border-t border-[#0B2343]/[0.04] grid grid-cols-4 gap-3">
        <Bone className="h-12 rounded-lg" />
        <Bone className="h-12 rounded-lg" />
        <Bone className="h-12 rounded-lg" />
        <Bone className="h-12 rounded-lg" />
      </div>
      <div className="mt-4 flex gap-2">
        <Bone className="h-9 flex-1 rounded-lg" />
        <Bone className="h-9 flex-1 rounded-lg" />
        <Bone className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}

export function TutorListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <TutorCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SummarySkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4"
        >
          <Bone className="w-8 h-8 rounded-lg mb-3" />
          <Bone className="h-7 w-12 mb-1" />
          <Bone className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
