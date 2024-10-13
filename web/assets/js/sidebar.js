import { TaskShow } from './task-show.js';

export class Sidebar {
    constructor() {
        this.initEventListeners(); // Inisialisasi event listener untuk menu
        this.updateProfileSection(); // Perbarui profil pengguna di sidebar
        
        // Tambahkan event listener untuk tombol Login dan Logout
        this.initAuthButtons();
        
        // Tambahkan event listener untuk username
        this.initUsernameClick();
    }

    // Fungsi untuk menambahkan event listener ke semua link menu di sidebar
    initEventListeners() {
        document.querySelectorAll('.sidebar a').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();  // Mencegah aksi default
                const menu = link.getAttribute('data-menu');
                this.selectMenu(menu);  // Panggil selectMenu dengan parameter menu
            });
        });
    }

    // Fungsi untuk menambahkan event listener untuk tombol Login dan Logout
    initAuthButtons() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        loginBtn.addEventListener('click', () => this.redirectLogin());
        logoutBtn.addEventListener('click', () => this.redirectLogout());
    }

    // Fungsi untuk menambahkan event listener pada elemen username
    initUsernameClick() {
        const sidebarUsername = document.getElementById('sidebar-username');
        sidebarUsername.addEventListener('click', () => this.toggleAuthButtons());
    }

    // Fungsi untuk menampilkan menu berdasarkan pilihan
    selectMenu(menu) {
        // Objek pemetaan antara teks konten dan nama kelas
        const menuIconMap = {
            'Home': 'home',
            'Important': 'star',
            'Scheduled': 'calendar',
            'Tasks': 'tasks',
            'Overdue': 'alert'
        };

        document.querySelectorAll('.sidebar a').forEach(link => {
            // Hapus kelas 'active' dari semua link
            link.classList.remove('active');
            
            // Ambil teks konten dan sesuaikan dengan kelas yang benar
            const linkText = link.textContent.trim();
            const icon = link.querySelector('i');
            
            // Ambil nama kelas yang sesuai dari objek pemetaan
            const iconClassName = menuIconMap[linkText];
            
            if (iconClassName) {
                icon.classList.remove('bxs-' + iconClassName);
                icon.classList.add('bx-' + iconClassName);
            }
        });

        // Menandai link yang dipilih sebagai 'active'
        const selectedLink = document.getElementById(menu + '-link');
        if (selectedLink) {
            selectedLink.classList.add('active');
            
            const selectedIcon = selectedLink.querySelector('i');
            if (selectedIcon) {
                const selectedLinkText = selectedLink.textContent.trim();
                const selectedIconClassName = menuIconMap[selectedLinkText];
                
                if (selectedIconClassName) {
                    selectedIcon.classList.remove('bx-' + selectedIconClassName);
                    selectedIcon.classList.add('bxs-' + selectedIconClassName);
                }
            }
        }


        // Panggil metode TaskShow berdasarkan menu yang dipilih
        switch (menu) {
            case 'home':
                TaskShow.displayTasks();  // Tampilkan semua task
                break;
            case 'star':
                TaskShow.displayImportantTasks();  // Tampilkan task penting
                break;
            case 'calendar':
                TaskShow.displayTasksWithDate();  // Tampilkan task dengan tanggal
                break;
            case 'tasks':
                TaskShow.displayTasksWithoutDate();  // Tampilkan task tanpa tanggal
                break;
            case 'alert':
                TaskShow.displayExpiredTasks();  // Tampilkan task yang sudah lewat
                break;
            default:
                TaskShow.displayTasks();  // Default kembali ke home
                break;
        }
    }

    // Fungsi untuk toggle auth buttons (Login/Logout)
    toggleAuthButtons() {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        // Tampilkan atau sembunyikan tombol berdasarkan status login
        if (userData) {
            // Toggle tampilan logout button
            if (logoutBtn.style.display === "none") {
                logoutBtn.style.display = "block";
                loginBtn.style.display = "none";
            } else {
                logoutBtn.style.display = "none";
            }
        } else {
            // Toggle tampilan login button
            if (loginBtn.style.display === "none") {
                loginBtn.style.display = "block";
                logoutBtn.style.display = "none";
            } else {
                loginBtn.style.display = "none";
            }
        }
    }

    // Fungsi untuk memperbarui bagian profil di sidebar
    updateProfileSection() {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const sidebarUsername = document.getElementById('sidebar-username');

        if (userData) {
            sidebarUsername.textContent = userData.username;
            sidebarUsername.style.cursor = 'pointer'; // Menunjukkan bahwa username dapat diklik
            this.toggleAuthButtons(); // Perbarui tombol login/logout
            this.toggleAuthButtons(); // Perbarui tombol login/logout
        } else {
            sidebarUsername.textContent = 'Guest';
            sidebarUsername.style.cursor = 'default'; // Menghilangkan efek klik pada guest
            this.toggleAuthButtons(); // Perbarui tombol login/logout
            this.toggleAuthButtons(); // Perbarui tombol login/logout
        }
    }

    // Fungsi untuk mengarahkan ke halaman login
    redirectLogin() {
        window.location.href = './login.html';
    }

    // Fungsi untuk logout dan menghapus session
    redirectLogout() {
        sessionStorage.removeItem('user');  // Hapus user dari session
        location.reload();
        this.updateProfileSection();
    }
}