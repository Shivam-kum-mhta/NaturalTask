import React from 'react'

function StreakCard({ streak }) {
    return (
        <div className="streak-box-grid-item">
            <p>{1}</p>
            <p>{streak.date}</p>
        </div>
    )
}

export default StreakCard