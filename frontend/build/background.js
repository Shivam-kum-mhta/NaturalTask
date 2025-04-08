// filepath: /workspaces/NaturalTask/frontend/src/background.js

chrome.alarms.onAlarm.addListener((alarm) => {
    console.log(`Alarm triggered: ${alarm.name}`);
    chrome.tabs.create({ url: "https://leetcode.com" }); // Example action
  });