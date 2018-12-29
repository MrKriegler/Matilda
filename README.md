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

To run the server locally use

```
npm run
```

## Running Tests

To run the e2e tests simply run

```
npm run tests
```

You can install [restlet_client](https://restlet.com/modules/client/) and import the `restclient.json` for the API collection.

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
PUT /api/v1/tasks/id:task:1
{
  "status": "new"
}
```

Get Task

```json
GET /api/v1/tasks/id:task:1
```

Delete Task (soft delete)

```json
DELETE /api/v1/tasks/id:task:1
```

