import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

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
        const body: Record<string, any> = { text };
        if (emotion) body.emotion = emotion;
        await fetch("http://localhost:8000/add-memory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
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
