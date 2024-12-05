document.getElementById('addTaskButton').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const taskList = document.getElementById('taskList');
        const newTask = document.createElement('li');
        newTask.innerHTML = `${taskText} <button onclick="deleteTask(this)">Delete</button>`;
        taskList.appendChild(newTask);
        taskInput.value = '';
    }
});

function deleteTask(button) {
    const task = button.parentElement;
    task.remove();
}
