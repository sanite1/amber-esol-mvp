const Bone = ({ className = "" }: { className?: string }) => (
  <div
    className={`bg-[#0B2343]/[0.04] rounded-lg animate-pulse ${className}`}
  />
);

export function ConversationListSkeleton() {
  return (
    <div className="space-y-1 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
          <Bone className="w-11 h-11 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Bone className="h-3.5 w-28" />
            <Bone className="h-3 w-full" />
          </div>
          <Bone className="h-3 w-10 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function ChatAreaSkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#0B2343]/[0.06] flex items-center gap-3">
        <Bone className="w-9 h-9 rounded-full shrink-0" />
        <div className="space-y-1.5">
          <Bone className="h-4 w-32" />
          <Bone className="h-3 w-20" />
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 p-5 space-y-4">
        <div className="flex justify-end">
          <Bone className="h-16 w-56 rounded-2xl" />
        </div>
        <div className="flex gap-2">
          <Bone className="w-7 h-7 rounded-full shrink-0" />
          <Bone className="h-20 w-64 rounded-2xl" />
        </div>
        <div className="flex justify-end">
          <Bone className="h-12 w-48 rounded-2xl" />
        </div>
        <div className="flex gap-2">
          <Bone className="w-7 h-7 rounded-full shrink-0" />
          <Bone className="h-16 w-60 rounded-2xl" />
        </div>
      </div>
      {/* Input */}
      <div className="px-5 py-4 border-t border-[#0B2343]/[0.06]">
        <Bone className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
