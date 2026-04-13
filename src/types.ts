export let DUMMY_TASK: TaskData;
export type TaskStatus = typeof DUMMY_TASK.status;
export type TaskType = typeof DUMMY_TASK.type;

export interface TaskCustomer {
  name: string;
  phone?: string;
  email?: string;
}

export interface TaskSite {
  address: string;
  city?: string;
  postcode?: string;
  notes?: string;
}

export interface TaskNote {
  text: string;
  author: string;
  createdAt: string;
}

export class TaskData {
  'id'?: string;
  'ref'?: string;
  'detail'?: string;
  'userId'?: string;
  'version': number;
  'enabled': boolean;
  'type':  ('quote' | 'installation' | 'repair' | 'deinstallation');
  'status':  ('created'| 'new' | 'scheduled' | 'inprogress' | 'closed' | 'rescheduled' | 'deleted');
  'createdAt'?: string;
  'updatedAt'?: string;
  'customer'?: TaskCustomer;
  'site'?: TaskSite;
  'scheduledDate'?: string;
  'completedAt'?: string;
  'notes'?: TaskNote[];
}

export enum TaskStatuses {
  CREATED = 'created',
  NEW = 'new',
  SCHEDULED = 'scheduled',
  INPROGRESS = 'inprogress',
  CLOSED = 'closed',
  RESCHEDULED = 'rescheduled',
  DELETED = 'deleted'
}

export enum TaskTypes {
  QUOTE = 'quote',
  INSTALLATION = 'installation',
  REPAIR = 'repair',
  DEINSTALLATION = 'deinstallation',
}

export interface GetTaskPayload {
  'id':  string;
}

export interface DeleteTaskPayload extends GetTaskPayload {
}

export interface CreateTaskPayload {
  'task': TaskData;
}

export interface UpdateTaskPayload {
  'id': string;
  'task': TaskData;
}

export interface ListTasksPayload {
  [name: string]: any;
}

export interface AddNotePayload {
  'id': string;
  'note': { text: string; author: string };
}
