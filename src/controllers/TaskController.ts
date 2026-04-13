import { runRequest } from '@matilda/lib/common';
import { TaskManager, ITaskManager } from '@matilda/src/managers';
import { TaskTypes } from '@matilda/src/types';
import { Router, Request, Response, NextFunction } from 'express';

const VALID_TYPES = Object.values(TaskTypes);

export class TaskController {
  router: Router;
  manager: ITaskManager;

  constructor() {
    this.manager = new TaskManager();
    this.router = Router();
    this.init();
  }

  /**
   * @openapi
   * /tasks:
   *   get:
   *     tags: [Tasks]
   *     summary: List tasks
   *     description: Returns a filtered, sorted, paginated list of active tasks.
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [new, scheduled, inprogress, closed, rescheduled]
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [quote, installation, repair, deinstallation]
   *       - in: query
   *         name: userId
   *         schema:
   *           type: string
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *         description: Field to sort by (e.g. createdAt, scheduledDate)
   *       - in: query
   *         name: dir
   *         schema:
   *           type: integer
   *           enum: [1, -1]
   *         description: Sort direction (1 = ascending, -1 = descending)
   *       - in: query
   *         name: skip
   *         schema:
   *           type: integer
   *           default: 0
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *     responses:
   *       200:
   *         description: List of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     tasks:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Task'
   *                     total:
   *                       type: integer
   */
  public list = async (req: Request, res: Response, next: NextFunction) => {
    await runRequest(res,
      async () => await this.manager.listTasks(req.query)
    );
  }

  /**
   * @openapi
   * /tasks/{id}:
   *   get:
   *     tags: [Tasks]
   *     summary: Get a task by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         example: mid:task:1
   *     responses:
   *       200:
   *         description: Task found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  public get = async (req: Request, res: Response, next: NextFunction) => {
    await runRequest(res,
      async () => await this.manager.getTask({id: req.params.id})
    );
  }

  /**
   * @openapi
   * /tasks:
   *   post:
   *     tags: [Tasks]
   *     summary: Create a task
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [type, status]
   *             properties:
   *               type:
   *                 type: string
   *                 enum: [quote, installation, repair, deinstallation]
   *               status:
   *                 type: string
   *                 enum: [new]
   *               detail:
   *                 type: string
   *                 example: Boiler installation
   *               customer:
   *                 $ref: '#/components/schemas/TaskCustomer'
   *               site:
   *                 $ref: '#/components/schemas/TaskSite'
   *     responses:
   *       200:
   *         description: Task created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  public post = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    if (!body || !body.type || !body.status) {
      return res.status(400).json({ statusCode: 400, status: 'E-INVALID', message: 'type and status are required' });
    }
    if (VALID_TYPES.indexOf(body.type) === -1) {
      return res.status(400).json({ statusCode: 400, status: 'E-INVALID', message: `Invalid task type: ${body.type}` });
    }
    if (body.customer && !body.customer.name) {
      return res.status(400).json({ statusCode: 400, status: 'E-INVALID', message: 'customer.name is required' });
    }
    if (body.site && !body.site.address) {
      return res.status(400).json({ statusCode: 400, status: 'E-INVALID', message: 'site.address is required' });
    }
    await runRequest(res,
      async () => await this.manager.createTask({task: body})
    );
  }

  /**
   * @openapi
   * /tasks/{id}:
   *   put:
   *     tags: [Tasks]
   *     summary: Update a task
   *     description: |
   *       Updates task fields and/or transitions to a new status.
   *       Include the current `version` for optimistic locking.
   *
   *       Allowed transitions:
   *       - new → scheduled (requires scheduledDate)
   *       - scheduled → inprogress, rescheduled
   *       - inprogress → closed, rescheduled
   *       - rescheduled → scheduled
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [status, version]
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [new, scheduled, inprogress, closed, rescheduled]
   *               version:
   *                 type: integer
   *               detail:
   *                 type: string
   *               userId:
   *                 type: string
   *                 description: Assigned technician
   *               scheduledDate:
   *                 type: string
   *                 format: date
   *                 example: '2026-05-15'
   *               customer:
   *                 $ref: '#/components/schemas/TaskCustomer'
   *               site:
   *                 $ref: '#/components/schemas/TaskSite'
   *     responses:
   *       200:
   *         description: Task updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         description: Validation or invalid transition
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Task not found
   *       409:
   *         description: Concurrent modification conflict
   */
  public put = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    if (!body || !body.status) {
      return res.status(400).json({ statusCode: 400, status: 'E-INVALID', message: 'status is required' });
    }
    if (!body.version) {
      return res.status(400).json({ statusCode: 400, status: 'E-INVALID', message: 'version is required' });
    }
    if (body.scheduledDate && !/^\d{4}-\d{2}-\d{2}$/.test(body.scheduledDate)) {
      return res.status(400).json({ statusCode: 400, status: 'E-INVALID', message: 'scheduledDate must be in YYYY-MM-DD format' });
    }
    await runRequest(res,
      async () => await this.manager.updateTask({task: body, id: req.params.id})
    );
  }

  /**
   * @openapi
   * /tasks/{id}:
   *   delete:
   *     tags: [Tasks]
   *     summary: Delete a task (soft delete)
   *     description: Moves the task to deleted status. Cannot delete closed tasks.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task deleted
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         description: Cannot delete from current state
   *       404:
   *         description: Task not found
   */
  public delete = async (req: Request, res: Response, next: NextFunction) => {
    await runRequest(res,
      async () => await this.manager.deleteTask({id: req.params.id})
    );
  }

  /**
   * @openapi
   * /tasks/{id}/notes:
   *   post:
   *     tags: [Tasks]
   *     summary: Add a note to a task
   *     description: Appends a timestamped note. Author is set from the authenticated user. Allowed on all non-deleted tasks.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [text]
   *             properties:
   *               text:
   *                 type: string
   *                 example: Found corrosion on the main pipe
   *     responses:
   *       200:
   *         description: Note added, returns updated task
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         description: Validation error or task is deleted
   *       404:
   *         description: Task not found
   */
  public addNote = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    if (!body || !body.text) {
      return res.status(400).json({ statusCode: 400, status: 'E-INVALID', message: 'text is required' });
    }
    await runRequest(res,
      async () => await this.manager.addNote({ id: req.params.id, note: { text: body.text, author: req.user!.id } })
    );
  }

  init() {
    this.router.get('/', this.list);
    this.router.get('/:id', this.get);
    this.router.post('/', this.post);
    this.router.put('/:id', this.put);
    this.router.delete('/:id', this.delete);
    this.router.post('/:id/notes', this.addNote);
  }
}

const controller = new TaskController();
const router = controller.router;

export default router;
