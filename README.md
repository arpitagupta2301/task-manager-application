# Task Manager Application

A responsive browser-based task manager built with HTML, CSS, and JavaScript. The app provides a clean single-page experience for creating, editing, prioritizing, completing, filtering, and deleting tasks without using any frontend framework.

## Features

- Create new tasks with title, priority, due date, and notes
- Edit existing task details
- Mark tasks as completed or undo completion
- Delete tasks
- Filter tasks by priority: High, Medium, Low, or All
- Store tasks in the browser using `localStorage`
- Dynamic DOM updates without page reloads
- Responsive layout for desktop and mobile screens

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser `localStorage`

## Project Structure

```text
task manager application/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## How To Run

Open `index.html` directly in a browser, or run a local server from the project folder:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## Description

This personal project demonstrates full CRUD functionality and local state management in a vanilla JavaScript application. Tasks are rendered dynamically using DOM manipulation, and saved data remains available after refreshing the page through browser local storage.
