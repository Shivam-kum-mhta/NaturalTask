import React, { useState } from 'react'
import TaskCard from '../../components/task-card'
import StreaksSection from './streasksection'
import './index.css'
import '../../styles/buttons.css'
import { IoMdAdd } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa6";

import AddTask from '../add-task'

function Home() {
    const [showAddTask, setShowAddTask] = useState(false);
    const [initialAddTaskState, setInitialAddTaskState] = useState("idle"); // Default to IDLE state

    const handleAddClick = () => {
        setInitialAddTaskState("idle"); // IDLE state
        setShowAddTask(true);
    };

    const handleVoiceClick = () => {
        setInitialAddTaskState("voice"); // VOICE state
        setShowAddTask(true);
    };

    return (
        <div id="home">
            <section className="new-task-buttons">
                <button className="btn" onClick={handleAddClick}><IoMdAdd />Add</button>
                <button className="btn" onClick={handleVoiceClick}><FaMicrophone />Add w/ Voice</button>
                <button className="btn btn--secondary">All Tasks</button>
            </section>
            <section>
                <div className="task-section-header">
                    <h4 className='subtitle'>UPCOMING TASKS</h4>
                    <p>3 of 10</p>
                </div>
                <div id="upcoming-tasks">
                    <TaskCard task={task1} />
                    <TaskCard task={task2} />
                    <TaskCard task={task3} />
                </div>
            </section>
            <StreaksSection />
            {showAddTask && (
                <AddTask
                    closeWindow={() => setShowAddTask(false)}
                    initialState={initialAddTaskState}
                />
            )}
        </div>
    )
}


const task1 = {
    title: "One Leetcode Medium",
    description: "This is a description of the task. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters.",
    type: "task",
    local: false,
    dueDate: "2025-03-02T00:30:00",
    website: "https://www.leetcode.com",
}
const task2 = {
    title: "Matlab Course",
    description: "This is a description of the task. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters.",
    type: "task",
    local: false,
    dueDate: "2025-03-06T09:00:00",
    website: "https://www.youtube.com",
}
const task3 = {
    title: "Automata Theory Study (Hopcroft)",
    description: "This is a description of the task. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters.",
    type: "task",
    local: true,
    dueDate: "2025-03-02T08:55:00",
}
export default Home