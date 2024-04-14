const PubSub = require('pubsub-js');

import Task from './task.js';
import DOMHandler from './DOMHandler.js';
import Project from './project.js';

const controller = (() => {

  const prioritySelectListener = function(msg, data) {
    const prioritySelect = data.querySelector('.task-prio select');

    prioritySelect.addEventListener('change', () => {
      const activeProject = getActiveProject();
      let taskList = activeProject.taskList;
      let taskObj = taskList.find(p => p.id == data.getAttribute('data-id'));
      taskObj = Task.updatePrio(taskObj, prioritySelect.value);

      activeProject.taskList[taskList.findIndex(p => p.id == data.getAttribute('data-id'))] = taskObj;
      PubSub.publish('updateTaskList', activeProject);

      const selectedPrio = prioritySelect.value;
      data.setAttribute('data-prio', selectedPrio);
    })
  }

  const taskCheckListener = function(msg, data) {
    const checkbox = data.querySelector('.task-check');
    const prioSelect = data.querySelector('.task-prio select')

    checkbox.addEventListener('change', () => {
      const activeProject = getActiveProject();
      let taskList = activeProject.taskList;
      let taskObj = taskList.find(p => p.id == data.getAttribute('data-id'));
      taskObj = Task.updateChecked(taskObj, checkbox.checked);

      activeProject.taskList[taskList.findIndex(p => p.id == data.getAttribute('data-id'))] = taskObj;
      PubSub.publish('updateTaskList', activeProject);

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
      if (data.getAttribute('data-type') === 'task') {
        const parentProject = getActiveProject();
        const taskObj = parentProject.taskList[parentProject.taskList.findIndex(p => p.id == data.getAttribute('data-id'))];

        const taskForm = DOMHandler.createTaskForm(taskObj.title, taskObj.desc, taskObj.dueDate, taskObj.prio);
        PubSub.publish('editTaskFormCreated', { task: taskObj, form: taskForm });
      } else if (data.getAttribute('data-type') === 'project') {
        const projectList = getProjectList();
        const projectObj = projectList[projectList.findIndex(p => p.id == data.getAttribute('data-id'))];

        const projectForm = DOMHandler.createProjectForm(projectObj.title);
        PubSub.publish('editProjectFormCreated', { project: projectObj, form: projectForm });
      }
    });

    deleteBtn.addEventListener('click', e => {
      const element = data;

      if (element.getAttribute('data-type') === 'task') {
        const parentProject = getActiveProject();
        parentProject.taskList = parentProject.taskList.filter(e => `${e.id}` !== element.getAttribute('data-id'));

        updateProjectInStorage('', parentProject);
      } else if (element.getAttribute('data-type') === 'project') {
        removeProjectFromStorage('', element.getAttribute('data-id'));
      }

      element.remove();
    });
  }

  const selectProjectListener = function(msg, data) {
    const projectTitle = data.querySelector('.project-title');

    projectTitle.addEventListener('click', e => {
      const projectList = getProjectList();
      const associatedProject = projectList[projectList.findIndex(p => p.id == data.getAttribute('data-id'))];
      PubSub.publish('activeProjectChange', associatedProject);
    });
  }

  const addProjectToStorage = function(msg, data) {
    let storedProjectList = getProjectList();

    if (storedProjectList) {
      storedProjectList.push(data);
    } else {
      storedProjectList = [data];
    }

    localStorage.setItem('project-list', JSON.stringify(storedProjectList));
  };

  const updateProjectInStorage = function(msg, data) {
    const storedProjectList = getProjectList();

    storedProjectList[storedProjectList.findIndex(p => p.id === data.id)] = data;
    localStorage.setItem('project-list', JSON.stringify(storedProjectList));
  }

  const removeProjectFromStorage = function(msg, data) {
    const storedProjectList = getProjectList();

    const activeProject = getActiveProject();
    const deletedProject = storedProjectList[storedProjectList.findIndex(p => p.id == data)];

    const updatedList = storedProjectList.filter(p => p.id != data);
    localStorage.setItem('project-list', JSON.stringify(updatedList));

    if (activeProject && activeProject.id === deletedProject.id) {
      PubSub.publish('activeProjectChange', null);
    }
  }

  const updateActiveProject = function(msg, data) {
    const previouslyActive = document.querySelectorAll('.active-project');
    previouslyActive.forEach(e => {
      e.classList.remove('active-project');
    });

    localStorage.setItem('active-project', JSON.stringify(data));
    if (data) {
      const newlyActiveElement = document.querySelector(`.project-item[data-id="${data.id}"`);
      newlyActiveElement.classList.add('active-project');
    }
  }

  const editTaskForm = function(msg, data) {
    const cancelBtn = data.form.querySelector('.cancel-btn');
    const submitBtn = data.form.querySelector('.submit-btn');

    cancelBtn.addEventListener('click', e => {
      e.preventDefault();

      data.form.remove();
    });

    submitBtn.addEventListener('click', e => {
      e.preventDefault();

      updateTaskObj(data.task, data.form);
      data.form.remove();
    });
  };

  const editProjectForm = function(msg, data) {
    const cancelBtn = data.form.querySelector('.cancel-btn');
    const submitBtn = data.form.querySelector('.submit-btn');

    cancelBtn.addEventListener('click', e => {
      e.preventDefault();

      data.form.remove();
    });

    submitBtn.addEventListener('click', e => {
      e.preventDefault();

      updateProjectObj(data.project, data.form);
      data.form.remove();
    })
  }

  return {
    getActiveProject,
    getProjectList,
    subscriptions: [
      PubSub.subscribe('newTaskElement', prioritySelectListener),
      PubSub.subscribe('newTaskElement', taskCheckListener),
      PubSub.subscribe('newTaskElement', optionPanelListeners),
      PubSub.subscribe('newProjectElement', optionPanelListeners),
      PubSub.subscribe('newProjectElement', selectProjectListener),
      PubSub.subscribe('taskFormCreated', taskFormListeners),
      PubSub.subscribe('projectFormCreated', projectFormListeners),
      PubSub.subscribe('newProject', addProjectToStorage),
      PubSub.subscribe('activeProjectChange', updateActiveProject),
      PubSub.subscribe('updateTaskList', updateProjectInStorage),
      PubSub.subscribe('updateTaskList', updateActiveProject),
      PubSub.subscribe('editTaskFormCreated', editTaskForm),
      PubSub.subscribe('editProjectFormCreated', editProjectForm),
      PubSub.subscribe('updateProjectInfo', updateProjectInStorage),
    ],
  };

  function updateTaskObj(task, form) {
    const newTitle = form.querySelector('#title').value;
    const newDesc = form.querySelector('#desc').value;
    const newDate = form.querySelector('#date').value;
    const newPrio = form.querySelector('#prio').value;

    const activeProject = getActiveProject();
    const activeTaskList = activeProject.taskList;
    const objToUpdate = activeTaskList.find(p => p.id == task.id);

    Task.updateInfo(objToUpdate, newTitle, newDesc, newDate, newPrio);

    const objIndex = activeTaskList.findIndex(p => p.id == task.id);
    activeProject.taskList[objIndex] = objToUpdate;

    PubSub.publish('updateTaskList', activeProject);
    PubSub.publish('updateTaskDOM', objToUpdate);
  }

  function updateProjectObj(project, form) {
    const newTitle = form.querySelector('#title').value;

    const projectList = getProjectList();
    const updatedProject = projectList.find(p => p.id == project.id);

    Project.updateTitle(updatedProject, newTitle);

    const projectIndex = projectList.findIndex(p => p.id == project.id);
    projectList[projectIndex] = updatedProject;

    if (getActiveProject().id == updatedProject.id) {
      PubSub.publish('activeProjectChange', updatedProject);
    }

    PubSub.publish('updateProjectInfo', updatedProject);
    PubSub.publish('updateProjectDOM', updatedProject);
  }

  function getProjectList() {
    const projectListString = localStorage.getItem('active-project') === 'undefined' ? 'null' : localStorage.getItem('project-list');
    return JSON.parse(projectListString);
  }

  function getActiveProject() {
    const activeProjectString = localStorage.getItem('active-project') === 'undefined' ? 'null' : localStorage.getItem('active-project');
    return JSON.parse(activeProjectString);
  }
})();

export default controller;
