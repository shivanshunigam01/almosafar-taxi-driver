"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

export function DemoNotice() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative z-50 border-b border-amber-500/40 bg-slate-900 text-amber-100">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs"
        onClick={() => setOpen((v) => !v)}
      >
        <Info className="h-4 w-4 shrink-0 text-amber-400" />
        <span className="flex-1 font-semibold">Almosafar Driver · Simulated dispatch</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <p className="border-t border-slate-700 px-3 pb-2 text-xs leading-relaxed text-slate-400">
          Incoming requests are generated locally when you go online. Not connected to passenger
          port 3001 or other phones.
        </p>
      )}
    </div>
  );
}
