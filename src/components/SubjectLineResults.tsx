
import React, { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const toneColors: Record<string, string> = {
  Curiosity: "bg-blue-100 text-blue-900",
  Fun: "bg-pink-100 text-pink-800",
  Urgency: "bg-red-100 text-red-800",
  Promo: "bg-green-100 text-green-900",
  Clear: "bg-gray-100 text-gray-800"
};

function copyToClipboard(s: string) {
  navigator.clipboard.writeText(s);
  toast({
    title: "Copied!",
    description: "Subject line copied to clipboard.",
  });
}

export function SubjectLineResults({ result }: { result: any }) {
  if (!result) {
    return (
      <div
        id="sls-results"
        className="flex flex-col items-center justify-center h-full min-h-[230px] text-gray-500 animate-fade-in"
      >
        <span className="text-lg">Results will appear here after you generate.</span>
      </div>
    );
  }

  return (
    <div id="sls-results" className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-3 mt-2">Subject Line Ideas</h2>
      <ul className="space-y-6">
        {result.subjectLines.map((item: any, idx: number) => (
          <li key={item.tone} className="border p-4 rounded-xl bg-neutral-50 shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "font-medium text-xs rounded px-2 py-0.5 capitalize",
                  toneColors[item.tone] || "bg-gray-100 text-gray-800"
                )}
              >
                {item.tone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg flex-1">{item.subject}</span>
              <button
                onClick={() => copyToClipboard(item.subject)}
                className="hover:bg-blue-100 rounded p-1 transition"
                aria-label="Copy subject line"
                type="button"
              >
                <Copy size={18} className="text-blue-700" />
              </button>
            </div>
            <span className="text-sm text-gray-500 pl-0.5">{item.preview}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
