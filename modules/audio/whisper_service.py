from fastapi import FastAPI, File, UploadFile
import whisper
import shutil
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
model = whisper.load_model("base")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Whisper Service is Running"}

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = model.transcribe(file_path)
    return {"transcription": result["text"]}
