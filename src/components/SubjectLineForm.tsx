import React, { useState, useEffect } from "react";
import { HelpCircle, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubjectLines } from "@/lib/useSubjectLines";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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
  setLoading,
  abModeAction
}: {
  onResult: (res: any) => void,
  setFormState?: (formApi: any) => void,
  loading: boolean,
  setLoading: (loading: boolean) => void,
  abModeAction?: (params?: any) => void
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

  const { generate } = useSubjectLines();

  // A/B mode state
  const [abMode, setAbMode] = useState(false);

  useEffect(() => {
    if (setFormState) {
      setFormState({
        generate: handleSubmit,
        generateABTest: handleAbTest
      });
    }
  }, [form, showBrand]); 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setAbMode(false);
    try {
      const input = {
        ...form,
        brandGuidelines: showBrand ? form.brandGuidelines : "",
        abTest: false
      };
      const result = await generate(input);
      onResult({ ...result, goal: form.goal, abTest: false });
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

  async function handleAbTest(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setAbMode(true);
    try {
      const input = {
        ...form,
        brandGuidelines: showBrand ? form.brandGuidelines : "",
        abTest: true
      };
      const result = await generate(input);
      onResult({ ...result, goal: form.goal, abTest: true });
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
      className="w-full rounded-2xl border border-[#e2e3fa] bg-white shadow-xl p-7 grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-5 animate-fade-in"
      style={{background: "linear-gradient(104deg, #f8faff 74%, #e7eafd 100%)"}}
      onSubmit={handleSubmit}
      aria-label="Subject Line Generator Input"
    >
      {/* Form fields remain the same */}
      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Campaign Type
          <Tooltip text="What type of campaign? (Sale, Product Launch, etc.)" />
        </label>
        <select
          className="w-full mt-1.5 rounded border-[#babaff] focus:ring-2 focus:ring-[#af9fff] px-3 py-2 bg-[#f7f8fc]"
          name="campaignType"
          value={form.campaignType}
          onChange={handleChange}
        >
          <option value="">Select…</option>
          {["Sale", "Product Launch", "Newsletter", "Event", "Other"].map((opt) => (
            <option value={opt} key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Brand Name
          <Tooltip text="The more you share about your brand, the more tailored and unique your subject lines will be!" />
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
          <Tooltip text="e.g. Skincare, SaaS, Retail, Finance, etc." />
        </label>
        <Input
          className="mt-1.5 bg-[#f7f8fc] border-[#babaff]"
          name="industry"
          placeholder="e.g. Beauty, SaaS, etc."
          value={form.industry}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Target Audience
          <Tooltip text="e.g. 'Tech founders', 'Dog owners'" />
        </label>
        <Input
          className="mt-1.5 bg-[#f7f8fc] border-[#babaff]"
          name="targetAudience"
          placeholder='e.g. Tech founders, Dog owners'
          value={form.targetAudience}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Offer or Sale
          <Tooltip text="e.g. '20% off', 'Bundle savings', etc." />
        </label>
        <Input
          className="mt-1.5 bg-[#f7f8fc] border-[#babaff]"
          name="offerOrSale"
          placeholder="e.g. 20% off"
          value={form.offerOrSale}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Product Being Promoted
          <Tooltip text="e.g. 'Vitamin C Serum', 'CRM Platform'" />
        </label>
        <Input
          className="mt-1.5 bg-[#f7f8fc] border-[#babaff]"
          name="product"
          placeholder="e.g. Vitamin C Serum"
          value={form.product}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-semibold flex items-center text-[#3e40a6]">
          Goal
          <Tooltip text="What's your main goal? (e.g. Opens, Clicks)" />
        </label>
        <select
          className="w-full mt-1.5 rounded border-[#babaff] focus:ring-2 focus:ring-[#af9fff] px-3 py-2 bg-[#f7f8fc]"
          name="goal"
          value={form.goal}
          onChange={handleChange}
        >
          <option value="">Select…</option>
          {["Opens", "Clicks", "Awareness", "Engagement", "Conversions"].map((opt) => (
            <option value={opt} key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="col-span-2 flex items-center gap-3 mt-3">
        <Switch
          id="showBrand"
          checked={showBrand}
          onCheckedChange={setShowBrand}
        />
        <label htmlFor="showBrand" className="text-sm font-medium select-none flex items-center text-[#464bdb]">
          Add Brand Tone Guidelines
          <Tooltip text="Tell us about your brand voice, e.g. 'Conversational, witty…'. More detail = better results!" />
        </label>
      </div>
      {showBrand && (
        <textarea
          className="rounded border-[#babaff] mt-2 px-3 py-2 w-full focus:ring-2 focus:ring-[#af9fff] min-h-[70px] bg-[#f7f8fc] col-span-2"
          name="brandGuidelines"
          placeholder='Describe your brand voice, e.g. "Conversational, luxury, witty…"'
          value={form.brandGuidelines}
          onChange={handleChange}
          maxLength={200}
        />
      )}

      {/* CTA buttons at bottom */}
      <div className="col-span-2 flex justify-center gap-4 mt-7">
        <Button
          className={cn("font-semibold text-base px-8 py-3 rounded-lg bg-[#4d5ac7] hover:bg-[#2d399d]", loading && "cursor-not-allowed opacity-80")}
          type="submit"
          disabled={loading}
        >
          {loading ? "Generating…" : "Generate Subject Lines"}
        </Button>
      </div>
    </form>
  );
}
