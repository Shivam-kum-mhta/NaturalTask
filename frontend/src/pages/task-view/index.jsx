import React, { useState } from 'react'
import './index.css'
import { FaExternalLinkAlt } from "react-icons/fa";
import Toggle from '/src/components/Toggle'
import FullStreak from './fullstreak'

function TaskView({ task, onClose, onSave }) {
    const [updatedTask, setUpdatedTask] = useState(task)
    const [isEditing, setIsEditing] = useState(false)

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
        if (onSave) {
            onSave(updatedTask)
        }
        setIsEditing(false)
    }

    const openResourceUrl = () => {
        if (updatedTask.resource) {
            window.open(updatedTask.resource, '_blank')
        }
    }

    return (
        <div className="tv">
            <div className="tv-header">
                <button className="btn btn--secondary" onClick={onClose}>X</button>
                {!isEditing ? (
                    <button className="btn tv-edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
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

                {updatedTask.type === "one_time" && (
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
                                {updatedTask.resource && (
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
                                value={updatedTask.resource || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={isEditing ? "tv-input-active" : ""}
                            />
                        </div>
                    </div>
                </div>

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

                {updatedTask.type === "recurring" && (
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
