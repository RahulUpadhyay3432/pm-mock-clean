import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { PMQuestion } from '@/types/interview';
import { getOpenAI, hasOpenAI } from '@/lib/openai';

const SAMPLE_QUESTIONS: PMQuestion[] = [
  { prompt: 'Design a ride cancellation experience for a taxi app.', category: 'Design', difficulty: 'medium' },
  { prompt: 'How would you prioritize features for a freemium SaaS tool?', category: 'Prioritization', difficulty: 'easy' },
  { prompt: 'Define success metrics for a new onboarding flow.', category: 'Metrics', difficulty: 'medium' },
  { prompt: 'How would you improve retention for a news app?', category: 'Strategy', difficulty: 'hard' }
];

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  const { ok } = rateLimit(`gen:${ip}`);
  if (!ok) return NextResponse.json({ error: 'Rate limit' }, { status: 429 });

  if (!hasOpenAI()) {
    const q = SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)];
    return NextResponse.json({ question: q });
  }

  const openai = getOpenAI();
  const sys = `You are an expert PM interviewer. Return ONLY a JSON object with keys: prompt, category, difficulty ('easy'|'medium'|'hard').`;
  const user = `Generate one realistic PM interview question.`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: user }
    ],
    response_format: { type: 'json_object' }
  });

  const content = resp.choices[0]?.message?.content ?? '{}';
  let parsed: PMQuestion;
  try {
    parsed = JSON.parse(content) as PMQuestion;
  } catch {
    parsed = SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)];
  }

  return NextResponse.json({ question: parsed });
}