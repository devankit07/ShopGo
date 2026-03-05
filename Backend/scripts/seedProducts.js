import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/productModel.js";

const MONGO_URI = process.env.MONGO_URI;
const PLACEHOLDER = "https://placehold.co/400x300?text=Product";

const demoProducts = [
  // Electric
  { productName: "Electric Scooter", productDesc: "Eco-friendly electric scooter for city commute.", productPrice: 299, category: "Electric", brand: "ShopGo", productImage: [{ url: PLACEHOLDER, public_id: "seed_electric_scooter" }] },
  { productName: "Electric Bike", productDesc: "Premium electric bicycle with long battery life.", productPrice: 899, category: "Electric", brand: "ShopGo", productImage: [{ url: PLACEHOLDER, public_id: "seed_electric_bike" }] },
  { productName: "Electric Car", productDesc: "Compact electric car for urban driving.", productPrice: 24999, category: "Electric", brand: "ShopGo", productImage: [{ url: PLACEHOLDER, public_id: "seed_electric_car" }] },
  // Jewellery
  { productName: "Gold Necklace", productDesc: "Elegant 18K gold necklace.", productPrice: 499, category: "Jewellery", brand: "ShopGo", productImage: [{ url: PLACEHOLDER, public_id: "seed_gold_necklace" }] },
  { productName: "Diamond Ring", productDesc: "Classic diamond solitaire ring.", productPrice: 1299, category: "Jewellery", brand: "ShopGo", productImage: [{ url: PLACEHOLDER, public_id: "seed_diamond_ring" }] },
  { productName: "Silver Bracelet", productDesc: "Sterling silver link bracelet.", productPrice: 89, category: "Jewellery", brand: "ShopGo", productImage: [{ url: PLACEHOLDER, public_id: "seed_silver_bracelet" }] },
  // Electronics
  { productName: "Smart Watch", productDesc: "Feature-rich smartwatch with health tracking.", productPrice: 199, category: "Electronics", brand: "ShopGo", productImage: [{ url: PLACEHOLDER, public_id: "seed_smart_watch" }] },
  { productName: "Wireless Earbuds", productDesc: "Noise-cancelling wireless earbuds.", productPrice: 79, category: "Electronics", brand: "ShopGo", productImage: [{ url: PLACEHOLDER, public_id: "seed_wireless_earbuds" }] },
  // Accessories
  { productName: "Leather Wallet", productDesc: "Handcrafted leather bifold wallet.", productPrice: 45, category: "Accessories", brand: "ShopGo", productImage: [{ url: PLACEHOLDER, public_id: "seed_leather_wallet" }] },
  { productName: "Sunglasses", productDesc: "UV protection polarized sunglasses.", productPrice: 59, category: "Accessories", brand: "ShopGo", productImage: [{ url: PLACEHOLDER, public_id: "seed_sunglasses" }] },
];

async function seed() {
  try {
    await mongoose.connect(`${MONGO_URI}/Shop-Go`);
    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log("Products already exist. Skipping seed.");
      process.exit(0);
      return;
    }
    await Product.insertMany(demoProducts);
    console.log("Demo products seeded successfully.");
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
