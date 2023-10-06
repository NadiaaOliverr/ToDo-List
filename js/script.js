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

function filterTodos(filterValue){

    const todos = document.querySelectorAll(".todo");

    switch(filterValue) {
        case "all":
            todos.forEach((todo) =>{
                todo.style.display = "flex";
            })
            break;
        
        case "done":
            todos.forEach((todo) =>{
                todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none");
            })
            break;

        case "todo":
            todos.forEach((todo) =>{
                !todo.classList.contains("done") ? todo.style.display = "flex" : todo.style.display = "none";
            })
            break;
        default:
            break;
    }
}

function countTodos(){
    const todos = document.querySelectorAll(".todo");
    let totalTodos = todos.length; 
    let doneTodos = 0;

    todos.forEach((todo) =>{
        if(todo.classList.contains("done")){
            doneTodos++;
        }
    })

    countStatus.innerText = `${doneTodos}/${totalTodos}`;
}

// Eventos
todoForm.addEventListener("submit", (e) => {
    
    e.preventDefault(); // Enviar o formulário sem recarregar a página

    const inputValue = todoInput.value;
    
    if(inputValue){
        saveTodo(inputValue);  
    }
    countTodos();
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
       toolbar.style.display = "none";
       editInput.value = todoTitle;
       oldInputValue = todoTitle;
    }
    countTodos();
})

cancelEditBtn.addEventListener("click", (e)=> {
    e.preventDefault();
    toolbar.style.display = "flex";
    toggleForms();
})

editForm.addEventListener("submit", (e)=> {
    e.preventDefault();
    toolbar.style.display = "flex";
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

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue);
})