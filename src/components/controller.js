const PubSub = require('pubsub-js');

const controller = (() => {

  const prioritySelectListener = function(msg, data) {
    const prioritySelect = data.querySelector('.task-prio select');

    prioritySelect.addEventListener('change', () => {
      const selectedPrio = prioritySelect.value;
      data.setAttribute('data-prio', selectedPrio);
    })
  }

  return {
    subscriptions: [
      PubSub.subscribe('newTaskElement', prioritySelectListener),
    ],
  };
})();
