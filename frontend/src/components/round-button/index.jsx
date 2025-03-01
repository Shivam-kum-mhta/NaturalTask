import React from 'react'
import './index.css'

function RoundButton({ text, onClick }) {
    return (
        <div id="round-button" onClick={onClick}>
            <span>{text}</span>
        </div>
    )
}

export default RoundButton