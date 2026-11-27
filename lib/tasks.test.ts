import { beforeEach, describe, expect, it } from "vitest";
import { openDb } from "./db";
import { createTask, listTasks, moveTask, RuleViolation } from "./tasks";
import type { DatabaseSync } from "node:sqlite";

let db: DatabaseSync;
beforeEach(() => {
  db = openDb(":memory:");
});

describe("tasks", () => {
  it("creates a task in todo", () => {
    const t = createTask(db, { title: "Write the team agreement", estimateHours: 2 });
    expect(t.status).toBe("todo");
    expect(listTasks(db)).toHaveLength(1);
  });

  it("rejects an empty title", () => {
    expect(() => createTask(db, { title: "  " })).toThrow(RuleViolation);
  });

  it("follows todo → doing → done and keeps done final", () => {
    const t = createTask(db, { title: "Add a hook" });
    moveTask(db, t.id, "doing");
    moveTask(db, t.id, "done");
    expect(() => moveTask(db, t.id, "todo")).toThrow(RuleViolation);
  });

  it("does not skip doing", () => {
    const t = createTask(db, { title: "Path rule" });
    expect(() => moveTask(db, t.id, "done")).toThrow(RuleViolation);
  });
});

describe("estimateHours (TASK-7)", () => {
  const MESSAGE = "estimateHours must be a whole number 1..40";
  const create = (estimateHours: unknown) => createTask(db, { title: "Estimate", estimateHours: estimateHours as number });

  it.each([1, 40])("accepts %i", (hours) => {
    expect(create(hours).estimateHours).toBe(hours);
  });

  it.each([
    ["0", 0],
    ["41", 41],
    ["1.5", 1.5],
    ['"3"', "3"],
    ['"abc"', "abc"],
    ["null", null],
    ["NaN", Number.NaN],
    ["true", true],
  ])("rejects %s with the exact message and stores nothing", (_label, value) => {
    expect(() => create(value)).toThrow(new RuleViolation(MESSAGE));
    expect(listTasks(db)).toHaveLength(0);
  });

  it("creates a task with estimateHours null when the field is absent", () => {
    const t = createTask(db, { title: "No estimate" });
    expect(t.estimateHours).toBeNull();
  });
});
