// Seleção de elementos

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");
const toolbar = document.querySelector("#toolbar");
const countStatus = document.querySelector("#countStatus");
const selectPriority = document.querySelector("#select-priority");
const editselectPriority = document.querySelector("#select-priority-edit");

let oldInputValue;


// Funções Gerais

function addPriority(value, el) {
    switch (value) {
        case "low":
            el.classList.add("priority-low");
            el.id = "priority-low";
            el.innerHTML = `<p>Baixa</p>`;
            break;
        case "middle":
            el.classList.add("priority-middle");
            el.id = "priority-middle";
            el.innerHTML = `<p>Média</p>`;
            break;
        case "high":
            el.classList.add("priority-high");
            el.id = "priority-high";
            el.innerHTML = `<p>Alta</p>`;
            break;
        default:
            break;
    }
    return el;
}

function verifyTitleTask(task) {
    const todos = document.querySelectorAll(".todo");
    let titlesList = [];

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h3").innerText;
        titlesList.push(todoTitle);
    });

    if (titlesList.includes(task)) {
        alert("Tarefa já existe no TO DO.");
        return true;
    }
}

function clearValue() {
    todoInput.value = ""
    todoInput.focus();
}

function saveTodo(task, done = 0, save = 1, prioritySelected) {

    if (!verifyTitleTask(task)) {
        const todo = document.createElement("div");
        todo.classList.add("todo");

        const todoTitle = document.createElement("h3");
        todoTitle.innerHTML = task;
        todo.appendChild(todoTitle);

        if (!prioritySelected) {
            prioritySelected = selectPriority.value;
        }

        let priority = document.createElement("div");
        priority = addPriority(prioritySelected, priority);

        todo.appendChild(priority);

        const doneBtn = document.createElement("button");
        doneBtn.classList.add("finish-todo");
        doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        todo.appendChild(doneBtn);

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-todo");
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        todo.appendChild(editBtn);

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-todo");
        removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        todo.appendChild(removeBtn);

        // Utilizando dados do LocalStorage
        if (done) {
            todo.classList.add("done");
        }
        if (save) {
            saveTodoLocalStorage({ task: task, done: 0, priority: prioritySelected })
        }

        todoList.appendChild(todo);
    }

    clearValue();
}

function toggleForms() {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

function updateTodo(text, priority) {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
            updateTodoLocalStorage(oldInputValue, text);
            let priorityDiv = todo.querySelector("div[id^='priority-']");
            priorityDiv.id = "";
            addPriority(priority, priorityDiv);

        }
    });
}

function getSearchTodos(search) {

    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();

        todo.style.display = "flex";

        if (!todoTitle.includes(normalizedSearch)) {
            todo.style.display = "none";
        }
    })
}

function deleteSearch() {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
}

function filterTodos(filterValue) {

    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => {
                todo.style.display = "flex";
            })
            break;

        case "done":
            todos.forEach((todo) => {
                todo.classList.contains("done") ?
                    (todo.style.display = "flex") :
                    (todo.style.display = "none");
            })
            break;

        case "todo":
            todos.forEach((todo) => {
                !todo.classList.contains("done") ?
                    todo.style.display = "flex" :
                    todo.style.display = "none";
            })
            break;
        default:
            break;
    }
}

function countTodos() {
    const todos = document.querySelectorAll(".todo");
    let totalTodos = todos.length;
    let doneTodos = 0;

    todos.forEach((todo) => {
        if (todo.classList.contains("done")) {
            doneTodos++;
        }
    })

    countStatus.innerText = `Status: ${doneTodos}/${totalTodos}`;
}

// Eventos
todoForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue);
    } else {
        alert("Insira algo no campo!")
    }
    countTodos();
})

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;
    let todoPriority;

    if (parentEl && parentEl.querySelector("h3") && parentEl.querySelector("p")) {
        todoTitle = parentEl.querySelector("h3").innerText;
        todoPriority = parentEl.querySelector("p").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
        updateStatusTodoLocalStorage(todoTitle);
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        removeTodoLocalStorage(todoTitle);
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
        toolbar.style.display = "none";
        countStatus.style.display = "none";
        editInput.value = todoTitle;
        if (todoPriority === "Baixa") {
            editselectPriority.value = "low";
        } if (todoPriority === "Alta") {
            editselectPriority.value = "high";
        } if (todoPriority === "Média") {
            editselectPriority.value = "middle";
        }
        oldInputValue = todoTitle;
    }
    countTodos();
    filterTodos(filterBtn.value);
})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toolbar.style.display = "flex";
    countStatus.style.display = "flex";
    toggleForms();
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    toolbar.style.display = "flex";
    countStatus.style.display = "flex";
    const editInputValue = editInput.value;
    const editSelectValue = editselectPriority.value;

    if (editInputValue || editSelectValue) {
        updateTodo(editInputValue, editSelectValue)
    }

    toggleForms();
})

searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value;
    getSearchTodos(search);
})

eraseBtn.addEventListener("click", (e) => {

    e.preventDefault();
    deleteSearch();
})

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue);
})

// Funções Local Storage

function getTodosLocalStorage() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
}

function loadTodosLocalStorage() {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.task, todo.done, 0, todo.priority)
    })
}

function saveTodoLocalStorage(todo) {
    const todos = getTodosLocalStorage();

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));

}

function removeTodoLocalStorage(task) {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.task !== task)

    localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

function updateStatusTodoLocalStorage(task) {
    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.task === task ? (todo.done = !todo.done) : null);

    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTodoLocalStorage(todoOldTask, todoNewTask) {
    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.task === todoOldTask ? (todo.task = todoNewTask) : null);

    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodosLocalStorage();