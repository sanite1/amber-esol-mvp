function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#0B2343]/[0.06] rounded-lg animate-pulse ${className}`}
    />
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5"
        >
          <Bone className="h-3 w-20 mb-3" />
          <Bone className="h-6 w-16 mb-1.5" />
          <Bone className="h-2.5 w-24" />
        </div>
      ))}
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Bone className="h-5 w-40" />
        <div className="flex gap-2">
          <Bone className="h-8 w-20 rounded-lg" />
          <Bone className="h-8 w-20 rounded-lg" />
          <Bone className="h-8 w-20 rounded-lg" />
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl border border-[#0B2343]/[0.04]"
        >
          <Bone className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-3.5 w-48" />
            <Bone className="h-3 w-32" />
          </div>
          <div className="text-right space-y-1.5">
            <Bone className="h-4 w-14 ml-auto" />
            <Bone className="h-3 w-20 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PaymentMethodsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-6 space-y-3">
      <Bone className="h-5 w-36 mb-3" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3.5 border border-[#0B2343]/[0.06] rounded-xl"
        >
          <Bone className="h-8 w-12 rounded" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-3.5 w-32" />
            <Bone className="h-3 w-20" />
          </div>
          <Bone className="h-7 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
