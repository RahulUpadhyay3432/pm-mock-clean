"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import CountdownRing from "./CountdownRing";
import ScoreCard from "./ScoreCard";

type Mode = "text" | "voice";

export default function InterviewClient({ onSaved }: { onSaved?: () => void }) {
  const [mode, setMode] = useState<Mode>("voice");
  const [topic, setTopic] = useState("Product Sense");
  const [difficulty, setDifficulty] = useState(3);
  const [seconds, setSeconds] = useState(120);
  const [left, setLeft] = useState(120);

  const [question, setQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const [answerText, setAnswerText] = useState("");

  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recogRef = useRef<any>(null);

  useEffect(() => setLeft(seconds), [seconds]);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const startRecognition = () => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    const recog = new SR();
    recogRef.current = recog;
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-IN";
    let finalText = "";
    recog.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript + " ";
        else interim += r[0].transcript;
      }
      setTranscript((finalText + " " + interim).trim());
    };
    recog.onerror = () => stopAll();
    recog.start();
  };

  const stopAll = async () => {
    if (!recording) return;
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recogRef.current) {
      try { recogRef.current.stop(); } catch {}
    }
    await evaluateAndSave();
  };

  const start = async () => {
    setResult(null);
    setTranscript("");
    setAnswerText("");
    setLeft(seconds);

    // 1) get question
    const qres = await apiFetch("/api/generate-question", {
      method: "POST",
      body: JSON.stringify({ topic, difficulty }),
    });
    const q = await qres.json();
    setQuestion(q.question || "Describe how you'd improve onboarding.");

    if (mode === "voice") {
      speak(q.question);
      // 2) start timer + recognition
      setRecording(true);
      timerRef.current = setInterval(() => {
        setLeft((s) => {
          if (s <= 1) {
            stopAll();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      startRecognition();
    }
  };

  const evaluateAndSave = async () => {
    try {
      setLoading(true);
      const text = mode === "voice" ? transcript : answerText;
      if (!question || !text) return;

      const r = await apiFetch("/api/evaluate-answer", {
        method: "POST",
        body: JSON.stringify({ question, transcript: text }),
      });
      const data = await r.json();
      setResult(data);
      speak("Here's your feedback. Check the scorecard.");

      // save
      await apiFetch("/api/attempts", {
        method: "POST",
        body: JSON.stringify({
          mode,
          question,
          topic,
          difficulty,
          transcript: text,
          feedback: data,
          structure: data?.rubric?.structure,
          clarity: data?.rubric?.clarity,
          productThinking: data?.rubric?.product_thinking,
          metrics: data?.rubric?.metrics,
          communication: data?.rubric?.communication,
          overallScore: data?.overall_score,
          durationSec: seconds - left,
        }),
      });

      onSaved?.();
    } finally {
      setLoading(false);
    }
  };

  const stopTTS = () => {
    try { window.speechSynthesis?.cancel(); } catch {}
  };

  return (
    <div className="space-y-4">
      {/* controls */}
      <div className="flex flex-wrap items-center gap-2">
        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="rounded-md border px-3 py-1.5">
          <option value="voice">Voice (Beta)</option>
          <option value="text">Text</option>
        </select>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-md border px-3 py-1.5">
          <option>Product Sense</option>
          <option>Estimation</option>
          <option>Execution</option>
          <option>Strategy</option>
        </select>
        <label className="text-sm">Difficulty</label>
        <input
          type="number"
          min={1}
          max={5}
          value={difficulty}
          onChange={(e) => setDifficulty(parseInt(e.target.value || "3"))}
          className="w-16 rounded-md border px-2 py-1.5"
        />
        <label className="text-sm">Timer</label>
        <select value={seconds} onChange={(e) => setSeconds(parseInt(e.target.value))} className="rounded-md border px-3 py-1.5">
          <option value={60}>60s</option>
          <option value={90}>90s</option>
          <option value={120}>120s</option>
        </select>
      </div>

      {/* question box */}
      <div className="rounded-xl border bg-white p-4">
        <div className="text-sm text-slate-500">Question</div>
        <div className="mt-1 text-lg font-medium whitespace-pre-wrap">{question || "Click Start to get a question."}</div>
      </div>

      {/* timer + transcript / text area */}
      <div className="grid grid-cols-[auto,1fr] gap-4 items-start">
        <div className="flex flex-col items-center gap-2">
          <CountdownRing total={seconds} left={left} />
          {recording ? <span className="text-xs text-red-600">Recording…</span> : null}
        </div>

        {mode === "voice" ? (
          <div className="rounded-xl border bg-white p-4 min-h-[96px]">
            <div className="text-sm text-slate-500">Transcript</div>
            <div className="mt-1 whitespace-pre-wrap">{transcript || "—"}</div>
          </div>
        ) : (
          <div className="rounded-xl border bg-white p-4">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="w-full h-40 resize-none outline-none"
              placeholder="Type your answer here..."
            />
          </div>
        )}
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={start}
          disabled={recording}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          Start
        </button>
        {mode === "voice" ? (
          <>
            <button onClick={stopAll} disabled={!recording} className="rounded-lg border px-4 py-2 disabled:opacity-50">
              Stop
            </button>
            <button onClick={stopTTS} className="rounded-lg border px-4 py-2">Mute TTS</button>
          </>
        ) : (
          <button
            onClick={evaluateAndSave}
            disabled={!answerText || loading}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Submit
          </button>
        )}
      </div>

      {/* results */}
      {result ? (
        <div className="rounded-xl border bg-white p-4">
          <ScoreCard data={result} />
        </div>
      ) : null}
    </div>
  );
}
