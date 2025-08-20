import { prisma } from '@/lib/db';

export default async function AttemptDetail({ params }: { params: { id: string } }) {
  const attempt = await prisma.attempt.findUnique({ where: { id: params.id } });
  if (!attempt) {
    return <div className="text-red-600">Attempt not found.</div>;
  }

  const evaluation: any = attempt.evaluation ?? {};
  const rubric = evaluation.rubric ?? {};

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Attempt details</h2>
      <div className="rounded-xl border p-4">
        <div className="text-sm text-gray-500">
          {new Date(attempt.createdAt).toLocaleString()}
        </div>
        <h3 className="mt-2 font-medium">Question</h3>
        <p className="text-gray-800">{attempt.question}</p>

        <h3 className="mt-4 font-medium">Your Answer</h3>
        <p className="text-gray-800 whitespace-pre-wrap">{attempt.answer}</p>

        <h3 className="mt-4 font-medium">Feedback</h3>
        {evaluation.summary ? <p className="text-gray-800">{evaluation.summary}</p> : <p>—</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
          <div className="rounded-md bg-gray-50 p-2">
            <div className="text-gray-500">Score</div>
            <div className="font-medium">{evaluation.score ?? '—'}</div>
          </div>
          <div className="rounded-md bg-gray-50 p-2">
            <div className="text-gray-500">Structure</div>
            <div className="font-medium">{rubric.structure ?? '—'}/5</div>
          </div>
          <div className="rounded-md bg-gray-50 p-2">
            <div className="text-gray-500">Clarity</div>
            <div className="font-medium">{rubric.clarity ?? '—'}/5</div>
          </div>
          <div className="rounded-md bg-gray-50 p-2">
            <div className="text-gray-500">Product Sense</div>
            <div className="font-medium">{rubric.productSense ?? '—'}/5</div>
          </div>
          <div className="rounded-md bg-gray-50 p-2">
            <div className="text-gray-500">Communication</div>
            <div className="font-medium">{rubric.communication ?? '—'}/5</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-1">Strengths</div>
          <ul className="list-disc pl-5 space-y-1">
            {(evaluation.strengths ?? []).map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-1">Improvements</div>
          <ul className="list-disc pl-5 space-y-1">
            {(evaluation.improvements ?? []).map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}