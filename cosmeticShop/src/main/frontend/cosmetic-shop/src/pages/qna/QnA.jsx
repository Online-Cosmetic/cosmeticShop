import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SmallButton, Pagination }  from '../../components/ui/Button/index.jsx';
import { Title } from '../../components/ui/Text/index.jsx';
import { QnASearchBar } from '../../components/ui/QnASearchBar.jsx';
import { PostForm } from '../../components/ui/PostForm.jsx';

const QnA = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchOption, setSearchOption] = useState('title');
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        handleSearch();
    }, [searchOption, searchKeyword]);

    // 기간 조회
    const postsPerPage = 10;

    const handleSearch = async () => {
        try {
            const response = await axios.get('/api/qna', { // 백엔드에서 불러오기
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            });
            let result = response.data;
            result = result.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (searchKeyword.trim() !== "") {
                result = result.filter((post) => {
                    const value = post[searchOption];
                    return value?.toLowerCase().includes(searchKeyword.toLowerCase());
                });
            }

            setAllPosts(result);
            setPage(1);

            const pages = Math.ceil(result.length / postsPerPage);
            setTotalPages(pages);

            const currentPagePosts = result.slice(0, postsPerPage);
            setPosts(currentPagePosts);
        } catch (error) {
            console.error("조회 실패:", error);
        }
    }

    // 페이지 변경 처리
    useEffect(() => {
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const currentPagePosts = allPosts.slice(startIndex, endIndex);
        setPosts(currentPagePosts);
    },[page, allPosts])

    return (
        <div className="qna relative">
            <Title text="Q&A" />
            <div className='qna-search-form'>
                <QnASearchBar onSearch={(option, keyword) => {
                    setSearchOption(option);
                    setSearchKeyword(keyword);
                }} />
            </div>
            <hr className="line"/>
            <div className='posts-container'>
                {posts.length === 0 ? (
                    <div className='flex flex-col items-center justify-center text-xl'>NO DATA</div>
                ) : (
                    posts.map(post => (
                        <PostForm key={post.id} post={post} />
                    ))
                )}
            </div>
            <div className="post-buttons">
                <Pagination
                    className="pagination" page={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                />
                <SmallButton
                    className="write-button"
                    text="Write" onClick={ handleSearch }
                />
            </div>

        </div>
    );
};

export default QnA;