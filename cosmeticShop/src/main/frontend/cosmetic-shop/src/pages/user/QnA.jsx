import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QnA = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 기본 기간 설정
    const getDefault = () => {
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        return {
            startDate: lastMonth.toISOString().split("T")[0],
            endDate: today.toISOString().split("T")[0]
        };
    };

    const { startDate: defaultStart, endDate: defaultEnd } = getDefault();
    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);

    useEffect(() => {
        handleSearch();
    }, []);
        
    // 기간 조회
    const postsPerPage = 10;

    const handleSearch = async () => {
        try {
            // const response = await axios.get('/qnaDummy.json');
            const response = await axios.get('/api/qna', {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            });
            const result = response.data;

            const filtered = result.filter(post => {
                const postDate = new Date(post.date);
                const sDate = new Date(startDate);
                const eDate = new Date(endDate);
    
                return postDate >= sDate && postDate <= eDate;
            });
    
            setAllPosts(filtered);
            setPage(1);

            const pages = Math.ceil(filtered.length / postsPerPage);
            setTotalPages(pages);

            const currentPagePosts = filtered.slice(0, postsPerPage);
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
        <div>
            <h1>Q&A</h1>
            <div id="period">
                <label>기간</label>
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                ~
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button type="button" onClick={ handleSearch }>조회</button>
            </div>

            <table>
                <thead>
                    <tr>
                    <th>#</th>
                        <th>State</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.length === 0 ? (
                        <tr>
                            <td>NO DATA</td>
                        </tr>
                    ) : (
                        posts.map(post => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                    <td>{post.state}</td>
                                    <td>{post.title}</td>
                                    <td>{post.author}</td>
                                    <td>{post.date}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>prev</button>
                    <span>{page}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>next</button>
                </div>
            )}
            <div>
                <a href="">write</a>
            </div>

        </div>
    );
};

export default QnA;