import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/Storecontext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {
  const { food_list, searchQuery, setSearchQuery } = useContext(StoreContext);

  const filteredFoods = food_list.filter((item) => {
    const matchesCategory = category === 'All' || category === item.category;
    const query = searchQuery ? searchQuery.trim().toLowerCase() : '';
    const matchesSearch = !query ||
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className='food-display' id='food-display'>
      <div className="food-display-header">
        <h2>{searchQuery ? `Search Results for "${searchQuery}"` : 'Top dishes near you'}</h2>
        {searchQuery && (
          <button className="clear-search-tag" onClick={() => setSearchQuery('')}>
            Clear search ✕
          </button>
        )}
      </div>

      {filteredFoods.length > 0 ? (
        <div className="food-display-list">
          {filteredFoods.map((item, index) => (
            <FoodItem
              key={item._id || index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <div className="no-food-found">
          <p>No dishes found matching <span>"{searchQuery}"</span></p>
          <button onClick={() => setSearchQuery('')}>View All Dishes</button>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay
