const PubSub = require('pubsub-js');

class Project {
  constructor(title = '', todoList = []) {
    this.title = title;
    this.todoList = todoList;
    this.id = this.createID();

    PubSub.publish('newProject', this);
  }

  createID() {
    const projectList = JSON.parse(localStorage.getItem('project-list'));

    if (projectList) {
      return projectList[projectList.length - 1].id + 1;
    }

    return 0;
  }

  static updateTitle(obj, title) {
    obj.title = title;
  }
}

export default Project;
