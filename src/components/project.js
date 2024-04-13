const PubSub = require('pubsub-js');

class Project {
  constructor(title = '', taskList = []) {
    this.title = title;
    this.taskList = taskList;
    this.id = this.createID();

    PubSub.publish('newProject', this);
    PubSub.publish('activeProjectChange', this);
  }

  createID() {
    const projectList = JSON.parse(localStorage.getItem('project-list'));

    if (projectList && projectList.length > 0) {
      return projectList[projectList.length - 1].id + 1;
    }

    return 0;
  }

  static updateTitle(obj, title) {
    obj.title = title;
  }
}

export default Project;
