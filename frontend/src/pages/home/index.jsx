import React, { useState } from 'react'
import TaskCard from '../../components/task-card'
import StreaksSection from './streasksection'
import { getUserTasks } from '../../db/getUserData'
import './index.css'
import '../../styles/buttons.css'
import { IoMdAdd } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa6";
import { getUserId } from '../../getUserId/getUserId'
import AddTask from '../add-task'
import AllTasks from '../all-tasks'
import TaskView from '../task-view'
import {sample} from '../../schema/sample_tasks'


function Home() {
    const [retrievedData, setretrievedData] = useState([]);
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

    const retrieveAllTasks = async () => {
        var userId;
        await getUserId().then(userid => {
            console.log("User ID on this page:", userid);
            userId = userid;
          });
        const tasks = await getUserTasks(userId);
        console.log("Retrieved Tasks", JSON.stringify(tasks));
        setretrievedData(tasks);
    }
    return (
        <div id="home">
            <section className="new-task-buttons">
                <button className="btn" onClick={handleAddClick}><IoMdAdd />Add</button>
                <button className="btn" onClick={handleVoiceClick}><FaMicrophone />Add w/ Voice</button>
                <button className="btn btn--secondary" onClick={() => {setShowAllTasks(true); retrieveAllTasks()}}>All Tasks</button>
            </section>
            <section>
                <div className="task-section-header">
                    <h4 className='subtitle'>UPCOMING TASKS</h4>
                    <p>3 of 10</p>
                </div>
                <div id="upcoming-tasks">
                    {sample && sample.slice(0, 3).map((task, index) => (
                        <TaskCard key={index} task={task} clickOnTask={handleOpenTask} />
                    ))}
                </div>
            </section>
            <StreaksSection tasks={sample} onClick={handleOpenTask} />
            {showAddTask && (
                <AddTask
                    closeWindow={() => setShowAddTask(false)}
                    initialState={initialAddTaskState}
                />
            )}
            {showAllTasks && (
                <AllTasks allTasks={retrievedData} closeWindow={() => setShowAllTasks(false)} openTask={handleOpenTask} />
            )}
            {selectedTask && (
                <TaskView task={retrievedData.find(task => task.title === selectedTask)} onClose={() => setSelectedTask(null)} />
            )}
        </div>
    )
}

export default Home