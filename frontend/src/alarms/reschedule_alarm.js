function rescheduleAlarm(task) {
    const { id, date, time, frequency } = task;
  
    const newTimestamp = new Date(`${date}T${time}`).getTime();
  
    // Step 1: Clear the old alarm
    chrome.alarms.clear(id, (wasCleared) => {
      if (wasCleared) {
        // Step 2: Create the alarm again
        const alarmOptions = {
          when: newTimestamp,
        };
  
        if (frequency === "daily") {
          alarmOptions.periodInMinutes = 1440;
        }
  
        chrome.alarms.create(id, alarmOptions);
        console.log(`Alarm '${id}' rescheduled to ${date} ${time}`);
      } else {
        console.warn(`Alarm '${id}' not found. Creating new one.`);
        chrome.alarms.create(id, {
          when: newTimestamp,
          periodInMinutes: frequency === "daily" ? 1440 : undefined,
        });
      }
    });
  }
  