from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import recall
from fastapi import UploadFile, File, Form

try:
    # google-cloud-speech optional import; server will need this package installed and
    # GOOGLE_APPLICATION_CREDENTIALS set to a service account JSON for GTT.
    from google.cloud import speech_v1 as speech
except Exception:
    speech = None


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
    # Pass emotion and timestamp through in a single call
    recall.add_memory(payload.text, emotion=payload.emotion, timestamp=payload.timestamp)
    return {"ok": True}


@app.post("/transcribe")
async def transcribe_endpoint(file: UploadFile = File(...), lang: str = Form("auto")):
    """Accept an audio file (multipart/form-data) and return a Google Speech-to-Text transcript.

    - `lang` can be 'auto' (will allow alternatives en/hi/ta), or 'en', 'hi', 'ta' to prefer a language.
    - Expects GOOGLE_APPLICATION_CREDENTIALS env var set for authentication.
    """
    if speech is None:
        return {"error": "google-cloud-speech not installed on server"}

    data = await file.read()

    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(content=data)

    # map short codes
    lang_map = {"en": "en-US", "hi": "hi-IN", "ta": "ta-IN"}
    if lang != "auto":
        language_code = lang_map.get(lang, "en-US")
        alt_codes = None
    else:
        language_code = "en-US"
        alt_codes = ["hi-IN", "ta-IN"]

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
        sample_rate_hertz=16000,
        language_code=language_code,
        alternative_language_codes=alt_codes,
        enable_automatic_punctuation=True,
    )

    # For short audio clips prefer synchronous recognize; for longer audio you
    # could use long_running_recognize.
    try:
        response = client.recognize(config=config, audio=audio)
        transcripts = []
        for result in response.results:
            if result.alternatives:
                transcripts.append(result.alternatives[0].transcript)
        transcript = " ".join(transcripts)
        return {"transcript": transcript, "ok": True}
    except Exception as e:
        return {"error": str(e)}


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
