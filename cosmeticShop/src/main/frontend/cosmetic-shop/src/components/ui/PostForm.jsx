import React from "react";
import "../../App.css";

export const PostForm = ({ post }) => {
  return (
    <div>
        <table className="post-form relative">
            <tbody>
                <tr>
                    <td className="post-id">{post.id}</td>
                    <td className="post-state">{post.state}</td>
                    <td className="post-title">{post.title}</td>
                    <td className="post-author">{post.author}</td>
                    <td className="post-date">{post.date}</td>
                </tr>
            </tbody>
        </table>
        <hr className="line"/>
    </div>
  );
};