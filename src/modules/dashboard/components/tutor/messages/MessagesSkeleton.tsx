function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#0B2343]/[0.06] ${className}`}
    />
  );
}

export function ConversationItemSkeleton() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-3">
      <Bone className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Bone className="h-3.5 w-28" />
        <Bone className="h-3 w-full" />
      </div>
      <Bone className="h-3 w-10 shrink-0" />
    </div>
  );
}

export function ConversationListSkeleton() {
  return (
    <div className="divide-y divide-[#0B2343]/[0.04]">
      {Array.from({ length: 6 }).map((_, i) => (
        <ConversationItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function ChatAreaSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#0B2343]/[0.06]">
        <Bone className="w-9 h-9 rounded-full shrink-0" />
        <div className="space-y-1.5">
          <Bone className="h-4 w-28" />
          <Bone className="h-3 w-20" />
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 p-4 space-y-4">
        <div className="flex justify-start">
          <Bone className="h-14 w-48 rounded-2xl" />
        </div>
        <div className="flex justify-end">
          <Bone className="h-10 w-40 rounded-2xl" />
        </div>
        <div className="flex justify-start">
          <Bone className="h-16 w-56 rounded-2xl" />
        </div>
      </div>
      {/* Input */}
      <div className="px-4 py-3 border-t border-[#0B2343]/[0.06]">
        <Bone className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
