import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // { productId, name, price, image, quantity }
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, price, image, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, name, price, image, quantity });
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter((i) => i.productId !== action.payload);
        } else {
          item.quantity -= 1;
        }
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    setQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        if (quantity < 1) {
          state.items = state.items.filter((i) => i.productId !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  setQuantity,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart?.items ?? [];
export const selectCartCount = (state) =>
  (state.cart?.items ?? []).reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;
