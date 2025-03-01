import React, { useState } from 'react'
import './index.css'
import TaskCard from '../../components/task-card'

function AllTasks({ allTasks, closeWindow, openTask }) {
    const [currentTab, setCurrentTab] = useState("recurring");
    return (
        <div className="all-tasks">
            <div className="atc-header">
                <button className="btn btn--secondary" onClick={closeWindow}>X</button>
            </div>
            <h1 className="atc-header-title">All Tasks</h1>
            <div className="atc-header-tabs">
                <p className={`atc-header-tab ${currentTab === "recurring" ? "atc-header-tab-active" : ""}`} onClick={() => setCurrentTab("recurring")}>Recurring</p>
                <p className={`atc-header-tab ${currentTab === "one-time" ? "atc-header-tab-active" : ""}`} onClick={() => setCurrentTab("one-time")}>One-Time</p>
                <p className={`atc-header-tab ${currentTab === "history" ? "atc-header-tab-active" : ""}`} onClick={() => setCurrentTab("history")}>History</p>
            </div>
            <div className="atc-tasks-container">
                {allTasks.map((task, index) => (
                    <TaskCard key={index} task={task} clickOnTask={(id) => { openTask(id); closeWindow(); }} />
                ))}
            </div>
        </div>
    )
}

export default AllTasks