from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import recall


class MemoryIn(BaseModel):
    text: str


class AskIn(BaseModel):
    question: str


app = FastAPI(title="Memory Recall API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/add-memory")
def add_memory_endpoint(payload: MemoryIn):
    """Add a memory to the in-memory store (calls `recall.add_memory`)."""
    recall.add_memory(payload.text)
    return {"ok": True}


@app.post("/ask")
def ask_endpoint(payload: AskIn):
    """Retrieve relevant memories and ask the LLM for an answer."""
    context = recall.retrieve_memories(payload.question)
    if not context:
        return {"answer": None, "context": []}
    answer = recall.ask_model(payload.question, context)
    return {"answer": answer, "context": context}


if __name__ == "__main__":
    # Run with: python server/app.py  (or use uvicorn for production)
    uvicorn.run(app, host="0.0.0.0", port=8000)
