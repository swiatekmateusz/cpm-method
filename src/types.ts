export interface ITask {
  name: string;
  duration: number;
  from: number;
  to: number;
}
export interface ITaskReversed {
  name: string;
  duration: number;
  precedingNames: string[];
};
export interface ITaskReversedForm {
  name: string;
  duration: number;
  precedingNames: string;
};
export interface ITaskResolved {
  node: number;
  earliest: number;
  latest: number;
  slack: number;
}

export interface IResolvedWithCP {
  resolved: ITaskResolved[];
  criticalPaths: ITask[][];
}