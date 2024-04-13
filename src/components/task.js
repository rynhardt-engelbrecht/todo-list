const PubSub = require('pubsub-js');

class Task {
  constructor(title = '', desc = '', dueDate = new Date(), prio = 1, id = 0) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.prio = prio;
    this.isChecked = false;
    this.id = 0;

    PubSub.publish('newTask', this);
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
