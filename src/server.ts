import * as config from '@matilda/lib/config.json';
import { configureMongoStores } from '@matilda/lib/common';
import { TaskMongoStore } from '@matilda/src/stores';
import { authMiddleware } from '@matilda/src/auth';
import { swaggerSpec } from '@matilda/src/swagger';

import express from 'express';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';

import HealthController from '@matilda/src/controllers/HealthController';
import TaskController from '@matilda/src/controllers/TaskController';

const baseRoute = `/${config.api.base}/${config.api.version}`;

class Server {
    public express: express.Application;

    /**
     * Initialize server
     */
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.errorHandler();
        this.database();
    }

    /**
     * Configure database.
     */
    private database(): void {
      configureMongoStores().then(async () => {
        const store = new TaskMongoStore();
        await store.ensureIndexes();
      });
    }

    /**
     * Configure Express middleware.
     */
    private middleware(): void {
        this.express.use(logger(config.logger.level));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
    }

    /**
     * Configure API endpoints.
     */
    private routes(): void {
        this.express.use(`${baseRoute}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        this.express.use(`${baseRoute}/health`, HealthController);
        this.express.use(`${baseRoute}/tasks`, authMiddleware, TaskController);
    }

    /**
     * Configure error handling.
     */
    private errorHandler(): void {
        this.express.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (err.type === 'entity.parse.failed') {
                return res.status(400).json({ statusCode: 400, status: 'E-INVALID', message: 'Invalid JSON' });
            }
            return res.status(500).json({ statusCode: 500, status: 'E-OTHER', message: 'Internal server error' });
        });
    }
}

export default new Server().express;
