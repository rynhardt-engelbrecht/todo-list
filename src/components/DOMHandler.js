const PubSub = require('pubsub-js');

const DOMHandler = (function initializeDOMHandler() {
  const addTaskToDOM = function(msg, data) {
    const taskList = document.querySelector('#task-list');
    const taskItem = createTaskElement(data);

    taskList.appendChild(taskItem);

    PubSub.publish('newTaskElement', taskItem);
    return taskItem;
  };

  const removeTaskFromDOM = function(msg, data) {
    console.log(msg);
    const elementToRemove = document.querySelector(`.task-item[data-id="${data.id}"]`);

    elementToRemove.remove();
    return elementToRemove;
  };

  const addProjectToDOM = function(msg, data) {
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

  const displayActiveProject = function(msg, data) {
    const taskList = data.taskList;
    const taskListContainer = document.querySelector('#task-list');
    taskListContainer.innerHTML = '';
    if (taskList) {
      taskList.forEach(e => {
        addTaskToDOM('manual', e);
      });
    }

    const projectOptionPanel = document.querySelector('#project-tab .option-panel');
    projectOptionPanel.classList.remove('hidden');
    const projectTitle = document.querySelector('#project-title');
    projectTitle.textContent = data.title;

    const projectItem = document.querySelector(`.project-item[data-id="${data.id}"]`);
    projectItem.classList.add('active-project');
  };

  const createTaskForm = function() {
    const form = createElement('', 'task-form', 'form');
    form.setAttribute('action', '#');
    form.setAttribute('method', 'post');

    const titleInputLabel = createElement('Title', 'task-title-label', 'label');
    const titleInput = createInput('', 'task-title-input');
    titleInput.id = 'title';
    titleInputLabel.setAttribute('for', titleInput.id);
    titleInput.setAttribute('name', titleInput.id);

    titleInputLabel.appendChild(titleInput);

    const descInputLabel = createElement('Description', 'task-desc-label', 'label');
    const descInput = createInput('', 'task-desc-input');
    descInput.id = 'desc';
    descInputLabel.setAttribute('for', descInput.id);
    descInput.setAttribute('name', descInput.id);

    descInputLabel.appendChild(descInput);

    const dateInputLabel = createElement('Due Date', 'task-date-label', 'label');
    const dateInput = createInput('', 'task-date-input', 'date');
    dateInput.id = 'date';
    dateInputLabel.setAttribute('for', dateInput.id);
    dateInput.setAttribute('name', dateInput.id);

    dateInputLabel.appendChild(dateInput);

    const prioInputLabel = createElement('Priority Level', 'task-prio-label', 'label');
    const prioInput = createSelect([1, 2, 3, 4], 'task-prio-input', '1');
    prioInput.id = 'prio';
    prioInputLabel.setAttribute('for', prioInput.id);
    prioInput.setAttribute('name', prioInput.id);

    prioInputLabel.appendChild(prioInput);

    const formComponents = [
      titleInputLabel,
      descInputLabel,
      dateInputLabel,
      prioInputLabel
    ];

    formComponents.forEach(e => {
      form.appendChild(e);
    });

    const submitBtn = createInput('✔', 'submit-btn', 'submit');
    form.appendChild(submitBtn);

    const cancelBtn = createElement('X', 'cancel-btn', 'button');
    form.appendChild(cancelBtn);

    const body = document.querySelector('body');
    body.appendChild(form);

    PubSub.publish('taskFormCreated', form);
    return form;
  };

  return {
    createTaskForm,
    subscriptions: [
      PubSub.subscribe('newTask', addTaskToDOM),
      PubSub.subscribe('taskRemoved', removeTaskFromDOM),
      PubSub.subscribe('newProject', addProjectToDOM),
      PubSub.subscribe('projectRemoved', removeProjectFromDOM),
      PubSub.subscribe('activeProjectChange', displayActiveProject),
    ]
  };

  function formateDateString(dateObj) {
    if (dateObj) {
      const day = dateObj.getDate();

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'October', 'November', 'December'
      ];

      const monthName = monthNames[dateObj.getMonth()];

      const year = dateObj.getFullYear();

      return `${day} ${monthName} ${year}`;
    }

    return '';
  }

  function createTaskElement(data) {
    const task = createElement('', 'task-item');

    const optionPanel = createOptionPanel();
    const selectPriority = createElement('', 'task-prio', 'span');
    selectPriority.appendChild(createSelect([1, 2, 3, 4], '', data.prio));

    const taskComponents = [
      createElement(data.title, 'task-title'),
      createTextarea(data.desc, 'task-desc', true),
      createElement(formateDateString(data.dueDate), 'task-date'),
      selectPriority,
      createInput(false, 'task-check', 'checkbox'),
      optionPanel
    ];

    taskComponents.forEach(e => {
      task.appendChild(e);
    });

    task.setAttribute('data-id', data.id);
    task.setAttribute('data-prio', data.prio);

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

  function createTextarea(text = '', name = '', isDisabled = true) {
    const textarea = createElement(text, name, 'textarea');
    textarea.disabled = isDisabled;

    return textarea;
  }

  function createSelect(options = [], name = '', defaultValue = '') {
    const select = createElement('', name, 'select');

    options.forEach((option, index) => {
      const optionElement = createElement(option, '', 'option');
      optionElement.value = option;
      select.appendChild(optionElement);
    });

    const defaultIndex = options.findIndex(e => e === defaultValue);
    select.selectedIndex = defaultIndex;

    return select;
  }
})();

export default DOMHandler;
