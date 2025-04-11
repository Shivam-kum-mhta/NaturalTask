import React, { useState, useEffect } from 'react';
import './index.css';
import '../../styles/buttons.css';
import { IoMdAdd } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa6";
import { getUserId } from '../../getUserId/getUserId';
import { getUserTasks } from '../../db/getUserData';
import AddTask from '../add-task';
import AllTasks from '../all-tasks';
import TaskView from '../task-view';
import AlarmCard from './AlarmCard';
import StreaksSection from './streasksection';

function Home() {
    const [retrievedData, setRetrievedData] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showAllTasks, setShowAllTasks] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [initialAddTaskState, setInitialAddTaskState] = useState("idle");

    const [isSelectingAlarm, setisSelectingAlarm] = useState(false);
    const [todayAlarms, setTodayAlarms] = useState([]);
    const [upcomingAlarms, setUpcomingAlarms] = useState([]);

    // Fetch alarms and tasks on component mount
    useEffect(() => {
        if (typeof chrome === 'undefined' || typeof chrome.alarms === 'undefined') {
            console.error('Only accessible in Extension.');
            return;
        }

        chrome.alarms.getAll((alarmList) => {

            // Fetch corresponding tasks for each alarm
            const alarmNames = alarmList.map((alarm) => alarm.name);
            chrome.storage.local.get(alarmNames, (result) => {

                // Separate today's alarms and upcoming alarms
                const now = new Date();
                const today = alarmList.filter((alarm) => {
                    const task = result[alarm.name];
                    if (!task || !task.date) return false;
                    const taskDate = new Date(task.date);
                    return taskDate.toDateString() === now.toDateString();
                });

                const upcoming = alarmList.filter((alarm) => {
                    const task = result[alarm.name];
                    if (!task || !task.date) return false;
                    const taskDate = new Date(task.date);
                    return taskDate > now && taskDate.toDateString() !== now.toDateString();
                });

                setTodayAlarms(today);
                setUpcomingAlarms(upcoming);
            });
        });
    }, []);

    const handleAddClick = () => {
        setInitialAddTaskState("idle");
        setShowAddTask(true);
    };

    const handleVoiceClick = () => {
        setInitialAddTaskState("voice");
        setShowAddTask(true);
    };


    const handleOpenAlarm = (id) => {
        console.log("Opening alarm:", id);
        if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(id, (result) => {
                const task = result[id];
                console.log("Task of this alarm:", task);
                setisSelectingAlarm(true);
                setSelectedTask(task);
            });
            console.log("viewing this alarm:", id);
        }
    }
    const handleOpenTask = (id) => {
        console.log("Opening task:", id);
        retrievedData.forEach((task) => {
            if (task.title === id) {
                setSelectedTask(task);
                console.log("selected task:", task);
            }
        });
    };

    const retrieveAllTasks = async () => {
        let userId = await getUserId()
        const tasks = await getUserTasks(userId);
        console.log("Retrieved tasks:", tasks);
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

            {/* Today's Alarms Section */}
            <section>
                <div className="task-section-header">
                    <h4 className="subtitle">Today's Alarms</h4>
                    <p>{todayAlarms.length} tasks</p>
                </div>
                <div id="today-alarms" style={{ marginBottom: '2px' }}>
                    {todayAlarms.length === 0 ? (
                        <p>No alarms for today.</p>
                    ) : (
                        todayAlarms.map((alarm) => (
                            <div key={alarm.name} style={{ marginBottom: '2px' }}>
                                <AlarmCard
                                    alarm={alarm}
                                    clickOnTask={handleOpenAlarm}
                                />
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Upcoming Alarms Section */}
            <section>
                <div className="task-section-header">
                    <h4 className="subtitle">Upcoming Alarms</h4>
                    <p>{upcomingAlarms.length} tasks</p>
                </div>
                <div id="upcoming-alarms">
                    {upcomingAlarms.length === 0 ? (
                        <p>No upcoming alarms.</p>
                    ) : (
                        upcomingAlarms.map((alarm) => (
                            <div key={alarm.name} style={{ marginBottom: '2px' }}>
                                <AlarmCard
                                    alarm={alarm}
                                    clickOnTask={handleOpenAlarm}
                                />
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Streaks Section */}
            <StreaksSection tasks={retrievedData} onClick={handleOpenTask} />

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
                    isSelectingAlarm={isSelectingAlarm}
                    setisSelectingAlarm={setisSelectingAlarm}
                />
            )}

            {/* Task View Modal */}
            {selectedTask && (
                <TaskView
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    isSelectingAlarm={isSelectingAlarm}
                    setisSelectingAlarm={setisSelectingAlarm}
                />
            )}
        </div>
    );
}

export default Home;