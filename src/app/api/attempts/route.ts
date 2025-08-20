import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export async function GET(req: Request) {
  const anonId = (req.headers.get("x-anon-id") || "").trim();
  if (!anonId) return NextResponse.json([]);
  const rows = await db.pMAttempt.findMany({
    where: { anonId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(rows);
}

const Save = z.object({
  anonId: z.string().min(4),
  mode: z.enum(["text", "voice"]),
  question: z.string(),
  topic: z.string().optional(),
  difficulty: z.number().optional(),
  transcript: z.string().optional(),
  feedback: z.any().optional(),
  structure: z.number().optional(),
  clarity: z.number().optional(),
  productThinking: z.number().optional(),
  metrics: z.number().optional(),
  communication: z.number().optional(),
  overallScore: z.number().optional(),
  durationSec: z.number().optional(),
  audioUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  const data = Save.parse(await req.json());
  const row = await db.pMAttempt.create({
    data: {
      anonId: data.anonId,
      mode: data.mode,
      question: data.question,
      topic: data.topic,
      difficulty: data.difficulty,
      transcript: data.transcript,
      feedbackJson: data.feedback ?? null,
      structure: data.structure ?? null,
      clarity: data.clarity ?? null,
      productThinking: data.productThinking ?? null,
      metrics: data.metrics ?? null,
      communication: data.communication ?? null,
      overallScore: data.overallScore ?? null,
      durationSec: data.durationSec ?? null,
      audioUrl: data.audioUrl ?? null,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
