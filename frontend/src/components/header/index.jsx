import React from 'react'
import './index.css'
import { IoSettingsSharp } from "react-icons/io5";
import { TiInfoLarge } from "react-icons/ti";

function Header() {
    return (
        <div id="header">
            <p>NaturalTask</p>
            <div id="header-right">
                <button className="header-button" onClick={() => { }} >
                    <IoSettingsSharp />
                </button>
                <button className="header-button" onClick={() => { }} >
                    <TiInfoLarge />
                </button>
            </div>
        </div>
    )
}

export default Header