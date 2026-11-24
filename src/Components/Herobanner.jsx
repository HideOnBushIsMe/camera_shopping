import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./Hero.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const cameraBg = "https://cdn.vjshop.vn/may-anh/mirrorless/canon/canon-eos-r/canon-eos-r.jpg";

const data = [
  {
    id: 1,
    image: "https://cdn.vjshop.vn/may-anh/mirrorless/canon/canon-eos-r100/lens-18-45mm/canon-eos-r100-lens-18-45mm-1500x1500.jpg"
  },
  {
    id: 2,
    image: "https://mayanh24h.com/upload/assets/2021/0417/ar/canon-eos-r3-1.jpg"
  },
  {
    id: 3,
    image: "https://mayanhhoangto.com/wp-content/uploads/2024/08/1721647870_IMG_2292928.jpeg"
  }
];

export default function Herobanner() {
  const navigate = useNavigate();
  const { role, user, isAdmin, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${cameraBg})`,
      }}
    >
      <Navbar expand="lg">
        <Container fluid className="d-flex justify-content-center">
          <Nav
            className="hero-nav bg-white p-3 rounded shadow-sm d-flex gap-4"
          >
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "black", fontWeight: 500 }}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              style={{ textDecoration: "none", color: "black", fontWeight: 500 }}
            >
              About
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/detail"
                style={{ textDecoration: "none", color: "black", fontWeight: 500 }}
              >
                Detail
              </NavLink>
            )}
            <NavLink
              to="/cart"
              style={{ textDecoration: "none", color: "black", fontWeight: 500 }}
            >
              Cart
            </NavLink>
            {role ? (
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {user?.name
                    ? `${user.name} (${isAdmin ? "Admin" : "Customer"})`
                    : isAdmin
                    ? "Login as Admin"
                    : "Login as Customer"}
                </span>
                <span
                  style={{ cursor: "pointer", color: "#dc3545", fontWeight: 500 }}
                  onClick={handleLogout}
                >
                  Logout
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <NavLink
                  to="/login"
                  style={{ textDecoration: "none", color: "black", fontWeight: 500 }}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  style={{ textDecoration: "none", color: "black", fontWeight: 500 }}
                >
                  Register
                </NavLink>
              </div>
            )}
          </Nav>
        </Container>
      </Navbar>

      <div className="hero-bottom-content">
        <div className="hero-title-box">
          <h1 className="hero-title">Canon</h1>
          <h3 className="hero-subtitle">
            Đỉnh cao thế giới máy ảnh kĩ thuật số
          </h3>
        </div>

        <div className="hero-images-container">
          {data.map((s) => (
            <div key={s.id} className="hero-img-item">
              <img src={s.image} alt="Canon camera preview" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
