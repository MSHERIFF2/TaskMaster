// API base URL for backend
const API_URL = 'http://localhost:5000/api';  // Update if necessary
const taskList = document.querySelector(".task-list");

// Register Page
if (document.querySelector("#register-form")) {
    const registerForm = document.querySelector("#register-form");

    // Handle form submission
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Collect form data
        const username = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;

        // Simple validation (ensure all fields are filled)
        if (!username || !email || !password) {
            alert("All fields are required!");
            return;
        }

        try {
            // Make POST request to register the user
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            // If registration is successful
            if (response.ok) {
                alert("Registration successful! Please log in.");
                window.location.href = "login.html"; // Redirect to login page
            } else {
                // If registration fails
                alert(data.message || "Something went wrong.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error registering user.");
        }
    });
}

// Login Page
if (document.querySelector("#login-form")) {
    const loginForm = document.querySelector("#login-form");

    // Handle form submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Collect form data
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        // Simple validation (ensure all fields are filled)
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            // Make POST request to login user
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            // If login is successful
            if (response.ok) {
                localStorage.setItem("token", data.token);  // Store JWT in localStorage
                alert("Login successful!");
                window.location.href = "dashboard.html";  // Redirect to dashboard
            } else {
                // If login fails
                alert(data.message || "Invalid credentials.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error logging in.");
        }
    });
}



function renderTasks(tasks) {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
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

