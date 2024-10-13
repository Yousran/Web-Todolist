import { User } from './user.js';
import { LocalStorage } from "./local-storage.js";

// sessionStorage sama localStorage itu penyimpanan di browser. karena tidak bisa menggunakan database atau server jadi datanya disimpan di sini.

// Fungsi untuk menampilkan error message
function showErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'block';
    errorMessage.textContent = message;
}

function validateLogin(inputUsername, inputPassword, user) {
    return user.username === inputUsername && user.password === inputPassword;
}

// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = LocalStorage.getUsersFromStorage();

    const foundUser = users.find(user => validateLogin(username, password, user));

    if (foundUser) {
        // Simpan user ke sessionStorage
        sessionStorage.setItem('user', JSON.stringify(foundUser));
        window.location.href = 'home.html';
    } else {
        showErrorMessage("Invalid username or password!");
    }
});

// Register form submission
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    let users = LocalStorage.getUsersFromStorage();

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        showErrorMessage("Username already exists!");
    } else {
        // Tambahkan user baru ke array
        const newUser = new User(username, password);
        users.push(newUser);

        // Simpan user baru ke localStorage
        LocalStorage.saveUsersToStorage(users);

        window.location.href = 'login.html';
    }
});

// Logout function
document.getElementById('logoutButton')?.addEventListener('click', function() {
    sessionStorage.removeItem('user');  // Hapus user dari session
    location.reload();  // Refresh halaman setelah logout

    // Reset tampilan sidebar ke guest setelah logout
    document.getElementById('sidebar-username').textContent = 'Guest';
    document.getElementById("logoutButton").style.display = "none";
    document.getElementById("loginButton").style.display = "block";
});

// Update sidebar dengan informasi user yang sedang login
const userData = JSON.parse(sessionStorage.getItem('user'));
if (userData) {
    // Ubah sidebar username dan email berdasarkan data user yang login
    document.getElementById('sidebar-username').textContent = userData.username;
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("logoutButton").style.display = "block";
}
