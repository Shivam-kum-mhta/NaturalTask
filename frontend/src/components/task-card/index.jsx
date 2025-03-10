import React, { useEffect, useState } from 'react'
import './index.css'
import { FaFile } from "react-icons/fa6";
import { useDateFormat } from '../../hooks/useDateFormat'

import { upcomingDatetimes, ToStringToISO } from '../../util/cron_util'

function TaskCard({ task, clickOnTask }) {

    const [graphic, setGraphic] = useState(task.graphic)
    const [upcoming, setUpcoming] = useState([])
    const { formattedDateTime, relativeTime, getTimeOnly } = useDateFormat(task.dueDate)

    useEffect(() => {
        if (task.resource && !task.resource.local) {
            if (task.resource.url) {
                const splits = task.resource.url.split('/')
                const domain = splits[0] + '//' + splits[2]
                setGraphic(domain + "/favicon.ico")
            }
        }
    }, [task])


    useEffect(() => {
        if (task.recurring_details) {
            const upcoming = upcomingDatetimes(task.recurring_details.cron_rules[0], new Date(), 3)
            setUpcoming(upcoming)
        } else if (task.one_time_details) {
            console.log(task.one_time_details)
            setUpcoming(task.one_time_details.scheduled_datetime)
        }
    }, [task])


    return (
        <div id="task-card" className="light" onClick={() => clickOnTask(task.title)}>
            {!task?.resource?.local && (
                <img src={graphic} alt="" className="tc-graphic" />
            )}
            {task?.resource?.local && (
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
                <p>{getTimeOnly(upcoming[0])}</p>

            </div>

        </div>
    )
}

export default TaskCard