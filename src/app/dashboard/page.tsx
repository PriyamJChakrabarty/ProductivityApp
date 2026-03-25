import { initDB } from "./actions";
import { UserButton } from "@clerk/nextjs";
import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GameMap from "./GameMap";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Ensure table exists; ignore if already exists
  try {
    await initDB();
  } catch (error) {}

  let activeTasks: any[] = [];
  let totalCoins = 0;

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
      SELECT SUM(coins_earned) as total
      FROM game_tasks 
      WHERE user_id = ${userId} AND status = 'completed'
    `;
    totalCoins = Number(result[0]?.total || 0);
  } catch (error) {
    // Return empty if newly created
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <header className="absolute top-4 left-4 z-50">
        <UserButton />
      </header>

      <div className="w-full max-w-6xl text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 drop-shadow uppercase tracking-widest">
          Monster Slayer
        </h1>
        <p className="text-gray-400 font-medium">Clear the board quickly before bounties vanish!</p>
      </div>

      <GameMap tasks={activeTasks} initialCoins={totalCoins} />
    </div>
  );
}
