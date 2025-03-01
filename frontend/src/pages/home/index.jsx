import React from 'react'
import TaskCard from '../../components/task-card'
import './index.css'
import './buttons.css'
import { IoMdAdd } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa6";

function Home() {
    return (
        <div id="home">
            <section className="new-task-buttons">
                <button class="btn"><IoMdAdd />Add</button>
                <button class="btn"><FaMicrophone />Add w/ Voice</button>
                <button class="btn btn--secondary">All Tasks</button>

            </section>
            <section>
                <h4 className='subtitle'>UPCOMING TASKS</h4>
                <div id="upcoming-tasks">
                    <TaskCard task={task} />
                    <TaskCard task={task} />
                    <TaskCard task={task} />
                </div>
            </section>
            <section>
                <h4 className='subtitle'>YOUR STREAK</h4>
            </section>
        </div>
    )
}

const task = {
    title: "Task 1",
    type: "task",
    dueDate: "2025-01-01",
    website: "https://www.google.com",
}
export default Home