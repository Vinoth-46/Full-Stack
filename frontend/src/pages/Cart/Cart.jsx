import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/Storecontext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromcart, getTotalCartAmount, url } = useContext(StoreContext);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const navigate = useNavigate();

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + deliveryFee;

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'SAVE10') {
      setDiscount(0.10);
      setPromoApplied(true);
      alert('Promo code applied! 10% discount added.');
    } else {
      setDiscount(0);
      setPromoApplied(false);
      alert("Invalid promo code. Try 'SAVE10'.");
    }
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-item-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />

        {Object.keys(cartItems).length === 0 || subtotal === 0 ? (
          <p style={{ padding: '20px', color: '#888' }}>Your cart is empty.</p>
        ) : (
          food_list.map((item) => {
            const quantity = cartItems[item._id];
            if (!quantity) return null;

            return (
              <div key={item._id} className='cart-items-item'>
                <img
                  src={`${url}/images/${item.image}`}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/fallback.png'; // optional fallback image
                  }}
                />
                <p>{item.name}</p>
                <p>₹{item.price}</p>
                <p>{quantity}</p>
                <p>₹{(item.price * quantity).toFixed(2)}</p>
                <p onClick={() => removeFromcart(item._id)} className="cross">x</p>
              </div>
            );
          })
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            {discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details">
                  <p>Discount</p>
                  <p>-₹{discountAmount.toFixed(2)}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{total.toFixed(2)}</b>
            </div>
          </div>
          <button
            onClick={() => navigate('/order')}
            disabled={subtotal === 0}
            className={subtotal === 0 ? 'disabled-button' : ''}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <form onSubmit={handlePromoSubmit} className='cart-promocode-input'>
              <input
                type="text"
                placeholder='Promo code'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
              />
              <button type="submit" disabled={promoApplied}>
                {promoApplied ? 'Applied' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
