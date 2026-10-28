"use client";

import type { ReactNode } from "react";

export type BottomSheetProps = {
  children: ReactNode;
  /** Peek height when collapsed (CSS value) */
  peek?: string;
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
};

/** Map-first bottom sheet shell matching reference mockups. */
export function BottomSheet({
  children,
  peek = "11rem",
  expanded = false,
  onToggle,
  className = "",
}: BottomSheetProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-50 mx-auto max-w-lg ${className}`}
      style={{
        transform: expanded ? "translateY(0)" : `translateY(calc(100% - ${peek}))`,
        transition: "transform 300ms ease",
      }}
    >
      <div className="pointer-events-auto rounded-t-3xl bg-white px-4 pb-6 pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.12)]">
        {onToggle ? (
          <button
            type="button"
            className="mx-auto mb-2 flex w-full justify-center py-2"
            aria-label={expanded ? "Collapse sheet" : "Expand sheet"}
            onClick={onToggle}
          >
            <span className="h-1 w-10 rounded-full bg-slate-300" />
          </button>
        ) : (
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-slate-300" />
        )}
        {children}
      </div>
    </div>
  );
}
