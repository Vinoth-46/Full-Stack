import React, { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/Storecontext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const [loading, setLoading] = useState(false);

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  // 🔁 Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!token || subtotal === 0) {
      navigate('/cart');
    }
  }, [token, subtotal, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subtotal === 0) return alert("Cart is empty!");

    if (Object.values(formData).some(value => value.trim() === '')) {
      return alert("Please fill in all fields.");
    }

    const items = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id]
      }));

    const orderData = {
      userId: localStorage.getItem("userId"),
      items,
      amount: total,
      address: formData
    };

    setLoading(true);
    try {
      const res = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("Unexpected response from server. Try again.");
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Order placement failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className='multi-fields'>
          <input required type="text" placeholder='First Name' name="firstName" value={formData.firstName} onChange={handleChange} />
          <input required type="text" placeholder='Last Name' name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <input required type="email" placeholder='Email address' name="email" value={formData.email} onChange={handleChange} />
        <input required type="text" placeholder='Street' name="street" value={formData.street} onChange={handleChange} />
        <div className='multi-fields'>
          <input required type="text" placeholder='City' name="city" value={formData.city} onChange={handleChange} />
          <input required type="text" placeholder='State' name="state" value={formData.state} onChange={handleChange} />
        </div>
        <div className='multi-fields'>
          <input required type="text" placeholder='Pincode' name="zipcode" value={formData.zipcode} onChange={handleChange} />
          <input required type="text" placeholder='Country' name="country" value={formData.country} onChange={handleChange} />
        </div>
        <input
          required
          type="tel"
          placeholder='Phone'
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          pattern="[0-9]{10}"
          title="Enter a valid 10-digit phone number"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details"><p>Subtotal</p><p>₹{subtotal.toFixed(2)}</p></div>
          <hr />
          <div className="cart-total-details"><p>Delivery Fee</p><p>₹{deliveryFee.toFixed(2)}</p></div>
          <hr />
          <div className="cart-total-details"><b>Total</b><b>₹{total.toFixed(2)}</b></div>
          <button
            type="submit"
            disabled={subtotal === 0 || loading}
            className={subtotal === 0 || loading ? 'disabled-button' : ''}
          >
            {loading ? "Processing..." : "PROCEED TO PAYMENT"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
