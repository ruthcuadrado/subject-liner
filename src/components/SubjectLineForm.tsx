
import React, { useState } from "react";
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
    <HelpCircle
      size={16}
      className="ml-1 text-blue-500 cursor-pointer hover:text-blue-700"
    />
    <span className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition z-20 absolute left-full ml-2 bg-neutral-900 text-white text-xs rounded px-2 py-1 min-w-[200px] shadow-lg whitespace-normal">
      {text}
    </span>
  </span>
);

export function SubjectLineForm({ onResult }: { onResult: (res: any) => void }) {
  const [form, setForm] = useState({
    campaignType: "",
    targetAudience: "",
    offer: "",
    goal: "",
    brandGuidelines: "",
  });
  const [showBrand, setShowBrand] = useState(false);
  const [loading, setLoading] = useState(false);

  const { generate } = useSubjectLines();

  const isValid =
    form.campaignType &&
    form.targetAudience.trim() &&
    form.offer.trim() &&
    form.goal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      toast({
        title: "Please fill in all required fields.",
        description: "",
      });
      return;
    }
    setLoading(true);
    try {
      const result = await generate({ ...form, brandGuidelines: showBrand ? form.brandGuidelines : "" });
      onResult(result);
      setTimeout(() => {
        const el = document.getElementById("sls-results");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
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
      <div className="mb-3">
        <label className="font-semibold flex items-center">
          Campaign Type
          <Tooltip text="What type of campaign is this? (Sale, Product Launch, etc.)" />
        </label>
        <select
          className="w-full mt-1.5 rounded border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2"
          name="campaignType"
          value={form.campaignType}
          onChange={handleChange}
          required
        >
          <option value="">Select…</option>
          {campaignTypes.map((opt) => (
            <option value={opt} key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-semibold flex items-center">
          Target Audience
          <Tooltip text="Who will receive this email? (e.g. 'Skincare enthusiasts', 'B2B marketers')" />
        </label>
        <Input
          className="mt-1.5"
          name="targetAudience"
          placeholder='e.g. "Tech founders", "Dog owners"'
          value={form.targetAudience}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="font-semibold flex items-center">
          Offer or Product
          <Tooltip text="What is the main offer or product? (e.g. '20% off vitamins', 'Early access to CRM')" />
        </label>
        <Input
          className="mt-1.5"
          name="offer"
          placeholder="e.g. 'Free shipping', 'New summer course'"
          value={form.offer}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="font-semibold flex items-center">
          Goal
          <Tooltip text="What's your main goal for this email? (e.g. Opens, Clicks)" />
        </label>
        <select
          className="w-full mt-1.5 rounded border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2"
          name="goal"
          value={form.goal}
          onChange={handleChange}
          required
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
          <Tooltip text='Optional: e.g. “We’re cheeky and bold, but never cringey.”' />
        </label>
      </div>
      {showBrand && (
        <textarea
          className="rounded border-gray-300 mt-2 px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 min-h-[70px]"
          name="brandGuidelines"
          placeholder='Describe your brand voice, e.g. "Conversational, luxury, witty…"'
          value={form.brandGuidelines}
          onChange={handleChange}
          maxLength={200}
        />
      )}

      <Button
        className={cn("mt-6 font-semibold text-base", !isValid && "opacity-60 pointer-events-none")}
        type="submit"
        disabled={!isValid || loading}
      >
        <Sparkles className="inline mr-1 -mt-1" />
        {loading ? "Generating…" : "Generate"}
      </Button>
    </form>
  );
}
