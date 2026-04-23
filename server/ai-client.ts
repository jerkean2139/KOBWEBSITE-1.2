import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";

// Singleton Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model mapping: OpenAI → Claude equivalents
// gpt-4o → claude-sonnet-4-20250514 (fast, capable, cost-effective)
// gpt-4o-mini → claude-haiku-3-5-20241022 (fastest, cheapest)
const MODEL_MAP = {
  "gpt-4o": "claude-sonnet-4-6-20250627",
  "gpt-4o-mini": "claude-haiku-4-5-20251001",
} as const;

type OpenAIModel = keyof typeof MODEL_MAP;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface CompletionOptions {
  model?: OpenAIModel;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" };
}

/**
 * Drop-in replacement for OpenAI chat completions using Claude.
 * Accepts the same message format and returns a compatible response shape.
 */
export async function chatCompletion(options: CompletionOptions): Promise<{
  content: string;
  model: string;
  usage: { prompt_tokens: number; completion_tokens: number };
}> {
  const model = MODEL_MAP[options.model || "gpt-4o"];

  // Extract system message (Anthropic separates system from messages)
  const systemMessages = options.messages.filter((m) => m.role === "system");
  const nonSystemMessages = options.messages.filter((m) => m.role !== "system");
  const systemPrompt = systemMessages.map((m) => m.content).join("\n\n") || undefined;

  // If JSON format requested, add instruction to system prompt
  let finalSystem = systemPrompt;
  if (options.response_format?.type === "json_object") {
    const jsonInstruction = "\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanation — just the JSON object.";
    finalSystem = finalSystem ? finalSystem + jsonInstruction : jsonInstruction;
  }

  const response = await anthropic.messages.create({
    model,
    max_tokens: options.max_tokens || 4096,
    temperature: options.temperature ?? 0.7,
    system: finalSystem,
    messages: nonSystemMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const textContent = response.content.find((c) => c.type === "text");
  let content = textContent?.text || "";

  // Clean up JSON responses — Claude sometimes wraps in markdown code blocks
  if (options.response_format?.type === "json_object" && content.includes("```")) {
    content = content.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();
  }

  logger.info("Claude API call", {
    model,
    input_tokens: response.usage.input_tokens,
    output_tokens: response.usage.output_tokens,
  });

  return {
    content,
    model,
    usage: {
      prompt_tokens: response.usage.input_tokens,
      completion_tokens: response.usage.output_tokens,
    },
  };
}

/**
 * Streaming chat completion — returns an async iterable of text chunks.
 * Used for SSE endpoints (micropod, content-studio).
 */
export async function* chatCompletionStream(options: CompletionOptions): AsyncGenerator<string> {
  const model = MODEL_MAP[options.model || "gpt-4o"];

  const systemMessages = options.messages.filter((m) => m.role === "system");
  const nonSystemMessages = options.messages.filter((m) => m.role !== "system");
  const systemPrompt = systemMessages.map((m) => m.content).join("\n\n") || undefined;

  const stream = anthropic.messages.stream({
    model,
    max_tokens: options.max_tokens || 4096,
    temperature: options.temperature ?? 0.7,
    system: systemPrompt,
    messages: nonSystemMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield event.delta.text;
    }
  }
}

export { anthropic };
