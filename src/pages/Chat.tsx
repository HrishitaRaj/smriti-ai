import Chatbot, { ChatbotHandle } from "@/components/Chatbot";
import { Navigation } from "@/components/Navigation";
import { useRef, useState } from "react";

const Chat = () => {
  const chatbotRef = useRef<ChatbotHandle | null>(null);
  const [input, setInput] = useState("");
  const [pendingMemory, setPendingMemory] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [serverActive, setServerActive] = useState(false);

  const onSend = async () => {
    if (!input.trim()) return;
    await chatbotRef.current?.sendQuestion(input.trim());
    setInput("");
  };

  const onSave = async () => {
    if (!input.trim()) return;
    // Hold the memory text and show emotion picker before saving
    setPendingMemory(input.trim());
    setInput("");
  };

  const saveMemoryWithEmotion = async (emotion?: string) => {
    if (!pendingMemory) return;
    await chatbotRef.current?.addMemory(pendingMemory, emotion);
    setPendingMemory(null);
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
            <Chatbot
              ref={chatbotRef}
              hideInput
              onTranscript={(t) => setInput(t)}
              onStateChange={(s) => {
                // event-driven updates from Chatbot; keeps UI in sync without polling
                setVoiceActive(!!s.recognizing);
                setServerActive(!!s.serverRecording || !!s.transcribing);
              }}
            />
          </div>

          {/* Input area */}
          <div className="pt-3 border-t border-primary/10">
            {/* Emotion picker shown after clicking Save */}
            {pendingMemory && (
              <div className="mb-3 p-3 bg-white/95 rounded-lg border border-primary/10">
                <p className="font-medium">How are you feeling about this?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Happy','Sad','Excited','Scared','Calm','Angry','Neutral'].map((emo) => (
                    <button key={emo} onClick={() => saveMemoryWithEmotion(emo)} className="px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition">
                      {emo}
                    </button>
                  ))}
                  <button onClick={() => saveMemoryWithEmotion(undefined)} className="ml-2 px-3 py-1 rounded-full bg-white border">Skip</button>
                </div>
              </div>
            )}

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
              {/* Voice controls for pages that hide Chatbot's own input */}
              <div className="flex items-center gap-2 ml-2">
                <button
                  title={voiceActive ? "Stop recording" : "Start in-browser speech recognition"}
                  onClick={() => {
                      if (!chatbotRef.current) return;
                      // Toggle: if recognizing -> stop, else start
                      if (chatbotRef.current.isRecognizing && chatbotRef.current.isRecognizing()) {
                        chatbotRef.current.stopRecognition?.();
                        return;
                      }
                      chatbotRef.current.startRecognition?.();
                    }}
                  className={`w-10 h-10 rounded-full ${voiceActive ? "bg-red-500 text-white" : "bg-gray-100"} flex items-center justify-center`}
                    disabled={serverActive}
                >
                  🎙
                </button>
                <button
                  title={serverActive ? "Stop server recording" : "Record audio and transcribe with Google STT"}
                  onClick={() => {
                      if (!chatbotRef.current) return;
                      if (chatbotRef.current.isServerRecording && chatbotRef.current.isServerRecording()) {
                        chatbotRef.current.stopServerRecording?.();
                        return;
                      }
                      chatbotRef.current.startServerRecording?.();
                    }}
                  className={`w-10 h-10 rounded-full bg-gradient-to-r from-[#de67ff] to-[#c800ff] text-white flex items-center justify-center ${serverActive ? "opacity-80" : ""}`}
                  disabled={voiceActive}
                >
                  GTT
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;

