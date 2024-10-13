import { LocalStorage } from "./local-storage.js";
import { TaskAdd } from "./task-add.js";

export class TaskShow {
    // Metode untuk menampilkan semua task
    static displayTasks() {
        const tasks = LocalStorage.getTasksFromStorage();
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const username = userData ? userData.username : 'Guest';
    
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
    
        // Filter tasks untuk pengguna yang sedang login
        const userTasks = tasks.filter(task => task.username === username);
    
        // Urutkan tasks berdasarkan tanggal pembuatan, terbaru pertama
        const sortedTasks = userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
        TaskAdd.displayFormAddTask(true); // Menampilkan form untuk menambahkan task        

        // Menampilkan tasks yang sudah diurutkan
        sortedTasks.forEach(task => {
            const taskItem = this.createTaskItem(task, 'displayTasks'); // Pass display method name as string
            taskList.appendChild(taskItem);
        });
    }            

    // Metode untuk menampilkan task yang penting
    static displayImportantTasks() {
        const tasks = LocalStorage.getTasksFromStorage();
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const username = userData ? userData.username : 'Guest';

        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Kosongkan daftar sebelum ditampilkan

        // Filter task penting milik pengguna yang sedang login
        const importantTasks = tasks.filter(task => task.important === true && task.username === username);
        
        TaskAdd.displayFormAddTask(false); // Menyembunyikan form penambahan task

        // Menampilkan tasks penting
        importantTasks.forEach(task => {
            const taskItem = this.createTaskItem(task, 'displayImportantTasks'); // Pass display method name as string
            taskList.appendChild(taskItem);
        });
    }

    // Metode untuk menampilkan task yang memiliki tanggal
    static displayTasksWithDate() {
        const tasks = LocalStorage.getTasksFromStorage();
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const username = userData ? userData.username : 'Guest';

        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Kosongkan daftar sebelum ditampilkan

        // Filter task dengan tanggal milik pengguna yang sedang login
        const tasksWithDate = tasks.filter(task => task.date && task.username === username && !task.done);

        TaskAdd.displayFormAddTask(false); // Menyembunyikan form penambahan task

        // Menampilkan tasks dengan tanggal
        tasksWithDate.forEach(task => {
            const taskItem = this.createTaskItem(task, 'displayTasksWithDate'); // Pass the displayTasksWithDate method directly
            taskList.appendChild(taskItem);
        });
    }

    // Metode untuk menampilkan task tanpa tanggal
    static displayTasksWithoutDate() {
        const tasks = LocalStorage.getTasksFromStorage();
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const username = userData ? userData.username : 'Guest';

        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Kosongkan daftar sebelum ditampilkan

        // Filter task tanpa tanggal milik pengguna yang sedang login
        const tasksWithoutDate = tasks.filter(task => !task.date && task.username === username && !task.done);

        TaskAdd.displayFormAddTask(false); // Menyembunyikan form penambahan task

        // Menampilkan tasks tanpa tanggal
        tasksWithoutDate.forEach(task => {
            const taskItem = this.createTaskItem(task, 'displayTasksWithoutDate'); // Pass the displayTasksWithoutDate method directly
            taskList.appendChild(taskItem);
        });
    }

    // Metode untuk menampilkan task yang sudah lewat
    static displayExpiredTasks() {
        const tasks = LocalStorage.getTasksFromStorage();
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const username = userData ? userData.username : 'Guest';

        const currentDate = new Date();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Kosongkan daftar sebelum ditampilkan

        // Filter task yang sudah lewat milik pengguna yang sedang login
        const expiredTasks = tasks.filter(task => new Date(task.date) < currentDate && task.username === username && !task.done);

        TaskAdd.displayFormAddTask(false); // Menyembunyikan form penambahan task

        // Menampilkan tasks yang sudah lewat
        expiredTasks.forEach(task => {
            const taskItem = this.createTaskItem(task, 'displayExpiredTasks'); // Pass the displayExpiredTasks method directly
            taskList.appendChild(taskItem);
        });
    }

    // Fungsi untuk membuat elemen task
    static createTaskItem(task, displayCallback) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('row', 'mt-3', 'me-1', 'p-2', 'border', 'rounded'); // Bootstrap layout classes

        // Create checkbox column
        const checkboxCol = document.createElement('div');
        checkboxCol.classList.add('col-auto', 'd-flex', 'align-items-center');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('form-check-input');
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => {
            TaskShow.toggleTaskDone(task, displayCallback); // Pass display method name
        });
        checkboxCol.appendChild(checkbox);

        // Create task name container
        const nameCol = document.createElement('div');
        nameCol.classList.add('col', 'd-flex', 'align-items-center');
        nameCol.textContent = `${task.name}`;

        // Create task date container
        const dateCol = document.createElement('div');
        dateCol.classList.add('col', 'd-flex', 'align-items-center');
        dateCol.textContent = `Date: ${task.date}`;

        // Create task importance container with star icon
        const importantCol = document.createElement('div');
        importantCol.classList.add('col-auto', 'd-flex', 'align-items-center');
        
        // Create the star icon and make it toggleable
        const importantIcon = document.createElement('i');
        importantIcon.className = task.important ? 'bx bxs-star important-checked' : 'bx bx-star'; // Toggle icon based on task importance
        
        importantIcon.addEventListener('click', () => {
            TaskShow.toggleTaskImportant(task, displayCallback); // Pass display method name
        });

        importantCol.appendChild(importantIcon);

        // Append all columns to the task item
        taskItem.appendChild(checkboxCol);
        taskItem.appendChild(nameCol);
        taskItem.appendChild(dateCol);
        taskItem.appendChild(importantCol);

        return taskItem; // Kembalikan elemen task
    }

    static toggleTaskDone(task, displayCallback) {
        task.done = !task.done; // Toggle done status
    
        // Update the task in localStorage
        LocalStorage.updateTask(task);
    
        // Call the display callback to refresh the task display
        TaskShow[displayCallback](); // Call the display method dynamically
    }    

    static toggleTaskImportant(task, displayCallback) {
        task.important = !task.important; // Toggle important status
    
        // Update the task in localStorage
        LocalStorage.updateTask(task);
    
        // Call the display callback to refresh the task display
        TaskShow[displayCallback](); // Call the display method dynamically
    }
}