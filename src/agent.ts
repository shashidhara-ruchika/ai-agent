import type { AIMessage } from '../types'
import { addMessages, getMessages } from './memory'
import { runLLM } from './llm'
import { showLoader, logMessage } from './ui'

export const runAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string
  tools: any[]
}) => {
  await addMessages([{ role: 'user', content: userMessage }])

  const loader = showLoader('🤔')
  let history = await getMessages()

  // First LLM call
  let response = await runLLM({ messages: history, tools })

  // Handle tool calls if present
  if (response && response.tool_calls) {
    // For each tool call, run the tool and create a tool message
    const toolMessages = await Promise.all(
      response.tool_calls.map(async (call: any) => {
        // Find the tool by name
        const tool = tools.find(t => t.name === call.function.name)
        let toolResult = ''
        if (tool) {
          // Parse arguments and run the tool function (mocked here)
          const args = JSON.parse(call.function.arguments)
          toolResult = `Pretend result for ${tool.name} with args: ${JSON.stringify(args)}`
        } else {
          toolResult = 'Tool not found'
        }
        return {
          role: 'tool' as const,
          tool_call_id: String(call.id),
          content: toolResult,
        }
      })
    )

    // Add assistant and tool messages to history
    history = [...history, response, ...toolMessages]

    // Call the model again with the updated history
    response = await runLLM({ messages: history, tools })
  } else if (response) {
    // Add assistant message to history if no tool calls
    history = [...history, response]
  }

  if (response) {
    await addMessages([response])
  }
  loader.stop()
  return history
}