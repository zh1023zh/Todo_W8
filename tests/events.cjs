const fs=require('fs');const vm=require('vm');const assert=require('assert/strict');
const {parseHTML}=require('linkedom');
const root=require('path').join(__dirname,'..')+'/';
const {window}=parseHTML(fs.readFileSync(root+'index.html','utf8'));
const d=window.document,mode=d.querySelector('#mode');
Object.defineProperty(mode,'value',{value:'fixed',writable:true});
const ctx=vm.createContext({document:d,window,Element:window.Element,console:{log(){},clear(){}}});
vm.runInContext(fs.readFileSync(root+'app.js','utf8'),ctx);
const click=e=>e.dispatchEvent(new window.Event('click',{bubbles:true}));
const q=s=>d.querySelector(s),logs=()=>q('#logs').textContent.trim();
function reset(value='fixed'){mode.value=value;mode.dispatchEvent(new window.Event('change'));}
click(q('li .text'));assert(q('li').classList.contains('done'));assert.equal(logs(),'[toggle] id=1');
reset();click(q('[data-action="delete"]'));assert.equal(d.querySelectorAll('li').length,1);assert.equal(logs(),'[delete] id=1');
for(let n=0;n<2;n++){reset();click(q('[data-action="delete"]').children[n]);assert.equal(logs(),'[delete] id=1');}
reset();click(q('#list'));assert.equal(logs(),'');
q('#input').value='动态新增';q('#form').dispatchEvent(new window.Event('submit',{cancelable:true}));
click(d.querySelectorAll('li .text')[2]);assert(d.querySelectorAll('li')[2].classList.contains('done'));
click(d.querySelectorAll('[data-action="delete"]')[2]);assert.equal(d.querySelectorAll('li').length,2);
reset('buggy');click(q('[data-action="delete"]'));assert.equal(logs(),'[delete] id=1\n[toggle] id=1');
reset();click(q('li .text'));q('#logs').textContent='';
window.prompt=()=> '  修改后的任务  ';click(q('[data-action="edit"] span'));
assert.equal(q('li .text').textContent,'修改后的任务');assert(q('li').classList.contains('done'));assert.equal(logs(),'[edit] id=1');
for(const value of [null,'','   ']){q('#logs').textContent='';window.prompt=()=>value;click(q('[data-action="edit"]'));assert.equal(q('li .text').textContent,'修改后的任务');assert.equal(logs(),'');assert(q('li').classList.contains('done'));}
// 验证缺少 id 的边界不会触发数据操作。
q('li').removeAttribute('data-id');click(q('li .text'));assert.equal(logs(),'');
console.log('PASS: delegated toggle/delete, inner targets, blank area, dynamic task, bug reproduction, edit success/cancel/empty, missing id.');
