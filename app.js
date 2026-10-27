"use strict";
(() => {
  // src/todo.ts
  function parseTodoId(rawId) {
    if (rawId == null || rawId.trim() === "") {
      return null;
    }
    if (!/^\d+$/.test(rawId)) {
      return null;
    }
    const id = Number(rawId);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return null;
    }
    return id;
  }
  function addTodo(todos2, text, id) {
    const cleanText = text.trim();
    const validId = Number.isSafeInteger(id) && id > 0;
    const duplicateId = todos2.some((todo) => todo.id === id);
    if (cleanText.length === 0 || !validId || duplicateId) {
      return todos2.map((todo) => ({ ...todo }));
    }
    return [...todos2, { id, text: cleanText, done: false }];
  }
  function toggleTodo(todos2, id) {
    if (!Number.isSafeInteger(id) || id <= 0 || !todos2.some((todo) => todo.id === id)) {
      return todos2.map((todo) => ({ ...todo }));
    }
    return todos2.map(
      (todo) => todo.id === id ? { ...todo, done: !todo.done } : { ...todo }
    );
  }

  // src/app.ts
  var list = document.querySelector("#list");
  var form = document.querySelector("#form");
  var input = document.querySelector("#input");
  var mode = document.querySelector("#mode");
  var logs = document.querySelector("#logs");
  var status = document.querySelector("#status");
  if (!list || !form || !input || !mode || !logs || !status) {
    throw new Error("Todo \u9875\u9762\u7F3A\u5C11\u5FC5\u8981\u5143\u7D20\uFF0C\u8BF7\u68C0\u67E5 #list\u3001#form\u3001#input\u3001#mode\u3001#logs \u548C #status\u3002");
  }
  var todoList = list;
  var todoForm = form;
  var todoInput = input;
  var runMode = mode;
  var logOutput = logs;
  var statusText = status;
  var nextId = 3;
  var todos = [];
  function log(action, id) {
    const message = `[${action}] id=${id}`;
    console.log(message);
    logOutput.textContent += `${message}
`;
  }
  function render() {
    todoList.replaceChildren();
    for (const todo of todos) {
      const item = document.createElement("li");
      item.dataset.id = String(todo.id);
      item.classList.toggle("done", todo.done);
      const text = document.createElement("span");
      text.className = "text";
      text.textContent = todo.text;
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.dataset.action = "delete";
      const deleteIcon = document.createElement("span");
      deleteIcon.textContent = "\xD7";
      const deleteLabel = document.createElement("span");
      deleteLabel.textContent = " \u5220\u9664";
      deleteButton.append(deleteIcon, deleteLabel);
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.dataset.action = "edit";
      const editLabel = document.createElement("span");
      editLabel.textContent = "\u7F16\u8F91";
      editButton.append(editLabel);
      item.append(text, deleteButton, editButton);
      todoList.append(item);
    }
    statusText.textContent = `\u4EFB\u52A1\u6570\uFF1A${todos.length}`;
  }
  function deleteTodo(id) {
    log("delete", id);
    todos = todos.filter((todo) => todo.id !== id);
    render();
  }
  function toggleTodoById(id) {
    log("toggle", id);
    todos = toggleTodo(todos, id);
    render();
  }
  function editTodo(id) {
    const todo = todos.find((item) => item.id === id);
    if (!todo) return;
    const value = window.prompt("\u4FEE\u6539\u4EFB\u52A1\u5185\u5BB9", todo.text);
    if (value === null) return;
    const text = value.trim();
    if (text.length === 0) return;
    todos = todos.map((item) => item.id === id ? { ...item, text } : item);
    log("edit", id);
    render();
  }
  todoList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const item = target.closest("li");
    if (!item || !todoList.contains(item)) return;
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
      if (runMode.value === "fixed") return;
    }
    toggleTodoById(id);
  });
  todoForm.addEventListener("submit", (event) => {
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
  function reset() {
    todos = [
      { id: 1, text: "\u5B66\u4E60\u4E8B\u4EF6\u59D4\u6258", done: false },
      { id: 2, text: "\u5B8C\u6210\u4E94\u4E2A\u6D4B\u8BD5\u573A\u666F", done: false }
    ];
    nextId = 3;
    logOutput.textContent = "";
    console.clear();
    render();
  }
  runMode.addEventListener("change", reset);
  reset();
})();
