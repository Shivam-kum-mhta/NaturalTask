import React, { useEffect, useState } from 'react'
import StreakCard from '../../components/streak-card'

function StreaksSection({ tasks, onClick }) {

    const [recurringTasks, setRecurringTasks] = useState([])

    useEffect(() => {
        setRecurringTasks(tasks.filter((task) => task.type === "recurring"))
    }, [tasks])

    return (
        <>
            <div className="task-section-header">
                <h4 className='subtitle'>YOUR STREAK</h4>
            </div>
            <div id="streak-container">
                <div className="streak-box-grid">
                    {recurringTasks.map((task) => (
                        <StreakCard task={task} key={task.title} onClick={() => onClick(task.title)} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default StreaksSection