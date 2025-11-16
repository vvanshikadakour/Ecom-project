import { Schema, model } from "mongoose";

const productSchema = new Schema({
  productName: { type: String, required: true },
  productCategory: { type: String, required: true, enum: ["Men", "Women", "Kids"], default: "Men" },
  productPrice: { type: Number, required: true },
  description: { type: String },
  productImage: { type: [String], required: true },
  productCount: { type: Number, required: true }
}, { timestamps: true });


const Product = model("Products", productSchema);

export default Product;
