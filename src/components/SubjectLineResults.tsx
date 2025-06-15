
import React from "react";
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

export function SubjectLineResults({
  result,
  loading,
  onGenerateAgain
}: {
  result: any,
  loading: boolean,
  onGenerateAgain?: () => void
}) {
  if (!result) {
    return (
      <div
        id="sls-results"
        className="flex flex-col items-center justify-center h-full min-h-[220px] text-[#6c6fb1] animate-fade-in"
      >
        <span className="text-lg font-medium">
          Results will appear here after you generate.
        </span>
      </div>
    );
  }

  const subjectLines = result?.subjectLines || [];
  const goal = result?.goal || "";

  // Find or assume "best" prediction, e.g. use first
  const bestIndex = subjectLines.length > 0 ? 0 : null;
  let bestLine = subjectLines[0];
  // Fallback logic: “chance” is AI-generated (see useSubjectLines.ts), else fallback to #1.
  const bestGuess = result?.chanceOfSuccess || (bestLine ? {
    subject: bestLine.subject,
    reason: goal
      ? `This subject line most closely aligns with the goal of maximizing ${goal.toLowerCase()}.`
      : "This is predicted as the most successful for your campaign."
  } : null);

  return (
    <div id="sls-results" className="animate-fade-in w-full max-w-2xl mx-auto mt-4">
      <h2 className="text-xl font-semibold mb-3 mt-2 text-[#24248d]">Subject Line Ideas</h2>
      {goal && (
        <div className="mb-5 flex flex-row gap-2 items-center px-4 py-3 rounded-xl bg-violet-100 text-[#3f257c] border-violet-200 border shadow-inner font-medium">
          <span className="mr-2">🔮</span>
          <span>
            <span className="font-semibold">Chance of success towards "{goal}" goal:</span>{" "}
            {bestGuess?.subject && (
              <span>
                <span className="font-bold text-[#2d3093]">{bestGuess.subject}</span>
                {" – "}
                <span className="text-sm font-normal">{bestGuess.reason}</span>
              </span>
            )}
          </span>
        </div>
      )}

      <ul className="space-y-5">
        {subjectLines.map((item: any, idx: number) => (
          <li key={idx + "-" + (item.tone || "")}
            className="border border-[#e3e7fa] p-4 rounded-xl bg-[#f6fafe] shadow-md flex flex-col gap-1 group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "font-medium text-xs rounded px-2 py-0.5 capitalize",
                toneColors[item.tone] || "bg-gray-100 text-gray-800"
              )}>
                {item.tone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg flex-1 text-[#273095]">{item.subject}</span>
              <button
                onClick={() => copyToClipboard(item.subject)}
                className="hover:bg-blue-100 rounded p-1 transition"
                aria-label="Copy subject line"
                type="button"
              >
                <Copy size={18} className="text-[#5c6ce5]" />
              </button>
            </div>
            <span className="text-sm text-[#7582b8] pl-0.5">{item.preview}</span>
          </li>
        ))}
      </ul>

      {onGenerateAgain && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 bg-[#6d67df] text-white rounded-full font-medium shadow hover:bg-[#473db7] transition-all"
            onClick={onGenerateAgain}
            disabled={loading}
          >
            {loading ? "Generating…" : "Generate Again"}
          </button>
        </div>
      )}
    </div>
  );
}
