export const sampleTasks = [
    {
        "title": "Daily LeetCode Medium",
        "description": "Solve one LeetCode medium problem every day.",
        "type": "recurring",
        "recurring_details": {
            "recurr_till": "2025-12-31T18:00:00+00:00",
            "cron_rules": [
                "0 18 * * *"
            ],
            "status": {
                "overall": "in_progress",
                "completed_count": 10,
                "missed_count": 2,
                "scheduled": "2024-03-14T18:00:00+00:00",
                "history": [
                    {
                        "datetime": "2024-03-09T18:00:00+00:00",
                        "status": "completed"
                    },
                    {
                        "datetime": "2024-03-10T18:00:00+00:00",
                        "status": "missed"
                    }
                ]
            },
            "streak": {
                "current_streak": {
                    "count": 10,
                    "streak_start": "2024-03-11T18:00:00+00:00",
                    "last_completion": "2024-03-13T18:00:00+00:00"
                },
                "longest_streak": {
                    "count": 10,
                    "streak_start": "2024-02-01T18:00:00+00:00",
                    "streak_end": "2024-02-05T18:00:00+00:00"
                },
                "previous_streak": {
                    "count": 2,
                    "streak_start": "2024-02-10T18:00:00+00:00",
                    "streak_end": "2024-02-11T18:00:00+00:00"
                }
            }
        },
        "reminder": {
            "enabled": true,
            "remind_before_offset": "PT15M",
            "reminder": "LeetCode Medium Problem Reminder"
        },
        "resource": {
            "enabled": true,
            "local": false,
            "url": "https://leetcode.com/problemset/all/?difficulty=Medium"
        }
    },
    {
        "title": "Matlab Course",
        "description": "Watch Matlab course videos.",
        "type": "recurring",
        "recurring_details": {
            "recurr_till": "2024-12-30T10:00:00+00:00",
            "cron_rules": [
                "0 10 * * 1"
            ],
            "status": {
                "overall": "in_progress",
                "completed_count": 5,
                "missed_count": 1,
                "scheduled": "2024-03-18T10:00:00+00:00",
                "history": [
                    {
                        "datetime": "2024-03-11T10:00:00+00:00",
                        "status": "completed"
                    },
                    {
                        "datetime": "2024-03-04T10:00:00+00:00",
                        "status": "missed"
                    }
                ]
            },
            "streak": {
                "current_streak": {
                    "count": 3,
                    "streak_start": "2024-03-18T10:00:00+00:00",
                    "last_completion": "2024-03-18T10:00:00+00:00"
                },
                "longest_streak": {
                    "count": 10,
                    "streak_start": "2024-01-01T10:00:00+00:00",
                    "streak_end": "2024-01-15T10:00:00+00:00"
                },
                "previous_streak": {
                    "count": 2,
                    "streak_start": "2024-02-01T10:00:00+00:00",
                    "streak_end": "2024-02-15T10:00:00+00:00"
                }
            }
        },
        "reminder": {
            "enabled": true,
            "remind_before_offset": "PT30M",
            "reminder": "Matlab Course Reminder"
        },
        "resource": {
            "enabled": true,
            "local": false,
            "url": "https://www.youtube.com/watch?v=7f50sQYjNRA"
        }
    },
    {
        "title": "Automata Theory (Hopcroft)",
        "description": "Study Automata Theory from a local PDF file.",
        "type": "one_time",
        "one_time_details": {
            "scheduled_datetime": "2024-03-15T14:00:00+00:00",
            "status": {
                "overall": "scheduled",
                "completed_count": 0,
                "missed_count": 0,
                "scheduled": "2024-03-15T14:00:00+00:00"
            }
        },
        "resource": {
            "enabled": true,
            "local": true,
            "url": "C:/Books/automata.pdf"
        }
    },
    {
        "title": "Database Assignment 6",
        "description": "Complete Database Assignment.",
        "type": "one_time",
        "one_time_details": {
            "scheduled_datetime": "2024-03-20T23:59:00+00:00",
            "status": {
                "overall": "scheduled",
                "completed_count": 0,
                "missed_count": 0,
                "scheduled": "2024-03-20T23:59:00+00:00"
            }
        },
        "resource": {
            "enabled": true,
            "local": false,
            "url": "https://iris.nitk.ac.in"
        }
    }
]