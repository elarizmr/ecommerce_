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
    section: { type: String, enum: ["men", "women", "accessories"], required: true }, // YENİ
    subcategory: { type: String, required: true }, // YENİ, məs: "jackets"
    description: String,
    image: [{ type: String }], // Artıq tək string yox, şəkillər massividir (maks 6 ədəd)
   stock: { type: Number, default: 0 }, 

    sizes: [{ type: String }], // məs: ["XS","S","M","L","XL"]
    colors: [ColorVariantSchema],

    information: String, // "INFORMATION" bölməsi
    modelInfo: String, // "Model info"
    materialInfo: String, // "Material info"
    shippingReturns: String, // "Shipping & Returns"

    points: { type: Number, default: 0 }, // "Earn X points"
    lastChance: { type: Boolean, default: false }, // Last Chance bölməsi üçün
  },
  { timestamps: true }
);


export default models.Product || model("Product", ProductSchema);