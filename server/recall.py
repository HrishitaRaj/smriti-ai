import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# ===========================
# CONFIG
# ===========================
OPENROUTER_API_KEY = "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"
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_NAME = "mistralai/mistral-7b-instruct"

# Initialize clients and models (import OpenAI defensively)
try:
    # Try 'openai' package which exposes OpenAI in newer SDKs
    from openai import OpenAI as _OpenAI
    client = _OpenAI(base_url=OPENROUTER_BASE_URL, api_key=OPENROUTER_API_KEY)
    OPENAI_IMPORT_ERROR = None
except Exception as _e:
    # Fall back to None and surface the error later when attempting to use the client
    client = None
    OPENAI_IMPORT_ERROR = _e

embedding_model = SentenceTransformer("multi-qa-mpnet-base-dot-v1")

# In-memory storage (replace later with DB or JSON)
memory_texts = []
memory_emotions = []  # parallel list to store optional emotion/tag for each memory
memory_embeddings = np.zeros((0, 768), dtype="float32")
index = None


# ===========================
# FUNCTIONS
# ===========================
def add_memory(text, emotion: str | None = None):
    """Add a new memory and store its embedding in FAISS index.

    emotion is optional metadata attached to the memory (e.g. 'happy', 'sad').
    """
    global index, memory_embeddings, memory_texts, memory_emotions

    emb = embedding_model.encode([text], normalize_embeddings=True)
    memory_texts.append(text)
    memory_emotions.append(emotion)

    if index is None:
        dim = emb.shape[1]
        index = faiss.IndexFlatIP(dim)
        memory_embeddings = emb
        index.add(emb)
    else:
        index.add(emb)
        memory_embeddings = np.vstack((memory_embeddings, emb))

    print(f"✅ Memory added: {text} (emotion={emotion})")


def retrieve_memories(query, top_k=3):
    """Retrieve top-k relevant memories."""
    if not memory_texts:
        return []
    query_emb = embedding_model.encode([query], normalize_embeddings=True)
    distances, indices = index.search(np.array(query_emb).astype("float32"), top_k)

    # Return structured results including any recorded emotion for each memory
    results = []
    for i in indices[0]:
        if i < len(memory_texts):
            results.append({
                "text": memory_texts[i],
                "emotion": memory_emotions[i] if i < len(memory_emotions) else None,
            })
    return results


def ask_model(question, context):
    """Send question + retrieved memories to Mistral-7B for reasoning.

    Context is a list of dicts with keys 'text' and optional 'emotion'.
    We format the prompt so the model can reference both the memory and how the
    user reported feeling about it, and instruct the model to reply gently.
    """
    # Build a gentle, emotion-aware context for the model.
    ctx_lines = []
    for m in context:
        if isinstance(m, dict):
            text = m.get("text", "")
            emotion = m.get("emotion")
            if emotion:
                ctx_lines.append(f"- Memory: {text} (feeling: {emotion})")
            else:
                ctx_lines.append(f"- Memory: {text}")
        else:
            # Fallback if older format is passed
            ctx_lines.append(f"- Memory: {str(m)}")

    context_text = "\n".join(ctx_lines)

    prompt = f"""You are a gentle, empathetic assistant helping a person with memory challenges.
When you answer, do two things:
1) Briefly refer to the relevant memory (quote or summarize).
2) Kindly mention how the user reported feeling about that memory, if available (for example: "You felt happy about this").

Use warm, reassuring language and keep responses concise and respectful.

Here are the stored memories and any reported emotions:
{context_text}

Question: {question}

Answer gently, referencing relevant memories and the associated feelings where appropriate.
"""

    if client is None:
        raise RuntimeError(
            "LLM client not configured. Could not create a client from the 'openai' package. "
            "Install and configure an OpenAI/OpenRouter client or update this file to use your LLM client."
        )

    # Depending on the client library, the API surface may differ. The original
    # code used `client.chat.completions.create(...)`. Here we attempt a couple
    # of common shapes; adapt if your client differs.
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are an empathetic, factual assistant helping recall personal memories."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()
    except Exception:
        # try alternative response shape
        response = client.ChatCompletion.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are an empathetic, factual assistant helping recall personal memories."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
        )
        try:
            return response.choices[0].message.content.strip()
        except Exception:
            try:
                return response['choices'][0]['message']['content'].strip()
            except Exception:
                return str(response)


# ===========================
# INTERFACE LOOP
# ===========================
def main():
    print("🧠 Alzheimer Memory Recall Assistant")
    print("Type 'add' to store a memory, 'ask' to query, or 'exit' to quit.\n")

    if OPENAI_IMPORT_ERROR is not None:
        print("⚠️ Warning: Could not initialize OpenAI/OpenRouter client at import time.")
        print(f"  Import error: {OPENAI_IMPORT_ERROR}")

    while True:
        action = input("Action (add/ask/exit): ").strip().lower()

        if action == "add":
            text = input("Enter memory: ")
            add_memory(text)

        elif action == "ask":
            question = input("Ask a question: ")
            context = retrieve_memories(question)
            if not context:
                print("⚠️ No memories stored yet.")
                continue

            answer = ask_model(question, context)
            print("\n💬 Assistant:", answer, "\n")

        elif action == "exit":
            print("👋 Goodbye!")
            break

        else:
            print("❌ Invalid choice. Use 'add', 'ask', or 'exit'.")


if __name__ == "__main__":
    main()
