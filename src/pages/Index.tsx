import React, { useState } from "react";
import { SubjectLineForm } from "@/components/SubjectLineForm";
import { SubjectLineResults } from "@/components/SubjectLineResults";
import { SubjectLineTips } from "@/components/SubjectLineTips";
import { FooterBranding } from "@/components/FooterBranding";

const APP_TITLES = [
  "Subject Line Brainstormer",
  "Inbox Impact: Subject Lab",
  "OpenRate Spark",
];
const TITLE = APP_TITLES[0]; // Change here to pick different title.

const Index = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<any | null>(null);

  // For "generate again"
  function handleGenerateAgain() {
    if (formState && formState.generate) {
      formState.generate();
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{
        background: "linear-gradient(120deg, #e6eaff 0%, #d9d7fa 55%, #ecf2fd 100%)",
        minHeight: "100vh"
      }}
    >
      <header className="pt-12 pb-4">
        <h1 className="text-[2.3rem] md:text-[2.7rem] font-extrabold text-center text-[#2238b3] tracking-tight drop-shadow-sm leading-tight"
        >
          {TITLE}
        </h1>
        <p className="text-center text-[#5564c6] mt-2 text-lg max-w-2xl mx-auto font-medium">
          Instantly brainstorm creative, diverse, and high-performing subject line ideas for any campaign style or goal.<br />
          Built for A/B testing and designed to maximize your email's open rates and engagement.
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center px-3 w-full max-w-5xl mx-auto">
        <section className="w-full max-w-3xl mx-auto">
          <SubjectLineForm
            onResult={setResult}
            setFormState={setFormState}
            loading={loading}
            setLoading={setLoading}
            abModeAction={(params) => {
              // trigger generate with abTest enabled
              if (formState && formState.generateABTest) {
                formState.generateABTest();
              }
            }}
          />
        </section>
        <section className="w-full mt-4 max-w-3xl mx-auto">
          <SubjectLineResults
            result={result}
            loading={loading}
            onGenerateAgain={handleGenerateAgain}
            onABTest={() => {
              if (formState && formState.generateABTest) {
                formState.generateABTest();
              }
            }}
          />
        </section>
        <SubjectLineTips />
      </main>
      <FooterBranding />
    </div>
  );
};

export default Index;
