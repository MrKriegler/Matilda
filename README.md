# Matilda - (Work in progress)

Open source Task management software for service based work. i.e. Plumbers, Steal work, etc

## Code Samples

Coming soon

## Current endpoints

Create Task

```json
POST http://localhost:3000/api/v1/tasks
{
  "type": "quote",
  "status": "new",
  "detail": "Test task",
  "version": 1,
  "enabled": true  
}
```

Update Task State

```json
PUT http://localhost:3000/api/v1/tasks/id:task:1
{
  "status": "new"
}
```


## Installation
```
npm i
npm run
npm run tests
```
