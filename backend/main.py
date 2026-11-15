import base64
import os
from pathlib import Path
from typing import Dict, List, Literal, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from google import genai
from google.genai import types

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent

load_dotenv(BASE_DIR / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
client = (
    genai.Client(
        api_key=API_KEY,
        http_options=types.HttpOptions(api_version="v1beta"),
    )
    if API_KEY
    else None
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatTurn(BaseModel):
    who: Literal["z", "u"]
    t: str


class ChatRequest(BaseModel):
    scn: str = "estacion"
    scn_name: str = "Space station"
    scn_cond: str = ""
    scn_foco: str = ""
    diary_done: bool = False
    topics_hit: List[str] = []
    chat: List[ChatTurn] = []


class EmotionRequest(BaseModel):
    image_base64: str
    scn: Optional[str] = None


def build_system_prompt(req: ChatRequest) -> str:
    stage = "Guided interview" if req.diary_done else "Open video journal"
    topics_txt = (
        f"Topics already touched on: {', '.join(req.topics_hit)}."
        if req.topics_hit
        else "No specific themes mentioned yet."
    )
    stage_rule = (
        "- Right now you are in a relaxed check-in chat: keep the conversation flowing naturally like two friends talking, and when it fits, ask just one easy, genuine question about how they're holding up (sleep, stress, isolation, crew dynamics, or mental fatigue)."
        if req.diary_done
        else "- Right now they are doing an open journal: listen like a supportive friend, briefly reflect what they shared, and let them steer where the chat goes without pushing."
    )

    return "\n".join([
        "You are Zambi, a warm, down-to-earth friend and companion inside HALO.",
        f"Context: {req.scn_name} ({req.scn_cond}). Focus: {req.scn_foco}. Stage: {stage}. {topics_txt}",
        "How to talk:",
        "- Always reply in the same language the user is speaking (Spanish if they write in Spanish, English if they write in English).",
        "- Talk like a real, supportive friend—natural, warm, relaxed, and genuine. Never sound robotic, scripted, or like a therapist/doctor.",
        "- Keep replies short and easy to listen to out loud (2 to 3 complete, natural sentences, max ~45 words). Avoid bullet points or stiff phrasing.",
        "- Never diagnose, never claim to know their inner feelings for sure, and never pressure them if they don't feel like sharing.",
        "- Match their energy: if they vent or joke, respond naturally to what they actually said first.",
        stage_rule,
    ])


def analyze_facial_cues(image_bytes: bytes) -> Dict:
    if not image_bytes:
        return {
            "face_detected": False,
            "dominant_signal": "unknown",
            "scores": {},
            "note": "Empty frame.",
        }

    size_kb = len(image_bytes) / 1024.0
    calm_score = round(min(max(0.5 + (min(size_kb, 30.0) - 15.0) * 0.01, 0.2), 0.8), 3)
    neutral_score = round(max(0.0, 1.0 - calm_score - 0.1), 3)
    tension_score = round(max(0.0, 1.0 - calm_score - neutral_score), 3)

    scores = {
        "calm": calm_score,
        "neutral": neutral_score,
        "tension": tension_score,
    }
    dominant = max(scores, key=scores.get)

    return {
        "face_detected": True,
        "dominant_signal": dominant,
        "scores": scores,
        "note": "Lightweight placeholder.",
    }


@app.post("/api/chat")
async def chat_with_zambi(req: ChatRequest):
    if not client:
        raise HTTPException(status_code=503, detail="GEMINI_API_KEY not configured")

    contents: List[types.Content] = []
    for turn in req.chat[-16:]:
        text = (turn.t or "").strip()
        if not text:
            continue
        role = "user" if turn.who == "u" else "model"
        if contents and contents[-1].role == role:
            prev_text = contents[-1].parts[0].text or ""
            contents[-1] = types.Content(
                role=role,
                parts=[types.Part.from_text(text=f"{prev_text}\n{text}")],
            )
        else:
            contents.append(
                types.Content(role=role, parts=[types.Part.from_text(text=text)])
            )

    if not contents:
        return {"reply": None}

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=build_system_prompt(req),
                temperature=0.75,
                max_output_tokens=600,
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
        )
        reply = (response.text or "").strip()
        return {"reply": reply or None}
    except Exception as e:
        print("ERROR EN /api/chat:", repr(e))
        raise HTTPException(status_code=502, detail=f"Gemini error: {repr(e)}")


@app.post("/api/emotion")
async def detect_emotion(req: EmotionRequest):
    try:
        raw_b64 = req.image_base64.split(",")[-1].strip()
        image_bytes = base64.b64decode(raw_b64)
        return analyze_facial_cues(image_bytes)
    except Exception as e:
        print("ERROR EN /api/emotion:", repr(e))
        raise HTTPException(status_code=400, detail=f"Invalid image payload: {repr(e)}")


# SIEMPRE al final: monta index.html y los assets desde HALO_Modular_English
app.mount("/", StaticFiles(directory=str(ROOT_DIR), html=True), name="static")