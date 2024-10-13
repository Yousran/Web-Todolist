export class Task {
    constructor(name, date, important, username, done = false) {
        this.name = name;
        this.date = date;
        this.important = important;
        this.username = username;
        this.done = done;
        this.createdAt = new Date().toISOString();
    }
}