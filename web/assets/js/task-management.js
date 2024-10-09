import { User } from './user.js';

// Ambil task dari localStorage berdasarkan username yang login
function getTasksFromStorage(username) {
    const userTasksData = localStorage.getItem(`tasks_${username}`);
    return userTasksData ? JSON.parse(userTasksData) : [];
}

// Simpan task ke localStorage berdasarkan username hanya jika user sudah login
function saveTasksToStorage(username, tasks) {
    if (username) { // Simpan hanya jika username ada (artinya bukan guest)
        localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
    }
}

// Function to check if user is guest and disable the add task button
function checkUserStatus() {
    const userData = JSON.parse(sessionStorage.getItem('user'));

    // Dapatkan referensi tombol
    const addTaskButton = document.getElementById('submit-task-btn');

    if (!userData) {
        addTaskButton.disabled = true; // Nonaktifkan tombol jika guest
        alert("You must log in to add tasks."); // Tampilkan alert jika guest
    } else {
        addTaskButton.disabled = false; // Aktifkan tombol jika user terdaftar
    }
}

// Add Task Functionality (pastikan user sudah login)
document.getElementById('submit-task-btn').addEventListener('click', function () {
    const userData = JSON.parse(sessionStorage.getItem('user'));

    // Jika user tidak ada (guest), tampilkan alert dan keluar dari fungsi
    if (!userData) {
        alert("You must log in to add tasks.");
        return;
    }

    const taskInput = document.getElementById('task-input').value;
    const dueDate = document.getElementById('due-date-input').value;
    const isImportant = document.getElementById('priority-btn').classList.contains('important'); // Cek apakah task penting

    if (taskInput.trim() !== '') {
        const task = {
            id: Date.now(), // Tambahkan ID unik berdasarkan timestamp
            text: taskInput,
            dueDate: dueDate,
            isImportant: isImportant, // Status penting dari tombol
            isCompleted: false
        };

        // Ambil task yang tersimpan untuk user yang sedang login
        let userTasks = getTasksFromStorage(userData.username);
        userTasks.push(task);
        saveTasksToStorage(userData.username, userTasks); // Hanya simpan jika user login

        renderTasks();  // Render ulang tasks setelah ditambahkan
        document.getElementById('task-input').value = '';  // Clear input
        document.getElementById('due-date-input').value = ''; // Clear due date input

        // Reset status tombol priority-btn setelah task ditambahkan
        document.getElementById('priority-btn').classList.remove('important');
    } else {
        alert("Please enter a task.");
    }
});

// Render Tasks (hanya jika user sudah login)
function renderTasks() {
    const userData = JSON.parse(sessionStorage.getItem('user'));

    // Jika user tidak ada (guest), jangan render tasks
    if (!userData) {
        const taskContainer = document.getElementById('my-day-task-list');
        taskContainer.innerHTML = ''; // Kosongkan daftar task
        const importantTaskContainer = document.getElementById('important-task-list');
        importantTaskContainer.innerHTML = ''; // Kosongkan daftar task penting
        const allTaskContainer = document.getElementById('all-task-list');
        allTaskContainer.innerHTML = ''; // Kosongkan daftar semua task
        return;
    }

    const taskContainer = document.getElementById('my-day-task-list');
    taskContainer.innerHTML = ''; 

    const suggestionsContainer = document.getElementById('suggestions-list');
    suggestionsContainer.innerHTML = '';

    const importantTaskContainer = document.getElementById('important-task-list');
    importantTaskContainer.innerHTML = ''; // Kosongkan daftar important tasks

    const allTaskContainer = document.getElementById('all-task-list');
    allTaskContainer.innerHTML = ''; // Kosongkan daftar all tasks

    let userTasks = getTasksFromStorage(userData.username);

    userTasks.forEach((task) => {
        // Buat task untuk daftar "My Day"
        const li = createTaskListItem(task);
        taskContainer.appendChild(li);

        // Buat task untuk daftar suggestions
        const suggestionLi = createTaskListItem(task, true);
        suggestionsContainer.appendChild(suggestionLi);

        // Jika task penting, tambahkan ke daftar important
        if (task.isImportant) {
            const importantLi = createTaskListItem(task);
            importantTaskContainer.appendChild(importantLi);
        }

        // Buat task untuk daftar "All Tasks"
        const allTaskLi = createTaskListItem(task);
        allTaskContainer.appendChild(allTaskLi);
    });

    attachCheckboxListeners(userData.username);
    attachDeleteTaskListeners(userData.username);
    attachImportantTaskListeners(userData.username); // Listener untuk tombol penting
    renderCompletedTasks();  // Re-render completed tasks
}


