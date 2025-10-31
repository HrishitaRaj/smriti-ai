from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import recall


class MemoryIn(BaseModel):
    text: str
    emotion: str | None = None
    timestamp: Optional[str] = None


class AskIn(BaseModel):
    question: str


app = FastAPI(title="Memory Recall API")


@app.on_event("startup")
def _print_routes_on_startup():
    try:
        routes = sorted({route.path for route in app.routes})
        print("Available routes:")
        for r in routes:
            print(" ", r)
    except Exception:
        pass

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
    # Pass emotion through when provided
    recall.add_memory(payload.text, emotion=payload.emotion)
    recall.add_memory(payload.text, timestamp=payload.timestamp)
    return {"ok": True}


@app.get("/memories")
def list_memories_endpoint():
    """Return stored memories with timestamps (newest first)."""
    entries = recall.list_memories()
    return {"memories": entries}


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
