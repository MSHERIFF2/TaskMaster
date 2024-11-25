
// Simulated backend data storage for tasks and users (for demonstration purposes only)
let tasks = [];
let users = [];
let currentUser = null;

// Utility to update local storage (if needed for persistence in this demo)
function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("users", JSON.stringify(users));
}

// Hero Page Logic (if needed, nothing for now)

// Login Page
if (document.querySelector("#login-form")) {
    const loginForm = document.querySelector("#login-form");
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        // Simulated login logic
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid email or password.");
        }
    });
}

// Register Page
if (document.querySelector("#register-form")) {
    const registerForm = document.querySelector("#register-form");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;

        // Basic validation
        if (!username || !email || !password) {
            alert("All fields are required!");
            return;
        }

        // Simulated registration logic
        users.push({ username, email, password });
        saveToLocalStorage();
        alert("Registration successful! Please log in.");
        window.location.href = "login.html";
    });
}

// Dashboard Page
if (document.querySelector("#dashboard-section")) {
    const taskList = document.querySelector(".task-list");
    const addTaskBtn = document.querySelector("#add-task-btn");
    const searchBar = document.querySelector("#search-bar");
    const priorityFilter = document.querySelector("#priority-filter");
    const dateFilter = document.querySelector("#date-filter");

    function renderTasks() {
        taskList.innerHTML = "";
        const filteredTasks = tasks.filter((task) => {
            const matchesPriority =
                priorityFilter.value === "all" || task.priority === priorityFilter.value;
            const matchesDate =
                !dateFilter.value || task.deadline === dateFilter.value;
            const matchesSearch =
                !searchBar.value ||
                task.title.toLowerCase().includes(searchBar.value.toLowerCase()) ||
                task.description
                    .toLowerCase()
                    .includes(searchBar.value.toLowerCase());

            return matchesPriority && matchesDate && matchesSearch;
        });

        filteredTasks.forEach((task) => {
            const taskCard = document.createElement("div");
            taskCard.classList.add("task-card");
            taskCard.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <p><strong>Deadline:</strong> ${task.deadline}</p>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            `;
            taskList.appendChild(taskCard);
        });
    }

    function addTask(title, description, deadline, priority) {
        tasks.push({
            id: Date.now(),
            title,
            description,
            deadline,
            priority,
            userId: currentUser ? currentUser.email : null,
        });
        saveToLocalStorage();
        renderTasks();
    }

    function editTask(id) {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        const title = prompt("Edit Title:", task.title);
        const description = prompt("Edit Description:", task.description);
        const deadline = prompt("Edit Deadline (YYYY-MM-DD):", task.deadline);
        const priority = prompt("Edit Priority (low, medium, high):", task.priority);

        if (title) task.title = title;
        if (description) task.description = description;
        if (deadline) task.deadline = deadline;
        if (priority) task.priority = priority;

        saveToLocalStorage();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter((task) => task.id !== id);
        saveToLocalStorage();
        renderTasks();
    }

    // Add task button logic
    addTaskBtn.addEventListener("click", () => {
        const title = prompt("Task Title:");
        const description = prompt("Task Description:");
        const deadline = prompt("Task Deadline (YYYY-MM-DD):");
        const priority = prompt("Task Priority (low, medium, high):");

        if (title && description && deadline && priority) {
            addTask(title, description, deadline, priority);
        } else {
            alert("All fields are required!");
        }
    });

    // Search bar and filters
    searchBar.addEventListener("input", renderTasks);
    priorityFilter.addEventListener("change", renderTasks);
    dateFilter.addEventListener("change", renderTasks);

    // Initial render
    renderTasks();
}
