
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

// Load saved todos from localStorage
const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];

// Save todos to localStorage
function savedTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Create a DOM node for each todo
function createTodoNode(todo, index) {
    const li = document.createElement('li');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;

    // Task text
    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;
    textSpan.style.margin = '0 8px';
    textSpan.style.textDecoration =
        todo.completed ? 'line-through' : '';

    checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;

        textSpan.style.textDecoration =
            todo.completed ? 'line-through' : '';

        savedTodos();
    });

    // Edit button
    const editBtn = document.createElement('button');
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

    todos.push({
        id: crypto.randomUUID(),
        text: text,
        completed: false
    });

    input.value = '';
    render();
    savedTodos();
}

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
