import dotenv from "dotenv";
import { openai } from './ai'
import type OpenAI from 'openai'

dotenv.config();

export const runLLM = async ({ messages }: { messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] }) => {
  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini", 
    temperature: 0.1,
    messages,
  });

  return response.choices[0].message.content;
};
