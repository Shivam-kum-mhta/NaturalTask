import React, { useState, useEffect } from 'react';
import TaskCard from '../../components/task-card';
import StreaksSection from './streasksection';
import { getUserTasks } from '../../db/getUserData';
import './index.css';
import '../../styles/buttons.css';
import { IoMdAdd } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa6";
import { getUserId } from '../../getUserId/getUserId';
import AddTask from '../add-task';
import AllTasks from '../all-tasks';
import TaskView from '../task-view';
import { sample } from '../../schema/sample_tasks';
import AlarmList from './AlarmList';

function Home() {
    const [retrievedData, setRetrievedData] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showAllTasks, setShowAllTasks] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [initialAddTaskState, setInitialAddTaskState] = useState("idle"); // Default to IDLE state

    const [alarms, setAlarms] = useState([]);
    const [tasks, setTasks] = useState({});

    useEffect(() => {
        // Get all alarms from Chrome API
        if (typeof chrome === 'undefined' || typeof chrome.alarms === 'undefined') {
            console.error('Only accessible in Extension.');
            return;
        }

        // Fetch all alarms
        chrome.alarms.getAll((alarmList) => {
            console.log("alarmList:", alarmList);
            setAlarms(alarmList);
        })
            // // Fetch corresponding tasks for each alarm
            // const alarmNames = alarmList.map((alarm) => alarm.name);
            // chrome.storage.local.get(alarmNames, (result) => {
            //     console.log("alarmNames=>result:", result);
            //     setTasks(result); // Store tasks in state
            // });
        
    }, []);

    const handleAddClick = () => {
        setInitialAddTaskState("idle"); // IDLE state
        setShowAddTask(true);
    };

    const handleVoiceClick = () => {
        setInitialAddTaskState("voice"); // VOICE state
        setShowAddTask(true);
    };

    const handleOpenTask = (id) => {
        console.log("Opening task with ID:", id);
        if (chrome.storage && chrome.storage.local) {
            // Get a single task from storage using the alarm name (id)
            chrome.storage.local.get(id, (result) => {
                const task = result[id];
                console.log("alarmed task:", task);
                setSelectedTask(task);
            });
            console.log("Task retrieved:", result[id]);
        }
    };
    

    const retrieveAllTasks = async () => {
        let userId;
        await getUserId().then((userid) => {
            console.log("User ID on this page:", userid);
            userId = userid;
        });
        const tasks = await getUserTasks(userId);
        console.log("Retrieved Tasks", JSON.stringify(tasks));
        setRetrievedData(tasks);
    };

    return (
        <div id="home">
            {/* New Task Buttons */}
            <section className="new-task-buttons">
                <button className="btn" onClick={handleAddClick}>
                    <IoMdAdd /> Add
                </button>
                <button className="btn" onClick={handleVoiceClick}>
                    <FaMicrophone /> Add w/ Voice
                </button>
                <button
                    className="btn btn--secondary"
                    onClick={() => {
                        setShowAllTasks(true);
                        retrieveAllTasks();
                    }}
                >
                    All Tasks
                </button>
            </section>

            {/* Upcoming Tasks Section */}
            <section>
                <div className="task-section-header">
                    <h4 className="subtitle">UPCOMING TASKS</h4>
                    <p>{alarms.length} of {Object.keys(tasks).length}</p>
                </div>
                        {/* Today's Alarms Section */}
                                            <div>
                                                {alarms.map((alarm) => (
                                                    <div 
                                                        onClick={() => handleOpenTask(alarm.name)} 
                                                        key={alarm.name} 
                                                        style={{ marginBottom: '2px' }}
                                                    >
                                                        <AlarmList key={alarm.name} alarm={alarm} />
                                                    </div>
                                                ))}
                                            </div>
            </section>
            <section>
                <div className="task-section-header">
                    <h4 className="subtitle">UPCOMING TASKS</h4>
                    <p>{alarms.length} of {Object.keys(tasks).length}</p>
                </div>
                        {/* Upcoming Alarms Section */}
                                            <div>
                                                {alarms.map((alarm) => (
                                                    <div 
                                                        onClick={() => handleOpenTask(alarm.name)} 
                                                        key={alarm.name} 
                                                        style={{ marginBottom: '2px' }}
                                                    >
                                                        <AlarmList key={alarm.name} alarm={alarm} />
                                                    </div>
                                                ))}
                                            </div>
            </section>

                                    {/* Streaks Section */}
            <StreaksSection tasks={sample} onClick={handleOpenTask} />

            {/* Add Task Modal */}
            {showAddTask && (
                <AddTask
                    closeWindow={() => setShowAddTask(false)}
                    initialState={initialAddTaskState}
                />
            )}

            {/* All Tasks Modal */}
            {showAllTasks && (
                <AllTasks
                    allTasks={retrievedData}
                    closeWindow={() => setShowAllTasks(false)}
                    openTask={handleOpenTask}
                />
            )}

            {/* Task View Modal */}
            {selectedTask && (
                <TaskView
                task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
}

export default Home;