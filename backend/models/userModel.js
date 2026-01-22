import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, default: "user", enum: ["user", "admin"] },
  cartData: {
    type: Map,
    of: Number,
    default: {},
  }
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
