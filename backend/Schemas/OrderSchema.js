import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
    toBeDeliveredBy: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Orders", OrderSchema);
export default Order;
