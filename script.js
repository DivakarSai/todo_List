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
            <input type="text" value="${task.category}" class="task_cat ${task.completed ? "completed" : ""}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
            <input type="date" value="${task.due_date}" class="task_due ${task.completed ? "completed" : ""}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
            <i class="fa fa-trash" onclick="removeTask(this)">Delete</i>`;
      li.setAttribute('id',identity++);
      list.insertBefore(li, list.children[0]);
    });
      



}



function addTask() {
  const task = document.querySelector(".task_desc");
  const category = document.querySelector(".task_cat");
  const due_date = document.querySelector(".task_due");
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
  localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: task.value, completed: false, category: category.value,due_date:due_date.value }]));
  

  // create list item, add innerHTML and append to ul
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
      <input type="text" value="${task.value}" class="task_desc" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <input type="text" value="${category.value}" class="task_cat" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <input type="date" value="${due_date.value}" class="task_due" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <i class="fa fa-trash" onclick="removeTask(this)">Delete</i>`;
  li.setAttribute('id',identity++);
  list.insertBefore(li, list.children[0]);
  // clear input
  task.value = "";
  category.value = "";
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

  
  // update task
  tasks.forEach(task => {
    if (task.task === currentTask) {
      task.task = event.value;
    }
  });
  tasks.forEach(task => {
    if (task.category === currentTask) {
      task.category = event.value;
    }
  });
  // update local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}




