import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Initialize Stripe only if key is provided
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

if (!stripe) {
  console.warn('⚠️ STRIPE_SECRET_KEY not set - Payment features disabled');
}

const frontend_url = process.env.FRONTEND_URL || "https://full-stack-yldm.onrender.com";

// ========== Place Order ==========
const placeOrder = async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: "Payment service is not configured. Please contact admin."
      });
    }

    const userId = req.userId;
    const { items, address } = req.body;

    if (!items?.length || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Calculate total amount server-side
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
        const foodItem = await foodModel.findById(item._id);
        if (foodItem) {
            totalAmount += foodItem.price * item.quantity;
            orderItems.push({
                name: foodItem.name,
                price: foodItem.price,
                quantity: item.quantity,
                _id: foodItem._id // keep the id
            });
        }
    }

    // Add delivery charge
    const deliveryCharge = 2;
    const finalAmount = totalAmount + deliveryCharge;

    const newOrder = new orderModel({ userId, items: items, amount: finalAmount, address });
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = orderItems.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200,
      },
      quantity: 1,
    });

    // Inside placeOrder controller
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString(),
      },
    });


    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ success: false, message: "Something went wrong", error });
  }
};

// ========== Verify Order ==========
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true" || success === true) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: "Order payment confirmed." });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment failed. Order removed." });
    }
  } catch (error) {
    console.error("❌ Order verification error:", error);
    res.status(500).json({ success: false, message: "Order verification error", error });
  }
};

// ========== Get User Orders ==========
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders", error });
  }
};

// ========== List All Orders (Admin) ==========
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error listing orders:", error);
    res.status(500).json({ success: false, message: "Failed to list orders", error });
  }
};

// ========== Update Status ==========
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("❌ Status update error:", error);
    res.json({ success: false, message: "Error updating status" });
  }
};

// ========== Place COD Order ==========
const placeCodOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;

    if (!items?.length || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Calculate total amount server-side
    let totalAmount = 0;
    for (const item of items) {
        const foodItem = await foodModel.findById(item._id);
        if (foodItem) {
            totalAmount += foodItem.price * item.quantity;
        }
    }
    const deliveryCharge = 2;
    const finalAmount = totalAmount + deliveryCharge;

    const newOrder = new orderModel({
      userId,
      items,
      amount: finalAmount,
      address,
      payment: false,
      status: "Food Processing",
      paymentMethod: "COD"
    });
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(200).json({
      success: true,
      message: "Order placed successfully! Pay on delivery.",
      orderId: newOrder._id
    });
  } catch (error) {
    console.error("❌ Error placing COD order:", error);
    res.status(500).json({ success: false, message: "Something went wrong", error });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, placeCodOrder };
