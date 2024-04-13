const PubSub = require('pubsub-js');

function createTask(title = '', desc = '', dueDate = new Date(), prio = 1, isChecked = false, id = 0) {
  const obj = {
    title,
    desc,
    dueDate,
    prio,
    isChecked,
    id,
    updateInfo: function(title, desc, dueDate, prio) {
      this.title = title;
      this.desc = desc;
      this.dueDate = dueDate;
      this.prio = prio;
    },
    updateChecked: function(checkState) {
      this.checked = checkState;
    },
    subscription: PubSub.subscribe('updateTask', updateInfo)
  }

  // notify subscribers of the 'newTask' topic
  PubSub.publish('newTask', obj);

  return obj;
}
