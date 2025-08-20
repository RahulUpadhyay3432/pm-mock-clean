# PM Mock Interview (Next.js + Prisma + OpenAI)

## Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- Prisma + SQLite (dev)
- OpenAI API (fallback to mock if key not set)

## Quickstart
1. Install deps  
   ```bash
   npm install
   ```

2. Create env  
   ```bash
   cp .env.example .env.local
   ```  
   (Optional) Add your `OPENAI_API_KEY`.

3. Generate Prisma client & migrate  
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Dev server  
   ```bash
   npm run dev
   ```

5. Build & start  
   ```bash
   npm run build
   npm start
   ```

## Endpoints
- `GET /api/health`
- `POST /api/generate-question`
- `POST /api/evaluate-answer`
- `GET /api/attempts`, `POST /api/attempts`

## Pages
- `/` Home
- `/interview` Interview flow with timer
- `/history` Attempts list
- `/history/[id]` Attempt detail

## Notes
- If `OPENAI_API_KEY` is missing, the app uses mock data so you can still test the full flow.
- This project sets `eslint.ignoreDuringBuilds = true` so production builds never block. Keep types clean regardless.