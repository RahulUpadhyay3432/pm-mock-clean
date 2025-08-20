import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { Evaluation } from '@/types/interview';
import { getOpenAI, hasOpenAI } from '@/lib/openai';

function mockEvaluate(answer: string): Evaluation {
  // super basic heuristic
  const lengthScore = Math.min(5, Math.floor(answer.split(/\s+/).length / 40));
  const rubric = {
    structure: Math.max(2, lengthScore),
    clarity: Math.max(2, lengthScore),
    productSense: Math.max(2, lengthScore),
    communication: Math.max(2, lengthScore),
  };
  const score = Math.min(100, 60 + lengthScore * 8);
  return {
    score,
    summary: 'Mock feedback (no OpenAI key): Decent structure and clarity. Try to state problem, constraints, tradeoffs, and metrics more explicitly.',
    strengths: ['Clear flow', 'Addresses basics'],
    improvements: ['Add metrics', 'Discuss edge cases', 'Call out risks & tradeoffs'],
    rubric
  };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  const { ok } = rateLimit(`eval:${ip}`);
  if (!ok) return NextResponse.json({ error: 'Rate limit' }, { status: 429 });

  const { question, answer } = await req.json() as { question: string; answer: string; };

  if (!question || !answer) {
    return NextResponse.json({ error: 'question and answer are required' }, { status: 400 });
  }

  if (!hasOpenAI()) {
    const evaluation = mockEvaluate(answer);
    return NextResponse.json({ evaluation });
  }

  const openai = getOpenAI();
  const sys = `You are a senior PM interviewer. Score 0-100 and provide structured feedback. Return ONLY JSON with:
{
 "score": number,
 "summary": string,
 "strengths": string[],
 "improvements": string[],
 "rubric": { "structure": 0-5, "clarity": 0-5, "productSense": 0-5, "communication": 0-5 }
}`;

  const user = `Question: ${question}\nCandidate Answer: ${answer}`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: user }
    ],
    response_format: { type: 'json_object' }
  });

  const content = resp.choices[0]?.message?.content ?? '{}';
  let parsed: Evaluation;
  try {
    parsed = JSON.parse(content) as Evaluation;
  } catch {
    parsed = mockEvaluate(answer);
  }

  return NextResponse.json({ evaluation: parsed });
}