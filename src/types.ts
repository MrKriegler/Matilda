export let DUMMY_TASK: TaskData;
export type TaskStatus = typeof DUMMY_TASK.status;
export type TaskType = typeof DUMMY_TASK.type;

export class TaskData {
  'status'?:  ('new' | 'scheduled' | 'inprogress' | 'closed' | 'rescheduled' | 'deleted');
  'type':  ('quote' | 'installation' | 'repair' | 'deinstallation');
}
