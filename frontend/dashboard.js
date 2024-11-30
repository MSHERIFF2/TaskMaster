// Import JWT decode library
import jwtDecode from 'jwt-decode';

// Selecting DOM elements
const taskList = document.querySelector(".task-list");
const API_URL = 'https://backendtaskmaster.onrender.com'; // Backend URL

// Fetch tasks from the backend
async function fetchTasks() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in to view tasks.");
    window.location.href = "login.html"; // Redirect to login if no token
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: {
        "Authorization": `Bearer ${token}`, // Send JWT in Authorization header
      },
    });

    const data = await response.json();
    if (response.ok && Array.isArray(data)) {
      renderTasks(data); // Render the tasks
    } else {
      alert(data.message || "Error fetching tasks.");
    }
  } catch (err) {
    console.error("Error fetching tasks:", err);
    alert("Error fetching tasks.");
  }
}

// Initialize dashboard by fetching tasks
document.addEventListener("DOMContentLoaded", function () {
  fetchTasks();
});

// Render tasks to the page
function renderTasks(tasks) {
  if (!Array.isArray(tasks)) {
    console.error("Expected tasks to be an array, but got:", tasks);
    return;
  }

  taskList.innerHTML = ""; // Clear the list before rendering

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
    editBtn.dataset.taskId = task._id;

    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.taskId = task._id;

    taskCard.appendChild(editBtn);
    taskCard.appendChild(deleteBtn);

    taskList.appendChild(taskCard);

    // Add event listeners for edit and delete buttons
    editBtn.addEventListener("click", () => editTask(editBtn.dataset.taskId));
    deleteBtn.addEventListener("click", () => deleteTask(deleteBtn.dataset.taskId));
  });
}

// Modal to add new task
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const taskForm = document.getElementById('task-form');

// Open modal
addTaskBtn.addEventListener('click', () => {
  taskModal.style.display = 'flex'; // Show modal
  taskModal.style.flexDirection = 'column';
  taskModal.style.alignItems = 'center';
});

// Close modal
closeModalBtn.addEventListener('click', () => {
  taskModal.style.display = 'none'; // Hide modal
});

// Handle task form submission (for adding new tasks)
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
      body: JSON.stringify({ title, description, priority, deadline }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Task created successfully.");
      fetchTasks(); // Re-fetch tasks to update the list
      taskModal.style.display = 'none'; // Close modal
      resetFormFields();
    } else {
      alert(data.message || "Error creating task.");
    }
  } catch (err) {
    console.error("Error creating task:", err);
    alert("Error creating task.");
  }
});

// Function to edit task
async function editTask(taskId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in to edit a task.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/edit/${taskId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const task = await response.json();
    if (response.ok) {
      document.getElementById('task-title').value = task.title;
      document.getElementById('task-description').value = task.description;
      document.getElementById('task-priority').value = task.priority;
      document.getElementById('task-deadline').value = task.deadline;

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
            fetchTasks(); // Re-fetch tasks
            taskModal.style.display = 'none'; // Close modal
            resetFormFields();
          } else {
            alert(updateData.message || "Error updating task.");
          }
        } catch (err) {
          console.error("Error updating task:", err);
          alert("Error updating task.");
        }
      });
    } else {
      alert(task.message || "Error fetching task for editing.");
    }
  } catch (err) {
    console.error("Error fetching task:", err);
    alert("Error fetching task for editing.");
  }
}

// Reset form fields after editing
function resetFormFields() {
  document.getElementById('task-title').value = '';
  document.getElementById('task-description').value = '';
  document.getElementById('task-priority').value = '';
  document.getElementById('task-deadline').value = '';
}

// Delete task
async function deleteTask(taskId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in to delete a task.");
    return;
  }

  if (window.confirm("Are you sure you want to delete this task?")) {
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
        fetchTasks(); // Re-fetch tasks after deletion
      } else {
        alert(data.message || "Error deleting task.");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Error deleting task.");
    }
  }
}

// Search/Filter tasks
const searchInput = document.getElementById('search-bar');

searchInput.addEventListener('input', function () {
  const searchQuery = searchInput.value.toLowerCase();
  const taskCards = document.querySelectorAll('.task-card');

  taskCards.forEach((taskCard) => {
    const title = taskCard.querySelector('h3').textContent.toLowerCase();
    if (title.includes(searchQuery)) {
      taskCard.style.display = ''; // Show matching task
    } else {
      taskCard.style.display = 'none'; // Hide non-matching task
    }
  });
});