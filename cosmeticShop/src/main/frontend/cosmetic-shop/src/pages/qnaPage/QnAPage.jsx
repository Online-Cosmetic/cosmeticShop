// src/pages/qnaPage/QnAPage.jsx
import React from 'react';
import './QnAPage.css';

export default function QnAPage() {
  return (
    <>
      <header className="top-bar">
        <a href="#">Sign Up</a>
        <a href="#">Login</a>
        <a href="#">My Page</a>
        <a href="#">Cart</a>
        <a href="#">Q&A</a>
      </header>

      <header className="main-header">
        <div className="logo">cosMall</div>
        <div className="search relative">
          <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <div className="welcome">Welcome! Customer</div>
      </header>

      <nav className="categories">
        <a href="#">Makeup</a>
        <a href="#">Skincare</a>
        <a href="#">Hair</a>
        <a href="#">Body</a>
      </nav>

      <main>
        <div className="qna-detail">
          <h2>Title</h2>
          <div className="meta">
            <span>Author</span>
            <span>######</span>
            <span>yyyy-mm-dd 00:00</span>
          </div>
          <div className="content">Contents</div>
          <div className="actions">
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">Button</button>
            <button className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition">Delete</button>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-left">
          Site name
          <div className="social">
            <i className="fab fa-facebook-f hover:text-blue-600 transition"></i>
            <i className="fab fa-linkedin-in hover:text-blue-600 transition"></i>
            <i className="fab fa-youtube hover:text-red-600 transition"></i>
            <i className="fab fa-instagram hover:text-pink-600 transition"></i>
          </div>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Topic</h4>
            <a href="#">Page</a>
            <a href="#">Page</a>
            <a href="#">Page</a>
          </div>
          <div className="footer-col">
            <h4>Topic</h4>
            <a href="#">Page</a>
            <a href="#">Page</a>
            <a href="#">Page</a>
          </div>
          <div className="footer-col">
            <h4>Topic</h4>
            <a href="#">Page</a>
            <a href="#">Page</a>
            <a href="#">Page</a>
          </div>
        </div>
      </footer>
    </>
  );
}