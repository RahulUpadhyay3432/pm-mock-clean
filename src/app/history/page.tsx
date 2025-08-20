import { prisma } from '@/lib/db';
import type { Attempt } from '@prisma/client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const attempts: Attempt[] = await prisma.attempt.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">History</h2>
      {attempts.length === 0 ? (
        <p className="text-gray-600">No attempts yet. Try one in the Interview tab.</p>
      ) : (
        <ul className="space-y-3">
          {attempts.map((a) => {
            const evalScore =
              typeof a.evaluation === 'object' && a.evaluation && 'score' in a.evaluation
                ? (a.evaluation as any).score
                : undefined;
            return (
              <li key={a.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm">
                    {evalScore !== undefined ? `Score: ${evalScore}/100` : '—'}
                  </div>
                </div>
                <div className="mt-2 font-medium line-clamp-2">{a.question}</div>
                <Link href={`/history/${a.id}`} className="text-sm text-blue-600 mt-2 inline-block">
                  View details →
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}