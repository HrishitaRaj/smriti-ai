import Chatbot, { ChatbotHandle } from "@/components/Chatbot";
import { Navigation } from "@/components/Navigation";
import { useRef, useState } from "react";

const Chat = () => {
  const chatbotRef = useRef<ChatbotHandle | null>(null);
  const [input, setInput] = useState("");

  const onSend = async () => {
    if (!input.trim()) return;
    await chatbotRef.current?.sendQuestion(input.trim());
    setInput("");
  };

  const onSave = async () => {
    if (!input.trim()) return;
    await chatbotRef.current?.addMemory(input.trim());
    setInput("");
  };

  return (
    <div className="min-h-screen pt-24 bg-[rgba(253,246,255,0.8)]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-primary/10 p-6 h-[75vh] flex flex-col">
          {/* Assistant header bubble */}
          <div className="mb-4">
            <div className="inline-block rounded-2xl bg-primary/10 text-foreground p-4 max-w-[90%]">
              <p className="text-sm">Hi! I'm here to help you recall your memories. Ask me anything like 'What did I do yesterday?' or 'When did I meet Yogita?'</p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-2 bg-white/90 text-sm rounded-full px-3 py-1 shadow">
                  <span>😊</span>
                  <span className="text-primary">calm</span>
                </span>
              </div>
            </div>
          </div>

          {/* Chat area (flex grows) */}
          <div className="flex-1 overflow-y-auto mb-4">
            <Chatbot ref={chatbotRef} hideInput />
          </div>

          {/* Input area */}
          <div className="pt-3 border-t border-primary/10">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Ask about your memories..."
                className="flex-1 rounded-full px-4 py-3 bg-white/90 border border-primary/10 focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') onSend(); }}
              />
              <button onClick={onSend} className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9b2bff] to-[#6b00ff] flex items-center justify-center text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={onSave} className="ml-2 px-4 py-2 rounded-full bg-white shadow text-sm font-medium text-foreground/90 hover:bg-gray-50 transition">
                Save
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;

