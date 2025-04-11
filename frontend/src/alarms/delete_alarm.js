export function deleteAlarm(task) {
    console.log("Deleting alarm for task:", task);
    if (!task || !task.title) {
        console.error("Invalid task data. Task must include 'title'.");
        return;
    }
    chrome.alarms.clear(task.title, (wasCleared) => {
        if (wasCleared) {
            console.log(`Alarm '${task.title}' cleared successfully.`);
} else {
            console.warn(`Alarm '${task.title}' not found.`);
        }
    });
  // remove the task from local storage
    chrome.storage.local.remove(task.title, () => {
        console.log(`Task '${task.title}' removed from local storage.`);
    });
    
}