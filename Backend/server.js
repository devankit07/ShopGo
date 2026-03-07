import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import product from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoute.js";
import adminRoute from "./routes/adminRoute.js";
import feedbackRoute from "./routes/feedbackRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const PORT = process.env.PORT || 3000;
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

// Serve React app for non-API routes (supports refresh/deep links on Render)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening at port ${PORT}`);
});
