import React from 'react';
import { Evaluation } from '@/types/interview';

interface ScoreCardProps {
  evaluation: Evaluation;
}

export default function ScoreCard({ evaluation }: ScoreCardProps) {
  return (
    <div className="rounded-xl border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Score</h3>
        <div className="text-xl font-bold">{evaluation.score}/100</div>
      </div>
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
    </div>
  );
}
