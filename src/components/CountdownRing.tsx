"use client";

import React from "react";

export default function CountdownRing({
  total,
  left,
  size = 72,
  stroke = 8,
}: {
  total: number;
  left: number;
  size?: number;
  stroke?: number;
}) {
  const pct = Math.max(0, Math.min(1, left / total));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;

  return (
    <svg width={size} height={size} className="block">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#111827"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight={600}>
        {left}s
      </text>
    </svg>
  );
}
