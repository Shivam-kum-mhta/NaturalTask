export function addChromeAlarmForTask(task) {

  if (typeof chrome === "undefined" || typeof chrome.alarms === "undefined") {
    console.error("Only accessible in Extension.");
    return;
  }
  const taskTimestamp = new Date(`${task.date}T${task.time}`).getTime();

  const alarmOptions = {
    when: taskTimestamp,
  };

  switch (task.frequency) {
    case "daily":
      alarmOptions.periodInMinutes = 1440; // 24 hours
      break;
    case "weekly":
      alarmOptions.periodInMinutes = 10080; // 7 days
      break;
    case "weekdays":
      const weekdays = [1, 2, 3, 4, 5];
      const taskDate = new Date(`${task.date}T${task.time}`);
      weekdays.forEach((weekday) => {
        const nextWeekday = getNextWeekday(taskDate, weekday);
        const alarmName = `${task.title}-${weekday}`;
        chrome.alarms.create(alarmName, {
          when: nextWeekday.getTime(),
          periodInMinutes: 1440 * 7,
        });
        chrome.storage.local.set({ [alarmName]: task }); // Store task attributes
      });
      console.log(`Chrome alarms created for weekdays for task '${task.title}'`);
      return;
    case "monthly":
      alarmOptions.periodInMinutes = 43200; // Approx. 30 days
      break;
    case "yearly":
      alarmOptions.periodInMinutes = 525600; // Approx. 365 days
      break;
    case "test":
      alarmOptions.when = Date.now() + 60 * 1000; // 1 minute from now
      break;
    case null:
      break;
    default:
      console.error(`Invalid frequency: ${task.frequency}`);
      return;
  }

  chrome.alarms.create(task.title, alarmOptions);
  chrome.storage.local.set({ [task.title]: task }); // Store task attributes

  console.log(`Chrome alarm '${task.title}' created for ${task.date} at ${task.time}`);
}