<!-- owner: @TyshchenkoOleksandr · why: CI and reviewers walk from a commit to its ticket, its agent and its evidence · review-by: 2027-02-25 -->

# Commit trailers

Every commit of a traced change ends with trailers. A trailer is a `Key: value` line in the last paragraph of the message. Put one trailer on each line.

- `Refs: <KEY>` is required on every commit. For example `Refs: TASK-7`. The branch is `<KEY>-<slug>`. The PR title starts with `<KEY>`.
- `Assisted-by: <tool> (<model>)` is required when an agent wrote or changed any part of the commit. Omit it on human-only commits.
- `Evidence: docs/evidence/<KEY>/<slice>.md` goes on the commit that adds the evidence file. The file holds commands, outputs, exit codes and the SHA they ran on.

Example:

```text
Reject fractional estimates

estimateHours must be a whole number 1..40. The API answers 422 otherwise.

Refs: TASK-7
Assisted-by: Claude Code (claude-sonnet-5-5)
Evidence: docs/evidence/TASK-7/whole-hours.md
```

Single-line form (git 2.32 or newer):

```bash
git commit -m "Reject fractional estimates" --trailer "Refs: TASK-7" --trailer "Assisted-by: Claude Code (claude-sonnet-5-5)"
```

To see what git parsed, run `git log -1 --format="%(trailers)"`.

Order of work: commit the code, run the checks, write the evidence with the code commit SHA, then commit the evidence. A code commit after the evidence makes the evidence stale, and the CI trace gate fails.
