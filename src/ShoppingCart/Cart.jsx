/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useEffect } from "react";

export const CartContext = createContext();

export default function Cart({ children }) {
  // Lấy dữ liệu giỏ hàng từ localStorage (nếu có), nếu không có thì để mảng rỗng []
  const [state, dispatch] = useReducer(updateCamera, {
    items: JSON.parse(localStorage.getItem("cartItems")) || [],
  });

  // Mỗi khi state.items thay đổi (thêm, sửa, xóa), tự động lưu lại vào localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.items));
  }, [state.items]);

  function updateCamera(currentState, action) {
    switch (action.type) {
      case "ADD": {
        const itemPrice = Number(action.payload.price) || 0;
        const existing = currentState.items.find(
          (item) => item.id === action.payload.id,
        );
        let newItems;
        if (existing) {
          newItems = currentState.items.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  totalprice: itemPrice * (item.quantity + 1),
                }
              : item,
          );
        } else {
          newItems = [
            ...currentState.items,
            {
              ...action.payload,
              price: itemPrice,
              quantity: 1,
              totalprice: itemPrice,
            },
          ];
        }
        return {
          ...currentState,
          items: newItems,
        };
      }
      case "DELETE": {
        const deleteItems = currentState.items
          .map((item) => {
            if (item.id === action.payload.id) {
              const newQty = item.quantity - 1;
              return {
                ...item,
                quantity: newQty,
                totalprice: Number(item.price) * newQty,
              };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);

        return {
          ...currentState,
          items: deleteItems,
        };
      }
      case "CLEAR": {
        return {
          ...currentState,
          items: [],
        };
      }
      default:
        return currentState;
    }
  }

  return (
    <CartContext.Provider value={{ dispatch, state }}>
      {children}
    </CartContext.Provider>
  );
}
