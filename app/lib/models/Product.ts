import mongoose, { Schema, models, model } from "mongoose";

const ColorVariantSchema = new Schema(
  {
    name: { type: String, required: true }, // məs: "Chocolate Plum"
    images: [{ type: String }], // bu rəngə aid şəkil URL-ləri
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String, // əsas/kart şəkli (siyahıda görünən)
    stock: { type: Number, default: 0 },

    sizes: [{ type: String }], // məs: ["XS","S","M","L","XL"]
    colors: [ColorVariantSchema],

    information: String, // "INFORMATION" bölməsi
    modelInfo: String, // "Model info"
    materialInfo: String, // "Material info"
    shippingReturns: String, // "Shipping & Returns"

    points: { type: Number, default: 0 }, // "Earn X points"
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);