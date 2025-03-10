import React, { useState, useEffect } from 'react';
import { MdLocalFireDepartment } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import './streak-card.css';

function StreakCard({ task, onClick }) {

    const [streakProgress, setStreakProgress] = useState(0.0);

    useEffect(() => {
        const prog = (task.recurring_details?.streak?.current_streak?.count || 0.0)
            /
            (task.recurring_details?.streak?.longest_streak?.count || 1.0)

        setStreakProgress(prog);
        console.log(prog);
    }, [task]);

    return (
        <div className="streak-card" onClick={onClick}>
            <span className="streak-label">{task.title} <FaAngleRight /></span>
            <div className="streak-info">
                <div className="streak-icon-container">
                    <MdLocalFireDepartment className="streak-icon" />
                </div>
                <div className="streak-details">
                    <div className="streak-count">
                        {task.recurring_details?.streak?.current_streak?.count || 0}
                    </div>
                    <div className="streak-subtitle">Current Streak</div>
                </div>
            </div>

            <div className="streak-progress">
                <div className="progress-bar">
                    <div
                        className={`progress-fill ${streakProgress === 1 ? 'streak-longest-effect' : ''}`}
                        style={{
                            width: `${streakProgress * 100}%`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default StreakCard;