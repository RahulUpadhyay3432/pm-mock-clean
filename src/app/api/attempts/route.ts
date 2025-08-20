import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const attempts = await prisma.attempt.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });
  return NextResponse.json({ attempts });
}

export async function POST(req: NextRequest) {
  const { question, answer, evaluation } = await req.json() as {
    question: string;
    answer: string;
    evaluation: unknown;
  };

  if (!question || !answer || !evaluation) {
    return NextResponse.json({ error: 'Missing payload' }, { status: 400 });
  }

  const created = await prisma.attempt.create({
    data: {
      question,
      answer,
      evaluation: evaluation as object
    },
    select: { id: true }
  });

  return NextResponse.json(created);
}