
import React, { useState } from "react";
import { SubjectLineForm } from "@/components/SubjectLineForm";
import { SubjectLineResults } from "@/components/SubjectLineResults";
import { SubjectLineTips } from "@/components/SubjectLineTips";
import { FooterBranding } from "@/components/FooterBranding";

const Index = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="pt-10 pb-6">
        <h1 className="text-[2.4rem] font-extrabold text-center text-neutral-900 leading-tight">
          Subject Line Sorcerer
        </h1>
        <p className="text-center text-neutral-600 mt-2 text-lg">
          Instantly generate 5 powerful, on-brand email subject lines and preview text for any campaign.
        </p>
      </header>

      <main className="flex-1 flex flex-row gap-10 px-8 max-w-6xl mx-auto w-full transition-all">
        <div className="flex-1 min-w-[330px] max-w-[420px]">
          <SubjectLineForm onResult={setResult} />
        </div>
        <div className="w-[1px] bg-gray-200 my-2 hidden md:block" />
        <div className="flex-1 max-w-[540px] min-w-[290px] flex flex-col">
          <SubjectLineResults result={result} />
          <SubjectLineTips />
        </div>
      </main>
      <FooterBranding />
    </div>
  );
};

export default Index;
