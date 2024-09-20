export class Task {
    constructor(project, title, description, dueDate, priority, completed = false) {
        this.project = project;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
    }
}

