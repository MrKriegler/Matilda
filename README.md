# Matilda - (Work in progress)

Open source Task management software for service based work. i.e. Plumbers, Steal work, etc

## Code Samples

Coming soon

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

Delete Task (soft delete)

```json
DELETE /api/v1/tasks/id:task:1
```


## Installation
```
npm i
npm run
npm run tests
```
