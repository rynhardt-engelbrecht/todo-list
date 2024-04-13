const PubSub = require('pubsub-js');

class Task {
  constructor(title = '', desc = '', dueDate = new Date(), prio = 1) {
    const activeProject = JSON.parse(localStorage.getItem('active-project'));

    if (activeProject) {
      this.title = title;
      this.desc = desc;
      this.dueDate = dueDate;
      this.prio = prio;
      this.isChecked = false;
      this.id = this.createID(activeProject);

      PubSub.publish('newTask', this);
      activeProject.taskList.push(this);
      PubSub.publish('updateTaskList', activeProject);
    } else {
      console.error('task creation failed');
      return;
    }
  }

  createID(activeProject) {
    const taskList = activeProject.taskList;

    if (taskList.length > 0) {
      return taskList[taskList.length - 1].id + 1;
    }

    return 0;
  }

  static updateInfo(obj, title, desc, dueDate, prio) {
    obj.title = title;
    obj.desc = desc;
    obj.dueDate = dueDate;
    obj.prio = prio;
  }

  static updatePrio(obj, prio) {
    obj.prio = prio;
  }

  static updateChecked(obj, isChecked) {
    obj.isChecked = isChecked;
  }
}

export default Task;
