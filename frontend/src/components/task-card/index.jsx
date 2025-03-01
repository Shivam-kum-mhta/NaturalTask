import React from 'react'
import './index.css'

function TaskCard({ task }) {
    return (
        <div id="task-card" className="gradient-border">
            <p><b>{task.title}</b></p>
            <p>{task.description}</p>
            <p>{task.dueDate}</p>
            <p>{task.priority}</p>
            <p>{task.status}</p>
        </div>
    )
}

export default TaskCard