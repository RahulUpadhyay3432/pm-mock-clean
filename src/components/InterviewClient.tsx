'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { PMQuestion, Evaluation, Attempt } from '@/types/interview';

async function apiGenerateQuestion(): Promise<PMQuestion> {
  const res = await fetch('/api/generate-question', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to generate question');
  const data = await res.json() as { question: PMQuestion };
  return data.question;
}

async function apiEvaluateAnswer(question: string, answer: string): Promise<Evaluation> {
  const res = await fetch('/api/evaluate-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer }),
  });
  if (!res.ok) throw new Error('Failed to evaluate answer');
  const data = await res.json() as { evaluation: Evaluation };
  return data.evaluation;
}

async function apiSaveAttempt(attempt: Attempt): Promise<{ id: string }> {
  const res = await fetch('/api/attempts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attempt),
  });
  if (!res.ok) throw new Error('Failed to save attempt');
  return (await res.json()) as { id: string };
}

export default function InterviewClient() {
  const [loading, setLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<PMQuestion | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(120); // seconds

  // start a question
  const start = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setEvaluation(null);
      setAnswer('');
      setLoading(true);
      const q = await apiGenerateQuestion();
      setQuestion(q);
      setCountdown(120);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // simple timer
  useEffect(() => {
    if (!question || evaluation) return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [question, evaluation, countdown]);

  const submit = useCallback(async (): Promise<void> => {
    if (!question) return;
    try {
      setLoading(true);
      const ev = await apiEvaluateAnswer(question.prompt, answer);
      setEvaluation(ev);

      // save attempt after evaluation
      const attempt: Attempt = {
        question: question.prompt,
        answer,
        evaluation: ev,
        createdAt: new Date().toISOString(),
        userId: null,
      };
      await apiSaveAttempt(attempt);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [question, answer]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Mock PM Interview</h1>
        <button
          className="px-3 py-2 rounded-lg bg-black text-white disabled:opacity-50"
          onClick={start}
          disabled={loading}
        >
          {question ? 'New Question' : 'Start'}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 text-red-700 p-3">{error}</div>
      )}

      {question && (
        <div className="space-y-3">
          <div className="rounded-xl border p-4">
            <div className="text-sm text-gray-500">
              {question.category ?? 'General'} · {question.difficulty ?? 'medium'}
            </div>
            <p className="text-lg font-medium mt-1">{question.prompt}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm">
              ⏳ Time left: <span className="font-semibold">{countdown}s</span>
            </div>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full h-40 border rounded-xl p-3"
            placeholder="Type your answer here…"
            disabled={!!evaluation || loading || countdown <= 0}
          />

          <div className="flex gap-3">
            <button
              className="px-3 py-2 rounded-lg border"
              onClick={() => setAnswer('')}
              disabled={!!evaluation || loading}
            >
              Clear
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-black text-white disabled:opacity-50"
              onClick={submit}
              disabled={!answer || !!evaluation || loading}
            >
              Submit for feedback
            </button>
          </div>
        </div>
      )}

      {evaluation && (
        <div className="rounded-xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Feedback</h2>
            <div className="text-sm">Score: <span className="font-bold">{evaluation.score}</span>/100</div>
          </div>
          <p className="text-gray-700">{evaluation.summary}</p>

          {evaluation.rubric && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="rounded-md bg-gray-50 p-2">
                <div className="text-gray-500">Structure</div>
                <div className="font-medium">{evaluation.rubric.structure}/5</div>
              </div>
              <div className="rounded-md bg-gray-50 p-2">
                <div className="text-gray-500">Clarity</div>
                <div className="font-medium">{evaluation.rubric.clarity}/5</div>
              </div>
              <div className="rounded-md bg-gray-50 p-2">
                <div className="text-gray-500">Product Sense</div>
                <div className="font-medium">{evaluation.rubric.productSense}/5</div>
              </div>
              <div className="rounded-md bg-gray-50 p-2">
                <div className="text-gray-500">Communication</div>
                <div className="font-medium">{evaluation.rubric.communication}/5</div>
              </div>
            </div>
          )}

          {evaluation.strengths?.length > 0 && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Strengths</div>
              <ul className="list-disc pl-5 space-y-1">
                {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {evaluation.improvements?.length > 0 && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Improvements</div>
              <ul className="list-disc pl-5 space-y-1">
                {evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
