import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { topic = "Product Sense", difficulty = 3 } = await req.json().catch(() => ({}));
  const system = `You are an expert PM interviewer. Return ONLY JSON:
  { "question": string, "topic": string, "difficulty": number, "expected_axes": string[] }`;
  const user = `Give one interview question for topic="${topic}", difficulty=${difficulty}.`;

  const r = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: system }, { role: "user", content: user }],
    response_format: { type: "json_object" },
  });

  const json = JSON.parse(r.choices[0].message?.content ?? "{}");
  return NextResponse.json(json);
}
