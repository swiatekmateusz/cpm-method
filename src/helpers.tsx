import dagre, { GraphLabel } from "dagre";
import { Edge, Node, MarkerType, Position } from "@xyflow/react";
import { IResolvedWithCP, ITask, ITaskReversed } from "./types";
import { borderColor, QuarterCircle } from "./components/QuarterCircle";

export const autoPositionNodes = (
  nodes: Node[],
  edges: Edge[],
  rankdir: GraphLabel["rankdir"] = "LR"
): Node[] => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setGraph({ rankdir });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: rankdir === "LR" ? 80 : 220,
      height: rankdir === "LR" ? 220 : 70,
    });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes: Node[] = nodes.map((node): Node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      sourcePosition: rankdir === "LR" ? Position.Right : Position.Bottom,
      targetPosition: rankdir === "LR" ? Position.Left : Position.Top,
      position: {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      },
    };
  });

  return newNodes;
};

export function resolveCPM(tasks: ITask[]): IResolvedWithCP {
  const allNodes = Array.from(
    new Set(tasks.flatMap((t) => [t.from, t.to]))
  ).sort((a, b) => a - b);

  const outgoing: Record<
    number,
    { to: number; duration: number; task: ITask }[]
  > = {};
  const incoming: Record<
    number,
    { from: number; duration: number; task: ITask }[]
  > = {};

  for (const node of allNodes) {
    outgoing[node] = [];
    incoming[node] = [];
  }

  for (const task of tasks) {
    outgoing[task.from].push({ to: task.to, duration: task.duration, task });
    incoming[task.to].push({ from: task.from, duration: task.duration, task });
  }

  const earliest: Record<number, number> = {};
  for (const node of allNodes) {
    earliest[node] = incoming[node].length === 0 ? 0 : -Infinity;
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const node of allNodes) {
      if (incoming[node].length > 0) {
        const newEarliest = Math.max(
          ...incoming[node].map((e) => earliest[e.from] + e.duration)
        );
        if (newEarliest > earliest[node]) {
          earliest[node] = newEarliest;
          changed = true;
        }
      }
    }
  }

  const endNodes = allNodes.filter((node) => outgoing[node].length === 0);
  const projectCompletionTime = Math.max(...endNodes.map((n) => earliest[n]));

  const latest: Record<number, number> = {};
  for (const node of allNodes) {
    latest[node] = endNodes.includes(node) ? projectCompletionTime : Infinity;
  }

  changed = true;
  while (changed) {
    changed = false;
    for (const node of allNodes.slice().reverse()) {
      if (outgoing[node].length > 0) {
        const newLatest = Math.min(
          ...outgoing[node].map((e) => latest[e.to] - e.duration)
        );
        if (newLatest < latest[node]) {
          latest[node] = newLatest;
          changed = true;
        }
      }
    }
  }

  const resolved = allNodes.map((node) => {
    const e = earliest[node];
    const l = latest[node];
    return {
      node,
      earliest: e,
      latest: l,
      slack: l - e,
    };
  });

  const criticalTasks = tasks.filter(
    (t) =>
      earliest[t.from] + t.duration === earliest[t.to] &&
      latest[t.from] + t.duration === latest[t.to]
  );

  const critOutgoing: Record<number, ITask[]> = {};
  const critIncomingCount: Record<number, number> = {};
  for (const node of allNodes) {
    critOutgoing[node] = [];
    critIncomingCount[node] = 0;
  }

  for (const ct of criticalTasks) {
    critOutgoing[ct.from].push(ct);
    critIncomingCount[ct.to] += 1;
  }

  const dist: Record<number, number> = {};
  const predecessors: Record<number, ITask[]> = {};
  for (const node of allNodes) {
    dist[node] = -Infinity;
    predecessors[node] = [];
  }

  for (const node of allNodes) {
    if (critIncomingCount[node] === 0 && critOutgoing[node].length > 0) {
      dist[node] = earliest[node];
    }
  }

  for (const node of allNodes) {
    for (const ct of critOutgoing[node]) {
      const alt = dist[node] + ct.duration;
      if (alt > dist[ct.to]) {
        dist[ct.to] = alt;
        predecessors[ct.to] = [ct];
      } else if (alt === dist[ct.to]) {
        predecessors[ct.to].push(ct);
      }
    }
  }

  let maxDist = -Infinity;
  const bestEndNodes: number[] = [];
  for (const eNode of endNodes) {
    if (dist[eNode] > maxDist) {
      maxDist = dist[eNode];
      bestEndNodes.length = 0;
      bestEndNodes.push(eNode);
    } else if (dist[eNode] === maxDist) {
      bestEndNodes.push(eNode);
    }
  }

  const criticalPaths: ITask[][] = [];

  function backtrack(node: number, path: ITask[]) {
    if (predecessors[node].length === 0) {
      criticalPaths.push(path.slice().reverse());
      return;
    }
    for (const predTask of predecessors[node]) {
      path.push(predTask);
      backtrack(predTask.from, path);
      path.pop();
    }
  }

  for (const endNode of bestEndNodes) {
    if (predecessors[endNode].length === 0 && dist[endNode] !== -Infinity) {
      criticalPaths.push([]);
    } else {
      backtrack(endNode, []);
    }
  }

  return { resolved, criticalPaths };
}
export function convertTasksToNodesAndEdges(tasks: ITask[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const uniqueNodeIds = new Set();

  const { criticalPaths, resolved } = resolveCPM(tasks);
  tasks.forEach((task) => {
    if (!uniqueNodeIds.has(task.from)) {
      const { earliest, latest, slack } =
        resolved.find((n) => n.node === task.from) || {};
      nodes.push({
        id: String(task.from),
        position: { x: 0, y: 0 },
        data: {
          label: (
            <QuarterCircle
              text1={`${task.from}`}
              text2={`${latest || 0}`}
              text3={`${earliest || 0}`}
              text4={`${slack || 0}`}
              isCritical={slack === 0 || false}
            />
          ),
        },
      });
      uniqueNodeIds.add(task.from);
    }
    if (!uniqueNodeIds.has(task.to)) {
      const { earliest, latest, slack } =
        resolved.find((n) => n.node === task.to) || {};
      nodes.push({
        id: String(task.to),
        position: { x: 0, y: 0 },
        data: {
          label: (
            <QuarterCircle
              text1={`${task.to}`}
              text2={`${latest || 0}`}
              text3={`${earliest || 0}`}
              text4={`${slack || 0}`}
              isCritical={slack === 0 || false}
            />
          ),
        },
      });
      uniqueNodeIds.add(task.to);
    }
    const inCriticalPath = criticalPaths.some((path) =>
      path.some((p) => p.name === task.name)
    );

    edges.push({
      id: `e${task.from}-${task.to}`,
      source: String(task.from),
      target: String(task.to),
      label: `${task.name} ${task.duration}`,
      className: inCriticalPath ? "red" : "",
      style: { stroke: inCriticalPath ? "red" : borderColor },
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: inCriticalPath ? "red" : borderColor,
        height: 15,
        width: 15,
      },
    });
  });

  return { nodes, edges };
}

