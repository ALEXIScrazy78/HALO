import os
import traceback
from typing import List, Literal
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types
import uvicorn

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
app = FastAPI()

class Turn(BaseModel):
    who: Literal["z", "u"]
    t: str

class Req(BaseModel):
    chat: List[Turn] = []

@app.post("/api/chat")
def chat(req: Req):
    try:
        contents = [
            types.Content(
                role=("user" if x.who == "u" else "model"),
                parts=[types.Part.from_text(text=x.t)],
            )
            for x in req.chat
            if x.t.strip()
        ]
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents or "hello",
        )
        return {"reply": resp.text}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=502, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8050)