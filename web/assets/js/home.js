import { Sidebar } from './sidebar.js';
import { TaskAdd } from './task-add.js';
import { TaskShow } from './task-show.js';

// Inisialisasi sidebar
new Sidebar();

// Inisialisasi form task
new TaskAdd();

// Tampilkan task pada halaman home
TaskShow.displayTasks();