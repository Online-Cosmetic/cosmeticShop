import React from "react";
import "../../../App.css";

export const SmallButton = ({ className, text, ...props }) => {
  return (
    <button 
      className={
        `
        small-button 
        ${className}
        `
        } {...props}>
      <div className="
      small-button-text
      ">
        {text}
      </div>
    </button>
  );
};