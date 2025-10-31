import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { parse, parseISO, isValid, subDays, subWeeks, subMonths } from "date-fns";

type Message = { role: "user" | "assistant" | "system"; text: string; emotion?: string };

export type ChatbotHandle = {
  sendQuestion: (question: string) => Promise<void>;
  addMemory: (text: string, emotion?: string) => Promise<void>;
};

const Chatbot = forwardRef<ChatbotHandle, { hideInput?: boolean }>(function Chatbot(props, ref) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useImperativeHandle(ref, () => ({
    async sendQuestion(question: string) {
      if (!question.trim()) return;
      setMessages((m) => [...m, { role: "user", text: question }]);
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });
        const data = await res.json();
        if (data.answer) {
          setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
        } else {
          setMessages((m) => [...m, { role: "assistant", text: "No memories found." }]);
        }
      } catch (err) {
        setMessages((m) => [...m, { role: "assistant", text: `Error: ${err}` }]);
      } finally {
        setLoading(false);
      }
    },
    async addMemory(text: string, emotion?: string) {
      if (!text.trim()) return;
      const display = emotion ? `${text} [feeling: ${emotion}]` : text;
      // Add the user's saved memory as a user message (with optional emotion badge)
      setMessages((prev) => [...prev, { role: "user", text, emotion } , { role: "system", text: `Saved memory: ${display}` }]);
      try {
        // try to parse any date references in the text ("yesterday", "July 5", "2024-07-05", etc.)
        const parseDateFromText = (txt: string): string | null => {
          // normalize ordinals like '31st' -> '31'
          const cleaned = txt.replace(/(\d{1,2})(st|nd|rd|th)\b/gi, "$1");
          const low = cleaned.toLowerCase();
          try {
            // quick keyword/relative checks
            if (low.includes("yesterday")) return subDays(new Date(), 1).toISOString();
            if (low.includes("today")) return new Date().toISOString();
            if (low.includes("tomorrow")) return subDays(new Date(), -1).toISOString();
            if (low.includes("last week")) return subWeeks(new Date(), 1).toISOString();
            if (low.includes("last month")) return subMonths(new Date(), 1).toISOString();

            const daysAgo = txt.match(/(\d+)\s+days?\s+ago/i);
            if (daysAgo) return subDays(new Date(), Number(daysAgo[1])).toISOString();
            const weeksAgo = txt.match(/(\d+)\s+weeks?\s+ago/i);
            if (weeksAgo) return subWeeks(new Date(), Number(weeksAgo[1])).toISOString();
            const monthsAgo = txt.match(/(\d+)\s+months?\s+ago/i);
            if (monthsAgo) return subMonths(new Date(), Number(monthsAgo[1])).toISOString();

            // helper to apply time like "at 7pm" to a Date object
            const applyTimeIfPresent = (d: Date, text: string) => {
              try {
                const tm = text.match(/at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i) || text.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
                if (tm) {
                  let hour = Number(tm[1]);
                  const minute = tm[2] ? Number(tm[2]) : 0;
                  const ampm = tm[3] ? tm[3].toLowerCase() : undefined;
                  if (ampm === "pm" && hour < 12) hour += 12;
                  if (ampm === "am" && hour === 12) hour = 0;
                  d.setHours(hour, minute, 0, 0);
                }
              } catch (e) {
                // ignore
              }
            };

            // collect candidates and prefer the last mentioned date in text
            const candidates: { d: Date; idx: number }[] = [];

            // ISO dates YYYY-MM-DD
            for (const m of txt.matchAll(/(\d{4}-\d{2}-\d{2})/g)) {
              const d = parseISO(m[1]);
              if (isValid(d)) {
                applyTimeIfPresent(d, txt);
                candidates.push({ d, idx: m.index ?? 0 });
              }
            }

            // dd/mm/yyyy or dd-mm-yyyy or mm/dd/yyyy - handle two-digit years like 80 -> 1980
            for (const m of cleaned.matchAll(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g)) {
              let s = m[1];
              // expand two-digit year
              const parts = s.split(/[\/\-]/);
              if (parts[2] && parts[2].length === 2) {
                const yy = Number(parts[2]);
                const cutoff = new Date().getFullYear() % 100; // e.g., 25 for 2025
                const full = yy <= cutoff ? 2000 + yy : 1900 + yy;
                s = `${parts[0]}/${parts[1]}/${full}`;
              }
              const tryFormats = ["dd/MM/yyyy", "MM/dd/yyyy", "dd-MM-yyyy", "MM-dd-yyyy", "d/M/yyyy"];
              for (const f of tryFormats) {
                const d = parse(s, f, new Date());
                if (isValid(d)) {
                  applyTimeIfPresent(d, cleaned);
                  candidates.push({ d, idx: m.index ?? 0 });
                  break;
                }
              }
            }

            // Month name patterns like "July 5", "5 July 2024", "on July 5th, 2024"
            const monthRegex = /(\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[ \.,-]*\d{1,2}(?:[\s,.-]*\d{4})?)/ig;
            for (const m of cleaned.matchAll(monthRegex)) {
              const candidate = m[1].replace(/(\d{1,2})(st|nd|rd|th)\b/i, "$1");
              const tryFormats = ["MMMM d yyyy", "MMMM d, yyyy", "MMMM d", "MMM d yyyy", "d MMMM yyyy", "d MMM yyyy"];
              let found = false;
              for (const f of tryFormats) {
                const d = parse(candidate, f, new Date());
                if (isValid(d)) {
                  applyTimeIfPresent(d, txt);
                  candidates.push({ d, idx: m.index ?? 0 });
                  found = true;
                  break;
                }
              }
              if (!found) {
                const iso = parseISO(candidate);
                if (isValid(iso)) {
                  applyTimeIfPresent(iso, txt);
                  candidates.push({ d: iso, idx: m.index ?? 0 });
                }
              }
            }

            if (candidates.length > 0) {
              // Only accept a parsed candidate when the text contains an explicit
              // date marker (a 4-digit year, a month name, or relative keywords like "yesterday").
              // This avoids accidental numeric matches turning non-date events into dated entries.
              const explicitDateMarker = /(\d{4}|\b(yesterday|today|tomorrow|ago|last week|last month)\b|\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?))|[\/\-]\d{2,4}\b/i;
              if (!explicitDateMarker.test(txt)) {
                // no clear explicit date found — treat as non-date-specific
                return null;
              }

              candidates.sort((a, b) => a.idx - b.idx);
              const chosen = candidates[candidates.length - 1].d;
              return chosen.toISOString();
            }
          } catch (e) {
            // ignore parse errors
          }
          return null;
        };

        const detected = parseDateFromText(text);
        const timestamp = detected ?? new Date().toISOString();

        // show the resolved timestamp in chat so user can confirm
        setMessages((m) => [...m, { role: "system", text: `Saving with timestamp: ${new Date(timestamp).toString()}` }]);

        const body: Record<string, any> = { text };
        if (emotion) body.emotion = emotion;
        await fetch("http://localhost:8000/add-memory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, timestamp }),
        });
        // also persist a local backup so UI can show memories when server is down
        try {
          const raw = localStorage.getItem("smriti_local_memories");
          const arr = raw ? JSON.parse(raw) : [];
          arr.push({ text, timestamp });
          localStorage.setItem("smriti_local_memories", JSON.stringify(arr));
        } catch (e) {
          // ignore localStorage errors
        }
      } catch (err) {
        setMessages((m) => [...m, { role: "assistant", text: `Error saving memory: ${err}` }]);
      }
    },
  }));

  const hideInput = props.hideInput;

  return (
    <section className="max-w-full mx-auto my-2 p-2">
      <div className="space-y-3 max-h-[60vh] overflow-auto p-2 bg-white/0 rounded">
        {messages.map((m, i) => (
          <div key={i} className={`py-1 px-2 rounded ${m.role === "user" ? "text-right" : "text-left"}`}>
            <div className={`inline-block rounded px-3 py-2 ${m.role === "user" ? "bg-sky-500 text-white" : m.role === "assistant" ? "bg-gray-100 text-gray-900" : "bg-green-100 text-gray-900"}`}>
              <div>
                <div>{m.text}</div>
                {m.emotion && m.role === "user" && (
                  <div className="mt-1 text-xs italic text-white/90">{`You felt ${m.emotion}`}</div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {!hideInput && (
        <div className="mt-4 flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Type a question or memory..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (ref as React.RefObject<ChatbotHandle>).current?.sendQuestion(input);
                setInput("");
              }
            }}
          />
          <button className="btn" onClick={() => { (ref as React.RefObject<ChatbotHandle>).current?.sendQuestion(input); setInput(""); }} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </button>
          <button className="btn" onClick={() => { (ref as React.RefObject<ChatbotHandle>).current?.addMemory(input); setInput(""); }}>
            Save
          </button>
        </div>
      )}
    </section>
  );
});

export default Chatbot;
