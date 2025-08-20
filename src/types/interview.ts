// src/types/interview.ts
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PMQuestion {
  id?: string;
  prompt: string;
  category?: string;
  difficulty?: Difficulty;
}

export interface RubricScores {
  structure: number;       // 0–5
  clarity: number;         // 0–5
  productSense: number;    // 0–5
  communication: number;   // 0–5
  prioritization?: number; // optional
}

export interface Evaluation {
  score: number;           // 0–100
  summary: string;         // short paragraph
  strengths: string[];     // bullets
  improvements: string[];  // bullets
  rubric?: RubricScores;
  tokensUsed?: number;
}

export interface Attempt {
  id?: string;
  userId?: string | null;
  question: string;
  answer: string;
  evaluation: Evaluation;
  createdAt: string; // ISO string
}
