import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import product from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoute.js";
import adminRoute from "./routes/adminRoute.js";
import feedbackRoute from "./routes/feedbackRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import { createRazorpayOrder } from "./controllers/paymentController.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
dotenv.config({ path: ".env.local" });
dotenv.config();
const PORT = process.env.PORT || 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use(express.json());

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", product);
app.use("/api/products", product); // GET /api/products, POST /api/products/add
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/feedback", feedbackRoute);
app.use("/api/admin", adminRoute);
app.use("/api/payment", paymentRoute);
app.post("/api/create-order", createRazorpayOrder); // backward-compatible endpoint

// Serve React app for non-API routes (supports refresh/deep links on Render)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening at port ${PORT}`);
});
