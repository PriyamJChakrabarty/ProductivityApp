"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { bulkTaskCreate } from "./actions";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function askGemini(prompt: string) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    return "Error: Gemini API Key not set in .env.local";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemInstruction = `You are a battle strategist for 'Monster Slayer'.
    The user will provide a goal.
    
    1. Break down the goal into 4-7 ultra-simple, 1-3 word task names (e.g., 'Buy Milk', 'Write Intro').
    2. Provide a 'BATTLE ROADMAP' of short, single-sentence instructions for each task. NO JARGON. Keep it simple enough for a child.
    3. At the end, MUST include this exact section: [TASKS: short_name1, short_name2, ...]
    
    Format:
    BATTLE PLAN:
    - Task 1 name: Simple step 1.
    - Task 2 name: Simple step 2.
    ...
    [TASKS: name1, name2, ...]`;

    const result = await model.generateContent(`${systemInstruction}\n\nUser Goal: ${prompt}`);
    const response = await result.response;
    const text = response.text();

    // Parse tasks from the response
    const taskMatch = text.match(/\[TASKS:\s*(.*?)\]/);
    if (taskMatch && taskMatch[1]) {
      const taskTitles = taskMatch[1].split(',').map(t => t.trim().substring(0, 20)); // Keep it very short
      await bulkTaskCreate(taskTitles);
    }

    return text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return `Error: ${error.message || "Failed to fetch response"}`;
  }
}
