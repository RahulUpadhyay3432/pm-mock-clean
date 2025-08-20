"use client";

export default function ScoreCard({ data }: { data: any }) {
  if (!data) return null;
  const r = data.rubric || {};
  const Row = ({ label, val }: { label: string; val: number }) => (
    <div className="flex items-center gap-3">
      <div className="w-40 text-sm text-slate-600">{label}</div>
      <div className="flex-1 h-2 rounded bg-slate-200">
        <div className="h-2 rounded bg-black" style={{ width: `${(Math.max(0, Math.min(5, val)) / 5) * 100}%` }} />
      </div>
      <div className="w-10 text-right text-sm">{val ?? "-"}</div>
    </div>
  );
  return (
    <div className="space-y-3">
      <div className="text-lg font-semibold">Score: {data.overall_score ?? "-"}/100</div>
      <div className="space-y-2">
        <Row label="Structure" val={r.structure ?? 0} />
        <Row label="Clarity" val={r.clarity ?? 0} />
        <Row label="Product Thinking" val={r.product_thinking ?? 0} />
        <Row label="Metrics" val={r.metrics ?? 0} />
        <Row label="Communication" val={r.communication ?? 0} />
      </div>

      {data.strengths?.length ? (
        <div>
          <div className="font-medium mt-2">Strengths</div>
          <ul className="list-disc pl-5 text-sm text-slate-700">
            {data.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      ) : null}

      {data.gaps?.length ? (
        <div>
          <div className="font-medium mt-2">Gaps</div>
          <ul className="list-disc pl-5 text-sm text-slate-700">
            {data.gaps.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      ) : null}

      {data.coaching ? (
        <div className="mt-2">
          <div className="font-medium">Coaching</div>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{data.coaching}</p>
        </div>
      ) : null}
    </div>
  );
}
