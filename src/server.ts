import * as bodyParser from 'body-parser';
import * as config from '@matilda/lib/config.json';
import { configureMongoStores } from '@matilda/lib/common';

import express from 'express';
import logger from 'morgan';

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
        this.database();
    }

    /**
     * Configure database.
     */
    private database(): void {
      configureMongoStores();
    }

    /**
     * Configure Express middleware.
     */
    private middleware(): void {
        this.express.use(logger(config.logger.level));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    /**
     * Configure API endpoints.
     */
    private routes(): void {
        this.express.use(`${baseRoute}/health`, HealthController);
        this.express.use(`${baseRoute}/tasks`, TaskController);
    }
}

export default new Server().express;
