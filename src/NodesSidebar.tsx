import Tooltip from "rc-tooltip";
import { ITaskError } from "./helpers";
import "rc-tooltip/assets/bootstrap_white.css";
export const NodesSidebar = ({
  nodesArray,
  getErrors,
}: {
  generalErrors: ITaskError[];
  nodesArray: number[];
  getErrors: (node: number) => ITaskError[];
}) => {
  return (
    <div style={{ margin: "1rem" }}>
      <h2>Nodes</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {nodesArray?.map((node, index) => (
          <div className="node-wrapper" key={index}>
            {getErrors(node)?.length ? (
              <Tooltip
                placement="bottom"
                overlay={
                  <div>
                    {getErrors(node)?.map((error, index) => (
                      <div key={index} className="error">
                        {error.message}
                      </div>
                    ))}
                  </div>
                }
              >
                <div className="node-preview node-preview-error">{node}</div>
              </Tooltip>
            ) : (
              <div className="node-preview">{node}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
