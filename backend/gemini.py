from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
from datetime import datetime
import json, os

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in the environment variables.")
client = genai.Client(api_key=GEMINI_API_KEY)

with open("schema.json", "r") as schema_file:
    schema = json.load(schema_file)

# Utility function to get the current date and day
def get_date_day():
    now = datetime.now()
    formatted_date = now.strftime("%B") + " " + str(now.day) + ", " + now.strftime("%Y")
    day_name = now.strftime("%A")
    final_date = "Today is " + day_name + ", " + formatted_date
    return final_date

def generate_json(task: str):
    PROMPT = f"""
    Go over carefully through the following schema and generate a matching JSON object with the following structure, make use of the date and time given:
    {str(schema)}.
    {get_date_day()}.
    Task: {task}
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=PROMPT,
            config={
                "temperature": 0.7,
                "top_p": 1,
                "top_k": 1,
                "max_output_tokens": 2048,
            },
        )

        return json.loads(response.text[8:-4])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating JSON: {str(e)}")

# Pydantic model for request body
class TaskRequest(BaseModel):
    task: str

@app.post("/generate-json")
def generate_json_endpoint(request: TaskRequest):
    task = request.task
    return {"task": task, "generated_json": generate_json(task)}