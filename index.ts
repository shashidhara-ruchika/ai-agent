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
  description: 'Get the current weather for a given city.',
  parameters: z.object({
    city: z.string().describe('The city to get the weather for'),
    reasoning: z.string().describe('Why did you pick this tool?'),
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