import { Schema, model } from "mongoose";

const addressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

const Address = model("Address", addressSchema);

export default Address;

//fast2sms 