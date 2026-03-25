"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { completeTask, createTask } from "./actions";

export default function GameMap({ tasks, initialCoins }: { tasks: any[], initialCoins: number }) {
  const [isPending, startTransition] = useTransition();
  const [heroPos, setHeroPos] = useState({ x: 50, y: 50 });
  const [attackingTaskId, setAttackingTaskId] = useState<number | null>(null);

  const handleDefeatMonster = async (task: any) => {
    setAttackingTaskId(task.id);
    // Move hero to monster position
    setHeroPos({ x: task.x, y: task.y });
    
    // Small delay for "travel" or "attack" feel
    setTimeout(() => {
      startTransition(() => {
        completeTask(task.id);
        setAttackingTaskId(null);
      });
    }, 400);
  };

  return (
    <div className="relative w-full h-[85vh] bg-[#1a2e1a] overflow-hidden flex items-center justify-center border-8 border-[#3d2b1f] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* Grass Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
        }} 
      />

      {/* Hero Sprite - Moves to monster on kill */}
      <div 
        className="absolute z-30 w-32 h-32 transition-all duration-500 ease-out drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
        style={{ 
          top: `${heroPos.y}%`, 
          left: `${heroPos.x}%`, 
          transform: `translate(-50%, -50%) ${attackingTaskId ? 'scale(1.2) rotate(10deg)' : 'scale(1)'}` 
        }}
      >
        <Image src="/hero.png" alt="Hero" fill className="object-contain" priority />
        <div className="absolute -bottom-6 w-full text-center">
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-white uppercase tracking-tighter shadow-lg">
                YOU
            </span>
        </div>
      </div>

      {/* Monsters (Active Tasks) */}
      {tasks.map((task) => {
        const isBeingAttacked = attackingTaskId === task.id;

        return (
          <div 
            key={task.id} 
            className={`absolute z-20 w-28 h-28 transition-all duration-300 group ${isBeingAttacked ? 'opacity-50 scale-150 grayscale' : 'hover:scale-105'}`}
            style={{ 
                top: `${task.y}%`, 
                left: `${task.x}%`, 
                transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Monster Spirit */}
            <div className="relative w-full h-full cursor-pointer flex flex-col items-center justify-center" onClick={() => handleDefeatMonster(task)}>
                <Image 
                    src="/monster.png" 
                    alt="Monster" 
                    fill 
                    className={`object-contain drop-shadow-2xl transition-all ${isBeingAttacked ? 'animate-ping' : ''}`} 
                />
                
                {/* Task Title Overlay */}
                <div className="absolute -top-10 z-10">
                  <span className="bg-white text-gray-900 text-[11px] font-black px-3 py-1 rounded shadow-sm border-2 border-gray-800 uppercase tracking-tighter whitespace-nowrap">
                    {task.title}
                  </span>
                </div>

                {/* KILL BUBBLE - Positioned to the side */}
                <div 
                    className="absolute -right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100"
                >
                    <div className="bg-red-600 text-white font-black text-sm px-4 py-2 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] border-2 border-white animate-pulse">
                        STRIKE!
                    </div>
                </div>
            </div>
          </div>
        );
      })}

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
        
        {/* Kill Counter */}
        <div className="bg-[#2c1e14] text-white p-5 rounded-2xl border-4 border-[#8b0000] shadow-[0_10px_30px_rgba(0,0,0,0.5)] pointer-events-auto flex items-center gap-4">
          <div className="bg-[#8b0000] p-3 rounded-xl border-2 border-white/20 text-2xl">⚔️</div>
          <div>
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mb-1">Beasts Slain</p>
            <div className="text-5xl font-black text-white leading-none">
              {initialCoins}
            </div>
          </div>
        </div>

        {/* Task Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const title = formData.get('title');
            if (title) {
                startTransition(() => { 
                    createTask(formData); 
                    form.reset();
                });
            }
          }} 
          className="bg-[#f4e4bc] p-1 rounded-xl shadow-2xl pointer-events-auto flex items-stretch border-4 border-[#3d2b1f]"
        >
          <input 
            type="text" 
            name="title" 
            placeholder="Name your quarry..." 
            required
            className="px-6 py-3 bg-transparent border-none font-bold text-[#3d2b1f] placeholder-[#3d2b1f]/50 italic focus:outline-none min-w-[300px]"
          />
          <button 
            type="submit" 
            className="bg-[#8b0000] hover:bg-[#a52a2a] active:scale-95 transition-all text-white font-black px-8 py-3 rounded-lg uppercase tracking-widest border-b-4 border-[#4d0000]"
          >
            Summon
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 left-6 text-[#f4e4bc]/50 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
        Strike the beasts to clear your path.
      </div>
    </div>
  );
}
