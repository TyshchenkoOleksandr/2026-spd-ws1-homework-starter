# Evidence: TASK-7 whole-hours

<!-- Raw outputs, not a summary. This file was committed after the commit it names. -->

- Revision: `cbf13ab66ec5a6481a4adc645ea099f11a8f4681` (`git rev-parse HEAD` before this file was written)
- Ran: 2026-11-27T08:36:16Z, macOS 15.6.1 (arm64), Node v24.15.0
- Who ran it: Claude Code (claude-sonnet-5-5), driven by @TyshchenkoOleksandr

## `npm test`

```text

> ws1-homework-starter@0.1.0 test
> vitest run


 RUN  v5.1.0 /Users/oleksandrtyshhenko/orca/2026-spd-ws1-homework-starter


 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  10:36:14
   Duration  253ms (tests 41%, import 30%, transform 17%, worker 12%)

```

Exit code: 0

## `npm run typecheck`

```text

> ws1-homework-starter@0.1.0 typecheck
> tsc --noEmit

```

Exit code: 0

## `POST /api/tasks` by hand (production server)

The unit tests do not call the route. These calls show the status codes. Commands: `npx next build`, then `npx next start -p 3000`, then the `curl` lines below. `npm run dev` does not start in the sandbox (FSEvent stream error), so the production server ran instead. Server output ended with `Ready in 107ms`.

```text
$ curl -s -X POST localhost:3000/api/tasks -H 'content-type: application/json' -d '{"title":"api check 1","estimateHours":1}'
{"id":1,"title":"api check 1","status":"todo","assignee":null,"estimateHours":1,"createdAt":"2026-11-27T08:30:50.301Z"}
HTTP 201
$ curl -s -X POST localhost:3000/api/tasks -H 'content-type: application/json' -d '{"title":"api check 40","estimateHours":40}'
{"id":2,"title":"api check 40","status":"todo","assignee":null,"estimateHours":40,"createdAt":"2026-11-27T08:30:50.315Z"}
HTTP 201
$ curl -s -X POST localhost:3000/api/tasks -H 'content-type: application/json' -d '{"title":"api check none"}'
{"id":3,"title":"api check none","status":"todo","assignee":null,"estimateHours":null,"createdAt":"2026-11-27T08:30:50.330Z"}
HTTP 201
$ curl -s -X POST localhost:3000/api/tasks -H 'content-type: application/json' -d '{"title":"api check 1.5","estimateHours":1.5}'
{"error":"estimateHours must be a whole number 1..40"}
HTTP 422
$ curl -s -X POST localhost:3000/api/tasks -H 'content-type: application/json' -d '{"title":"api check string 3","estimateHours":"3"}'
{"error":"estimateHours must be a whole number 1..40"}
HTTP 422
$ curl -s -X POST localhost:3000/api/tasks -H 'content-type: application/json' -d '{"title":"api check abc","estimateHours":"abc"}'
{"error":"estimateHours must be a whole number 1..40"}
HTTP 422
$ curl -s -X POST localhost:3000/api/tasks -H 'content-type: application/json' -d '{"title":"api check 0","estimateHours":0}'
{"error":"estimateHours must be a whole number 1..40"}
HTTP 422
$ curl -s -X POST localhost:3000/api/tasks -H 'content-type: application/json' -d '{"title":"api check 41","estimateHours":41}'
{"error":"estimateHours must be a whole number 1..40"}
HTTP 422
```

Expected and seen: 201 for `1`, `40` and a missing field (`estimateHours` is `null`). 422 with `estimateHours must be a whole number 1..40` for `1.5`, `"3"`, `"abc"`, `0` and `41`.

## Not verified

- No automated test calls the route handler. The 422 and 201 codes come from the manual calls above.
- The `trace gate` workflow was not run here. Its red run is in the PR checks.
- No human reviewed the change.
