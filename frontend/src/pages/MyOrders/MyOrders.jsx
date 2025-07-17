import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/Storecontext";
import "./MyOrders.css";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { url } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/user-order`, // ✅ Updated from user-orders
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const ordersData = response.data?.orders || [];
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {orders.length === 0 && (
          <p className="no-orders-message">No orders found.</p>
        )}

        {orders.map((order, index) => (
          <div key={index} className="order-grid">
            <div className="icon">
              <img src={assets.parcel_icon} alt="parcel" />
            </div>

            <p className={`item-list ${order.items.length > 6 ? "wrap-text" : ""}`}>
              {order.items
                .map((item) => `${item.name} × ${item.quantity}`)
                .join(", ")}
            </p>

            <div className="grid-item amount">₹{order.amount}</div>

            <div className="grid-item items-count">
              Items: {order.items.reduce((acc, i) => acc + i.quantity, 0)}
            </div>

            <div className="grid-item status">
              <span
                className={`status-dot ${order.status
                  .toLowerCase()
                  .replace(/\s/g, "-")}`}
                title={order.status}
              ></span>
              <b>{order.status}</b>
            </div>

            <button onClick={fetchOrders} className="track-btn">Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
