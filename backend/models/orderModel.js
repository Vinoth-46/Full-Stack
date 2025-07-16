import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  items: {
    type: [
      {
        _id: { type: String, required: true }, // Optional: store productId as string
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 }
      }
    ],
    required: true,
    default: []
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  address: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String }
  },
  status: {
    type: String,
    enum: ["Food Processing", "On the Way", "Delivered", "Cancelled"],
    default: "Food Processing"
  },
  date: {
    type: Date,
    default: () => new Date()
  },
  payment: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
