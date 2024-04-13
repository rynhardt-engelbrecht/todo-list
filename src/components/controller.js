const PubSub = require('pubsub-js');

import Task from './task.js';
import DOMHandler from './DOMHandler.js';
import Project from './project.js';

const controller = (() => {

  const prioritySelectListener = function(msg, data) {
    const prioritySelect = data.querySelector('.task-prio select');

    prioritySelect.addEventListener('change', () => {
      const selectedPrio = prioritySelect.value;
      data.setAttribute('data-prio', selectedPrio);
    })
  }

  const taskCheckListener = function(msg, data) {
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

      new Task(title, desc, new Date(date), prio, false, 0);
      data.remove();
    });
  }

  const projectFormListeners = function(msg, data) {
    const cancelBtn = data.querySelector('.cancel-btn');
    const submitBtn = data.querySelector('.submit-btn');

    cancelBtn.addEventListener('click', e => {
      e.preventDefault();

      data.remove();
    });

    submitBtn.addEventListener('click', e => {
      e.preventDefault();

      const title = data.querySelector('#title').value;

      new Project(title);
      data.remove();
    });
  }

  const optionPanelListeners = function(msg, data) {
    const optionPanel = data.querySelector('.option-panel');
    const editBtn = optionPanel.querySelector('.edit-btn');
    const deleteBtn = optionPanel.querySelector('.delete-btn');

    editBtn.addEventListener('click', e => {
      const taskForm = DOMHandler.createTaskForm();
      PubSub.publish('editTaskFormCreated', taskForm);
    });

    deleteBtn.addEventListener('click', e => {
      const element = data;

      if (element.getAttribute('data-type') === 'task') {
        const parentProject = JSON.parse(localStorage.getItem('active-project'));
        parentProject.taskList = parentProject.taskList.filter(e => `${e.id}` !== element.getAttribute('data-id'));

        updateProjectInStorage('', parentProject);
      } else if (element.getAttribute('data-type') === 'project') {
        removeProjectFromStorage('', element.getAttribute('data-id'));
      }

      element.remove();
    });
  }

  const addProjectToStorage = function(msg, data) {
    let storedProjectList = JSON.parse(localStorage.getItem('project-list'));

    if (storedProjectList) {
      storedProjectList.push(data);
    } else {
      storedProjectList = [data];
    }

    localStorage.setItem('project-list', JSON.stringify(storedProjectList));
  };

  const updateProjectInStorage = function(msg, data) {
    const storedProjectList = JSON.parse(localStorage.getItem('project-list'));

    storedProjectList[storedProjectList.findIndex(p => p.id === data.id)] = data;
    localStorage.setItem('project-list', JSON.stringify(storedProjectList));
  }

  const removeProjectFromStorage = function(msg, data) {
    const storedProjectList = JSON.parse(localStorage.getItem('project-list'));

    const activeProject = JSON.parse(localStorage.getItem('active-project'));
    const deletedProject = storedProjectList[storedProjectList.findIndex(p => p.id == data)];

    const updatedList = storedProjectList.filter(p => p.id != data);
    localStorage.setItem('project-list', JSON.stringify(updatedList));

    if (activeProject && activeProject.id === deletedProject.id) {
      PubSub.publish('activeProjectChange', null);
    }
  }

  const updateActiveProject = function(msg, data) {
    localStorage.setItem('active-project', JSON.stringify(data));
  }

  return {
    subscriptions: [
      PubSub.subscribe('newTaskElement', prioritySelectListener),
      PubSub.subscribe('newTaskElement', taskCheckListener),
      PubSub.subscribe('newTaskElement', optionPanelListeners),
      PubSub.subscribe('newProjectElement', optionPanelListeners),
      PubSub.subscribe('taskFormCreated', taskFormListeners),
      PubSub.subscribe('projectFormCreated', projectFormListeners),
      PubSub.subscribe('newProject', addProjectToStorage),
      PubSub.subscribe('activeProjectChange', updateActiveProject),
      PubSub.subscribe('updateTaskList', updateProjectInStorage),
      PubSub.subscribe('updateTaskList', updateActiveProject)
    ],
  };
})();
