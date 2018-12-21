import { TaskData } from '@matilda/src/types';
import { Router, Request, Response, NextFunction } from 'express';
import { TaskManager, ITaskManager } from '@matilda/src/states';

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
    res.status(200).json({ data: new Date() });
  }

  public post = async (req: Request, res: Response, next: NextFunction) => {
    const task = await this.manager.createTask({task: req.body})
    res.status(200).json({ data: task });
  }

  public put = async (req: Request, res: Response, next: NextFunction) => {
    console.log("UPDATING TASK!!!");
    const task = await this.manager.updateTask({task: req.body, id: req.params.id})
    res.status(200).json({ data: task });
  }

  /**
   * Take each handler, and attach to one of the Express.Router"s
   * endpoints.
   */
  init() {
    this.router.get("/", this.get);
    this.router.post("/", this.post);
    this.router.put("/:id", this.put);
  }
}

// Create the TaskController, and export its configured Express.Router
const controller = new TaskController();
const router = controller.router;

export default router;
