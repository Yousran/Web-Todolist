import { Task } from './task.js';
import { LocalStorage } from './local-storage.js';
import { TaskShow } from './task-show.js';

export class TaskAdd {
    constructor() {
        // Event listener untuk checkbox bintang
        document.getElementById('important').addEventListener('change', this.toggleImportantIcon);

        // Event listener untuk tombol tambah task
        document.getElementById('addTask').addEventListener('click', () => this.addTask());
    }

    static displayFormAddTask(display){
        const taskForm = document.getElementById('taskFormContainer');
        if (display) {
            taskForm.style.display = 'block';
        }else{
            taskForm.style.display = 'none';
        }
    }

    toggleImportantIcon() {
        const icon = this.nextElementSibling;
        if (this.checked) {
            icon.innerHTML = "<i class='bx bxs-star important-checked'></i>";
        } else {
            icon.innerHTML = "<i class='bx bx-star'></i>";
        }
    }

    addTask() {
        const taskName = document.getElementById('taskName').value;
        const taskDate = document.getElementById('taskDate').value;
        const isImportant = document.getElementById('important').checked;

        // Mendapatkan username pengguna yang sedang login
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const username = userData ? userData.username : 'Guest';

        console.log("Task Name:", taskName);
        console.log("Task Date:", taskDate);
        console.log("Is Important:", isImportant);
        console.log("Username:", username);

        if (taskName) {
            const task = new Task(taskName, taskDate, isImportant, username);

            // Ambil task yang ada di localStorage
            const tasks = LocalStorage.getTasksFromStorage();
            tasks.push(task);
            LocalStorage.saveTasksToStorage(tasks);

            console.log("Task added:", task);
            document.getElementById('taskForm').reset();
            document.querySelector('.important-checkbox i').className = 'bx bx-star';

            TaskShow.displayTasks();
        }
    }
}