"use client";

import { useEffect } from "react";

// Simple, sticky ID generator
function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ClientBoot() {
  useEffect(() => {
    try {
      // 1) Ensure anonId exists in localStorage
      let id = localStorage.getItem("anonId");
      if (!id) {
        id = makeId();
        localStorage.setItem("anonId", id);
      }

      // 2) Also set a cookie so it's available to server if you ever need it
      //    (1 year expiry; adjust as you like)
      document.cookie = `anon_id=${id}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // In some private modes localStorage can fail; cookie still helps
    }
  }, []);

  return null; // nothing to render; it just runs on mount
}
