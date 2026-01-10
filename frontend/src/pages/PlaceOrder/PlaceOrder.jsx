import React, { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/Storecontext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  // Redirect if not logged in or cart is empty
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
    if (subtotal === 0) return toast.error("Cart is empty!");

    if (Object.values(formData).some(value => value.trim() === '')) {
      return toast.error("Please fill in all fields.");
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
      address: formData,
      paymentMethod: paymentMethod
    };

    setLoading(true);
    try {
      if (paymentMethod === 'cod') {
        // Cash on Delivery - direct order placement
        const res = await axios.post(`${url}/api/order/place-cod`, orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          toast.success("Order placed successfully! Pay on delivery.");
          navigate('/myorders');
        } else {
          toast.error(res.data.message || "Order failed. Try again.");
        }
      } else {
        // Online Payment - Stripe
        const res = await axios.post(`${url}/api/order/place`, orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.url) {
          window.location.href = res.data.url;
        } else {
          toast.error("Unexpected response from server. Try again.");
        }
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      toast.error("Order placement failed. Please check your details and try again.");
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

          {/* Payment Method Selection */}
          <div className="payment-methods">
            <p className="payment-title">Payment Method</p>

            <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="payment-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                </svg>
              </div>
              <div className="payment-details">
                <span className="payment-name">Pay Online</span>
                <span className="payment-desc">Credit/Debit Card</span>
              </div>
            </label>

            <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="payment-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                </svg>
              </div>
              <div className="payment-details">
                <span className="payment-name">Cash on Delivery</span>
                <span className="payment-desc">Pay when food arrives</span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={subtotal === 0 || loading}
            className={subtotal === 0 || loading ? 'disabled-button' : ''}
          >
            {loading ? "Processing..." : paymentMethod === 'cod' ? "PLACE ORDER" : "PROCEED TO PAYMENT"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
