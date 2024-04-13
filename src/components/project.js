const PubSub = require('pubsub-js');

function createProject(title = '', todoList = [], id = 0) {
  const obj = {
    title,
    todoList,
    id
  }

  PubSub.publish('newProject', obj);

  return obj;
}
