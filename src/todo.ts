/** A single task in the Todo list. IDs are numbers inside the application. */
export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

/**
 * Convert a DOM data attribute to a safe positive integer.
 * dataset.id can be missing or malformed, so validate before using Number().
 */
export function parseTodoId(rawId: string | null | undefined): number | null {
  // Some DOM implementations return null for a missing data attribute, while browsers may return undefined.
  if (rawId == null || rawId.trim() === "") {
    return null;
  }

  // Do not accept decimals, signs, exponent notation, or other dirty input.
  if (!/^\d+$/.test(rawId)) {
    return null;
  }

  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

/** Add a task immutably. Invalid text or IDs leave the task list unchanged. */
export function addTodo(
  todos: readonly Todo[],
  text: string,
  id: number
): Todo[] {
  const cleanText = text.trim();
  const validId = Number.isSafeInteger(id) && id > 0;
  const duplicateId = todos.some((todo) => todo.id === id);

  if (cleanText.length === 0 || !validId || duplicateId) {
    return todos.map((todo) => ({ ...todo }));
  }

  return [...todos, { id, text: cleanText, done: false }];
}

/** Toggle one task immutably; unknown or invalid IDs are ignored. */
export function toggleTodo(todos: readonly Todo[], id: number): Todo[] {
  if (!Number.isSafeInteger(id) || id <= 0 || !todos.some((todo) => todo.id === id)) {
    return todos.map((todo) => ({ ...todo }));
  }

  return todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : { ...todo }
  );
}
