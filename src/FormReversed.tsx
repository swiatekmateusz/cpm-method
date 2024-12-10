import { FieldArray, Form, Formik, useFormikContext } from "formik";
import { validateReversedCPMNetwork } from "./helpers";
import { ITaskReversed, ITaskReversedForm } from "./types";
import { FormikInput } from "./components/FormikInput";
import { NodesSidebar } from "./NodesSidebar";

export const TasksReversedForm = ({
  tasks,
  setUserTasks,
}: {
  tasks: ITaskReversed[];
  setUserTasks: (values: ITaskReversed[]) => void;
}) => {
  const onValidate = (values: { tasks: ITaskReversedForm[] }) => {
    const reversedTasks = values.tasks.map((task) => ({
      name: task.name,
      duration: task.duration,
      precedingNames: task.precedingNames.split(",").map((name) => name.trim()),
    }));
    const errors = validateReversedCPMNetwork(reversedTasks);
    if (errors?.length) return { tasks: errors };
    setUserTasks(reversedTasks);
  };
  return (
    <div>
      <Formik
        initialValues={{
          tasks: tasks.length
            ? tasks.map((task) => ({
                name: task.name,
                duration: task.duration,
                precedingNames: task.precedingNames.join(","),
              }))
            : [
                {
                  name: "A",
                  duration: 1,
                  precedingNames: "",
                },
              ],
        }}
        validate={onValidate}
        onSubmit={() => {}}
      >
        {() => <TasksFormInner />}
      </Formik>
    </div>
  );
};

const TasksFormInner = () => {
  const { values } = useFormikContext<{ tasks: ITaskReversed[] }>();
  // const generalErrors = (errors?.tasks as ITaskReversed[])?.filter(
  //   (error) => !error.node
  // );
  // const nodesArray = getNodesSet(values.tasks);
  return (
    <div className="form-wrapper">
      <Form className="form">
        <h2>Tasks</h2>
        <FieldArray name="tasks">
          {({ remove, push }) => (
            <div>
              {values.tasks.map((_, index) => (
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
                      name={`tasks[${index}].precedingNames`}
                      label={index === 0 ? "Prev" : ""}
                    />
                    <button
                      type="button"
                      className="button-36 small"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  </div>
                  {/* {values.tasks.filter(
                    (t) =>
                      t.from === task.from && t.to === task.to && t.from && t.to
                  ).length > 1 && (
                    <div key={index} className="error">
                      Duplicated job, taking first one
                    </div>
                  )}
                  {(!task.to || !task.from || !task.duration) && (
                    <div key={index} className="error">
                      Fill all fields, meanwhile ignoring
                    </div>
                  )} */}
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
      <NodesSidebar generalErrors={[]} nodesArray={[]} getErrors={() => []} />
    </div>
  );
};
