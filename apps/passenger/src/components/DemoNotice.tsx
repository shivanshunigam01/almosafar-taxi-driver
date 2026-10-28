"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

export function DemoNotice() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative z-50 border-b border-amber-200 bg-amber-50 text-amber-950">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs"
        onClick={() => setOpen((v) => !v)}
      >
        <Info className="h-4 w-4 shrink-0 text-amber-700" />
        <span className="flex-1 font-semibold">Almosafar Passenger · Local demo</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <p className="border-t border-amber-200/80 px-3 pb-2 text-xs leading-relaxed text-amber-900/90">
          Rides persist in this browser only (port 3001). They do not sync to the driver site or
          other devices.
        </p>
      )}
    </div>
  );
}
