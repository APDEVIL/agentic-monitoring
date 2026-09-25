const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-120b";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callGroq(
  messages: GroqMessage[],
  opts?: { temperature?: number; jsonMode?: boolean }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set (run: bunx convex env set GROQ_API_KEY ...)");

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: opts?.temperature ?? 0.3,
      ...(opts?.jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq API error (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq API returned no content");
  return content;
}

// Convenience wrapper for when you want structured JSON back
// (used by diagnosis.ts and resolution.ts)
export async function callGroqJSON<T>(messages: GroqMessage[]): Promise<T> {
  const raw = await callGroq(messages, { jsonMode: true });
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`Failed to parse Groq JSON response: ${raw}`);
  }
}