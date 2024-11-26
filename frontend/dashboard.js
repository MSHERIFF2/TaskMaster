const API_URL = 'https://taskmaster-lwpe.onrender.com/api';  // Update if necessary
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

// Handle the task creation modal
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const taskForm = document.getElementById('task-form');

// Open the modal when "Add Task" button is clicked
addTaskBtn.addEventListener('click', () => {
    taskModal.style.display = 'block';
});

// Close the modal when "Close" button is clicked
closeModalBtn.addEventListener('click', () => {
    taskModal.style.display = 'none';
});

// Handle form submission for task creation
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const priority = document.getElementById('task-priority').value;
    const deadline = document.getElementById('task-deadline').value;

    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to create a task.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                description,
                priority,
                deadline,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Task created successfully.");
            fetchTasks();  // Re-fetch tasks to include the newly created task
            taskModal.style.display = 'none';  // Close the modal
        } else {
            alert(data.message || "Error creating task.");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Error creating task.");
    }
});