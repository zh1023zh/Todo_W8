import { describe, expect, it } from "vitest";
import { addTodo, parseTodoId, toggleTodo, type Todo } from "../src/todo";

const base: Todo[] = [{ id: 1, text: "学习事件委托", done: false }];

describe("addTodo", () => {
  it("trims text and creates a complete unfinished task", () => {
    const result = addTodo(base, "  新任务  ", 2);

    expect(result).toEqual([
      { id: 1, text: "学习事件委托", done: false },
      { id: 2, text: "新任务", done: false }
    ]);
    expect(base).toEqual([{ id: 1, text: "学习事件委托", done: false }]);
  });

  it("rejects empty text, duplicate IDs and invalid IDs", () => {
    expect(addTodo(base, "", 2)).toEqual(base);
    expect(addTodo(base, "   ", 2)).toEqual(base);
    expect(addTodo(base, "重复编号", 1)).toEqual(base);
    expect(addTodo(base, "零编号", 0)).toEqual(base);
    expect(addTodo(base, "负数编号", -1)).toEqual(base);
    expect(addTodo(base, "NaN 编号", Number.NaN)).toEqual(base);
    expect(addTodo(base, "无穷编号", Number.POSITIVE_INFINITY)).toEqual(base);
  });
});

describe("toggleTodo", () => {
  it("toggles only the matching task without mutating the input", () => {
    const original: Todo[] = [
      { id: 1, text: "任务 A", done: false },
      { id: 2, text: "任务 B", done: false }
    ];

    const result = toggleTodo(original, 1);

    expect(result).toEqual([
      { id: 1, text: "任务 A", done: true },
      { id: 2, text: "任务 B", done: false }
    ]);
    expect(original).toEqual([
      { id: 1, text: "任务 A", done: false },
      { id: 2, text: "任务 B", done: false }
    ]);
  });

  it("ignores unknown and invalid IDs", () => {
    expect(toggleTodo(base, 99)).toEqual(base);
    expect(toggleTodo(base, 0)).toEqual(base);
    expect(toggleTodo(base, Number.NaN)).toEqual(base);
  });
});

describe("parseTodoId", () => {
  it("converts valid dataset IDs to numbers", () => {
    expect(parseTodoId("12")).toBe(12);
    expect(typeof parseTodoId("12")).toBe("number");
  });

  it("rejects missing, blank, malformed and unsafe IDs", () => {
    expect(parseTodoId(undefined)).toBeNull();
    expect(parseTodoId(null)).toBeNull();
    expect(parseTodoId("")).toBeNull();
    expect(parseTodoId("   ")).toBeNull();
    expect(parseTodoId("abc")).toBeNull();
    expect(parseTodoId("1.5")).toBeNull();
    expect(parseTodoId("-2")).toBeNull();
    expect(parseTodoId("0")).toBeNull();
    expect(parseTodoId("9007199254740992")).toBeNull();
  });
});
