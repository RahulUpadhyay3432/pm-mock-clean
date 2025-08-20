export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PMQuestion {
  prompt: string;
  category?: string;
  difficulty?: Difficulty;
}

export interface RubricScores {
  structure: number;
  clarity: number;
  productSense: number;
  communication: number;
}

export interface Evaluation {
  score: number; // 0-100
  summary: string;
  strengths: string[];
  improvements: string[];
  rubric: RubricScores;
  tokensUsed?: number;
}

export interface AttemptDTO {
  id: string;
  createdAt: string;
  userId?: string | null;
  question: string;
  answer: string;
  evaluation: Evaluation;
}