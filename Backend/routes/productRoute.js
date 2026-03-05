import express from "express";
import { addProduct, deleteProduct, getallproduct, updateProduct } from "../controllers/productController.js";
import { IsAuthenticated, isAdmin } from "../middleware/IsAuthenticated.js";
import { mulltipleUpload } from "../middleware/multer.js";

const router = express.Router();

// GET /api/products or /api/v1/product/getallproducts
router.get("/", getallproduct);
router.get("/getallproducts", getallproduct);

// POST /api/products — admin only, image upload to Cloudinary
router.post("/", IsAuthenticated, isAdmin, mulltipleUpload, addProduct);
router.post("/add", IsAuthenticated, isAdmin, mulltipleUpload, addProduct);
router.delete("/delete/:productid", IsAuthenticated, isAdmin, deleteProduct);
router.put("/update/:productid", IsAuthenticated, isAdmin, mulltipleUpload, updateProduct);

export default router;
