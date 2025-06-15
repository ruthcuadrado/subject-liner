
import React, { useState } from "react";
import { SubjectLineForm } from "@/components/SubjectLineForm";
import { SubjectLineResults } from "@/components/SubjectLineResults";
import { SubjectLineTips } from "@/components/SubjectLineTips";
import { FooterBranding } from "@/components/FooterBranding";

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
        background: "linear-gradient(120deg, #edf1fc 0%, #e3e1fa 50%, #f4f7fe 100%)",
        minHeight: "100vh"
      }}
    >
      <header className="pt-12 pb-4">
        <h1 className="text-[2.1rem] md:text-[2.4rem] font-extrabold text-center text-[#181BB8] tracking-tight drop-shadow-sm leading-tight"
        >
          Subject Line Brainstormet
        </h1>
        <p className="text-center text-[#6772e5] mt-2 text-lg max-w-2xl mx-auto font-medium">
          Instantly generate diverse and creative subject line ideas (with preview text) tailored for a variety of campaign needs and styles.<br />
          Designed for A/B testing and maximizing your email's chance of success.
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center px-3 w-full max-w-5xl mx-auto">
        <section className="w-full">
          <SubjectLineForm
            onResult={setResult}
            setFormState={setFormState}
            loading={loading}
            setLoading={setLoading}
          />
        </section>
        <section className="w-full mt-4">
          <SubjectLineResults
            result={result}
            loading={loading}
            onGenerateAgain={handleGenerateAgain}
          />
        </section>
        <SubjectLineTips />
      </main>
      <FooterBranding />
    </div>
  );
};

export default Index;
