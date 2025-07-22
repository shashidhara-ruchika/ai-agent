import 'dotenv/config'
import { runAgent } from './src/agent'
import { z } from 'zod'

const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

const weatherTool = {
  name: 'get_weather',
  description: `use this to get the weather.`,
  parameters: z.object({
    reasoning: z.string().describe('why did you pick this tool?'),
  }),
}

const response = await runAgent({ userMessage, tools: [weatherTool] })

response.forEach((msg: { role: string; content?: any }) => {
  let contentStr = '';
  if (typeof msg.content === 'string') {
    contentStr = msg.content;
  } else if (Array.isArray(msg.content)) {
    // If content is an array, join text parts
    contentStr = msg.content.map((part: any) => part.text ?? '').join(' ');
  } else if (msg.content != null) {
    contentStr = String(msg.content);
  }
  console.log(`${msg.role}: ${contentStr}`);
});