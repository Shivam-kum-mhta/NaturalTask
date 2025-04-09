// Listen for the alarm and open the associated website
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`Alarm triggered: ${alarm.name}`);

  // Check if chrome.storage is available
  if (chrome.storage && chrome.storage.local) {
    // Retrieve the website from chrome.storage
    chrome.storage.local.get(alarm.name, (result) => {
      const website = result[alarm.name];
      if (website) {
        chrome.tabs.create({ url: website });
      } else {
        chrome.tabs.create({ url: "https://example.com" });
      }
    });
  } else {
    console.error("chrome.storage.local is not available.");
  }
});