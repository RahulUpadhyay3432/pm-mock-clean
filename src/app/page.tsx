export default function Page() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-6">
        <h2 className="text-lg font-semibold">Welcome</h2>
        <p className="mt-2 text-gray-600">
          Sharpen your PM interview skills with timed prompts and AI feedback.
        </p>
        <a
          href="/interview"
          className="inline-flex items-center mt-4 rounded-lg bg-black text-white px-4 py-2"
        >
          Start Interview
        </a>
      </div>
      <div className="rounded-2xl border p-6">
        <h3 className="font-medium mb-2">How it works</h3>
        <ol className="list-decimal pl-5 space-y-1 text-gray-700">
          <li>Get a PM question.</li>
          <li>Answer within the timer.</li>
          <li>Receive structured feedback.</li>
          <li>Review your history to improve.</li>
        </ol>
      </div>
    </div>
  );
}