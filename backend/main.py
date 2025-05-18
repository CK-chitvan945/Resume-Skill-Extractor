from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Resume Skill Extractor API is running."}


@app.post("/extract")
async def extract_skills(resume: UploadFile = File(...)):
    contents = await resume.read()
    doc = fitz.open(stream=contents, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()

    with open("skills.txt", "r") as f:
        skills_list = [line.strip().lower() for line in f.readlines()]
    
    found = [skill for skill in skills_list if skill in text.lower()]
    return {"skills": list(set(found))}
