import './style.css';

import DOMHandler from './components/DOMHandler.js';
import controller from './components/controller.js';

const addTaskBtn = document.querySelector('#add-task-btn');
const addProjectBtn = document.querySelector('#add-project-btn');

addTaskBtn.addEventListener('click', () => {
  const form = DOMHandler.createTaskForm();
});

addProjectBtn.addEventListener('click', () => {
  const form = DOMHandler.createProjectForm();
});

/*
  Add way to create new tasks, button to create new tasks should only be visible if there is
  an active project. When clicked, the button should bring up a modal form to capture information then
  create a new task object using createTask(). The created task object should be added to the correct
  project object's todoList attribute.
*/

DOMHandler.startUpDOM();
