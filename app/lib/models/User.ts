import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hash olunacaq
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

export default models.User || model("User", UserSchema);