"use client";

import { useState } from "react";
import { askGemini } from "./geminiAction";

export default function GeminiChat() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setResponse("Consulting the Oracle...");
    
    const result = await askGemini(query);
    setResponse(result);
    setLoading(false);
  }

  return (
    <div className="bg-[#2c1e14] border-4 border-[#b8860b] rounded-2xl p-4 shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b-2 border-[#b8860b]/30 pb-2">
        <span className="text-xl">🧙‍♂️</span>
        <h3 className="text-sm font-black text-yellow-500 uppercase tracking-widest">Alchemist's Oracle</h3>
      </div>

      <div className="max-h-[200px] overflow-y-auto bg-black/40 rounded-lg p-3 text-xs text-blue-100 font-mono leading-relaxed whitespace-pre-wrap min-h-[100px]">
        {response || "Ready to assist, milord. Ask of me what you will."}
      </div>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Query the Oracle..." 
          className="flex-1 bg-[#f4e4bc] border-2 border-[#3d2b1f] rounded-lg px-3 py-2 text-xs font-bold text-[#3d2b1f] placeholder-[#3d2b1f]/50 outline-none"
        />
        <button 
          disabled={loading}
          type="submit" 
          className="bg-[#8b0000] hover:bg-[#a52a2a] disabled:bg-gray-700 text-white font-black px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-all border-b-4 border-[#4d0000] active:border-b-0"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
