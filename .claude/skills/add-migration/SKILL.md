---
name: add-migration
description: Add a new SQLite migration to db/migrations and prove that it works. Use when the schema must change.
---
<!-- owner: @TyshchenkoOleksandr · why: the team adds a migration often and the steps are easy to get wrong · review-by: 2027-02-25 -->

# Add a migration

1. List `db/migrations/` and find the highest number. Your file takes the next number.
2. Create `db/migrations/NNN_short_name.sql`. Do not edit any existing file there.
3. Write plain SQLite SQL. If you add a column, give it a `check` or a default when the data needs one.
4. Run `npm run db:reset`. The command deletes the local database.
5. Run `npm test`. It opens a fresh in-memory database and applies every migration in order.
6. If the schema change affects `lib/tasks.ts`, update the code and add a unit test in `lib/tasks.test.ts`.
7. Run `npm run typecheck`.
8. In the PR description, write the rollback: the SQL that undoes the change.

Check: `npm test` and `npm run typecheck` exit with code 0, and `git status` shows only a new file in `db/migrations/`.
