import { useState } from "react";

export function useSubjectLines() {
  const [loading, setLoading] = useState(false);

  async function generate(input: {
    campaignType?: string;
    targetAudience?: string;
    offerOrSale?: string;
    product?: string;
    brandName?: string;
    industry?: string;
    goal?: string;
    brandGuidelines?: string;
    abTest?: boolean;
  }) {
    setLoading(true);

    // Compose a SMARTER prompt
    let prompt = `
You are a high-impact, creative, and brand-sensitive email copywriter. Analyze the following brand and campaign info, using it (including inferred brand keywords, style, and product fit) to maximize relevance and originality—but never generic. Suggest brand-unique or industry-aware subject lines (e.g., if "Glow & Co.", use beauty/skincare language). Prioritize the most creative and brand-matching option for each tone.

Write 5 subject line options in these tones: Curiosity, Fun, Urgency, Promo, Clear. For each, include a matching preview text that fits the brand and maximizes open rate.
- Subject lines: punchy (max 10 words), emotionally compelling, and *actually fit the brand/campaign*. Explain nothing in output—just JSON.
- Preview text: complements the subject, max 15 words.
- Draw from brand, campaign goal, and industry for targeted ideas. Avoid generic, repetitive, or copy-paste filler.

${
  input.abTest
    ? "A/B TEST MODE is ON: For each tone, generate *two similar but not identical* subject lines and previews. Differences should follow best A/B testing practices (e.g., 'Last Chance' vs 'Ends Tomorrow'; curiosity vs clarity)."
    : ""
}

>> INCLUDE 1 'Irreverent / Wild' tone subject line: Make this the craziest, most wild, internet-breaking, attention-grabbing subject line you could imagine (but not offensive or negative). Must be almost too wild to use—a subject line so strange, funny, unexpected, or ridiculous that it would instantly grab attention and go viral. Preview text should match the energy.

Campaign details:
${input.brandName ? `Brand: ${input.brandName}\n` : ""}
${input.industry ? `Industry: ${input.industry}\n` : ""}
${input.campaignType ? `Campaign Type: ${input.campaignType}\n` : ""}
${input.targetAudience ? `Target Audience: ${input.targetAudience}\n` : ""}
${input.offerOrSale ? `Offer or Sale: ${input.offerOrSale}\n` : ""}
${input.product ? `Product: ${input.product}\n` : ""}
${input.goal ? `Goal: ${input.goal}\n` : ""}
${input.brandGuidelines ? `Brand Guidelines: ${input.brandGuidelines}\n` : ""}

After the list, analyze as a friendly strategist: Which subject line is *most likely* to achieve the stated goal "${input.goal || ''}"? Give the field "subject" (matching your winning subject line exactly!) and a sentence explaining *why* in "reason".
Respond ONLY with minified JSON in this format:
{
  "subjectLines": [
    ${
      input.abTest
        ? `{
      "tone": "Curiosity",
      "subjectA": "...",
      "subjectB": "...",
      "previewA": "...",
      "previewB": "..."
    },
    ... (Fun, Urgency, Promo, Clear),
    {
      "tone": "Irreverent / Wild",
      "subjectA": "...",
      "previewA": "..."
    }`
        : `{
      "tone": "Curiosity",
      "subject": "...",
      "preview": "..."
    },
    ... (Fun, Urgency, Promo, Clear),
    {
      "tone": "Irreverent / Wild",
      "subject": "...",
      "preview": "..."
    }`
    }
  ],
  "chanceOfSuccess": {
    "subject": "The subject line text predicted to do best",
    "reason": "A short friendly explanation"
  }
}
`;

    // Use OpenAI API key from env (via Supabase secrets)
    let apiKey = "";
    apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      setLoading(false);
      throw new Error("OpenAI API Key is not set. Please set VITE_OPENAI_API_KEY as a Supabase Secret on your project.");
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o", // If you've upgraded key, can use "gpt-4.1-2025-04-14"
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that generates great email subject lines and matching preview text for marketing campaigns."
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1100,
          temperature: 0.8
        }),
      });

      setLoading(false);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Failed to fetch subject lines from OpenAI.");
      }
      const data = await response.json();

      // Try to parse the assistant's response: expecting a code block with JSON inside
      let json;
      try {
        // Typically gets wrapped like ```json ... ```
        const match = data.choices?.[0]?.message?.content?.match(/```json([\s\S]*?)```/);
        if (match && match[1]) {
          json = JSON.parse(match[1]);
        } else {
          // Try fallback for older format [ ... ]
          const arrMatch = data.choices?.[0]?.message?.content?.match(/\[.*\]/s);
          if (arrMatch) {
            json = { subjectLines: JSON.parse(arrMatch[0]), chanceOfSuccess: null };
          } else {
            throw new Error("Could not find JSON subject lines in the response!");
          }
        }
      } catch (e: any) {
        throw new Error("Failed to parse subject lines from AI output.");
      }

      return json;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }

  return { loading, generate };
}
