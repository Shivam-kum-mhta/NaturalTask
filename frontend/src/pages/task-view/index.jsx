import React, { useState } from 'react'
import './index.css'
import { FaExternalLinkAlt } from "react-icons/fa";
import Toggle from '/src/components/Toggle'
import FullStreak from './fullstreak'
import { modifyTask } from '../modify-task/index.js' // modifyTask function;

function TaskView({ task, onClose }) {
    const [updatedTask, setUpdatedTask] = useState(task)
    const [isEditing, setIsEditing] = useState(false)
    
    // Determine if this is an alarm task
    const isAlarmTask = !!task.alarmId;

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUpdatedTask(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleTimeChange = (e) => {
        const { value } = e.target
        setUpdatedTask(prev => ({
            ...prev,
            time: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isEditing) {
            if (isAlarmTask) {
                // Update the alarm in Chrome storage
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    const updatedAlarmTask = {
                        ...updatedTask.originalTask,
                        title: updatedTask.title,
                        description: updatedTask.description,
                        website: updatedTask.resource?.url || updatedTask.website || updatedTask.resource
                    };
                    
                    chrome.storage.local.set({
                        [updatedTask.alarmId]: updatedAlarmTask
                    }, () => {
                        console.log("Alarm task updated:", updatedAlarmTask);
                    });
                }
            } else {
                // Call the modifyTask function to update the task in Firestore     
                modifyTask(updatedTask.id, updatedTask)
                console.log("Updated Task:", updatedTask)
            }
        }
        setIsEditing(false)
    }

    const openResourceUrl = () => {
        if (updatedTask.resource?.url) {
            window.open(updatedTask.resource.url, '_blank')
        } else if (updatedTask.resource) {
            window.open(updatedTask.resource, '_blank')
        } else if (updatedTask.website) {
            window.open(updatedTask.website, '_blank')
        }
    }

    const deleteAlarm = () => {
        if (isAlarmTask && typeof chrome !== 'undefined' && chrome.alarms) {
            // Delete the alarm
            chrome.alarms.clear(updatedTask.alarmId, (wasCleared) => {
                if (wasCleared) {
                    // Remove from storage
                    chrome.storage.local.remove(updatedTask.alarmId, () => {
                        console.log(`Alarm ${updatedTask.alarmId} deleted`);
                        onClose();
                    });
                }
            });
        }
    }

    return (
        <div className="tv">
            <div className="tv-header">
                <button className="btn btn--secondary" onClick={onClose}>X</button>
                {!isEditing ? (
                    <div>
                        {isAlarmTask && (
                            <button className="btn btn--danger mr-2" onClick={deleteAlarm}>Delete Alarm</button>
                        )}
                        <button className="btn tv-edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
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

                {isAlarmTask && (
                    <div className="tv-field">
                        <div className="tv-field-header">
                            <span>Scheduled Time</span>
                        </div>
                        <input
                            type="text"
                            value={new Date(updatedTask.originalAlarm.scheduledTime).toLocaleString()}
                            disabled={true}
                        />
                        {updatedTask.originalAlarm.periodInMinutes && (
                            <div className="tv-field-hint">
                                Repeats every {updatedTask.originalAlarm.periodInMinutes} minutes
                            </div>
                        )}
                        {updatedTask.originalTask.frequency && (
                            <div className="tv-field-hint">
                                Repeats {updatedTask.originalTask.frequency}
                            </div>
                        )}
                    </div>
                )}

                {!isAlarmTask && updatedTask.type === "one_time" && (
                    <div className="tv-field">
                        <div className="tv-field-header">
                            <span>Scheduled Date & Time</span>
                        </div>
                        <input
                            type="datetime-local"
                            value={updatedTask.one_time_details?.scheduled_datetime?.slice(0, 16) || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={isEditing ? "tv-input-active" : ""}
                        />
                    </div>
                )}

                <p>CUSTOMIZE</p>
                <div className="tv-field">
                    <div className="tv-field-header">
                        <span>Resource</span>
                    </div>
                    <div className="tv-nested-container">
                        <div className="tv-nested-field">
                            <div className="tv-field-header">
                                <span className="tv-field-label">URL</span>
                                {(updatedTask.resource?.url || updatedTask.resource || updatedTask.website) && (
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
                                name="resource"
                                value={updatedTask.resource?.url || updatedTask.resource || updatedTask.website || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setUpdatedTask(prev => ({
                                        ...prev,
                                        resource: isAlarmTask ? { url: value } : value,
                                        website: isAlarmTask ? value : prev.website
                                    }))
                                }}
                                disabled={!isEditing}
                                className={isEditing ? "tv-input-active" : ""}
                            />
                        </div>
                    </div>
                </div>

                {!isAlarmTask && (
                    <div className="tv-field">
                        <div className="tv-field-header">
                            <span>Time</span>
                        </div>
                        <input
                            type="time"
                            name="time"
                            value={updatedTask.time || '05:00:00'}
                            onChange={handleTimeChange}
                            disabled={!isEditing}
                            className={isEditing ? "tv-input-active" : ""}
                        />
                    </div>
                )}

                {!isAlarmTask && updatedTask.type === "recurring" && (
                    <>
                        <p>STREAKS</p>
                        <FullStreak task={updatedTask} />
                    </>
                )}
            </form>
        </div>
    )
}

export default TaskView
