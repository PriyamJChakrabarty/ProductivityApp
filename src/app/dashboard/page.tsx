import { initDB } from "./actions";
import { UserButton } from "@clerk/nextjs";
import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GameMap from "./GameMap";
import GeminiChat from "./GeminiChat";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Ensure table exists; ignore if already exists
  try {
    await initDB();
  } catch (error) {}

  let activeTasks: any[] = [];
  let totalKills = 0;

  try {
    const rawTasks = await sql`
      SELECT id, title, created_at, x, y 
      FROM game_tasks 
      WHERE user_id = ${userId} AND status = 'active'
    `;

    // Serialize Dates to numbers
    activeTasks = rawTasks.map((t) => ({
      ...t,
      created_at: new Date(t.created_at).getTime(),
    }));

    const result = await sql`
      SELECT COUNT(*) as count
      FROM game_tasks 
      WHERE user_id = ${userId} AND status = 'completed'
    `;
    totalKills = Number(result[0]?.count || 0);
  } catch (error) {
    // Return empty if newly created
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <header className="absolute top-4 left-4 z-50">
        <UserButton />
      </header>

      <div className="w-full max-w-6xl text-center mb-4 flex justify-center items-end gap-3 px-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 drop-shadow uppercase tracking-widest">
          Monster Slayer
        </h1>
        <div className="h-0.5 flex-1 bg-gradient-to-r from-yellow-400/30 to-transparent mb-3" />
      </div>

      <div className="relative w-full max-w-7xl flex flex-col items-center">
        <GameMap tasks={activeTasks} initialCoins={totalKills} />
        
        {/* Gemini Chat Overlay (Bottom Right) */}
        <div className="absolute bottom-10 right-10 z-[100] max-w-sm">
          <GeminiChat />
        </div>
      </div>
    </div>
  );
}
