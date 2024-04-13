const PubSub = require('pubsub-js');

const DOMHandler = (function initializeDOMHandler() {
  const addTaskToDOM = function(msg, data) {
    console.log(msg);

    const taskList = document.querySelector('#task-list');
    const taskItem = createTaskElement(data);

    taskList.appendChild(taskItem);
    return taskItem;
  };

  const removeTaskFromDOM = function(msg, data) {
    console.log(msg);
    const elementToRemove = document.querySelector(`.task-item[data-id="${data.id}"]`);

    elementToRemove.remove();
    return elementToRemove;
  };

  const addProjectToDOM = function(msg, data) {
    console.log(msg);

    const projectList = document.querySelector('#project-list');
    const projectItem = createProjectElement(data);

    projectList.appendChild(projectItem);
    return projectItem;
  };

  const removeProjectFromDOM = function(msg, data) {
    console.log(msg);

    const elementToRemove = document.querySelector(`.project-item[data-id="${data.id}]`);

    elementToRemove.remove();
    return elementToRemove;
  };

  return {
    subscriptions: [
      PubSub.subscribe('newTask', addTaskToDOM),
      PubSub.subscribe('taskRemoved', removeTaskFromDOM),
      PubSub.subscribe('newProject', addProjectToDOM),
      PubSub.subscribe('projectRemoved', removeProjectFromDOM),
    ]
  };

  function formateDateString(dateObj) {
    const day = dateObj.getDate();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'October', 'November', 'December'
    ];

    const monthName = monthNames[dateObj.getMonth()];

    const year = dateObj.getFullYear();

    return `${day} ${monthName} ${year}`;
  }

  function createTaskElement(data) {
    const task = createElement('', 'task-item');

    const optionPanel = createOptionPanel();

    const taskComponents = [
      createElement(data.title, 'task-title'),
      createElement(data.desc, 'task-desc'),
      createElement(formateDateString(data.dueDate), 'task-date'),
      createElement(data.prio, 'task-prio'),
      createInput(false, 'task-check', 'checkbox'),
      optionPanel
    ];

    taskComponents.forEach(e => {
      task.appendChild(e);
    });

    task.setAttribute('data-id', data.id);

    return task;
  }

  function createProjectElement(data) {
    const project = createElement('', 'project-item');
    const optionPanel = createOptionPanel();

    const projectComponents = [
      createElement(data.title, 'project-title'),
      optionPanel
    ]

    projectComponents.forEach(e => {
      project.appendChild(e);
    });

    project.setAttribute('data-id', data.id);

    return project;
  }

  function createOptionPanel() {
    const optionPanel = createElement('', 'option-panel');
    const optionComponents = [
      createElement('', 'edit-btn', 'button'),
      createElement('', 'delete-btn', 'button')
    ];

    optionComponents.forEach(e => {
      optionPanel.appendChild(e);
    });

    return optionPanel;
  }

  // streamline the creation of a new DOM element
  function createElement(text = '', name = '', type = 'div') {
    const element = document.createElement(type);

    element.textContent = text;
    element.className = name;

    return element;
  }

  // streamline the creation of a new HTML input element
  function createInput(value = '', name = '', type = 'text') {
    const input = createElement('', name, 'input');

    input.value = value;
    input.type = type;

    return input;
  }
})();

export default DOMHandler;
