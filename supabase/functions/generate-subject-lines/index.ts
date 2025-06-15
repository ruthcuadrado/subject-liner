
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      campaignType, 
      targetAudience, 
      offerOrSale, 
      product, 
      brandName, 
      industry, 
      goal, 
      brandGuidelines,
      abTest = false 
    } = await req.json()

    const apiKey = Deno.env.get('VITE_OPENAI_API_KEY')
    if (!apiKey) {
      throw new Error('OpenAI API key not found')
    }

    const prompt = abTest 
      ? `Generate 4 pairs of A/B test email subject lines for a ${campaignType} campaign.
Target audience: ${targetAudience}
Offer/Sale: ${offerOrSale}
Product: ${product}
Brand: ${brandName}
Industry: ${industry}
Goal: ${goal}
Brand guidelines: ${brandGuidelines}

For each pair, create two different subject lines (A and B) that test different approaches. Include preview text for each.
Use these tones: Curiosity, Fun, Urgency, Promo.

Return JSON in this exact format:
{
  "subjectLines": [
    {
      "tone": "Curiosity",
      "subjectA": "subject line A",
      "previewA": "preview text A",
      "subjectB": "subject line B", 
      "previewB": "preview text B"
    }
  ],
  "chanceOfSuccess": {
    "subject": "the best subject line",
    "reason": "why this one will work best for the ${goal} goal"
  }
}`
      : `Generate 5 email subject lines for a ${campaignType} campaign.
Target audience: ${targetAudience}
Offer/Sale: ${offerOrSale}
Product: ${product}
Brand: ${brandName}
Industry: ${industry}
Goal: ${goal}
Brand guidelines: ${brandGuidelines}

Use these 5 tones: Curiosity, Fun, Urgency, Promo, Clear.
Include preview text for each.

Return JSON in this exact format:
{
  "subjectLines": [
    {
      "tone": "Curiosity",
      "subject": "subject line here",
      "preview": "preview text here"
    }
  ],
  "chanceOfSuccess": {
    "subject": "the best subject line",
    "reason": "why this one will work best for the ${goal} goal"
  }
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert email marketing copywriter. Always return valid JSON in the exact format requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    let result
    try {
      result = JSON.parse(content)
    } catch (e) {
      console.error('Failed to parse OpenAI response:', content)
      throw new Error('Invalid response format from OpenAI')
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})
