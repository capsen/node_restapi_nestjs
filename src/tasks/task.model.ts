export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'iN_PROGRESS',
  DONE = 'DONE',
}
