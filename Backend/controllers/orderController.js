import { Order } from "../models/orderModel.js";
import { Notification } from "../models/Notification.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { products, totalAmount, shippingAddress, paymentMethod } = req.body;
    if (!products?.length || totalAmount == null) {
      return res.status(400).json({
        success: false,
        message: "Products and totalAmount are required",
      });
    }
    const orderProducts = products.map((p) => ({
      productId: p.productId,
      productName: p.productName || "Product",
      productImage: p.productImage || "",
      quantity: p.quantity || 1,
      price: p.price || 0,
      cost: p.cost ?? 0,
    }));
    const order = await Order.create({
      userId,
      products: orderProducts,
      totalAmount: Number(totalAmount),
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || "Card",
    });
    await Notification.create({
      message: `New order placed for ₹${Number(totalAmount)}`,
      type: "order",
      isRead: false,
    });
    const populated = await Order.findById(order._id).populate("userId", "firstName lastName email");
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.id.toString();

    if (loggedInUserId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only fetch your own orders",
      });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const loggedInUserId = req.id.toString();

    const order = await Order.findById(orderId).populate("userId", "firstName lastName email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const orderUserId = order.userId._id ? order.userId._id.toString() : order.userId.toString();
    if (orderUserId !== loggedInUserId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
