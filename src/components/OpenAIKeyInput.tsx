
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function OpenAIKeyInput({ onKeySet }: { onKeySet?: (key: string) => void }) {
  const [value, setValue] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (value) {
      localStorage.setItem("openai_api_key", value);
      if (onKeySet) onKeySet(value);
    }
  }, [value, onKeySet]);

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">
        OpenAI API Key <span className="text-xs font-normal text-gray-500">(not saved on server)</span>
      </label>
      <div className="flex items-center gap-2">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          placeholder="Paste sk-... here"
          onChange={e => setValue(e.target.value)}
          className="max-w-xs"
        />
        <button
          type="button"
          className="text-xs underline text-blue-600"
          onClick={() => setVisible(v => !v)}
          tabIndex={-1}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
