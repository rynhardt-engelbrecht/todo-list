const PubSub = require('pubsub-js');

class Project {
  constructor(title = '', todoList = [], id = 0) {
    this.title = title;
    this.todoList = todoList;
    this.id = id;

    PubSub.publish('newProject', this);
  }

  static updateTitle(obj, title) {
    obj.title = title;
  }
}

export default Project;
