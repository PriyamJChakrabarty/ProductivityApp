import { initDB } from "./actions";
import { UserButton } from "@clerk/nextjs";
import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "./DashboardLayout";

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
    <div className="min-h-screen bg-[#0f1711] flex flex-col p-6 overflow-hidden h-screen">
      
      {/* HEADER */}
      <header className="flex justify-between items-center shrink-0 w-full max-w-7xl mx-auto px-4 border-b-2 border-yellow-700/20 pb-4">
        <div className="flex items-center gap-6">
            <UserButton />
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 drop-shadow uppercase tracking-widest">
                Monster Slayer
            </h1>
        </div>

        {/* Beasts Slain - Outside bounding box */}
        <div className="bg-[#2c1e14] text-white px-6 py-3 rounded-2xl border-4 border-[#8b0000] shadow-xl flex items-center gap-3">
          <div className="text-xl">⚔️</div>
          <div>
            <p className="text-[10px] font-bold text-red-100/50 uppercase tracking-widest mb-0.5 leading-none">Slain</p>
            <div className="text-3xl font-black text-white leading-none">
              {totalKills}
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD LAYOUT (Contains Map and Oracle) */}
      <DashboardLayout tasks={activeTasks} />

    </div>
  );
}
