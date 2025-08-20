export function getAnonId(): string | null {
  if (typeof window === "undefined") return null;        // SSR guard
  try { return localStorage.getItem("anonId"); } catch { return null; }
}
