import React from "react";
import "../../../App.css";

export const Subtitle = ({text}) => {
    return (
        <div className="subtitle">
            <div className="subtitle-text">{text}</div>
        </div>
    );
};
