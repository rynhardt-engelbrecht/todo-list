const PubSub = require('pubsub-js');

import createTask from './task.js';
import DOMHandler from './DOMHandler.js';

const controller = (() => {

  const prioritySelectListener = function(msg, data) {
    console.log(msg);
    const prioritySelect = data.querySelector('.task-prio select');

    prioritySelect.addEventListener('change', () => {
      const selectedPrio = prioritySelect.value;
      data.setAttribute('data-prio', selectedPrio);
    })
  }

  const taskCheckListener = function(msg, data) {
    console.log(msg);
    const checkbox = data.querySelector('.task-check');
    const prioSelect = data.querySelector('.task-prio select')

    checkbox.addEventListener('change', () => {
      data.classList.toggle('complete');
      if (prioSelect.disabled) {
        prioSelect.disabled = false;
      } else {
        prioSelect.disabled = true;
      }
    });
  }

  const taskFormListeners = function(msg, data) {
    console.log(msg);
    const cancelBtn = data.querySelector('.cancel-btn');
    const submitBtn = data.querySelector('.submit-btn');

    cancelBtn.addEventListener('click', e => {
      e.preventDefault();

      data.remove();
    });

    submitBtn.addEventListener('click', e => {
      e.preventDefault();

      const title = data.querySelector('#title').value;
      const desc = data.querySelector('#desc').value;
      const date = data.querySelector('#date').value;
      const prio = data.querySelector('#prio').value;

      createTask(title, desc, new Date(date), prio, false, 0);
      data.remove();
    });
  }

  const optionPanelListeners = function(msg, data) {
    console.log(msg);

    const optionPanel = data.querySelector('.option-panel');
    const editBtn = optionPanel.querySelector('.edit-btn');
    const deleteBtn = optionPanel.querySelector('.delete-btn');
    console.log(deleteBtn);

    editBtn.addEventListener('click', e => {
      const taskForm = DOMHandler.createTaskForm();
      PubSub.publish('editTaskFormCreated', taskForm);
    });

    deleteBtn.addEventListener('click', e => {
      data.remove();
    });
  }

  return {
    subscriptions: [
      PubSub.subscribe('newTaskElement', prioritySelectListener),
      PubSub.subscribe('newTaskElement', taskCheckListener),
      PubSub.subscribe('newTaskElement', optionPanelListeners),
      PubSub.subscribe('newProjectElement', optionPanelListeners),
      PubSub.subscribe('taskFormCreated', taskFormListeners)
    ],
  };
})();
