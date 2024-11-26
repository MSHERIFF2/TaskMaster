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
