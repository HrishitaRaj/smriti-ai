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
memory_embeddings = np.zeros((0, 768), dtype="float32")
index = None


# ===========================
# FUNCTIONS
# ===========================
def add_memory(text):
    """Add a new memory and store its embedding in FAISS index."""
    global index, memory_embeddings, memory_texts

    emb = embedding_model.encode([text], normalize_embeddings=True)
    memory_texts.append(text)

    if index is None:
        dim = emb.shape[1]
        index = faiss.IndexFlatIP(dim)
        memory_embeddings = emb
        index.add(emb)
    else:
        index.add(emb)
        memory_embeddings = np.vstack((memory_embeddings, emb))

    print(f"✅ Memory added: {text}")


def retrieve_memories(query, top_k=3):
    """Retrieve top-k relevant memories."""
    if not memory_texts:
        return []

    query_emb = embedding_model.encode([query], normalize_embeddings=True)
    distances, indices = index.search(np.array(query_emb).astype("float32"), top_k)

    results = [memory_texts[i] for i in indices[0]]
    return results


def ask_model(question, context):
    """Send question + retrieved memories to Mistral-7B for reasoning."""
    context_text = "\n".join([f"- {m}" for m in context])
    prompt = f"""You are a helpful memory assistant for an Alzheimer patient.
The following are stored memories of the user:
{context_text}

Now, based on these memories, answer the question clearly and concisely.

Question: {question}
Answer:"""

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
