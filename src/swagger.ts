import swaggerJsdoc from 'swagger-jsdoc';
import * as config from '@matilda/lib/config.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Matilda',
      version: '1.0.0',
      description: 'Task management API for service-based work',
    },
    servers: [
      { url: `/${config.api.base}/${config.api.version}` }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Set MATILDA_JWT_SECRET to enable. In dev mode, auth is bypassed.'
        }
      },
      schemas: {
        TaskCustomer: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'John Smith' },
            phone: { type: 'string', example: '+44123456789' },
            email: { type: 'string', example: 'john@example.com' }
          }
        },
        TaskSite: {
          type: 'object',
          required: ['address'],
          properties: {
            address: { type: 'string', example: '10 Downing Street' },
            city: { type: 'string', example: 'London' },
            postcode: { type: 'string', example: 'SW1A 2AA' },
            notes: { type: 'string', example: 'Gate code 1234' }
          }
        },
        TaskNote: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            author: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'mid:task:1' },
            ref: { type: 'string', example: 'MAT-00001' },
            type: { type: 'string', enum: ['quote', 'installation', 'repair', 'deinstallation'] },
            status: { type: 'string', enum: ['new', 'scheduled', 'inprogress', 'closed', 'rescheduled', 'deleted'] },
            detail: { type: 'string', example: 'Boiler installation' },
            userId: { type: 'string', example: 'user:id:1' },
            version: { type: 'integer', example: 1 },
            enabled: { type: 'boolean' },
            customer: { $ref: '#/components/schemas/TaskCustomer' },
            site: { $ref: '#/components/schemas/TaskSite' },
            scheduledDate: { type: 'string', format: 'date', example: '2026-05-15' },
            completedAt: { type: 'string', format: 'date-time' },
            notes: { type: 'array', items: { $ref: '#/components/schemas/TaskNote' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            status: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
