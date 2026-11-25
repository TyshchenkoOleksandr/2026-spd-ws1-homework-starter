// owner: @TyshchenkoOleksandr · why: an edited applied migration never runs again on existing databases · review-by: 2027-02-25
// PreToolUse hook. Reads the tool call as JSON on stdin. Exit 2 blocks the call and stderr goes to the agent.
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const payload = JSON.parse(readFileSync(0, "utf8") || "{}");
const target = payload.tool_input?.file_path;

if (typeof target === "string") {
  const abs = resolve(root, target);
  const rel = relative(root, abs).split(sep).join("/");
  // A new file in db/migrations is allowed. A file that exists there is applied, so it is frozen.
  if (rel.startsWith("db/migrations/") && existsSync(abs)) {
    const reason = `BLOCKED: ${rel} is an applied migration. Do not edit it. Add a new numbered file in db/migrations/ instead.`;
    try {
      appendFileSync(join(root, ".claude", "hooks", "hook.log"), `${new Date().toISOString()} ${payload.tool_name} ${rel} exit=2\n`);
    } catch {
      // The log is evidence only. A write error must not stop the block.
    }
    console.error(reason);
    process.exit(2);
  }
}
process.exit(0);
