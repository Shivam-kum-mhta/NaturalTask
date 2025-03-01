import React from 'react'
import StreakCard from '../../components/streak-card'

function StreaksSection() {
    return (
        <section>
            <div className="task-section-header">
                <h4 className='subtitle'>YOUR STREAK</h4>
            </div>
            <div id="streak-container">
                <p>You have completed 10 tasks in a row! 🔥🔥</p>
                <div className="streak-box-grid">
                    {streaks.map((streak) => (
                        <StreakCard streak={streak} />
                    ))}
                </div>
            </div>
        </section>
    )
}

const streaks = [
    {
        date: "2025-03-01",
        completed: true,
    },
    {
        date: "2025-03-02",
        completed: true,
    },
]

export default StreaksSection