import Groq from "groq-sdk";

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  }
  return client;
}

export const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function generateWithGroq(prompt: string): Promise<string> {
  const groq = getClient();
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a creative gift recommendation expert. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });
  return completion.choices[0]?.message?.content ?? "";
}
