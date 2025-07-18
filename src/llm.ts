import dotenv from "dotenv";
import { openai } from './ai'
import type OpenAI from 'openai'
import { zodFunction } from 'openai/helpers/zod'

dotenv.config();

export const runLLM = async ({ messages, tools}: { messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], tools: any[] }) => {
  const formattedTools = tools.map(zodFunction)

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini", 
    temperature: 0.1,
    messages,
    tools: formattedTools,
    tool_choice: 'auto',
    parallel_tool_calls: false,
  });

  return response.choices[0].message;
};
