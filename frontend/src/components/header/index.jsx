import React from 'react'
import './index.css'
import RoundButton from '../round-button'

function Header() {
    return (
        <div id="header">
            <p>NaturalTask</p>
            <div id="header-right">
                <RoundButton text="$" onClick={() => { }} />
                <RoundButton text="@" onClick={() => { }} />
            </div>
        </div>
    )
}

export default Header