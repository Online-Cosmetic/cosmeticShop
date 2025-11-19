import React, {useState, useEffect} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import FilterBar from "../../components/enterprise/FilterBar.jsx";
import {companyAPI} from "../../utils/customAxios.js";
import { getImageUrl } from "../../utils/imageUtils.js";
import { 
    ArrowPathIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    TruckIcon,
    ClockIcon
} from "@heroicons/react/24/outline";

function OrderManagement() {
    const queryClient = useQueryClient();
    const companyName = localStorage.getItem('userName') || 'TestCompany';
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [filters, setFilters] = useState({
        date: "",
        status: "",
        sort: "asc" // 기본값은 오름차순
    });

    // Fetch order data
    const {
        data: orders = [],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['companyOrders', companyName],
        queryFn: async () => {
            try {
                const response = await companyAPI.order.getCompanyOrderItems(companyName);
                console.log("Company orders loaded:", response.data);
                return response.data;
            } catch (err) {
                console.error("Error fetching company orders:", err);
                throw err;
            }
        },
        retry: 1,
        staleTime: 60000 // 1 minute
    });

    // Update delivery status mutation
    const updateDeliveryStatus = useMutation({
        mutationFn: ({orderItemId, status}) => {
            console.log("orderItemId = " + orderItemId)
            console.log("status = " + status)
            return companyAPI.order.updateDeliveryStatus(orderItemId, {deliveryStatus: status});
        },
        onSuccess: () => {
            // Invalidate and refetch orders after status update
            queryClient.invalidateQueries(['companyOrders', companyName]);
        }
    });

    // Apply filters and pagination
    useEffect(() => {
        if (!orders.length) return;

        let result = [...orders];

        // Apply date filter
        if (filters.date) {
            const filterDate = new Date(filters.date).toDateString();
            result = result.filter(order => {
                const orderDate = new Date(order.orderDate).toDateString();
                return orderDate === filterDate;
            });
        }

        // Apply status filter - 여기서 상태 이름 매핑
        if (filters.status) {
            // 필터바의 상태값을 서버 상태값으로 변환
            let statusMapping = {
                'completed': 'COMP',
                'processing': 'PROG',
                'cancelled': 'CANC',
                'ready': 'READY'
            };

            const serverStatus = statusMapping[filters.status.toLowerCase()] || filters.status;
            result = result.filter(order => order.orderItemDTO.deliveryStatus === serverStatus);
        }

        // Order ID 기준으로 정렬 (오름차순/내림차순)
        if (filters.sort === "asc") {
            result.sort((a, b) => a.orderId - b.orderId);
        } else {
            result.sort((a, b) => b.orderId - a.orderId);
        }

        setFilteredOrders(result);
    }, [orders, filters]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({...prev, [key]: value}));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleReset = () => {
        setFilters({date: "", status: "", sort: "asc"});
        setCurrentPage(1);
    };

    // Handle status change
    const handleStatusChange = (orderItemId, newStatus) => {
        updateDeliveryStatus.mutate({orderItemId, status: newStatus});
    };

    // 주문 취소 처리 함수 
    const handleCancelOrder = (orderItemId) => {
        if (window.confirm('정말로 이 주문을 취소하시겠습니까? 취소하면 재고가 원복됩니다.')) {
            updateDeliveryStatus.mutate({orderItemId, status: 'CANC'});
        }
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    // Get status display info
    const getStatusInfo = (status) => {
        switch (status) {
            case 'READY':
                return {
                    class: 'bg-orange-50 text-orange-700 border border-orange-200',
                    text: '배송준비',
                    nextStatus: 'PROG',
                    nextText: '배송 시작',
                    icon: ClockIcon
                };
            case 'PROG':
                return {
                    class: 'bg-blue-50 text-blue-700 border border-blue-200',
                    text: '배송중',
                    nextStatus: 'COMP',
                    nextText: '배송 완료',
                    icon: TruckIcon
                };
            case 'COMP':
                return {
                    class: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                    text: '배송완료',
                    nextStatus: null,
                    nextText: null,
                    icon: CheckCircleIcon
                };
            case 'CANC':
                return {
                    class: 'bg-red-50 text-red-700 border border-red-200',
                    text: '주문취소',
                    nextStatus: null,
                    nextText: null,
                    icon: XCircleIcon
                };
            default:
                return {
                    class: 'bg-gray-50 text-gray-700 border border-gray-200',
                    text: status,
                    nextStatus: null,
                    nextText: null,
                    icon: null
                };
        }
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-6 flex flex-col gap-6">
            <div className="w-full px-8 py-8 bg-white border rounded-2xl shadow flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">주문상품 내역</h2>
                    <button
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md font-medium"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        새로고침
                    </button>
                </div>

                {/* Filter Section */}
                <FilterBar filters={filters} onChange={handleFilterChange} onReset={handleReset}/>

                {isLoading ? (
                    <div className="text-center py-10">Loading orders...</div>
                ) : isError ? (
                    <div className="text-center py-10 text-red-500">
                        Error loading orders: {error.message}
                    </div>
                ) : (
                    <>
                        {/* Table Header - 열 추가 */}
                        <div
                            className="grid grid-cols-10 bg-neutral-50 px-4 py-3 border-b border-neutral-300 font-extrabold text-sm text-neutral-800 rounded-t-2xl gap-4">
                            <div className="flex items-center">주문ID</div>
                            <div className="flex items-center">이미지</div>
                            <div className="flex items-center">상품이름</div>
                            <div className="flex items-center">주문수량</div>
                            <div className="flex items-center">가격</div>
                            <div className="flex items-center">주소</div>
                            <div className="flex items-center">주문일</div>
                            <div className="flex items-center">고객이름</div>
                            <div className="flex items-center">상태</div>
                            <div className="flex items-center">작업</div>
                        </div>

                        {/* Table Rows */}
                        {paginatedOrders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">필터와 일치하는 주문이 없습니다.</div>
                        ) : (
                            paginatedOrders.map((order, i) => {
                                const statusInfo = getStatusInfo(order.orderItemDTO.deliveryStatus);
                                const StatusIcon = statusInfo.icon;
                                return (
                                    <div key={i} className="grid grid-cols-10 items-center py-4 px-4 border-b border-gray-100 text-sm hover:bg-gray-50 transition-colors gap-4">
                                        <div className="text-neutral-800 font-semibold whitespace-nowrap">#{order.orderId}</div>
                                        {/* 상품 이미지 추가 */}
                                        <div className="h-14 w-14 overflow-hidden rounded-lg border border-gray-200 flex-shrink-0">
                                            {order.orderItemDTO.mainImageUrl ? (
                                                <img
                                                    src={order.orderItemDTO.mainImageUrl ? getImageUrl(order.orderItemDTO.mainImageUrl) : "https://placehold.co/64x64"}
                                                    alt={order.orderItemDTO.productName}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-neutral-800 font-semibold min-w-0 truncate">{order.orderItemDTO.productName}</div>
                                        {/* 수량 추가 */}
                                        <div className="text-neutral-800 font-medium whitespace-nowrap">{order.orderItemDTO.quantity}개</div>
                                        {/* 가격 추가 */}
                                        <div className="text-neutral-800 font-semibold whitespace-nowrap">₩{order.orderItemDTO.price.toLocaleString()}</div>
                                        <div className="text-gray-600 text-xs min-w-0 truncate">{order.address}</div>
                                        <div className="text-neutral-800 font-medium text-xs whitespace-nowrap">
                                            {new Date(order.orderDate).toLocaleDateString('ko-KR')}
                                        </div>
                                        <div className="text-neutral-800 font-semibold whitespace-nowrap">{order.buyerName}</div>
                                        <div className="flex items-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${statusInfo.class}`}>
                                                {StatusIcon && <StatusIcon className="w-4 h-4 flex-shrink-0" />}
                                                {statusInfo.text}
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5 flex-wrap items-center">
                                            {statusInfo.nextStatus && (
                                                <button
                                                    onClick={() => handleStatusChange(order.orderItemDTO.orderItemId, statusInfo.nextStatus)}
                                                    disabled={updateDeliveryStatus.isLoading}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                                                >
                                                    {statusInfo.nextStatus === 'PROG' && <TruckIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                                                    {statusInfo.nextStatus === 'COMP' && <CheckCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                                                    {statusInfo.nextText}
                                                </button>
                                            )}
                                            {/* 취소 버튼 - READY 또는 PROG 상태일 때만 표시 */}
                                            {(order.orderItemDTO.deliveryStatus === 'READY' || order.orderItemDTO.deliveryStatus === 'PROG') && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.orderItemDTO.orderItemId)}
                                                    disabled={updateDeliveryStatus.isLoading}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                                                >
                                                    <XCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                                    취소
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {/* Pagination */}
                        {filteredOrders.length > 0 && (
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                <span className="text-sm text-gray-600">
                                    Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        &lt;
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Status Legend */}
                        <div className="flex justify-center gap-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"/>
                                <span className="text-xs font-semibold text-gray-700">배송준비</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"/>
                                <span className="text-xs font-semibold text-gray-700">배송중</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full"/>
                                <span className="text-xs font-semibold text-gray-700">배송완료</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"/>
                                <span className="text-xs font-semibold text-gray-700">주문취소</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default OrderManagement;