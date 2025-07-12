import userModel from "../models/userModel.js";

// 🛒 Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    let user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const currentQuantity = user.cartData.get(itemId) || 0;
    user.cartData.set(itemId, currentQuantity + 1);

    await user.save();
    res.json({ success: true, message: "Item added to cart." });

  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ❌ Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    let user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const currentQuantity = user.cartData.get(itemId) || 0;
    if (currentQuantity > 1) {
      user.cartData.set(itemId, currentQuantity - 1);
    } else {
      user.cartData.delete(itemId);
    }

    await user.save();
    res.json({ success: true, message: "Item removed from cart." });

  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📦 Get all items in cart
const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    let user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ success: true, cartData: user.cartData });

  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { addToCart, removeFromCart, getCart };
