export function addChromeAlarmForTask(task) {
  // Convert date and time to a timestamp
  const taskTimestamp = new Date(`${task.date}T${task.time}`).getTime();

  const alarmOptions = {
    when: taskTimestamp,
  };

  // Handle different frequency options
  switch (task.frequency) {
    case "daily":
      alarmOptions.periodInMinutes = 1440; // 24 hours
      break;
    case "weekly":
      alarmOptions.periodInMinutes = 10080; // 7 days
      break;
    case "weekdays":
      const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday
      const taskDate = new Date(`${task.date}T${task.time}`);
      weekdays.forEach((weekday) => {
        const nextWeekday = getNextWeekday(taskDate, weekday);
        const alarmName = `${task.title}-${weekday}`;
        chrome.alarms.create(alarmName, {
          when: nextWeekday.getTime(),
          periodInMinutes: 1440 * 7, // Repeat weekly
        });
        // Store the website in chrome's local storage
        chrome.storage.local.set({ [alarmName]: task.website });
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

  // Create the alarm with the task task.title as the alarm name
  chrome.alarms.create(task.title, alarmOptions);

  // Store the website in chrome.storage
  chrome.storage.local.set({ [task.title]: task.website });

  console.log(`Chrome alarm '${task.title}' created for ${task.date} at ${task.time}`);
}
