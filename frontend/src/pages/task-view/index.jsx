import React, { useEffect, useState } from 'react'
import './index.css'

function TaskView({ task, onClose }) {

    const [graphic, setGraphic] = useState(null)
    useEffect(() => {
        if (task.website) {
            const splits = task.website.split('/')
            const domain = splits[0] + '//' + splits[2]
            setGraphic(domain + "/favicon.ico")
        }
    }, [task])

    return (
        <div className="tv">
            <div className="tv-header">
                <button className="btn btn--secondary" onClick={onClose}>X</button>
            </div>
            <div className="tv-content">
                {task.website && (
                    <img src={graphic} className="tv-graphic" />
                )}
                <h2>{task.title}</h2>
                <p>{task.description}</p>
            </div>

        </div>
    )
}

export default TaskView