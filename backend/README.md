# Using Gemini to get JSON from Tasks

Put the API Key for Gemini as `GEMINI_API_KEY` in the .env file before using.
Usage: `generate_json(task)` where `task` is a string.

### Example:

```
task = "Watch YouTube every Monday at 6 PM"
task_json = generate_json(task)
print(task_json)
```

will print:

```
{
    'task': 'Watch YouTube',
    'description': None, 
    'date': '2025-03-03',
    'time': '18:00:00',
    'start_date': None,
    'end_date': None,
    'website': None,
    'frequency': 'weekly',
    'recurring_until': None,
    'type': 'regular'
}
```
