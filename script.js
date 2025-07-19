const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box"),
addBtn = document.querySelector(".add-btn");

let editId = null,
isEditTask = false,
todos = JSON.parse(localStorage.getItem("todo-list")) || [];

// Filter buttons
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

// Show tasks
function showTodo(filter) {
    let liTag = "";
    if (todos.length) {
        todos.forEach((todo, id) => {
            let completed = todo.status === "completed" ? "checked" : "";
            if (filter === todo.status || filter === "all") {
                liTag += `
                <li class="task" data-id="${id}" style="display: flex; justify-content: space-between; align-items: center;">
                    <label style="display: flex; align-items: center; flex: 1;">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}" style="margin-left: 15px; word-break: break-word;">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick='startInlineEdit(${id})'><i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");

// Show/hide settings menu
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName !== "I" || e.target !== selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

// Update task completion status
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.querySelector("p");
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

// Inline editing with OK button
function startInlineEdit(taskId) {
    const taskItem = document.querySelector(`.task[data-id="${taskId}"]`);
    const label = taskItem.querySelector("label");
    const p = label.querySelector("p");
    const oldText = p.textContent;

    const input = document.createElement("input");
    input.type = "text";
    input.value = oldText;
    input.className = "edit-input";
    input.style.flex = "1";
    input.style.fontSize = "18px";
    input.style.marginLeft = "15px";
    input.style.borderRadius = "4px";
    input.style.padding = "4px 8px";
    input.style.border = "1px solid #555";
    input.style.background = "#2c2c2e";
    input.style.color = "#f0f0f0";

    p.replaceWith(input);
    input.focus();

    const settings = taskItem.querySelector(".settings");
    settings.innerHTML = "";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "OK";
    saveBtn.className = "save-btn";
    saveBtn.style.padding = "6px 12px";
    saveBtn.style.border = "none";
    saveBtn.style.borderRadius = "6px";
    saveBtn.style.background = "#3C87FF";
    saveBtn.style.color = "#fff";
    saveBtn.style.cursor = "pointer";
    saveBtn.style.transition = "background 0.3s ease";

    /* ✅ Alignment improvements */
saveBtn.style.height = "25px"; // aligns with input height
saveBtn.style.fontSize = "14px";
saveBtn.style.display = "flex";
saveBtn.style.alignItems = "center";
saveBtn.style.justifyContent = "center";
saveBtn.style.margin = "0"; // remove default margins for clean placement

saveBtn.style.alignSelf = "center"; // centers vertically in flex container
    

    settings.appendChild(saveBtn);

    saveBtn.addEventListener("click", () => {
        let newText = input.value.trim() || "Untitled Task";
        todos[taskId].name = newText;
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    });
}

// Delete task
function deleteTask(deleteId, filter) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

// Clear all tasks
clearAll.addEventListener("click", () => {
    todos = [];
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
});

// Function to add new task
function addNewTask() {
    let userTask = taskInput.value.trim();
    if (userTask) {
        let taskInfo = { name: userTask, status: "pending" };
        todos.push(taskInfo);
        localStorage.setItem("todo-list", JSON.stringify(todos));
        taskInput.value = "";
        showTodo(document.querySelector("span.active").id);
    }
}

// Add new task with OK button click
addBtn.addEventListener("click", addNewTask);

// Optional: Keep Enter key support for adding tasks
taskInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        addNewTask();
    }
});
