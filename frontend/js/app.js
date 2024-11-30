
document.addEventListener('DOMContentLoaded', () => {
  // Fetch tasks and display them
  fetchTasks().then(tasks => {
    console.log(tasks);
    // Render tasks on UI
  });

  // Handle task creation
  document.getElementById('createTaskButton').addEventListener('click', async () => {
    const taskData = {
      title: document.getElementById('taskTitle').value,
      description: document.getElementById('taskDescription').value,
      deadline: document.getElementById('taskDeadline').value,
      priority: document.getElementById('taskPriority').value
    };
    const task = await createTask(taskData);
    console.log('Task created:', task);
    // Update UI
  });
});
                