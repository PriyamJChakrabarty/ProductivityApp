"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS game_tasks (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP,
      x DECIMAL NOT NULL,
      y DECIMAL NOT NULL,
      status TEXT DEFAULT 'active',
      coins_earned INT DEFAULT 0
    )
  `;
}

export async function createTask(formData: FormData | string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let title = "";
  if (typeof formData === 'string') {
    title = formData;
  } else {
    title = formData.get("title") as string;
  }
  
  if (!title) return;

  // Monsters stay within 15% to 85% of map to stay inside bounding box.
  const x = Math.floor(Math.random() * 70) + 15; 
  const y = Math.floor(Math.random() * 70) + 15; 

  await initDB();

  await sql`
    INSERT INTO game_tasks (user_id, title, x, y)
    VALUES (${userId}, ${title}, ${x}, ${y})
  `;
  
  revalidatePath("/dashboard");
}

export async function bulkTaskCreate(titles: string[]) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  await initDB();

  for (const title of titles) {
    const x = Math.floor(Math.random() * 70) + 15;
    const y = Math.floor(Math.random() * 70) + 15;
    await sql`
      INSERT INTO game_tasks (user_id, title, x, y)
      VALUES (${userId}, ${title}, ${x}, ${y})
    `;
  }
  
  revalidatePath("/dashboard");
}

export async function completeTask(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Max 1000 coins, lose 1 coin every 36 seconds (100 coins an hour). Minimum 100.
  await sql`
    UPDATE game_tasks 
    SET 
      status = 'completed', 
      completed_at = CURRENT_TIMESTAMP,
      coins_earned = GREATEST(100, 1000 - FLOOR(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at)) / 36))
    WHERE id = ${id} AND user_id = ${userId} AND status = 'active'
  `;
  
  revalidatePath("/dashboard");
}
