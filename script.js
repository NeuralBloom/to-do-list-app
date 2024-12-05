function createTaskElement(taskText, dueDate, priority) {
    const newTask = document.createElement('li');
    newTask.draggable = true;
    newTask.classList.add('task-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.addEventListener('change', function() {
        newTask.classList.toggle('completed', checkbox.checked);
        saveTasks();
    });

    const taskContent = document.createElement('span');
    taskContent.classList.add('task-content');
    taskContent.textContent = taskText;

    if (dueDate) {
        const dueDateElement = document.createElement('span');
        dueDateElement.classList.add('due-date');
        dueDateElement.textContent = ` (Due: ${dueDate})`;
        if (new Date(dueDate) < new Date()) {
            newTask.classList.add('overdue');
        }
        taskContent.appendChild(dueDateElement);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        const newText = prompt('Edit your task:', taskText);
        if (newText !== null && newText.trim() !== '') {
            taskContent.textContent = newText.trim();
            if (dueDate) {
                taskContent.appendChild(dueDateElement);
            }
            saveTasks();
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        newTask.remove();
        saveTasks();
    });

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    newTask.appendChild(checkbox);
    newTask.appendChild(taskContent);
    newTask.appendChild(buttonContainer);

    // Set the priority class
    if (priority) {
        newTask.classList.add(priority);
    }

    return newTask;
}

document.getElementById('addTaskButton').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const dueDateInput = document.getElementById('dueDateInput');
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (taskText !== '') {
        const taskList = document.getElementById('taskList');
        taskList.appendChild(createTaskElement(taskText, dueDate, priority));
        taskInput.value = '';
        dueDateInput.value = '';
        saveTasks();
    }
});

const taskList = document.getElementById('taskList');

taskList.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.add('dragging');
    }
});

taskList.addEventListener('dragend', function(e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.remove('dragging');
        saveTasks();
    }
});

taskList.addEventListener('dragover', function(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskList, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (draggable) {
        if (afterElement == null) {
            taskList.appendChild(draggable);
        } else {
            taskList.insertBefore(draggable, afterElement);
        }
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(task => {
        const taskText = task.querySelector('.task-content').textContent;
        const isCompleted = task.classList.contains('completed');
        const priority = task.classList.contains('high') ? 'high' : task.classList.contains('medium') ? 'medium' : 'low';
        const dueDateElement = task.querySelector('.due-date');
        const dueDate = dueDateElement ? dueDateElement.textContent.replace(' (Due: ', '').replace(')', '') : '';
        tasks.push({ text: taskText, completed: isCompleted, priority, dueDate });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskList = document.getElementById('taskList');
        const newTask = createTaskElement(task.text, task.dueDate, task.priority);
        if (task.completed) {
            newTask.classList.add('completed');
            newTask.querySelector('.task-checkbox').checked = true;
        }
        taskList.appendChild(newTask);
    });
}

// Load tasks from localStorage when the page loads
window.addEventListener('load', loadTasks);
