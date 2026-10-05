const STORAGE_KEY = 'todo-app-items';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const submitButton = document.getElementById('submit-button');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editingId = null;

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function updateTaskCount() {
  const total = todos.length;
  const label = total === 1 ? '1 task' : `${total} tasks`;
  taskCount.textContent = label;
}

function renderTodos() {
  todoList.innerHTML = '';

  if (!todos.length) {
    const emptyState = document.createElement('li');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No tasks yet. Add one above!';
    todoList.appendChild(emptyState);
    updateTaskCount();
    return;
  }

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    const main = document.createElement('div');
    main.className = 'todo-main';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `Mark ${todo.text} as complete`);
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    main.appendChild(checkbox);
    main.appendChild(text);

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'edit-btn';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => startEdit(todo.id));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    item.appendChild(main);
    item.appendChild(actions);
    todoList.appendChild(item);
  });

  updateTaskCount();
}

function addTodo(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    todoInput.focus();
    return;
  }

  todos.unshift({
    id: Date.now() + Math.random(),
    text: trimmedText,
    completed: false,
  });

  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  saveTodos();
  renderTodos();
}

function startEdit(id) {
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return;
  }

  editingId = id;
  todoInput.value = todo.text;
  todoInput.focus();
  submitButton.textContent = 'Save Task';
}

function updateTodo(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    todoInput.focus();
    return;
  }

  todos = todos.map((todo) =>
    todo.id === editingId ? { ...todo, text: trimmedText } : todo
  );

  editingId = null;
  todoInput.value = '';
  submitButton.textContent = 'Add Task';
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);

  if (editingId === id) {
    editingId = null;
    todoInput.value = '';
    submitButton.textContent = 'Add Task';
  }

  saveTodos();
  renderTodos();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = todoInput.value;

  if (editingId !== null) {
    updateTodo(value);
    return;
  }

  addTodo(value);
  todoInput.value = '';
});

renderTodos();
