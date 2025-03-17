import React from 'react';
import './index.css'; // You'll need to create this CSS file separately

const Toggle = ({ value, onChange }) => {


    return (
        <div className="switch">
            <span>
                <input
                    type="checkbox"
                    id="toggleInput"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <button
                    className="slider"
                    type="button"
                    onClick={() => onChange(!value)}
                >
                </button>
            </span>
        </div>
    );
};

export default Toggle; 