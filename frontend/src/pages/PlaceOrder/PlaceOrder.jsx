import React, { useContext } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/Storecontext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const subtotal = getTotalCartAmount();
  const discount = 0; // no promo here
  const discountAmount = subtotal * discount;
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <form className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>

        <div className='multi-fields'>
          <input type="text" placeholder='First Name'/>
          <input type="text" placeholder='Last Name'/>
        </div>
        <input type="email" placeholder='Email address' />
        <input type="text" placeholder='Street' />

        <div className='multi-fields'>
          <input type="text" placeholder='City'/>
          <input type="text" placeholder='State'/>
        </div>
        <div className='multi-fields'>
          <input type="text" placeholder='Pincode'/>
          <input type="text" placeholder='Country'/>
        </div>
        <input type="text" placeholder='Phone' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            {discountAmount > 0 && (
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
            type="button"
            onClick={() => navigate('/payment')}
            disabled={subtotal === 0}
            className={subtotal === 0 ? 'disabled-button' : ''}
          >
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
