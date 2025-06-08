import React from "react";
import "../../../App.css";

export const Title = ({text}) => {
    return (
        <div className="title">
            <div className="title-text">{text}</div>
        </div>
    );
};
