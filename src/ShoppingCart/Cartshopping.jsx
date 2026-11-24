import { useContext } from "react";
import { Link } from "react-router-dom";
import Herobanner from "../Components/Herobanner";
import { CartContext } from "./Cart";
import "./Cartshopping.css";
import Form from "../Form/Form";

export default function Cartshopping() {
  const { state, dispatch } = useContext(CartContext);
  const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + Number(item.totalprice),
    0,
  );

  return (
    <>
      <Herobanner />

      <div className="cart-container">
        <h2 className="cart-title">Shopping Cart</h2>

        {state.items.length === 0 ? (
          <div className="empty-cart">
            <h4 style={{ color: "#64748b", marginBottom: "15px" }}>
              Giỏ hàng của bạn đang trống!
            </h4>
            <p className="text-muted mb-4">
              Hãy dạo qua cửa hàng và chọn cho mình chiếc máy ảnh ưng ý nhé.
            </p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                backgroundColor: "#0f172a",
                color: "white",
                padding: "10px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-layout">
              {/* CART TABLE */}
              <div className="cart-table-wrapper">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {state.items.map((s) => (
                      <tr key={s.id}>
                        <td className="product-info">
                          <img src={s.image} alt={s.name} />
                          <span>{s.name}</span>
                        </td>

                        <td>{Number(s.price).toLocaleString("vi-VN")} VND</td>

                        <td>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => {
                              dispatch({
                                type: "DELETE",
                                payload: { id: s.id },
                              });
                            }}
                          >
                            -
                          </button>
                          <span className="qty-number">{s.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() =>
                              dispatch({
                                type: "ADD",
                                payload: s,
                              })
                            }
                          >
                            +
                          </button>
                        </td>

                        <td style={{ fontWeight: 600, color: "#e11d48" }}>
                          {Number(s.totalprice).toLocaleString("vi-VN")} VND
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CART SUMMARY */}
              <div className="cart-summary">
                <h4>Order Summary</h4>
                <div className="summary-row">
                  <span>Total Items</span>
                  <span>{totalQuantity} chiếc</span>
                </div>
                <div className="summary-row total">
                  <span>Total Payment</span>
                  <span style={{ color: "#e11d48" }}>
                    {totalPrice.toLocaleString("vi-VN")} VND
                  </span>
                </div>
              </div>
            </div>

            {/* CHECKOUT FORM */}
            <Form />
          </>
        )}
      </div>
    </>
  );
}
