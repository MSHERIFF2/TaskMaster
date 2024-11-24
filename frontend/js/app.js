document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const taskSection = document.getElementById('task-section');
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const searchInput = document.getElementById('search');

    const API_BASE = 'http://localhost:5000/api/tasks'; // Update with your backend URL
    let token = ''; // Store JWT token after login

    // Mock authentication for simplicity
    const authenticate = () => {
        authSection.classList.add('hidden');
        taskSection.classList.remove('hidden');
        fetchTasks(); // Load tasks after login
    };

    document.getElementById('login-btn').addEventListener('click', (e) => {
        e.preventDefault();
        // Mock token for testing
        token = 'your-jwt-token';
        authenticate();
    });

    document.getElementById('register-btn').addEventListener('click', (e) => {
        e.preventDefault();
        alert('User Registered!'); // Replace with actual registration logic
        authenticate();
    });

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await fetch(API_BASE, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Render tasks in the UI
    const renderTasks = (tasks) => {
        taskList.innerHTML = ''; // Clear previous tasks
        tasks.forEach((task) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.title} - ${task.priority}</span>
                <div class="task-actions">
                    <button class="edit-btn" data-id="${task._id}">Edit</button>
                    <button class="delete-btn" data-id="${task._id}">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    };

    // Add Task
    addTaskBtn.addEventListener('click', async () => {
        const title = prompt('Enter task title:');
        const priority = prompt('Enter priority (low, medium, high):');
        if (title && priority) {
            try {
                const response = await fetch(API_BASE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ title, priority }),
                });
                if (response.ok) {
                    fetchTasks(); // Reload tasks
                }
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    });

    // Task Action Handlers (Edit/Delete)
    taskList.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;

        if (e.target.classList.contains('edit-btn')) {
            const newTitle = prompt('Enter new task title:');
            const newPriority = prompt('Enter new priority (low, medium, high):');
            if (newTitle && newPriority) {
                try {
                    const response = await fetch(`${API_BASE}/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ title: newTitle, priority: newPriority }),
                    });
                    if (response.ok) {
                        fetchTasks(); // Reload tasks
                    }
                } catch (error) {
                    console.error('Error updating task:', error);
                }
            }
        }

        if (e.target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this task?')) {
                try {
                    const response = await fetch(`${API_BASE}/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        fetchTasks(); // Reload tasks
                    }
                } catch (error) {
                    console.error('Error deleting task:', error);
                }
            }
        }
    });

    // Search Tasks
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        Array.from(taskList.children).forEach((task) => {
            const taskTitle = task.querySelector('span').textContent.toLowerCase();
            task.style.display = taskTitle.includes(query) ? '' : 'none';
        });
    });
});
