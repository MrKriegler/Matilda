import { runRequest } from '@matilda/lib/common';
import { TaskManager, ITaskManager } from '@matilda/src/managers';
import { Router, Request, Response, NextFunction } from 'express';

/*
* Class methods use arrow methods for 'this' fix
* https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript
*/

export class TaskController {
  router: Router;
  manager: ITaskManager;

  /**
   *  Initialize Controller
   */
  constructor() {
    this.manager = new TaskManager();
    this.router = Router();
    this.init();
  }

  public get = async (req: Request, res: Response, next: NextFunction) => {
    await runRequest(res,
      async () => await this.manager.getTask({id: req.params.id})
    );
  }

  public post = async (req: Request, res: Response, next: NextFunction) => {
    await runRequest(res,
      async () => await this.manager.createTask({task: req.body})
    );
  }

  public put = async (req: Request, res: Response, next: NextFunction) => {
    await runRequest(res,
      async () => await this.manager.updateTask({task: req.body, id: req.params.id})
    );
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    await runRequest(res,
      async () => await this.manager.deleteTask({id: req.params.id})
    );
  }

  /**
   * Take each handler, and attach to one of the Express.Router"s
   * endpoints.
   */
  init() {
    this.router.get("/:id", this.get);
    this.router.post("/", this.post);
    this.router.put("/:id", this.put);
    this.router.delete("/:id", this.delete);
  }
}

// Create the TaskController, and export its configured Express.Router
const controller = new TaskController();
const router = controller.router;

export default router;
