import React from 'react';

type Props = {
    color: string
}

const LibraryItem = (props: Props): React.ReactElement => {
    return (
        <button id="search-button" style={{width: "50px", height: "50px", backgroundColor: "transparent", border: "none", cursor: "pointer", overflow: "hidden", outline: "none", margin: "5px", color: props.color, backgroundRepeat: "no-repeat", opacity: "0.75", fontSize: "50%"}} onClick={() => console.log("clicked")}>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="25px" height="25px" viewBox="0 0 300 300" style={{paddingBottom: "3px"}}>
                <defs/>
                <g>
                    <rect x="0" y="0" width="300" height="300" rx="45" ry="45" fill="transparent" stroke={props.color}
                          strokeWidth="20" pointerEvents="all"/>
                    <rect x="30" y="30" width="100" height="100" rx="15" ry="15" fill={props.color} stroke={props.color}/>
                    <ellipse cx="220" cy="80" rx="50" ry="50" fill={props.color} stroke="#000000"/>
                    <path d="M 170 220 L 170 180 Q 170 170 178.94 174.47 L 261.06 215.53 Q 270 220 261.06 224.47 L 178.94 265.53 Q 170 270 170 260 Z"
                          fill={props.color} stroke={props.color} strokeMiterlimit="10" transform="rotate(-90,220,220)"/>
                    <path d="M 55 195 L 72.93 177.07 Q 80 170 87.07 177.07 L 122.93 212.93 Q 130 220 122.93 227.07 L 87.07 262.93 Q 80 270 72.93 262.93 L 37.07 227.07 Q 30 220 37.07 212.93 Z"
                          fill={props.color} stroke={props.color} strokeMiterlimit="10"/>
                </g>
            </svg>
            Library
        </button>

    )
}

export default LibraryItem;
