import { QuarterCircle } from "./components/QuarterCircle";

export const Explanation = () => {
  return (
    <div
      style={{
        padding: "1rem",
      }}
    >
      <p>
        <strong>CPM (Critical Path Method)</strong> is a management technique
        used to determine the amount of time necessary to complete a project.
        The technique is used to identify the longest sequence of tasks that
        must be completed on time to ensure the project is completed by a
        certain deadline.
      </p>
      <p>
        The <strong>critical path</strong> is the sequence of tasks that takes
        the longest time to complete.
      </p>
      <h2>Diagram explanation</h2>
      <h3>Node</h3>
      <div
        style={{
          display: "flex",
        }}
      >
        <div className="big-quater">
          <QuarterCircle
            text1={<div>t</div>}
            text2={
              <div>
                t<sup>0</sup>
                <sub>j</sub>
              </div>
            }
            text3={
              <div>
                t<sup>1</sup>
                <sub>j</sub>
              </div>
            }
            text4={
              <div>
                L<sub>j</sub>
              </div>
            }
          />
        </div>
        <div
          style={{
            marginLeft: "1rem",
          }}
        >
          <p>Where:</p>
          <ul>
            <li>
              <strong>t</strong> - Node identifier
            </li>
            <li>
              <strong>
                t<sup>0</sup>
                <sub>j</sub>
              </strong>{" "}
              - earliest start time
            </li>
            <li>
              <strong>
                t<sup>1</sup>
                <sub>j</sub>
              </strong>{" "}
              - latest start time
            </li>
            <li>
              <strong>
                L<sub>j</sub>
              </strong>{" "}
              - slack time (latest start time - earliest start time)
            </li>
          </ul>
        </div>
      </div>
      <h3>Activity (task)</h3>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            borderBottom: "2px dashed black",
            position: "relative",
            width: "50%",
            height: 2,
            margin: "3rem 1rem 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-0.3rem",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              padding: "0 0.5rem",
              whiteSpace: "nowrap",
            }}
          >
            <strong>N D</strong>
          </div>
        </div>
        <div>
          <p>Where:</p>
          <ul>
            <li>
              <strong>N</strong> - activity name
            </li>
            <li>
              <strong>D</strong> - duration
            </li>
          </ul>
        </div>
      </div>
      <p
        style={{
          color: "red",
        }}
      >
        Critical path is marked with red color, the nodes and activity lines.
      </p>
      <h2>App rules</h2>
      <p>
        You can add tasks by clicking the <strong>"Add task"</strong> button.
        The task will be added to the end of the list.
        <br /> You can remove tasks by clicking the <strong>
          "Remove"
        </strong>{" "}
        button next to the task.
      </p>
      <p>
        <strong>Diagram is being updated after each change</strong> in the tasks
        list. The diagram shows the nodes and the activities between them.
      </p>
      <p>
        If there is{" "}
        <strong>validation error, diagram will not be updated</strong> and the
        error will be shown in the tasks list or at nodes list.
        <br />
        If nodes are <strong>duplicated</strong>, the first one will be taken.
      </p>
      <p>
        The app will <strong>automatically calculate the critical path</strong>{" "}
        and show it in red.
      </p>
    </div>
  );
};
