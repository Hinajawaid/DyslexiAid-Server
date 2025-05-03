from fastapi import FastAPI, File, UploadFile
# import whisper
import whisper_timestamped as whisper
import shutil
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# model = whisper.load_model("base")
model = whisper.load_model("tiny", device="cpu")

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

    result = model.transcribe(model, file_path)
    print("result")
    print(result)
    import json
    print(json.dumps(result, indent = 2, ensure_ascii = False))
    return {"transcription": result}
