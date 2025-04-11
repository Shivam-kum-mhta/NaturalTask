import React, { useState } from 'react';
import './index.css';
import { FaExternalLinkAlt } from "react-icons/fa";
import FullStreak from './fullstreak';
import { modifyTask } from '../modify-task/index.js'; // modifyTask function;
import {rescheduleAlarm} from '../../alarms/reschedule_alarm.js';

function TaskView({ task, onClose }) {
    const [updatedTask, setUpdatedTask] = useState(task);
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTimeChange = (e) => {
        const { value } = e.target;
        setUpdatedTask((prev) => ({
            ...prev,
            time: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("clicked")
      
            
                const updatedTaskData = {
                    ...updatedTask,
                    title: updatedTask.title,
                    description: updatedTask.description,
                    website: updatedTask.website,
                    date: updatedTask.date,
                    time: updatedTask.time,
                };
                console.log("clicked")
                // Update the task in storage
                await modifyTask(updatedTask.id, updatedTaskData);
                console.log("Updated Task:", updatedTaskData);

                // Update the alarm if it exists
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                rescheduleAlarm(updatedTask);
                }
        
        setIsEditing(false);
    };

    const openResourceUrl = () => {
        if (updatedTask.website) {
            window.open(updatedTask.website, '_blank');
        }
    };

    const deleteAlarm = () => {
        if (updatedTask.id && typeof chrome !== 'undefined' && chrome.alarms) {
            // Delete the alarm
            chrome.alarms.clear(updatedTask.id, (wasCleared) => {
                if (wasCleared) {
                    // Remove from storage
                    chrome.storage.local.remove(updatedTask.id, () => {
                        console.log(`Alarm ${updatedTask.id} deleted`);
                        onClose();
                    });
                }
            });
        }
    };

    return (
        <div className="tv">
            <div className="tv-header">
                <button className="btn btn--secondary" onClick={onClose}>X</button>
                {!isEditing ? (
                    <div>
                        <button className="btn tv-edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                        <button className="btn tv-delete-btn" onClick={deleteAlarm}>Delete</button>
                    </div>
                ) : (
                    <button className="btn tv-edit-btn" onClick={handleSubmit}>Save</button>
                )}
            </div>
            <div className="tv-content-header">
                <h2>{updatedTask.title}</h2>
            </div>

            <form className="tv-content" onSubmit={handleSubmit}>
                <p>MAIN</p>
                <div className="tv-field">
                    <div className="tv-field-header">
                        <span>Title</span>
                    </div>
                    <input
                        type="text"
                        name="title"
                        value={updatedTask.title || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={isEditing ? "tv-input-active" : ""}
                    />
                </div>

                <div className="tv-field">
                    <div className="tv-field-header">
                        <span>Description</span>
                    </div>
                    <textarea
                        name="description"
                        value={updatedTask.description || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={isEditing ? "tv-input-active" : ""}
                    />
                </div>

                <div className="tv-field">
                    <div className="tv-field-header">
                        <span>Scheduled Date</span>
                    </div>
                    <input
                        type="date"
                        name="date"
                        value={updatedTask.date || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={isEditing ? "tv-input-active" : ""}
                    />
                </div>

                <div className="tv-field">
                    <div className="tv-field-header">
                        <span>Scheduled Time</span>
                    </div>
                    <input
                        type="time"
                        name="time"
                        value={updatedTask.time || ''}
                        onChange={handleTimeChange}
                        disabled={!isEditing}
                        className={isEditing ? "tv-input-active" : ""}
                    />
                </div>

                <p>CUSTOMIZE</p>
                <div className="tv-field">
                    <div className="tv-field-header">
                        <span>Website</span>
                    </div>
                    <div className="tv-nested-container">
                        <div className="tv-nested-field">
                            <div className="tv-field-header">
                                <span className="tv-field-label">URL</span>
                                {updatedTask.website && (
                                    <button
                                        type="button"
                                        className="tv-link-button"
                                        onClick={openResourceUrl}
                                    >
                                        <FaExternalLinkAlt />
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                name="website"
                                value={updatedTask.website || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={isEditing ? "tv-input-active" : ""}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <p>STREAKS</p>
                    <FullStreak task={updatedTask} />
                </div>
            </form>
        </div>
    );
}

export default TaskView;