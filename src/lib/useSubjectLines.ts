
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

    // Build the detailed prompt for ChatGPT
    let prompt = `
You are a high-performing email copywriter. Based on the campaign details below, write 5 subject line options in different tones (Curiosity, Fun, Urgency, Promo, Clear) and include a matching preview text for each.
Subject lines: punchy (max 10 words), emotionally compelling, and designed to increase open rates. Preview text should complement the subject and add intrigue (max 15 words). Avoid repeating the same structure or call-to-action. Show results in a clear list with tone labels.

${input.abTest
      ? 'A/B TEST MODE is ON: For each tone, generate two slightly different but relevant versions of both the subject line and preview text for A/B testing (for example, "Last Chance" vs "Ends Tomorrow").'
      : ''
    }

Campaign details:
${input.brandName ? `Brand: ${input.brandName}\n` : ""}
${input.industry ? `Industry: ${input.industry}\n` : ""}
${input.campaignType ? `Campaign Type: ${input.campaignType}\n` : ""}
${input.targetAudience ? `Target Audience: ${input.targetAudience}\n` : ""}
${input.offerOrSale ? `Offer or Sale: ${input.offerOrSale}\n` : ""}
${input.product ? `Product: ${input.product}\n` : ""}
${input.goal ? `Goal: ${input.goal}\n` : ""}
${input.brandGuidelines ? `Brand Guidelines: ${input.brandGuidelines}\n` : ""}

Please use the information to make each subject line and preview text highly relevant.

After presenting the complete list, estimate (as a helpful strategist) which subject line is most likely to achieve the stated goal ("${input.goal || ''}") and explain why, in one friendly sentence.
Respond in JSON of this format:
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
    ... (Fun, Urgency, Promo, Clear)`
        : `{
      "tone": "Curiosity",
      "subject": "...",
      "preview": "..."
    },
    ... (Fun, Urgency, Promo, Clear)`
    }
  ],
  "chanceOfSuccess": {
    "subject": "The subject line text predicted to do best",
    "reason": "A short friendly explanation"
  }
}
`;

    // Use OpenAI API key from localStorage first, then env
    let apiKey = "";
    if (typeof window !== "undefined") {
      apiKey = localStorage.getItem("openai_api_key") || "";
    }
    if (!apiKey) {
      apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    }

    if (!apiKey) {
      setLoading(false);
      throw new Error("OpenAI API Key is not set. Please set it above, or set VITE_OPENAI_API_KEY in your environment.");
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
