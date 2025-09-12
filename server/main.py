from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import collection
from config import Config
from models.schema import AudioFile, AudioResponse
from models.constants import AudioLanguage
import os

app = FastAPI(title="Audio Files API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Audio Files API", "endpoint": "/audio-files"}

@app.get("/audio-files", response_model=AudioResponse, status_code=200)
async def get_audio_files():
    try:
        cursor = collection.find({}, {"_id": 1, "title": 1, "url": 1, "text": 1, "language": 1})
        audio_files = [
            AudioFile(
                id=str(audio["_id"]),
                title=audio.get("title", "Unknown"),
                url=audio.get("url", ""),
                text=audio.get("text", ""),
                language=audio.get("language", AudioLanguage.ENGLISH)
            )
            for audio in cursor
        ]

        return AudioResponse(audio_files=audio_files, count=len(audio_files))

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.post("/audio-files", response_model=AudioFile, status_code=201)
async def create_audio_file(audio: AudioFile):
    try:
        audio_dict = audio.dict(exclude={"id"})
        result = collection.insert_one(audio_dict)
        return AudioFile(id=str(result.inserted_id), **audio_dict)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to insert audio file: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    # ✅ Convert PORT to int before passing to uvicorn
    port = int(os.environ.get("PORT", Config.PORT))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
