import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets.js';

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + '/api/order/list');
      if (response.data.success) {
        const ordersWithStatus = response.data.orders.map(order => ({
          ...order,
          localStatus: order.status || 'Processing',
        }));
        setOrders(ordersWithStatus);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      toast.error('Error fetching orders');
    }
  };

  const handleStatusChange = async (event, orderId, index) => {
    const newStatus = event.target.value;
    try {
      const res = await axios.post(url + '/api/order/status', {
        orderId,
        status: newStatus,
      });

      if (res.data.success) {
        toast.success("Order status updated");
        setOrders(prev => {
          const updated = [...prev];
          updated[index].localStatus = newStatus;
          return updated;
        });
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      toast.error("Update status failed");
    }
  };

  return (
    <div className="orders">
      <h2>All Orders</h2>
      <div className="order-grid">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <img src={assets.parcel_icon} alt="Parcel" className="parcel-icon" />
              </div>

              <div className="order-card-content">
                <p className="items-line">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} x {item.quantity}{idx < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  <span className="items-count">Items: {order.items.length}</span>
                </p>

                <div className="order-address">
                  <p>{order.address?.firstName} {order.address?.lastName}</p>
                  <p>{order.address?.street}, {order.address?.city}, {order.address?.state}, {order.address?.country} - {order.address?.zipcode}</p>
                  <p>{order.address?.phone}</p>
                </div>
              </div>

              <div className="order-count">{order.items.length}</div>
              <div className="order-amount">₹{order.amount}</div>

              <div className="order-status">
                <select
                  className="status-dropdown"
                  value={order.localStatus}
                  onChange={(e) => handleStatusChange(e, order._id, index)}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;
