const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box"),
  submit = document.querySelector(".task-input submit");

let editId,
  isEditTask = false,
  todos = JSON.parse(localStorage.getItem("todo-list")) || [];

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let liTag = "";
  let taskBox2 = document.querySelector(".wrapper2 .task-box");

  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        liTag += `<li class="task">
                    <label for="${id}">
                      <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                      <p class="${completed}">
                        <strong>${todo.name}</strong><br>
                        Description: ${todo.description}<br>
                        Due Date: ${todo.dueDate}<br>
                        Priority: ${todo.priority}
                      </p>
                    </label>
                    <div class="settings">
                      <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                      <ul class="task-menu">
                      <li onclick='editTask(${id}, "${todo.name}", "${todo.description}", "${todo.dueDate}", "${todo.priority}")'><i class="uil uil-pen"></i>Edit</li>
                        <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                      </ul>
                    </div>
                  </li>`;
      }
    });
  }
  taskBox2.innerHTML = liTag || `<span>You don't have any task here</span>`;
  let checkTask = taskBox2.querySelectorAll(".task");
  let clearAll2 = document.querySelector(".wrapper2 .clear-btn");
  !checkTask.length
    ? clearAll2.classList.remove("active")
    : clearAll2.classList.add("active");
  taskBox2.offsetHeight >= 300
    ? taskBox2.classList.add("overflow")
    : taskBox2.classList.remove("overflow");
}

showTodo("all");

function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

function editTask(taskId, textName, description, dueDate, priority) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;

  let descriptionInput = document.getElementById("description");
  let dueDateInput = document.getElementById("dueDate");
  let priorityInput = document.getElementById("priority");

  descriptionInput.value = description;
  dueDateInput.value = dueDate;
  priorityInput.value = priority;

  taskInput.focus();
  taskInput.classList.add("active");

  // Reset input fields after editing
  descriptionInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "low";
}

function deleteTask(deleteId, filter) {
  isEditTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}

clearAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditTask) {
      let description = document.getElementById("description");
      let dueDate = document.getElementById("dueDate");
      let priority = document.getElementById("priority");

      todos = !todos ? [] : todos;
      let taskInfo = {
        name: userTask,
        description: description.value, // Store the description value
        dueDate: dueDate.value, // Store the dueDate value
        priority: priority.value, // Store the priority value
        status: "pending",
      };
      todos.push(taskInfo);

      // Reset input fields after adding task
      description.value = ""; // Reset description field
      dueDate.value = ""; // Reset dueDate field
      priority.value = "low"; // Reset priority field to default value
    } else {
      isEditTask = false;
      todos[editId].name = userTask;

      // Update the description, due date, and priority for the edited task
      todos[editId].description = document.getElementById("description").value;
      todos[editId].dueDate = document.getElementById("dueDate").value;
      todos[editId].priority = document.getElementById("priority").value;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }
});

function addOrUpdateTask() {
  let userTask = taskInput.value.trim();
  if (userTask) {
    if (!isEditTask) {
      let description = document.getElementById("description");
      let dueDate = document.getElementById("dueDate");
      let priority = document.getElementById("priority");

      todos = !todos ? [] : todos;
      let taskInfo = {
        name: userTask,
        description: description.value, // Store the description value
        dueDate: dueDate.value, // Store the dueDate value
        priority: priority.value, // Store the priority value
        status: "pending",
      };
      todos.push(taskInfo);

      // Reset input fields after adding task
      description.value = ""; // Reset description field
      dueDate.value = ""; // Reset dueDate field
      priority.value = "low"; // Reset priority field to default value
    } else {
      isEditTask = false;
      todos[editId].name = userTask;

      // Update the description, due date, and priority for the edited task
      todos[editId].description = document.getElementById("description").value;
      todos[editId].dueDate = document.getElementById("dueDate").value;
      todos[editId].priority = document.getElementById("priority").value;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }
}

document.getElementById("submitButton").addEventListener("click", function(event) {
  event.preventDefault(); // Prevents the default form submission behavior
  addOrUpdateTask(); // Call the addOrUpdateTask function when the button is clicked
});
