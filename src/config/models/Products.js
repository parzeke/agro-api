import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  weight: Number,
  weightUnit: {
    type: String,
    enum: ['gr', 'kg'],
    default: 'kg'
  },
  stock: {
    type: Number,
    default: 1
  }
}, { timestamps: true });


export default mongoose.model("Product", productSchema);