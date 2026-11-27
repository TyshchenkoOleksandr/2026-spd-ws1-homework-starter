# Spec: TASK-7 Estimates in whole hours

Ticket: `docs/tickets/TASK-7.md`

Status: approved. The approval is in the last section.

## Behavior

If `estimateHours` is present, it must be a whole number from 1 to 40. Any other value is a rule violation.

- `createTask` in `lib/tasks.ts` throws `RuleViolation` with the message `estimateHours must be a whole number 1..40`.
- `POST /api/tasks` maps that error to status 422 with body `{ "error": "estimateHours must be a whole number 1..40" }`. Nothing is stored.
- A valid estimate returns 201 as before.
- If the field is absent, the task is created with `estimateHours: null`.

The rule lives in `lib/tasks.ts`. The route handler does not change, because it already maps `RuleViolation` to 422.

## Acceptance criteria

1. `1` and `40` are accepted.
2. `0`, `41`, `1.5`, `"3"` and `"abc"` are rejected with the message above.
3. `POST /api/tasks` returns 422 for a rejected estimate and 201 for an accepted one.
4. A task without `estimateHours` is created with `estimateHours: null`.
5. Every case in criterion 1 and 2 has a unit test in `lib/tasks.test.ts`.

## Decisions that the ticket leaves open

- `null` counts as a present value, and it is rejected. The ticket says that only an omitted field is allowed. A client that sends `null` gets a 422 and must omit the field instead.
- Any non-number is rejected with the same message. This covers `true`, arrays and objects.
- `NaN` and `Infinity` are rejected. A JSON body cannot carry them, but a direct call to `createTask` can.
- The old message `estimateHours must be 1..40` is replaced by the new message. Only `lib/tasks.ts` contains the old text, and no test checks it.

## Test list

All tests go in `lib/tasks.test.ts`. Each rejection test checks the exact message.

| Input | Result |
|---|---|
| `1` | accepted, stored as 1 |
| `40` | accepted, stored as 40 |
| `0` | rejected |
| `41` | rejected |
| `1.5` | rejected |
| `"3"` | rejected |
| `"abc"` | rejected |
| `null` | rejected |
| field absent | accepted, `estimateHours` is `null` |

The 422 and 201 status codes come from the route handler. The unit tests in `lib/tasks.test.ts` do not call the route. The evidence file shows a manual call for 422 and 201 (see the Evidence section).

## Non-goals

- No database migration. The column check stays as it is.
- No UI change.
- No change to titles or status transitions.
- No change to the 400 response for a malformed body.

## Evidence

The evidence file `docs/evidence/TASK-7/whole-hours.md` holds these items:

- the output of `npm test` and `npm run typecheck`, with exit codes
- a manual `POST /api/tasks` call for 422 and one for 201
- the full SHA of the code commit that the commands ran on.

## Approval

Approved by @TyshchenkoOleksandr on 2026-11-27, including the four decisions above. An agent (Claude Code) drafted this spec. The approver read it and approved it in the chat session.
