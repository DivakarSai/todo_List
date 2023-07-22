// On app load, get all tasks from localStorage
window.onload = loadTasks;
let identity=0;

// On form submit add task
document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();
  addTask();
});

// function to load tasks from local storage
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
            <button class="add_subtask" onclick="addSubTask(this)">+</button>
            <input type="text" value="${task.category}" class="task_cat ${task.completed ? "completed" : ""}" onfocus="getCurrentCategory(this)" onblur="editCategory(this)">
            <input type="date" value="${task.due_date}" class="task_due ${task.completed ? "completed" : ""}" onfocus="getCurrentDueDate(this)" onblur="editDueDate(this)">
            <i class="priority_display ${task.priority}">${task.priority}</i>
            <i class="fa-trash" onclick="removeTask(this)">Delete</i>`;
      li.setAttribute('id',identity++);
      
      // check if task has subtasks
      if (task.subtasks!=null && task.subtasks.length > 0) {
        const div = document.createElement("div");
        div.classList.add("subtasks");
        task.subtasks.forEach(subtask => {
          const ul = document.createElement("ul");
          const li = document.createElement("li");
          li.innerHTML = `<input type="checkbox" onclick="subTaskComplete(this)" class="check sub_task" ${subtask.completed ? "checked" : ""}>
                <input type="text" value="${subtask.description}" class="task_desc sub_task ${subtask.completed ? "completed" : ""}" onfocus="getCurrentSubTask(this)" onblur="editSubTask(this)">
                <i class="fa-trash sub_task" onclick="removeSubTask(this)">Delete</i>`;
          ul.appendChild(li);
          div.appendChild(ul);
        });
        li.appendChild(div);
      }

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
  localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: task.value, completed: false, category: category.value,due_date:due_date.value, priority:priority.value, subtasks: [] }]));

  // create list item, add innerHTML and append to ul
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
      <input type="text" value="${task.value}" class="task_desc" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <button class="add_subtask" onclick="addSubTask(this)">+</button>
      <input type="text" value="${category.value}" class="task_cat" onfocus="getCurrentCategory(this)" onblur="editCategory(this)">
      <input type="date" value="${(due_date.value)}" class="task_due" onfocus="getCurrentDueDate(this)" onblur="editDueDate(this)">
      <i class="priority_display ${priority.value}">${priority.value}</i>
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

//mark subtask as completed or not completed
function subTaskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  
  tasks.forEach(task => {
    if (task.task === event.parentNode.parentNode.parentNode.parentNode.children[1].value) {
      task.subtasks.forEach(subtask => {
        if (subtask.description === event.nextElementSibling.value) {
         
          subtask.completed = !subtask.completed;
        }
      });
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

// function to add subtasks
function addSubTask(event) {
  // alert to add subtask
  const curr_task = event.parentNode.children[1].value;
  //take the subtask and store it 
  const desc = prompt("Add subtask");
  if (desc === "") {
    alert("Please add some subtask!");
    return false;
  }
  
  // check if subtask already exist
  if (document.querySelector(`input[value="${desc}"]`)) {
    alert("Subtask already exist!");
    return false;
  }
  //create a JSON object for subtask
  const subtask = { description: desc, completed: false };
  // add subtask to local storage

  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === curr_task) {
      task.subtasks.push(subtask);
    }
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  // create list item, add innerHTML and append to ul
  const ul = document.createElement("ul");
  const li = document.createElement("li");

  // add subtask to list item
  li.innerHTML = `<input type="checkbox" onclick="subTaskComplete(this)" class="check sub_task">
        <input type="text" value="${subtask.description}" class="task_desc sub_task ${subtask.completed ? "completed" : ""}" onfocus="getCurrentSubTask(this)" onblur="editSubTask(this)">
        <i class="fa-trash sub_task" onclick="removeSubTask(this)">Delete</i>`;

  ul.appendChild(li);
  event.parentNode.appendChild(ul);
  

}

// store current subtask to track changes
var currentSubTask = null;

// get current subtask
function getCurrentSubTask(event) {
  currentSubTask = event.value;
}

//function to remove subtask
function removeSubTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  
  tasks.forEach(task => {
    if (task.task === event.parentNode.parentNode.parentNode.parentNode.children[1].value) {
      task.subtasks.forEach(subtask => {
        if (subtask.description === event.parentNode.children[1].value) {
          // delete subtask
          console.log(subtask);
          task.subtasks.splice(task.subtasks.indexOf(subtask), 1);
        }
      });
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove();
}



// function to edit subtask
function editSubTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.parentNode.parentNode.children[1].value) {
      task.subtasks.forEach(subtask => {
        if (subtask === currentSubTask) {
          subtask = event.value;
        }
      });
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}







