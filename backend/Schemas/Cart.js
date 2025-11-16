import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    products: [
      {
        item: { type: Schema.Types.ObjectId, ref: "Products", required: true },
        price: { type: Number, required: true },
        qty: { type: Number, default: 1 },
        shipping: { type: Number, default: 0 },
      },
    ],
    itemsAdded:{
      type:Number,
      default:0,
      required:true
    } , 
    totalPrice: { type: Number, default: 0 },
    totalShipping: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cart = model("carts", cartSchema);
export default Cart;
