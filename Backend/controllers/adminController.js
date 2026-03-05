import { User } from "../models/userModel.js";
import { Order } from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { AdminActionLog } from "../models/adminActionLogModel.js";
import { logAction } from "../utils/adminLog.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [userCount, productCount, orderCount, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find(),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalCost = orders.reduce((sum, o) => {
      const orderCost = (o.products || []).reduce(
        (s, p) => s + (p.cost !== undefined ? p.cost * (p.quantity || 1) : 0),
        0
      );
      return sum + orderCost;
    }, 0);
    const totalProfit = totalRevenue - totalCost;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRevenue,
        totalSales: orderCount,
        totalProfit,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalesAnalytics = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: 1 });
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: d.toLocaleString("default", { month: "short" }),
        year: d.getFullYear(),
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      });
    }

    const monthlySales = months.map((m) => {
      const total = orders
        .filter((o) => {
          const created = new Date(o.createdAt);
          const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
          return key === m.key;
        })
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      return { ...m, sales: total };
    });

    const monthlyOrders = months.map((m) => {
      const count = orders.filter((o) => {
        const created = new Date(o.createdAt);
        const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
        return key === m.key;
      }).length;
      return { ...m, orders: count };
    });

    let totalRevenue = 0;
    let totalCost = 0;
    orders.forEach((o) => {
      totalRevenue += o.totalAmount || 0;
      (o.products || []).forEach((p) => {
        totalCost += (p.cost !== undefined ? p.cost : 0) * (p.quantity || 1);
      });
    });
    const totalProfit = totalRevenue - totalCost;
    const totalLoss = totalProfit < 0 ? Math.abs(totalProfit) : 0;

    const profitLossByMonth = months.map((m) => {
      let rev = 0;
      let cost = 0;
      orders
        .filter((o) => {
          const created = new Date(o.createdAt);
          const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
          return key === m.key;
        })
        .forEach((o) => {
          rev += o.totalAmount || 0;
          (o.products || []).forEach((p) => {
            cost += (p.cost !== undefined ? p.cost : 0) * (p.quantity || 1);
          });
        });
      return { ...m, profit: rev - cost, revenue: rev, cost };
    });

    return res.status(200).json({
      success: true,
      monthlySales,
      monthlyOrders,
      profitLossByMonth,
      summary: { totalRevenue, totalProfit, totalLoss },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpiry -token")
      .lean();
    const orderCounts = await Order.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);
    const countMap = {};
    orderCounts.forEach((o) => (countMap[o._id.toString()] = o.count));

    const usersWithOrders = users.map((u) => ({
      ...u,
      ordersCount: countMap[u._id.toString()] || 0,
    }));

    return res.status(200).json({
      success: true,
      users: usersWithOrders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const previousRole = user.role;
    user.role = role;
    await user.save();

    await logAction(
      req.id,
      previousRole === "admin" ? "User removed from admin" : "User promoted to admin",
      `User ${user.email} role: ${previousRole} → ${role}`,
      "user",
      id
    );

    const response = user.toObject();
    delete response.password;
    return res.status(200).json({
      success: true,
      message: `Role updated to ${role}`,
      user: response,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.id.toString() === id) {
      return res.status(400).json({ success: false, message: "Cannot delete yourself" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await User.findByIdAndDelete(id);
    await logAction(req.id, "User deleted", `User ${user.email} deleted`, "user", id);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    ).populate("userId", "firstName lastName email");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    await logAction(
      req.id,
      "Order status updated",
      `Order ${orderId} → ${orderStatus}`,
      "order",
      orderId
    );
    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getActionLogs = async (req, res) => {
  try {
    const logs = await AdminActionLog.find()
      .populate("adminId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
