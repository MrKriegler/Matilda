import { Router, Request, Response, NextFunction } from 'express';
import { runRequest } from '@matilda/lib/common';

export class HealthController {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * @openapi
   * /health:
   *   get:
   *     tags: [Health]
   *     summary: Health check
   *     security: []
   *     responses:
   *       200:
   *         description: Server is running
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     date:
   *                       type: string
   *                       format: date-time
   */
  public async get(req: Request, res: Response, next: NextFunction) {
    await runRequest(res,
      async () => ({ date: new Date() })
    );
  }

  init() {
    this.router.get('/', this.get);
  }
}

const controller = new HealthController();
const router = controller.router;

export default router;
