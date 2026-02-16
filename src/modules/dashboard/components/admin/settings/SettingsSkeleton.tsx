import React from "react";

function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#0B2343]/[0.06] ${className}`}
    />
  );
}

export function SettingsSectionSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Bone className="h-5 w-40" />
        <Bone className="h-8 w-16 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Bone className="h-3 w-28" />
            <Bone className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5 max-w-3xl">
      {Array.from({ length: 5 }).map((_, i) => (
        <SettingsSectionSkeleton key={i} />
      ))}
    </div>
  );
}
