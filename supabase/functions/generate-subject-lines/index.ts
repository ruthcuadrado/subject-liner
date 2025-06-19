
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('VITE_OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const input = await req.json();
    console.log('Input received:', JSON.stringify(input, null, 2));
    
    // Compose the prompt (same logic as before)
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

CRITICAL REQUIREMENT: After the list, you MUST analyze as a friendly strategist: Which subject line is *most likely* to achieve the stated goal "${input.goal || ''}"? You MUST provide the exact subject line text in the "subject" field and a brief explanation in the "reason" field. This analysis is mandatory and must be included in every response.

Respond ONLY with minified JSON in this exact format:
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
    "subject": "The exact subject line text predicted to do best",
    "reason": "A short friendly explanation of why this subject line will achieve the ${input.goal || 'specified'} goal"
  }
}
`;

    console.log('Making OpenAI API request...');
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates great email subject lines and matching preview text for marketing campaigns. You ALWAYS provide winner predictions in the chanceOfSuccess field."
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error("Failed to fetch subject lines from OpenAI.");
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    console.log('OpenAI raw response:', JSON.stringify(data, null, 2));

    // Parse the assistant's response
    let json;
    try {
      const content = data.choices?.[0]?.message?.content;
      console.log('OpenAI content:', content);
      
      const match = content?.match(/```json([\s\S]*?)```/);
      if (match && match[1]) {
        json = JSON.parse(match[1]);
      } else {
        // Try to parse the entire content as JSON
        json = JSON.parse(content);
      }
    } catch (e: any) {
      console.error('Failed to parse OpenAI response:', e);
      throw new Error("Failed to parse subject lines from AI output.");
    }

    console.log('Parsed JSON before fallback:', JSON.stringify(json, null, 2));

    // Fallback logic if chanceOfSuccess is missing or null
    if (!json.chanceOfSuccess || !json.chanceOfSuccess.subject) {
      console.log('Applying fallback logic for goal:', input.goal);
      
      const subjectLines = json.subjectLines || [];
      let fallbackTone = 'Curiosity'; // default
      
      // Apply your specific fallback logic
      switch (input.goal?.toLowerCase()) {
        case 'opens':
        case 'engagement':
          fallbackTone = 'Curiosity';
          break;
        case 'clicks':
          fallbackTone = 'Urgency';
          break;
        case 'awareness':
          fallbackTone = 'Clear';
          break;
        case 'conversions':
          fallbackTone = 'Promo';
          break;
        default:
          fallbackTone = 'Curiosity';
      }
      
      // Find the subject line with the fallback tone
      const fallbackLine = subjectLines.find((line: any) => 
        line.tone?.toLowerCase() === fallbackTone.toLowerCase()
      );
      
      if (fallbackLine) {
        const subject = input.abTest ? fallbackLine.subjectA : fallbackLine.subject;
        json.chanceOfSuccess = {
          subject: subject,
          reason: `${fallbackTone} tone typically performs best for ${input.goal || 'this type of'} campaigns`
        };
        console.log('Applied fallback prediction:', json.chanceOfSuccess);
      }
    }

    console.log('Final response:', JSON.stringify(json, null, 2));

    return new Response(JSON.stringify(json), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-subject-lines function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
