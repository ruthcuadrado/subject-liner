
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
  "Irreverent / Wild": "bg-violet-300 text-violet-900 font-bold border-violet-500 border-2 animate-pulse",
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
  const irreverent = subjectLines.find(
    (item: any) => (item.tone === "Irreverent / Wild" || item.tone === "Irreverent" || item.tone?.toLowerCase().includes("wild"))
  );
  const lines = subjectLines.filter((item: any) => !(item.tone === "Irreverent / Wild" || item.tone === "Irreverent" || item.tone?.toLowerCase().includes("wild")));

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
    <div id="sls-results" className="animate-fade-in w-full max-w-2xl mx-auto mt-4 px-4 sm:px-0">
      <h2 className="text-xl font-semibold mb-3 mt-2 text-[#1e3a8a]">Subject Line Ideas</h2>
      
      {/* Winner prediction banner - only show if we have a prediction */}
      {predicted && predicted.subject && goal && (
        <div className="mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-900">AI Prediction:</span>
              <span className="text-sm text-blue-800">
                "{predicted.subject}" is most likely to achieve your "{goal}" goal
              </span>
            </div>
          </div>
          {predicted.reason && (
            <div className="mt-2 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">Why this subject line?</p>
              <p className="text-sm text-blue-600 mt-1">{predicted.reason}</p>
            </div>
          )}
        </div>
      )}

      <ul className="space-y-5">
        {lines.map((item: any, idx: number) => (
          <li
            key={idx + "-" + (item.tone || "")}
            className={cn(
              "border border-[#e3e7fa] p-4 rounded-xl bg-gradient-to-br from-[#f6fafe] to-[#f0f6ff] shadow-md flex flex-col gap-1 group relative",
              predictedIdx === idx && "border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
            )}
          >
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn(
                "font-medium text-xs rounded px-2 py-0.5 capitalize",
                toneColors[item.tone] || "bg-gray-100 text-gray-800"
              )}>
                {item.tone}
              </span>
              {/* Winner badge inline with tone */}
              {predictedIdx === idx && predicted && (
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                  ⭐ Predicted Winner
                </span>
              )}
            </div>
            {/* A/B test mode */}
            {abTest ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-[#1e3a8a] font-bold text-lg flex-1 break-words">{item.subjectA}</span>
                  <button
                    onClick={() => copyToClipboard(item.subjectA)}
                    className="hover:bg-blue-100 rounded p-1 transition flex-shrink-0"
                    aria-label="Copy subject line"
                    type="button"
                  >
                    <Copy size={18} className="text-[#3b82f6]" />
                  </button>
                </div>
                <span className="text-sm text-[#64748b] pl-0.5 break-words">{item.previewA}</span>
                <div className="flex items-start gap-2">
                  <span className="text-[#1e3a8a] font-bold text-lg flex-1 break-words">{item.subjectB}</span>
                  <button
                    onClick={() => copyToClipboard(item.subjectB)}
                    className="hover:bg-blue-100 rounded p-1 transition flex-shrink-0"
                    aria-label="Copy subject line"
                    type="button"
                  >
                    <Copy size={18} className="text-[#3b82f6]" />
                  </button>
                </div>
                <span className="text-sm text-[#64748b] pl-0.5 break-words">{item.previewB}</span>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <span className="font-bold text-lg flex-1 text-[#1e3a8a] break-words">{item.subject}</span>
                <button
                  onClick={() => copyToClipboard(item.subject)}
                  className="hover:bg-blue-100 rounded p-1 transition flex-shrink-0"
                  aria-label="Copy subject line"
                  type="button"
                >
                  <Copy size={18} className="text-[#3b82f6]" />
                </button>
              </div>
            )}
            {!abTest && (
              <span className="text-sm text-[#64748b] pl-0.5 break-words">{item.preview}</span>
            )}
          </li>
        ))}
        {irreverent && (
          <li
            className="border-violet-500 border-2 p-4 rounded-xl bg-gradient-to-br from-violet-100 to-purple-50 shadow-md flex flex-col gap-1 mt-3 animate-pulse"
            key="irreverent"
          >
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn(
                "font-black text-xs rounded px-2 py-0.5 uppercase tracking-wider animate-bounce",
                toneColors["Irreverent / Wild"]
              )}>
                Irreverent / Wild
              </span>
              <span className="ml-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full px-2 py-0.5 text-xs font-bold uppercase shadow-sm">
                Almost too wild
              </span>
            </div>
            <span className="font-extrabold text-lg text-violet-900 break-words">{abTest ? irreverent.subjectA : irreverent.subject}</span>
            <span className="text-sm text-violet-800 pl-0.5 break-words">{abTest ? irreverent.previewA : irreverent.preview}</span>
          </li>
        )}
      </ul>
      <div className="flex justify-center gap-4 sm:gap-6 mt-8 flex-wrap">
        <button
          className="px-6 py-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-full font-medium shadow hover:from-[#4f46e5] hover:to-[#7c3aed] transition-all"
          onClick={onGenerateAgain}
          disabled={loading}
          type="button"
        >
          {loading ? "Generating…" : "Regenerate"}
        </button>
        <button
          className="px-6 py-2 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white rounded-full font-medium shadow hover:from-[#2563eb] hover:to-[#4f46e5] transition-all"
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
