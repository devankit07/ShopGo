import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import product from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoute.js";
import adminRoute from "./routes/adminRoute.js";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());

app.use(cors());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", product);
app.use("/api/products", product); // GET /api/products, POST /api/products/add
app.use("/api/v1/orders", orderRoute);
app.use("/api/admin", adminRoute);

// http://localhost:8000/api/v1/user/register

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening at port ${PORT}`);
});
