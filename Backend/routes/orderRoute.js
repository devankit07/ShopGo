import express from "express";
import { createOrder, getOrdersByUser, getOrderById } from "../controllers/orderController.js";
import { IsAuthenticated } from "../middleware/IsAuthenticated.js";

const router = express.Router();

router.post("/", IsAuthenticated, createOrder);
router.get("/user/:userId", IsAuthenticated, getOrdersByUser);
router.get("/:orderId", IsAuthenticated, getOrderById);

export default router;
