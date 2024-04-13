const PubSub = require('pubsub-js');

const controller = (() => {

  const prioritySelectListener = function(msg, data) {
    console.log(msg);
    const prioritySelect = data.querySelector('.task-prio select');

    prioritySelect.addEventListener('change', () => {
      const selectedPrio = prioritySelect.value;
      data.setAttribute('data-prio', selectedPrio);
    })
  }

  const taskCheckListener = function(msg, data) {
    console.log(msg);
    const checkbox = data.querySelector('.task-check');
    const prioSelect = data.querySelector('.task-prio select')

    checkbox.addEventListener('change', () => {
      data.classList.toggle('complete');
      if (prioSelect.disabled) {
        prioSelect.disabled = false;
      } else {
        prioSelect.disabled = true;
      }
    });
  }

  return {
    subscriptions: [
      PubSub.subscribe('newTaskElement', prioritySelectListener),
      PubSub.subscribe('newTaskElement', taskCheckListener)
    ],
  };
})();
