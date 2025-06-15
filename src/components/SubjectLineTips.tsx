
import React, { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubjectLineTips() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 mb-2 max-w-[540px] w-full">
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-900 font-medium shadow hover:bg-blue-100 transition cursor-pointer select-none w-full"
        )}
        onClick={() => setOpen(o => !o)}
      >
        <Info className="text-blue-700" size={20} />
        What Makes a Great Subject Line?
        <ChevronDown
          className={cn("ml-auto transition-transform", open && "rotate-180")}
          size={18}
        />
      </button>
      {open && (
        <div className="bg-white border border-blue-50 mt-1 px-5 py-4 rounded-lg text-[15px] leading-relaxed shadow-sm animate-fade-in">
          <ul className="list-disc ml-7 space-y-1">
            <li><strong>Use power words and emotion</strong></li>
            <li>Keep it under 60 characters</li>
            <li>Pair well with preview text</li>
            <li>Match subject line with email content</li>
            <li>A/B test ruthlessly</li>
          </ul>
        </div>
      )}
    </div>
  );
}
