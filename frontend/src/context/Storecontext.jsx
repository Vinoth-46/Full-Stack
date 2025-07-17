import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "https://food-del-backend-syvp.onrender.com";

  const [food_list, setFoodlist] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // 🛒 Add to cart (with backend sync)
  const addToCart = async (itemId) => {
    const updated = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(updated);

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Error adding to cart:", err);
      }
    }
  };

  // ❌ Remove from cart (with backend sync)
  const removeFromcart = async (itemId) => {
    const updated = { ...cartItems };

    if (updated[itemId] === 1) {
      delete updated[itemId];
    } else {
      updated[itemId] -= 1;
    }

    setCartItems(updated);

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Error removing from cart:", err);
      }
    }
  };

  // 💰 Calculate total cart amount
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

  // 📦 Fetch available food items
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodlist(response.data.data || []);
    } catch (err) {
      console.error("Error fetching food list:", err);
    }
  };

  // 🔄 Sync cart from backend on login
  const fetchCartData = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${url}/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.cartData) {
        const data = {};
        for (const [key, value] of Object.entries(res.data.cartData)) {
          data[key] = value;
        }
        setCartItems(data);
      }
    } catch (err) {
      console.error("Error fetching cart data:", err);
    }
  };

  useEffect(() => {
    fetchFoodList();
    fetchCartData(); // 👈 fetch user cart on app load
  }, [token]);

  // 🌐 Global context values
  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromcart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
