function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#0B2343]/[0.06] ${className}`}
    />
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <Bone className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shrink-0" />
        <div className="flex-1 min-w-0 space-y-2 w-full">
          <Bone className="h-5 w-40 mx-auto sm:mx-0" />
          <Bone className="h-3 w-56 mx-auto sm:mx-0" />
          <Bone className="h-3 w-32 mx-auto sm:mx-0" />
          <div className="flex gap-2 justify-center sm:justify-start mt-2">
            <Bone className="h-7 w-20 rounded-full" />
            <Bone className="h-7 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
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

export function ProfileSectionSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 sm:p-5 space-y-3">
      <Bone className="h-4 w-28" />
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-4/5" />
      <Bone className="h-3 w-3/5" />
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2.5">
        <Bone className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
        <div className="space-y-1.5">
          <Bone className="h-5 w-28" />
          <Bone className="h-3 w-44" />
        </div>
      </div>
      <ProfileHeaderSkeleton />
      <ProfileStatsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <ProfileSectionSkeleton />
          <ProfileSectionSkeleton />
        </div>
        <div className="space-y-4 sm:space-y-5">
          <ProfileSectionSkeleton />
          <ProfileSectionSkeleton />
        </div>
      </div>
    </div>
  );
}
