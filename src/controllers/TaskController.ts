import { TaskData } from '@matilda/src/types';
import { Router, Request, Response, NextFunction } from "express";

export class TaskController {
  router: Router;

  /**
   *  Initialize Controller
   */
  constructor() {
      this.router = Router();
      this.init();
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ data: new Date() });
  }

  public async post(req: Request, res: Response, next: NextFunction) {
    let taskData: TaskData = {
      type: 'installation',
      status: 'new',
      detail: 'Test task',
      version: 1,
      enabled: true,
      ref: 'ref',
      id: 'aasdasd'
    };
    res.status(200).json({ data: taskData });
  }

  /**
   * Take each handler, and attach to one of the Express.Router"s
   * endpoints.
   */
  init() {
    this.router.get("/", this.get);
    this.router.post("/", this.post);
  }
}

// Create the TaskController, and export its configured Express.Router
const controller = new TaskController();
const router = controller.router;

export default router;
