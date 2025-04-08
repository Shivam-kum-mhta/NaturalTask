import React, { useState, useRef, useEffect } from 'react'
import './index.css'
import '../../styles/buttons.css'
import AIStar from "../../assets/christmas-stars.png"
import { FaMicrophone } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../db/firebase"; 
import { getUserId } from "../../getUserId/getUserId"; // getUserId function for storing data in Firestore
import { addChromeAlarmForTask } from '../../alarms/add_alarm';
function AddTask({ closeWindow, initialState = "idle" }) {
    const textInputRef = useRef(null)
    const states = ["idle", "text", "voice", "genwait", "postgen"]
    const [curState, setCurState] = useState(initialState)
    const [isListening, setIsListening] = useState(false);
    const [volume, setVolume] = useState(0);
    const [recordingTime, setRecordingTime] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (curState === "voice") {
            startListening();
            // Start the timer
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            stopListening();
            // Clear the timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }

        // Cleanup on component unmount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [curState]);

    useEffect(() => {
        if (curState == "genwait") { // If state is GENWAIT
            const timer = setTimeout(() => {
                setCurState("postgen"); // Move to POSTGEN state
            }, 1000);

            // Cleanup timeout if component unmounts or state changes
            return () => clearTimeout(timer);
        }
    }, [curState]);

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 256;
            source.connect(analyzer);

            setIsListening(true);

            const dataArray = new Uint8Array(analyzer.frequencyBinCount);
            const updateVolume = () => {
                if (!isListening) return;

                analyzer.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
                setVolume(average);

                // Update animation speed based on volume
                const circles = document.querySelectorAll('.voice-circle');
                circles.forEach(circle => {
                    circle.style.animationDuration = `${2 - (average / 128)}s`;
                });

                requestAnimationFrame(updateVolume);
            };

            updateVolume();
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    const stopListening = () => {
        setIsListening(false);
    };

 const [task, setTask] = useState({
    title: "",
    description: null,
    date: "",
    time: "",
    start_date: null,
    end_date: null,
    website: null,
    frequency: "",
    recurring_until: null,
    type: "regular",
});

function onClose() {
    setTask({
        title: "",
        description: null,
        date: "",
        time: "",
        start_date: null,
        end_date: null,
        website: null,
        frequency: "",
        recurring_until: null,
        type: "regular",
    });
}

const handleGoClick = async () => {
    if (task.title.length === 0) return;
    console.log("Task Title:", task.title);

    try {
        const response = await fetch('https://naturaltask.onrender.com/generate-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: task.title }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Task created:', data);

            // Update the task state with the generated JSON properties
            setTask({
                title: data.generated_json.task,
                description: data.generated_json.description,
                date: data.generated_json.date,
                time: data.generated_json.time,
                start_date: data.generated_json.start_date,
                end_date: data.generated_json.end_date,
                website: data.generated_json.website,
                frequency: data.generated_json.frequency,
                recurring_until: data.generated_json.recurring_until,
                type: data.generated_json.type,
            });

            // setGeneratedJson(data.generated_json); // Store the entire generated JSON
            setCurState("postgen");
        } else {
            console.error('Failed to create task:', response.statusText);
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
};

const handleConfirm = async () => {
    
    try {
        var userId;

        await getUserId().then(userid => {
            console.log("User ID on this page:", userid);
            userId = userid;
          });
          

        // Save the task to Firestore under the user's collection
        const docRef = await addDoc(collection(db, "users", userId, "tasks"), task);
        console.log("Task saved with ID:", docRef.id);
        console.log("docRef :", docRef);

        // Add the task ID to the task object
        const taskWithId = {
            id: docRef.id,
            title: task.title,
            date: task.date,
            time: task.time,
            frequency: "test",
        };

        console.log("Formatted Task:", taskWithId);
        try {
             // Create the alarm
    chrome.alarms.create("shivu", { delayInMinutes: 1 });

    console.log(`Alarm shivu created to trigger in 1 minute.`);
        } catch (error) {
            console.error("Error adding Chrome alarm for task:", error);
        }

        // Close the window after saving
        closeWindow();
    } catch (error) {
        console.error("Error saving task to Firestore:", error);
    }
};

    return (
        <>
            <div className="add-task">
                <div className="atc-header">
                    <button className="btn btn--secondary" onClick={closeWindow}>X</button>
                </div>
                <div className={"atc-container-" + curState}>
                    {(curState == "idle" || curState == "text") && (
                        <>
                            <p className='atc-example'>"{exampleNLP[0]}"</p>
                            <textarea
                                ref={textInputRef}
                                className={`atc-text-input ${task.title ? "atc-text-input-nonempty" : ""}`}
                                placeholder="Type your task..."
                                value={task.title}
                                onChange={(e) => {
                                    setTask({ ...task, title: e.target.value })
                                    if (e.target.value.length > 0) {
                                        setCurState("text")
                                    } else {
                                        setCurState("idle")
                                    }
                                }}
                            />
                            <div className="atc-btns">
                                <button className="atc-voice-btn btn" disabled={task.title.length == 0} onClick={handleGoClick}>
                                    <span>Go</span><img src={AIStar} alt="AI Star" width={20} height={20} />
                                </button>
                                <span>OR</span>
                                <button className="atc-voice-btn btn" onClick={() => setCurState("voice")}>
                                    <FaMicrophone />
                                </button>
                            </div>
                            {curState == "idle" && (
                                <>
                                    <hr />
                                    <h4>OR</h4>
                                    <div className="atc-btns">
                                        <button className="atc-voice-btn btn btn--secondary">
                                            Add Manually
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {curState == "voice" && (
                        <div className="atc-vi-container">
                            <div className="atc-vi">
                                <div className="atc-vi-mic">
                                    <FaMicrophone style={{ zIndex: 100 }} />
                                    <div className="voice-visualizer">
                                        <div className="voice-circle circle1"></div>
                                        <div className="voice-circle circle2"></div>
                                        <div className="voice-circle circle3"></div>
                                    </div>
                                    <div className="recording-timer">
                                        {formatTime(recordingTime)}
                                    </div>
                                </div>
                            </div>
                            <button className="atc-voice-btn btn btn--secondary" onClick={() => setCurState("genwait")}>
                                Done (Space)
                            </button>
                        </div>
                    )}
                    {curState == "genwait" && (
                        <div className="atc-genwait-container">
                            <h4>Understanding</h4>
                            <span className="loader"></span>
                        </div>
                    )}
                    {curState == "postgen" && (
                        <div className="atc-postgen-container">
                            <div className="atc-postgen-header">
                                <h4>Your Task.</h4>
                                <button className="atc-voice-btn btn" onClick={handleConfirm}>
                                    <span>Confirm</span>
                                    <FaCheck />
                                </button>
                                <hr />
                            </div>
                            <form className="atc-postgen-fields">
    <div className="atc-postgen-field">
        <label htmlFor="title">Title</label>
        <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
    </div>

    {/* Grid Layout */}
    <div className="atc-grid">
        <div className="atc-row">
            <div className="atc-postgen-field">
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={task.date}
                    onChange={(e) => setTask({ ...task, date: e.target.value })}
                />
            </div>
            <div className="atc-postgen-field">
                <label htmlFor="time">Time</label>
                <input
                    type="time"
                    id="time"
                    name="time"
                    value={task.time}
                    onChange={(e) => setTask({ ...task, time: e.target.value })}
                />
            </div>
        </div>

        <div className="atc-row">
            <div className="atc-postgen-field">
                <label htmlFor="start_date">Start Date</label>
                <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={task.start_date || ""}
                    onChange={(e) => setTask({ ...task, start_date: e.target.value })}
                />
            </div>
            <div className="atc-postgen-field">
                <label htmlFor="end_date">End Date</label>
                <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={task.end_date || ""}
                    onChange={(e) => setTask({ ...task, end_date: e.target.value })}
                />
            </div>
        </div>

        <div className="atc-row">
            <div className="atc-postgen-field">
                <label htmlFor="frequency">Frequency</label>
                <input
                    type="text"
                    id="frequency"
                    name="frequency"
                    value={task.frequency}
                    onChange={(e) => setTask({ ...task, frequency: e.target.value })}
                />
            </div>
            <div className="atc-postgen-field">
                <label htmlFor="recurring_until">Recurring Until</label>
                <input
                    type="date"
                    id="recurring_until"
                    name="recurring_until"
                    value={task.recurring_until || ""}
                    onChange={(e) => setTask({ ...task, recurring_until: e.target.value })}
                />
            </div>
        </div>
    </div>

    <div className="atc-postgen-field">
        <label htmlFor="website">Website</label>
        <input
            type="text"
            id="website"
            name="website"
            value={task.website || ""}
            onChange={(e) => setTask({ ...task, website: e.target.value })}
        />
    </div>

    <div className="atc-postgen-field">
        <label htmlFor="type">Type</label>
        <input
            type="text"
            id="type"
            name="type"
            value={task.type}
            onChange={(e) => setTask({ ...task, type: e.target.value })}
        />
    </div>
    <div className="atc-postgen-field">
        <label htmlFor="description">Description</label>
        <textarea
            id="description"
            name="description"
            value={task.description || ""}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
    </div>
</form>

                        </div>
                    )}
                </div>
            </div >
        </>
    )
}

const exampleNLP = [
    "Automata Theory Class at 8:55am on Mondays, 9:55am on Tuesdays and Thursdays, 10:55am on Wednesdays", "Leetcode from 10pm-12am every day.",
    "Prepare for OS Examination coming Saturday."
]

export default AddTask