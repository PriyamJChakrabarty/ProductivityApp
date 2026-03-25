"use client";

import { useState } from "react";
import { askGemini } from "./geminiAction";

export default function GeminiChat() {
  const [query, setQuery] = useState("");
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    const result = await askGemini(query);
    
    const cleanText = result.replace(/\[TASKS:.*?\]/g, "").trim();
    // Split on newlines, but only keep lines that aren't empty
    const lines = cleanText.split('\n').filter(l => l.trim().length > 0);
    setRoadmap(lines);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Oracle Input Area */}
      <div className="bg-[#2c1e14] border-4 border-[#b8860b] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 shrink-0">
        <div className="flex items-center gap-3 border-b-2 border-[#b8860b]/30 pb-3">
            <span className="text-2xl">🧙‍♂️</span>
            <h3 className="text-lg font-black text-yellow-500 uppercase tracking-widest leading-none">Oracle</h3>
        </div>

        <form onSubmit={handleAsk} className="flex flex-col gap-3">
            <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Declare your quest..." 
                className="w-full bg-[#f4e4bc] border-2 border-[#3d2b1f] rounded-xl px-4 py-3 text-sm font-bold text-[#3d2b1f] placeholder-[#3d2b1f]/50 outline-none h-24 resize-none"
            />
            <button 
                disabled={loading}
                type="submit" 
                className="bg-[#8b0000] hover:bg-[#a52a2a] disabled:bg-gray-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all border-b-6 border-[#4d0000] active:border-b-0 shadow-lg"
            >
                {loading ? "PROPHESYING..." : "SEEK COUNSEL"}
            </button>
        </form>
      </div>

      {/* STRATEGY LOG - Scrollable container */}
      <div className="flex-1 bg-black/40 border-4 border-[#3d2b1f] rounded-3xl p-4 flex flex-col gap-4 overflow-hidden relative">
        <div className="shrink-0 flex items-center justify-between border-b border-[#b8860b]/20 pb-2 mb-2">
            <h4 className="text-[10px] font-black text-yellow-500/70 uppercase tracking-widest">Strategy Log</h4>
            <div className={`w-2 h-2 rounded-full ${roadmap.length > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
        </div>

        <div className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scrollbar scroll-smooth">
            {roadmap.length > 0 ? (
                roadmap.map((step, i) => (
                    <div 
                        key={i} 
                        className="bg-[#f4e4bc] border-l-8 border-[#8b0000] p-5 rounded-r-2xl shadow-[0_4px_10px_rgba(0,0,0,0.3)] transform transition-all hover:scale-[1.02] active:scale-100"
                    >
                        <div className="flex gap-3">
                            <span className="text-red-800 font-black text-xs opacity-50">#0{i+1}</span>
                            <p className="text-[#3d2b1f] font-bold text-sm leading-relaxed">
                                {step.replace(/^[*-]\s*/, "")}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4">
                    <span className="text-4xl opacity-20 grayscale">📜</span>
                    <p className="text-yellow-500/30 italic text-sm font-medium">The prophecy is yet unwritten. Declare your quest above to generate a battle roadmap.</p>
                </div>
            )}
        </div>

        {/* Fancy side scroll indicator */}
        <div className="absolute right-1 top-12 bottom-4 w-1 bg-[#b8860b]/10 rounded-full" />
      </div>
    </div>
  );
}
