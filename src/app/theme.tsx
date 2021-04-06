import {SetOpacity} from "./utilities";
import React from "react";

type ThemeType = {
    palette: {
        background: string,
        text: string,
        accent: string,
        shadow: string,
        link: string,
        informational: string,
        success: string,
        warning: string,
        error: string
    },
    spacing: {
        titlebarHeight: number,
        toolbarHeight: number
    }
}

const darkTheme: ThemeType = {
    palette: {
        background: "#121212",
        text: "#ffffff",
        accent: "#03809d",
        shadow: "#6c7086",
        link: "#cb6501",
        informational: "#ffffff",
        success: "#32CD32",
        warning: "#ffffff",
        error: "#cf142b"
    },
    spacing: {
        "titlebarHeight": 35,
        "toolbarHeight": 35
    }
}

const lightTheme: ThemeType = {
    palette: {
        background: "#ffffff",
        text: "#000000",
        accent: "#e5e5e5",
        shadow: "#14213d",
        link: "#fca311",
        informational: "#ffffff",
        success: "#32CD32",
        warning: "#ffffff",
        error: "#cf142b"
    },
    "spacing": {
        "titlebarHeight": 35,
        "toolbarHeight": 35
    }
}

export default lightTheme;

export function GetGlassStyle(color: string, amount: number): React.CSSProperties {
    return {
        backgroundColor: SetOpacity(color, amount),
        backgroundImage: `linear-gradient(to bottom right, ${SetOpacity(color, amount/2)}, ${SetOpacity(color, 0)})`,
        backdropFilter: `blur(${amount*1.5}px)`,
        boxShadow: "10px 10px 10px rgba(30, 30, 30, 0.1)"
    }
}
