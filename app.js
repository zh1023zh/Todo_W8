"use strict";
const list = document.querySelector('#list');
const form = document.querySelector('#form');
const input = document.querySelector('#input');
const mode = document.querySelector('#mode');
const logs = document.querySelector('#logs');
let nextId = 3;
let todos = [];

function log(action, id) {
  const message = `[${action}] id=${id}`;
  console.log(message);
  logs.textContent += message + '\n';
}

function render() {
  list.replaceChildren();
  for (const todo of todos) {
    const item = document.createElement('li');
    item.dataset.id = todo.id;
    item.classList.toggle('done', todo.done);
    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = todo.text;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.action = 'delete';
    const icon = document.createElement('span');
    icon.textContent = '×';
    const label = document.createElement('span');
    label.textContent = ' 删除';
    button.append(icon, label);
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.dataset.action = 'edit';
    const editLabel = document.createElement('span');
    editLabel.textContent = '编辑';
    editButton.append(editLabel);
    item.append(text, button, editButton);
    list.append(item);
  }
  document.querySelector('#status').textContent = `任务数：${todos.length}`;
}

function deleteTodo(id) {
  log('delete', id);
  todos = todos.filter(todo => todo.id !== id);
  render();
}

function toggleTodo(id) {
  log('toggle', id);
  const todo = todos.find(todo => todo.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  render();
}

function editTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (!todo) return;
  const value = window.prompt('修改任务内容', todo.text);
  if (value === null) return;
  const text = value.trim();
  if (!text) return;
  todo.text = text;
  log('edit', id);
  render();
}

// li、任务文字、删除按钮上均不绑定监听器，所有列表点击由 ul 处理。
list.addEventListener('click', (e) => {
  if (!(e.target instanceof Element)) return;
  const item = e.target.closest('li');
  if (!item || !list.contains(item)) return;
  const id = item.dataset.id;
  if (!id) return;
  const editBtn = e.target.closest('[data-action="edit"]');
  if (editBtn && item.contains(editBtn)) {
    editTodo(id);
    return;
  }
  const delBtn = e.target.closest('[data-action="delete"]');
  if (delBtn && item.contains(delBtn)) {
    deleteTodo(id);
    // 缺陷版会继续调用 toggleTodo；修复版在删除后结束本次处理。
    if (mode.value === 'fixed') return;
  }
  toggleTodo(id);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: String(nextId++), text, done: false });
  input.value = '';
  render();
});

function reset() {
  todos = [
    { id: '1', text: '学习事件委托', done: false },
    { id: '2', text: '完成五个测试场景', done: false }
  ];
  nextId = 3;
  logs.textContent = '';
  console.clear();
  render();
}
mode.addEventListener('change', reset);
reset();
