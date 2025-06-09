import React, {useState, useEffect} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import FilterBar from "../../components/enterprise/FilterBar.jsx";
import {companyAPI} from "../../utils/customAxios.js";

function OrderManagement() {
    const queryClient = useQueryClient();
    const companyName = localStorage.getItem('userName') || 'TestCompany';
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [filters, setFilters] = useState({
        date: "",
        type: "",
        status: ""
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

        // Apply type/product filter
        if (filters.type) {
            result = result.filter(order =>
                order.orderItemDTO.productName.toLowerCase().includes(filters.type.toLowerCase())
            );
        }

        // OrderId 기준으로 오름차순 정렬
        result.sort((a, b) => a.orderId - b.orderId);

        setFilteredOrders(result);
    }, [orders, filters]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({...prev, [key]: value}));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleReset = () => {
        setFilters({date: "", type: "", status: ""});
        setCurrentPage(1);
    };

    // Handle status change
    const handleStatusChange = (orderItemId, newStatus) => {
        updateDeliveryStatus.mutate({orderItemId, status: newStatus});
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
                    class: 'bg-orange-100 text-orange-600',
                    text: 'Ready',
                    nextStatus: 'PROG',
                    nextText: 'Start Processing'
                };
            case 'PROG':
                return {
                    class: 'bg-violet-100 text-violet-600',
                    text: 'Processing',
                    nextStatus: 'COMP',
                    nextText: 'Complete'
                };
            case 'COMP':
                return {
                    class: 'bg-teal-100 text-teal-600',
                    text: 'Completed',
                    nextStatus: null,
                    nextText: null
                };
            case 'CANC':
                return {
                    class: 'bg-red-100 text-red-600',
                    text: 'Cancelled',
                    nextStatus: null,
                    nextText: null
                };
            default:
                return {
                    class: 'bg-gray-100 text-gray-600',
                    text: status,
                    nextStatus: null,
                    nextText: null
                };
        }
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-12">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">Order Lists</h2>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Refresh
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
                            className="grid grid-cols-9 bg-neutral-50 p-4 border-b border-neutral-300 font-extrabold text-sm text-neutral-800 rounded-t-2xl">
                            <div>Order ID</div>
                            <div>Image</div>
                            <div>Product Name</div>
                            <div>Quantity</div>
                            <div>Price</div>
                            <div>Address</div>
                            <div>Order Date</div>
                            <div>Customer Name</div>
                            <div>Status</div>
                            <div>Action</div>
                        </div>

                        {/* Table Rows */}
                        {paginatedOrders.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No orders found matching your
                                filters.</div>
                        ) : (
                            paginatedOrders.map((order, i) => {
                                const statusInfo = getStatusInfo(order.orderItemDTO.deliveryStatus);
                                return (
                                    <div key={i} className="grid grid-cols-9 items-center py-3 border-b border-gray-100 text-sm">
                                        <div className="text-neutral-800 font-semibold">#{order.orderId}</div>
                                        {/* 상품 이미지 추가 */}
                                        <div className="h-12 w-12 overflow-hidden rounded">
                                            {order.orderItemDTO.mainImageUrl ? (
                                                <img
                                                    src={order.orderItemDTO.mainImageUrl}
                                                    alt={order.orderItemDTO.productName}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-neutral-800 font-semibold">{order.orderItemDTO.productName}</div>
                                        {/* 수량 추가 */}
                                        <div className="text-neutral-800">{order.orderItemDTO.quantity}</div>
                                        {/* 가격 추가 */}
                                        <div className="text-neutral-800 font-semibold">₩{order.orderItemDTO.price.toLocaleString()}</div>
                                        <div className="text-gray-600">{order.address}</div>
                                        <div className="text-neutral-800 font-semibold">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </div>
                                        <div className="text-neutral-800 font-semibold">{order.buyerName}</div>
                                        <div>
                                            <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${statusInfo.class}`}>
                                                {statusInfo.text}
                                            </span>
                                        </div>
                                        <div>
                                            {statusInfo.nextStatus && (
                                                <button
                                                    onClick={() => handleStatusChange(order.orderItemDTO.orderItemId, statusInfo.nextStatus)}
                                                    disabled={updateDeliveryStatus.isLoading}
                                                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:bg-gray-300"
                                                >
                                                    {statusInfo.nextText}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {/* Pagination */}
                        {filteredOrders.length > 0 && (
                            <div className="flex justify-between items-center mt-6 border-t pt-6 border-gray-300">
                                <span className="text-sm text-gray-600">
                                    Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-2 py-1 border rounded disabled:opacity-50"
                                    >
                                        &lt;
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-2 py-1 border rounded disabled:opacity-50"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Status Legend */}
                        <div className="flex justify-center gap-4 pt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-400 rounded opacity-20"/>
                                <span className="text-xs font-bold text-orange-400">Ready</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-violet-600 rounded opacity-20"/>
                                <span className="text-xs font-bold text-violet-600">Processing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-teal-600 rounded opacity-20"/>
                                <span className="text-xs font-bold text-teal-600">Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-600 rounded opacity-20"/>
                                <span className="text-xs font-bold text-red-600">Cancelled</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default OrderManagement;