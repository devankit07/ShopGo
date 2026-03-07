import express from "express";
import { IsAuthenticated, isAdmin } from "../middleware/IsAuthenticated.js";
import {
  getDashboardStats,
  getSalesAnalytics,
  getAdminUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getActionLogs,
  getNotifications,
  markNotificationRead,
} from "../controllers/adminController.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getallproduct,
} from "../controllers/productController.js";
import { mulltipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.use(IsAuthenticated, isAdmin);

router.get("/dashboard-stats", getDashboardStats);
router.get("/analytics", getSalesAnalytics);
router.get("/logs", getActionLogs);
router.get("/notifications", getNotifications);
router.put("/notifications/read/:id", markNotificationRead);

router.get("/users", getAdminUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

router.get("/products", getallproduct);
router.post("/products", mulltipleUpload, addProduct);
router.put("/products/:id", (req, res, next) => {
  req.params.productid = req.params.id;
  next();
}, mulltipleUpload, updateProduct);
router.delete("/products/:id", (req, res, next) => {
  req.params.productid = req.params.id;
  next();
}, deleteProduct);

export default router;
