import React, { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant" | "system"; text: string };

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendQuestion() {
    if (!input.trim()) return;
    const question = input.trim();
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
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
  }

  async function addMemory() {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { role: "system", text: `Saved memory: ${text}` }]);
    setInput("");

    try {
      await fetch("http://localhost:8000/add-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", text: `Error saving memory: ${err}` }]);
    }
  }

  return (
    <section className="max-w-3xl mx-auto my-12 p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Memory Chat</h2>

      <div className="space-y-3 max-h-72 overflow-auto p-2 bg-white/50 rounded">
        {messages.map((m, i) => (
          <div key={i} className={`py-1 px-2 rounded ${m.role === "user" ? "text-right" : "text-left"}`}>
            <div className={`inline-block rounded px-3 py-2 ${m.role === "user" ? "bg-sky-500 text-white" : m.role === "assistant" ? "bg-gray-100 text-gray-900" : "bg-green-100 text-gray-900"}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a question or memory..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendQuestion();
          }}
        />
        <button className="btn" onClick={sendQuestion} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
        <button className="btn" onClick={addMemory}>
          Save
        </button>
      </div>
    </section>
  );
}
