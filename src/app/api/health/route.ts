import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export async function GET() {
  let dbOk = "ok";
  let aiOk = "ok";
  try { await db.$queryRaw`SELECT 1`; } catch { dbOk = "fail"; }
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 1,
    });
  } catch { aiOk = "fail"; }
  return NextResponse.json({ db: dbOk, openai: aiOk });
}
