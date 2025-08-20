import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PM Mock Interview',
  description: 'Practice PM interviews with AI feedback',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="max-w-3xl mx-auto p-4">
          <header className="py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">PM Mock Interview</h1>
            <nav className="text-sm">
              <a className="hover:underline" href="/">Home</a>
              <span className="mx-3">•</span>
              <a className="hover:underline" href="/interview">Interview</a>
              <span className="mx-3">•</span>
              <a className="hover:underline" href="/history">History</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="py-8 text-center text-sm text-gray-500">
            Built with Next.js, Prisma & OpenAI
          </footer>
        </div>
      </body>
    </html>
  );
}