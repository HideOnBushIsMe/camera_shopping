import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Productcard.css";
// Import các Context (kho dữ liệu dùng chung)
import { CameraContext } from "../CameraApi";
import { CartContext } from "../ShoppingCart/Cart";
import { AuthContext } from "../AuthContext";
// Import thư viện giao diện React Bootstrap
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
// Import các Icon
import { FiShoppingCart, FiChevronRight } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Hàm tính toán thống kê đánh giá thực tế
const getRatingStats = (ratings) => {
  if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
    return {
      average: 0,
      count: 0,
      formattedAvg: "0",
    };
  }
  const sum = ratings.reduce((acc, curr) => acc + Number(curr), 0);
  const avg = Number((sum / ratings.length).toFixed(1));
  return {
    average: avg,
    count: ratings.length,
    formattedAvg: avg.toString().replace(".", ","),
  };
};

// Hàm render 5 ngôi sao (đầy, nửa sao, rỗng)
const renderStars = (average) => {
  const stars = [];
  const fullStars = Math.floor(average);
  const remainder = average - fullStars;
  const hasHalfStar = remainder >= 0.25 && remainder <= 0.75;
  const isCeilFull = remainder > 0.75;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars || (i === fullStars + 1 && isCeilFull)) {
      stars.push(<FaStar key={i} color="#f59e0b" size={14} />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} color="#f59e0b" size={14} />);
    } else {
      stars.push(<FaRegStar key={i} color="#cbd5e1" size={14} />);
    }
  }
  return stars;
};

