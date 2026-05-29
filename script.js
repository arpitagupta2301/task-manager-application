const STORAGE_KEY = "arpita-task-manager-tasks";

const taskForm = document.querySelector("#taskForm");
const taskIdInput = document.querySelector("#taskId");
const titleInput = document.querySelector("#taskTitle");
const priorityInput = document.querySelector("#taskPriority");
const dueDateInput = document.querySelector("#taskDueDate");
const notesInput = document.querySelector("#taskNotes");
const submitBtn = document.querySelector("#submitBtn");
const cancelEditBtn = document.querySelector("#cancelEditBtn");
const taskList = document.querySelector("#taskList");
const taskTemplate = document.querySelector("#taskTemplate");
const totalTasks = document.querySelector("#totalTasks");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = loadTasks();
let currentFilter = "All";

renderTasks();

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  if (!title) {
    titleInput.focus();
    return;
  }

  const existingId = taskIdInput.value;
  const taskData = {
    title,
    priority: priorityInput.value,
    dueDate: dueDateInput.value,
    notes: notesInput.value.trim()
  };

  if (existingId) {
    tasks = tasks.map((task) =>
      task.id === existingId ? { ...task, ...taskData } : task
    );
  } else {
    tasks.unshift({
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...taskData
    });
  }

  saveAndRender();
  resetForm();
});

cancelEditBtn.addEventListener("click", resetForm);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTasks();
  });
});

taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const card = button.closest(".task-card");
  const taskId = card?.dataset.id;
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  if (button.classList.contains("complete-btn")) {
    task.completed = !task.completed;
    saveAndRender();
  }

  if (button.classList.contains("edit-btn")) {
    startEdit(task);
  }

  if (button.classList.contains("delete-btn")) {
    tasks = tasks.filter((item) => item.id !== taskId);
    saveAndRender();
    if (taskIdInput.value === taskId) {
      resetForm();
    }
  }
});

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);
  if (!savedTasks) return [];

  try {
    return JSON.parse(savedTasks);
  } catch {
    return [];
  }
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  totalTasks.textContent = tasks.length;

  const visibleTasks = currentFilter === "All"
    ? tasks
    : tasks.filter((task) => task.priority === currentFilter);

  if (visibleTasks.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No tasks to show.";
    taskList.append(emptyState);
    return;
  }

  visibleTasks.forEach((task) => {
    const taskCard = taskTemplate.content.firstElementChild.cloneNode(true);
    taskCard.dataset.id = task.id;
    taskCard.classList.toggle("completed", task.completed);

    taskCard.querySelector("h2").textContent = task.title;

    const badge = taskCard.querySelector(".priority-badge");
    badge.textContent = task.priority;
    badge.classList.add(`priority-${task.priority.toLowerCase()}`);

    const notes = taskCard.querySelector(".task-notes");
    notes.textContent = task.notes || "No notes added.";

    const date = taskCard.querySelector(".task-date");
    date.textContent = task.dueDate ? `Due: ${formatDate(task.dueDate)}` : "No due date";

    const completeBtn = taskCard.querySelector(".complete-btn");
    completeBtn.textContent = task.completed ? "Undo" : "Done";

    taskList.append(taskCard);
  });
}

function startEdit(task) {
  taskIdInput.value = task.id;
  titleInput.value = task.title;
  priorityInput.value = task.priority;
  dueDateInput.value = task.dueDate;
  notesInput.value = task.notes;
  submitBtn.textContent = "Update Task";
  cancelEditBtn.hidden = false;
  titleInput.focus();
}

function resetForm() {
  taskForm.reset();
  taskIdInput.value = "";
  priorityInput.value = "Medium";
  submitBtn.textContent = "Add Task";
  cancelEditBtn.hidden = true;
}

function formatDate(dateValue) {
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}
