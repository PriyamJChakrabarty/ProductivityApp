"use client";

import { useState, useTransition } from "react";
import GameMap from "./GameMap";
import { askGemini } from "./geminiAction";
import { createTask } from "./actions";

export default function DashboardLayout({ tasks }: { tasks: any[] }) {
  const [query, setQuery] = useState("");
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

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
    setQuery("");
  }

  return (
    <div className="flex flex-1 gap-6 w-full max-w-7xl mx-auto overflow-hidden min-h-0 mt-4">
      
      {/* LEFT COLUMN: Map & Oracle Input */}
      <div className="flex-[3] flex flex-col gap-4 min-w-[600px] overflow-hidden min-h-0 h-full">
        
        {/* Game Map Box */}
        <div className="flex-1 min-h-0 relative bg-[#1a2e1a] border-8 border-[#3d2b1f] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
            <GameMap tasks={tasks} />
        </div>

        {/* Oracle Input Box (Below Map) */}
        <div className="shrink-0 bg-[#2c1e14] border-4 border-[#b8860b] rounded-2xl p-4 shadow-xl flex items-center gap-4">
            <div className="shrink-0 flex items-center gap-2">
                <span className="text-3xl">🧙‍♂️</span>
                <div className="flex flex-col">
                    <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest leading-none">Declare Quest</span>
                    <span className="text-lg font-black text-white uppercase tracking-wider leading-none">Oracle</span>
                </div>
            </div>

            <form onSubmit={handleAsk} className="flex-1 flex gap-3">
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="E.g. Build a treehouse..." 
                    disabled={loading}
                    className="flex-1 bg-[#f4e4bc] border-2 border-[#3d2b1f] rounded-xl px-4 py-2 text-sm font-bold text-[#3d2b1f] placeholder-[#3d2b1f]/50 outline-none"
                />
                <button 
                    disabled={loading || !query.trim()}
                    type="submit" 
                    className="bg-[#8b0000] hover:bg-[#a52a2a] disabled:bg-gray-700 disabled:opacity-50 text-white font-black px-6 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
                >
                    {loading ? "PROPHESYING..." : "SEEK COUNSEL"}
                </button>
            </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Strategy Log Card List */}
      <div className="flex-[1.2] bg-black/40 border-4 border-[#3d2b1f] rounded-3xl p-4 flex flex-col gap-4 min-w-[350px] overflow-hidden min-h-0 h-full relative">
        <div className="shrink-0 flex items-center justify-between border-b border-[#b8860b]/20 pb-2">
            <h4 className="text-xs font-black text-yellow-500/80 uppercase tracking-widest flex items-center gap-2">
                <span className="text-lg">📜</span> Strategy Log
            </h4>
            <div className={`w-2 h-2 rounded-full ${roadmap.length > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scrollbar min-h-0 h-full">
            {roadmap.length > 0 ? (
                roadmap.map((step, i) => (
                    <div 
                        key={i} 
                        className="bg-[#f4e4bc] border-l-8 border-[#8b0000] p-4 rounded-r-xl shadow-md"
                    >
                        <div className="flex gap-2">
                            <span className="text-red-800 font-black text-xs opacity-50 shrink-0">#{String(i+1).padStart(2, '0')}</span>
                            <p className="text-[#3d2b1f] font-bold text-sm leading-snug">
                                {step.replace(/^[*-]\s*/, "")}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4">
                    <p className="text-yellow-500/40 italic text-sm font-medium">The prophecy is yet unwritten.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
