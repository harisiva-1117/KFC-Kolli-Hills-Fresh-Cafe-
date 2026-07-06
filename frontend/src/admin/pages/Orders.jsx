import { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
} from "../services/productService";
const Orders = () => {
  const [orders, setOrders] = useState([]);

useEffect(() => {
  loadOrders();
}, []);

const handleStatusChange = async (id, status) => {
  try {
    await updateOrderStatus(id, status);
    loadOrders();
  } catch (err) {
    console.error(err);
    alert("Failed to update order");
  }
};

const loadOrders = async () => {
  try {
    const data = await getOrders();

    console.log("Orders:", data);

    setOrders(data);
  } catch (err) {
    console.error("Orders Error:", err);
  }
};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Orders Management
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#2E1B18] text-white">
            <tr>
              <th className="p-4">Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Status</th>
              <th>Pickup</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-8 text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b"
                >
                  <td className="p-4">
  {order.id.slice(0, 8).toUpperCase()}
</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_phone}</td>
                  <td>₹{order.total}</td>
                 <td>
  <select
    value={order.status}
    onChange={(e) =>
      handleStatusChange(order.id, e.target.value)
    }
    className="border rounded px-2 py-1"
  >
    <option value="pending">Pending</option>
    <option value="preparing">Preparing</option>
    <option value="ready">Ready</option>
    <option value="completed">Completed</option>
    <option value="cancelled">Cancelled</option>
  </select>
</td>
                  <td>{order.pickup_time || "ASAP"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;