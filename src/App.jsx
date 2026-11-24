import { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import './App.css'
import Home from './Home/Home'
import Detail from "./Detail/Detail";
import Login from "./AdminOrCustomer/Login";
import Register from "./AdminOrCustomer/Register";
import Cartshopping from "./ShoppingCart/Cartshopping";
import Cart from "./ShoppingCart/Cart";
import CameraApi from "./CameraApi";
import EditCamera from "./Detail/EditCamera";
import CreateCamera from "./Detail/CreateCamera";
import Footer from "./Components/Footer";
import About from "./Components/About";
import { AuthProvider, AuthContext } from "./AuthContext";

// Route bảo vệ dành riêng cho Admin
const AdminRoute = ({ children }) => {
  const { isAdmin, isInitializing } = useContext(AuthContext);

  // Đang trong 180ms bắt tay kiểm tra tab chủ
  if (isInitializing) {
    return null;
  }

  // Nếu không phải admin thì đá văng về trang chủ
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Modal thông báo phiên làm việc kết thúc đa tab (Cross-tab Logout hoặc Kick-out)
const SessionExpiredModal = () => {
  const { sessionInfo, dismissSessionInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!sessionInfo?.isOpen) return null;

  return (
    <div className="session-expired-overlay">
      <div className="session-expired-box">
        <div className="session-expired-icon">🔒</div>
        <h4>{sessionInfo.title}</h4>
        <p>{sessionInfo.message}</p>
        <div className="session-expired-actions">
          <button
            type="button"
            className="btn-expired-login"
            onClick={() => {
              dismissSessionInfo();
              navigate("/login");
            }}
          >
            Đăng nhập lại
          </button>
          <button
            type="button"
            className="btn-expired-home"
            onClick={() => {
              dismissSessionInfo();
              navigate("/");
            }}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <SessionExpiredModal />
          <CameraApi>
            <Cart>
              <div className="content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/detail" element={<AdminRoute><Detail /></AdminRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/cart" element={<Cartshopping />} />
                  <Route path="/detail/:id" element={<AdminRoute><EditCamera /></AdminRoute>} />
                  <Route path="/create" element={<AdminRoute><CreateCamera /></AdminRoute>} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </div>
              <Footer />
            </Cart>
          </CameraApi>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App
