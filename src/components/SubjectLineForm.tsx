import React, { useState } from "react";
import { HelpCircle, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubjectLines } from "@/lib/useSubjectLines";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { OpenAIKeyInput } from "./OpenAIKeyInput";

const campaignTypes = [
  "Sale", "Product Launch", "Newsletter", "Event", "Other"
];
const goals = [
  "Opens", "Clicks", "Awareness", "Engagement", "Conversions"
];

const Tooltip = ({ text }: { text: React.ReactNode }) => (
  <span className="group relative inline-flex items-center">
    <HelpCircle size={16} className="ml-1 text-blue-500 cursor-pointer hover:text-blue-700" />
    <span className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition z-20 absolute left-full ml-2 bg-neutral-900 text-white text-xs rounded px-2 py-1 min-w-[200px] shadow-lg whitespace-normal">
      {text}
    </span>
  </span>
);

export function SubjectLineForm({ onResult }: { onResult: (res: any) => void }) {
  const [form, setForm] = useState({
    campaignType: "",
    targetAudience: "",
    offerOrSale: "",
    product: "",
    offer: "",
    brandName: "",
    industry: "",
    goal: "",
    brandGuidelines: "",
  });
  const [showBrand, setShowBrand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(() =>
    typeof window !== "undefined" && !!localStorage.getItem("openai_api_key")
  );

  const { generate } = useSubjectLines();

  // Update: Now also accepts textarea's event type
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasKey && !(import.meta.env.VITE_OPENAI_API_KEY)) {
      toast({
        title: "API Key required",
        description: "Please enter your OpenAI API Key above before generating."
      });
      return;
    }
    setLoading(true);
    try {
      console.log("Form input data:", form);
      const result = await generate({
        campaignType: form.campaignType,
        targetAudience: form.targetAudience,
        offerOrSale: form.offerOrSale,
        product: form.product,
        brandName: form.brandName,
        industry: form.industry,
        goal: form.goal,
        brandGuidelines: showBrand ? form.brandGuidelines : "",
      });
      console.log("Generator result:", result);
      onResult(result);
      setTimeout(() => {
        const el = document.getElementById("sls-results");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err: any) {
      console.error("Error generating subject lines:", err);
      toast({ title: "Error generating subject lines.", description: err?.message || "" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="bg-white shadow-lg rounded-xl border border-gray-100 p-8 flex flex-col gap-5"
      onSubmit={handleSubmit}
      aria-label="Subject Line Generator Input"
    >
      <OpenAIKeyInput onKeySet={() => setHasKey(true)} />
      {/* Show a notice if user hasn't entered a key and there's no env key */}
      {!hasKey && !import.meta.env.VITE_OPENAI_API_KEY && (
        <div className="mb-2 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded text-sm">
          <span className="font-bold">Required:</span> Please provide your OpenAI API key above to generate subject lines.
        </div>
      )}

      <div className="mb-3">
        <label className="font-semibold flex items-center">
          Campaign Type
          <Tooltip text="Optional: What type of campaign is this? (Sale, Product Launch, etc.)" />
        </label>
        <select
          className="w-full mt-1.5 rounded border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2"
          name="campaignType"
          value={form.campaignType}
          onChange={handleChange}
        >
          <option value="">Select…</option>
          {campaignTypes.map((opt) => (
            <option value={opt} key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-semibold flex items-center">
          Brand Name
          <Tooltip text="Optional: Enter your brand or company name." />
        </label>
        <Input
          className="mt-1.5"
          name="brandName"
          placeholder="e.g. Glow & Co."
          value={form.brandName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center">
          Industry
          <Tooltip text="Optional: e.g. Skincare, SaaS, Retail, Finance, etc." />
        </label>
        <Input
          className="mt-1.5"
          name="industry"
          placeholder="e.g. Skincare, SaaS, Retail, etc."
          value={form.industry}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center">
          Target Audience
          <Tooltip text="Optional: Who will receive this email? (e.g. 'Tech founders', 'Dog owners')" />
        </label>
        <Input
          className="mt-1.5"
          name="targetAudience"
          placeholder='e.g. "Tech founders", "Dog owners"'
          value={form.targetAudience}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center">
          Offer or Sale
          <Tooltip text="Optional: What is the special offer or sale? (e.g. '20% off', 'Buy 1 Get 1 Free')" />
        </label>
        <Input
          className="mt-1.5"
          name="offerOrSale"
          placeholder="e.g. '20% off', 'Bundle savings', etc."
          value={form.offerOrSale}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center">
          Product Being Promoted
          <Tooltip text="Optional: What is the main product? (e.g. 'Vitamin C Serum', 'CRM platform', etc.)" />
        </label>
        <Input
          className="mt-1.5"
          name="product"
          placeholder="e.g. 'Vitamin C Serum', 'CRM Platform'"
          value={form.product}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center">
          Goal
          <Tooltip text="Optional: What's your main goal for this email? (e.g. Opens, Clicks)" />
        </label>
        <select
          className="w-full mt-1.5 rounded border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2"
          name="goal"
          value={form.goal}
          onChange={handleChange}
        >
          <option value="">Select…</option>
          {goals.map((opt) => (
            <option value={opt} key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <Switch
          id="showBrand"
          checked={showBrand}
          onCheckedChange={setShowBrand}
        />
        <label htmlFor="showBrand" className="text-sm font-medium select-none flex items-center">
          Add Brand Tone Guidelines
          <Tooltip text="Optional: e.g. “We’re cheeky and bold, but never cringey.”" />
        </label>
      </div>
      {showBrand && (
        <textarea
          className="rounded border-gray-300 mt-2 px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 min-h-[70px]"
          name="brandGuidelines"
          placeholder='Optional: Describe your brand voice, e.g. "Conversational, luxury, witty…"'
          value={form.brandGuidelines}
          onChange={handleChange}
          maxLength={200}
        />
      )}

      <Button
        className={cn("mt-6 font-semibold text-base")}
        type="submit"
        disabled={loading}
      >
        <Sparkles className="inline mr-1 -mt-1" />
        {loading ? "Generating…" : "Generate"}
      </Button>
    </form>
  );
}
