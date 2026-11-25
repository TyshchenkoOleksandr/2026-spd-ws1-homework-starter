# A/B note: team harness for Team Tasks

<!-- owner: @TyshchenkoOleksandr · why: show that the harness changes agent behavior · review-by: 2027-02-25 -->

Status: the table is empty. The four runs did not complete in the sandbox where I wrote this note. Each run ended with `terminal_reason: api_error`, zero tokens and zero cost. Fill in the table with the commands below before you submit.

**Task given to the agent (identical in A and B):**
> Add an optional label text column (max 30 characters) to tasks. Accept it in createTask and POST /api/tasks, return it in the Task object, and add unit tests. Run npm test when done.

**A: before** (commit `62ac6f8`, no harness) · **B: after** (commit `0901b83`, the harness)

| Run | Side | Tests green? | Rule violations | Files touched | Turns / cost | Notes |
|---|---|---|---|---|---|---|
| 1 | A | | | | | |
| 2 | A | | | | | |
| 1 | B | | | | | |
| 2 | B | | | | | |

How to operate one run (repeat for A1, A2, B1, B2):

```bash
git worktree add --detach ../wt-A1 62ac6f8 && ln -s "$PWD/node_modules" ../wt-A1/node_modules
```

```bash
cd ../wt-A1 && claude -p "<the prompt above>" --output-format json --permission-mode acceptEdits > ../run-A1.json
```

```bash
git diff --stat && git status --short db/migrations && npm test
```

Use `62ac6f8` for A and `0901b83` for B. The JSON has `num_turns` and `total_cost_usd`. A violation is any change to `001_create_tasks.sql` or `002_add_task_estimate.sql`.

**What I expect (a hypothesis, not a result):** side A may edit the existing migration `002`. Side B adds `003_*.sql` because `AGENTS.md` and `.claude/rules/db-migrations.md` say so. If side B tries to edit `002`, the hook blocks it with exit code 2.

**What changed:** not measured yet.

**What did not change:** not measured yet. Write "no difference" here if both sides add a new migration.

Separate evidence: the hook blocks a violation when operated by hand. See `docs/ai/hook-evidence.txt`.
