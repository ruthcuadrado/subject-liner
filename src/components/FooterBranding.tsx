
import React from "react";

export function FooterBranding() {
  return (
    <footer className="w-full mt-10 py-7 border-t border-gray-200 flex flex-col items-center bg-white">
      <div className="flex flex-row gap-2 items-center text-gray-500 text-sm font-medium">
        <span>
          Made with <span className="text-red-500">♥</span> by [Your Name]
        </span>
        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 outline-none rounded px-3 py-1.5 text-blue-600 hover:underline bg-blue-50 hover:bg-blue-100 transition text-xs font-semibold flex items-center gap-1"
        >
          Follow me on LinkedIn
        </a>
      </div>
    </footer>
  );
}
