
import { useState } from "react";

// For V1: mock AI with deterministic example output.
// Swap with API in V2.
const tones = [
  { tone: "Curiosity", prompt: "Make it intriguing/clickbait" },
  { tone: "Fun", prompt: "Make it playful/friendly" },
  { tone: "Urgency", prompt: "Make it urgent/FOMO" },
  { tone: "Promo", prompt: "Make it promotional/discount-driven" },
  { tone: "Clear", prompt: "Make it direct/straightforward" },
];

export function useSubjectLines() {
  const [loading, setLoading] = useState(false);

  async function generate(input: {
    campaignType: string;
    targetAudience: string;
    offer: string;
    goal: string;
    brandGuidelines?: string;
  }) {
    // Replace this logic with real AI API call in V2!
    const { campaignType, targetAudience, offer, brandGuidelines } = input;
    // Fake variation for demo
    function combine(prompt: string) {
      return `${prompt} for ${campaignType.toLowerCase()} to ${targetAudience}: ${offer}`;
    }
    // Pretend to "think"
    await new Promise(res => setTimeout(res, 800));
    // Real use would call the API with the full rich system prompt and received tones
    const sample = [
      {
        tone: "Curiosity",
        subject: "Guess what's coming for you… 👀",
        preview: "Unlock a surprise that our competition won't tell you about.",
      },
      {
        tone: "Fun",
        subject: "Your inbox just got happier 🎉",
        preview: "A treat for you inside—let’s smile together!",
      },
      {
        tone: "Urgency",
        subject: "Last chance: Don’t let this slip away!",
        preview: "This offer disappears soon—are you in or out?",
      },
      {
        tone: "Promo",
        subject: "Save more, shine brighter: special deal inside",
        preview: "Get your exclusive savings—don’t wait to open.",
      },
      {
        tone: "Clear",
        subject: "Your exclusive offer is here",
        preview: "Everything you need, right inside this email.",
      },
    ];
    // If user submits, return these for now. In V2, use AI to make them unique.
    return { subjectLines: sample };
  }

  return { loading, generate };
}
