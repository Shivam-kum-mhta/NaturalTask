import React, { useState } from 'react'
import TaskCard from '../../components/task-card'
import StreaksSection from './streasksection'

import './index.css'
import '../../styles/buttons.css'
import { IoMdAdd } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa6";

import AddTask from '../add-task'
import AllTasks from '../all-tasks'
import TaskView from '../task-view'

function Home() {
    const [selectedTask, setSelectedTask] = useState(null);
    const [showAllTasks, setShowAllTasks] = useState(false);
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

    const handleOpenTask = (id) => {
        setSelectedTask(id);
    }

    return (
        <div id="home">
            <section className="new-task-buttons">
                <button className="btn" onClick={handleAddClick}><IoMdAdd />Add</button>
                <button className="btn" onClick={handleVoiceClick}><FaMicrophone />Add w/ Voice</button>
                <button className="btn btn--secondary" onClick={() => setShowAllTasks(true)}>All Tasks</button>
            </section>
            <section>
                <div className="task-section-header">
                    <h4 className='subtitle'>UPCOMING TASKS</h4>
                    <p>3 of 10</p>
                </div>
                <div id="upcoming-tasks">
                    {tasks.slice(0, 3).map((task, index) => (
                        <TaskCard key={index} task={task} clickOnTask={handleOpenTask} />
                    ))}
                </div>
            </section>
            <StreaksSection />
            {showAddTask && (
                <AddTask
                    closeWindow={() => setShowAddTask(false)}
                    initialState={initialAddTaskState}
                />
            )}
            {showAllTasks && (
                <AllTasks allTasks={tasks} closeWindow={() => setShowAllTasks(false)} openTask={handleOpenTask} />
            )}
            {selectedTask && (
                <TaskView task={tasks.find(task => task.id === selectedTask)} onClose={() => setSelectedTask(null)} />
            )}
        </div>
    )
}

const tasks = [
    {
        id: 1,
        title: "One Leetcode Medium",
        description: "This is a description of the task. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters.",
        type: "recurring",
        local: false,
        dueDate: "2025-03-02T00:30:00",
        website: "https://www.leetcode.com",
    },
    {
        id: 2,
        title: "Matlab Course",
        description: "This is a description of the task. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters.",
        type: "recurring",
        local: false,
        dueDate: "2025-03-06T09:00:00",
        website: "https://www.youtube.com",
    },
    {
        id: 3,
        title: "Automata Theory Study (Hopcroft)",
        description: "This is a description of the task. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters.",
        type: "recurring",
        local: true,
        dueDate: "2025-03-02T08:55:00",
    },
    {
        id: 4,
        title: "Better Call Saul",
        description: "This is a description of the task. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters.",
        type: "one-time",
        dueDate: "2025-03-02T08:55:00",
        website: "https://www.netflix.com",
    },
    {
        id: 5,
        title: "DBMS Assignment",
        description: "This is a description of the task. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters.",
        type: "one-time",
        dueDate: "2025-03-02T08:55:00",
        website: "https://iris.nitk.ac.in/my/",
    },
    {
        id: 6,
        title: "Mail Check",
        description: "This is a description of the task. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters. It is a long description that is more than 50 characters.",
        type: "recurring",
        dueDate: "2025-03-02T08:55:00",
        website: "https://www.google.com",
    }
]

export default Home