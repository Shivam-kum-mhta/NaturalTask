// Listen for the alarm and open the associated website
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`Alarm triggered: ${alarm.name}`);

  // Check if chrome.storage is available
  if (chrome.storage && chrome.storage.local) {
    // Retrieve the task details from chrome.storage
    chrome.storage.local.get(alarm.name, (result) => {
      const task = result[alarm.name];
      if (task) {
        console.log(`Task details for alarm '${alarm.name}':`, task);

        // Perform the task action (e.g., open a website)
        if (task.website) {
          chrome.tabs.create({ url: task.website });
        }

        // Regenerate the alarm if it has a frequency
        if (task.frequency) {
          const taskTimestamp = new Date(`${task.date}T${task.time}`).getTime()
          const nextTriggerTime = taskTimestamp + task.frequency * 60 * 1000; // Calculate next trigger time
          console.log(`Next trigger time for alarm '${nextTriggerTime}': ${new Date(nextTriggerTime).toLocaleString()}`)
          chrome.alarms.create(alarm.name, {
            when: nextTriggerTime,
            periodInMinutes: task.frequency,
          });

          console.log(
            `Alarm '${alarm.name}' regenerated to trigger at ${new Date(nextTriggerTime).toLocaleString()}`
          );
        }
      } else {
        console.warn(`No task details found for alarm '${alarm.name}'.`);
      }
    });
  } else {
    console.error("chrome.storage.local is not available.");
  }
});