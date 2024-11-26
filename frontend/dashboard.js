const API_URL = 'https://taskmaster-lwpe.onrender.com';  // Update if necessary
// Fetch user tasks from the backend
async function fetchTasks() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view tasks.");
        window.location.href = "login.html";  // Redirect to login if no token
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                "Authorization": `Bearer ${token}`,  // Send JWT in the Authorization header
            },
        });

        const data = await response.json();

        if (response.ok) {
            renderTasks(data.tasks);  // Render the fetched tasks
        } else {
            alert(data.message || "Error fetching tasks.");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Error fetching tasks.");
    }
}

// Initialize dashboard by fetching tasks
fetchTasks();

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

