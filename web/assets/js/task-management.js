// Ambil task dari localStorage berdasarkan username yang login
function getTasksFromStorage(username) {
    const userTasksData = localStorage.getItem(`tasks_${username}`);
    return userTasksData ? JSON.parse(userTasksData) : [];
}

// Simpan task ke localStorage berdasarkan username
function saveTasksToStorage(username, tasks) {
    localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
}

// Cek status login saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const addTaskButton = document.getElementById('submit-task-btn');
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');

    // Jika user belum login, tombol "Add Task" akan disabled
    if (!userData) {
        addTaskButton.disabled = true;
        addTaskButton.addEventListener('click', function () {
            alert("Please login to add tasks.");
            
            // Hapus input task dan due date setelah alert
            taskInput.value = '';
            dueDateInput.value = '';
        });
    }
});

// Add Task Functionality (pastikan user sudah login)
document.getElementById('submit-task-btn').addEventListener('click', function () {
    const userData = JSON.parse(sessionStorage.getItem('user'));

    // Jika user tidak ada, return dan jangan proses lebih lanjut
    if (!userData) {
        return;
    }

    const taskInput = document.getElementById('task-input').value;
    const dueDate = document.getElementById('due-date-input').value;
    const isImportant = document.getElementById('priority-btn').classList.contains('important');

    if (taskInput.trim() !== '') {
        const task = {
            id: Date.now(), // Tambahkan ID unik berdasarkan timestamp
            text: taskInput,
            dueDate: dueDate,
            isImportant: isImportant,
            isCompleted: false
        };

        // Ambil task yang tersimpan untuk user yang sedang login
        let userTasks = getTasksFromStorage(userData.username);
        userTasks.push(task);
        saveTasksToStorage(userData.username, userTasks);

        renderTasks();
        document.getElementById('task-input').value = '';  // Clear input
        document.getElementById('due-date-input').value = ''; // Clear due date input
    } else {
        alert("Please enter a task.");
    }
});

function renderTasks() {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData) {
        return;
    }

    const taskContainer = document.getElementById('my-day-task-list');
    taskContainer.innerHTML = ''; 

    const suggestionsContainer = document.getElementById('suggestions-list');
    suggestionsContainer.innerHTML = '';

    let userTasks = getTasksFromStorage(userData.username);

    userTasks.forEach((task) => {
        const li = createTaskListItem(task);
        taskContainer.appendChild(li);

        const suggestionLi = createTaskListItem(task, true);
        suggestionsContainer.appendChild(suggestionLi);
    });

    attachCheckboxListeners(userData.username);
    attachDeleteTaskListeners(userData.username);
    renderCompletedTasks();  // Re-render completed tasks
}

function createTaskListItem(task, isSuggestion = false) {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    li.innerHTML = `
        <div class="d-flex align-items-center">
            <input type="checkbox" class="me-2 task-checkbox" data-id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
            <span>${task.text}</span>
        </div>
        <div class="d-flex align-items-center">
            <small class="text-muted me-3 " sytle ="color :#6c63ff;">${task.dueDate}</small>
            <button class="btn btn-danger btn-sm delete-task-btn" data-id="${task.id}" ${isSuggestion ? 'data-suggestion="true"' : ''}>
                <i class="fa fa-times"></i>
            </button>
        </div>
    `;
    return li;
}

// Attach Checkbox Listener
function attachCheckboxListeners(username) {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const taskId = parseInt(this.dataset.id);
            let userTasks = getTasksFromStorage(username);
            const task = userTasks.find(task => task.id === taskId);
            if (task) {
                task.isCompleted = this.checked;
                saveTasksToStorage(username, userTasks);
                renderTasks();  // Re-render tasks to reflect checkbox status
            }
        });
    });
}

// Attach Delete Task Listener
function attachDeleteTaskListeners(username) {
    const deleteButtons = document.querySelectorAll('.delete-task-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const taskId = parseInt(this.dataset.id);
            let userTasks = getTasksFromStorage(username);
            userTasks = userTasks.filter(task => task.id !== taskId); // Remove task by ID
            saveTasksToStorage(username, userTasks);
            renderTasks();  // Re-render the tasks in all panels
        });
    });
}

// Completed Task Render
function renderCompletedTasks() {
    const completedTasksContainer = document.getElementById('completed-tasks-list');
    completedTasksContainer.innerHTML = ''; 

    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData) {
        return;
    }

    let userTasks = getTasksFromStorage(userData.username);

    userTasks.forEach((task) => {
        if (task.isCompleted) {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.innerHTML = `
                <div>${task.text}</div>
                <button class="btn btn-danger btn-sm delete-task-btn" data-id="${task.id}">
                    <i class="fa fa-times"></i>
                </button>
            `;
            completedTasksContainer.appendChild(li);
        }
    });

    attachDeleteTaskListeners(userData.username);  // Reattach delete listeners to completed tasks
}


