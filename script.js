function createTaskElement(taskText, dueDate, priority) {
    const newTask = document.createElement('li');
    newTask.draggable = true;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function() {
        newTask.classList.toggle('completed', checkbox.checked);
    });

    const taskContent = document.createElement('span');
    taskContent.textContent = taskText;

    if (dueDate) {
        const dueDateElement = document.createElement('span');
        dueDateElement.textContent = ` (Due: ${dueDate})`;
        if (new Date(dueDate) < new Date()) {
            newTask.classList.add('overdue');
        }
        taskContent.appendChild(dueDateElement);
    }

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        const newText = prompt('Edit your task:', taskText);
        if (newText !== null && newText.trim() !== '') {
            taskContent.textContent = newText.trim();
            if (dueDate) {
                taskContent.appendChild(dueDateElement);
            }
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        newTask.remove();
    });

    newTask.appendChild(checkbox);
    newTask.appendChild(taskContent);
    newTask.appendChild(editButton);
    newTask.appendChild(deleteButton);

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
