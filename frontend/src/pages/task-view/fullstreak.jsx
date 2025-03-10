import React, { useState, useEffect } from 'react';
import { MdLocalFireDepartment } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import './fullstreak.css'
import { useDateFormat } from '/src/hooks/useDateFormat'

function FullStreak({ task }) {
    const [streakProgress, setStreakProgress] = useState(0.0);

    // Create format helpers for each date we need to format
    const longestStreakStart = useDateFormat(task.recurring_details?.streak?.longest_streak?.streak_start || '');
    const longestStreakEnd = useDateFormat(task.recurring_details?.streak?.longest_streak?.streak_end || '');
    const previousStreakStart = useDateFormat(task.recurring_details?.streak?.previous_streak?.streak_start || '');
    const previousStreakEnd = useDateFormat(task.recurring_details?.streak?.previous_streak?.streak_end || '');
    const currentStreakStart = useDateFormat(task.recurring_details?.streak?.current_streak?.streak_start || '');
    useEffect(() => {
        const prog = (task.recurring_details?.streak?.current_streak?.count || 0.0)
            /
            (task.recurring_details?.streak?.longest_streak?.count || 1.0)

        setStreakProgress(prog);
    }, [task]);

    return (
        <div className="tv-streak-card">
            <div className="tv-streak-info">
                <div className="tv-streak-icon-container">
                    <MdLocalFireDepartment className="streak-icon" />
                </div>
                <div className="tv-streak-details">
                    <div className="tv-streak-count">
                        {task.recurring_details?.streak?.current_streak?.count || 0}
                    </div>
                    <div className="streak-subtitle">
                        Current Streak From
                        <p>{currentStreakStart.formattedDateTime || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="tv-streak-progress">
                <div className="tv-progress-bar">
                    <div
                        className={`tv-progress-fill ${streakProgress === 1 ? 'tv-streak-longest-effect' : ''}`}
                        style={{
                            width: `${streakProgress * 100}%`
                        }}
                    />
                </div>
            </div>

            {task.recurring_details?.streak?.longest_streak?.count > 0 && (
                <div className="tv-streak-section">
                    <div className="tv-streak-section-top">
                        <div className="tv-streak-section-title">
                            Longest Streak
                        </div>
                        <div className="tv-streak-section-count">
                            {task.recurring_details?.streak?.longest_streak?.count || 0}
                        </div>
                    </div>
                    <div className="tv-streak-section-date">
                        <p>{longestStreakStart.formattedDate || 'N/A'}</p>
                        To
                        <p>{longestStreakEnd.formattedDate || 'N/A'}</p>
                    </div>
                </div>
            )}

            {task.recurring_details?.streak?.previous_streak?.count > 0 && (
                <div className="tv-streak-section">
                    <div className="tv-streak-section-top">
                        <div className="tv-streak-section-title">
                            Previous Streak
                        </div>
                        <div className="tv-streak-section-count">
                            {task.recurring_details?.streak?.previous_streak?.count || 0}
                        </div>
                    </div>
                    <div className="tv-streak-section-date">
                        <p>{previousStreakStart.formattedDate || 'N/A'}</p>
                        To
                        <p>{previousStreakEnd.formattedDate || 'N/A'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FullStreak