import React from "react";

function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#0B2343]/[0.06] ${className}`}
    />
  );
}

export function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3 sm:p-4"
        >
          <Bone className="h-3 w-16 mb-2" />
          <Bone className="h-6 w-12 mb-1" />
          <Bone className="h-2.5 w-20" />
        </div>
      ))}
    </div>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Bone className="h-9 flex-1" />
        <Bone className="h-9 w-full sm:w-40" />
        <Bone className="h-9 w-full sm:w-36" />
      </div>
    </div>
  );
}

export function LessonCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <Bone className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Bone className="h-4 w-48" />
          <Bone className="h-3 w-32" />
          <Bone className="h-3 w-24" />
        </div>
        <Bone className="h-6 w-16 rounded-full shrink-0" />
      </div>
    </div>
  );
}

export function LessonsPageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <StatsRowSkeleton />
      <FilterBarSkeleton />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <LessonCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
