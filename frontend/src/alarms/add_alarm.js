const task = {
  id: "ZXA34fdnwuT98AbcLmn1",
  title: "SearchShield Code Refactor",
  frequency: "daily",
  description: "Spend time improving the SearchShield codebase, focus on performance and modularity.",
  end_date: "2025-06-30",
  type: "regular",
  start_date: "2025-04-07",
  date: "2025-04-07",
  time: "21:00:00",
  recurring_until: "2025-06-30",
  website: "https://github.com/shivam/searchshield"
};

export function scheduleTask(task) {
  const { id, date, time, website } = task;

  // Convert date + time to timestamp
  const taskTime = new Date(`${date}T${time}`).getTime();

  // Schedule daily alarm using the task ID as alarm name
  chrome.alarms.create(id, {
    when: taskTime,
    periodInMinutes: 1440, // Daily
  });

  // Listen for the alarm and open tab if it matches the task ID
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === id && website) {
      chrome.tabs.create({ url: website });
    }
  });

  console.log(`Alarm '${id}' scheduled for ${date} ${time}`);
}
