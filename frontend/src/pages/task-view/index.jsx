import React, { useEffect, useState } from 'react'
import './index.css'
import { cronDescription, cronValidate } from '../../util/cron_util'
import { FaFile } from "react-icons/fa6";
import { IoToggle, IoAdd, IoRemove } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import Toggle from '/src/components/Toggle'
import FullStreak from './fullstreak'

function TaskView({ task, onClose, onSave }) {
    const [updatedTask, setUpdatedTask] = useState(task)
    const [graphic, setGraphic] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (task.resource && !task.resource.local) {
            if (task.resource.url) {
                const splits = task.resource.url.split('/')
                const domain = splits[0] + '//' + splits[2]
                setGraphic(domain + "/favicon.ico")
            }
        }
    }, [task])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUpdatedTask(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleResourceChange = (e) => {
        const { name, value } = e.target
        setUpdatedTask(prev => ({
            ...prev,
            resource: {
                ...prev.resource,
                [name]: value
            }
        }))
    }

    const handleReminderChange = (e) => {
        const { name, value } = e.target
        setUpdatedTask(prev => ({
            ...prev,
            reminder: {
                ...prev.reminder,
                [name]: value
            }
        }))
    }

    const handleReminderToggle = (checked) => {
        setUpdatedTask(prev => ({
            ...prev,
            reminder: {
                ...prev.reminder,
                enabled: checked
            }
        }))
    }

    const handleResourceToggle = (checked) => {
        setUpdatedTask(prev => ({
            ...prev,
            resource: {
                ...prev.resource,
                enabled: checked
            }
        }))
    }

    const handleCronRuleChange = (index, value) => {
        if (updatedTask.type === "recurring") {
            const newCronRules = [...updatedTask.recurring_details.cron_rules]
            newCronRules[index] = value
            setUpdatedTask(prev => ({
                ...prev,
                recurring_details: {
                    ...prev.recurring_details,
                    cron_rules: newCronRules
                }
            }))
        }
    }

    const addCronRule = () => {
        if (updatedTask.type === "recurring") {
            setUpdatedTask(prev => ({
                ...prev,
                recurring_details: {
                    ...prev.recurring_details,
                    cron_rules: [...prev.recurring_details.cron_rules, ""]
                }
            }))
        }
    }

    const removeCronRule = (index) => {
        if (updatedTask.type === "recurring") {
            const newCronRules = [...updatedTask.recurring_details.cron_rules]
            newCronRules.splice(index, 1)
            setUpdatedTask(prev => ({
                ...prev,
                recurring_details: {
                    ...prev.recurring_details,
                    cron_rules: newCronRules
                }
            }))
        }
    }

    const handleScheduledDateTimeChange = (e) => {
        const { value } = e.target
        setUpdatedTask(prev => ({
            ...prev,
            one_time_details: {
                ...prev.one_time_details,
                scheduled_datetime: value
            }
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // If it's a recurring task, filter out invalid cron rules
        if (updatedTask.type === "recurring") {
            console.log("Current cron rules:", updatedTask.recurring_details.cron_rules)
            const validCronRules = updatedTask.recurring_details.cron_rules.filter(rule =>
                rule &&
                cronValidate(rule) // check if rule is valid cron expression
            )

            console.log("Filtered cron rules:", validCronRules)

            const taskToSave = {
                ...updatedTask,
                recurring_details: {
                    ...updatedTask.recurring_details,
                    cron_rules: validCronRules
                }
            }

            setUpdatedTask(taskToSave)

            if (onSave) {
                onSave(taskToSave)
            }
        } else {
            if (onSave) {
                onSave(updatedTask)
            }
        }

        setIsEditing(false)
    }

    const openResourceUrl = () => {
        if (updatedTask.resource?.url) {
            window.open(updatedTask.resource.url, '_blank')
        }
    }

    const openCronRules = () => {
        if (updatedTask.recurring_details?.cron_rules) {
            window.open(`https://crontab.guru/${updatedTask.recurring_details.cron_rules.join(',')}`, '_blank')
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
                {!updatedTask?.resource?.local && (
                    <img src={graphic} alt="" className="tv-graphic" />
                )}
                {updatedTask?.resource?.local && (
                    <div className="tv-graphic">
                        <FaFile className="tv-graphic" />
                    </div>
                )}
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

                {/* Schedule DateTime for one-time tasks */}
                {updatedTask.type === "one_time" && (
                    <div className="tv-field">
                        <div className="tv-field-header">
                            <span>Scheduled Date & Time</span>
                        </div>
                        <input
                            type="datetime-local"
                            value={updatedTask.one_time_details?.scheduled_datetime?.slice(0, 16) || ''}
                            onChange={handleScheduledDateTimeChange}
                            disabled={!isEditing}
                            className={isEditing ? "tv-input-active" : ""}
                        />
                    </div>
                )}

                <p>CUSTOMIZE</p>
                {/* Resource section with toggle */}
                <div className="tv-field">
                    <div className="tv-field-header">
                        <span>Resource</span>
                        <Toggle
                            value={updatedTask.resource?.enabled || false}
                            onChange={handleResourceToggle}
                            disabled={!isEditing}
                        />
                    </div>
                    {updatedTask.resource?.enabled && (
                        <div className="tv-nested-container">
                            <div className="tv-nested-field">
                                <div className="tv-field-header">
                                    <span className="tv-field-label">URL</span>
                                    {updatedTask.resource?.url && (
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
                                    name="url"
                                    value={updatedTask.resource?.url || ''}
                                    onChange={handleResourceChange}
                                    disabled={!isEditing}
                                    className={isEditing ? "tv-input-active" : ""}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Reminder section with toggle and nested fields */}
                <div className="tv-field">
                    <div className="tv-field-header">
                        <span>Reminder</span>
                        <Toggle
                            value={updatedTask.reminder?.enabled || false}
                            onChange={handleReminderToggle}
                            disabled={!isEditing}
                        />
                    </div>
                    {updatedTask.reminder?.enabled && (
                        <div className="tv-nested-container">
                            <div className="tv-nested-fields">
                                <div className="tv-nested-field">
                                    <div className="tv-field-header">
                                        <span className="tv-field-label">Reminder Message</span>
                                    </div>
                                    <input
                                        type="text"
                                        name="reminder"
                                        value={updatedTask.reminder?.reminder || ''}
                                        onChange={handleReminderChange}
                                        disabled={!isEditing}
                                        className={isEditing ? "tv-input-active" : ""}
                                        placeholder="Reminder message"
                                    />
                                </div>

                                <div className="tv-nested-field">
                                    <div className="tv-field-header">
                                        <span className="tv-field-label">Remind Before (ISO 8601 Duration)</span>
                                    </div>
                                    <input
                                        type="text"
                                        name="remind_before_offset"
                                        value={updatedTask.reminder?.remind_before_offset || 'PT30M'}
                                        onChange={handleReminderChange}
                                        disabled={!isEditing}
                                        className={isEditing ? "tv-input-active" : ""}
                                        placeholder="PT30M (30 minutes before)"
                                    />
                                    <div className="tv-field-hint">
                                        Format: PT[hours]H[minutes]M (e.g., PT1H30M for 1 hour 30 minutes)
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recurring task specific fields */}
                {updatedTask.type === "recurring" && (
                    <>
                        <div className="tv-field">
                            <div className="tv-field-header">
                                <div className="tv-field-title">
                                    <span>Cron Rules</span>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            className="tv-icon-button tv-add-button"
                                            onClick={addCronRule}
                                            title="Add new rule"
                                        >
                                            <IoAdd />
                                        </button>
                                    )}
                                    {updatedTask.recurring_details?.cron_rules && (
                                        <button
                                            type="button"
                                            className="tv-link-button"
                                            onClick={openCronRules}
                                        >
                                            Read more&nbsp;&nbsp;
                                            <FaExternalLinkAlt />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="tv-nested-container">
                                <div className="tv-nested-fields">
                                    {updatedTask.recurring_details?.cron_rules?.map((rule, index) => (
                                        <div className="tv-nested-field" key={index}>
                                            <div className="tv-field-header">
                                                <span className="tv-field-label">
                                                    {
                                                        cronValidate(rule) ? cronDescription(rule)
                                                            : 'Enter a valid cron expression'
                                                    }
                                                </span>
                                                {isEditing && (
                                                    <button
                                                        type="button"
                                                        className="tv-icon-button tv-remove-button"
                                                        onClick={() => removeCronRule(index)}
                                                        title="Remove this rule"
                                                    >
                                                        <IoRemove />
                                                    </button>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                value={rule || ''}
                                                onChange={(e) => handleCronRuleChange(index, e.target.value)}
                                                disabled={!isEditing}
                                                className={isEditing ? "tv-input-active" : ""}
                                                placeholder="e.g., 0 9 * * 1-5 (Weekdays at 9am)"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </>
                )}
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