from google import genai
from dotenv import load_dotenv
from datetime import datetime
import json, os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)
with open("nlp-gemini/schema.json", "r") as schema_file:
    schema = json.load(schema_file)


def get_date_day():
    now = datetime.now()
    formatted_date = now.strftime("%B") + " " + str(now.day) + ", " + now.strftime("%Y")
    day_name = now.strftime("%A")
    final_date = "Today is " + day_name + ", " + formatted_date
    return final_date


def generate_json(task):
    PROMPT = f"""
    Go over carefully through the following schema and generate a matching JSON object with the following structure, make use of the date and time given:
    {str(schema)}.
    {get_date_day()}.
    Task: {task}
    """
    # print(PROMPT)
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
    # print(response.text)
    response = json.loads(response.text[8:-4])
    return response

task = "Watch YouTube every Monday at 6 PM"
print("Task:", task)
task_json = generate_json(task)
print(task_json)