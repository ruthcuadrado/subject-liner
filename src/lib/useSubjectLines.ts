
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

    try {
      console.log('Calling subject lines edge function...');
      
      const { data, error } = await supabase.functions.invoke('generate-subject-lines', {
        body: input
      });

      setLoading(false);

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || "Failed to generate subject lines.");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }

  return { loading, generate };
}
