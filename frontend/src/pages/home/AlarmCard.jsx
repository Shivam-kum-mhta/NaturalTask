import React from 'react';

const AlarmCard = ({ alarm, clickOnTask }) => {
  const handleClick = () => {
    clickOnTask(alarm.name);
  };

  return (
    <div
      id="task-card"
      className="light cursor-pointer p-4 rounded shadow hover:bg-gray-200 transition"
      onClick={handleClick}
    >
      <div className="tc-content">
        <div className="bg-gray-100 p-3 rounded shadow flex flex-col space-y-2">
          <div>
            <strong>Task:</strong> {alarm.name}
          </div>
          <div>
            <strong>Time:</strong> {new Date(alarm.scheduledTime).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmCard;