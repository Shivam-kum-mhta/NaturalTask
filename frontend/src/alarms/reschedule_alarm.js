export function rescheduleAlarm(task) {
    if (!task || !task.title || !task.date || !task.time) {
        console.error("Invalid task data. Task must include 'title', 'date', and 'time'.");
        return;
    }

    const newTimestamp = new Date(`${task.date}T${task.time}`).getTime();

    // Step 1: Clear the old alarm
    chrome.alarms.clear(task.title, (wasCleared) => {
        if (wasCleared) {
            console.log(`Alarm '${task.title}' cleared successfully.`);
        } else {
            console.warn(`Alarm '${task.title}' not found. Proceeding to create a new one.`);
        }

        // Step 2: Create or reschedule the alarm
        const alarmOptions = {
            when: newTimestamp,
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
        console.log(`Alarm '${task.title}' scheduled for ${task.date} at ${task.time} with frequency: ${task.frequency || "none"}`);
        chrome.storage.local.set({ [task.title]: task });
        console.log(`Task '${task.title}' data restored in local storage.`);

    });
}
