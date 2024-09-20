import "./style.css";
import * as taskManager from "./tasks.js";
import * as projectManager from "./projects.js";
import { isToday, parseISO, format } from "date-fns";

const inbox = document.querySelector(".inbox");
const today = document.querySelector(".today");


const addProjectButton = document.querySelector(".add-project");
const addTaskButton = document.querySelector(".add-task");
const createProjectTemplate = document.querySelector(".create-project-template");
const createProjectButton = document.querySelector(".create-project-button");
const projectName = document.getElementById("project-name");
const projectsOnThePage = document.querySelector(".projects");
const createTaskTemplate = document.querySelector(".create-task-template");
const addToTheProject = document.getElementById("add-to-project");
const createTaskButton = document.querySelector(".create-task-button");
const tasksInProject = document.querySelector(".tasks-in-project");
const taskDetails = document.querySelector(".task-details");
const editTaskForm = document.querySelector(".edit-task");
const mainBarTitle = document.querySelector(".main-bar-title");

const tasks = [{ project: "Programming", title: "Todo List", description: "Create a todo list project", dueDate: "2024-09-22", priority: "High", completed: true },
{ project: "Programming", title: "Code quality", description: "Improve your code quality", dueDate: "2024-12-31", priority: "High", completed: false },
{ project: "Sport", title: "100 push ups", description: "Do 100 push ups right now.", dueDate: "2024-09-19", priority: "Medium", completed: true },
{ project: "Sport", title: "30 pull-ups", description: "Do 30 pull-ups in the row", dueDate: "2024-09-29", priority: "High", completed: false },
{ project: "Study", title: "Learn new words", description: "Learn 30 new English words", dueDate: "2024-09-19", priority: "Low", completed: true },
{ project: "Study", title: "Notes", description: "Take a few notes on some of the useful concepts that you have learned during this project.", dueDate: "2024-09-21", priority: "Medium", completed: false }
];
const projects = [{ name: "Programming" }, { name: "Sport" }, { name: "Study" }];
let currentProject = null;


function saveTaskToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasksFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
        tasks.length = 0;
        tasks.push(...storedTasks);
    }
}

function saveProjectToLocalStorage() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

function loadProjectsFromLocalStorage() {
    const storedProject = JSON.parse(localStorage.getItem("projects"));
    if (storedProject) {
        projects.length = 0;
        projects.push(...storedProject);
    }
}

loadTasksFromLocalStorage()
loadProjectsFromLocalStorage()
projects.forEach(addNewProjectToDisplay);
mainBarTitle.textContent = "Inbox";
displayAllTasks();

addProjectButton.addEventListener("click", () => {
    mainBarTitle.textContent = "";
    createProjectTemplate.style.display = "flex";
    createTaskTemplate.style.display = "none";
    tasksInProject.style.display = "none";
    taskDetails.style.display = "none";


})

createProjectButton.addEventListener("click", () => {
    if (projectName.value) {
        const createdProject = new projectManager.Project(projectName.value);
        projects.push(createdProject);
        createProjectTemplate.style.display = "none";
        projectName.value = "";
        addNewProjectToDisplay(createdProject);
        saveProjectToLocalStorage();
    }
    else {
        alert("The project name field must be fulfilled");
    }
})


function addNewProjectToDisplay(project) {
    const projectItem = document.createElement("div");
    projectItem.classList.add("hovering");
    projectItem.textContent = project.name;
    projectsOnThePage.appendChild(projectItem);


}

addTaskButton.addEventListener("click", () => {
    tasksInProject.style.display = "none";
    createProjectTemplate.style.display = "none";
    createTaskTemplate.style.display = "flex";
    taskDetails.style.display = "none";

    displayProjectsInSelect();
})


function displayProjectsInSelect() {
    addToTheProject.innerHTML = "";
    for (let i = 0; i < projects.length; i++) {
        const option = document.createElement("option");
        option.textContent = projects[i].name;
        addToTheProject.appendChild(option);
    }
}



