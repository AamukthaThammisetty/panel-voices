from pydantic import BaseModel
from typing import List, Optional
from models.constants import AudioLanguage

class AudioFile(BaseModel):
    id: str
    title: str
    url: str
    text: Optional[str] = "" 
    language: AudioLanguage = AudioLanguage.ENGLISH

class AudioResponse(BaseModel):
    audio_files: List[AudioFile]
    count: int
