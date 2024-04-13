const PubSub = require('pub-sub.js');

(function initializeDOMHandler() {
  return {
    createTaskElement: function(msg, data) {

    },
    subscriptions: [
      PubSub.subscribe('newTask', this.createTaskElement),
    ]
  }
})();
