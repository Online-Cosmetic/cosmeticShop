// src/pages/admin/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/customAxios';

export default function AnalyticsDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);
    const [realtimeVisitors, setRealtimeVisitors] = useState(0);
    const [dailyVisitors, setDailyVisitors] = useState([]);
    const [topPages, setTopPages] = useState([]);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchAnalyticsData();
        // 실시간 방문자 수는 1분마다 갱신
        const interval = setInterval(() => {
            fetchRealtimeVisitors();
        }, 60000);
        return () => clearInterval(interval);
    }, [dateRange]);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [summaryRes, dailyRes, topPagesRes] = await Promise.all([
                adminAPI.analytics.getVisitorSummary(dateRange.startDate, dateRange.endDate),
                adminAPI.analytics.getDailyVisitors(dateRange.startDate, dateRange.endDate),
                adminAPI.analytics.getTopPages(10, dateRange.startDate, dateRange.endDate)
            ]);

            setSummary(summaryRes.data);
            setDailyVisitors(dailyRes.data.data || []);
            setTopPages(topPagesRes.data.data || []);
            await fetchRealtimeVisitors();
        } catch (err) {
            console.error('Error fetching analytics data:', err);
            setError('통계 데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRealtimeVisitors = async () => {
        try {
            const res = await adminAPI.analytics.getRealtimeVisitors();
            setRealtimeVisitors(res.data.realtimeVisitors || 0);
        } catch (err) {
            console.error('Error fetching realtime visitors:', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDuration = (seconds) => {
        if (!seconds || seconds === '0') return '0초';
        const sec = parseFloat(seconds);
        const hours = Math.floor(sec / 3600);
        const minutes = Math.floor((sec % 3600) / 60);
        const secs = Math.floor(sec % 60);
        
        if (hours > 0) {
            return `${hours}시간 ${minutes}분 ${secs}초`;
        } else if (minutes > 0) {
            return `${minutes}분 ${secs}초`;
        } else {
            return `${secs}초`;
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-[1262px] mx-auto p-4 flex justify-center items-center min-h-[400px]">
                <div className="text-xl text-gray-500">통계 데이터 로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-[1262px] mx-auto p-4 flex justify-center items-center min-h-[400px]">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    const maxVisitors = dailyVisitors.length > 0 
        ? Math.max(...dailyVisitors.map(d => parseInt(d.visitors) || 0))
        : 1;

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-6">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow">
                <h2 className="text-3xl font-bold text-neutral-800 mb-6">방문자 통계</h2>

                {/* 날짜 범위 선택 */}
                <div className="mb-6 flex gap-4 items-center">
                    <label className="text-gray-700 font-medium">기간 선택:</label>
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="border rounded px-3 py-2"
                    />
                    <span className="text-gray-500">~</span>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="border rounded px-3 py-2"
                    />
                    <button
                        onClick={fetchAnalyticsData}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        조회
                    </button>
                </div>

                {/* 요약 통계 카드 */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-blue-800">실시간 방문자</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">{realtimeVisitors}</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-green-800">활성 사용자</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">{summary.activeUsers || 0}</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-purple-800">신규 사용자</h3>
                            <p className="text-3xl font-bold text-purple-600 mt-2">{summary.newUsers || 0}</p>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-amber-800">페이지뷰</h3>
                            <p className="text-3xl font-bold text-amber-600 mt-2">{summary.pageViews || 0}</p>
                        </div>
                    </div>
                )}

                {/* 평균 세션 시간 */}
                {summary && summary.avgSessionDuration && (
                    <div className="mb-6">
                        <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-indigo-800">평균 세션 시간</h3>
                            <p className="text-2xl font-bold text-indigo-600 mt-2">
                                {formatDuration(summary.avgSessionDuration)}
                            </p>
                        </div>
                    </div>
                )}

                {/* 일별 방문자 차트 */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4">일별 방문자 추이</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        {dailyVisitors.length > 0 ? (
                            <div className="space-y-2">
                                {dailyVisitors.map((item, index) => {
                                    const visitors = parseInt(item.visitors) || 0;
                                    const percentage = maxVisitors > 0 ? (visitors / maxVisitors) * 100 : 0;
                                    return (
                                        <div key={index} className="flex items-center gap-4">
                                            <span className="w-24 text-sm text-gray-600">
                                                {formatDate(item.date)}
                                            </span>
                                            <div className="flex-1 bg-white rounded h-8 relative">
                                                <div
                                                    className="bg-blue-500 h-full rounded flex items-center justify-end pr-2"
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                >
                                                    {visitors > 0 && (
                                                        <span className="text-white text-sm font-medium">
                                                            {visitors}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">데이터가 없습니다.</div>
                        )}
                    </div>
                </div>

                {/* 인기 페이지 */}
                <div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4">인기 페이지 Top 10</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        {topPages.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 px-4">순위</th>
                                        <th className="text-left py-2 px-4">페이지 경로</th>
                                        <th className="text-right py-2 px-4">페이지뷰</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topPages.map((page, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-100">
                                            <td className="py-2 px-4">{index + 1}</td>
                                            <td className="py-2 px-4 font-mono text-sm">{page.pagePath || '/'}</td>
                                            <td className="py-2 px-4 text-right font-semibold">{page.pageViews}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center text-gray-500 py-8">데이터가 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