export const getNodesSet = (nodes: ITask[]): number[] => {
  const allNodes = new Set<number>();
  nodes.forEach(({ from, to, duration }) => {
    if (from && to && duration) {
      allNodes.add(from);
      allNodes.add(to);
    }
  });
  return Array.from(allNodes);
};

export interface ITaskError {
  message: string;
  node?: number;
}

export function validateCPMNetwork(data: ITask[]): ITaskError[] {
  const errors: ITaskError[] = [];

  const graph: Map<number, number[]> = new Map();
  data.forEach(({ from, to }) => {
    if (!graph.has(from)) {
      graph.set(from, []);
    }
    graph.get(from)!.push(to);
  });

  const allNodes = new Set<number>();
  data.forEach(({ from, to }) => {
    allNodes.add(from);
    allNodes.add(to);
  });

  const visited = new Set<number>();
  const stack = new Set<number>();

  const hasCycle = (node: number): boolean => {
    if (stack.has(node)) {
      return true;
    }
    if (visited.has(node)) {
      return false;
    }
    visited.add(node);
    stack.add(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) {
        return true;
      }
    }
    stack.delete(node);
    return false;
  };

  for (const node of allNodes) {
    if (!visited.has(node)) {
      if (hasCycle(node)) {
        errors.push({
          node,
          message: `Graph contains a cycle involving node.`,
        });
        break;
      }
    }
  }

  const connectedNodes = new Set<number>();
  graph.forEach((targets, source) => {
    connectedNodes.add(source);
    targets.forEach((target) => connectedNodes.add(target));
  });

  allNodes.forEach((node) => {
    if (!connectedNodes.has(node)) {
      errors.push({
        message: `Node is disconnected from the graph.`,
        node,
      });
    }
  });

  const inDegree = new Map<number, number>();
  const outDegree = new Map<number, number>();

  allNodes.forEach((node) => {
    inDegree.set(node, 0);
    outDegree.set(node, 0);
  });

  data.forEach(({ from, to }) => {
    outDegree.set(from, (outDegree.get(from) || 0) + 1);
    inDegree.set(to, (inDegree.get(to) || 0) + 1);
  });

  const startNodes = Array.from(allNodes).filter(
    (node) => (inDegree.get(node) || 0) === 0
  );
  const endNodes = Array.from(allNodes).filter(
    (node) => (outDegree.get(node) || 0) === 0
  );

  if (startNodes.length !== 1) {
    startNodes.forEach((node, index) => {
      errors.push({
        message: `Starting node no. ${index + 1}`,
        node,
      });
    });
    errors.push({
      message: `Graph must have exactly one starting node. Found: ${startNodes.length}`,
    });
  }
  if (endNodes.length !== 1) {
    endNodes.forEach((node, index) => {
      errors.push({
        message: `Ending node no. ${index + 1}`,
        node,
      });
    });
    errors.push({
      message: `Graph must have exactly one ending node. Found: ${endNodes.length}`,
    });
  }

  return errors;
}

// export function convertDefaultToReversedTasks(tasks: ITask[]): ITaskReversed[] {
//   const tasksEndingAt: Record<number, ITask[]> = {};

//   for (const t of tasks) {
//     if (!tasksEndingAt[t.to]) {
//       tasksEndingAt[t.to] = [];
//     }
//     if (!tasksEndingAt[t.from]) {
//       tasksEndingAt[t.from] = [];
//     }
//   }

//   for (const t of tasks) {
//     if (!tasksEndingAt[t.to]) {
//       tasksEndingAt[t.to] = [];
//     }
//   }

//   for (const t of tasks) {
//     tasksEndingAt[t.to].push(t);
//   }

//   return tasks.map((t) => {
//     const predecessors = tasksEndingAt[t.from] || [];
//     const precedingNames = predecessors.map((p) => p.name);
//     return {
//       name: t.name,
//       duration: t.duration,
//       precedingNames,
//     };
//   });
// }

export const convertReversedTasksToNodesAndEdges = (tasks: ITaskReversed[]) => {
  return { nodes: [], edges: [] };
};

export const validateReversedCPMNetwork = (
  tasks: ITaskReversed[]
): ITaskError[] => {};
