import {SetOpacity} from "./utilities";
import React from "react";

export default {
    "palette": {
        "background": "#282a36",
        "text": "#f8f8f2",
        "accent": "#6272a4",
        "shadow": "#44475a",
        "link": "#44475a"
    },
    "spacing": {
        "titlebarHeight": 35,
        "toolbarHeight": 35
    }
}

export function GetGlassStyle(color: string, amount: number): React.CSSProperties {
    return {
        backgroundColor: SetOpacity(color, amount),
        backgroundImage: `linear-gradient(to bottom right, ${SetOpacity(color, amount/2)}, ${SetOpacity(color, 0)})`,
        backdropFilter: `blur(${amount*1.5}px)`,
        boxShadow: "10px 10px 10px rgba(30, 30, 30, 0.1)"
    }
}
