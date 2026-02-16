function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#0B2343]/[0.06] rounded-lg animate-pulse ${className}`}
    />
  );
}

export function HeroSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
      <Bone className="h-32 sm:h-40 rounded-none" />
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Bone className="w-20 h-20 rounded-full shrink-0 -mt-14 sm:-mt-16 border-4 border-white" />
          <div className="flex-1 space-y-2">
            <Bone className="h-6 w-48" />
            <Bone className="h-4 w-72" />
            <Bone className="h-3 w-40" />
          </div>
          <div className="space-y-2 shrink-0">
            <Bone className="h-10 w-36 rounded-xl" />
            <Bone className="h-10 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4"
        >
          <Bone className="h-3 w-16 mb-2" />
          <Bone className="h-6 w-12" />
        </div>
      ))}
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-6 space-y-3">
      <Bone className="h-5 w-32 mb-4" />
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-4/5" />
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-3/5" />
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5 space-y-3">
        <Bone className="h-5 w-28" />
        <Bone className="h-10 w-full rounded-xl" />
        <Bone className="h-10 w-full rounded-xl" />
        <Bone className="h-3 w-full" />
      </div>
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5 space-y-3">
        <Bone className="h-5 w-28" />
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-4/5" />
        <Bone className="h-3 w-3/4" />
      </div>
    </div>
  );
}