createTaskButton.addEventListener("click", () => {
    editTaskForm.style.display = "none";
    createProjectTemplate.style.display = "none";
    createTaskTemplate.style.display = "none";
    tasksInProject.style.display = "grid";
    taskDetails.style.display = "none";
    storeTaskData();

    if (currentProject) {
        const projectTask = tasks.filter(task => task.project === currentProject);
        displayTasksInProject(projectTask);
    } else {
        mainBarTitle.textContent = "Inbox";
        displayTasksInProject(tasks);
    }


})

function storeTaskData() {
    let project = document.getElementById("add-to-project").value;
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let dueDate = document.getElementById("dueDate").value;
    let priority = document.getElementById("priority").value;
    if (title && description) {
        let task = new taskManager.Task(project, title, description, dueDate, priority);
        tasks.push(task);
        saveTaskToLocalStorage();
        createTaskTemplate.style.display = "none";
    } else {
        alert("Fill in the Title and Description fields.")
    }
}




projectsOnThePage.addEventListener("click", (e) => {
    createProjectTemplate.style.display = "none";
    createTaskTemplate.style.display = "none";
    tasksInProject.style.display = "grid";
    taskDetails.style.display = "none";

    tasksInProject.innerHTML = "";

    const selectedProject = e.target.textContent;
    currentProject = selectedProject;
    mainBarTitle.textContent = selectedProject;
    let projectTask = tasks.filter(task => task.project === selectedProject);
    displayTasksInProject(projectTask);

})

function displayTasksInProject(arr) {
    tasksInProject.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {

        const taskbox = document.createElement("div");
        taskbox.classList.add("taskbox");


        if (arr[i].completed) {
            taskbox.classList.add("completed");
        }


        const taskTitle = document.createElement("div");
        taskTitle.textContent = arr[i].title;
        const taskDate = document.createElement("div");
        if (arr[i].dueDate) {
            taskDate.textContent = format(new Date(arr[i].dueDate), "dd/MM/yyyy");
        } else {
            taskDate.textContent = "No Date";
        }
        const removeTaskButton = document.createElement("button");
        removeTaskButton.textContent = "delete";
        removeTaskButton.classList.add("remove-task-button");
        removeTask(removeTaskButton, i);

        const editTaskButton = document.createElement("button");
        editTaskButton.textContent = "edit";
        editTaskButton.classList.add("edit-task-button");
        editTask(editTaskButton, i, arr);


        const completeTaskButton = document.createElement("button");
        completeTaskButton.textContent = "complete";
        completeTaskButton.classList.add("complete-task-button");
        completeTask(completeTaskButton, arr[i], taskbox);

        const taskButtons = document.createElement("div");
        taskButtons.classList.add(".task-buttons");
        taskButtons.appendChild(removeTaskButton);
        taskButtons.appendChild(editTaskButton);
        taskButtons.appendChild(completeTaskButton);

        taskbox.appendChild(taskTitle);
        taskbox.appendChild(taskDate);
        taskbox.appendChild(taskButtons);
        taskbox.addEventListener("click", () => displayTaskDetails(arr[i]));


        displayPriorityColor(arr[i], taskbox);

        tasksInProject.appendChild(taskbox);
        saveProjectToLocalStorage()


    }
}

function displayTaskDetails(task) {
    tasksInProject.style.display = "none";
    taskDetails.style.display = "block";
    taskDetails.innerHTML = "";
    const detailedTask = document.createElement("div");
    detailedTask.classList.add("detailed-task");
    const taskTitle = document.createElement("div");
    taskTitle.textContent = `Title: ${task.title}`;
    const taskDescription = document.createElement("div");
    taskDescription.textContent = `Description: ${task.description}`;
    const taskDate = document.createElement("div");
    if (task.dueDate) {
        taskDate.textContent = `Date: ${format(new Date(task.dueDate), "dd/MM/yyyy")}`;
    } else {
        taskDate.textContent = "";
    }

    const taskPriority = document.createElement("div");
    taskPriority.textContent = `Priority: ${task.priority}`;

    const goBack = document.createElement("button");
    goBack.textContent = "<=";
    goBack.classList.add("go-back-button");
    goBack.addEventListener("click", () => {
        goBackToTasks();
    })

    detailedTask.appendChild(taskTitle);
    detailedTask.appendChild(taskDescription);
    detailedTask.appendChild(taskDate);
    detailedTask.appendChild(taskPriority);
    detailedTask.appendChild(goBack);

    taskDetails.appendChild(detailedTask);

}

