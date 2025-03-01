import React, { useState, useRef, useEffect } from 'react'
import './index.css'
import '../../styles/buttons.css'
import AIStar from "../../assets/christmas-stars.png"
import { FaMicrophone } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";

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
        description: "",
        dueDate: "",
        website: "",
        local: false,
    })

    function onClose() {
        setTask({
            title: "",
            description: "",
            dueDate: "",
        })
    }

    // Format seconds into MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                                <button className="atc-voice-btn btn" disabled={task.title.length == 0} onClick={() => setCurState("genwait")}>
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
                                <button className="atc-voice-btn btn"
                                    onClick={() => closeWindow()}
                                >
                                    <span>Confirm</span>
                                    <FaCheck />
                                </button>
                                <hr />
                            </div>
                            <form className="atc-postgen-fields">
                                <div className="atc-postgen-field">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" id="title" name="title" />
                                </div>
                                <div className="atc-postgen-field">
                                    <label htmlFor="description">Description</label>
                                    <textarea id="description" name="description" />
                                </div>
                                <div className="atc-postgen-field">
                                    <label htmlFor="dueDate">Due Date</label>
                                    <input type="date" id="dueDate" name="dueDate" />
                                </div>
                                <div className="atc-postgen-field">
                                    <label htmlFor="website">Website</label>
                                    <input type="text" id="website" name="website" />
                                </div>
                                <div className="atc-postgen-field">
                                    <label htmlFor="website">Website</label>
                                    <input type="text" id="website" name="website" />
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div >
        </>
    )
}

export default AddTask