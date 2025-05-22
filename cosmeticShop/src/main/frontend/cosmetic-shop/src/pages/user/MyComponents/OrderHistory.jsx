import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../utils/customAxios';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userAPI.order.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(err => console.error('Orders load failed:', err));
  }, []);

  const filteredOrders = orders.filter(order => {
    const term = search.toLowerCase();
    return (
      order.id.toString().includes(term) ||
      new Date(order.orderDate).toLocaleDateString().includes(term)
    );
  });

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Orders History</h2>
      {/* Search */}
      <div className="mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-100 placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-6">
        {filteredOrders.map(order => (
          <div key={order.id} className="border rounded-2xl p-4">
            <div className="mb-4 text-lg font-semibold">Order Date: {new Date(order.orderDate).toLocaleDateString()}</div>
            <div className="space-y-4">
              {order.items.map(item => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <div className="font-bold">{item.brand}</div>
                      <div>{item.productName}</div>
                      <div>{item.price}</div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                    <button className="border px-4 py-2 rounded hover:bg-gray-100">Tracking</button>
                    <button className="border px-4 py-2 rounded hover:bg-gray-100">Return</button>
                    <button className="border px-4 py-2 rounded hover:bg-gray-100">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
