'use client';

import { useState, useCallback } from 'react';
import type { PMQuestion, Evaluation, AttemptDTO } from '@/types/interview';
import { useCountdown } from './Countdown';

async function postJSON<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export default function InterviewClient() {
  const [question, setQuestion] = useState<PMQuestion | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { remaining, reset } = useCountdown(120, Boolean(question && !evaluation));

  const newQuestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    setEvaluation(null);
    setAnswer('');
    try {
      const data = await postJSON<{ question: PMQuestion }>('/api/generate-question');
      setQuestion(data.question);
      reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to get question');
    } finally {
      setLoading(false);
    }
  }, [reset]);

  const submit = useCallback(async () => {
    if (!question) return;
    setLoading(true);
    setError(null);
    try {
      const data = await postJSON<{ evaluation: Evaluation }>(
        '/api/evaluate-answer',
        { question: question.prompt, answer }
      );
      setEvaluation(data.evaluation);

      // Save attempt
      await postJSON<{ id: string }>('/api/attempts', {
        question: question.prompt,
        answer,
        evaluation: data.evaluation,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to evaluate');
    } finally {
      setLoading(false);
    }
  }, [answer, question]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Interview</h2>
        <div className="flex gap-2">
          <button
            onClick={newQuestion}
            disabled={loading}
            className="px-3 py-2 rounded-lg border"
          >
            {question ? 'New Question' : 'Start'}
          </button>
          <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800">
            ⏳ {Math.max(0, remaining)}s
          </div>
        </div>
      </div>

      {error && <div className="p-3 rounded-md bg-red-50 text-red-700">{error}</div>}

      {question && (
        <div className="rounded-xl border p-4 space-y-3">
          <div className="text-sm text-gray-500">
            {question.category ?? 'General'} · {question.difficulty ?? 'medium'}
          </div>
          <p className="text-lg font-medium">{question.prompt}</p>

          <textarea
            className="w-full border rounded-xl p-3 h-40"
            placeholder="Type your answer here…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={Boolean(evaluation) || remaining <= 0 || loading}
          />

          <div className="flex gap-3">
            <button
              className="px-3 py-2 rounded-lg border"
              onClick={() => setAnswer('')}
              disabled={Boolean(evaluation) || loading}
            >
              Clear
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-black text-white disabled:opacity-50"
              onClick={submit}
              disabled={!answer || Boolean(evaluation) || loading}
            >
              Submit for feedback
            </button>
          </div>
        </div>
      )}

      {evaluation && (
        <div className="rounded-xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Feedback</h3>
            <div className="text-sm">
              Score: <span className="font-bold">{evaluation.score}</span>/100
            </div>
          </div>
          <p className="text-gray-700">{evaluation.summary}</p>

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

          <div>
            <div className="text-sm text-gray-500 mb-1">Strengths</div>
            <ul className="list-disc pl-5 space-y-1">
              {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Improvements</div>
            <ul className="list-disc pl-5 space-y-1">
              {evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}