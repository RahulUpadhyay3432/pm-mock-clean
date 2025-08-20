import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const Input = z.object({
  question: z.string().min(10),
  transcript: z.string().min(5),
});

export async function POST(req: Request) {
  const body = await req.json();
  const { question, transcript } = Input.parse(body);

  const system = `You are a PM interviewer. Return ONLY JSON:
  {
    "rubric": { "structure":0-5,"clarity":0-5,"product_thinking":0-5,"metrics":0-5,"communication":0-5 },
    "strengths": string[], "gaps": string[], "overall_score":0-100, "coaching": string
  }`;

  const user = `Question:\n${question}\n\nCandidate answer:\n${transcript}`;

  const r = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: system }, { role: "user", content: user }],
    response_format: { type: "json_object" },
  });

  const json = JSON.parse(r.choices[0].message?.content ?? "{}");
  return NextResponse.json(json);
}
