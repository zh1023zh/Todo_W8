import { addTodo, parseTodoId, toggleTodo, type Todo } from "./todo";

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.querySelector<HTMLFormElement>("#form");
const input = document.querySelector<HTMLInputElement>("#input");
const mode = document.querySelector<HTMLSelectElement>("#mode");
const logs = document.querySelector<HTMLElement>("#logs");
const status = document.querySelector<HTMLElement>("#status");

// Fail early with a clear message if the HTML no longer contains required elements.
if (!list || !form || !input || !mode || !logs || !status) {
  throw new Error("Todo 页面缺少必要元素，请检查 #list、#form、#input、#mode、#logs 和 #status。");
}

const todoList = list;
const todoForm = form;
const todoInput = input;
const runMode = mode;
const logOutput = logs;
const statusText = status;

let nextId = 3;
let todos: Todo[] = [];

type Action = "delete" | "toggle" | "edit";

function log(action: Action, id: number): void {
  const message = `[${action}] id=${id}`;
  console.log(message);
  logOutput.textContent += `${message}\n`;
}

function render(): void {
  todoList.replaceChildren();

  for (const todo of todos) {
    const item = document.createElement("li");
    item.dataset.id = String(todo.id);
    item.classList.toggle("done", todo.done);

    const text = document.createElement("span");
    text.className = "text";
    // Use textContent, not innerHTML, so user-entered text is treated as text.
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";

    const deleteIcon = document.createElement("span");
    deleteIcon.textContent = "×";
    const deleteLabel = document.createElement("span");
    deleteLabel.textContent = " 删除";
    deleteButton.append(deleteIcon, deleteLabel);

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.dataset.action = "edit";
    const editLabel = document.createElement("span");
    editLabel.textContent = "编辑";
    editButton.append(editLabel);

    item.append(text, deleteButton, editButton);
    todoList.append(item);
  }

  statusText.textContent = `任务数：${todos.length}`;
}

function deleteTodo(id: number): void {
  log("delete", id);
  todos = todos.filter((todo) => todo.id !== id);
  render();
}

function toggleTodoById(id: number): void {
  log("toggle", id);
  todos = toggleTodo(todos, id);
  render();
}

function editTodo(id: number): void {
  const todo = todos.find((item) => item.id === id);
  if (!todo) return;

  const value = window.prompt("修改任务内容", todo.text);
  if (value === null) return;

  const text = value.trim();
  if (text.length === 0) return;

  todos = todos.map((item) => (item.id === id ? { ...item, text } : item));
  log("edit", id);
  render();
}

// Event delegation: the UL handles clicks for existing and newly rendered tasks.
todoList.addEventListener("click", (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const item = target.closest("li");
  if (!item || !todoList.contains(item)) return;

  // dataset.id is string | undefined; validate it before passing a number to business logic.
  const id = parseTodoId(item.dataset.id);
  if (id === null) return;

  const editButton = target.closest('[data-action="edit"]');
  if (editButton && item.contains(editButton)) {
    editTodo(id);
    return;
  }

  const deleteButton = target.closest('[data-action="delete"]');
  if (deleteButton && item.contains(deleteButton)) {
    deleteTodo(id);
    // Keep W8's bug-reproduction mode for the original event-delegation exercise.
    if (runMode.value === "fixed") return;
  }

  toggleTodoById(id);
});

todoForm.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (text.length === 0) return;

  const updated = addTodo(todos, text, nextId);
  if (updated.length === todos.length) return;

  todos = updated;
  nextId += 1;
  todoInput.value = "";
  render();
});

function reset(): void {
  todos = [
    { id: 1, text: "学习事件委托", done: false },
    { id: 2, text: "完成五个测试场景", done: false }
  ];
  nextId = 3;
  logOutput.textContent = "";
  console.clear();
  render();
}

runMode.addEventListener("change", reset);
reset();
