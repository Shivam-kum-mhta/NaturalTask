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

import { sampleTasks } from '../../schema/sample_tasks'

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
                    {sampleTasks.slice(0, 3).map((task, index) => (
                        <TaskCard key={index} task={task} clickOnTask={handleOpenTask} />
                    ))}
                </div>
            </section>
            <StreaksSection tasks={sampleTasks} onClick={handleOpenTask} />
            {showAddTask && (
                <AddTask
                    closeWindow={() => setShowAddTask(false)}
                    initialState={initialAddTaskState}
                />
            )}
            {showAllTasks && (
                <AllTasks allTasks={sampleTasks} closeWindow={() => setShowAllTasks(false)} openTask={handleOpenTask} />
            )}
            {selectedTask && (
                <TaskView task={sampleTasks.find(task => task.title === selectedTask)} onClose={() => setSelectedTask(null)} />
            )}
        </div>
    )
}

export default Home