const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const { parseHTML } = require('linkedom');

const root = path.join(__dirname, '..');
const { window } = parseHTML(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
const document = window.document;
const mode = document.querySelector('#mode');
Object.defineProperty(mode, 'value', { value: 'fixed', writable: true });
const context = vm.createContext({
  document,
  window,
  Element: window.Element,
  console: { log() {}, clear() {} }
});
vm.runInContext(fs.readFileSync(path.join(root, 'app.js'), 'utf8'), context);

const click = (element) => element.dispatchEvent(new window.Event('click', { bubbles: true }));
const query = (selector) => document.querySelector(selector);
const logs = () => query('#logs').textContent.trim();
function reset(value = 'fixed') {
  mode.value = value;
  mode.dispatchEvent(new window.Event('change'));
}

click(query('li .text'));
assert.equal(query('li').classList.contains('done'), true);
assert.equal(logs(), '[toggle] id=1');

reset();
click(query('[data-action="delete"]'));
assert.equal(document.querySelectorAll('li').length, 1);
assert.equal(logs(), '[delete] id=1');

for (let n = 0; n < 2; n += 1) {
  reset();
  click(query('[data-action="delete"]').children[n]);
  assert.equal(logs(), '[delete] id=1');
}

reset();
click(query('#list'));
assert.equal(logs(), '');

query('#input').value = '动态新增';
query('#form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
click(document.querySelectorAll('li .text')[2]);
assert.equal(document.querySelectorAll('li')[2].classList.contains('done'), true);
click(document.querySelectorAll('[data-action="delete"]')[2]);
assert.equal(document.querySelectorAll('li').length, 2);

reset('buggy');
click(query('[data-action="delete"]'));
assert.equal(logs(), '[delete] id=1\n[toggle] id=1');

reset();
click(query('li .text'));
query('#logs').textContent = '';
window.prompt = () => '  修改后的任务  ';
click(query('[data-action="edit"] span'));
assert.equal(query('li .text').textContent, '修改后的任务');
assert.equal(query('li').classList.contains('done'), true);
assert.equal(logs(), '[edit] id=1');

for (const value of [null, '', '   ']) {
  query('#logs').textContent = '';
  window.prompt = () => value;
  click(query('[data-action="edit"]'));
  assert.equal(query('li .text').textContent, '修改后的任务');
  assert.equal(logs(), '');
  assert.equal(query('li').classList.contains('done'), true);
}

query('li').removeAttribute('data-id');
click(query('li .text'));
assert.equal(logs(), '');
console.log('PASS: delegated toggle/delete, nested button targets, blank area, dynamic task, bug reproduction, edit/cancel/blank input, and missing ID.');
