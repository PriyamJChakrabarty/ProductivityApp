"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function submitFormAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const number = formData.get("number") as string;

  if (!name || !number) {
    throw new Error("Missing fields");
  }

  // Ensure table exists
  await sql`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      number TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Insert data
  await sql`
    INSERT INTO contacts (user_id, name, number)
    VALUES (${userId}, ${name}, ${number})
  `;

  revalidatePath("/dashboard");
}
