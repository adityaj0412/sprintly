
import { GoogleGenAI, Type } from "@google/genai";
import { Priority, AISuggestion, Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function suggestNextTasks(existingTasks: Task[]): Promise<AISuggestion[]> {
  const taskSummary = existingTasks.map(t => `${t.title} (${t.priority})`).join(", ");
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Given the existing tasks: [${taskSummary}], suggest 3 new productive tasks that would logically follow. Provide a brief description and a recommended priority (URGENT, HIGH, MEDIUM, LOW).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedPriority: { 
              type: Type.STRING,
              description: "Must be one of URGENT, HIGH, MEDIUM, or LOW"
            },
          },
          required: ["title", "description", "suggestedPriority"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
}

export async function optimizePriority(title: string, description: string): Promise<Priority> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following task and categorize its priority as URGENT, HIGH, MEDIUM, or LOW based on its context.
    Task: ${title}
    Details: ${description}
    Return only the priority level.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          priority: { type: Type.STRING }
        },
        required: ["priority"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    const p = data.priority.toUpperCase();
    if (Object.values(Priority).includes(p as Priority)) {
      return p as Priority;
    }
    return Priority.MEDIUM;
  } catch (e) {
    return Priority.MEDIUM;
  }
}
