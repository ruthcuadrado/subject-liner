import React, { useState, useEffect } from "react";
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

export function SubjectLineForm({
  onResult,
  setFormState,
  loading,
  setLoading
}: {
  onResult: (res: any) => void,
  setFormState?: (formApi: any) => void,
  loading: boolean,
  setLoading: (loading: boolean) => void
}) {
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
  const [abTest, setAbTest] = useState(false);
  const [hasKey, setHasKey] = useState(() =>
    typeof window !== "undefined" && !!localStorage.getItem("openai_api_key")
  );

  const { generate } = useSubjectLines();

  // Setup imperative rerender for "generate again"
  useEffect(() => {
    if (setFormState) {
      setFormState({
        generate: handleSubmit
      });
    }
  }); // intentionally always update

  // Update: Now also accepts textarea's event type
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!hasKey && !(import.meta.env.VITE_OPENAI_API_KEY)) {
      toast({
        title: "API Key required",
        description: "Please enter your OpenAI API Key above before generating."
      });
      return;
    }
    setLoading(true);
    try {
      const input = {
        campaignType: form.campaignType,
        targetAudience: form.targetAudience,
        offerOrSale: form.offerOrSale,
        product: form.product,
        brandName: form.brandName,
        industry: form.industry,
        goal: form.goal,
        brandGuidelines: showBrand ? form.brandGuidelines : "",
        abTest
      };
      const result = await generate(input);
      onResult({ ...result, goal: form.goal });
      setTimeout(() => {
        const el = document.getElementById("sls-results");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err: any) {
      toast({ title: "Error generating subject lines.", description: err?.message || "" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="w-full max-w-4xl mx-auto p-7 rounded-2xl border border-[#e2e3fa] bg-white shadow-lg grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 animate-fade-in"
      style={{
        background: "linear-gradient(103deg, #f7faff 77%, #e6e7fa 100%)",
      }}
      onSubmit={handleSubmit}
      aria-label="Subject Line Generator Input"
    >
      <div className="col-span-1 md:col-span-2">
        <OpenAIKeyInput onKeySet={() => setHasKey(true)} />
        {/* Show a notice if user hasn't entered a key and there's no env key */}
        {!hasKey && !import.meta.env.VITE_OPENAI_API_KEY && (
          <div className="mb-2 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded text-sm">
            <span className="font-bold">Required:</span> Please provide your OpenAI API key above to generate subject lines.
          </div>
        )}
      </div>

      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Campaign Type
          <Tooltip text="Optional: What type of campaign is this? (Sale, Product Launch, etc.)" />
        </label>
        <select
          className="w-full mt-1.5 rounded border-[#babaff] focus:ring-2 focus:ring-[#af9fff] px-3 py-2 bg-[#f7f8fc]"
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
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Brand Name
          <Tooltip text="Optional: Enter your brand or company name." />
        </label>
        <Input
          className="mt-1.5 bg-[#f7f8fc] border-[#babaff]"
          name="brandName"
          placeholder="e.g. Glow & Co."
          value={form.brandName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Industry
          <Tooltip text="Optional: e.g. Skincare, SaaS, Retail, Finance, etc." />
        </label>
        <Input
          className="mt-1.5 bg-[#f7f8fc] border-[#babaff]"
          name="industry"
          placeholder="e.g. Skincare, SaaS, Retail, etc."
          value={form.industry}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Target Audience
          <Tooltip text="Optional: Who will receive this email? (e.g. 'Tech founders', 'Dog owners')" />
        </label>
        <Input
          className="mt-1.5 bg-[#f7f8fc] border-[#babaff]"
          name="targetAudience"
          placeholder='e.g. "Tech founders", "Dog owners"'
          value={form.targetAudience}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Offer or Sale
          <Tooltip text="Optional: What is the special offer or sale? (e.g. '20% off', 'Buy 1 Get 1 Free')" />
        </label>
        <Input
          className="mt-1.5 bg-[#f7f8fc] border-[#babaff]"
          name="offerOrSale"
          placeholder="e.g. '20% off', 'Bundle savings', etc."
          value={form.offerOrSale}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Product Being Promoted
          <Tooltip text="Optional: What is the main product? (e.g. 'Vitamin C Serum', 'CRM platform', etc.)" />
        </label>
        <Input
          className="mt-1.5 bg-[#f7f8fc] border-[#babaff]"
          name="product"
          placeholder="e.g. 'Vitamin C Serum', 'CRM Platform'"
          value={form.product}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Goal
          <Tooltip text="Optional: What's your main goal for this email? (e.g. Opens, Clicks)" />
        </label>
        <select
          className="w-full mt-1.5 rounded border-[#babaff] focus:ring-2 focus:ring-[#af9fff] px-3 py-2 bg-[#f7f8fc]"
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

      <div className="col-span-1 md:col-span-2 flex items-center gap-3 mt-3">
        <Switch
          id="showBrand"
          checked={showBrand}
          onCheckedChange={setShowBrand}
        />
        <label htmlFor="showBrand" className="text-sm font-medium select-none flex items-center text-[#464bdb]">
          Add Brand Tone Guidelines
          <Tooltip text="Optional: e.g. “We’re cheeky and bold, but never cringey.”" />
        </label>
      </div>
      {showBrand && (
        <textarea
          className="rounded border-[#babaff] mt-2 px-3 py-2 w-full focus:ring-2 focus:ring-[#af9fff] min-h-[70px] bg-[#f7f8fc] col-span-1 md:col-span-2"
          name="brandGuidelines"
          placeholder='Optional: Describe your brand voice, e.g. "Conversational, luxury, witty…"'
          value={form.brandGuidelines}
          onChange={handleChange}
          maxLength={200}
        />
      )}

      <div className="col-span-1 md:col-span-2 flex items-center gap-3 mt-2">
        <Switch
          id="abTest"
          checked={abTest}
          onCheckedChange={setAbTest}
        />
        <label htmlFor="abTest" className="text-sm font-medium select-none flex items-center text-[#2a2cad]">
          Are you running an A/B test?
          <Tooltip text="If enabled, you'll get TWO slightly different subject lines per tone for testing (e.g. 'Last Chance' vs 'Ends Tomorrow')" />
        </label>
      </div>

      <div className="col-span-1 md:col-span-2 flex justify-center mt-7">
        <Button
          className={cn("font-semibold text-base px-8 py-3 rounded-lg bg-[#4d5ac7] hover:bg-[#2d399d]", loading && "cursor-not-allowed opacity-80")}
          type="submit"
          disabled={loading}
        >
          <span className="inline-block mr-1 -mt-1">💡</span>
          {loading ? "Generating…" : "Generate Subject Lines"}
        </Button>
      </div>
    </form>
  );
}
