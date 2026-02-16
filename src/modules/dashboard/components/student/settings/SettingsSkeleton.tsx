function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#0B2343]/[0.06] rounded-lg animate-pulse ${className}`}
    />
  );
}

export default function SettingsSkeleton() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Bone className="w-9 h-9 rounded-xl" />
        <div className="space-y-1.5">
          <Bone className="h-5 w-24" />
          <Bone className="h-3 w-44" />
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Bone className="w-7 h-7 rounded-lg" />
            <Bone className="h-4 w-32" />
          </div>
          <div className="space-y-2.5">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <Bone className="h-3 w-40" />
                <Bone className="h-5 w-9 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