// Fungsi untuk membuat elemen tanggal dan waktu yang tersisa
function createDateElement(dueDate) {
    const dateElem = document.createElement('small');
    dateElem.classList.add('me-3', 'text-light');

    const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString('id-ID', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    }) : "No due date";

    dateElem.textContent = formattedDate;
    return dateElem;
}

// Fungsi untuk memperbarui waktu yang tersisa
function createTimeRemainingElement(dueDate) {
    const timeRemainingElem = document.createElement('small');
    timeRemainingElem.classList.add('me-3', 'text-light');

    const updateTimeRemaining = () => {
        const timeRemaining = dueDate ? calculateTimeRemaining(dueDate) : "No due date";
        timeRemainingElem.textContent = timeRemaining;
    };

    // Perbarui waktu setiap 1 detik
    setInterval(updateTimeRemaining, 1000);
    
    // Awal waktu
    updateTimeRemaining();

    return timeRemainingElem;
}

// Fungsi utama untuk membuat item daftar tugas
function createTaskListItem(task, isSuggestion = false) {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    li.style.borderRadius = '20px'; // Tambahkan border radius di sini
    li.style.width = '100%';

    // Membuat elemen untuk tanggal dan waktu yang tersisa
    const dateElem = createDateElement(task.dueDate);
    const timeRemainingElem = createTimeRemainingElement(task.dueDate);

    li.innerHTML = `
        <div class="d-flex align-items-center">
            <input type="checkbox" class="me-2 task-checkbox" data-id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
            <span>${task.text}</span>
        </div>
        <div class="d-flex align-items-center">
            ${dateElem.outerHTML}
            ${timeRemainingElem.outerHTML}
            <button class="btn btn-warning btn-sm important-task-btn" data-id="${task.id}">
                <i class="fa fa-star ${task.isImportant ? 'text-warning' : 'text-muted'}"></i>
            </button>
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
            
            // Tampilkan overlay dan div konfirmasi
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('confirmDeleteDiv').style.display = 'block';

            const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
            const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

            confirmDeleteBtn.onclick = function () {
                let userTasks = getTasksFromStorage(username);
                userTasks = userTasks.filter(task => task.id !== taskId);
                saveTasksToStorage(username, userTasks);
                renderTasks(); 
                // Sembunyikan overlay dan div setelah menghapus
                document.getElementById('overlay').style.display = 'none';
                document.getElementById('confirmDeleteDiv').style.display = 'none';
            };

            cancelDeleteBtn.onclick = function () {
                // Sembunyikan overlay dan div jika dibatalkan
                document.getElementById('overlay').style.display = 'none';
                document.getElementById('confirmDeleteDiv').style.display = 'none';
            };
        });
    });
}

// Attach Listener for Important Task Button
function attachImportantTaskListeners(username) {
    const importantButtons = document.querySelectorAll('.important-task-btn');
    importantButtons.forEach(button => {
        button.addEventListener('click', function () {
            const taskId = parseInt(this.dataset.id);
            let userTasks = getTasksFromStorage(username);
            const task = userTasks.find(task => task.id === taskId);
            if (task) {
                task.isImportant = !task.isImportant;  // Toggle important status
                saveTasksToStorage(username, userTasks);
                renderTasks();  // Re-render the tasks
            }
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
// Function to calculate and format time remaining until the due date
function calculateTimeRemaining(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - today; // Selisih waktu dalam milidetik

    if (timeDiff > 0) {
        // Konversi milidetik menjadi hari, jam, menit, dan detik
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (timeDiff === 0) {
        return "Due today";
    } else {
        return "Overdue";
    }
}

// Tombol Priority untuk menandai task sebagai penting saat task dibuat
document.getElementById('priority-btn').addEventListener('click', function() {
    this.classList.toggle('important');
});

// Cek status user dan atur tombol pada inisialisasi
checkUserStatus();









