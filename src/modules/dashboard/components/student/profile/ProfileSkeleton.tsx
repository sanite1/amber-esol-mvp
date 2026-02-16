function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#0B2343]/[0.06] rounded-lg animate-pulse ${className}`}
    />
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="space-y-5 max-w-3xl m-auto">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <Bone className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <Bone className="h-5 w-28" />
          <Bone className="h-3 w-44" />
        </div>
      </div>

      {/* Avatar + name card */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5">
        <div className="flex items-center gap-4">
          <Bone className="w-16 h-16 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Bone className="h-5 w-36" />
            <Bone className="h-3 w-52" />
            <Bone className="h-3 w-28" />
          </div>
          <Bone className="h-8 w-20 rounded-lg shrink-0" />
        </div>
      </div>

      {/* Sections */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <Bone className="h-4 w-32" />
            <Bone className="h-7 w-14 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-3/4" />
            <Bone className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
