import { TaskData } from '@matilda/src/types';
import { Router, Request, Response, NextFunction } from 'express';
import { TaskManager, ITaskManager } from '@matilda/src/states';
import { runRequest } from '@matilda/lib/common';

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
      this.router = Router();
      this.init();
      this.manager = new TaskManager();
  }

  public get = async (req: Request, res: Response, next: NextFunction) => {
    await runRequest(res,
      async () => new Date()
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

  /**
   * Take each handler, and attach to one of the Express.Router"s
   * endpoints.
   */
  init() {
    this.router.get("/:id", this.get);
    this.router.post("/", this.post);
    this.router.put("/:id", this.put);
  }
}

// Create the TaskController, and export its configured Express.Router
const controller = new TaskController();
const router = controller.router;

export default router;
