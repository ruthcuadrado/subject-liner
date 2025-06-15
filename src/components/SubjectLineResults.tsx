
import React from "react";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const toneColors: Record<string, string> = {
  Curiosity: "bg-blue-100 text-blue-900 border-blue-200",
  Fun: "bg-gradient-to-r from-pink-100 to-blue-100 text-blue-900 border-blue-200",
  Urgency: "bg-gradient-to-r from-red-100 to-blue-100 text-red-800 border-red-200",
  Promo: "bg-gradient-to-r from-green-100 to-blue-100 text-green-900 border-green-200",
  Clear: "bg-gradient-to-r from-gray-100 to-blue-100 text-gray-800 border-gray-200",
  "Irreverent / Wild": "bg-gradient-to-r from-violet-200 to-blue-200 text-violet-900 font-bold border-violet-400 border-2 animate-pulse",
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
        className="flex flex-col items-center justify-center h-full min-h-[220px] text-blue-600 animate-fade-in"
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
  const predicted = result?.chanceOfSuccess;
  
  console.log('Winner prediction data:', predicted);
  console.log('Goal:', goal);
  console.log('Subject lines:', subjectLines);
  
  const irreverent = subjectLines.find(
    (item: any) => (item.tone === "Irreverent / Wild" || item.tone === "Irreverent" || item.tone?.toLowerCase().includes("wild"))
  );
  const lines = subjectLines.filter((item: any) => !(item.tone === "Irreverent / Wild" || item.tone === "Irreverent" || item.tone?.toLowerCase().includes("wild")));

  // Find the predicted winner
  let predictedIdx: number | null = null;
  if (predicted?.subject && lines.length > 0) {
    predictedIdx = lines.findIndex((item: any) => {
      if (abTest) {
        return item.subjectA === predicted.subject || item.subjectB === predicted.subject;
      }
      return item.subject === predicted.subject;
    });
    console.log('Predicted winner index:', predictedIdx);
  }

  return (
    <div id="sls-results" className="animate-fade-in w-full max-w-2xl mx-auto mt-4">
      <h2 className="text-xl font-semibold mb-3 mt-2 text-blue-800">Subject Line Ideas</h2>
      
      {/* Winner prediction banner - show if we have a prediction */}
      {predicted && predicted.subject && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 border-l-4 border-blue-500 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-blue-900">🎯 AI Winner Prediction:</span>
          </div>
          <p className="text-blue-800 font-medium mb-1">
            "<span className="font-bold">{predicted.subject}</span>" is most likely to achieve your "<span className="font-semibold text-blue-900">{goal}</span>" goal
          </p>
          {predicted.reason && (
            <p className="text-xs text-blue-700 mt-2 ml-5 italic">{predicted.reason}</p>
          )}
        </div>
      )}

      <ul className="space-y-5">
        {lines.map((item: any, idx: number) => (
          <li
            key={idx + "-" + (item.tone || "")}
            className={cn(
              "border p-4 rounded-xl shadow-md flex flex-col gap-1 group relative transition-all",
              predictedIdx === idx 
                ? "border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg transform scale-[1.02]" 
                : "border-blue-200 bg-gradient-to-br from-blue-25 to-indigo-25 hover:shadow-lg"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "font-medium text-xs rounded-full px-3 py-1 capitalize border",
                toneColors[item.tone] || "bg-gradient-to-r from-gray-100 to-blue-100 text-gray-800 border-gray-200"
              )}>
                {item.tone}
              </span>
              {/* Winner badge */}
              {predictedIdx === idx && predicted && (
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full px-3 py-1 text-xs font-bold shadow-md">
                  ⭐ AI Pick
                </span>
              )}
            </div>
            {/* A/B test mode */}
            {abTest ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-blue-900 font-bold text-lg flex-1">{item.subjectA}</span>
                  <button
                    onClick={() => copyToClipboard(item.subjectA)}
                    className="hover:bg-blue-200 rounded p-1 transition"
                    aria-label="Copy subject line"
                    type="button"
                  >
                    <Copy size={18} className="text-blue-600" />
                  </button>
                </div>
                <span className="text-sm text-blue-600 pl-0.5">{item.previewA}</span>
                <div className="flex items-center gap-2">
                  <span className="text-blue-900 font-bold text-lg flex-1">{item.subjectB}</span>
                  <button
                    onClick={() => copyToClipboard(item.subjectB)}
                    className="hover:bg-blue-200 rounded p-1 transition"
                    aria-label="Copy subject line"
                    type="button"
                  >
                    <Copy size={18} className="text-blue-600" />
                  </button>
                </div>
                <span className="text-sm text-blue-600 pl-0.5">{item.previewB}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg flex-1 text-blue-900">{item.subject}</span>
                <button
                  onClick={() => copyToClipboard(item.subject)}
                  className="hover:bg-blue-200 rounded p-1 transition"
                  aria-label="Copy subject line"
                  type="button"
                >
                  <Copy size={18} className="text-blue-600" />
                </button>
              </div>
            )}
            {!abTest && (
              <span className="text-sm text-blue-600 pl-0.5">{item.preview}</span>
            )}
          </li>
        ))}
        {irreverent && (
          <li
            className="border-2 border-violet-400 p-4 rounded-xl bg-gradient-to-br from-violet-100 via-blue-50 to-purple-100 shadow-md flex flex-col gap-1 mt-3 animate-pulse"
            key="irreverent"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "font-black text-xs rounded-full px-3 py-1 uppercase tracking-wider animate-bounce border-2",
                toneColors["Irreverent / Wild"]
              )}>
                Irreverent / Wild
              </span>
              <span className="ml-2 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 text-white rounded-full px-3 py-1 text-xs font-bold uppercase shadow-sm">
                Almost too wild
              </span>
            </div>
            <span className="font-extrabold text-lg text-violet-900">{abTest ? irreverent.subjectA : irreverent.subject}</span>
            <span className="text-sm text-violet-800 pl-0.5">{abTest ? irreverent.previewA : irreverent.preview}</span>
          </li>
        )}
      </ul>
      <div className="flex justify-center gap-6 mt-8">
        <button
          className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-full font-medium shadow hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transition-all"
          onClick={onGenerateAgain}
          disabled={loading}
          type="button"
        >
          {loading ? "Generating…" : "Regenerate"}
        </button>
        <button
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium shadow hover:from-blue-700 hover:to-indigo-700 transition-all"
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
