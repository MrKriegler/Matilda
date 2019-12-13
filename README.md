# Matilda - (Work in progress)

Open source Task management software for service based work. i.e. Plumbers, Steal work, etc

### Directory layout
    .
    ├── dist                    # Compiled files
    ├── db_migrations           # To be run for db setup
    ├── lib                     # Library files
    ├── src                     # Source files
    ├── tests                   # Automated tests
    ├── tools                   # Tools and utilities
    └── README.md

## Installation

Installation is simple just run

```
npm i
```

If you do not have a local instance of mongoDB running then run `docker-compose up -d`.

Connect your mongo db instance `localhost:27017` and run the code in `db_migrations/init_collection.js` on your mongodb shell.

To run the server locally use

```
npm start
```

## Current endpoints

Create Task

```json
POST /api/v1/tasks
{
  "type": "quote",
  "status": "new",
  "detail": "Test task",
  "version": 1
}
```

Update Task State

```json
PUT /api/v1/tasks/:id
{
  "status": "new"
}
```

Get Task

```json
GET /api/v1/tasks/:id
```

Delete Task (soft delete)

```json
DELETE /api/v1/tasks/:id
```

