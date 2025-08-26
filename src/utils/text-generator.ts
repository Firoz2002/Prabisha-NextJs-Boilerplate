import { generateText } from 'ai';
import { prisma } from '@/lib/prisma';
import { createTogetherAI } from '@ai-sdk/togetherai';

const togetherai = createTogetherAI({
  apiKey: process.env.TOGETHER_AI_API_KEY ?? '',
});

export async function generateContent(prompt: string) {
  try {
    const model = togetherai('meta-llama/Llama-3.3-70B-Instruct-Turbo');

    const { text } = await generateText({
        model,
        temperature: 0.7,
        prompt: prompt
    });

    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "";
  }
}
