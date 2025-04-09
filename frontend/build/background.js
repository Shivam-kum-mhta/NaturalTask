chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`Alarm triggered: ${alarm.name}`);

  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(alarm.name, (result) => {
      const task = result[alarm.name];

      if (task) {
        console.log(`Task details for alarm '${alarm.name}':`, task);

        // Open the website if specified
        if (task.website) {
          chrome.tabs.create({ url: task.website });
        }

        // Regenerate the alarm based on frequency
        if (task.frequency) {
          const currentTime = new Date();
          let nextTriggerDate;

          const originalTime = new Date(`${task.date}T${task.time}`);

          switch (task.frequency) {
            case 'daily':
              nextTriggerDate = new Date(currentTime);
              nextTriggerDate.setDate(currentTime.getDate() + 1);
              break;

            case 'weekly':
              nextTriggerDate = new Date(currentTime);
              nextTriggerDate.setDate(currentTime.getDate() + 7);
              break;

            case 'monthly':
              nextTriggerDate = new Date(currentTime);
              nextTriggerDate.setMonth(currentTime.getMonth() + 1);
              break;

            case 'yearly':
              nextTriggerDate = new Date(currentTime);
              nextTriggerDate.setFullYear(currentTime.getFullYear() + 1);
              break;

            default:
              console.warn(`Unknown frequency '${task.frequency}'`);
              return;
          }

          // Set time portion (HH:MM:SS) to match the original task time
          nextTriggerDate.setHours(originalTime.getHours());
          nextTriggerDate.setMinutes(originalTime.getMinutes());
          nextTriggerDate.setSeconds(originalTime.getSeconds());

          const nextTriggerTime = nextTriggerDate.getTime();

          chrome.alarms.create(alarm.name, {
            when: nextTriggerTime,
          });

          console.log(
            `Alarm '${alarm.name}' rescheduled to ${nextTriggerDate.toLocaleString()}`
          );
        }
      } else {
        console.warn(`No task data found for alarm '${alarm.name}'`);
      }
    });
  } else {
    console.error("chrome.storage.local is not available.");
  }
});
