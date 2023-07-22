// On app load, get all tasks from localStorage
window.onload = loadTasks;
let identity=0;

// On form submit add task
document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();
  addTask();
});


function loadTasks(){

  // check if localStorage has any tasks
  var tasks ;
    tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

    // Loop through the tasks and add them to the list
    tasks.forEach(task => {
      const list = document.querySelector("ul");
      const li = document.createElement("li");
      li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? "checked" : ""}>
            <input type="text" value="${task.task}" class="task_desc ${task.completed ? "completed" : ""}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
            <input type="text" value="${task.category}" class="task_cat ${task.completed ? "completed" : ""}" onfocus="getCurrentCategory(this)" onblur="editCategory(this)">
            <input type="date" value="${task.due_date}" class="task_due ${task.completed ? "completed" : ""}" onfocus="getCurrentDueDate(this)" onblur="editDueDate(this)">
            <i class="priority_display">${task.priority}</i>
            <i class="fa-trash" onclick="removeTask(this)">Delete</i>`;
      li.setAttribute('id',identity++);
      list.insertBefore(li, list.children[0]);
    });

}

// function to add task
function addTask() {
  const task = document.querySelector(".task_desc");
  const category = document.querySelector(".task_cat");
  const due_date = document.querySelector(".task_date");
  const priority = document.querySelector(".task_priority");
  const list = document.querySelector("ul");
  // return if task is empty
  if (task.value === "") {
    alert("Please add some task!");
    return false;
  }
  // check is task already exist
  if (document.querySelector(`input[value="${task.value}"]`)) {
    alert("Task already exist!");
    return false;
  }

  // add task to local storage
  localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: task.value, completed: false, category: category.value,due_date:due_date.value, priority:priority.value }]));

  // create list item, add innerHTML and append to ul
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
      <input type="text" value="${task.value}" class="task_desc" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <input type="text" value="${category.value}" class="task_cat" onfocus="getCurrentCategory(this)" onblur="editCategory(this)">
      <input type="date" value="${(due_date.value)}" class="task_due" onfocus="getCurrentDueDate(this)" onblur="editDueDate(this)">
      <i class="priority_display">${priority.value}</i>
      <i class="fa-trash" onclick="removeTask(this)">Delete</i>`;
  li.setAttribute('id',identity++);
  list.insertBefore(li, list.children[0]);
  // clear input
  task.value = "";
  category.value = "";
  document.querySelector(".task_date").value = "";
  priority.value = "";
}

//mark task as completed or not completed
function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.nextElementSibling.classList.toggle("completed");
  event.nextElementSibling.nextElementSibling.classList.toggle("completed");
}



// function to change task due date
function changeDate(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      task.due_date = event.value;
      console.log(event.value);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      // delete task
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove();
}

// store current task to track changes
var currentTask = null;

// get current task
function getCurrentTask(event) {
  currentTask = event.value;
}



// edit the task and update local storage
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  // check if task is empty
  if (event.value === "") {
    alert("Task is empty!");
    event.value = currentTask;
    return;
  }
  // if there is no change in task don't do anything else check if task already exist
  if(event.value != currentTask) {
    tasks.forEach(task => {
      if (task.task === event.value) {
        alert("Task already exist!");
        event.value = currentTask;
        return;
      }
    });
  }

  
  // update task description
  tasks.forEach(task => {
    if (task.task === currentTask) {
      task.task = event.value;
      
    }
  });


  // update local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// store current category to track changes
var currentCategory = null;

// get current category
function getCurrentCategory(event) {
  currentCategory = event.value;
}

// function to edit task category
function editCategory(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task=== event.parentNode.children[1].value) {
      task.category = event.value;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//store current due date to track changes
var currentDueDate = null;

// get current due date
function getCurrentDueDate(event) {
  currentDueDate = event.value;
}

// function to edit task due date
function editDueDate(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      task.due_date = event.value;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//store current priority to track changes
var currentPriority = null;

// get current priority
function getCurrentPriority(event) {
  currentPriority = event.value;
}

// function to edit task priority
function editPriority(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      task.priority = event.value;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


// function to sort tasks based on completion
function sortCompleted() {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.sort((a, b) => {
    return a.completed - b.completed;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  location.reload();
}


// function to sort tasks based on due date
function sortTasks() {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.sort((a, b) => {
    return new Date(a.due_date) - new Date(b.due_date);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  location.reload();
}

// function to filter tasks based on category
function filterTasks() {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  const category = document.querySelector(".filter").value;
  if (category === "all") {
    tasks.forEach(task => {
      document.getElementById(task.task).style.display = "block";
    });
  } else {
    tasks.forEach(task => {
      if (task.category === category) {
        document.getElementById(task.task).style.display = "block";
      } else {
        document.getElementById(task.task).style.display = "none";
      }
    });
  }
}






