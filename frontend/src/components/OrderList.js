// frontend/src/components/OrderList.js
import React, { useEffect, useState } from "react";
import { fetchOrders as apiFetchOrders, updateOrderStatus } from "../api";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function OrderList() {

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const statusOptions = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled"
  ];

  const fetchOrders = async () => {
    try {
      const data = await apiFetchOrders();
      // Guard: only set if it's actually an array
      if (Array.isArray(data)) {
        setOrders(data);
        setError(null);
      } else {
        setOrders([]);
        setError(data.error || "Failed to load orders");
      }
    } catch (err) {
      setOrders([]);
      setError("Could not connect to server");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    fetchOrders();
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Cancel this order?");
    if (!confirmCancel) return;

    await fetch(`${API_BASE}/orders/${id}/cancel`, { method: "PATCH" });
    fetchOrders();
  };

  return (
    <div>
      <h2>Orders</h2>

      {/* Shows the actual backend error so you can debug */}
      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          Error: {error}
        </p>
      )}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{order.product_name}</td>
              <td>{order.quantity}</td>
              <td>{order.total_amount}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {(order.status === "pending" || order.status === "confirmed") && (
                  <button
                    style={{
                      marginLeft: "10px",
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer"
                    }}
                    onClick={() => handleCancel(order.id)}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
