
import React from "react";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const toneColors: Record<string, string> = {
  Curiosity: "bg-blue-100 text-blue-900",
  Fun: "bg-pink-100 text-pink-800",
  Urgency: "bg-red-100 text-red-800",
  Promo: "bg-green-100 text-green-900",
  Clear: "bg-gray-100 text-gray-800",
  Irreverent: "bg-violet-200 text-violet-900 font-bold border-violet-400 border-2",
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
  onGenerateAgain,
  onABTest,
}: {
  result: any,
  loading: boolean,
  onGenerateAgain?: () => void,
  onABTest?: () => void,
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

  // Standard and A/B logic
  const subjectLines = result?.subjectLines || [];
  const abTest = result?.abTest;
  const goal = result?.goal || "";
  const irreverent = subjectLines.find((item: any) => item.tone === "Irreverent");
  const lines = subjectLines.filter((item: any) => item.tone !== "Irreverent");

  // Predict winner logic (works for both: standard & AB)
  let predicted = result?.chanceOfSuccess;
  let predictedIdx: number | null = null;
  if (predicted?.subject && lines.length > 0) {
    predictedIdx = lines.findIndex((item: any) => {
      if (abTest) {
        return item.subjectA === predicted.subject || item.subjectB === predicted.subject;
      }
      return item.subject === predicted.subject;
    });
  }

  return (
    <div id="sls-results" className="animate-fade-in w-full max-w-2xl mx-auto mt-4">
      <h2 className="text-xl font-semibold mb-3 mt-2 text-[#24248d]">Subject Line Ideas</h2>
      <ul className="space-y-5">
        {lines.map((item: any, idx: number) => (
          <li
            key={idx + "-" + (item.tone || "")}
            className={cn(
              "border border-[#e3e7fa] p-4 rounded-xl bg-[#f6fafe] shadow-md flex flex-col gap-1 group relative",
              predictedIdx === idx && "border-2 border-[#5b8ff9] bg-blue-50"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "font-medium text-xs rounded px-2 py-0.5 capitalize",
                toneColors[item.tone] || "bg-gray-100 text-gray-800"
              )}>
                {item.tone}
              </span>
              {predictedIdx === idx && predicted && (
                <span className="ml-2 bg-blue-200 text-blue-900 rounded-full px-2 py-0.5 text-xs font-semibold inline-flex items-center">
                  Predicted winner towards "{goal}" goal
                </span>
              )}
            </div>

            {/* A/B test mode */}
            {abTest ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#273095] font-bold text-lg flex-1">{item.subjectA}</span>
                  <button
                    onClick={() => copyToClipboard(item.subjectA)}
                    className="hover:bg-blue-100 rounded p-1 transition"
                    aria-label="Copy subject line"
                    type="button"
                  >
                    <Copy size={18} className="text-[#5c6ce5]" />
                  </button>
                </div>
                <span className="text-sm text-[#7582b8] pl-0.5">{item.previewA}</span>

                <div className="flex items-center gap-2">
                  <span className="text-[#273095] font-bold text-lg flex-1">{item.subjectB}</span>
                  <button
                    onClick={() => copyToClipboard(item.subjectB)}
                    className="hover:bg-blue-100 rounded p-1 transition"
                    aria-label="Copy subject line"
                    type="button"
                  >
                    <Copy size={18} className="text-[#5c6ce5]" />
                  </button>
                </div>
                <span className="text-sm text-[#7582b8] pl-0.5">{item.previewB}</span>
              </div>
            ) : (
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
            )}
            {!abTest && (
              <span className="text-sm text-[#7582b8] pl-0.5">{item.preview}</span>
            )}
          </li>
        ))}
        {irreverent && (
          <li
            className="border-violet-400 border-2 p-4 rounded-xl bg-violet-100 shadow-md flex flex-col gap-1 mt-3"
            key="irreverent"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "font-bold text-xs rounded px-2 py-0.5 uppercase tracking-wide",
                toneColors["Irreverent"]
              )}>
                Irreverent
              </span>
              <span className="ml-2 bg-pink-300 text-pink-900 rounded-full px-2 py-0.5 text-xs font-semibold">
                Break-the-inbox idea!
              </span>
            </div>
            <span className="font-bold text-lg text-violet-900">{abTest ? irreverent.subjectA : irreverent.subject}</span>
            <span className="text-sm text-violet-800 pl-0.5">{abTest ? irreverent.previewA : irreverent.preview}</span>
          </li>
        )}
      </ul>
      <div className="flex justify-center gap-6 mt-8">
        <button
          className="px-6 py-2 bg-[#6d67df] text-white rounded-full font-medium shadow hover:bg-[#473db7] transition-all"
          onClick={onGenerateAgain}
          disabled={loading}
          type="button"
        >
          {loading ? "Generating…" : "Regenerate"}
        </button>
        <button
          className="px-6 py-2 bg-[#5077ef] text-white rounded-full font-medium shadow hover:bg-[#284cac] transition-all"
          onClick={onABTest}
          disabled={loading}
          type="button"
        >
          {loading ? "Generating…" : "Generate A/B Test"}
        </button>
      </div>
    </div>
  );
}
