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
  }) {
    setLoading(true);

    // Build the detailed prompt for ChatGPT
    const prompt = `
You are a high-performing email copywriter. Based on the campaign details provided below, write 5 subject line options in different tones (Curiosity, Fun, Urgency, Promo, Clear) and include a matching preview text for each.
Subject lines: punchy (max 10 words), emotionally compelling, and designed to increase open rates. Preview text should complement the subject and add intrigue (max 15 words). Avoid repeating the same structure or call-to-action. Show results in a clear list with tone labels.

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
Respond in JSON of this format:
[
  {
    "tone": "Curiosity",
    "subject": "...",
    "preview": "..."
  },
  {
    "tone": "Fun",
    "subject": "...",
    "preview": "..."
  },
  {
    "tone": "Urgency",
    "subject": "...",
    "preview": "..."
  },
  {
    "tone": "Promo",
    "subject": "...",
    "preview": "..."
  },
  {
    "tone": "Clear",
    "subject": "...",
    "preview": "..."
  }
]
`;

    // Use OpenAI API key from localStorage first, then env
    let apiKey = "";
    if (typeof window !== "undefined") {
      apiKey = localStorage.getItem("openai_api_key") || "";
    }
    if (!apiKey) {
      apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    }

    console.log("OpenAI API Key present?", !!apiKey);
    if (!apiKey) {
      setLoading(false);
      throw new Error("OpenAI API Key is not set. Please set it above, or set VITE_OPENAI_API_KEY in your environment.");
    }

    try {
      console.log("About to make OpenAI API request...");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
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
          max_tokens: 750,
          temperature: 0.8
        }),
      });

      setLoading(false);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API failed:", response.status, errorText);
        throw new Error("Failed to fetch subject lines from OpenAI.");
      }
      const data = await response.json();
      console.log("OpenAI API response data:", data);

      // Try to parse the assistant's response (should be JSON as specified)
      let json;
      try {
        const match = data.choices?.[0]?.message?.content?.match(/\[.*\]/s);
        if (match) {
          json = JSON.parse(match[0]);
        } else {
          throw new Error("Could not find JSON subject lines in the response!");
        }
      } catch (e: any) {
        console.error("Parsing AI output failed:", e);
        throw new Error("Failed to parse subject lines from AI output.");
      }

      return { subjectLines: json };
    } catch (e) {
      setLoading(false);
      console.error("Error in generate():", e);
      throw e;
    }
  }

  return { loading, generate };
}
