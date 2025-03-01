import React, { useEffect, useState } from 'react'
import './index.css'
import { FaFile } from "react-icons/fa6";
import { useDateFormat } from '../../hooks/useDateFormat'

function TaskCard({ task }) {

    const [graphic, setGraphic] = useState(task.graphic)
    const { formattedDateTime, relativeTime, getTimeOnly } = useDateFormat(task.dueDate)

    useEffect(() => {
        if (task.website) {
            const splits = task.website.split('/')
            const domain = splits[0] + '//' + splits[2]
            setGraphic(domain + "/favicon.ico")
        }
    }, [task])


    return (
        <div id="task-card" className="light">
            {task.website && (
                <img src={graphic} alt="" className="tc-graphic" />
            )}
            {task.local && (
                <div className="tc-graphic">
                    <FaFile className="tc-graphic" />
                </div>
            )}
            <div className="tc-content">
                <p><b>{task.title}</b></p>
                <p>{task.description && String(task.description).substring(0, 30) + "..."}</p>
                <b><p>{relativeTime}</p></b>

            </div>
            <div className="tc-time">
                <p>{getTimeOnly(task.dueDate)}</p>

            </div>

        </div>
    )
}

export default TaskCard