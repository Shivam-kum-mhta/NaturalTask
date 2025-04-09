import React, { useEffect, useState } from 'react';

const AlarmList = () => {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    // Get all alarms from Chrome API
    if (typeof chrome === 'undefined' || typeof chrome.alarms === 'undefined') {
      console.error('Only accessible in Extension.');
      return;
    }
     chrome.alarms.getAll((alarmList) => {
      setAlarms(alarmList);
    });
  }, []);

  if (!alarms || alarms.length === 0) {
    return <p className="text-gray-500">No alarms currently.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Scheduled Alarms</h2>
      <ul className="space-y-2">
        {alarms.map((alarm) => (
          <li key={alarm.name} className="bg-gray-100 p-3 rounded shadow">
            <div><strong>ID:</strong> {alarm.name}</div>
            <div><strong>Time:</strong> {new Date(alarm.scheduledTime).toLocaleString()}</div>
            <div><strong>Repeats:</strong> {alarm.periodInMinutes ? `${alarm.periodInMinutes} min` : 'One-time'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlarmList;
