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
      // Weekdays require custom logic; create alarms for each weekday
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
      return; // Exit since we created multiple alarms
    case "monthly":
      alarmOptions.periodInMinutes = 43200; // Approx. 30 days
      break;
    case "yearly":
      alarmOptions.periodInMinutes = 525600; // Approx. 365 days
      break;
    case null:
      // No repetition, just a one-time alarm
      break;
    default:
      console.error(`Invalid frequency: ${frequency}`);
      return;
  }

  // Create the alarm with the task ID as the alarm name
  chrome.alarms.create(id, alarmOptions);
  console.log(`Chrome alarm '${id}' created for ${date} at ${time}`);
}

/**
 * Helper function to get the next occurrence of a specific weekday.
 * @param {Date} startDate - The starting date.
 * @param {number} weekday - The target weekday (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
 * @returns {Date} - The next occurrence of the specified weekday.
 */
function getNextWeekday(startDate, weekday) {
  const resultDate = new Date(startDate);
  resultDate.setDate(
    resultDate.getDate() + ((7 + weekday - resultDate.getDay()) % 7)
  );
  return resultDate;
}