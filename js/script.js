// Seleção de elementos

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("filter-select");

let oldInputValue;

// Funções

function saveTodo(task){
    
    // Passar várias classes: classList.add("fa-solid", "fa-check");

    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerHTML = task;
    todo.appendChild(todoTitle);
    
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
   
    todoList.appendChild(todo);

    clearValue();
}

function clearValue(){
    todoInput.value = ""
    todoInput.focus();
}

function toggleForms(){
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

function updateTodo(text){
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = text;
        }
    });
}

function getSearchTodos(search){
    
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();

        todo.style.display = "flex";

        if(!todoTitle.includes(normalizedSearch)){
            todo.style.display = "none";
        }
    })
}

function deleteSearch(){
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
}

// Eventos

todoForm.addEventListener("submit", (e) => {
    
    e.preventDefault(); // Enviar o formulário sem recarregar a página

    const inputValue = todoInput.value;
    
    if(inputValue){
        saveTodo(inputValue);  
    }
})

document.addEventListener("click", (e)=>{
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if(targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done");
    }

    if(targetEl.classList.contains("remove-todo")){
        parentEl.remove();
    }

    if(targetEl.classList.contains("edit-todo")){
       toggleForms();
       editInput.value = todoTitle;
       oldInputValue = todoTitle;
    }
})

cancelEditBtn.addEventListener("click", (e)=> {
    e.preventDefault();

    toggleForms();
})

editForm.addEventListener("submit", (e)=> {
    e.preventDefault();

    const editInputValue = editInput.value;

    if(editInputValue){
        updateTodo(editInputValue)
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