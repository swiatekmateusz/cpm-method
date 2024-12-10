import { Formik, Form, FieldArray, useFormikContext } from "formik";
import { ITask } from "./types";
import { validateCPMNetwork, getNodesSet, ITaskError } from "./helpers";
import { NodesSidebar } from "./NodesSidebar";
import { FormikInput } from "./components/FormikInput";

export const TasksForm = ({
  tasks,
  setUserTasks,
}: {
  tasks: ITask[];
  setUserTasks: (values: ITask[]) => void;
}) => {
  const validateForm = (values: { tasks: ITask[] }) => {
    const errors = validateCPMNetwork(
      values.tasks.filter((task) => task.from && task.to)
    );
    if (errors?.length) return { tasks: errors };
    setUserTasks(
      values.tasks.filter((task) => task.from && task.to && task.duration)
    );
  };

  return (
    <Formik
      initialValues={{
        tasks: tasks.length
          ? tasks
          : [
              {
                name: "A",
                duration: 1,
                from: 1,
                to: 2,
              },
            ],
      }}
      validate={validateForm}
      onSubmit={() => {}}
    >
      {() => <TasksFormInner />}
    </Formik>
  );
};

const TasksFormInner = () => {
  const { values, errors } = useFormikContext<{ tasks: ITask[] }>();
  const generalErrors = (errors?.tasks as ITaskError[])?.filter(
    (error) => !error.node
  );
  const nodesArray = getNodesSet(values.tasks);
  return (
    <div>
      <div className="form-wrapper">
        <Form className="form">
          <h2>Tasks</h2>
          <FieldArray name="tasks">
            {({ remove, push }) => (
              <div>
                {values.tasks.map((task, index) => (
                  <div key={index}>
                    <div className="form-row">
                      <FormikInput
                        name={`tasks[${index}].name`}
                        label={index === 0 ? "Name" : ""}
                        disabled
                      />
                      <FormikInput
                        name={`tasks[${index}].duration`}
                        label={index === 0 ? "Duration" : ""}
                        type="number"
                      />
                      <FormikInput
                        name={`tasks[${index}].from`}
                        label={index === 0 ? "From" : ""}
                        type="number"
                      />
                      <FormikInput
                        name={`tasks[${index}].to`}
                        label={index === 0 ? "To" : ""}
                        type="number"
                      />
                      <button
                        type="button"
                        className="button-36 small"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    </div>
                    {values.tasks.filter(
                      (t) =>
                        t.from === task.from &&
                        t.to === task.to &&
                        t.from &&
                        t.to
                    ).length > 1 && (
                      <div key={index} className="error">
                        Duplicated job, taking first one
                      </div>
                    )}
                    {(!task.to || !task.from || !task.duration) && (
                      <div key={index} className="error">
                        Fill all fields, meanwhile ignoring
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="button-36"
                  style={{ width: "100%" }}
                  onClick={() =>
                    push({
                      name: String.fromCharCode(
                        Math.max(
                          ...values.tasks.map((task) => task.name.charCodeAt(0))
                        ) + 1
                      ),
                      duration: 0,
                      from: 0,
                      to: 0,
                    })
                  }
                >
                  Add Task
                </button>
              </div>
            )}
          </FieldArray>
        </Form>
      </div>
      <NodesSidebar
        generalErrors={generalErrors}
        nodesArray={nodesArray}
        getErrors={(node) =>
          (errors?.tasks as ITaskError[])?.filter(
            (error) => error.node === node
          )
        }
      />
    </div>
  );
};
