// On app load, get all tasks from localStorage
window.onload = loadTasks;
let identity=0;

window.addEventListener("load", reminder);


// On submitting the form list_of_tasks, add task
document.querySelector("form[name='list_of_tasks']").addEventListener("submit", e => {
  e.preventDefault();
  addTask();
});

//on clicking sort_now button, sort tasks
document.querySelector(".sort_now").addEventListener("click", e => {
  e.preventDefault();
  sortTasks();
});

//on clicking filter_now button, filter tasks
document.querySelector(".filter_now").addEventListener("click", e => {
  e.preventDefault();
  filterTasks();
});

//on clicking clear_all button, clear all tasks
document.querySelector(".clear_all").addEventListener("click", e => {
  e.preventDefault();
  localStorage.clear();
  location.reload();
});

//on clicking search button, search tasks
document.querySelector(".search_now").addEventListener("click", e => {
  e.preventDefault();
  searchTasks();
});

//on clicking clear_search button, clear search
document.querySelector(".clear_search").addEventListener("click", e => {
  e.preventDefault();
  document.querySelector(".search_query").value = "";
  location.reload();
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
      li.innerHTML = `<div class="main_task">
      <input type="checkbox" onclick="taskComplete(this)" class="check ${task.completed ? "completed" : ""}">
        <input type="text" value="${task.task}" class="task_desc ${task.completed ? "completed" : ""}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
        <button class="add_subtask" onclick="addSubTask(this)">+</button>
        <input type="text" value="${task.category}" class="task_cat ${task.completed ? "completed" : ""}" onfocus="getCurrentCategory(this)" onblur="editCategory(this)">
        <input type="date" value="${(task.due_date)}" class="task_due ${task.completed ? "completed" : ""}" onfocus="getCurrentDueDate(this)" onblur="editDueDate(this)">
        <i class="priority_display ${task.priority}">${task.priority}</i>
        <i class="fa-trash" onclick="removeTask(this)">Delete Task</i>
        </div>`;

      li.setAttribute('id',identity++);
      
      // check if task has subtasks
      if (task.subtasks!=null && task.subtasks.length > 0) {
        const div = document.createElement("div");
        div.classList.add("subtasks");
        task.subtasks.forEach(subtask => {
          const ul = document.createElement("ul");
          const li = document.createElement("li");
          li.innerHTML = `<div class="subtask">
                <input type="checkbox" onclick="subTaskComplete(this)" class="check sub_task" ${subtask.completed ? "checked" : ""}>
                <input type="text" value="${subtask.description}" class="task_desc sub_task ${subtask.completed ? "completed" : ""}" onfocus="getCurrentSubTask(this)" onblur="editSubTask(this)">
                <i class="fa-trash sub_task" onclick="removeSubTask(this)">Delete subTask</i>
                </div>`;
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
  //html contains a div for main task 

  const li = document.createElement("li");
  li.innerHTML = `<div class="main_task">
    <input type="checkbox" onclick="taskComplete(this)" class="check">
      <input type="text" value="${task.value}" class="task_desc" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <button class="add_subtask" onclick="addSubTask(this)">+</button>
      <input type="text" value="${category.value}" class="task_cat" onfocus="getCurrentCategory(this)" onblur="editCategory(this)">
      <input type="date" value="${(due_date.value)}" class="task_due" onfocus="getCurrentDueDate(this)" onblur="editDueDate(this)">
      <i class="priority_display ${priority.value}">${priority.value}</i>
      <i class="fa-trash" onclick="removeTask(this)">Delete Task</i>
      </div>`;
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

//ceate a map for priority
var priorityMap = new Map();
priorityMap.set("low",1);
priorityMap.set("medium",2);
priorityMap.set("high",3);


// function to sort tasks
function sortTasks() {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  const sort_by = document.querySelector(".sort_by").value;
  if (sort_by === "due_date") {
    tasks.sort((a, b) => {
      return new Date(b.due_date) - new Date(a.due_date);
    });
  } else if (sort_by === "priority") {
    tasks.sort((a, b) => {
      return priorityMap.get(a.priority) - priorityMap.get(b.priority);
    });
  } else if (sort_by === "completion") {
    tasks.sort((a, b) => {
      return b.completed - a.completed;
    });
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  location.reload();
}


// function to filter tasks 
function filterTasks() {
  
  const filter_by = document.querySelector(".filter_by").value;
  
  
  //if filter by is no_filter, turn the visibility of all tasks to visible
  if (filter_by === "no_filter") {
    document.querySelectorAll("li").forEach(li => {
      li.style.display = "block";
    });
  } else if (filter_by === "completed") {
    //if filter by is completed, turn the visibility of all completed tasks to visible
    document.querySelectorAll("li").forEach(li => {
      if (li.children[0].checked) {
        li.style.display = "block";
      } else {
        li.style.display = "none";
      }
    });
  } else if (filter_by === "incomplete") {
    //if filter by is incomplete, turn the visibility of all incomplete tasks to visible
    document.querySelectorAll("li").forEach(li => {
      if (!li.children[0].checked) {
        li.style.display = "block";
      } else {
        li.style.display = "none";
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
  li.innerHTML = `<div class="subtasks">
        <input type="checkbox" onclick="subTaskComplete(this)" class="check sub_task">
        <input type="text" value="${subtask.description}" class="task_desc sub_task ${subtask.completed ? "completed" : ""}" onfocus="getCurrentSubTask(this)" onblur="editSubTask(this)">
        <i class="fa-trash sub_task" onclick="removeSubTask(this)">Delete subTask</i>
        </div>`;

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

//function to give reminder
function reminder(){
  //store current date in a variable in the same format as due_date
  let curr_date = new Date();
  curr_date = curr_date.toISOString().slice(0,10);
  //get all tasks from local storage
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.due_date === curr_date) {
      alert("The Task '"+task.task+"' is due today!");
    }
  });
  
}

//adding search functionality for tasks
function searchTasks(){
 
  //get the search query
  const search_query = document.querySelector(".search_query").value.toLowerCase();
  //if the search query is present in the task, display the task else hide it
  document.querySelectorAll("li").forEach(li => {
    // check if the list item is a main task by looking for the main_task class
    if (li.children[0].classList.contains("main_task")) {
      // check if the search query is present in the task display the task else hide it
      if (li.children[0].children[1].value.toLowerCase().includes(search_query)) {
        li.style.display = "block";
      }
      else {
        li.style.display = "none";
      }
      console.log(li.children[0].children[1].value.toLowerCase());
      console.log(li.style.display);
    }
    else{
      // check if the search query is present in the subtask diplay the task else hide it
      //console.log(li.children[0].children[1].value.toLowerCase());
      if (li.children[0].children[1].value.toLowerCase().includes(search_query)) {
        li.parentNode.parentNode.parentNode.style.display = "block";
      }

    }
  });
}











