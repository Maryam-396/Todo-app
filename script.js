
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Load saved todos from localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');

    if (!saved) {
        return [];
    }

    try {
        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed;
    } catch (error) {
        console.error('Failed to load saved todos:', error);
        return [];
    }
}
function createTodoId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
    }

    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const todos = loadTodos();

// Save todos to localStorage
function savedTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Create a DOM node for each todo
function createTodoNode(todo, index) {
    const li = document.createElement('li');

    // Checkbox
    // Checkbox
const checkbox = document.createElement('input');

checkbox.type = 'checkbox';
checkbox.checked = !!todo.completed;

checkbox.setAttribute(
    'aria-label',
    `Mark "${todo.text}" as completed`
);

    // Task text
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;

    checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        savedTodos();
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.title = 'Edit task';

    editBtn.addEventListener('click', () => {
        const newText = prompt('Edit todo:', todo.text);

        if (newText === null) return;

        const trimmedText = newText.trim();

        if (trimmedText === '') {
            alert('Task cannot be empty!');
            return;
        }

        todo.text = trimmedText;
        render();
        savedTodos();
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.title = 'Delete task';

    delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        render();
        savedTodos();
    });

    // Add everything to the list item
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    return li;
}

// Render all todos
function render() {
    list.innerHTML = '';

    todos.forEach((todo, index) => {
        const node = createTodoNode(todo, index);
        list.appendChild(node);
    });
}

// Add a new todo
function addTodo() {
    const text = input.value.trim();

    if (text === '') {
        return;
    }

    const todo = {
        id: createTodoId(),
        text: text,
        completed: false
    };

    todos.push(todo);

    input.value = '';
    render();
    savedTodos();
}

function clearCompletedTodos() {
    const remainingTodos = todos.filter(todo => !todo.completed);

    todos.length = 0;
    todos.push(...remainingTodos);

    render();
    savedTodos();
}

clearCompletedBtn.addEventListener('click', clearCompletedTodos);

// Add button click
addBtn.addEventListener('click', addTodo);

// Add task when Enter is pressed
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Display saved tasks
render();
