# Matilda

Task management API for service-based work -- plumbers, electricians, steel work, installations, etc.

Originally built in 2018, refreshed in 2026 with [Claude Code](https://claude.ai/claude-code).

## Getting started

```
npm install
docker-compose up -d
npm start
```

API runs on `http://localhost:3000`. Swagger docs at `/api/v1/docs`.

## Endpoints

| Method | Path | |
|--------|------|-|
| GET | /api/v1/tasks | List/filter/paginate tasks |
| POST | /api/v1/tasks | Create a task |
| GET | /api/v1/tasks/:id | Get a task |
| PUT | /api/v1/tasks/:id | Update fields or transition status |
| DELETE | /api/v1/tasks/:id | Soft delete |
| POST | /api/v1/tasks/:id/notes | Add a note |

### Task lifecycle

```
new → scheduled → inprogress → closed
         ↓              ↓
     rescheduled    rescheduled
         ↓              ↓
        new            new
```

Deletion is allowed from any non-terminal state. Closed and deleted tasks are immutable.

### Example: create and schedule

```json
POST /api/v1/tasks
{
  "type": "installation",
  "status": "new",
  "detail": "Boiler installation",
  "customer": { "name": "John Smith", "phone": "+44123456789" },
  "site": { "address": "10 Downing Street", "city": "London", "postcode": "SW1A 2AA" }
}
```

```json
PUT /api/v1/tasks/:id
{ "status": "scheduled", "version": 1, "userId": "user:id:1", "scheduledDate": "2026-05-15" }
```

## Auth

Pluggable. Three modes:

- **No config** -- dev mode, all requests pass through
- **`MATILDA_JWT_SECRET` set** -- JWT auth via `Authorization: Bearer <token>`
- **Custom** -- implement `IAuthProvider` and call `setAuthProvider()` before the server starts

```typescript
import { setAuthProvider, IAuthProvider } from './src/auth';

class MyAuth implements IAuthProvider {
  async authenticate(req) {
    // check session, OAuth token, API key, whatever
    return { id: 'user-123', name: 'Jane' };
  }
}

setAuthProvider(new MyAuth());
```

## Tests

```
npm run tests
```

Uses a separate `matilda_test` database. Needs MongoDB on `localhost:27017`.
