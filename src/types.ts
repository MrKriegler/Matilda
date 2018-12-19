export let DUMMY_TASK: TaskData;
export type TaskStatus = typeof DUMMY_TASK.status;
export type TaskType = typeof DUMMY_TASK.type;

export class TaskData {
  'id'?: string;
  'ref'?: string;
  'detail'?: string;
  'userId'?: string;
  'version': number;
  'enabled': boolean;
  'type':  ('quote' | 'installation' | 'repair' | 'deinstallation');
  'status':  ('new' | 'scheduled' | 'inprogress' | 'closed' | 'rescheduled' | 'deleted');
}
