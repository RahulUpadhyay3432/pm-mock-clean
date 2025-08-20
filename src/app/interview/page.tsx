import InterviewClient from '@/components/InterviewClient';

export default function InterviewPage() {
  return (
    <div className="space-y-6">
      <InterviewClient />
      <p className="text-sm text-gray-500">
        Tip: Answer concisely with structure — problem → approach → tradeoffs → metrics.
      </p>
    </div>
  );
}