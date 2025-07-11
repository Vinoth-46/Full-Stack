import { createContext, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000"

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));
  };

  const removeFromcart = (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;

      const updatedCart = { ...prev };

      if (prev[itemId] === 1) {
        delete updatedCart[itemId];
      } else {
        updatedCart[itemId] = prev[itemId] - 1;
      }

      return updatedCart;
    });
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = food_list.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromcart,
    getTotalCartAmount,
    url,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
