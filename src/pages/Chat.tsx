import Chatbot from "@/components/Chatbot";

const Chat = () => {
  return (
    <main className="min-h-screen container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Memory Chat</h1>
      <p className="mb-4 text-muted-foreground">Use this chat to save memories or ask questions. Memories are stored in the server process memory for now.</p>
      <Chatbot />
    </main>
  );
};

export default Chat;
