import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  OnConnect,
  Panel,
  Background,
  ReactFlowInstance,
  Controls,
  Node,
  Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/base.css";
import { autoPositionNodes, convertReversedTasksToNodesAndEdges, convertTasksToNodesAndEdges } from "./helpers";
import { DownloadButton } from "./components/DownloadButton";
import { ITask, ITaskReversed } from "./types";

export default function FlowChart({
  tasks,
}: {
  tasks: ITask[] | ITaskReversed[];
}) {
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const [direction, setDirection] = useState<"TB" | "LR">("LR");

  useEffect(() => {
    if (tasks?.length) {
      const { edges: initialEdges, nodes: initialNodes } =
        "precedingNames" in tasks[0]
          ? convertReversedTasksToNodesAndEdges(tasks as ITaskReversed[])
          : convertTasksToNodesAndEdges(tasks as ITask[]);
      if (initialEdges) setEdges(initialEdges);
      if (initialNodes && initialEdges)
        setNodes(autoPositionNodes(initialNodes, initialEdges));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      contentEditable={false}
      fitView
      onInit={(instance) => setReactFlowInstance(instance)}
      nodesConnectable={false}
    >
      <Panel>
        <button
          className="button-36"
          onClick={() => {
            setNodes(autoPositionNodes(nodes, edges, direction));
          }}
        >
          Reset position
        </button>
        <button
          className="button-36"
          onClick={async () => {
            await reactFlowInstance?.fitView();
          }}
        >
          Fit to view
        </button>
        <button
          className="button-36"
          onClick={async () => {
            setNodes(
              autoPositionNodes(nodes, edges, direction === "LR" ? "TB" : "LR")
            );
            setDirection(direction === "LR" ? "TB" : "LR");
            setTimeout(() => reactFlowInstance?.fitView(), 1);
          }}
        >
          Change direction to {direction === "TB" ? "left-right" : "top-bottom"}
        </button>
        <DownloadButton />
      </Panel>
      <Controls showFitView={false} />

      <Background />
    </ReactFlow>
  );
}
