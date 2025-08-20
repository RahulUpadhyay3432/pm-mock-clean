import OpenAI from 'openai';

export function hasOpenAI(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}