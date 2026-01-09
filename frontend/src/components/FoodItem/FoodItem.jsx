import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/Storecontext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromcart, url } = useContext(StoreContext);

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img
          className='food-item-image'
          src={url + "/images/" + image}
          alt={name}
          loading="lazy"
        />
        {cartItems[id] ? (
          <div className='food-item-counter'>
            <img
              className='counter-button'
              onClick={() => removeFromcart(id)}
              src={assets.remove_icon_red}
              alt='remove'
            />
            <p>{cartItems[id]}</p>
            <img
              className='counter-button'
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt='add'
            />
          </div>
        ) : (
          <img
            className='add'
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt='add'
          />
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating stars" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
