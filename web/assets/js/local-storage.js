export class LocalStorage {
    static getUsersFromStorage() {
        const usersData = localStorage.getItem('users');
        return usersData ? JSON.parse(usersData) : [];
    }
    
    static saveUsersToStorage(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    static getTasksFromStorage() {
        const tasksData = localStorage.getItem('tasks');
        return tasksData ? JSON.parse(tasksData) : [];
    }
    
    static saveTasksToStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Fungsi baru untuk mendapatkan satu task berdasarkan createdAt
    static getTaskByCreatedAt(createdAt) {
        const tasks = this.getTasksFromStorage();
        return tasks.find(task => task.createdAt === createdAt) || null; // Jika tidak ketemu, kembalikan null
    }

    // Fungsi baru untuk memperbarui satu task
    static updateTask(updatedTask) {
        const tasks = this.getTasksFromStorage();
        const taskIndex = tasks.findIndex(task => task.createdAt === updatedTask.createdAt);
        if (taskIndex > -1) {
            tasks[taskIndex] = updatedTask; // Update task
            this.saveTasksToStorage(tasks); // Simpan kembali ke localStorage
        }
    }
}