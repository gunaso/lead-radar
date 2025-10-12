import { wrapOpenAI } from "langsmith/wrappers"
import { traceable } from "langsmith/traceable"
import OpenAI from 'openai'

const client = wrapOpenAI(new OpenAI())

export const sendMessage = traceable(async (message: string) => {
  const response = await client.responses.create({
    prompt: {
      "id": "pmpt_68e47f5e870c8196b29f615d98aefa260129ab9c6777f2a0",
      "version": "3",
      "variables": {
        "scraped": message
      }
    }
  });
  
  try {
    // Try to parse the output as JSON
    const parsed = JSON.parse(response.output_text);
    return parsed;
  } catch {
    // If parsing fails, return invalid response
    return { valid: false };
  }
})