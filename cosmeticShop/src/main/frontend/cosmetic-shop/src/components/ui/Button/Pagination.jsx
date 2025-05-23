import React from "react";
import PreviousIcon from '../../../assets/Previous.svg?react';
import NextIcon from '../../../assets/Next.svg?react';
import "../../../App.css";


export const Pagination = ({ page, totalPages, onPageChange }) => {
    const generatePages = () => {
        if (totalPages === 1) return [1]; // Always show at least one page
    
        let startPage = Math.max(1, page - 4 + ((page > 5) ? (page % 5 === 0 ? 4 : page % 5 - 1) : 0));
    
        // Adjust to show only up to 5 pages
        if (totalPages - startPage < 4) {
          startPage = Math.max(1, totalPages - 4);
        }
    
        const pages = [];
        for (let i = startPage; i <= Math.min(totalPages, startPage + 4); i++) {
          pages.push(i);
        }
        return pages;
      };
    
      const handleClick = (pageNumber) => {
        if (pageNumber !== page) {
          onPageChange(pageNumber);
        }
      };
    
      return (
        <div className="pagination">
          <button
            onClick={() => handleClick(page - 1)}
            disabled={page === 1}
          >
            <PreviousIcon className="page-button" />
          </button>
          {generatePages().map((p) => (
            <button
              key={p} 
              onClick={() => handleClick(p)}
              className={p === page ? "page-select-active" : "page-select-default"}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => handleClick(page + 1)}
            disabled={page === totalPages}
          >
            <NextIcon className="page-button" />
          </button>
        </div>
      );
};
