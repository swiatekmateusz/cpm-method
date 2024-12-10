import {useState} from "react";
import FlowChart from "./Flow";
import {ITask} from "./types";
import {TasksForm} from "./Form";

export default function App() {
    const [userTasks, setUserTasks] = useState<ITask[]>([
        {name: "A", duration: 3, from: 1, to: 2},
        {name: "B", duration: 4, from: 2, to: 3},
        {name: "C", duration: 6, from: 2, to: 4},
        {name: "D", duration: 7, from: 3, to: 5},
        {name: "E", duration: 1, from: 5, to: 7},
        {name: "F", duration: 2, from: 4, to: 7},
        {name: "G", duration: 3, from: 4, to: 6},
        {name: "H", duration: 4, from: 6, to: 7},
        {name: "I", duration: 1, from: 7, to: 8},
        {name: "J", duration: 2, from: 8, to: 9},
    ]);

    return (
        <div>
            <div className="app">
                <div>
                    <TasksForm tasks={userTasks} setUserTasks={setUserTasks}/>
                </div>
                <div className="flow-chart-container">
                    <FlowChart tasks={userTasks}/>
                </div>
            </div>
        </div>
    );
}
