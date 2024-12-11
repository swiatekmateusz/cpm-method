import { Chart } from "react-google-charts";
import { ITask } from "./types";
import { resolveCPM } from "./helpers";
import { useState } from "react";

export function GranttChart({ tasks }: { tasks: ITask[] }) {
  const [metodDefault, setMetodDefault] = useState(false);

  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
    { type: "string", role: "tooltip", p: { html: true } },
  ];
  const { tasksWithTimes } = resolveCPM(tasks);
  const rows = tasksWithTimes.map((task) => [
    String(task.name),
    String(task.name),
    new Date(
      metodDefault ? task.latestStart * 1000 : task.earliestStart * 1000
    ),
    new Date(
      metodDefault ? task.latestFinish * 1000 : task.earliestFinish * 1000
    ),
    task.duration * 1000,
    100,
    tasks
      .filter((t) => t.to === task.from)
      .map((t) => t.name)
      .join(","),
   ' <div>JEBAC OCZKA</div>'
  ]);

  const data = [columns, ...rows];
  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          height: 500,
        }}
      >
        <Chart
          chartType="Gantt"
          width="100%"
          height="100%"
          data={data}
          options={{
            title: "London Olympics Medals",
            tooltip: { isHtml: true },
            gantt: {
              criticalPathEnabled: true,
              criticalPathStyle: {
                stroke: "red",
                strokeWidth: 5,
              },
            },
          }}
        />
      </div>
      <div className="checkbox-wrapper">
        <label>ASAP (as soon as possible)</label>
        <div className="checkbox-wrapper-25">
          <input
            type="checkbox"
            checked={metodDefault}
            onChange={() => {
              setMetodDefault((prev) => !prev);
            }}
          />
        </div>
        <label>ALAP (as late as possible)</label>
      </div>
    </div>
  );
}
