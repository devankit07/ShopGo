//product model and schema

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productName: {
    type: String,
    required: true,
  },
  productDesc: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
  },
  category: {
    type: String,
  },
  brand:{
    type: String,
  },
    productImage: [{
        url:{ type: String, required: true},
        public_id:{ type: String, required: true}
    }]
},{timestamps: true});


const Product = mongoose.model("Product", productSchema);



export default Product;