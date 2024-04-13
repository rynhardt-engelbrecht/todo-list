const PubSub = require('pub-sub.js');

const DOMHandler = (function initializeDOMHandler() {
  return {
    addTaskToDOM: function(msg, data) {
      console.log(msg);

      const taskList = document.querySelector('#task-list');
      const taskItem = createTaskElement(data);

      taskList.appendChild(taskItem);
    },
    subscriptions: [
      PubSub.subscribe('newTask', this.addTaskToDOM),
    ]
  }

  function createTaskElement(data) {
    const task = createElement('', 'task-item');

    const taskComponents = [
      createElement(data.title, 'task-title'),
      createElement(data.desc, 'task-desc'),
      createElement(data.dueDate, 'task-date'),
      createElement(data.prio, 'task-prio'),
      createInput(false, 'task-check', 'checkbox')
    ];

    taskComponents.forEach(e => {
      task.appendChild(e);
    });

    task.setAttribute('data-id', data.id);

    return task;
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
