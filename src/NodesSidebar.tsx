import { ITaskError } from "./helpers";

export const NodesSidebar = ({
  generalErrors,
  nodesArray,
  getErrors,
}: {
  generalErrors: ITaskError[];
  nodesArray: number[];
  getErrors: (node: number) => ITaskError[];
}) => {
  return (
    <div>
      <h2>Available nodes</h2>
      {generalErrors?.map((error, index) => (
        <div key={index} className="error error-general">
          {error.message}
        </div>
      ))}
      {nodesArray?.map((node, index) => (
        <div className="node-wrapper" key={index}>
          <div className="node-preview">{node}</div>
          <div>
            {getErrors(node)?.map((error, index) => (
              <div key={index} className="error">
                {error.message}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
