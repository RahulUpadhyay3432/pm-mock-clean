import { getAnonId } from "./anon";

type Init = RequestInit & { headers?: Record<string, string> };

export async function apiFetch(input: string, init: Init = {}) {
  const anonId = getAnonId();
  const headers = {
    ...(init.headers || {}),
    ...(anonId ? { "x-anon-id": anonId } : {}),
    "Content-Type": init.body ? "application/json" : (init.headers?.["Content-Type"] || ""),
  };

  return fetch(input, { ...init, headers });
}