function goBackToTasks() {
    tasksInProject.style.display = "grid";
    taskDetails.style.display = "none";
}


function removeTask(button, taskIndex) {
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        tasks.splice(taskIndex, 1);
        saveTaskToLocalStorage();
        displayTasksInProject(tasks);
    })
}


function displayProjectsInSelectEdit() {
    const editProjectSelect = document.getElementById("edit-to-project");
    editProjectSelect.innerHTML = "";
    for (let i = 0; i < projects.length; i++) {
        const option = document.createElement("option");
        option.textContent = projects[i].name;
        editProjectSelect.appendChild(option);
    }
}


function completeTask(button, task, div) {
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        task.completed = !task.completed;
        if (task.completed) {
            div.classList.add("completed");
            saveTaskToLocalStorage();

        } else {
            div.classList.remove("completed");
            saveTaskToLocalStorage();


        }

    })
}

function displayPriorityColor(task, div) {
    {
        if (task.priority === "High") {
            div.style.border = "2px solid red";
        } else if (task.priority === "Medium") {
            div.style.border = "2px solid orange";
        } else if (task.priority === "Low") {
            div.style.border = "2px solid green";
        }
    }
}


let editingTaskIndex = null;

function editTask(button, taskIndex, arr) {
    displayProjectsInSelectEdit();
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        editTaskForm.style.display = "flex";
        createProjectTemplate.style.display = "none";
        createTaskTemplate.style.display = "none";
        tasksInProject.style.display = "none";
        taskDetails.style.display = "none";

        editingTaskIndex = taskIndex;

        const project = document.querySelector("#edit-to-project");
        project.value = arr[taskIndex].project;

        const title = document.querySelector("#edit-title");
        title.value = arr[taskIndex].title;

        const description = document.querySelector("#edit-description");
        description.value = arr[taskIndex].description;

        const date = document.querySelector("#edit-dueDate");
        date.value = arr[taskIndex].dueDate;

        const priority = document.querySelector("#edit-priority");
        priority.value = arr[taskIndex].priority;

        saveEditedTask();
        saveTaskToLocalStorage();
    })
}

function storeEditedTaskData() {
    let project = document.getElementById("edit-to-project").value;
    let title = document.getElementById("edit-title").value;
    let description = document.getElementById("edit-description").value;
    let dueDate = document.getElementById("edit-dueDate").value;
    let priority = document.getElementById("edit-priority").value;

    if (title && description) {
        tasks[editingTaskIndex] = new taskManager.Task(project, title, description, dueDate, priority);
        createTaskTemplate.style.display = "none";
        editingTaskIndex = null;
        saveTaskToLocalStorage();
        displayTasksInProject(tasks);
    } else {
        alert("Fill in the Title and Description fields.")
    }
}

function saveEditedTask() {

    const saveButton = document.querySelector(".save-task-button");
    saveButton.addEventListener("click", () => {
        editTaskForm.style.display = "none";
        createProjectTemplate.style.display = "none";
        createTaskTemplate.style.display = "none";
        tasksInProject.style.display = "grid";
        taskDetails.style.display = "none";
        if (editingTaskIndex !== null) {
            storeEditedTaskData();
            saveTaskToLocalStorage();

        }

    })
}



inbox.addEventListener("click", () => {
    mainBarTitle.textContent = "Inbox";
    displayAllTasks();
})


function displayAllTasks() {
    createProjectTemplate.style.display = "none";
    createTaskTemplate.style.display = "none";
    tasksInProject.style.display = "grid";
    taskDetails.style.display = "none";
    displayTasksInProject(tasks);
}


today.addEventListener("click", () => {
    mainBarTitle.textContent = "Today";
    createProjectTemplate.style.display = "none";
    createTaskTemplate.style.display = "none";
    tasksInProject.style.display = "grid";
    taskDetails.style.display = "none";
    displayTasksToday();
})


function displayTasksToday() {
    let tasksToday = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].dueDate && isToday(parseISO(tasks[i].dueDate))) {
            tasksToday.push(tasks[i]);
        }
    }
    displayTasksInProject(tasksToday);
}