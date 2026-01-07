import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = import.meta.env.VITE_API_URL || "";

  const [food_list, setFoodlist] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showLogin, setShowLogin] = useState(false);

  // 🛒 Add to cart (with backend sync)
  const addToCart = async (itemId) => {
    // Check if user is logged in
    if (!token) {
      toast.info("Please login to add items to cart", {
        onClick: () => setShowLogin(true),
        style: { cursor: "pointer" }
      });
      return false;
    }

    const updated = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(updated);

    try {
      await axios.post(`${url}/api/cart/add`, { itemId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
    }
    return true;
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
    fetchCartData();
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
    showLogin,
    setShowLogin,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
