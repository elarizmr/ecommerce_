import mongoose, { Schema, models, model } from "mongoose";

// Səbətdəki bir sətir: məhsul + ölçü + rəng + miqdar
const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  size: { type: String, default: "" },
  color: { type: String, default: "" },
  quantity: { type: Number, default: 1, min: 1 },
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hash olunacaq
  role: { type: String, enum: ["user", "admin"], default: "user" },
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }], // bəyəndiklərim
  cart: [CartItemSchema], // YENİ: səbət
}, { timestamps: true });

export default models.User || model("User", UserSchema);