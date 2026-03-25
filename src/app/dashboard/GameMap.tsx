"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { completeTask } from "./actions";

export default function GameMap({ tasks }: { tasks: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [heroPos, setHeroPos] = useState({ x: 50, y: 50 });
  const [attackingTaskId, setAttackingTaskId] = useState<number | null>(null);

  const handleDefeatMonster = async (task: any) => {
    // If hero is already in the monster's spot or attacking, ignore clicks
    if (attackingTaskId !== null) return;
    
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
    <div className="relative w-full h-full overflow-hidden">
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
        className="absolute z-30 w-32 h-32 transition-all duration-500 ease-out drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)]"
        style={{ 
          top: `${heroPos.y}%`, 
          left: `${heroPos.x}%`, 
          transform: `translate(-50%, -50%) ${attackingTaskId ? 'scale(1.25) rotate(10deg) brightness(1.2)' : 'scale(1)'}` 
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
        // Fix: Increase Z-index and add pointer-events-auto if not being attacked
        // We also check if the hero is sitting on this monster to ensure clean strike boundaries
        const isHeroOccupying = (Math.abs(heroPos.x - task.x) < 2) && (Math.abs(heroPos.y - task.y) < 2);

        return (
          <div 
            key={task.id} 
            className={`absolute z-20 w-32 h-32 transition-all duration-300 group ${isBeingAttacked ? 'opacity-50 scale-150 grayscale' : 'hover:scale-110 active:scale-95'}`}
            style={{ 
                top: `${task.y}%`, 
                left: `${task.x}%`, 
                transform: 'translate(-50%, -50%)',
                cursor: attackingTaskId ? 'not-allowed' : 'pointer',
                // Ensure clickable regardless of hero overlap
                pointerEvents: 'auto'
            }}
            onClick={() => handleDefeatMonster(task)}
          >
            {/* Monster Spirit */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                <Image 
                    src="/monster.png" 
                    alt="Monster" 
                    fill 
                    className={`object-contain drop-shadow-2xl transition-all ${isBeingAttacked ? 'animate-ping' : ''}`} 
                />
                
                {/* Task Title Overlay */}
                <div className="absolute -top-12 z-20 pointer-events-none w-max max-w-[200px] text-center">
                  <span className="bg-white text-gray-900 text-[11px] font-black px-4 py-1.5 rounded-lg shadow-xl border-2 border-gray-900 uppercase tracking-tighter block truncate">
                    {task.title}
                  </span>
                </div>

                {/* KILL BUBBLE - Positioned to the side */}
                <div 
                    className="absolute -right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100 pointer-events-none"
                >
                    <div className="bg-red-600 text-white font-black text-sm px-6 py-3 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] border-4 border-white animate-pulse">
                        STRIKE!
                    </div>
                </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-6 left-6 text-[#f4e4bc]/50 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
        Strike the beasts to clear your path.
      </div>
    </div>
  );
}
