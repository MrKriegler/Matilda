import { Router, Request, Response, NextFunction } from 'express';
import { runRequest } from '@matilda/lib/common';

export class HealthController {
  router: Router;

  /**
   *  Initialize Controller
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    await runRequest(res,
      async () => new Date()
    );
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.get);
  }
}

// Create the HealthController, and export its configured Express.Router
const controller = new HealthController();
const router = controller.router;

export default router;
