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

    // Updated system prompt to strictly return roadmap and JSON of tasks
    const systemInstruction = `You are a battle strategist for 'Monster Slayer'. 
    The user will provide a project or goal.
    1. Break down the project into 4-7 specific actionable tasks. 
    2. Provide a 'BATTLE ROADMAP' describing the tactical order to defeat these monsters.
    3. At the end, MUST include a section exactly like this: [TASKS: task1, task2, task3...]
    
    Format example:
    Here is your Battle Roadmap:
    - First, gather lumber (Kill the Wood Beast)
    - Next, build the craft (Slay the Constructor)
    ...
    [TASKS: Gather Lumber, Build Craft, Sail the Seas]`;

    const result = await model.generateContent(`${systemInstruction}\n\nUser Query: ${prompt}`);
    const response = await result.response;
    const text = response.text();

    // Parse tasks from the response
    const taskMatch = text.match(/\[TASKS:\s*(.*?)\]/);
    if (taskMatch && taskMatch[1]) {
      const taskTitles = taskMatch[1].split(',').map(t => t.trim());
      await bulkTaskCreate(taskTitles);
    }

    return text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return `Error: ${error.message || "Failed to fetch response"}`;
  }
}
