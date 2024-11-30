const taskList = document.querySelector(".task-list");
const API_URL = 'https://backendtaskmaster.onrender.com';  // Update if necessary

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
        console.log("Response status:", response.status)

        const data = await response.json();
        console.log('API Response:', data); // Log the API response for debugging

        if (response.ok && Array.isArray(data)) {
            console.log("Response OK and data.tasks is an array");
            renderTasks(data);  // Render the fetched tasks
        } else {
            console.log("Response not OK or data.tasks is not an array");
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
    console.log("I am here")
    if (!Array.isArray(tasks)) {
        console.error("Expected tasks to be an array, but got:", tasks);
        return; // Exit if tasks are not an array
    }

    taskList.innerHTML = "";  // Clear the task list before rendering new tasks

    tasks.forEach((task) => {
        const taskCard = document.createElement("div");
        const editBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");

        taskCard.classList.add("task-card");
        taskCard.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Deadline:</strong> ${task.deadline}</p>
        `;
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Edit";
        editBtn.taskId = task._id;

        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete";
        deleteBtn.taskId = task._id;

        taskCard.appendChild(editBtn);
        taskCard.appendChild(deleteBtn);

        taskList.appendChild(taskCard);

        editBtn.addEventListener("click", () => editTask(editBtn.taskId));
        deleteBtn.addEventListener("click", () => deleteTask(deleteBtn.taskId));
    });
}

// Handle the task creation modal
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const taskForm = document.getElementById('task-form');


// Open the modal when "Add Task" button is clicked
addTaskBtn.addEventListener('click', () => {
    taskModal.style.display = 'flex';
    taskModal.style.flexDirection = 'column';
    taskModal.style.alignItems = 'center';
    taskModal.style.alignContent = 'center';


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
        const response = await fetch(`${API_URL}/new`, {
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

    const taskModal = document.getElementById('task-modal');
    const taskForm = document.getElementById('task-form');
    const token = localStorage.getItem("token");


    if (!token) {
        alert("You must be logged in to edit a task.");
        return;
    }

    // Fetch the task by ID to pre-fill the modal
try {
    const response = await fetch(`${API_URL}/edit/${taskId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    const task = await response.json();
    // Populate the form with the existing task's details for editing
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-deadline').value = task.deadline;
    // Handle form submission to update task
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedTask = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        priority: document.getElementById('task-priority').value,
        deadline: document.getElementById('task-deadline').value,
      };
      try {
        const updateResponse = await fetch(`${API_URL}/edit/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTask),
        });
        const updateData = await updateResponse.json();
        if (updateResponse.ok) {
          alert("Task updated successfully.");
          fetchTasks(); // Re-fetch tasks to show updated list
          taskModal.style.display = 'none'; // Close the modal
        } else {
          alert(updateData.message || "Error updating task.");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Error updating task.");
      }
    });
  } catch (err) {
    console.error("Error:", err);
    alert("Error fetching task for editing.");
  }
}
// Delete Task
async function deleteTask(taskId) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user");

    if (!token) {
        alert("You must be logged in to delete a task.");
        return;
    }
    if (window.confirm("Are you sure you want to delete this task?")) {
        try {
            const response = await fetch(`${API_URL}/delete/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    //   "User-ID": req.user.userId // Use req.user.userId instead of user
                },
            })

            const data = await response.json();

            if (response.ok) {
                alert("Task deleted successfully.");
                fetchTasks();  // Re-fetch tasks after deletion
            } else {
                alert(data.message || "Error deleting task.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error deleting task.");
        }
    }
}

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