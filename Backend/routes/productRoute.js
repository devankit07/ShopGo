import express from "express";
import { addProduct, deleteProduct, getallproduct, updateProduct } from "../controllers/productController.js";
import { IsAuthenticated, isAdmin } from "../middleware/IsAuthenticated.js";
import { mulltipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/add", IsAuthenticated, isAdmin, mulltipleUpload, addProduct);
router.get("/getallproducts", getallproduct);
router.delete("/delete/:productid", IsAuthenticated, isAdmin, deleteProduct);
router.put("/update/:productid", IsAuthenticated, isAdmin, mulltipleUpload, updateProduct);

export default router;
