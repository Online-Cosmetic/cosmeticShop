import React, { useState } from 'react';
import SearchIcon from '../../assets/SearchIcon.svg?react';
import "../../App.css";

export const QnASearchBar = ({onSearch}) => {
    const [option, setOption] = useState('title');
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        onSearch(option, keyword);
    };

    return (
        <div className='qna-search-bar'>
            <select
                value={option} className='qna-search-option'
                onChange={(e) => setOption(e.target.value)}
            >
                <option value="title">Title</option>
                <option value="author">Author</option>
            </select>
            <div className='vertical-line'></div>
            <input 
                type="text" value={keyword} className='qna-search-input'
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search Q&A"
            />
            <button
                className='qna-search-button'
                onClick={handleSearch}
            >
                <SearchIcon className='qna-search-button' />
            </button>
        </div>
    );
}