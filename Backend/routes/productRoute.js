import express from "express";
import { addProduct, deleteProduct, getallproduct, getProductById, updateProduct } from "../controllers/productController.js";
import { IsAuthenticated, isAdmin } from "../middleware/IsAuthenticated.js";
import { mulltipleUpload } from "../middleware/multer.js";

const router = express.Router();

// GET /api/products or /api/v1/product/getallproducts — supports ?page=1&limit=8&category=Electronics
router.get("/", getallproduct);
router.get("/getallproducts", getallproduct);
// GET /api/products/:productId — single product (must be after /getallproducts)
router.get("/:productId", getProductById);

// POST /api/products — admin only, image upload to Cloudinary
router.post("/", IsAuthenticated, isAdmin, mulltipleUpload, addProduct);
router.post("/add", IsAuthenticated, isAdmin, mulltipleUpload, addProduct);
router.delete("/delete/:productid", IsAuthenticated, isAdmin, deleteProduct);
router.put("/update/:productid", IsAuthenticated, isAdmin, mulltipleUpload, updateProduct);

export default router;
