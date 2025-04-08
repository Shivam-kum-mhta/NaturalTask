export function addChromeAlarmForTask(task) {
  const { id, date, time, frequency } = task;

  // Convert date and time to a timestamp
  const taskTimestamp = new Date(`${date}T${time}`).getTime();

  const alarmOptions = {
    when: taskTimestamp,
  };

  // Handle different frequency options
  switch (frequency) {
    case "daily":
      alarmOptions.periodInMinutes = 1440; // 24 hours
      break;
    case "weekly":
      alarmOptions.periodInMinutes = 10080; // 7 days
      break;
    case "weekdays":
      const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday
      const taskDate = new Date(`${date}T${time}`);
      weekdays.forEach((weekday) => {
        const nextWeekday = getNextWeekday(taskDate, weekday);
        chrome.alarms.create(`${id}-${weekday}`, {
          when: nextWeekday.getTime(),
          periodInMinutes: 1440 * 7, // Repeat weekly
        });
      });
      console.log(`Chrome alarms created for weekdays for task '${id}'`);
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
      console.error(`Invalid frequency: ${frequency}`);
      return;
  }

  // Create the alarm with the task ID as the alarm name
  chrome.alarms.create(id, alarmOptions);
  console.log(`Chrome alarm '${id}' created for ${date} at ${time}`);
}

// Listen for the alarm and open a new tab
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`Alarm triggered: ${alarm.name}`);
  chrome.tabs.create({ url: "https://leetcode.com" });
});