export default function Productcard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cameras, handleRateCamera } = useContext(CameraContext);
  const { dispatch } = useContext(CartContext);
  const { role } = useContext(AuthContext);

  // Quản lý popup chi tiết sản phẩm
  const [detailcamera, setDetailcamera] = useState(null);
  const [showpopup, setShowpopup] = useState(false);

  // State cho phần gửi đánh giá trong popup
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState("");
  const [adminWarning, setAdminWarning] = useState("");

  // State popup nhỏ nhắc đăng nhập khi bấm đánh giá mà chưa đăng nhập
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleOpenDetail = (cameraItem) => {
    setDetailcamera(cameraItem);
    setShowpopup(true);
    setSelectedRating(0);
    setHoverRating(0);
    setRatingMessage("");
    setAdminWarning("");
  };

  const handleCloseDetail = () => {
    setShowpopup(false);
    setDetailcamera(null);
    setSelectedRating(0);
    setRatingMessage("");
    setAdminWarning("");
    setShowLoginPrompt(false);
  };

  // Tự động mở lại popup chi tiết khi vừa đăng nhập xong quay lại trang
  useEffect(() => {
    const returnId =
      location.state?.returnToDetailId ||
      sessionStorage.getItem("returnToDetailId");

    if (returnId && cameras.length > 0) {
      const target = cameras.find((c) => String(c.id) === String(returnId));
      if (target) {
        handleOpenDetail(target);
        sessionStorage.removeItem("returnToDetailId");
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, cameras]);

  // Tìm camera mới nhất trong context để cập nhật realtime
  const currentDetailCamera =
    detailcamera &&
    (cameras.find((c) => String(c.id) === String(detailcamera.id)) ||
      detailcamera);

  const detailStats = currentDetailCamera
    ? getRatingStats(currentDetailCamera.ratings)
    : { average: 0, count: 0, formattedAvg: "0" };

  // Xử lý khi click vào ngôi sao
  const handleStarClick = (star) => {
    // 1. Chưa đăng nhập -> Hiện popup nhỏ nhắc đăng nhập
    if (!role) {
      setShowLoginPrompt(true);
      return;
    }

    // 2. Đăng nhập với role Admin -> Chặn không cho đánh giá
    if (role === "admin") {
      setAdminWarning(
        "Tài khoản Quản trị viên (Admin) không được phép tham gia đánh giá sản phẩm.",
      );
      return;
    }

    // 3. Đăng nhập role Customer (thành viên) -> Cho phép chọn số sao
    setSelectedRating(star);
    setAdminWarning("");
    setRatingMessage("");
  };

  // Xử lý gửi đánh giá
  const handleSubmitRating = async () => {
    // 1. Chưa đăng nhập
    if (!role) {
      setShowLoginPrompt(true);
      return;
    }

    // 2. Admin không được phép đánh giá
    if (role === "admin") {
      setAdminWarning(
        "Tài khoản Quản trị viên (Admin) không được phép tham gia đánh giá sản phẩm.",
      );
      return;
    }

    // 3. Customer gửi đánh giá
    if (!selectedRating || !currentDetailCamera) return;

    await handleRateCamera(currentDetailCamera.id, selectedRating);
    setRatingMessage(
      `Cảm ơn bạn đã đánh giá ${selectedRating} sao cho ${currentDetailCamera.name}!`,
    );
    setSelectedRating(0);
    setAdminWarning("");
  };

  // Chuyển hướng sang trang đăng nhập và ghi nhớ ID sản phẩm để quay lại
  const handleRedirectToLogin = () => {
    if (currentDetailCamera) {
      sessionStorage.setItem("returnToDetailId", currentDetailCamera.id);
      navigate("/login", {
        state: { returnToDetailId: currentDetailCamera.id },
      });
    } else {
      navigate("/login");
    }
  };

  const handleAddToCart = (s) => {
    if (!role) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    dispatch({
      type: "ADD",
      payload: {
        id: s.id,
        name: s.name,
        image: s.image,
        price: s.price,
      },
    });
    alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
  };

  return (
    <>
      <div className="cards py-3">
        <h3 style={{ color: "#f97316", textAlign: "center", fontWeight: 700 }}>
          Sản phẩm nổi bật
        </h3>

        <div>
          <Container>
            <Row className="gx-4 gy-4">
              {cameras.map((s) => {
                const stats = getRatingStats(s.ratings);

                return (
                  <Col key={s.id} lg={4} md={6} xs={12}>
                    <Card className="camera-card h-100 shadow-sm">
                      {/* Màu sắc sản phẩm */}
                      <div className="color-dots">
                        <span
                          className="dot"
                          style={{ backgroundColor: s.color }}
                        ></span>
                      </div>

                      <Card.Img
                        variant="top"
                        src={s.image}
                        alt={s.name}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenDetail(s)}
                      />

                      <Card.Body className="namecard d-flex flex-column justify-content-between">
                        <div>
                          <h6
                            style={{
                              fontWeight: 600,
                              fontSize: "16px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleOpenDetail(s)}
                          >
                            {s.name}
                          </h6>

                          {/* CHỈ ĐỂ GIÁ TIỀN */}
                          <h6 style={{ margin: "4px 0" }}>
                            Price:{" "}
                            <span style={{ color: "#ea580c", fontWeight: 600 }}>
                              {Number(s.price).toLocaleString("vi-VN")} VND
                            </span>
                          </h6>

                          {/* HIỂN THỊ ĐÁNH GIÁ THEO SỐ SAO THỰC TẾ */}
                          <div className="product-rating">
                            <div className="stars-wrapper">
                              {renderStars(stats.average)}
                            </div>
                            <span className="rating-text">
                              {stats.count > 0 ? (
                                <>
                                  <strong>{stats.formattedAvg}</strong>/5 sao{" "}
                                  <span className="rating-count">
                                    ({stats.count} đánh giá)
                                  </span>
                                </>
                              ) : (
                                "0/5 sao"
                              )}
                            </span>
                          </div>
                        </div>

                        {/* CÁC NÚT THAO TÁC */}
                        <div className="d-flex justify-content-end align-items-center gap-2 mt-2">
                          {/* NÚT XEM CHI TIẾT */}
                          <div className="iconFiChevron">
                            <button
                              type="button"
                              className="card-action-btn"
                              title="Xem chi tiết mô tả"
                              onClick={() => handleOpenDetail(s)}
                            >
                              <FiChevronRight size={22} color="#f97316" />
                            </button>
                          </div>

                          {/* NÚT THÊM VÀO GIỎ HÀNG */}
                          <div className="iconshoppingcart">
                            <button
                              type="button"
                              className="card-action-btn"
                              title="Thêm vào giỏ hàng"
                              onClick={() => handleAddToCart(s)}
                            >
                              <FiShoppingCart size={17} color="#1e293b" />
                            </button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </div>
      </div>

      {/* POPUP CHI TIẾT SẢN PHẨM: HIỂN THỊ MÔ TẢ CHI TIẾT & ĐÁNH GIÁ */}
      {showpopup && currentDetailCamera && (
        <div
          className="popup"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseDetail();
          }}
        >
          <div className="popup-content">
            {/* Nút đóng */}
            <button
              type="button"
              className="popup-close-btn"
              onClick={handleCloseDetail}
            >
              ✕
            </button>

            {/* Ảnh sản phẩm */}
            <img
              src={currentDetailCamera.image}
              alt={currentDetailCamera.name}
              className="popup-img"
            />

            {/* Thông tin cơ bản */}
            <div className="popup-header-info">
              <div>
                <h4 className="popup-title">{currentDetailCamera.name}</h4>
                <div className="popup-price">
                  {Number(currentDetailCamera.price).toLocaleString("vi-VN")} VND
                </div>
              </div>
            </div>

            {/* Màu sắc & Đánh giá hiện tại */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="popup-color-row mb-0">
                <span>Color:</span>
                <span
                  className="popup-color-dot"
                  style={{ backgroundColor: currentDetailCamera.color }}
                ></span>
                <small className="text-muted">({currentDetailCamera.color})</small>
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="stars-wrapper">
                  {renderStars(detailStats.average)}
                </div>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>
                  {detailStats.count > 0
                    ? `${detailStats.formattedAvg}/5 sao (${detailStats.count} lượt)`
                    : "0/5 sao (Chưa có đánh giá)"}
                </span>
              </div>
            </div>

            {/* PHẦN HIỂN THỊ MÔ TẢ CHI TIẾT SẢN PHẨM */}
            <div className="popup-desc-box">
              <div className="popup-section-title">Mô tả chi tiết sản phẩm</div>
              <p className="popup-desc-text">
                {currentDetailCamera.description ||
                  "Chưa có thông tin mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>

            {/* KHU VỰC ĐÁNH GIÁ (Chỉ Customer được đánh giá, Admin bị chặn) */}
            <div className="popup-rating-box">
              <div className="popup-section-title">
                Đánh giá sản phẩm:
              </div>

              {role === "admin" ? (
                <div className="admin-warning-badge">
                  ⚠️ Tài khoản Quản trị viên (Admin) không được phép tham gia đánh giá sản phẩm.
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="interactive-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="star-interactive-btn"
                          title={`${star} sao`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleStarClick(star)}
                        >
                          <FaStar
                            color={
                              (hoverRating || selectedRating) >= star
                                ? "#f59e0b"
                                : "#cbd5e1"
                            }
                            size={24}
                          />
                        </button>
                      ))}
                      {selectedRating > 0 && (
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#d97706",
                            marginLeft: "6px",
                          }}
                        >
                          {selectedRating}/5 sao
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn-submit-rating"
                      disabled={!selectedRating}
                      onClick={handleSubmitRating}
                    >
                      Gửi đánh giá
                    </button>
                  </div>

                  {ratingMessage && (
                    <div className="rating-success-msg">{ratingMessage}</div>
                  )}
                  {adminWarning && (
                    <div className="admin-warning-badge">⚠️ {adminWarning}</div>
                  )}
                </>
              )}
            </div>

            {/* HÀNH ĐỘNG DƯỚI CÙNG */}
            <div className="popup-actions">
              <button
                type="button"
                style={{
                  backgroundColor: "#0f172a",
                  color: "white",
                }}
                onClick={() => {
                  handleAddToCart(currentDetailCamera);
                  handleCloseDetail();
                }}
              >
                Thêm vào giỏ hàng
              </button>

              <button
                type="button"
                style={{
                  backgroundColor: "#f1f5f9",
                  color: "#334155",
                }}
                onClick={handleCloseDetail}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP NHỎ CẢNH BÁO: CHƯA ĐĂNG NHẬP KHI BẤM ĐÁNH GIÁ */}
      {showLoginPrompt && (
        <div
          className="login-prompt-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLoginPrompt(false);
          }}
        >
          <div className="login-prompt-box">
            <div className="login-prompt-icon">🔒</div>
            <h5 className="login-prompt-title">Yêu cầu đăng nhập</h5>
            <p className="login-prompt-msg">Vui lòng đăng nhập để đánh giá.</p>
            <div className="login-prompt-actions">
              {/* Nút 1: Đăng nhập -> điều hướng tới /login và nhớ sản phẩm để quay lại */}
              <button
                type="button"
                className="btn-prompt-login"
                onClick={handleRedirectToLogin}
              >
                Đăng nhập
              </button>

              {/* Nút 2: Thoát -> đóng popup nhỏ, quay lại đọc chi tiết sản phẩm */}
              <button
                type="button"
                className="btn-prompt-cancel"
                onClick={() => setShowLoginPrompt(false)}
              >
                Thoát
              </button>
            </div>

            <div style={{ marginTop: "14px", fontSize: "13px", color: "#64748b" }}>
              Chưa có tài khoản?{" "}
              <span
                style={{
                  color: "#f97316",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  if (currentDetailCamera) {
                    sessionStorage.setItem("returnToDetailId", currentDetailCamera.id);
                    navigate("/register", {
                      state: { returnToDetailId: currentDetailCamera.id },
                    });
                  } else {
                    navigate("/register");
                  }
                }}
              >
                Đăng ký thành viên
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
