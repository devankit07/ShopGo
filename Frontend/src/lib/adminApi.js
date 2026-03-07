import axios from "axios";

const API_BASE = "/api/admin";

function getAuthHeaders() {
  const token = localStorage.getItem("accesstoken");
  return { Authorization: token ? `Bearer ${token}` : "" };
}

export const adminApi = {
  getDashboardStats: () =>
    axios.get(`${API_BASE}/dashboard-stats`, { headers: getAuthHeaders() }),

  getAnalytics: () =>
    axios.get(`${API_BASE}/analytics`, { headers: getAuthHeaders() }),

  getLogs: () =>
    axios.get(`${API_BASE}/logs`, { headers: getAuthHeaders() }),

  getNotifications: () =>
    axios.get(`${API_BASE}/notifications`, { headers: getAuthHeaders() }),

  markNotificationRead: (id) =>
    axios.put(`${API_BASE}/notifications/read/${id}`, {}, { headers: getAuthHeaders() }),

  getUsers: () =>
    axios.get(`${API_BASE}/users`, { headers: getAuthHeaders() }),

  updateUserRole: (id, role) =>
    axios.patch(`${API_BASE}/users/${id}/role`, { role }, { headers: getAuthHeaders() }),

  deleteUser: (id) =>
    axios.delete(`${API_BASE}/users/${id}`, { headers: getAuthHeaders() }),

  getOrders: () =>
    axios.get(`${API_BASE}/orders`, { headers: getAuthHeaders() }),

  updateOrderStatus: (orderId, orderStatus) =>
    axios.patch(`${API_BASE}/orders/${orderId}/status`, { orderStatus }, { headers: getAuthHeaders() }),

  getProducts: (params = {}) =>
    axios.get(`${API_BASE}/products`, { headers: getAuthHeaders(), params }),

  addProduct: (formData) =>
    axios.post(`${API_BASE}/products`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    }),

  updateProduct: (id, formData) =>
    axios.put(`${API_BASE}/products/${id}`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    }),

  deleteProduct: (id) =>
    axios.delete(`${API_BASE}/products/${id}`, { headers: getAuthHeaders() }),
};
