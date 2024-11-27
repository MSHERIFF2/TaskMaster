const taskList = document.querySelector(".task-list");
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
        console.log('API Response:', data); // Log the API response for debugging

        if (response.ok && data.tasks) {
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
document.addEventListener("DOMContentLoaded", function () {
    fetchTasks();
});

// Render the fetched tasks on the page
function renderTasks(tasks) {
    if (!Array.isArray(tasks)) {
        console.error("Expected tasks to be an array, but got:", tasks);
        return; // Exit if tasks are not an array
    }

    taskList.innerHTML = "";  // Clear the task list before rendering new tasks

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
            // After successfully creating a task, refetch tasks
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


// Function to handle task editing
async function editTask(taskId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to edit a task.");
        return;
    }

    // Fetch the task by ID to pre-fill the modal
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            const task = data;  // Assuming data contains the task

            // Populate the form with the existing task's details for editing
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description;
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-deadline').value = task.deadline;

            taskModal.style.display = 'block';  // Open the modal for editing

            // Handle form submission to update task
            taskForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const updatedTitle = document.getElementById('task-title').value;
                const updatedDescription = document.getElementById('task-description').value;
                const updatedPriority = document.getElementById('task-priority').value;
                const updatedDeadline = document.getElementById('task-deadline').value;

                try {
                    const updateResponse = await fetch(`${API_URL}/tasks/${taskId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            title: updatedTitle,
                            description: updatedDescription,
                            priority: updatedPriority,
                            deadline: updatedDeadline,
                        }),
                    });

                    const updateData = await updateResponse.json();

                    if (updateResponse.ok) {
                        alert("Task updated successfully.");
                        fetchTasks();  // Re-fetch tasks to show updated list
                        taskModal.style.display = 'none';  // Close the modal
                    } else {
                        alert(updateData.message || "Error updating task.");
                    }
                } catch (err) {
                    console.error("Error:", err);
                    alert("Error updating task.");
                }
            });

        } else {
            alert(data.message || "Error fetching task for editing.");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Error fetching task for editing.");
    }
}

// Function to handle task deletion
async function deleteTask(taskId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to delete a task.");
        return;
    }

    if (confirm("Are you sure you want to delete this task?")) {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert("Task deleted successfully.");
                fetchTasks();  // Re-fetch tasks after deletion to update the task list
            } else {
                alert(data.message || "Error deleting task.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error deleting task.");
        }
    }
}
Key Updates:
Edit Task (editTask):

When the Edit button is clicked, it fetches the current task data using the GET request with taskId.
The modal gets populated with the current task details.
When the form is submitted, the frontend sends a PUT request to update the task using the task ID and new data.
Delete Task (deleteTask):

When the Delete button is clicked, a confirmation box appears to confirm the deletion.
If confirmed, a DELETE request is sent to the backend with the taskId.
How This Matches the Backend Routes:
The PUT route (/tasks/:id) is used for updating the task. The frontend sends the updated task details in the request body and the Authorization header with the token.
The DELETE route (/tasks/:id) is used for deleting the task. The frontend only sends the Authorization header with the token.
Task Modal and Form:
Make sure you have a modal for editing the tasks, which will include a form similar to the one used for creating a task. Here's an example of how your modal could look in HTML:

html
Copy code
<div id="task-modal" style="display: none;">
    <h2>Edit Task</h2>
    <form id="task-form">
        <label for="task-title">Title</label>
        <input type="text" id="task-title" name="title" required />
        
        <label for="task-description">Description</label>
        <textarea id="task-description" name="description" required></textarea>
        
        <label for="task-priority">Priority</label>
        <select id="task-priority" name="priority" required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
        
        <label for="task-deadline">Deadline</label>
        <input type="date" id="task-deadline" name="deadline" required />

        <button type="submit">Save Task</button>
    </form>
    <button id="close-modal-btn">Close</button>
</div>
Handling Search/Filter (Optional)
If you'd like to add search functionality, here's an example for filtering tasks based on the title:

javascript
Copy code
// Filter tasks by title as user types in search input
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function () {
    const searchQuery = searchInput.value.toLowerCase();
    const taskCards = document.querySelectorAll('.task-card');

    taskCards.forEach((taskCard) => {
        const title = taskCard.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchQuery)) {
            taskCard.style.display = '';  // Show matching task
        } else {
            taskCard.style.display = 'none';  // Hide non-matching task
        }
    });
});

// Search/Filter Tasks
const searchInput = document.getElementById('search-bar');  // Assuming you have an input with id 'search-input'

searchInput.addEventListener('input', function () {
    const searchQuery = searchInput.value.toLowerCase();
    const taskCards = document.querySelectorAll('.task-card');

    taskCards.forEach((taskCard) => {
        const title = taskCard.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchQuery)) {
            taskCard.style.display = '';  // Show matching task
        } else {
            taskCard.style.display = 'none';  // Hide non-matching task
        }
    });
});