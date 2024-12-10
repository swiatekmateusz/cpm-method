export interface ITask {
  name: string;
  duration: number;
  from: number;
  to: number;
}

export interface ITaskResolved {
  node: number;
  earliest: number;
  latest: number;
  slack: number;
}

export interface ITaskExtended extends ITask {
  earliestStart: number;
  earliestFinish: number;
  latestStart: number;
  latestFinish: number;
  slack: number;
}

export interface IResolvedWithCP {
  resolved: ITaskResolved[];
  criticalPaths: ITask[][];
  tasksWithTimes: ITaskExtended[];
}
